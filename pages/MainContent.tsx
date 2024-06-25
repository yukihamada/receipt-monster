import React, { useCallback, useState, useEffect } from 'react';
import { MotionDiv, StyledMotionDiv, Receipt as ReceiptType } from './CommonComponents';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import ReceiptList from './ReceiptList';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUpload, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

interface MainContentProps {
  result: ReceiptType | null;
  totalAmount: string | null;
  monsterState: string;
  isLoading: boolean;
  handleImageUpload: (file: File) => void;
  editReceipt: (receipt: ReceiptType) => void;
  getLabel: (key: keyof ReceiptType) => string;
  renderValue: (value: any) => string;
  savedReceipts: ReceiptType[];
  deleteReceipt: (id: string) => void;
  currentMessage: string;
  isLoggedIn: boolean;
}

interface ReceiptData {
  // ... other properties ...
  imageUrl?: string;
  orientation?: number;
}

const messages = [
  "レシートを食べて成長するモンスター、あなたの財布はスッキリ！",
  "家計簿がゲームに？レシートモンスターで楽しく節約！",
  "タイムスタンプ付きで安心、あなたの経費精算をサポート！",
  "レシートの山、さようなら。デジタル管理で空間スッキリ！",
  "モンスターと一緒に、楽しく家計管理。成長が見える喜び！",
  "領収書の整理、もう悩まない。レシートモンスターにお任せ！",
  "税務申告の味方、レシートモンスターでラクラク書類準備！",
  "エコな暮らしへの第一歩、紙のレシートにさようなら！",
  "ビジネスマンの強い味方、経費精算をスマートに！",
  "レシートを撮って、モンスター育成。家計管理が楽しくなる！",
  "大切な書類をしっかり保管、ブロックチェーンで安心管理！",
  "家族で楽しむ家計管理、みんなでモンスター育成！",
  "レシートの謎、AI が解読。家計の見える化をサポート！",
  "財布の中身スッキリ、データはしっかり保管。一石二鳥の便利ツール！",
  "毎日の買い物が冒険に？レシートモンスターで新しい体験を！",
  "領収書の山に埋もれない、スマートな経理担当者になろう！",
  "レシートを撮るたび、モンスターが進化。成長が楽しみにな家計管理！",
  "紙の書類とはおさらば、デジタルで安全に保管。未来型の文書管理！",
  "家計のムダを発見！AI 分析でスマートな家計を実現！",
  "レシートがモンスターのエサに？楽しみながら、賢く節約！"
];

const loadingMessages = [
  "レシートを解析中...",
  "AIがデータを読み取っています...",
  "モンスターにエサをあげています...",
  "家計簿を更新中...",
  "領収書の山を整理しています...",
  "経費精算の準備をしています...",
  "レシートモンスターが進化中..."
];

