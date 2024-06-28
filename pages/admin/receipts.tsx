import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../firebase'; // Firebaseの初期化をインポート
import { Receipt } from '../../components/CommonComponents';

const db = getFirestore(app);

const AdminReceiptList: React.FC = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'receipts'));
        const fetchedReceipts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          issuer: doc.data().issuer,
          amount: doc.data().amount,
          timestamp: doc.data().timestamp
        }));
        setReceipts(fetchedReceipts);
      } catch (error) {
        console.error('レシートの取得中にエラーが発生しました:', error);
      }
    };

    fetchReceipts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">レシート一覧</h2>
      <ul className="space-y-4">
        {receipts.map(receipt => (
          <li key={receipt.id} className="bg-white p-4 rounded-lg shadow-md">
            <p><strong>ID:</strong> {receipt.id}</p>
            <p><strong>発行者:</strong> {receipt.issuer}</p>
            <p><strong>金額:</strong> {receipt.amount}</p>
            <p><strong>タイムスタンプ:</strong> {receipt.timestamp}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminReceiptList;