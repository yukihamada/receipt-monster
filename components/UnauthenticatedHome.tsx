import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const UnauthenticatedHome: React.FC = () => {
  const features = [
    { icon: '📊', title: '簡単経費管理', description: 'レシートをアップロードするだけで自動的に経費を分類・集計します。' },
    { icon: '🕒', title: 'タイムスタンプ機能', description: '正確な日時記録で、税務申告時の手間を大幅に削減できます。' },
    { icon: '📱', title: 'どこでも利用可能', description: 'スマートフォンやPCから、いつでもどこでもアクセス可能です。' },
    { icon: '🔒', title: 'セキュアな保管', description: 'データは暗号化されて安全に保管されます。' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center mb-12">
        <Image
          src="/leaf/eating.webp"
          alt="レシートモンスター"
          width={200}
          height={200}
          className="mx-auto mb-6"
        />
        <h1 className="text-4xl font-bold mb-4 text-blue-800">レシートモンスターで経費管理を革新しよう！</h1>
        <p className="text-xl mb-8 text-gray-600">面倒な経費管理をスマートに。今すぐ始めましょう。</p>
        <Link href="/signup" className="btn btn-primary btn-lg inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 text-lg">
          今すぐ無料で始める
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h3 className="text-2xl font-semibold mb-2 text-blue-800">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="mb-16 bg-blue-100 p-8 rounded-2xl shadow-md">
        <h3 className="text-3xl font-bold mb-4 text-blue-800">今なら1ヶ月無料トライアル実施中！</h3>
        <p className="text-xl mb-6 text-blue-700">
          会員登録後、1ヶ月間すべての機能を無料でお試しいただけます。<br />
          この機会にぜひレシートモンスターの便利さを体験してください。
        </p>
        <Link href="/signup" className="btn btn-secondary btn-lg inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-full border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300 text-lg">
          無料トライアルを始める
        </Link>
      </div>

      <div className="text-center">
        <p className="text-lg text-gray-600 mb-4">
          すでにアカウントをお持ちの方は
          <Link href="/login" className="text-blue-600 hover:underline ml-1 font-semibold">
            こちらからログイン
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UnauthenticatedHome;