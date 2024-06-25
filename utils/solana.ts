import * as web3 from '@solana/web3.js';

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const SOLANA_PRIVATE_KEY = process.env.SOLANA_PRIVATE_KEY || '';
const SOLANA_PROGRAM_ID = process.env.SOLANA_PROGRAM_ID || '';

export async function addTimestampToSolana(fileHash: string): Promise<string> {
  const connection = new web3.Connection(SOLANA_RPC_URL, 'confirmed');
  const payer = web3.Keypair.fromSecretKey(Buffer.from(SOLANA_PRIVATE_KEY, 'hex'));
  const programId = new web3.PublicKey(SOLANA_PROGRAM_ID);

  const data = Buffer.alloc(1 + 32);
  data.writeUInt8(1, 0); // 1 は AddTimestamp 命令を表す
  Buffer.from(fileHash, 'hex').copy(data, 1);

  const [statePubkey] = await web3.PublicKey.findProgramAddress(
    [Buffer.from('state')],
    programId
  );

  const timestampKeypair = web3.Keypair.generate();

  const instruction = new web3.TransactionInstruction({
    keys: [
      { pubkey: statePubkey, isSigner: false, isWritable: true },
      { pubkey: timestampKeypair.publicKey, isSigner: true, isWritable: true },
      { pubkey: payer.publicKey, isSigner: true, isWritable: false },
      { pubkey: web3.SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId,
    data: data,
  });

  const transaction = new web3.Transaction().add(instruction);
  const signature = await web3.sendAndConfirmTransaction(connection, transaction, [payer, timestampKeypair]);

  return signature;
}