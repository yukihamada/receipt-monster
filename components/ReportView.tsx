import React from 'react';
import { Receipt } from '../types';

interface ReportViewProps {
  receipts: Receipt[];
}

const ReportView: React.FC<ReportViewProps> = ({ receipts }) => {
  const totalAmount = receipts.reduce((sum, receipt) => sum + Number(receipt.amount), 0);
  const categorySums = receipts.reduce<Record<string, number>>((sums, receipt) => {
    const category = receipt.category || 'その他';
    sums[category] = (sums[category] || 0) + Number(receipt.amount);
    return sums;
  }, {});

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">レポート概要</h2>
      <p className="mb-2">総支出額: ¥{totalAmount.toLocaleString()}</p>
      <h3 className="text-lg font-semibold mb-2">カテゴリ別支出</h3>
      <ul>
        {Object.entries(categorySums).map(([category, sum]) => (
          <li key={category} className="mb-1">
            {category}: ¥{sum.toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportView;