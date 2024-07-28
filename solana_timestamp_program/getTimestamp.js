require('dotenv').config({ path: '../.env.local' });
const {
    Connection,
    PublicKey,
    Keypair,
    clusterApiUrl,
    Transaction,
} = require('@solana/web3.js');
const bs58 = require('bs58');

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

async function getTimestamp(fileHash) {
    const timestampAccount = new PublicKey('CU8NuWcXdxF4Xk2fDQQBFjEiWpRJ4EDP4x4LqN6RsTNu'); // ここを正しい公開鍵に置き換える

    const fileHashBytes = bs58.decode(fileHash);
    const instructionData = Buffer.from(Uint8Array.of(2, ...fileHashBytes));

    let transaction = new Transaction().add({
        keys: [
            { pubkey: timestampAccount, isSigner: false, isWritable: false },
        ],
        programId: programPublicKey,
        data: instructionData,
    });

    try {
        let signature = await connection.sendTransaction(transaction, [fromKeypair]);
        console.log(`Transaction signature: ${signature}`);
        const confirmation = await connection.confirmTransaction(signature);
        console.log('Transaction confirmation:', confirmation);

        // トランザクションの詳細を取得
        const transactionDetails = await connection.getParsedConfirmedTransaction(signature);
        console.log('Transaction details:', JSON.stringify(transactionDetails, null, 2));
    } catch (error) {
        console.error('Transaction failed:', error);
        if (error.logs) {
            console.error('Transaction logs:', error.logs);
        }
        // 追加のデバッグ情報
        const logs = await connection.getConfirmedTransaction(error.signature);
        console.error('Confirmed transaction logs:', logs);
    }
}

// 例として、Base58エンコードされたファイルハッシュを使用
const fileHash = '4uQUzP4LGuyJdPWZVipZU4TiqBzmoTcmk2EcA6Uom4V3he2H8pCbutumoHwrdjCTC9DHW7hvgxePFrjbDw2UsDAi';
getTimestamp(fileHash);
