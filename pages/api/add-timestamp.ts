import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import * as web3 from '@solana/web3.js';

interface BlockchainConfig {
  rpcUrl: string;
  privateKey: string;
  contractAddress: string;
}

const blockchainConfigs: Record<string, BlockchainConfig> = {
  polygon: {
    rpcUrl: process.env.POLYGON_RPC_URL!,
    privateKey: process.env.POLYGON_PRIVATE_KEY!,
    contractAddress: process.env.POLYGON_CONTRACT_ADDRESS!,
  },
  ethereum: {
    rpcUrl: process.env.ETHEREUM_RPC_URL!,
    privateKey: process.env.ETHEREUM_PRIVATE_KEY!,
    contractAddress: process.env.ETHEREUM_CONTRACT_ADDRESS!,
  },
  binance: {
    rpcUrl: process.env.BINANCE_RPC_URL!,
    privateKey: process.env.BINANCE_PRIVATE_KEY!,
    contractAddress: process.env.BINANCE_CONTRACT_ADDRESS!,
  },
  solana: {
    rpcUrl: process.env.SOLANA_RPC_URL!,
    privateKey: process.env.SOLANA_PRIVATE_KEY!,
    contractAddress: process.env.SOLANA_PROGRAM_ID!,
  },
};

async function addTimestampToEVMBlockchain(blockchain: string, fileHash: string): Promise<string> {
  const config = blockchainConfigs[blockchain];
  if (!config) {
    throw new Error(`Unsupported blockchain: ${blockchain}`);
  }

  const provider = new ethers.JsonRpcProvider(config.rpcUrl);
  const wallet = new ethers.Wallet(config.privateKey, provider);

  const contract = new ethers.Contract(
    config.contractAddress,
    ['function addTimestamp(string memory fileHash) public'],
    wallet
  );

  const tx = await contract.addTimestamp(fileHash);
  const receipt = await tx.wait();

  return receipt.transactionHash;
}

async function addTimestampToSolana(fileHash: string): Promise<string> {
  const config = blockchainConfigs.solana;
  const connection = new web3.Connection(config.rpcUrl, 'confirmed');
  const payer = web3.Keypair.fromSecretKey(Buffer.from(config.privateKey, 'hex'));
  const programId = new web3.PublicKey(config.contractAddress);

  // 単純なバッファエンコーディングを使用
  const data = Buffer.alloc(1 + 32); // 1 byte for instruction, 32 bytes for hash
  data.writeUInt8(1, 0); // 1 は AddTimestamp 命令を表す
  Buffer.from(fileHash, 'hex').copy(data, 1);

  // プログラムの状態アカウントを取得
  const [statePubkey] = await web3.PublicKey.findProgramAddress(
    [Buffer.from('state')],
    programId
  );

  // タイムスタンプアカウントを生成
  const timestampKeypair = web3.Keypair.generate();

  const transaction = new web3.Transaction().add(
    new web3.TransactionInstruction({
      keys: [
        { pubkey: statePubkey, isSigner: false, isWritable: true },
        { pubkey: timestampKeypair.publicKey, isSigner: true, isWritable: true },
        { pubkey: payer.publicKey, isSigner: true, isWritable: false },
        { pubkey: web3.SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId,
      data: data,
    })
  );

  const signature = await web3.sendAndConfirmTransaction(
    connection, 
    transaction, 
    [payer, timestampKeypair]
  );
  return signature;
}

async function addTimestampToBlockchain(blockchain: string, fileHash: string): Promise<string> {
  if (blockchain === 'solana') {
    return addTimestampToSolana(fileHash);
  } else {
    return addTimestampToEVMBlockchain(blockchain, fileHash);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { fileHash } = req.body;

  if (!fileHash) {
    return res.status(400).json({ message: 'File hash is required' });
  }

  const targetBlockchains = ['solana', 'polygon', 'binance'];

  try {
    const results = await Promise.all(
      targetBlockchains.map(async (blockchain) => {
        try {
          const transactionHash = await addTimestampToBlockchain(blockchain, fileHash);
          return {
            blockchain,
            success: true,
            transactionHash
          };
        } catch (error) {
          console.error(`Error adding timestamp to ${blockchain}:`, error);
          return { blockchain, success: false, error: (error as Error).message };
        }
      })
    );

    res.status(200).json({ message: 'Timestamps added', results });
  } catch (error) {
    console.error('Error adding timestamps:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
