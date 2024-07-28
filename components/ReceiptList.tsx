import React, { useState } from 'react';
import { Receipt } from '../types';
import { FaReceipt, FaTrash, FaChevronDown, FaChevronUp, FaImage } from 'react-icons/fa';

interface ReceiptListProps {
  receipts: Receipt[];
  onSelectReceipt: (receipt: Receipt) => void;
  deleteReceipt: (id: string) => void;
}

const ReceiptList: React.FC<ReceiptListProps> = ({ receipts, onSelectReceipt, deleteReceipt }) => {
  const [expandedReceipt, setExpandedReceipt] = useState<string | null>(null);
  const [showImage, setShowImage] = useState<string | null>(null);

  const toggleReceiptDetails = (id: string) => {
    setExpandedReceipt(expandedReceipt === id ? null : id);
  };

  const toggleImage = (imageUrl: string | null) => {
    setShowImage(imageUrl);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {receipts.map((receipt) => (
          <div key={receipt.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <FaReceipt className="text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold">{receipt.issuer}</h3>
                </div>
                <button
                  onClick={() => toggleReceiptDetails(receipt.id)}
                  className="btn btn-sm btn-ghost"
                >
                  {expandedReceipt === receipt.id ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </div>
              <p className="text-gray-600">{receipt.transactionDate}</p>
              <p className="text-xl font-bold mt-2">{receipt.amount}円</p>
            </div>
            {expandedReceipt === receipt.id && (
              <div className="bg-gray-50 p-4 border-t">
                <p>発行者: {receipt.issuer}</p>
                <p>住所: {receipt.issuerAddress}</p>
                <p>取引日: {receipt.transactionDate}</p>
                <p>金額: {receipt.amount}円</p>
                <p>税区分: {receipt.taxCategory}</p>
                <p>軽減税率: {receipt.reducedTaxRate}</p>
                <p>目的: {receipt.purpose}</p>
                <p>登録番号: {receipt.registrationNumber}</p>
                <p>シリアル番号: {receipt.serialNumber}</p>
                <p>登録日: {receipt.registrationDate}</p>
                {receipt.note && <p>メモ: {receipt.note}</p>}
                {receipt.imageUrl && (
                  <button
                    onClick={() => receipt.imageUrl && toggleImage(receipt.imageUrl)}
                    className="btn btn-sm btn-primary mt-2"
                  >
                    <FaImage className="mr-1" /> 画像を表示
                  </button>
                )}
              </div>
            )}
            <div className="bg-gray-100 px-4 py-2 flex justify-end">
              <button
                onClick={() => deleteReceipt(receipt.id)}
                className="btn btn-sm btn-ghost text-red-500"
              >
                <FaTrash className="mr-1" /> 削除
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {receipts.length === 0 && (
        <p className="text-center text-gray-500 my-8">表示するレシートがありません。</p>
      )}

      {showImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => toggleImage(null)}>
          <div className="bg-white p-2 rounded-lg max-w-3xl max-h-3xl">
            <img src={showImage} alt="レシート画像" className="max-w-full max-h-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptList;