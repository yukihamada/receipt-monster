import React, { FC } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Footer, Header } from './CommonComponents';
import { FaCheck, FaTimes } from 'react-icons/fa';

const Pricing: FC = () => (
  <div className="min-h-screen flex flex-col transition-colors duration-300 bg-gray-100 text-gray-900">
    <Head>
      <title>レシートモンスター - 料金一覧</title>
    </Head>
    <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">料金一覧</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between border border-gray-200">
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-blue-500">無料プラン</h2>
                  <p className="text-gray-700 mb-4">月額 ¥0</p>
                  <ul className="space-y-2 text-gray-700 mb-4">
                    <li><FaCheck className="inline-block text-green-500 mr-2" />基本機能の利用</li>
                    <li><FaCheck className="inline-block text-green-500 mr-2" />広告表示</li>
                    <li><FaCheck className="inline-block text-green-500 mr-2" />コミュニティサポート</li>
                    <li><FaCheck className="inline-block text-green-500 mr-2" />月間10件までの認証</li>
                    <li><FaCheck className="inline-block text-green-500 mr-2" />基本レポート</li>
                  </ul>
                </div>
                <div className="text-center mt-4">
                  <Link href="/signup" legacyBehavior>
                    <a className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">サインアップ</a>
                  </Link>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between border border-gray-200">
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-blue-500">スタンダードプラン</h2>
                  <p className="text-gray-700 mb-4">月額 ¥1,280</p>
                  <ul className="space-y-2 text-gray-700 mb-4">
                    <li><FaCheck className="inline-block text-green-500 mr-2" />基本機能の利用</li>
                    <li><FaCheck className="inline-block text-green-500 mr-2" />ドキュメントの存在証明</li>
                    <li><FaCheck className="inline-block text-green-500 mr-2" />月間100件までの認証</li>
                    <li><FaCheck className="inline-block text-green-500 mr-2" />優先サポート</li>
                    <li><FaCheck className="inline-block text-green-500 mr-2" />広告非表示</li>
                    <li><FaCheck className="inline-block text-green-500 mr-2" />詳細レポート</li>
                    <li><FaCheck className="inline-block text-green-500 mr-2" />カスタム通知</li>
                  </ul>
                </div>
                <div className="text-center mt-4">
                  <Link href="/signup" legacyBehavior>
                    <a className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">サインアップ</a>
                  </Link>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between border border-gray-200">
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-blue-500">プレミアムプラン</h2>
                  <p className="text-gray-700 mb-4">月額 ¥3,980</p>
                  <ul className="space-y-2 text-gray-700 mb-4">
                    <li><FaCheck className="inline-block text-green-500 mr-2" />全ての機能の利用</li>
                    <li><FaCheck className="inline-block text-green-500 mr-2" />ドキュメントの存在証明</li>
                    <li><FaCheck className="inline-block text-green-500 mr-2" />ビットコイン対応</li>
                    <li><FaCheck className="inline-block text-green-500 mr-2" />イーサリアム対応</li>
                    <li><FaCheck className="inline-block text-green-500 mr-2" />月間1000件までの認証</li>
                    <li><FaCheck className="inline-block text-green-500 mr-2" />プレミアムサポート</li>
                    <li><FaCheck className="inline-block text-green-500 mr-2" />高度なレポート</li>
                    <li><FaCheck className="inline-block text-green-500 mr-2" />Zapier対応</li>
                    <li><FaCheck className="inline-block text-green-500 mr-2" />API提供</li>
                  </ul>
                  <p className="text-red-500 text-center mt-4">現在準備中です。</p>
                </div>
                <div className="text-center mt-4">
                  <Link href="/signup" legacyBehavior>
                    <a className="inline-block bg-gray-400 text-white py-2 px-4 rounded cursor-not-allowed">サインアップ</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
);

export default Pricing;