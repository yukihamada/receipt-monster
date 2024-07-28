import { Receipt } from '../types'; // Receipt 型をインポート

export const getLabel = (key: keyof Receipt): string => {
  const labels: { [key in keyof Receipt]?: string } = {
    id: 'ID',
    timestamp: 'タイムスタンプ',
    amount: '金額',
    issuer: '発行者',
    imageUrl: '画像URL',
    noryoshusho: '領収書番号',
    category: 'カテゴリー',
    registrationNumber: '登録番号', // 追加のフィールド
    userId: 'ユーザーID',
    taxCategory: '税区分',
    issuerContact: '発行者連絡先',
    hash: 'ハッシュ',
    issuerAddress: '発行者住所',
    transactionDate: '取引日',
    serialNumber: 'シリアル番号',
    purpose: '目的',
    recipient: '受取人',
    uploadTime: 'アップロード時間',
    reducedTaxRate: '軽減税率',
  };
  return labels[key] || key as string;
};

export const addTimestamp = (receipt: Receipt): void => {
  receipt.timestamp = new Date().toISOString();
};
