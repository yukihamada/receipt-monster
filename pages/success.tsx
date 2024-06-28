import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Footer, Header } from '../components/CommonComponents';

const Success: React.FC = () => {
  return (
    <React.Fragment>
      <Head>
        <title>レシートモンスター - 決済成功</title>
      </Head>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-100 to-green-200 text-gray-900">
        <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
            <h1 className="text-4xl font-extrabold text-center text-green-600">決済成功</h1>
            <p className="text-center text-gray-700">ご購入ありがとうございます！</p>
            <p className="text-center text-gray-700">ご注文の詳細はメールでお送りしました。</p>
            <div className="mt-6">
              <Link href="/" legacyBehavior>
                <a className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out">
                  ホームに戻る
                </a>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </React.Fragment>
  );
};

export default Success;
