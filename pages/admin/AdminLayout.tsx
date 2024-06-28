import React from 'react';
import Link from 'next/link';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <header className="bg-indigo-600 text-white py-6 shadow-lg">
          <div className="container mx-auto flex justify-between items-center px-4">
            <h1 className="text-2xl font-bold">管理画面</h1>
            <nav className="space-x-6">
              <Link href="/admin" legacyBehavior>
                <a className="hover:text-indigo-200 transition duration-300">ホーム</a>
              </Link>
              <Link href="/admin/users" legacyBehavior>
                <a className="hover:text-indigo-200 transition duration-300">ユーザー一覧</a>
              </Link>
              <Link href="/admin/receipts" legacyBehavior>
                <a className="hover:text-indigo-200 transition duration-300">レシート一覧</a>
              </Link>
              <Link href="/admin/admins" legacyBehavior>
                <a className="hover:text-indigo-200 transition duration-300">管理者一覧</a>
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-grow container mx-auto my-8 p-8 bg-white rounded-xl shadow-xl">
          {children}
        </main>
        <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} 管理画面. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  };

export default AdminLayout;