import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { fileTypeFromBuffer } from 'file-type';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Cloudflare API設定
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

export const config = {
  api: {
    bodyParser: false, // formidableを使用するため、bodyParserを無効にします
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err: any, fields: formidable.Fields, files: formidable.Files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(500).json({ error: 'Error parsing form' });
      }

      const image = Array.isArray(files.image) ? files.image[0] : files.image;

      if (!image) {
        return res.status(400).json({ error: 'Missing required fields: image' });
      }

      try {
        const buffer = fs.readFileSync(image.filepath);
        const type = await fileTypeFromBuffer(buffer);

        let processedImage: Buffer;

        processedImage = buffer;

        // ファイルのハッシュを生成
        const hash = crypto.createHash('sha256').update(processedImage).digest('hex');

        // Cloudflareに画像をアップロード
        const imageUrl = await uploadToCloudflare(processedImage, image.originalFilename ?? 'default_filename.jpg');

        const prompt = `以下のレシートの画像から以下の情報を抽出してください:

        • 取引日（取引が行われた日付）
        • 宛名（支払いを行った人または組織の名前）
        • 金額（取引における支払いの総額）
        • 通貨単位（JPY,USDなど）
        • 但し書き（支払いが行われた商品やサービスの取引内容）
        • 発行者名（領収書を発行する事業者の名前）
        • 発行者の住所・連絡先
        • 発者の登録番号（法人番号など）
        • 税区分（消費税など）
        • 軽減税率の適用（該当する場合）
        • 通し番号（透明性を高めるために推奨）        
        領収書の写真でない場合には、以下のように返答してください。
        • [NORYOSHUSHO]: 領収書の写真ではありませんと描いた上で写真の中身を詳に説明してくださ��。
        `;

        const result = await processWithGPT4(imageUrl, prompt);

        // imageUrlとhashをresultに追加
        const uploadTime = new Date().toISOString();
        const finalResult = { ...result, imageUrl, hash, uploadTime };

        return res.status(200).json(finalResult);
      } catch (error) {
        console.error('Error processing image:', error as Error);
        return res.status(500).json({ error: (error as Error).message });
      } finally {
        fs.unlinkSync(image.filepath); // 一時ファイルを削除
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

const convertHeicToJpeg = async (inputBuffer: Buffer): Promise<Buffer> => {
  try {
    return await sharp(inputBuffer)
      .toFormat('jpeg')
      .toBuffer(); // 修正: toDataURL() を toBuffer() に変更
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('HEIC画像の変換中にエラーが発生しました: ' + (error as Error).message);
  }
};

async function uploadToCloudflare(buffer: Buffer, filename: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', new Blob([buffer]), filename);

  try {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudflare upload error:', errorText);
      throw new Error(`Failed to upload image to Cloudflare: ${errorText}`);
    }

    const result = await response.json();
    console.log('Cloudflare upload result:', result); // ログに表示
    return result.result.variants[0]; // Cloudflareの画像URLを返す
  } catch (error) {
    console.error('Error during Cloudflare upload:', error);
    throw new Error('Failed to upload image to Cloudflare');
  }
}

async function processWithGPT4(imageUrl: string, prompt: string): Promise<any> {
  const response1 = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant designed to output JSON.',
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', "image_url": { url: imageUrl } }
        ],
      },
    ],
    max_tokens: 1000,
  });

  const jsonPrompt = `Please convert the following text to a JSON object with the following format:
  {
    "transactionDate": "ex - 2023-01-01", // 取引日（取引が行われた日付）
    "recipient": "ex - 株式会社エクセル", // 宛名（支払いを行った人または組織の名前）
    "amount": "ex - 50000", // 金額（取引における支払いの総額）半角数字
    "currency": "ex - JPY", // 通貨単位（JPY,USDなど）
    "purpose": "ex - 業務用備品購入費として", // 但し書き（支払いが行われた商品やサービスの取引内容の要約）
    "issuer": "ex - 株式会社サンプル商事", // 発行名（領収書を発行する事業者の名前）
    "issuerAddress": "ex - 東京都渋谷区1-1-1", // 発行者の住所・絡先
    "issuerContact": "ex - 03-1234-5678", // 発行者の連絡先
    "registrationNumber": "ex - 123456", // 発行者の登録番号（法人番号など）
    "taxCategory": "ex - 10%", // 税区分（消費税など）
    "reducedTaxRate": "ex - 適用なし", // 軽減税率の適用（該当する場合）
    "serialNumber": "ex - 0001", // 通し番（透明性を高めるために推奨）
    "noryoshusho": "" // 領収書の写真でない場合には、noryoshushoに写真の詳細を描いてください
  }: ${response1.choices[0].message.content}`;

  const response2 = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant designed to output JSON.',
      },
      {
        role: 'user',
        content: jsonPrompt,
      },
    ],
    response_format: { type: 'json_object' },
    max_tokens: 1000,
  });

  const result = JSON.parse(response2.choices[0].message?.content ?? '{}');
  return result;
}
