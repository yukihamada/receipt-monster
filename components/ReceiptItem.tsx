import React, { useState } from 'react';
import Image from 'next/image';
import { Edit2, Trash2, Printer, Clock, Check, X } from 'lucide-react';
import { Receipt } from './types';
import { formatTimestamp, formatCurrency } from '../utils/formatters';

interface ReceiptItemProps {
  receipt: Receipt;
  deleteReceipt: (id: string) => void;
  editReceipt: (receipt: Receipt) => void;
  printReceipt: (receipt: Receipt) => void;
  uploadProgress?: number;
}

const ReceiptItem: React.FC<ReceiptItemProps> = ({
  receipt,
  deleteReceipt,
  editReceipt,
  printReceipt,
  uploadProgress
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReceipt, setEditedReceipt] = useState(receipt);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    editReceipt(editedReceipt);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedReceipt(receipt);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedReceipt(prev => ({ ...prev, [name]: value }));
  };

  const renderEditableField = (key: keyof Receipt, label: string) => (
    <div key={key} className="mb-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        name={key as string}
        value={editedReceipt[key] as string}
        onChange={handleChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      />
    </div>
  );

  const renderReadOnlyField = (key: keyof Receipt, label: string) => (
    <div key={key} className="mb-2">
      <span className="font-medium">{label}:</span>{' '}
      <span>{receipt[key] as string}</span>
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {isEditing ? (
        <>
          {renderEditableField('issuer', '発行者')}
          {renderEditableField('amount', '金額')}
          {Object.entries(receipt)
            .filter(([key]) => !['id', 'timestamp', 'issuer', 'amount', 'imageUrl', 'userId', 'imageOrientation'].includes(key))
            .map(([key, value]) => renderEditableField(key as keyof Receipt, key))}
          <div className="flex justify-end mt-4">
            <button onClick={handleSave} className="mr-2 p-2 bg-green-500 text-white rounded">
              <Check size={20} />
            </button>
            <button onClick={handleCancel} className="p-2 bg-red-500 text-white rounded">
              <X size={20} />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{receipt.issuer}</h3>
            <span className="text-xl font-bold">{formatCurrency(Number(receipt.amount))}</span>
          </div>
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
          {Object.entries(receipt)
            .filter(([key]) => !['id', 'timestamp', 'issuer', 'amount', 'imageUrl', 'userId', 'imageOrientation'].includes(key))
            .map(([key, value]) => renderReadOnlyField(key as keyof Receipt, key))}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <Clock className="mr-2" size={16} />
              <span>{formatTimestamp(receipt.timestamp)}</span>
            </div>
            <div className="flex items-center">
              <button onClick={() => printReceipt(receipt)} className="mr-2 p-2 bg-blue-500 text-white rounded">
                <Printer size={20} />
              </button>
              <button onClick={handleEdit} className="mr-2 p-2 bg-yellow-500 text-white rounded">
                <Edit2 size={20} />
              </button>
              <button onClick={() => deleteReceipt(receipt.id)} className="p-2 bg-red-500 text-white rounded">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </>
      )}
      {uploadProgress !== undefined && uploadProgress < 100 && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">アップロード中... {uploadProgress}%</p>
        </div>
      )}
    </div>
  );
};

export default ReceiptItem;