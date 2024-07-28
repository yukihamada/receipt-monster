import { Receipt } from '../types/Receipt';

// 日付の差を計算する関数（日数で）
const dateDiffInDays = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// レシートの類似性を判断する関数
const isSimilar = (receipt1: Receipt, receipt2: Receipt): boolean => {
  // 同じ発行者
  const sameIssuer = receipt1.issuer === receipt2.issuer;
  
  // 金額の差が10%以内
  const amountDiff = Math.abs(Number(receipt1.amount) - Number(receipt2.amount));
  const amountSimilar = amountDiff <= Number(receipt1.amount) * 0.1;
  
  // 日付の差が30日以内
  const date1 = new Date(receipt1.transactionDate);
  const date2 = new Date(receipt2.transactionDate);
  const dateSimilar = dateDiffInDays(date1, date2) <= 30;

  // 少なくとも2つの条件を満たす場合に類似と判断
  return (sameIssuer && amountSimilar) || (sameIssuer && dateSimilar) || (amountSimilar && dateSimilar);
};

export const findSimilarReceipts = (receipts: Receipt[], targetReceipt: Receipt): Receipt[] => {
  return receipts.filter(receipt => 
    receipt.id !== targetReceipt.id && isSimilar(receipt, targetReceipt)
  );
};