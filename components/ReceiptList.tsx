import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash2, Edit2, PlusCircle, Clock } from 'lucide-react';
import Image from 'next/image';
import { getLabel } from '../utils/helpers'; // Import getLabel from utils/helpers
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Firestoreのインスタンスをインポート
import { Receipt } from './types'; // 'Receipt' をここからインポート

interface ReceiptListProps {
  savedReceipts: Receipt[];
  deleteReceipt: (id: string) => void;
  editReceipt: (receipt: Receipt) => Promise<void>; // Type updated
  getLabel: (key: keyof Receipt) => string;
  renderValue: (value: any) => string;
  addTimestamp: (receipt: Receipt) => void;
  onAddReceiptClick: () => void;
  isLoading: boolean;
  uploadProgress: { [key: string]: number };
  currentLoadingMessage: string; // Added this line
  currentMessage: string; // Added this line
  renderLoader: () => React.ReactNode;
  printReceipt: (receipt: Receipt) => void;
}

const ReceiptList: React.FC<ReceiptListProps> = ({ savedReceipts, deleteReceipt, editReceipt, getLabel, renderValue, addTimestamp, onAddReceiptClick, isLoading, uploadProgress, currentLoadingMessage, currentMessage, renderLoader }) => {
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
      '今日のテーマは「無駄遣いゼロ」。素晴らしい成果です！',
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
      {receipt.imageUrl && (
        <div className="mb-4 flex justify-center">
          <Image 
            src={receipt.imageUrl}
            alt="Receipt image"
            width={200}
            height={200}
            className="rounded-lg shadow-md transition-transform duration-300 hover:scale-105 max-h-48 object-contain"
            style={{ transform: `rotate(${receipt.imageOrientation}deg)` }}
          />
        </div>
      )}
      <div className="grid grid-cols-1 gap-2">
        {Object.entries(receipt)
          .filter(([key]) => !['id', 'timestamp','issuer','amount', 'imageUrl', 'imageOrientation', 'noryoshusho'].includes(key))
          .map(([key, value]) => (
            <div key={`${receipt.id}-${key}`} className="flex justify-between">
              <span className="font-medium whitespace-nowrap">{getLabel(key as keyof Receipt)}:</span>
              <span className="truncate max-w-full overflow-x-auto">{renderValue(value)}</span>
            </div>
          ))}
      </div>
    </>
  );

  const handleDeleteReceipt = (id: string) => {
    if (confirm('本当にこのレシートを削除しますか？')) {
      deleteReceipt(id);
    }
  };

  return (
    <>
      {isLoading && renderLoader()}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg shadow-lg"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 flex items-center justify-center">
          <PlusCircle className="mr-2" />
          保存されたレシート
        </h2>
        {sortedReceipts.length > 10 && (
          <UpgradeBanner receiptCount={sortedReceipts.length} />
        )}
        {sortedReceipts.length === 0 ? (
          <EmptyState emptyMessage={emptyMessage} onAddReceiptClick={onAddReceiptClick} />
        ) : (
          <ul className="space-y-6">
            {sortedReceipts.map((receipt) => (
              <ReceiptItem
                key={receipt.id}
                receipt={receipt}
                editReceipt={editReceipt}
                deleteReceipt={handleDeleteReceipt}
                renderReceiptContent={renderReceiptContent}
                renderValue={renderValue}
                getLabel={getLabel}
                addTimestamp={addTimestamp}
              />
            ))}
          </ul>
        )}
      </motion.div>
      {sortedReceipts.length > 0 && (
        <div className="text-center mt-6">
          <a
            href="/path/to/download"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full inline-flex items-center"
            download
          >
            <Download className="mr-2" />
            データダウンロード
          </a>
        </div>
      )}
    </>
  );
};

const UpgradeBanner = ({ receiptCount }: { receiptCount: number }) => (
  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-r-lg shadow" role="alert">
    <p className="font-bold">有料プランへのアップグレードご検討ください</p>
    <p>現在{receiptCount}件レシートが保存されています。有料プランにアップグレードすると、最大1000件まで保存できます。</p>
  </div>
);

const EmptyState = ({ emptyMessage, onAddReceiptClick }: { emptyMessage: string, onAddReceiptClick: () => void }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={emptyMessage}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-lg shadow-lg bg-white text-center"
    >
      <p className="text-xl font-medium text-gray-700 mb-4">{emptyMessage}</p>
      <AddReceiptButton onClick={onAddReceiptClick} />
    </motion.div>
  </AnimatePresence>
);

const AddReceiptButton = ({ onClick }: { onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full inline-flex items-center"
    onClick={onClick}
  >
    <PlusCircle className="mr-2" />
    新しいレシートの追加
  </motion.button>
);

const ReceiptItem = ({ receipt, editReceipt, deleteReceipt, renderReceiptContent, renderValue, getLabel, addTimestamp }: {
  receipt: Receipt;
  editReceipt: (receipt: Receipt) => Promise<void>;
  deleteReceipt: (id: string) => void;
  renderReceiptContent: (receipt: Receipt) => React.ReactNode;
  renderValue: (value: any) => string;
  getLabel: (key: keyof Receipt) => string;
  addTimestamp: (receipt: Receipt) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const addCertificateOnServer = async (receipt: Receipt) => {
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          fileHash: receipt.id,
        }),
      });

      if (!response.ok) {
        throw new Error('サーバーでエラーが発生しました');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'certificate.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();

      console.log('証明書が正常に取得されました');
    } catch (error) {
      console.error('証明書の取得中にエラーが発生ました:', error);
    }
  };

  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-lg shadow-md relative hover:shadow-lg transition-shadow duration-300"
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), 0 100%)' }}
    >
      <div className="absolute top-2 right-2 space-x-2 flex items-start">
        <ActionButton icon={Edit2} onClick={() => editReceipt(receipt)} tooltip="編集" />
        <ActionButton icon={Trash2} onClick={() => deleteReceipt(receipt.id)} tooltip="削除" />
        <ActionButton icon={Download} onClick={() => addCertificateOnServer(receipt)} tooltip="証明書を取得" />
      </div>
      <h3 className="text-lg font-semibold mb-4">{receipt.issuer || '店舗名なし'}</h3>
      <div className="flex justify-between">
        <span className="font-medium">金額:</span>
        <span>{renderValue(receipt.amount)}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">発行者:</span>
        <span>{renderValue(receipt.issuer)}</span>
      </div>
      <button
        className="text-blue-500 mt-2 underline"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '詳細を隠す' : '詳細を見る'}
      </button>
      {isOpen && (
        <div className="mt-4 space-y-2">
          {renderReceiptContent(receipt)}
        </div>
      )}
    </motion.li>
  );
};

const ActionButton = ({ icon: Icon, onClick, tooltip }: { icon: React.ElementType, onClick: () => void, tooltip: string }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
    onClick={onClick}
    title={tooltip}
  >
    <Icon size={16} />
  </motion.button>
);

export default ReceiptList;
