import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut, updatePassword } from 'firebase/auth';
import { Header, Footer } from './CommonComponents';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const AccountPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState('無料プラン');
  const [newPassword, setNewPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  const handlePasswordChange = async () => {
    try {
      if (user) {
        await updatePassword(user, newPassword);
        alert('パスワードが更新されました');
        setNewPassword('');
      }
    } catch (error) {
      console.error('パスワード更新エラー:', error);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: await user.getIdToken() }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      if (!stripe) {
        console.error('Stripeの初期化に失敗しました');
        return;
      }
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('チェックアウトエラー:', error);
    }
  };

  if (!user) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Head>
        <title>マイアカウント</title>
      </Head>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">マイアカウント</h1>
        
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">ユーザー情報</h2>
            <p className="text-gray-700"><strong>メールアドレス:</strong> {user.email}</p>
            <p className="text-gray-700"><strong>現在のプラン:</strong> {currentPlan}</p>
            <div className="mt-6 text-center">
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition duration-300"
              >
                ログアウト
              </button>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">プラン変更</h2>
            <select
              className="w-full border rounded p-2 mb-4 text-gray-700 bg-white"
              value={currentPlan}
              onChange={(e) => setCurrentPlan(e.target.value)}
            >
              <option value="無料プラン">無料プラン</option>
              <option value="ベーシックプラン">ベーシックプラン</option>
              <option value="プロフェッショナルプラン">プロフェッショナルプラン</option>
            </select>
            <div className="text-center">
              <button
                onClick={handleCheckout}
                className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300"
              >
                プランを変更
              </button>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">支払い管理</h2>
            <p className="text-gray-700 mb-4">現在の支払い方��: クレジットカード（**** **** **** 1234）</p>
            <div className="text-center">
              <button className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition duration-300">
                支払い方法を変更
              </button>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">セキュリティ設定</h2>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700">新しいパスワード:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded p-2 text-gray-700"
              />
            </div>
            <div className="text-center">
              <button
                onClick={handlePasswordChange}
                className="bg-yellow-500 text-white px-6 py-2 rounded-full hover:bg-yellow-600 transition duration-300"
              >
                パスワードを変更
              </button>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">ブロックチェーン設定</h2>
            <p className="text-gray-700 mb-4">ウォレットアドレス: 0x1234...5678</p>
            <div className="text-center">
              <button className="bg-purple-500 text-white px-6 py-2 rounded-full hover:bg-purple-600 transition duration-300">
                ウォレットを接続
              </button>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">レシートアップロード</h2>
            <input type="file" accept="image/*" className="mb-4 text-gray-700" />
            <div className="text-center">
              <button
                onClick={() => router.push('/')}
                className="bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 transition duration-300"
              >
                レシートをアップロード
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AccountPage;
