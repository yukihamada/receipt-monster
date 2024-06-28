'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Footer, Header, labels, uploadMessages, Receipt } from './CommonComponents';
import Image from 'next/image';
import Head from 'next/head';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { app, auth } from '../firebase'; // Firebaseの初期化と認証をインポート
import { onAuthStateChanged } from 'firebase/auth';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash2, Edit2, PlusCircle, Clock } from 'lucide-react';

const db = getFirestore(app); // Firestoreのインスタンスを取得

const MAX_FREE_RECEIPTS = 10;
const MAX_TOTAL_RECEIPTS = 1000;

const ReceiptMonsterApp: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<Receipt | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedReceipts, setSavedReceipts] = useState<Receipt[]>([]);
  const [monsterState, setMonsterState] = useState('/leaf/love.webp');
  const [totalAmount, setTotalAmount] = useState<string | null>(null);
  const [editingReceipt, setEditingReceipt] = useState<Receipt | null>(null);
  const [currentMessage, setCurrentMessage] = useState(uploadMessages[0]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [randomMessage, setRandomMessage] = useState(uploadMessages[0]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach(file => handleImageUpload(file));
    },
    multiple: true // 複数ファイルのアップロードを許可
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserId(user.uid);
      } else {
        setIsLoggedIn(false);
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isClient || !userId) return;

    const fetchReceipts = async () => {
      try {
        const q = query(collection(db, 'receipts'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const fetchedReceipts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          timestamp: doc.data().timestamp, // timestamp added
          ...doc.data()
        }));
        setSavedReceipts(fetchedReceipts);
      } catch (error) {
        console.error('Failed to load receipts from Firestore:', error);
      }
    };

    fetchReceipts();
  }, [isClient, userId]);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setCurrentMessage(uploadMessages[Math.floor(Math.random() * uploadMessages.length)]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) {
      setMonsterState('/leaf/eating.webp');
    } else if (result) {
      setMonsterState('/leaf/eat.webp');
    } else {
      setMonsterState('/leaf/love.webp');
    }
  }, [isLoading, result]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * uploadMessages.length);
      setRandomMessage(uploadMessages[randomIndex]);
    }, 10000); // 10秒ごとにメッセージを変更

    return () => clearInterval(intervalId);
  }, []);

  const handleImageUpload = async (file: File) => {
    const uploadId = Date.now().toString();
    setUploadProgress(prev => ({ ...prev, [uploadId]: 0 }));
    setIsLoading(true);

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);

    // "登録中"のレシートを追加
    const pendingReceipt: Receipt = {
      id: uploadId,
      timestamp: new Date().toISOString(),
      imageUrl: imageUrl,
      imageOrientation: 0, // デフォルト値を0に設定
      userId: userId!,
      amount: '登録中',
      issuer: '登録中'
    };
    setSavedReceipts(prev => [pendingReceipt, ...prev]);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('userId', userId!);

      const response = await fetch('/api/process-receipt', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('アップロードに失敗しました');
      }

      const data = await response.json();
      setResult(data);

      // Cloudflareから返された画像URLを使用
      const cloudflareImageUrl = data.imageUrl;

      // 合計の計算
      if (data.amount) {
        setTotalAmount(data.amount.toString());
      }

      // レシートを保存
      const newReceipt: Receipt = {
        id: uploadId,
        timestamp: new Date().toISOString(),
        imageUrl: cloudflareImageUrl, // Cloudflareの画像URLを保存
        imageOrientation: data.imageOrientation, // 画像の向きを保存
        userId, // ユーザーIDを追加
        ...data
      };

      const docRef = await addDoc(collection(db, 'receipts'), newReceipt);
      newReceipt.id = docRef.id; // FirestoreのドキュメントIDを設定
      setSavedReceipts(prev => prev.map(r => r.id === uploadId ? newReceipt : r));
    } catch (error) {
      console.error('画像のアップロード中にエラーが発生しました:', error);
    } finally {
      setIsLoading(false);
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
    } catch (error) {
      console.error('レシートの削除中にエラーが発生した:', error);
    }
  };

  const editReceipt = (receipt: Receipt) => {
    setEditingReceipt(receipt);
  };

  const saveEditedReceipt = async () => {
    if (editingReceipt) {
      try {
        await updateDoc(doc(db, 'receipts', editingReceipt.id), editingReceipt);
        const updatedReceipts = savedReceipts.map(r => 
          r.id === editingReceipt.id ? editingReceipt : r
        );
        setSavedReceipts(updatedReceipts);
        setEditingReceipt(null);
      } catch (error) {
        console.error('レシートの更新中にエラーが発生しました:', error);
      }
    }
  };

  const renderValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return value.toString();
  };

  const getLabel = (key: keyof Receipt): string => {
    if (key in labels) {
      return labels[key as keyof typeof labels];
    }
    return key as string;
  };

  const handleAddReceiptClick = () => {
    document.getElementById('fileInput')?.click();
  };

  const addTimestamp = () => {
    // タイムスタンプを追加するロジック
  };

  const renderLoader = () => (
    <div className="flex justify-center items-center">
      <div className="loader"></div>
    </div>
  );

  if (!isClient) {
    return null; // クライアントサイドでのみレンダリング
  }

  return (
    <>
      <Head>
        <title>レシートモンスター - 経理をスマートに</title>
      </Head>
      <div className="min-h-screen flex flex-col transition-colors duration-300 bg-gray-100 text-gray-900">
        <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={randomMessage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold mb-12 text-center"
              >
                <div className="text-center text-gray-700 mb-8">
                  {randomMessage}
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="text-center mb-8">
              <motion.div
                animate={isLoading ? { rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 0.1, repeat: isLoading ? Infinity : 0, repeatType: "loop" }}
              >
                <Image 
                  src={monsterState}
                  alt="Monster"
                  width={200}
                  height={200}
                  className="mx-auto"
                  priority // ここを追加
                />
              </motion.div>
            </div>
            {isLoading && renderLoader()}
            <div 
              {...getRootProps()}
              className={`p-6 border-2 border-dashed rounded-md mb-8 bg-white cursor-pointer ${isDragActive ? 'border-blue-500' : 'border-gray-300'}`}
            >
              <input {...getInputProps()} id="fileInput" style={{ display: 'none' }} />
              <p className="text-center text-gray-500">{isDragActive ? 'ここにドロップしてください' : 'ここをクリックするか、ファイルをドラッグ＆ドロップしてください'}</p>
            </div>
            <ReceiptList 
              savedReceipts={savedReceipts}
              deleteReceipt={deleteReceipt}
              editReceipt={editReceipt}
              getLabel={getLabel}
              renderValue={renderValue}
              onAddReceiptClick={handleAddReceiptClick}
              uploadProgress={uploadProgress} // ここを追加
            />
          </div>
        </main>
      </div>
    </>
  );
};

