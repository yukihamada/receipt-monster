import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey, Transaction, TransactionInstruction, Keypair, SystemProgram, SendTransactionError } from '@solana/web3.js';
import * as borsh from 'borsh';
import { adminDb } from '../../firebase-admin';
import bs58 from 'bs58';
import crypto from 'crypto';
import axios from 'axios';

const SOLANA_PROGRAM_ID = process.env.SOLANA_PROGRAM_ID!;
const SOLANA_PRIVATE_KEY = process.env.SOLANA_PRIVATE_KEY!;
const connection = new Connection('https://api.mainnet-beta.solana.com');

class ProgramState {
  admin: PublicKey;
  record_count: bigint;

  constructor(properties: { admin: Uint8Array; record_count: bigint }) {
    this.admin = new PublicKey(properties.admin);
    this.record_count = properties.record_count;
  }

  static schema: borsh.Schema = {
    struct: {
      admin: { array: { type: 'u8', len: 32 } },
      record_count: 'u64'
    }
  };

  static deserialize(data: Buffer): ProgramState {
    const deserializedData = borsh.deserialize(
      this.schema,
      data
    );
    return new ProgramState(deserializedData as { admin: Uint8Array; record_count: bigint });
  }
}

const PROGRAM_STATE_SIZE = 40; // 32 bytes for admin + 8 bytes for record_count
const TIMESTAMP_RECORD_SIZE = 40; // 32 bytes for file_hash + 8 bytes for timestamp

// BASE58エンコードされた秘密鍵からKeypairを生成
const signer = Keypair.fromSecretKey(bs58.decode(SOLANA_PRIVATE_KEY));

const addHashToSolana = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'メソッドが許可されていません' });
  }

  let stateAccountPubkey: PublicKey | undefined;

  try {
    const { receiptId } = req.body;

    let receiptsToProcess = [];

    if (receiptId) {
      // 特定のレシートを処理
      const receiptRef = adminDb.collection('receipts').doc(receiptId);
      const receiptDoc = await receiptRef.get();
      
      if (!receiptDoc.exists) {
        return res.status(404).json({ error: 'レシートが見つかりません' });
      }
      
      receiptsToProcess.push({ id: receiptId, data: receiptDoc.data() });
    } else {
      // すべてのレシートを処理
      const receiptsSnapshot = await adminDb.collection('receipts').get();
      receiptsToProcess = receiptsSnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
    }

    const processedReceipts = [];

    for (const receipt of receiptsToProcess) {
      let { hash, imageUrl } = receipt.data as { hash?: string; imageUrl?: string };
      if (!hash && imageUrl) {
        // 画像からハッシュを生成
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(imageResponse.data, 'binary');
        hash = crypto.createHash('sha256').update(imageBuffer).digest('hex');

        // ハッシュをDBに保存
        await adminDb.collection('receipts').doc(receipt.id).update({ hash });
      }

      if (!hash) {
        console.error(`レシート ${receipt.id} にハッシュがありません`);
        continue;
      }

      const fileHashBytes = Buffer.from(hash, 'hex');
      const timestampAccount = Keypair.generate();
      const instructionData = Buffer.from([1, ...fileHashBytes]);

      // state_accountのパブリックキーを生成（プログラムIDから派生）
      try {
        [stateAccountPubkey] = await PublicKey.findProgramAddress(
          [Buffer.from("state")],
          new PublicKey(SOLANA_PROGRAM_ID)
        );
        console.log('生成されたstate_accountのアドレス:', stateAccountPubkey.toBase58());
      } catch (e) {
        console.error('state_accountの生成に失敗しました:', e);
        throw e;
      }

      // state_accountの存在確認
      const stateAccountInfo = await connection.getAccountInfo(stateAccountPubkey);
      if (!stateAccountInfo) {
        console.log('state_accountが存在しません。プログラムの初期化が必要です。');
        // ここでプログラムの初期化を行う関数を呼び出す
        // await initializeProgram(connection, signer, SOLANA_PROGRAM_ID);
      } else {
        console.log('state_accountが存在します。所有者:', stateAccountInfo.owner.toBase58());
      }

      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: signer.publicKey,
          newAccountPubkey: timestampAccount.publicKey,
          lamports: await connection.getMinimumBalanceForRentExemption(TIMESTAMP_RECORD_SIZE),
          space: TIMESTAMP_RECORD_SIZE,
          programId: new PublicKey(SOLANA_PROGRAM_ID),
        }),
        new TransactionInstruction({
          keys: [
            { pubkey: stateAccountPubkey, isSigner: false, isWritable: true },
            { pubkey: timestampAccount.publicKey, isSigner: true, isWritable: true },
            { pubkey: signer.publicKey, isSigner: true, isWritable: false },
          ],
          programId: new PublicKey(SOLANA_PROGRAM_ID),
          data: instructionData,
        })
      );

      try {
        const signature = await connection.sendTransaction(transaction, [signer, timestampAccount]);
        console.log('Transaction sent:', signature);
        
        const confirmation = await connection.confirmTransaction(signature, 'confirmed');
        console.log('Transaction confirmation:', confirmation);

        // トランザクション成功後、Firestoreの更新
        await adminDb.collection('receipts').doc(receipt.id).update({
          solanaTransactionHash: signature,
          solanaTimestampAccount: timestampAccount.publicKey.toBase58(),
        });

        processedReceipts.push({ 
          id: receipt.id, 
          transactionHash: signature,
          timestampAccount: timestampAccount.publicKey.toBase58()
        });
      } catch (error) {
        if (error instanceof SendTransactionError) {
          console.error('トランザクションエラー:', error.message);
          console.error('トランザクションログ:', error.logs);
        } else {
          console.error('予期せぬエラー:', error);
        }
        throw error;
      }
    }

    res.status(200).json({ 
      message: 'ハッシュが正常に登録されました', 
      processedReceipts 
    });
  } catch (error: any) {
    console.error('詳細なエラー情報:', error);
    let errorMessage = 'サーバーエラー';
    let errorLogs: string[] = [];
    
    if (error instanceof SendTransactionError) {
      errorMessage = `トランザクションエラー: ${error.message}`;
      errorLogs = error.logs || [];
    }
    
    if (error.message.includes('custom program error: 0x3')) {
      errorMessage = 'プログラム実行エラー: カスタムエラー0x3 - プログラムの初期化が必要かもしれません';
    }
    
    res.status(500).json({ 
      error: errorMessage, 
      logs: errorLogs,
      walletAddress: signer.publicKey.toString(),
      programId: SOLANA_PROGRAM_ID,
      stateAccount: stateAccountPubkey ? stateAccountPubkey.toBase58() : 'Not available'
    });
  }
};

export default addHashToSolana;