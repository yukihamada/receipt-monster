'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import ReceiptList from './ReceiptList';
import { useReceipts } from '../hooks/useReceipts';
import { useAuth } from '../hooks/useAuth';
import { uploadMessages } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';
import { getLabel, addTimestamp } from '../utils/helpers';
import { Receipt } from './types';

const ReceiptMonsterApp: React.FC<{ renderValue: (key: keyof Receipt) => string }> = ({ renderValue }) => {
  const [isClient, setIsClient] = useState(false);
  const [monsterState, setMonsterState] = useState('/leaf/love.webp');
  const [randomMessage, setRandomMessage] = useState(uploadMessages[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [fixedMessage] = useState('レシートをアップロードして、経理をスマートにしましょう！');
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState('');

  const { isLoggedIn, userId } = useAuth();
  const { 
    savedReceipts, 
    totalAmount, 
    uploadProgress, 
    handleImageUpload, 
    deleteReceipt, 
    editReceipt, 
    printReceipt 
  } = useReceipts(userId);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach(file => handleImageUpload(file));
    },
    multiple: true
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * uploadMessages.length);
      setRandomMessage(uploadMessages[randomIndex]);
      setCurrentMessage(uploadMessages[randomIndex]);
      setCurrentLoadingMessage(uploadMessages[randomIndex]);
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (isLoading) {
      setMonsterState('/leaf/eating.webp');
    } else if (savedReceipts.length > 0) {
      setMonsterState('/leaf/eat.webp');
    } else {
      setMonsterState('/leaf/love.webp');
    }
  }, [isLoading, savedReceipts]);

  const handleAddReceiptClick = () => {
    document.getElementById('fileInput')?.click();
  };

  const renderLoader = () => (
    <div className="flex justify-center items-center">
      <div className="loader"></div>
    </div>
  );

  if (!isClient) {
    return null;
  }

  return (
    <>
      <Head>
        <title>レシートモンスター - 経理をスマートに</title>
      </Head>
      <div className="min-h-screen flex flex-col transition-colors duration-300 bg-gradient-to-r from-blue-50 to-blue-100 text-gray-900">
        <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto px-4 py-8 bg-white shadow-lg rounded-lg">
            <div className="text-3xl font-bold mb-12 text-center">
              <div className="text-center text-gray-700 mb-8">
                {fixedMessage}
              </div>
            </div>
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
                  priority
                />
              </motion.div>
            </div>
            {!isLoggedIn ? (
              <>
                <div className="text-center">
                  <p className="mb-8 text-lg">無料で会員登録して始めましょう。</p>
                  <a
                    href="/signup"
                    className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full inline-flex items-center transition duration-300"
                  >
                    会員登録ページへ
                  </a>
                </div>
                <div className="mb-8 text-center">
                  <h2 className="text-2xl font-bold mb-2">レシートモンスターの特徴</h2>
                  <ul className="list-disc list-inside text-left mx-auto max-w-2xl text-lg">
                    <li>簡単な書類管理: レシートや領収書をスマホで撮影し、アップロードするだけでデジタル保存が可能。</li>
                    <li>タイムスタンプ: アップロード時にハッシュ化し、ブロックチェーンやタイムスタンプサービスを使用して証明。</li>
                    <li>オリジナルモンスター育成: アップロードしたレシートによって、あなただけのオリジナルモンスターが成長。</li>
                    <li>分散型証明: 書類の証明にはブロックチェーン技術を使用しており、改ざん防止が保証されます。</li>
                    <li>OpenAI API: レシートの内容を解析するためにOpenAIのAPIを使用します。</li>
                  </ul>
                </div>
                <div className="mb-8 text-center">
                  <h2 className="text-2xl font-bold mb-2">使い方の例</h2>
                  <ul className="list-disc list-inside text-left mx-auto max-w-2xl text-lg">
                    <li>家計簿の管理: 毎日の買い物のレシートを撮影してデジタル保存。家計簿をつけるのが簡単になり、いつでも支出を確認できます。</li>
                    <li>経費精算: ビジネスでの経費精算時に、デジタル化したレシートを証明書類として提出。経費精算のプロセスがスムーズに。</li>
                    <li>法的証明: 重要な書類や契約書をデジタル化し、タイムスタンプを付与。法的な紛争時にも安心です。</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                {isLoading && renderLoader()}
                <div 
                  {...getRootProps()}
                  className={`p-6 border-2 border-dashed rounded-md mb-8 bg-white cursor-pointer ${isDragActive ? 'border-blue-500' : 'border-gray-300'}`}
                >
                  <input {...getInputProps()} id="fileInput" style={{ display: 'none' }} />
                  <p className="text-center text-gray-500">
                    {isDragActive ? 'ここにドロップしてください' : 'ここをクリックするか、ファイルをドラッグ＆ドロップしてください'}
                  </p>
                </div>
                <div className="mb-8 text-center">
                  <h2 className="text-2xl font-bold mb-2">総支出額</h2>
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(totalAmount)}</p>
                </div>
                <ReceiptList 
                  savedReceipts={savedReceipts}
                  deleteReceipt={deleteReceipt}
                  editReceipt={(receipt) => editReceipt(receipt)}
                  onAddReceiptClick={handleAddReceiptClick}
                  uploadProgress={uploadProgress}
                  printReceipt={printReceipt}
                  renderValue={renderValue as (key: keyof Receipt) => string}
                  getLabel={getLabel}
                  addTimestamp={addTimestamp}
                  isLoading={isLoading}
                  currentMessage={currentMessage}
                  currentLoadingMessage={currentLoadingMessage}
                  renderLoader={renderLoader}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default ReceiptMonsterApp;
