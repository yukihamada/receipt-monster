import React from 'react';
import Link from 'next/link';
import { FaUser, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import Head from 'next/head';
import { Footer } from './CommonComponents';

const Blog: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      <Head>
        <title>開発ブログ</title>
      </Head>
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-5xl font-extrabold mb-12 text-center">開発ブログ</h1>
        <div className="max-w-3xl mx-auto space-y-12">
          <article className="bg-gray-800 shadow-xl rounded-lg p-8 transition-transform transform hover:scale-105 hover:shadow-2xl">
            <h2 className="text-4xl font-semibold mb-6">プロジェクトを始めました</h2>
            <p className="text-gray-400 mb-4 flex items-center">
              <FaUser className="mr-2" /> 投稿者: <Link href="https://x.com/yukihamada" legacyBehavior><a className="text-blue-400 hover:underline">yukihamada</a></Link>
              <span className="mx-4">|</span> <FaCalendarAlt className="mr-2" /> 日付: 2024年6月26日
            </p>
            <p className="text-gray-300 mb-6">
              こんにちは、皆さん！私たちは新しいプロジェクトを始めました。このプロジェクトは、レシートをスキャンして会計管理や家計簿管理ができるアプリを開発することです。
            </p>
            <p className="text-gray-300 mb-6">
              このアプリは、ユーザーが簡単にレシートをスキャンし、支出を追跡できるように設計されています。さらに、支出のカテゴリー分けや月ごとのレポート機能も提供します。
            </p>
            <p className="text-gray-300">
              今後のアップデートで、さらに多くの機能を追加していく予定です。ぜひご期待ください！
            </p>
            <div className="text-right mt-6">
              <Link href="/blog/project-start" legacyBehavior>
                <a className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-md hover:from-blue-600 hover:to-purple-700 transition-colors">
                  詳細を見る <FaArrowRight className="ml-2" />
                </a>
              </Link>
            </div>
          </article>
          <article className="bg-gray-800 shadow-xl rounded-lg p-8 transition-transform transform hover:scale-105 hover:shadow-2xl">
            <h2 className="text-4xl font-semibold mb-6">アプリの機能紹介</h2>
            <p className="text-gray-400 mb-4 flex items-center">
              <FaUser className="mr-2" /> 投稿者: <Link href="https://x.com/yukihamada" legacyBehavior><a className="text-blue-400 hover:underline">yukihamada</a></Link>
              <span className="mx-4">|</span> <FaCalendarAlt className="mr-2" /> 日付: 2023年6月26日
            </p>
            <p className="text-gray-300 mb-6">
              私たちのアプリは、以下のような機能を提供します：
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li>レシートのスキャンと自動読み取り</li>
              <li>支出のカテゴリー分け</li>
              <li>月ごとの支出レポート</li>
              <li>クラウド同期によるデータのバックアップ</li>
              <li>複数デバイスでのデータ共有</li>
            </ul>
            <p className="text-gray-300">
              これらの機能により、ユーザーは簡単に支出を管理し、家計を効率的に運営することができます。今後もユーザーのフィードバックを基に、さらなる改善を行っていきます。
            </p>
            <div className="text-right mt-6">
              <Link href="/blog/app-features" legacyBehavior>
                <a className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-md hover:from-blue-600 hover:to-purple-700 transition-colors">
                  詳細を見る <FaArrowRight className="ml-2" />
                </a>
              </Link>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
};

export default Blog;
