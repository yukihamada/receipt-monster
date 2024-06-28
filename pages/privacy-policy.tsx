import React from 'react';
import Link from 'next/link';
import { Footer, Header } from '../components/CommonComponents';

const PrivacyPolicy: React.FC = () => (
  <div className="min-h-screen flex flex-col transition-colors duration-300 bg-gray-100 text-gray-900">
    <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
        <h1 className="text-4xl font-extrabold mb-6 text-center">プライバシーポリシー</h1>
        <h2 className="text-2xl font-bold mb-4">1. はじめに</h2>
        <p className="mb-6">レシートモンスター（以下「当社」）は、お客様のプライバシーを尊重し、個人情報の保護に努めています。本プライバシーポリシーは、当社が収集する個人情報の種類、利用方法、保護方法について説明します。</p>
        <h2 className="text-2xl font-bold mb-4">2. 収集する情報</h2>
        <p className="mb-6">当社は、以下の情報を収集することがあります。</p>
        <ul className="list-disc list-inside mb-6 pl-6">
          <li>個人識別情報: 氏名、住所、電話番号、メールアドレスなど</li>
          <li>取引情報: 購入履歴、支払い情報など</li>
          <li>技術情報: IPアドレス、ブラウザの種類、アクセス時間など</li>
          <li>AI関連情報: AIシステムの利用に伴うデータ（例：レシートのスキャンデータ）</li>
        </ul>
        <h2 className="text-2xl font-bold mb-4">3. 情報の利用目的</h2>
        <p className="mb-6">当社は、収集した情報を以下の目的で利用します。</p>
        <ul className="list-disc list-inside mb-6 pl-6">
          <li>サービスの提供および改善</li>
          <li>ユーザーサポートの提供</li>
          <li>マーケティングおよびプロモーション活動</li>
          <li>法令遵守およびセキュリティ対策</li>
        </ul>
        <h2 className="text-2xl font-bold mb-4">4. 情報の共有</h2>
        <p className="mb-6">当社は、以下の場合に限り、第三者と情報を共有することがあります。</p>
        <ul className="list-disc list-inside mb-6 pl-6">
          <li>ユーザーの同意がある場合</li>
          <li>法令に基づく場合</li>
          <li>サービス提供のために必要な場合（例：支払い処理業者）</li>
        </ul>
        <h2 className="text-2xl font-bold mb-4">5. 安全管理措置</h2>
        <p className="mb-6">当社は、収集した個人情報を適切に管理し、不正アクセス、漏洩、改ざん、紛失を防止するための技術的および組織的な措置を講じます。具体的には以下の対策を実施しています。</p>
        <ul className="list-disc list-inside mb-6 pl-6">
          <li>データの暗号化</li>
          <li>アクセス制御</li>
          <li>定期的なセキュリティ監査</li>
        </ul>
        <h2 className="text-2xl font-bold mb-4">6. AIシステムの利用に関する透明性</h2>
        <p className="mb-6">当社は、AIシステムを利用する際に以下の点に留意します。</p>
        <ul className="list-disc list-inside mb-6 pl-6">
          <li>透明性: AIシステムの利用目的やデータの処理方法について明確に説明します。</li>
          <li>説明責任: AIシステムの決定に関する説明を求める権利をユーザーに提供します。</li>
          <li>倫理的配慮: AIシステムが偏見や差別を助長しないように設計・運用します。</li>
        </ul>
        <h2 className="text-2xl font-bold mb-4">7. 個人情報の開示、訂正、削除</h2>
        <p className="mb-6">ユーザーは、当社が保有する自身の個人情報について、開示、訂正、削除を求める権利があります。これらの要求は、以下の連絡先までご連絡ください。</p>
        <h2 className="text-2xl font-bold mb-4">8. クッキーおよびトラッキング技術</h2>
        <p className="mb-6">当社は、ウェブサイトの利用状況を分析し、サービスを改善するためにクッキーやその他のトラッキング技術を使用します。ユーザーは、ブラウザの設定を変更することでクッキーの使用を拒否することができます。</p>
        <h2 className="text-2xl font-bold mb-4">9. 国際データ転送</h2>
        <p className="mb-6">当社は、国際的なデータ転送を行う場合、適用される法令に従い、適切な保護措置を講じます。</p>
        <h2 className="text-2xl font-bold mb-4">10. プライバシーポリシーの変更</h2>
        <p className="mb-6">当社は、本プライバシーポリシーを随時変更することがあります。変更があった場合は、ウェブサイト上で通知します。</p>
        <h2 className="text-2xl font-bold mb-4">11. お問い合わせ</h2>
        <p className="mb-6">プライバシーポリシーの変更</p>
        <ul className="list-disc list-inside mb-6 pl-6">
          <li>メールアドレス: privacy@doceater.io</li>
          <li>住所: 東京都千代田区九段南１丁目６−５ 九段会館テラス ２F</li>
        </ul>
        <Link href="/" legacyBehavior><a className="text-blue-500">ホームに戻る</a></Link>
      </div>
    </main>
  </div>
);

export default PrivacyPolicy;
