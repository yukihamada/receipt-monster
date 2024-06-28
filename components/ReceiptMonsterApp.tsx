'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Header, Footer } from './CommonComponents';
import ReceiptList from './ReceiptList';
import { useReceipts } from '../hooks/useReceipts';
import { useAuth } from '../hooks/useAuth';
import { uploadMessages } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';
import { getLabel, addTimestamp } from '../utils/helpers';
import { Receipt } from './types'; // Add this import statement

const ReceiptMonsterApp: React.FC<{ renderValue: (key: keyof Receipt) => string }> = ({ renderValue }) => {
  const [isClient, setIsClient] = useState(false);
  const [monsterState, setMonsterState] = useState('/leaf/love.webp');
  const [randomMessage, setRandomMessage] = useState(uploadMessages[0]);
  const [isLoading, setIsLoading] = useState(false);

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
                  priority
                />
              </motion.div>
            </div>
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
              editReceipt={(receipt) => editReceipt(receipt)} // パラメーター名を統一
              onAddReceiptClick={handleAddReceiptClick}
              uploadProgress={uploadProgress}
              printReceipt={printReceipt}
              renderValue={renderValue as (key: keyof Receipt) => string}
              getLabel={getLabel}
              addTimestamp={addTimestamp}
              isLoading={isLoading}
              currentMessage={randomMessage} // この行を追加
              renderLoader={renderLoader}
            />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ReceiptMonsterApp;