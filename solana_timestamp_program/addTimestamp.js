require('dotenv').config({ path: '../.env.local' });
const {
    Connection,
    PublicKey,
    Keypair,
    clusterApiUrl,
    Transaction,
    SystemProgram,
} = require('@solana/web3.js');
const bs58 = require('bs58');
const borsh = require('borsh');

class ProgramState {
  constructor(properties) {
    this.admin = new PublicKey(properties.admin);
    this.record_count = properties.record_count;
  }

  static schema = new Map([
    [ProgramState, {
      kind: 'struct',
      fields: [
        ['admin', [32]],
        ['record_count', 'u64']
      ]
    }]
  ]);

  static deserialize(data) {
    const buffer = Buffer.from(data);
    const { admin, record_count } = borsh.deserialize(
      this.schema,
      ProgramState,
      buffer
    );
    return new ProgramState({ admin, record_count });
  }
}

// 環境変数から秘密鍵とプログラムIDを取得
const privateKey = process.env.SOLANA_PRIVATE_KEY;
const programId = process.env.SOLANA_PROGRAM_ID;

// デバッグ用ログ
console.log('SOLANA_PRIVATE_KEY:', privateKey);
console.log('SOLANA_PROGRAM_ID:', programId);

if (!privateKey || !programId) {
    throw new Error('環境変数が正しく設定されていません。');
}

const privateKeyBytes = bs58.decode(privateKey);
const fromKeypair = Keypair.fromSecretKey(privateKeyBytes);
const programPublicKey = new PublicKey(programId);

// 本番ネットワークを使用
const connection = new Connection(clusterApiUrl('mainnet-beta'));

// ランダムな32バイトのファイルハッシュを生成し、Base58エンコード
function generateRandomFileHash() {
    const fileHash = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
        fileHash[i] = Math.floor(Math.random() * 256);
    }
    return bs58.encode(fileHash);
}

const PROGRAM_STATE_SIZE = 40; // 32 bytes for admin + 8 bytes for record_count
const TIMESTAMP_RECORD_SIZE = 40; // 32 bytes for file_hash + 8 bytes for timestamp

async function initializeProgram() {
    const stateAccount = Keypair.generate();
    const instructionData = Buffer.from(Uint8Array.of(0, ...fromKeypair.publicKey.toBytes()));

    let transaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: fromKeypair.publicKey,
            newAccountPubkey: stateAccount.publicKey,
            lamports: await connection.getMinimumBalanceForRentExemption(PROGRAM_STATE_SIZE),
            space: PROGRAM_STATE_SIZE,
            programId: programPublicKey,
        }),
        {
            keys: [
                { pubkey: stateAccount.publicKey, isSigner: true, isWritable: true },
                { pubkey: fromKeypair.publicKey, isSigner: true, isWritable: false },
            ],
            programId: programPublicKey,
            data: instructionData,
        }
    );

    try {
        let signature = await connection.sendTransaction(transaction, [fromKeypair, stateAccount]);
        console.log(`Initialization transaction signature: ${signature}`);
        await connection.confirmTransaction(signature);
        console.log(`Program initialized. State account: ${stateAccount.publicKey.toBase58()}`);
        return stateAccount.publicKey;
    } catch (error) {
        console.error('Initialization failed:', error);
        throw error;
    }
}

async function addTimestamp(fileHash) {
    const timestampAccount = Keypair.generate();
    const fileHashBytes = bs58.decode(fileHash);
    const instructionData = Buffer.from(Uint8Array.of(1, ...fileHashBytes));

    let transaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: fromKeypair.publicKey,
            newAccountPubkey: timestampAccount.publicKey,
            lamports: await connection.getMinimumBalanceForRentExemption(TIMESTAMP_RECORD_SIZE),
            space: TIMESTAMP_RECORD_SIZE,
            programId: programPublicKey,
        }),
        {
            keys: [
                { pubkey: stateAccountPubkey, isSigner: false, isWritable: true },
                { pubkey: timestampAccount.publicKey, isSigner: true, isWritable: true },
                { pubkey: fromKeypair.publicKey, isSigner: true, isWritable: false },
            ],
            programId: programPublicKey,
            data: instructionData,
        }
    );

    try {
        let signature = await connection.sendTransaction(transaction, [fromKeypair, timestampAccount]);
        console.log(`Transaction signature: ${signature}`);
        const confirmation = await connection.confirmTransaction(signature);
        console.log('Transaction confirmation:', confirmation);
        console.log(`Timestamp account public key: ${timestampAccount.publicKey.toBase58()}`);
    } catch (error) {
        console.error('Transaction failed:', error);
        if (error.logs) {
            console.error('Transaction logs:', error.logs);
        }
    }
}

async function checkStateAccount() {
    try {
        const accountInfo = await connection.getAccountInfo(stateAccountPubkey);
        if (accountInfo === null) {
            console.log('ステートアカウントが見つかりません');
            return;
        }
        console.log('アカウントデータ長:', accountInfo.data.length);
        console.log('アカウントデータ (hex):', Buffer.from(accountInfo.data).toString('hex'));
        
        const state = ProgramState.deserialize(accountInfo.data);
        console.log('ステートアカウントの管理者:', state.admin.toBase58());
        console.log('レコード数:', state.record_count.toString());
        console.log('期待される管理者 (fromKeypair):', fromKeypair.publicKey.toBase58());
    } catch (error) {
        console.error('ステートアカウントの確認中にエラーが発生しました:', error);
        console.error('エラーの詳細:', error.message);
        
        // 手動でデータを解析
        if (accountInfo && accountInfo.data) {
            const adminBytes = accountInfo.data.slice(0, 32);
            const recordCountBytes = accountInfo.data.slice(32);
            console.log('管理者 (手動解析):', new PublicKey(adminBytes).toBase58());
            console.log('レコード数 (手動解析):', Buffer.from(recordCountBytes).readBigUInt64LE().toString());
        }
    }
}

let stateAccountPubkey;
async function main() {
    stateAccountPubkey = await initializeProgram();
    console.log(`State account public key: ${stateAccountPubkey.toBase58()}`);

    const fileHash = generateRandomFileHash();
    console.log('Generated file hash:', fileHash);
    await addTimestamp(fileHash);

    await checkStateAccount();
}

main().catch(console.error);