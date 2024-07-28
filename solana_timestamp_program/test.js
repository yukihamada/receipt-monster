const {
    Connection,
    PublicKey,
    Keypair,
    clusterApiUrl,
    Transaction,
    SystemProgram,
} = require('@solana/web3.js');
const bs58 = require('bs58'); // Make sure to install bs58 using npm or yarn

// 直接埋め込まれた秘密鍵（Base58形式）
const privateKey = 'EuB2UCbenDwdJwoqxLyxaRrdfCz2VCchHHiN9YmHLimMjRKV3K355CKDTZc6eqoGAr4n4HtiT8Y1y8HcDqdC26f';
const privateKeyBytes = bs58.decode(privateKey);
const fromKeypair = Keypair.fromSecretKey(privateKeyBytes);

// 本番ネットワークを使用
const connection = new Connection(clusterApiUrl('mainnet-beta'));

async function checkBalanceAndSendTransaction() {
    // 残高を取得して表示
    const balance = await connection.getBalance(fromKeypair.publicKey);
    console.log(`残高: ${balance} lamports`);

    if (balance < 1000) {
        console.log('残高が不足しています。トランザクションを送信するには、少なくとも1000 lamportsが必要です。');
        return;
    }

    const programId = new PublicKey('F7QP1YViJJp7wB5gqfpzvDygPrRgxEb9FDgiHeERpHrm');
    const toPublicKey = new PublicKey('CJCDYFc1eu5kx5pri4aCkdJNnZkomUaH9sW5dzNB5nTD');

    // 最新のブロックハッシュを取得
    const { blockhash } = await connection.getRecentBlockhash();

    let transaction = new Transaction({ recentBlockhash: blockhash, feePayer: fromKeypair.publicKey }).add(
        SystemProgram.transfer({
            fromPubkey: fromKeypair.publicKey,
            toPubkey: toPublicKey,
            lamports: 1000, // 0.000001 SOL
        }),
    );

    try {
        let signature = await connection.sendTransaction(transaction, [fromKeypair]);
        console.log(`Transaction signature: ${signature}`);
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

checkBalanceAndSendTransaction();