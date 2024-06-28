import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../firebase';
import { User } from 'firebase/auth';
import Image from 'next/image';

const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            {user?.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.displayName || 'ユーザー画像'}
                width={192}
                height={192}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/path/to/default-image.jpg';
                }}
              />
            ) : (
              <div className="h-48 w-full md:w-48 bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500 text-2xl">No Image</span>
              </div>
            )}
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">管理者ダッシュボード</div>
            {user ? (
              <>
                <h2 className="block mt-1 text-lg leading-tight font-medium text-black">{user.displayName || 'ユーザー名未設定'}</h2>
                <p className="mt-2 text-gray-500">メール: {user.email}</p>
                <p className="mt-2 text-gray-500">UID: {user.uid}</p>
                <p className="mt-2 text-gray-500">電話番号: {user.phoneNumber || '未設定'}</p>
                <p className="mt-2 text-gray-500">メール認証: {user.emailVerified ? '済' : '未'}</p>
              </>
            ) : (
              <p className="mt-2 text-gray-500">ログインしていません</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/admin/users" legacyBehavior>
          <a className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-center transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
            ユーザー一覧
          </a>
        </Link>
        <Link href="/admin/receipts" legacyBehavior>
          <a className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg text-center transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
            レシート一覧
          </a>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
