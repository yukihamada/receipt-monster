import React, { useState, useMemo } from 'react';
import { Receipt } from '../types';
import { FaReceipt, FaTrash, FaChevronDown, FaChevronUp, FaImage, FaClock, FaEdit } from 'react-icons/fa';
import { formatCurrency } from '../utils/formatCurrency';
import { formatRelativeTime } from '../utils/formatRelativeTime';
import { findSimilarReceipts } from '../utils/findSimilarReceipts'; // This function needs to be created
import axios from 'axios';

type ReceiptWithId = Omit<Receipt, 'amount'> & {
  id: string;
  amount: number | { grossAmount: number };
};

interface ReceiptListProps {
  receipts: ReceiptWithId[];
  onSelectReceipt: (receipt: ReceiptWithId) => void;
  deleteReceipt: (id: string) => void;
  updateReceipt: (updatedReceipt: ReceiptWithId) => void;
  selectedReceiptIds: string[];
  onSelectReceiptIds: (ids: string[]) => void;
}

const ReceiptList: React.FC<ReceiptListProps> = ({ receipts, onSelectReceipt, deleteReceipt, updateReceipt, selectedReceiptIds, onSelectReceiptIds }) => {
  const [expandedReceipt, setExpandedReceipt] = useState<string | null>(null);
  const [showImage, setShowImage] = useState<string | null>(null);
  const [editingReceipt, setEditingReceipt] = useState<string | null>(null);

  const toggleReceiptDetails = (id: string) => {
    setExpandedReceipt(expandedReceipt === id ? null : id);
  };

  const toggleImage = (imageUrl: string | null) => {
    setShowImage(imageUrl);
  };

  const handleEdit = (receipt: ReceiptWithId) => {
    setEditingReceipt(receipt.id);
  };

  const handleSave = (updatedReceipt: ReceiptWithId) => {
    updateReceipt(updatedReceipt);
    setEditingReceipt(null);
  };

  const handleFetchTimestamp = async (receiptId: string) => {
    try {
      const response = await axios.post('/api/addTimestampProgram', { receiptId });
      if (response.status === 200) {
        const { transactionHash, timestamp } = response.data;
        // レシートを更新
        const updatedReceipt = receipts.find(r => r.id === receiptId);
        if (updatedReceipt) {
          updatedReceipt.solanaTransactionHash = transactionHash;
          updatedReceipt.timestamp = timestamp;
          updateReceipt(updatedReceipt);
        }
        alert('タイムスタンプが正常に取得されました。');
      } else {
        alert('タイムスタンプの取得に失敗しました。');
      }
    } catch (error) {
      console.error('タイムスタンプの取得中にエラーが発生しました:', error);
      alert('タイムスタンプの取得中にエラーが発生しました。');
    }
  };

  const renderSolanaLink = (receipt: ReceiptWithId) => {
    if (receipt.solanaTransactionHash) {
      return (
        <a
          href={`https://explorer.solana.com/tx/${receipt.solanaTransactionHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Solanaトランザクション
        </a>
      );
    } else {
      return (
        <button
          onClick={() => handleFetchTimestamp(receipt.id)}
          className="text-blue-500 hover:underline"
        >
          タイムスタンプを取得
        </button>
      );
    }
  };

  const receiptsByMonth = useMemo(() => {
    const grouped = receipts.reduce((acc, receipt) => {
      const date = new Date(receipt.transactionDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[key]) {
        acc[key] = { receipts: [], totalAmount: 0 };
      }
      acc[key].receipts.push(receipt);
      
      // amountが文字列またはオブジェクトの場合に対
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

  const renderItems = (items: any) => {
    if (!items) return null;

    const renderSingleItem = (item: any) => {
      if (typeof item === 'object' && item !== null) {
        return `${item.item || '不明'}: ${item.quantity || '不明'}個 x ${item.price ? formatCurrency(Number(item.price), item.currency || 'JPY') : '不明'}`;
      }
      return String(item);
    };

    let itemsToRender: any[] = [];

    if (Array.isArray(items)) {
      itemsToRender = items;
    } else if (typeof items === 'object' && items !== null) {
      itemsToRender = [items];
    } else {
      return <p>商品情報が利用できません。</p>;
    }

    return (
      <ul className="list-disc list-inside">
        {itemsToRender.map((item, index) => (
          <li key={index}>{renderSingleItem(item)}</li>
        ))}
      </ul>
    );
  };

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
                    <div className="flex justify-between mt-2">
                      <button
                        onClick={() => handleEdit(receiptWithId)}
                        className="btn btn-sm btn-ghost text-blue-500"
                      >
                        <FaEdit className="mr-1" /> 編集
                      </button>
                      <button
                        onClick={() => receiptWithId.id && deleteReceipt(receiptWithId.id)}
                        className="btn btn-sm btn-ghost text-red-500"
                      >
                        <FaTrash className="mr-1" /> 削除
                      </button>
                    </div>
                  </div>
                  {expandedReceipt === receiptWithId.id && (
                    <div className="bg-gray-50 p-4 border-t">
                      {editingReceipt === receiptWithId.id ? (
                        <EditReceiptForm
                          receipt={receiptWithId}
                          onSave={handleSave}
                          onCancel={() => setEditingReceipt(null)}
                        />
                      ) : (
                        <>
                          <p>発行者: {receipt.issuer}</p>
                          <p>住所: {receipt.issuerAddress}</p>
                          <p>取引日: {receipt.transactionDate}</p>
                          <p>額: {typeof receipt.amount === 'object' && 'grossAmount' in receipt.amount
                            ? formatCurrency((receipt.amount as { grossAmount: number }).grossAmount, receipt.currency)
                            : formatCurrency(Number(receipt.amount), receipt.currency)}</p>
                          <p>税区分: {receipt.taxCategory}</p>
                          <p>軽減税率: {receipt.reducedTaxRate ? 'はい' : 'いいえ'}</p>
                          <p>目的: {receipt.purpose}</p>
                          <p>登録番号: {receipt.registrationNumber}</p>
                          <p>シリアル番号: {receipt.serialNumber}</p>
                          <p>登録日: {receipt.registrationDate}</p>
                          {receipt.note && <p>メモ: {receipt.note}</p>}
                          {receipt.items && (
                            <div>
                              <p>商品:</p>
                              {renderItems(receipt.items)}
                            </div>
                          )}
                          {receipt.imageUrl && (
                            <button
                              onClick={() => receipt.imageUrl && toggleImage(receipt.imageUrl)}
                              className="btn btn-sm btn-primary mt-2"
                            >
                              <FaImage className="mr-1" /> 画像表示
                            </button>
                          )}
                          {renderSolanaLink(receiptWithId)}
                        </>
                      )}
                    </div>
                  )}
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

interface EditReceiptFormProps {
  receipt: ReceiptWithId;
  onSave: (updatedReceipt: ReceiptWithId) => void;
  onCancel: () => void;
}

const EditReceiptForm: React.FC<EditReceiptFormProps> = ({ receipt, onSave, onCancel }) => {
  const [editedReceipt, setEditedReceipt] = useState(receipt);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedReceipt(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedReceipt);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="issuer" className="block text-sm font-medium text-gray-700">発行者</label>
        <input
          type="text"
          id="issuer"
          name="issuer"
          value={editedReceipt.issuer}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="issuerAddress" className="block text-sm font-medium text-gray-700">住所</label>
        <input
          type="text"
          id="issuerAddress"
          name="issuerAddress"
          value={editedReceipt.issuerAddress}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="transactionDate" className="block text-sm font-medium text-gray-700">取引日</label>
        <input
          type="date"
          id="transactionDate"
          name="transactionDate"
          value={editedReceipt.transactionDate}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">金額</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={typeof editedReceipt.amount === 'object' ? editedReceipt.amount.grossAmount : editedReceipt.amount}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">通貨</label>
        <input
          type="text"
          id="currency"
          name="currency"
          value={editedReceipt.currency}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="note" className="block text-sm font-medium text-gray-700">メモ</label>
        <textarea
          id="note"
          name="note"
          value={editedReceipt.note || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="flex justify-between">
        <button
          type="submit"
          className="btn btn-sm btn-primary"
        >
          保存
        </button>
        <button
          onClick={onCancel}
          className="btn btn-sm btn-ghost text-gray-500"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
};

export default ReceiptList;