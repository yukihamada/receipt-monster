import React from 'react';
import Link from 'next/link';
import { Footer, Header } from './CommonComponents';

const Contact: React.FC = () => (
  <div className="min-h-screen flex flex-col transition-colors duration-300 bg-gray-100 text-gray-900">
    <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">お問い合わせ</h1>
        <p className="mb-4">ご質問やご意見がございましたら、以下の方法でお気軽にお問い合わせください。</p>
        <ul className="list-disc list-inside mb-4">
          <li>Discord: <a href="https://discord.gg/receipt-monster" className="text-blue-500 hover:underline">レシートモンスター公式Discord</a></li>
          <li>X (旧Twitter): <a href="https://twitter.com/chatTBD" className="text-blue-500 hover:underline">@receiptmonster</a></li>
          <li>GitHub: <a href="https://github.com/yukihamada/receipt-monster" className="text-blue-500 hover:underline">レシートモンスターGitHubリポジトリ</a></li>
        </ul>
        <p className="mb-4">会員の方は、専用のチャットボットをご利用いただけます。迅速なサポートを提供いたしますので、ぜひご活用ください。</p>
        <p className="mb-4">我々のプロジェクトはオープンソースであり、誰でもいつでも貢献可能です。興味のある方は、GitHubリポジトリをチェックしてみてください。</p>
        <Link href="/" legacyBehavior><a className="text-blue-500 hover:underline">ホームに戻る</a></Link>
      </div>
    </main>
  </div>
);

export default Contact;