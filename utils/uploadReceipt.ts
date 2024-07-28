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
      transactionDate: new Date().toISOString(),
      recipient: '',
      amount: '0',
      currency: '',
      purpose: '',
      hash: '',
      imageUrl: downloadURL,
      issuer: '',
      issuerAddress: '',
      issuerContact: '',
      noryoshusho: '',
      reducedTaxRate: 'false', // 文字列として設定
      registrationNumber: '',
      serialNumber: '',
      taxCategory: '',
      uploadTime: new Date().toISOString(),
      date: new Date().toISOString(),
      id: Date.now().toString(),
      name: file.name,
      category: '',
      memo: '',
      timestamp: new Date().toISOString(),
    };

    return newReceipt;
  } catch (error) {
    console.error('レシートのアップロードに失敗しました:', error);
    throw error;
  }
}