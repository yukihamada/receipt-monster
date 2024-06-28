import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

const ReceiptMonsterApp = dynamic(() => import('../components/ReceiptMonsterApp'), { ssr: false });

const Home: React.FC = () => {
  const renderValue = (value: any) => {
    // ここに値をレンダリングするロジックを追加します
    return value.toString();
  };

  return (
    <>
      <Head>
        <title>レシートモンスター - 経理をスマートに</title>
        <meta name="description" content="レシートを簡単に管理・分析できるアプリ" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ReceiptMonsterApp renderValue={renderValue} />
    </>
  );
};

export default Home;