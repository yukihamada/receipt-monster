import React, { FC } from 'react';
import Head from 'next/head';
import { Footer, Header } from './CommonComponents';
import Link from 'next/link';

const SpecifiedCommercialTransactions: FC = () => {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-gray-100 text-gray-900">
      <Head>
        <title>レシートモンスター - 特定商取引法に基づく表記</title>
      </Head>
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">特定商取引法に基づく表記</h1>
              <div className="space-y-4 text-gray-700">
                <h2 className="text-2xl font-semibold">販売事業者</h2>
                <p>株式会社イネブラ</p>

                <h2 className="text-2xl font-semibold">代表者</h2>
                <p>濱田優貴</p>

                <h2 className="text-2xl font-semibold">所在地</h2>
                <p>〒102-0074<br />東京都千代田区九段南１丁目６−５ 九段会館テラス ２F</p>

                <h2 className="text-2xl font-semibold">電話番号</h2>
                <p>050-5899-5265</p>

                <h2 className="text-2xl font-semibold">メールアドレス</h2>
                <p>contact@docseater.io</p>

                <h2 className="text-2xl font-semibold">ウェブサイトURL</h2>
                <p><a href="https://docseater.io" className="text-blue-500 hover:underline">https://docseater.io</a></p>

                <h2 className="text-2xl font-semibold">商品の名称</h2>
                <p>ドクシーター（レシート管理・経費精算クラウドサービス）</p>

                <h2 className="text-2xl font-semibold">商品の価格</h2>
                <ul className="list-disc list-inside">
                  <li>無料プラン：0円（月額）</li>
                  <li>スタンダードプラン：1,280円（月額・税込）</li>
                  <li>プレミアムプラン：3,980円（月額・税込）</li>
                </ul>
                <p>※ 価格は予告なく変更される場合があります。</p>

                <h2 className="text-2xl font-semibold">商品代金以外の必要料金</h2>
                <p>サービスの利用にあたってはインターネット接続環境が必要となり、通信料はお客様のご負担となります。</p>

                <h2 className="text-2xl font-semibold">支払方法</h2>
                <p>クレジットカード決済（VISA, MasterCard, American Express, JCB）</p>

                <h2 className="text-2xl font-semibold">支払時期</h2>
                <p>毎月1日に当月分をお支払いいただきます。</p>

                <h2 className="text-2xl font-semibold">商品の提供時期</h2>
                <p>お申し込み完了後、即時にサービスをご利用いただけます。</p>

                <h2 className="text-2xl font-semibold">返品・キャンセル</h2>
                <p>本サービスの性質上、返品は受け付けておりません。キャンセル（解約）は、マイページから随時可能です。解約された場合、次回更新日以降のサービス提供および課金は行いません。</p>

                <h2 className="text-2xl font-semibold">動作環境</h2>
                <ul className="list-disc list-inside">
                  <li>推奨ブラウザ：Google Chrome（最新版）、Mozilla Firefox（最新版）、Safari（最新版）、Microsoft Edge（最新版）</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="py-6 bg-gray-200 text-center">
        <Link href="/price">
          <a className="inline-block px-6 py-3 text-white bg-gradient-to-r from-blue-500 to-green-500 rounded-full shadow-lg hover:from-blue-600 hover:to-green-600 transition-colors duration-300">
            料金ページに戻る
          </a>
        </Link>
      </footer>
    </div>
  );
};

export default SpecifiedCommercialTransactions;
