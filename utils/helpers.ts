import { Receipt } from '../components/types'; // Receipt 型をインポート

export const getLabel = (key: keyof Receipt): string => { // 修正箇所
  const labels: { [key in keyof Receipt]?: string } = { // 修正箇所
    'id': 'ID',
    'timestamp': 'タイムスタンプ',
    'amount': '金額',
    'issuer': '発行者',
    'imageUrl': '画像URL',
    'imageOrientation': '画像の向き',
    'noryoshusho': '領収書',
    // 他のラベルをここに追加
  };
  return labels[key] || '不明';
};
  
export const addTimestamp = (receipt: Receipt): void => {
  receipt.timestamp = new Date().toISOString();
};
