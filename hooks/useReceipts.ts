import { useState, useEffect, useCallback } from 'react';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { app } from '../firebase';
import { Receipt } from '../types';

const db = getFirestore(app);

export const useReceipts = (userId: string | null) => {
  const [savedReceipts, setSavedReceipts] = useState<Receipt[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (!userId) return;
    fetchReceipts();
  }, [userId]);

  const fetchReceipts = useCallback(async (): Promise<Receipt[]> => {
    if (!userId) return [];
    try {
      const q = query(collection(db, 'receipts'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const fetchedReceipts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Receipt));
      setSavedReceipts(fetchedReceipts);
      updateTotalAmount(fetchedReceipts);
      return fetchedReceipts;
    } catch (error) {
      console.error('Failed to load receipts from Firestore:', error);
      return [];
    }
  }, [userId]);

  const updateTotalAmount = (receipts: Receipt[]) => {
    const newTotalAmount = receipts.reduce((sum, receipt) => {
      const amount = typeof receipt.amount === 'string' 
        ? parseFloat(receipt.amount.replace(/[^\d.]/g, ''))
        : typeof receipt.amount === 'number' ? receipt.amount : 0;
      return isNaN(amount) ? sum : sum + amount;
    }, 0);
    setTotalAmount(newTotalAmount);
  };

  const handleImageUpload = async (file: File) => {
    if (!userId) return;
    const uploadId = Date.now().toString();
    setUploadProgress(prev => ({ ...prev, [uploadId]: 0 }));

    const pendingReceipt: Receipt = {
      id: uploadId,
      timestamp: new Date().toISOString(),
      uploadTime: new Date().toISOString(), // Added
      date: new Date().toISOString(), // Added
      imageUrl: URL.createObjectURL(file),
      userId,
      amount: '0',
      issuer: '登録中',
      transactionDate: new Date().toISOString(),
      recipient: '未定',
      currency: 'JPY',
      purpose: '未定',
      hash: '',
      issuerAddress: '',
      issuerContact: '',
      noryoshusho: 'false',
      reducedTaxRate: 'false',
      registrationNumber: '',
      serialNumber: '',
      taxCategory: '',
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
      const { id, ...receiptWithoutId } = updatedReceipt;
      if (id) {
        await updateDoc(doc(db, 'receipts', id), receiptWithoutId);
        const updatedReceipts = savedReceipts.map(r => 
          r.id === id ? updatedReceipt : r
        );
        setSavedReceipts(updatedReceipts);
        updateTotalAmount(updatedReceipts);
      } else {
        console.error('レシートIDが見つかりません');
      }
    } catch (error) {
      console.error('レシートの更新中にエラーが発生しました:', error);
    }
  };

  const printReceipt = (receipt: Receipt) => {
    // 印刷ロジックの実（必要に応じて）
    console.log('Printing receipt:', receipt);
  };

  const uploadReceipt = async (userId: string, file: File) => {
    // レシートアップロードのロジックを実装
  };

  const addReceipt = async (newReceipt: Receipt) => {
    // レシートを追加するロジックを実装
  };

  return {
    savedReceipts,
    totalAmount,
    uploadProgress,
    handleImageUpload,
    deleteReceipt,
    editReceipt,
    printReceipt,
    fetchReceipts,
    uploadReceipt,
    addReceipt
  };
};