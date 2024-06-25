import React, { useCallback, useState, useEffect } from 'react';
import { MotionDiv, StyledMotionDiv, Receipt as ReceiptType } from './CommonComponents';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import ReceiptList from './ReceiptList';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUpload, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { messages, loadingMessages } from './CommonComponents';

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
  onAddReceiptClick: () => void;
  addTimestamp: (receipt: ReceiptType) => void; // Added
}

interface ReceiptData {
  // ... other properties ...
  imageUrl?: string;
  orientation?: number;
}


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
  onAddReceiptClick,
  addTimestamp, // Added
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
        setUploadProgress((prev) => Math.min(prev + 100 / 200, 100)); // 20秒で100%になるように設定
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
    return null; // 処理結果の表示を削除
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
            <FaSave className="mr-2" /> 保存
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
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <motion.p
        key={currentLoadingMessage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="text-lg font-semibold mb-4 text-center"
      >
        {currentLoadingMessage}
      </motion.p>
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: "0%" }}
          animate={{ width: `${uploadProgress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className="mt-2 text-center">{Math.round(uploadProgress)}%</p>
      {currentMessage && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-4 text-sm text-gray-600 text-center"
        >
          {currentMessage}
        </motion.p>
      )}
    </div>
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
          スキャンされた合計金額: {totalAmount}
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

      {/* ローダーの表示位置を変更 */}
      {isLoading ? renderLoader() : (
        <div 
          {...getRootProps()}
          className={`p-6 border-2 border-dashed rounded-md mb-8 bg-white cursor-pointer ${isDragActive ? 'border-blue-500' : 'border-gray-300'}`}
        >
          <input {...getInputProps()} id="fileInput" style={{ display: 'none' }} />
          <p className="text-center text-gray-500">{isDragActive ? 'ここにドロップしてください' : 'ここをクリックするか、ファイルをドラッグ＆ドロップしてください'}</p>
        </div>
      )}

      {/* Receipt list */}
      <ReceiptList 
        savedReceipts={savedReceipts}
        deleteReceipt={deleteReceipt}
        editReceipt={editReceipt}
        getLabel={getLabel}
        renderValue={renderValue}
        onAddReceiptClick={onAddReceiptClick}
        addTimestamp={addTimestamp} // Added
      />
    </div>
  );
};

export default MainContent;
