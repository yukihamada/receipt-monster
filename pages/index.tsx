import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

const ReceiptMonsterApp = dynamic(() => import('../components/ReceiptMonsterApp'), { ssr: false });

const Home: React.FC = () => {
  const renderValue = (value: any) => {
    // 値が null または undefined の場合は空文字列を返す
    if (value == null) {
      return '';
    }
    // 値がオブジェクトの場合は JSON 文字列に変換して返す
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    // その他の場合は文字列に変換して返す
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