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

async function addTimestamp(fileHash) {
    const stateAccount = new PublicKey('6bPer65JvwtfgcAZ7vm4Y7gAvGzry41PE7NzvepqzM1J'); // ここを正しい公開鍵に置き換える
    const timestampAccount = Keypair.generate();

    const fileHashBytes = bs58.decode(fileHash);
    const instructionData = Buffer.from(Uint8Array.of(1, ...fileHashBytes));

    let transaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: fromKeypair.publicKey,
            newAccountPubkey: timestampAccount.publicKey,
            lamports: await connection.getMinimumBalanceForRentExemption(40),
            space: 40,
            programId: programPublicKey,
        }),
        {
            keys: [
                { pubkey: stateAccount, isSigner: false, isWritable: true },
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
    }
}

// ランダムなファイルハッシュを生成して使用
const fileHash1 = generateRandomFileHash();
console.log('Generated file hash:', fileHash1);
addTimestamp(fileHash1);
