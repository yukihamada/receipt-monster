import React from 'react';
import Head from 'next/head';
import { Footer } from '../CommonComponents';

interface BlogLayoutProps {
  title: string;
  children: React.ReactNode;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({ title, children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      <Head>
        <title>{title}</title>
      </Head>
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-5xl font-extrabold mb-12 text-center">{title}</h1>
        <div className="max-w-3xl mx-auto space-y-12">
          {children}
        </div>
      </main>
    </div>
  );
};

export default BlogLayout;