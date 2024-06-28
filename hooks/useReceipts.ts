import { useState, useEffect, useCallback } from 'react';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { app } from '../firebase';
import { Receipt } from '../components/types';

const db = getFirestore(app);

export const useReceipts = (userId: string | null) => {
  const [savedReceipts, setSavedReceipts] = useState<Receipt[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (!userId) return;
    fetchReceipts();
  }, [userId]);

  const fetchReceipts = useCallback(async () => {
    if (!userId) return;
    try {
      const q = query(collection(db, 'receipts'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const fetchedReceipts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Receipt));
      setSavedReceipts(fetchedReceipts);
      updateTotalAmount(fetchedReceipts);
    } catch (error) {
      console.error('Failed to load receipts from Firestore:', error);
    }
  }, [userId]);

  const updateTotalAmount = (receipts: Receipt[]) => {
    const total = receipts.reduce((sum, receipt) => sum + Number(receipt.amount), 0);
    setTotalAmount(total);
  };

  const handleImageUpload = async (file: File) => {
    if (!userId) return;
    const uploadId = Date.now().toString();
    setUploadProgress(prev => ({ ...prev, [uploadId]: 0 }));

    const pendingReceipt: Receipt = {
      id: uploadId,
      timestamp: new Date().toISOString(),
      imageUrl: URL.createObjectURL(file),
      imageOrientation: 0,
      userId,
      amount: 0,
      issuer: '登録中'
    };
    setSavedReceipts(prev => [pendingReceipt, ...prev]);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('userId', userId);

      const response = await fetch('/api/process-receipt', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('アップロードに失敗しました');
      }

      const data = await response.json();
      const newReceipt: Receipt = {
        id: uploadId,
        timestamp: new Date().toISOString(),
        imageUrl: data.imageUrl,
        imageOrientation: data.imageOrientation,
        userId,
        ...data
      };

      const docRef = await addDoc(collection(db, 'receipts'), newReceipt);
      newReceipt.id = docRef.id;
      setSavedReceipts(prev => prev.map(r => r.id === uploadId ? newReceipt : r));
      updateTotalAmount([...savedReceipts, newReceipt]);
    } catch (error) {
      console.error('画像のアップロード中にエラーが発生しました:', error);
    } finally {
      setUploadProgress(prev => {
        const { [uploadId]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const deleteReceipt = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'receipts', id));
      const updatedReceipts = savedReceipts.filter(receipt => receipt.id !== id);
      setSavedReceipts(updatedReceipts);
      updateTotalAmount(updatedReceipts);
    } catch (error) {
      console.error('レシートの削除中にエラーが発生した:', error);
    }
  };

  const editReceipt = async (updatedReceipt: Receipt) => {
    try {
      await updateDoc(doc(db, 'receipts', updatedReceipt.id), updatedReceipt);
      const updatedReceipts = savedReceipts.map(r => 
        r.id === updatedReceipt.id ? updatedReceipt : r
      );
      setSavedReceipts(updatedReceipts);
      updateTotalAmount(updatedReceipts);
    } catch (error) {
      console.error('レシートの更新中にエラーが発生しました:', error);
    }
  };

  const printReceipt = (receipt: Receipt) => {
    // 印刷ロジックの実装（必要に応じて）
    console.log('Printing receipt:', receipt);
  };

  return {
    savedReceipts,
    totalAmount,
    uploadProgress,
    handleImageUpload,
    deleteReceipt,
    editReceipt,
    printReceipt,
    fetchReceipts
  };
};