import React, { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Footer, Header } from '../components/CommonComponents';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { User } from 'firebase/auth';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Pricing: FC = () => {
  const [session, setSession] = useState<User | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string>('loading'); // 初期値を設定
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setSession(user);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (session) {
      // ここでcurrentPlanを取得するロジックを追加
      setCurrentPlan('free'); // 例として'free'を設定
    } else {
      setCurrentPlan(''); // 'null' ではなく空文字を設定
    }
  }, [session]);

  const handlePlanChange = async (plan: string) => {
    if (plan === 'premium') return; // プレミアムプランは現在準備中

    const stripe = await stripePromise;
    const priceId = plan === 'free' ? 'free' : 'price_1PViCADqLakc8NxkufpnGVy4'; // price_id_for_standard

    const { error } = await stripe!.redirectToCheckout({
      lineItems: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      successUrl: window.location.origin + '/success',
      cancelUrl: window.location.origin + '/cancel',
    });

    if (error) {
      console.error('Stripe checkout error:', error);
    } else {
      setCurrentPlan(plan);
    }
  };

  return (
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
                    <ul className="space-y-2 text-gray-700 mb-4">
                      <li><FaCheck className="inline-block text-green-500 mr-2" />基本機能の利用</li>
                      <li><FaCheck className="inline-block text-green-500 mr-2" />広告表示</li>
                      <li><FaCheck className="inline-block text-green-500 mr-2" />コミュニティサポート</li>
                      <li><FaCheck className="inline-block text-green-500 mr-2" />月間10件までの認証</li>
                      <li><FaCheck className="inline-block text-green-500 mr-2" />基本レポート</li>
                    </ul>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-gray-700 text-2xl font-bold">月額 ¥0</p>
                    <button
                      onClick={() => handlePlanChange('free')}
                      className={`inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 mt-4 ${currentPlan === 'free' ? 'cursor-not-allowed' : ''}`}
                      disabled={currentPlan === 'free'}
                    >
                      {currentPlan === 'free' ? '現在加入中' : (session ? 'このプランに変更' : 'サインアップ')}
                    </button>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between border border-gray-200">
                  <div>
                    <h2 className="text-2xl font-semibold mb-4 text-blue-500">スタンダードプラン</h2>
                    <ul className="space-y-2 text-gray-700 mb-4">
                      <li><FaCheck className="inline-block text-green-500 mr-2" />基本機能の利用</li>
                      <li><FaCheck className="inline-block text-green-500 mr-2" />ドキュメントの存在証明</li>
                      <li><FaCheck className="inline-block text-green-500 mr-2" />月間500件までの認証</li>
                      <li><FaCheck className="inline-block text-green-500 mr-2" />優先サポート</li>
                      <li><FaCheck className="inline-block text-green-500 mr-2" />広告非表示</li>
                      <li><FaCheck className="inline-block text-green-500 mr-2" />詳細レポート</li>
                      <li><FaCheck className="inline-block text-green-500 mr-2" />カスタム通知</li>
                    </ul>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-gray-700 text-2xl font-bold">月額 ¥1,280</p>
                    <button
                      onClick={() => handlePlanChange('standard')}
                      className={`inline-block bg-gradient-to-r from-orange-400 to-orange-600 text-white py-2 px-4 rounded hover:from-orange-500 hover:to-orange-700 transition duration-300 mt-4 ${currentPlan === 'standard' ? 'cursor-not-allowed' : ''}`}
                      disabled={currentPlan === 'standard'}
                    >
                      {currentPlan === 'standard' ? '現在加入中' : (session ? 'このプランに変更' : 'サインアップ')}
                    </button>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between border border-gray-200">
                  <div>
                    <h2 className="text-2xl font-semibold mb-4 text-blue-500">プレミアムプラン</h2>
                    <ul className="space-y-2 text-gray-700 mb-4">
                      <li><FaCheck className="inline-block text-green-500 mr-2" />全ての機能の利用</li>
                      <li><FaCheck className="inline-block text-green-500 mr-2" />ドキュントの存在証明</li>
                      <li><FaCheck className="inline-block text-green-500 mr-2" />ビットコイン対応</li>
                      <li><FaCheck className="inline-block text-green-500 mr-2" />イーサリアム対応</li>
                      <li><FaCheck className="inline-block text-green-500 mr-2" />月間2000件までの認証</li>
                      <li><FaCheck className="inline-block text-green-500 mr-2" />プレミアムサポート</li>
                      <li><FaCheck className="inline-block text-green-500 mr-2" />高度なレポート</li>
                      <li><FaCheck className="inline-block text-green-500 mr-2" />Zapier対応</li>
                      <li><FaCheck className="inline-block text-green-500 mr-2" />API提供</li>
                    </ul>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-red-500 text-center mt-4">現在準備中です。</p>
                    <p className="text-gray-400 text-2xl font-bold">月額 ¥3,980</p>
                    <button
                      className="inline-block bg-gray-400 text-white py-2 px-4 rounded cursor-not-allowed mt-4"
                      disabled
                    >
                      {session ? 'このプランに変更' : 'サインアップ'}
                    </button>
                  </div>
                </div>
              </div>
              <Link href="/specified-commercial-transactions" legacyBehavior>
                      <a className="text-blue-400 text-center hover:underline mt-4 block">特定商取引法に基づく表記</a>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
