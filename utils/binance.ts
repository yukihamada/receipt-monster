import { ethers } from 'ethers';

const BINANCE_RPC_URL = process.env.BINANCE_RPC_URL || '';
const BINANCE_PRIVATE_KEY = process.env.BINANCE_PRIVATE_KEY || '';
const BINANCE_CONTRACT_ADDRESS = process.env.BINANCE_CONTRACT_ADDRESS || '';

const ABI = [
  "function addTimestamp(string memory fileHash) public"
];

export async function addTimestampToBinance(fileHash: string): Promise<string> {
  const provider = new ethers.JsonRpcProvider(BINANCE_RPC_URL);
  const signer = new ethers.Wallet(BINANCE_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(BINANCE_CONTRACT_ADDRESS, ABI, signer);

  const tx = await contract.addTimestamp(fileHash);
  const receipt = await tx.wait();

  return receipt.transactionHash;
}