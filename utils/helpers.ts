import { Receipt } from '../components/types'; // Receipt 型をインポート

export const getLabel = (key: keyof Receipt): string => {
  const labels: { [key in keyof Receipt]?: string } = {
    id: 'ID',
    timestamp: 'タイムスタンプ',
    amount: '金額',
    issuer: '発行者',
    imageUrl: '画像URL',
    imageOrientation: '画像の向き',
    noryoshusho: '領収書番号',
    category: 'カテゴリー', // 追加のフィールド
    description: '説明', // 追加のフィールド
    // ここに他のフィールドを追加
  };
  return labels[key] || '不明';
};

export const addTimestamp = (receipt: Receipt): void => {
  receipt.timestamp = new Date().toISOString();
};
