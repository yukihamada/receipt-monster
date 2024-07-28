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
require('dotenv').config();

// 環境変数から秘密鍵を取得
const privateKey = process.env.SOLANA_PRIVATE_KEY;
const privateKeyBytes = bs58.decode(privateKey);
const fromKeypair = Keypair.fromSecretKey(privateKeyBytes);

// 本番ネットワークを使用
const connection = new Connection(clusterApiUrl('mainnet-beta'));

async function initializeProgram() {
    const programId = new PublicKey(process.env.SOLANA_PROGRAM_ID);
    const stateAccount = Keypair.generate();

    const instructionData = Buffer.from(Uint8Array.of(0, ...fromKeypair.publicKey.toBytes()));

    let transaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: fromKeypair.publicKey,
            newAccountPubkey: stateAccount.publicKey,
            lamports: await connection.getMinimumBalanceForRentExemption(40),
            space: 40,
            programId: programId,
        }),
        {
            keys: [
                { pubkey: stateAccount.publicKey, isSigner: true, isWritable: true },
            ],
            programId: programId,
            data: instructionData,
        }
    );

    try {
        let signature = await connection.sendTransaction(transaction, [fromKeypair, stateAccount]);
        console.log(`Transaction signature: ${signature}`);
        const confirmation = await connection.confirmTransaction(signature);
        console.log('Transaction confirmation:', confirmation);
        console.log(`State account public key: ${stateAccount.publicKey.toBase58()}`);
    } catch (error) {
        console.error('Transaction failed:', error);
    }
}

initializeProgram();