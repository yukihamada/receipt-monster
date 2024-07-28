import React, { useState, useMemo } from 'react';
import { Receipt } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ComposedChart, Area } from 'recharts';

interface ReportViewProps {
  receipts: Receipt[];
}

const ReportView: React.FC<ReportViewProps> = ({ receipts }) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('all');

  // 日本円をベースとした計算
  const filteredReceipts = useMemo(() => {
    return selectedMonth === 'all'
      ? receipts
      : receipts.filter(receipt => receipt.date.startsWith(selectedMonth));
  }, [receipts, selectedMonth]);

  const totalAmountJPY = useMemo(() => {
    return filteredReceipts.reduce((sum, receipt) => {
      return sum + (receipt.currency === 'JPY' ? Number(receipt.amount) : convertToJPY(Number(receipt.amount), receipt.currency));
    }, 0);
  }, [filteredReceipts]);

  const categorySumsJPY = useMemo(() => {
    return filteredReceipts.reduce<Record<string, number>>((sums, receipt) => {
      const category = receipt.category || 'その他';
      const amountJPY = receipt.currency === 'JPY' ? Number(receipt.amount) : convertToJPY(Number(receipt.amount), receipt.currency);
      sums[category] = (sums[category] || 0) + amountJPY;
      return sums;
    }, {});
  }, [filteredReceipts]);

  const currencySums = useMemo(() => {
    return filteredReceipts.reduce<Record<string, number>>((sums, receipt) => {
      sums[receipt.currency] = (sums[receipt.currency] || 0) + Number(receipt.amount);
      return sums;
    }, {});
  }, [filteredReceipts]);

  const months = Array.from(new Set(
    receipts
      .filter(receipt => receipt.date)
      .map(receipt => receipt.date.substring(0, 7))
  )).sort();

  const pieChartData = useMemo(() => {
    return Object.entries(categorySumsJPY).map(([category, sum]) => ({
      name: category,
      value: sum
    }));
  }, [categorySumsJPY]);

  const barChartData = useMemo(() => {
    const monthlyData: Record<string, number> = {};
    receipts.forEach(receipt => {
      if (receipt.date) {
        const month = receipt.date.substring(0, 7);
        const amountJPY = receipt.currency === 'JPY' ? Number(receipt.amount) : convertToJPY(Number(receipt.amount), receipt.currency);
        monthlyData[month] = (monthlyData[month] || 0) + amountJPY;
      }
    });
    return Object.entries(monthlyData).map(([month, sum]) => ({
      month,
      amount: sum
    })).sort((a, b) => a.month.localeCompare(b.month));
  }, [receipts]);

  const currencyTrends = useMemo(() => {
    const trends: Record<string, Record<string, number>> = {};
    receipts.forEach(receipt => {
      if (receipt.date) {
        const month = receipt.date.substring(0, 7);
        if (!trends[receipt.currency]) {
          trends[receipt.currency] = {};
        }
        trends[receipt.currency][month] = (trends[receipt.currency][month] || 0) + Number(receipt.amount);
      }
    });
    return Object.entries(trends).map(([currency, data]) => ({
      currency,
      data: Object.entries(data).map(([month, amount]) => ({ month, amount })).sort((a, b) => a.month.localeCompare(b.month))
    }));
  }, [receipts]);

  const topExpenses = useMemo(() => {
    return [...receipts]
      .sort((a, b) => convertToJPY(Number(b.amount), b.currency) - convertToJPY(Number(a.amount), a.currency))
      .slice(0, 5);
  }, [receipts]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const dailySpending = useMemo(() => {
    const daily: Record<string, number> = {};
    filteredReceipts.forEach(receipt => {
      if (receipt.date) {
        const amountJPY = receipt.currency === 'JPY' ? Number(receipt.amount) : convertToJPY(Number(receipt.amount), receipt.currency);
        daily[receipt.date] = (daily[receipt.date] || 0) + amountJPY;
      }
    });
    return Object.entries(daily).map(([date, amount]) => ({ date, amount })).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredReceipts]);

  const averageDailySpending = useMemo(() => {
    const total = dailySpending.reduce((sum, day) => sum + day.amount, 0);
    return total / dailySpending.length || 0;
  }, [dailySpending]);

  const spendingByDayOfWeek = useMemo(() => {
    const byDay: Record<string, number> = { '日': 0, '月': 0, '火': 0, '水': 0, '木': 0, '金': 0, '土': 0 };
    filteredReceipts.forEach(receipt => {
      if (receipt.date) {
        const dayOfWeek = new Date(receipt.date).getDay();
        const dayName = ['日', '月', '火', '水', '木', '金', '土'][dayOfWeek];
        const amountJPY = receipt.currency === 'JPY' ? Number(receipt.amount) : convertToJPY(Number(receipt.amount), receipt.currency);
        byDay[dayName] += amountJPY;
      }
    });
    return Object.entries(byDay).map(([day, amount]) => ({ day, amount }));
  }, [filteredReceipts]);

  return (
    <div className="bg-gray-100 p-6 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">レポート概要</h2>
      
      <div className="mb-6 flex space-x-4">
        <div>
          <label className="text-gray-700 mr-2">月選択:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded-md p-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全期間</option>
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-gray-700 mr-2">通貨選択:</label>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="border rounded-md p-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全通貨</option>
            {Object.keys(currencySums).map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label className="text-gray-700 mr-2">月選択:</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border rounded-md p-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">全期間</option>
          {months.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">総支出額（日本円）</h3>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalAmountJPY, 'JPY')}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">カテゴリ別支出（日本円）</h3>
          <ul className="space-y-2">
            {Object.entries(categorySumsJPY).map(([category, sum]) => (
              <li key={category} className="flex justify-between items-center">
                <span className="text-gray-600">{category}</span>
                <span className="font-semibold">{formatCurrency(sum, 'JPY')}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">通貨別支出</h3>
          <ul className="space-y-2">
            {Object.entries(currencySums).map(([currency, sum]) => (
              <li key={currency} className="flex justify-between items-center">
                <span className="text-gray-600">{currency}</span>
                <span className="font-semibold">
                  {formatCurrency(sum, currency)}
                  {currency !== 'JPY' && (
                    <span className="text-sm text-gray-500 ml-2">
                      (約 {formatCurrency(convertToJPY(sum, currency), 'JPY')})
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">カテゴリ別支出（円グラフ）</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number, 'JPY')} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">月別支出（棒グラフ）</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barChartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value as number, 'JPY')} />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">通貨別支出トレンド</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart>
            <XAxis dataKey="month" allowDuplicatedCategory={false} />
            <YAxis />
            <Tooltip />
            <Legend />
            {currencyTrends.map((currency, index) => (
              <Line
                key={currency.currency}
                type="monotone"
                dataKey="amount"
                data={currency.data}
                name={currency.currency}
                stroke={COLORS[index % COLORS.length]}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">トップ5支出</h3>
        <ul className="space-y-2">
          {topExpenses.map((expense, index) => (
            <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-600">{expense.category || 'カテゴリなし'} - {expense.date}</span>
              <span className="font-semibold">
                {formatCurrency(Number(expense.amount), expense.currency)}
                {expense.currency !== 'JPY' && (
                  <span className="text-sm text-gray-500 ml-2">
                    (約 {formatCurrency(convertToJPY(Number(expense.amount), expense.currency), 'JPY')})
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {currencyTrends.map(currency => (
          <div key={currency.currency} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">{currency.currency}の月別支出</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={currency.data}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number, currency.currency)} />
                <Bar dataKey="amount" fill={COLORS[currencyTrends.indexOf(currency) % COLORS.length]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">日別支出と平均（日本円）</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={dailySpending}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value as number, 'JPY')} />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" name="日別支出" />
            <Line type="monotone" dataKey="amount" stroke="#ff7300" dot={false} name="支出トレンド" />
            <Area type="monotone" dataKey={() => averageDailySpending} fill="#82ca9d" stroke="#82ca9d" name="平均支出" />
          </ComposedChart>
        </ResponsiveContainer>
        <p className="mt-2 text-center text-gray-600">平均日別支出: {formatCurrency(averageDailySpending, 'JPY')}</p>
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">曜日別支出（日本円）</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={spendingByDayOfWeek}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value as number, 'JPY')} />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

// 他の通貨を日本円に変換する関数（実際のレートは適宜更新してください）
function convertToJPY(amount: number, currency: string): number {
  const rates = {
    USD: 110,
    EUR: 130,
    // 他の通貨のレートを追加
  };
  return amount * (rates[currency as keyof typeof rates] || 1);
}

export default ReportView;