interface ReceiptListProps {
  savedReceipts: Receipt[];
  deleteReceipt: (id: string) => void;
  editReceipt: (receipt: Receipt) => void;
  getLabel: (key: keyof Receipt) => string;
  renderValue: (value: any) => string;
  onAddReceiptClick: () => void;
  uploadProgress: { [key: string]: number }; // ここを追加
}

const ReceiptList: React.FC<ReceiptListProps> = ({ savedReceipts, deleteReceipt, editReceipt, getLabel, renderValue, onAddReceiptClick, uploadProgress }) => {
  const safeSavedReceipts = savedReceipts || [];
  const sortedReceipts = [...safeSavedReceipts].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const [emptyMessage, setEmptyMessage] = useState('');
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    const messages = [
      'レシートがないなんて、財布が軽くて幸せで！',
      '買い物しなも幸せ？それとゃった？',
      'レシートゼロ。エコな生活らしいです',
      'レシートがないのは、宝くじに当たったからですか？',
      '無レシート生活、始めました？',
      '空っぽのレシート箱。想像力豊かな買い物の時間です！',
      'レシートなし、思い出いっぱい？',
      '今日のテーマは「無駄いゼロ」。素晴らい成果です！',
      'レシートがないって、実は立派な貯金術かも？',
      'レシート0枚。今日はバーチャルショッピングの日？'
    ];

    const changeMessage = () => {
      const randomIndex = Math.floor(Math.random() * messages.length);
      setEmptyMessage(messages[randomIndex]);
    };

    changeMessage();
    const interval = setInterval(changeMessage, 10000);

    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const receiptDate = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - receiptDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}分前`;
    } else if (diffInMinutes < 24 * 60) {
      return `${Math.floor(diffInMinutes / 60)}時間前`;
    } else if (diffInMinutes < 3 * 24 * 60) {
      return `${Math.floor(diffInMinutes / (24 * 60))}日前`;
    } else {
      return receiptDate.toLocaleDateString();
    }
  };

  const renderReceiptContent = (receipt: Receipt) => (
    <>
      <div className="grid grid-cols-1 gap-2">
      <div className="flex justify-between">
        <span className="font-medium">発行者:</span>
        <span>{renderValue(receipt.issuer)}</span>
      </div>
      {receipt.imageUrl && (
        <div className="mb-4 flex justify-center">
          <Image 
            src={receipt.imageUrl}
            alt="Receipt image"
            width={200}
            height={200}
            className="rounded-lg shadow-md transition-transform duration-300 hover:scale-105 max-h-48 object-contain"
            style={{ transform: `rotate(${receipt.imageOrientation}deg)`, width: 'auto', height: 'auto' }} // ここを修正
          />
        </div>
      )}
        {Object.entries(receipt)
          .filter(([key]) => !['id', 'timestamp', 'issuer', 'amount', 'imageUrl', 'userId','imageOrientation', 'noryoshusho'].includes(key))
          .map(([key, value]) => (
            <div key={`${receipt.id}-${key}`} className="flex items-center justify-between mb-2">
              <span className="text-gray-700">{getLabel(key)}:</span>
              <span className="text-gray-900">{renderValue(value)}</span>
            </div>
          ))}
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <Clock className="mr-2" />
          <span>{formatTimestamp(receipt.timestamp)}</span>
        </div>
        <div className="flex items-center">
          <Edit2 className="mr-2 cursor-pointer" onClick={() => editReceipt(receipt)} />
          <Trash2 className="cursor-pointer" onClick={() => deleteReceipt(receipt.id)} />
        </div>
      </div>
      {uploadProgress[receipt.id] !== undefined && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress[receipt.id]}%` }}></div>
        </div>
      )}
    </>
  );

  return (
    <>
      {sortedReceipts.map((receipt, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg shadow-lg mb-4"
        >
          {renderReceiptContent(receipt)}
        </motion.div>
      ))}
      {sortedReceipts.length === 0 && (
        <div className="max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg shadow-lg mb-4">
          <p className="text-lg font-semibold mb-4 text-center">{emptyMessage}</p>
          <button
            type="button"
            onClick={onAddReceiptClick}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full inline-flex items-center"
          >
            <PlusCircle className="mr-2" />
            レシートを追加
          </button>
        </div>
      )}
    </>
  );
};

export default ReceiptMonsterApp;
