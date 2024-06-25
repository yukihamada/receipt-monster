import React from 'react';
import Link from 'next/link';
import { Footer, Header } from './CommonComponents';

const About: React.FC = () => (
  <div className="min-h-screen flex flex-col transition-colors duration-300 bg-gray-100 text-gray-900">
    <Header />
    <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">概要</h1>
        <p className="mb-4">レシートモンスターは、レシートの管理と分析を簡単にするためのツールです。私たちの目標は、ユーザーが日常の支出をより良く理解し、管理できるようにすることです。</p>
        <p className="mb-4">このページでは、レシートモンスターの機能や利点について詳しく説明します。</p>
        <section className="mb-4">
          <p>このページはレシートモンスターの概要を説明します。</p>
        </section>
        <section className="mb-4">
          <h2 className="text-2xl font-bold mb-2">レシートモンスター：簡単なレシート管理とオンライン証明ツール</h2>
          <h3 className="text-xl font-bold mb-2">目標</h3>
          <p className="mb-4">レシートモンスターの目標は、ユーザーが日常の支出をより良く理解し、管理することに加え、世の中から不必要な紙をなくし、書類の証明をオンラインで手軽に行えるようにすることです。これにより、環境保護と効率的な書類管理を実現します。</p>
          <h3 className="text-xl font-bold mb-2">主な機能</h3>
          <ul className="list-disc list-inside mb-4">
            <li><strong>レシートのデジタル化</strong>：スマホでレシートを撮影するだけで、自動的にデジタル化され、データベースに保存されます。</li>
            <li><strong>支出の自動分類</strong>：AIがレシートの内容を解析し、支出をカテゴリーごとに自動的に分類します。食費、交通費、娯楽費など、細かく分類して把握することができます。</li>
            <li><strong>レポート生成</strong>：日々、週、月ごとの支出レポートを自動生成し、どのカテゴリーにどれだけお金を使っているのか一目で分かります。</li>
            <li><strong>予算設定</strong>：各カテゴリーごとに予算を設定し、リアルタイムで予算の使用状況を確認できます。</li>
            <li><strong>通知機能</strong>：設定した予算を超えそうな場合や、特定のカテゴリーでの支出が増えた場合にアラート通知が届きます。</li>
          </ul>
          <h3 className="text-xl font-bold mb-2">レシートモンスターならではの機能</h3>
          <ul className="list-disc list-inside mb-4">
            <li><strong>モンスターキャラクター</strong>：ユーザーは自分の「モンスター」を育てることができ、レシートを食べさせることでモンスターが成長します。モンスターはレシートを記憶し、成長に応じて新しい能力を獲得します。</li>
            <li><strong>モンスターのタイムスタンプ機能</strong>：モンスターはレシートのデータに対してブロックチェーンを使ったタイムスタンプを付与し、改ざん不可な形で保存。これにより、データの存在証明が可能となります。</li>
            <li><strong>オンライン証明</strong>：タイムスタンプ付きのレシートデータは、税務署への提出や会社の経費精算など、公式な書類として利用できます。オンラインで手軽に証明を行うことができます。</li>
            <li><strong>QRコード支出追跡</strong>：提携店舗での支払い時に、レシートモンスター専用のQRコードをスキャンすることで、自動的に支出を追跡・記録する機能。</li>
          </ul>
          <h3 className="text-xl font-bold mb-2">技術スタック</h3>
          <ul className="list-disc list-inside mb-4">
            <li><strong>オープンソース</strong>：レシートモンスターはオープンソースで開発されており、誰でもコードを確認し、改善提案ができます。</li>
            <li><strong>NEXT.js</strong>：モダンなフロントエンドフレームワークであるNEXT.jsを使用し、スムーズなユーザー体験を提供。</li>
            <li><strong>Vercel</strong>：Vercelなどのサービスを利用することで、すぐにシステムを立ち上げることが可能な分散システムです。</li>
          </ul>
          <h3 className="text-xl font-bold mb-2">料金プラン</h3>
          <p className="mb-4"><strong>個人会員</strong>：月額1,980円で全ての機能を利用可能。</p>
          <h3 className="text-xl font-bold mb-2">利点</h3>
          <ul className="list-disc list-inside mb-4">
            <li><strong>環境保護</strong>：不必要な紙の使用を減らし、���境保護に貢献します。</li>
            <li><strong>時間の節約</strong>：レシートを手動で整理する手間を省き、スマホ一つで簡単に管理できます。</li>
            <li><strong>精確な管理</strong>：細かい支出を見逃さず、正確な支出管理が可能です。</li>
            <li><strong>賢いお金の使い方</strong>：支出のパターンを把握し、無駄遣いを減らすことができます。</li>
            <li><strong>公式書類としての利用</strong>：タイムスタンプ付きのデータは、公式な書類として利用でき、税務署や会社の経費精算に役立ちます。</li>
          </ul>
        </section>
        <section className="mb-4">
          <h2 className="text-2xl font-bold mb-2">レシートモンスターで、賢いお金の使い方を始めましょう！</h2>
          <p className="mb-4">楽しいモンスターたちと一緒に、支出管理をゲーム感覚で楽しみながら、環境にも貢献しませんか？</p>
        </section>
        <Link href="/" legacyBehavior><a className="text-blue-500 hover:underline">ホームに戻る</a></Link>
      </div>
    </main>
    <Footer />
  </div>
);

export default About;