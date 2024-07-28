import { Receipt } from '../../types';

const API_BASE_URL = '/api';

/**
 * レシート画像をアップロードし、処理する
 * @param file アップロードする画像ファイル
 * @param userId ユーザーID
 * @returns 処理されたレシート情報
 */
export const uploadAndProcessReceipt = async (file: File, userId: string): Promise<Receipt> => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('userId', userId);

  const response = await fetch(`${API_BASE_URL}/process-receipt`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('レシートの処理に失敗しました');
  }

  return await response.json();
};

/**
 * 保存されたレシートを取得する
 * @param userId ユーザーID
 * @returns レシートの配列
 */
export const fetchSavedReceipts = async (userId: string): Promise<Receipt[]> => {
  const response = await fetch(`${API_BASE_URL}/receipts?userId=${userId}`);

  if (!response.ok) {
    throw new Error('レシートの取得に失敗しました');
  }

  return await response.json();
};

/**
 * レシートを更新する
 * @param receipt 更新するレシート情報
 * @returns 更新されたレシート情報
 */
export const updateReceipt = async (receipt: Receipt): Promise<Receipt> => {
  const response = await fetch(`${API_BASE_URL}/receipts/${receipt.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(receipt),
  });

  if (!response.ok) {
    throw new Error('レシートの更新に失敗しました');
  }

  return await response.json();
};

/**
 * レシートを削除する
 * @param receiptId 削除するレシートのID
 * @returns 削除が成功したかどうか
 */
export const deleteReceipt = async (receiptId: string): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/receipts/${receiptId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('レシートの削除に失敗しました');
  }

  return true;
};