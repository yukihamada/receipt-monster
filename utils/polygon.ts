import { ethers } from 'ethers';

const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || '';
const POLYGON_PRIVATE_KEY = process.env.POLYGON_PRIVATE_KEY || '';
const POLYGON_CONTRACT_ADDRESS = process.env.POLYGON_CONTRACT_ADDRESS || '';

const ABI = [
  "function addTimestamp(string memory fileHash) public"
];

export async function addTimestampToPolygon(fileHash: string): Promise<string> {
  const provider = new ethers.JsonRpcProvider(POLYGON_RPC_URL);
  const signer = new ethers.Wallet(POLYGON_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(POLYGON_CONTRACT_ADDRESS, ABI, signer);

  const tx = await contract.addTimestamp(fileHash);
  const receipt = await tx.wait();

  return receipt.transactionHash;
}