const MainContent: React.FC<MainContentProps> = ({
  result,
  totalAmount,
  monsterState,
  isLoading,
  handleImageUpload,
  editReceipt,
  getLabel,
  renderValue,
  savedReceipts,
  deleteReceipt,
  currentMessage,
  isLoggedIn,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedResult, setEditedResult] = useState<ReceiptType | null>(null);
  const [randomMessage, setRandomMessage] = useState(messages[0]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * messages.length);
      setRandomMessage(messages[randomIndex]);
    }, 5000); // 5秒ごとにメッセージを変更

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let messageInterval: NodeJS.Timeout;

    if (isLoading) {
      setUploadProgress(0);
      progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 100 / 150, 100)); // 15秒で100%になるように設定
      }, 100);

      messageInterval = setInterval(() => {
        setCurrentLoadingMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
      }, 3000);
    } else {
      setUploadProgress(0);
    }

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [isLoading]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleImageUpload(acceptedFiles[0]);
    }
  }, [handleImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditedResult(result);
  };

  const handleSave = () => {
    if (editedResult) {
      editReceipt(editedResult);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedResult(null);
  };

  const handleInputChange = (key: keyof ReceiptType, value: any) => {
    if (editedResult) {
      setEditedResult({ ...editedResult, [key]: value });
    }
  };

  const renderReceiptOrNoryoshusho = () => {
    if (result?.noryoshusho) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 rounded-lg shadow-lg bg-white"
        >
          <h3 className="text-2xl font-bold mb-4 text-indigo-700">写真の内容</h3>
          <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(result.noryoshusho, null, 2)}</pre>
          </div>
        </motion.div>
      );
    } else {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 rounded-lg shadow-lg bg-white"
        >
          {Object.entries(isEditing ? (editedResult || {}) : (result || {})).map(([key, value]) => {
            if (key !== 'imageUrl' && key !== 'orientation' && key !== 'noryoshusho') {
              return (
                <div key={key} className="mb-4">
                  <span className="font-medium text-gray-700">{getLabel(key as keyof ReceiptType)}:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={value as string}
                      onChange={(e) => handleInputChange(key as keyof ReceiptType, e.target.value)}
                      className="ml-2 border rounded px-2 py-1 w-full mt-1"
                    />
                  ) : (
                    <span className="ml-2 text-gray-900">{renderValue(value)}</span>
                  )}
                </div>
              );
            }
            return null;
          })}
          {renderReceiptImage()}
          {renderEditButtons()}
        </motion.div>
      );
    }
  };

  const renderReceiptImage = () => {
    if (result?.imageUrl) {
      return (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2 text-gray-700">レシート画像</h4>
          <div
            className="cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            onClick={() => setShowModal(true)}
          >
            <Image
              src={result.imageUrl}
              alt="レシート画像"
              width={300}
              height={300}
              objectFit="contain"
              className="transform transition-transform duration-300 hover:scale-105"
              style={{ transform: `rotate(${result.orientation || 0}deg)` }}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  const renderEditButtons = () => {
    if (isEditing) {
      return (
        <div className="mt-6 flex space-x-4">
          <button 
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300"
          >
            <FaSave className="mr-2" /> 保���
          </button>
          <button 
            onClick={handleCancel}
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-300"
          >
            <FaTimes className="mr-2" /> キャンセル
          </button>
        </div>
      );
    } else {
      return (
        <button 
          onClick={handleEdit}
          className="mt-6 flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
        >
          <FaEdit className="mr-2" /> 編集
        </button>
      );
    }
  };

  const renderLoader = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="mb-4">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-24 h-24 mx-auto"
          >
            <FaUpload className="w-full h-full text-blue-500" />
          </motion.div>
        </div>
        <motion.p
          key={currentLoadingMessage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-lg font-semibold mb-2"
        >
          {currentLoadingMessage}
        </motion.p>
        <div className="w-64 h-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500"
            initial={{ width: "0%" }}
            animate={{ width: `${uploadProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="mt-2">{Math.round(uploadProgress)}%</p>
        {currentMessage && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-4 text-sm text-gray-600"
          >
            {currentMessage}
          </motion.p>
        )}
      </div>
    </motion.div>
  );

  return (
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

      {/* Total amount display */}
      {totalAmount && (
        <div className="text-2xl font-bold mb-4 text-center">
          スキャンされた合計金額: {totalAmount}円
        </div>
      )}

      {/* Monster image */}
      <MotionDiv className="mb-8 text-center">
        <StyledMotionDiv 
          className="mx-auto max-w-full h-auto rounded-lg shadow-md"
          animate={isLoading ? { rotate: [0, 10, -10, 0] } : result ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.2, repeat: isLoading ? Infinity : 0, repeatType: "loop" }}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '200px', height: '200px', overflow: 'hidden' }}
        >
          <Image 
            src={monsterState}
            alt="Monster" 
            layout="fill"
            objectFit="contain"
          />
        </StyledMotionDiv>

      </MotionDiv>

      {/* Modal */}
      {showModal && result?.imageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto">
            <Image
              src={result.imageUrl}
              alt="レシート画像（拡大）"
              width={800}
              height={800}
              objectFit="contain"
              style={{ transform: `rotate(${result.orientation || 0}deg)` }}
            />
          </div>
        </div>
      )}

      {/* Result display */}
      {result && (
        <MotionDiv className="mb-8">
          <h2 className="text-xl font-bold mb-4">処理結果</h2>
          {renderReceiptOrNoryoshusho()}
          {!isLoggedIn && (
            <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
              <p>この書類にタイムスタンプを押すには登録が必要です。</p>
              <Link href="/signup" legacyBehavior>
                <a className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  登録する
                </a>
              </Link>
            </div>
          )}
        </MotionDiv>
      )}

      {/* File upload area */}
      {!isLoading && (
        <div 
          {...getRootProps()}
          className={`p-6 border-2 border-dashed rounded-md mb-8 bg-white cursor-pointer ${isDragActive ? 'border-blue-500' : 'border-gray-300'}`}
        >
          <input {...getInputProps()} />
          <p className="text-center text-gray-500">{isDragActive ? 'ここにドロップしてください' : 'ここをクリックするか、ファイルをドラッグ＆ドロップしてください'}</p>
        </div>
      )}

      {isLoading && renderLoader()}

      {/* Receipt list */}
      <ReceiptList 
        savedReceipts={savedReceipts}
        deleteReceipt={deleteReceipt}
        editReceipt={editReceipt}
        getLabel={getLabel}
        renderValue={renderValue}
      />
    </div>
  );
};

export default MainContent;
