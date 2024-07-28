import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Receipt } from '../types';

export const uploadReceipt = async (file: File, userId: string): Promise<Receipt> => {
  const storageRef = ref(storage, `receipts/${userId}/${file.name}`);
  
  try {
    // ファイルをアップロード
    const snapshot = await uploadBytes(storageRef, file);
    
    // アップロードされたファイルのURLを取得
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // レシートデータを作成して返す
    const newReceipt: Receipt = {
      id: Date.now().toString(), // 一時的なIDとして現在のタイムスタンプを使用
      name: file.name, // ファイル名を使用
      amount: 0, // 仮の値として0を設定
      category: '', // 仮の空文字列を設定
      date: new Date().toISOString(), // 現在の日付を設定
      memo: '', // 仮の空文字列を設定
      imageUrl: downloadURL,
      timestamp: new Date().toISOString(), // 現在のタイムスタンプを追加
      issuer: '', // 仮空文字列を設定
    };

    return newReceipt;
  } catch (error) {
    console.error('レシートのアップロードに失敗しました:', error);
    throw error;
  }
}