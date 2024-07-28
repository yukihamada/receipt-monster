'use client';

import React from 'react';
import Head from 'next/head';
import { useAuth } from '../hooks/useAuth';
import AuthenticatedHome from '../components/AuthenticatedHome';
import UnauthenticatedHome from '../components/UnauthenticatedHome';

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <Head>
        <title>レシートモンスター - 経理をスマートに</title>
        <meta name="description" content="レシートを簡単に管理・分析できるアプリ。経費管理を革新し、税務申告も楽々。" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col">
        {user ? <AuthenticatedHome /> : <UnauthenticatedHome />}

        <footer className="bg-white mt-auto">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
            <p>&copy; 2023 レシートモンスター. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}