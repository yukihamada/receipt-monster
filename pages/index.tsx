'use client';

import React, { useState, useEffect } from 'react';
import { Footer, Header, labels, uploadMessages, Receipt } from './CommonComponents';
import MainContent from './MainContent';
import Image from 'next/image';

// 型定義は変更なし

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

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    try {
      const storedReceipts = localStorage.getItem('receipts');
      if (storedReceipts) {
        const parsedReceipts = JSON.parse(storedReceipts);
        if (Array.isArray(parsedReceipts) && parsedReceipts.every(receipt => receipt.id && receipt.timestamp)) {
          setSavedReceipts(parsedReceipts);
        } else {
          throw new Error('Invalid receipt format in local storage');
        }
      }
    } catch (error) {
      console.error('Failed to load receipts from local storage:', error);
    }
  }, [isClient]);

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

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
    try {
      const formData = new FormData();
      formData.append('image', file);

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

      // 合計額設定
      if (data.amount) {
        setTotalAmount(data.amount.toString());
      }

      // レシートを保存
      const newReceipt: Receipt = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        imageUrl: cloudflareImageUrl, // Cloudflareの画像URLを保存
        imageOrientation: data.imageOrientation, // 画像の向きを保存
        ...data
      };
      const updatedReceipts = [...savedReceipts, newReceipt];
      setSavedReceipts(updatedReceipts);
      localStorage.setItem('receipts', JSON.stringify(updatedReceipts));
    } catch (error) {
      console.error('画像のアップロード中にエラーが発生しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReceipt = (id: string) => {
    const updatedReceipts = savedReceipts.filter(receipt => receipt.id !== id);
    setSavedReceipts(updatedReceipts);
    localStorage.setItem('receipts', JSON.stringify(updatedReceipts));
  };

  const editReceipt = (receipt: Receipt) => {
    setEditingReceipt(receipt);
  };

  const saveEditedReceipt = () => {
    if (editingReceipt) {
      const updatedReceipts = savedReceipts.map(r => 
        r.id === editingReceipt.id ? editingReceipt : r
      );
      setSavedReceipts(updatedReceipts);
      localStorage.setItem('receipts', JSON.stringify(updatedReceipts));
      setEditingReceipt(null);
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

  if (!isClient) {
    return null; // クライアントサイドでのみレンダリング
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-gray-100 text-gray-900">
      <Header />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <MainContent 
          result={result}
          totalAmount={totalAmount}
          monsterState={monsterState}
          isLoading={isLoading}
          handleImageUpload={handleImageUpload}
          editReceipt={editReceipt}
          getLabel={getLabel}
          renderValue={renderValue}
          savedReceipts={savedReceipts}
          deleteReceipt={deleteReceipt}
          currentMessage={currentMessage}
          isLoggedIn={isLoggedIn}
        />
      </main>
      <Footer />
    </div>
  );
};

export default ReceiptMonsterApp;

