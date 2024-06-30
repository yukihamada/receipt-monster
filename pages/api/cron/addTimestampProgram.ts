import { VercelRequest, VercelResponse } from '@vercel/node';
import { Keypair, Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import bs58 from 'bs58';
import { db } from '../../../firebase'; // Firestoreのインスタンスをインポート
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const SOLANA_PROGRAM_ID = process.env.SOLANA_PROGRAM_ID;
const secretKeyString = process.env.SOLANA_PRIVATE_KEY;

if (!secretKeyString) {
  throw new Error('SOLANA_PRIVATE_KEY is not defined');
}

const secretKey = bs58.decode(secretKeyString);
const defaultSigner = Keypair.fromSecretKey(secretKey);

const connection = new Connection('https://api.mainnet-beta.solana.com');

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { receiptId } = req.body;

    if (!receiptId) {
      return res.status(400).send('receiptId is required');
    }

    // Firestoreからレシートデータを取得
    const receiptRef = doc(db, 'receipts', receiptId);
    const receiptDoc = await getDoc(receiptRef);

    if (!receiptDoc.exists()) {
      return res.status(404).send('Receipt not found');
    }

    const receiptData = receiptDoc.data();

    if (receiptData.solanaTransaction) {
      return res.status(200).send('Solana transaction already exists');
    }

    // Solanaトランザクションを作成
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: defaultSigner.publicKey,
        toPubkey: new PublicKey(SOLANA_PROGRAM_ID!), // SOLANA_PROGRAM_IDがundefinedでないことを保証
        lamports: 1, // 1 lamportを送信
      })
    );

    const signature = await connection.sendTransaction(transaction, [defaultSigner]);
    await connection.confirmTransaction(signature);

    // FirestoreにトランザクションIDを保存
    await updateDoc(receiptRef, { solanaTransaction: signature });

    res.status(200).send({ transactionId: signature });
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    res.status(500).send(`Error: ${error.message}`);
  }
};
