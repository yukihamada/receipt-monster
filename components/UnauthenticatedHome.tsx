import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const UnauthenticatedHome: React.FC = () => {
  const features = [
    { icon: '📊', title: '簡単経費管理', description: 'レシートをアップロードするだけで自動的に経費を分類・集計します。' },
    { icon: '🕒', title: 'タイムスタンプ機能', description: '正確な日時記録で、税務申告時の手間を大幅に削減できます。' },
    { icon: '📱', title: 'どこでも利用可能', description: 'スマートフォンやPCから、いつでもどこでもアクセス可能です。' },
    { icon: '🔒', title: 'セキュアな保管', description: 'データは暗号化されて安全に保管されます。' },
  ];

  return (
    <div className="text-center max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">レシートモンスターで経費管理を革新しよう！</h2>
      <p className="text-xl mb-8">面倒な経費管理をスマートに。今すぐ始めましょう。</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p>{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="mb-12">
        <h3 className="text-2xl font-bold mb-4">今なら1ヶ月無料トライアル実施中！</h3>
        <p className="text-lg mb-6">
          会員登録後、1ヶ月間すべての機能を無料でお試しいただけます。<br />
          この機会にぜひレシートモンスターの便利さを体験してください。
        </p>
      </div>

      <div className="space-y-4">
        <Link href="/signup" className="btn btn-primary btn-lg block w-full max-w-md mx-auto">
          今すぐ無料で始める
        </Link>
        <p className="text-sm">
          すでにアカウントをお持ちの方は
          <Link href="/login" className="text-blue-600 hover:underline">
            こちらからログイン
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UnauthenticatedHome;