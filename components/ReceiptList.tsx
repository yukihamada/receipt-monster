import React, { useState, useMemo } from 'react';
import { Receipt } from '../types';
import { FaReceipt, FaTrash, FaChevronDown, FaChevronUp, FaImage, FaClock } from 'react-icons/fa';
import { formatCurrency } from '../utils/formatCurrency';
import { formatRelativeTime } from '../utils/formatRelativeTime';
import { findSimilarReceipts } from '../utils/findSimilarReceipts'; // This function needs to be created

type ReceiptWithId = Omit<Receipt, 'amount'> & {
  id: string;
  amount: number | { grossAmount: number };
};

interface ReceiptListProps {
  receipts: ReceiptWithId[];
  onSelectReceipt: (receipt: ReceiptWithId) => void;
  deleteReceipt: (id: string) => void;
  selectedReceiptIds: string[];
  onSelectReceiptIds: (ids: string[]) => void;
}

const ReceiptList: React.FC<ReceiptListProps> = ({ receipts, onSelectReceipt, deleteReceipt, selectedReceiptIds, onSelectReceiptIds }) => {
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
      if (!acc[key]) {
        acc[key] = { receipts: [], totalAmount: 0 };
      }
      acc[key].receipts.push(receipt);
      
      // amountが文字列またはオブジェクトの場合に対��
      let amount = typeof receipt.amount === 'object' && 'grossAmount' in receipt.amount
        ? (receipt.amount as { grossAmount: number }).grossAmount
        : Number(receipt.amount);

      // 金額を円に換算
      const formattedAmount = formatCurrency(amount, receipt.currency);
      let amountInJPY = amount;
      
      if (receipt.currency !== 'JPY') {
        const match = formattedAmount.match(/約(.*)\)/);
        if (match && match[1]) {
          amountInJPY = Number(match[1].replace(/[^0-9.-]+/g, ''));
        }
      }
      
      acc[key].totalAmount += amountInJPY;
      return acc;
    }, {} as Record<string, { receipts: ReceiptWithId[], totalAmount: number }>);

    return Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a));
  }, [receipts]);

  return (
    <div className="container mx-auto p-4 bg-gray-100">
      {receiptsByMonth.map(([month, { receipts: monthReceipts, totalAmount }]) => (
        <div key={month} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white z-10 py-3 px-4 rounded-lg shadow-lg transform -translate-y-2 flex justify-between items-center">
            <span>{month}</span>
            <span className="text-xl">合計: {formatCurrency(totalAmount, 'JPY')}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {monthReceipts.map((receipt) => {
              if (!receipt.id) return null;
              const receiptWithId: ReceiptWithId = {
                ...receipt,
                id: receipt.id,
                amount: typeof receipt.amount === 'object' && 'grossAmount' in receipt.amount
                  ? receipt.amount
                  : Number(receipt.amount),
              };
              return (
                <div key={receiptWithId.id} className="bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <FaReceipt className="text-blue-500 mr-2 text-xl" />
                        <h3 className="text-lg font-semibold text-gray-800">{receipt.issuer}</h3>
                      </div>
                      <button
                        onClick={() => receiptWithId.id && toggleReceiptDetails(receiptWithId.id)}
                        className="btn btn-circle btn-sm btn-ghost"
                      >
                        {expandedReceipt === receiptWithId.id ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm">{receipt.transactionDate}</p>
                    <p className="text-2xl font-bold mt-2 text-blue-600">{formatCurrency(typeof receipt.amount === 'object' && 'grossAmount' in receipt.amount
                      ? (receipt.amount as { grossAmount: number }).grossAmount
                      : Number(receipt.amount), receipt.currency)}</p>
                    <p className="text-sm text-gray-500 mt-2 flex items-center">
                      <FaClock className="mr-1" />
                      {receipt.registrationDate && formatRelativeTime(receipt.registrationDate)}
                    </p>
                  </div>
                  {expandedReceipt === receiptWithId.id && (
                    <div className="bg-gray-50 p-4 border-t">
                      <p>発行者: {receipt.issuer}</p>
                      <p>住所: {receipt.issuerAddress}</p>
                      <p>取引日: {receipt.transactionDate}</p>
                      <p>額: {typeof receipt.amount === 'object' && 'grossAmount' in receipt.amount
                        ? (receipt.amount as { grossAmount: number }).grossAmount
                        : Number(receipt.amount)}円</p>
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