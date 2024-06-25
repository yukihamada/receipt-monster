import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit2, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { Receipt, labels } from './CommonComponents';

interface ReceiptListProps {
  savedReceipts: Receipt[];
  deleteReceipt: (id: string) => void;
  editReceipt: (receipt: Receipt) => void;
  getLabel: (key: keyof Receipt) => string;
  renderValue: (value: any) => string;
}

const ReceiptList: React.FC<ReceiptListProps> = ({ savedReceipts, deleteReceipt, editReceipt, getLabel, renderValue }) => {
  const safeSavedReceipts = savedReceipts || [];
  const sortedReceipts = [...safeSavedReceipts].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const [emptyMessage, setEmptyMessage] = useState('');
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    const messages = [
      'レシートがないなんて、財布が軽くて幸せですね！',
      '買い物しなくても幸せ？それとも忘れちゃった？',
      'レシートゼロ。エコな生活素晴らしいです！',
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
            className="rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
            style={{ transform: `rotate(${receipt.imageOrientation}deg)` }}
          />
        </div>
      )}
      {receipt.noryoshusho ? (
        <div className="mt-4">
          <p className="font-medium">写真の内容:</p>
          <p>{receipt.noryoshusho}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(receipt)
            .filter(([key]) => !['id', 'timestamp', 'imageUrl', 'imageOrientation', 'noryoshusho'].includes(key))
            .map(([key, value]) => (
              <div key={`${receipt.id}-${key}`} className="flex justify-between">
                <span className="font-medium">{getLabel(key as keyof Receipt)}:</span>
                <span>{renderValue(value)}</span>
              </div>
            ))}
        </div>
      )}
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">保存されたレシート</h2>
      {sortedReceipts.length > 10 && (
        <UpgradeBanner receiptCount={sortedReceipts.length} />
      )}
      {sortedReceipts.length === 0 ? (
        <EmptyState emptyMessage={emptyMessage} />
      ) : (
        <ul className="space-y-6">
          {sortedReceipts.map((receipt) => (
            <ReceiptItem
              key={receipt.id}
              receipt={receipt}
              editReceipt={editReceipt}
              deleteReceipt={deleteReceipt}
              renderReceiptContent={renderReceiptContent}
            />
          ))}
        </ul>
      )}
    </motion.div>
  );
};

const UpgradeBanner = ({ receiptCount }: { receiptCount: number }) => (
  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-r-lg shadow" role="alert">
    <p className="font-bold">有料プランへのアップグレードをご検討ください</p>
    <p>現在{receiptCount}件のレシートが保存されています。有料プランにアップグレードすると、最大1000件まで保存できます。</p>
  </div>
);

const EmptyState = ({ emptyMessage }: { emptyMessage: string }) => (
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
      <AddReceiptButton />
    </motion.div>
  </AnimatePresence>
);

const AddReceiptButton = () => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full inline-flex items-center"
    onClick={() => {/* レシート追加ロジック */}}
  >
    <PlusCircle className="mr-2" />
    新しいレシートを追加
  </motion.button>
);

const ReceiptItem = ({ receipt, editReceipt, deleteReceipt, renderReceiptContent }: {
  receipt: Receipt;
  editReceipt: (receipt: Receipt) => void;
  deleteReceipt: (id: string) => void;
  renderReceiptContent: (receipt: Receipt) => React.ReactNode;
}) => (
  <motion.li
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="bg-white p-6 rounded-lg shadow-md relative hover:shadow-lg transition-shadow duration-300"
  >
    <div className="absolute top-2 right-2 space-x-2">
      <ActionButton icon={Edit2} onClick={() => editReceipt(receipt)} tooltip="編集" />
      <ActionButton icon={Trash2} onClick={() => deleteReceipt(receipt.id)} tooltip="削除" />
    </div>
    <h3 className="text-lg font-semibold mb-4">{receipt.storeName || '店舗名なし'}</h3>
    {renderReceiptContent(receipt)}
  </motion.li>
);

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
