const { Keypair } = require('@solana/web3.js');
const bs58 = require('bs58');

function generateAndDisplayKey() {
  try {
    const keypair = Keypair.generate();
    const secretKey = keypair.secretKey;
    const base58PrivateKey = bs58.encode(Buffer.from(secretKey));

    console.log('新しい秘密鍵（Base58）:', base58PrivateKey);
    console.log('公開鍵:', keypair.publicKey.toBase58());
  } catch (error) {
    console.error('鍵の生成中にエラーが発生しました:', error);
  }
}

generateAndDisplayKey();