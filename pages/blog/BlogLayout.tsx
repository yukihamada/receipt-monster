import React, { Fragment } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Footer } from '../../components/CommonComponents';

interface BlogLayoutProps {
  title: string;
  children: React.ReactNode;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({ title, children }) => {
  return (
    <Fragment>
      <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
        <Head>
          <title>{title} - レシートモンスター開発ブログ</title>
        </Head>
        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-5xl font-extrabold mb-12 text-center">{title}</h1>
          <div className="max-w-3xl mx-auto space-y-12">
            {children}
          </div>
          <div className="text-center mt-12">
            <Link href="/blog" legacyBehavior>
              <a className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-md hover:from-blue-600 hover:to-purple-700 transition-colors">
              ブログに一覧に戻る
              </a>
            </Link>
          </div>
        </main>
      </div>
    </Fragment>
  );
};

export default BlogLayout;
