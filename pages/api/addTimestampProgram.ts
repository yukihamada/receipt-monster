import { VercelRequest, VercelResponse } from '@vercel/node';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import fetch from 'node-fetch'; // Added this line to import fetch

// Firebaseの初期化
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const fileName = 'solana_timestamp_program.so';
const localFilePath = path.join('/tmp', fileName);

// .env.localから秘密鍵を取得してキーペアを生成
const secretKeyString = process.env.SOLANA_PRIVATE_KEY;
if (!secretKeyString) {
  throw new Error('SOLANA_PRIVATE_KEY is not defined');
}
const secretKey = bs58.decode(secretKeyString);
const defaultSigner = Keypair.fromSecretKey(secretKey);

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    // Firebase StorageからファイルのダウンロードURLを取得
    const fileRef = ref(storage, fileName);
    const fileUrl = await getDownloadURL(fileRef);

    // ファイルをローカルにダウンロード
    const response = await fetch(fileUrl);
    if (!response.body) {
      throw new Error('Response body is null');
    }
    const fileStream = fs.createWriteStream(localFilePath);
    await new Promise((resolve, reject) => {
      response.body!.pipe(fileStream); // Added '!' to assert non-null
      response.body!.on('error', reject); // Added '!' to assert non-null
      fileStream.on('finish', resolve);
    });

    // Solanaプログラムをデプロイ
    const keypairPath = path.join('/tmp', 'default_signer.json');
    fs.writeFileSync(keypairPath, JSON.stringify(Array.from(secretKey)));
    exec(`solana program deploy ${localFilePath} --keypair ${keypairPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).send(`Error: ${error.message}`);
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      res.status(200).send('Solana program deployed successfully');
    });
  } catch (error: any) { // 'any' 型にキャスト
    console.error(`Error: ${(error as Error).message}`); // 'Error' 型にキャスト
    res.status(500).send(`Error: ${(error as Error).message}`);
  }
};