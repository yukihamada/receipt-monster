import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Receipt } from '../types';

export const useRealTimeReceipts = (userId: string | null) => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setReceipts([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const receiptsRef = collection(db, 'receipts');
    const q = query(receiptsRef, where('userId', '==', userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newReceipts: Receipt[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Receipt));

      setReceipts(newReceipts);
      setLoading(false);
    }, (error) => {
      console.error('レシートの取得中にエラーが発生しました:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { receipts, loading };
};