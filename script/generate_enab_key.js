const { Worker, isMainThread, parentPort } = require('worker_threads');
const { Keypair } = require('@solana/web3.js');
const bs58 = require('bs58');
const crypto = require('crypto');
const os = require('os');

const prefixes = ['enabler', 'yukihamada', 'jiujitsu'];
const numCPUs = os.cpus().length;

function generateENABKey() {
  let attempts = 0;
  while (true) {
    attempts++;
    const seed = crypto.randomBytes(32);
    const keypair = Keypair.fromSeed(seed);
    const publicKey = keypair.publicKey.toBase58().toLowerCase();
    
    const matchedPrefix = prefixes.find(prefix => publicKey.startsWith(prefix));
    if (matchedPrefix) {
      const secretKey = keypair.secretKey;
      const base58PrivateKey = bs58.encode(Buffer.from(secretKey));
      return { attempts, publicKey: keypair.publicKey.toBase58(), privateKey: base58PrivateKey, matchedPrefix };
    }
    
    if (attempts % 1000000 === 0) {
      parentPort.postMessage({ type: 'progress', attempts });
    }
  }
}

if (isMainThread) {
  console.log(`${numCPUs}個のワーカーを起動します...`);
  let totalAttempts = 0;

  for (let i = 0; i < numCPUs; i++) {
    const worker = new Worker(__filename);
    worker.on('message', (message) => {
      if (message.type === 'progress') {
        totalAttempts += message.attempts;
        console.log(`総試行回数: ${totalAttempts}`);
      } else if (message.type === 'result') {
        console.log('見つかりました！');
        console.log('試行回数:', message.attempts);
        console.log('公開鍵 (アドレス):', message.publicKey);
        console.log('秘密鍵 (Base58):', message.privateKey);
        console.log('マッチしたプレフィックス:', message.matchedPrefix);
        process.exit(0);
      }
    });
  }
} else {
  const result = generateENABKey();
  parentPort.postMessage({ type: 'result', ...result });
}