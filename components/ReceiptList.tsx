import React, { useState, useMemo } from 'react';
import { Receipt } from '../types';
import { FaReceipt, FaTrash, FaChevronDown, FaChevronUp, FaImage, FaClock } from 'react-icons/fa';
import { formatCurrency } from '../utils/formatCurrency';
import { formatRelativeTime } from '../utils/formatRelativeTime';
import { findSimilarReceipts } from '../utils/findSimilarReceipts'; // This function needs to be created

type ReceiptWithId = Receipt & {
  id: string;
};

interface ReceiptListProps {
  receipts: ReceiptWithId[];
  onSelectReceipt: (receipt: ReceiptWithId) => void;
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

  const receiptsByMonth = useMemo(() => {
    const grouped = receipts.reduce((acc, receipt) => {
      const date = new Date(receipt.transactionDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(receipt);
      return acc;
    }, {} as Record<string, ReceiptWithId[]>);

    return Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a));
  }, [receipts]);

  return (
    <div className="container mx-auto p-4">
      {receiptsByMonth.map(([month, monthReceipts]) => (
        <div key={month} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{month}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monthReceipts.map((receipt) => {
              if (!receipt.id) return null;
              const receiptWithId: ReceiptWithId = {
                ...receipt,
                id: receipt.id,
                amount: receipt.amount.toString(), // 文字列に変換
              };
              return (
                <div key={receiptWithId.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <FaReceipt className="text-blue-500 mr-2" />
                        <h3 className="text-lg font-semibold">{receipt.issuer}</h3>
                      </div>
                      <button
                        onClick={() => receiptWithId.id && toggleReceiptDetails(receiptWithId.id)}
                        className="btn btn-sm btn-ghost"
                      >
                        {expandedReceipt === receiptWithId.id ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </div>
                    <p className="text-gray-600">{receipt.transactionDate}</p>
                    <p className="text-xl font-bold mt-2">{formatCurrency(Number(receipt.amount), receipt.currency)}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      <FaClock className="inline-block mr-1" />
                      {receipt.registrationDate && formatRelativeTime(receipt.registrationDate)}
                    </p>
                  </div>
                  {expandedReceipt === receiptWithId.id && (
                    <div className="bg-gray-50 p-4 border-t">
                      <p>発行者: {receipt.issuer}</p>
                      <p>住所: {receipt.issuerAddress}</p>
                      <p>取引日: {receipt.transactionDate}</p>
                      <p>額: {receipt.amount}円</p>
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
                          <FaImage className="mr-1" /> 画を表示
                        </button>
                      )}
                      {receipt.items && receipt.items.length > 0 && (
                        <ul className="list-disc list-inside mt-2">
                          {receipt.items.map((item, index) => (
                            <li key={index}>
                              {item.name}: {formatCurrency(Number(item.price), receipt.currency)}
                            </li>
                          ))}
                        </ul>
                      )}
                      
                    </div>
                  )}
                  <div className="bg-gray-100 px-4 py-2 flex justify-end">
                    <button
                      onClick={() => receiptWithId.id && deleteReceipt(receiptWithId.id)}
                      className="btn btn-sm btn-ghost text-red-500"
                    >
                      <FaTrash className="mr-1" /> 削除
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
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