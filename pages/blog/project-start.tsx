import React from 'react';
import Link from 'next/link';
import { FaUser, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import BlogLayout from './BlogLayout';

const ProjectStart: React.FC = () => {
  return (
    <BlogLayout title="プロジェクトを始めました">
      <article className="bg-gray-800 shadow-xl rounded-lg p-8 transition-transform transform hover:scale-105 hover:shadow-2xl">
        <h2 className="text-4xl font-semibold mb-6">プロジェクトを始めました</h2>
        <p className="text-gray-400 mb-4 flex items-center">
          <FaUser className="mr-2" /> 投稿者: <a href="https://x.com/yukihamada" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">yukihamada</a>
          <span className="mx-4">|</span> <FaCalendarAlt className="mr-2" /> 日付: 2023年10月1日
        </p>
        <p className="text-gray-300 mb-6">
          こんにちは、皆さん！私たちは新しいプロジェクトを始めました。このプロジェクトは、レシートをスキャンして会計管理や家計簿管理ができるアプリを開発することです。
        </p>
        <p className="text-gray-300 mb-6">
          このアプリは、ユーザーが簡単にレシートをスキャンし、支出を追跡できるように設計されています。さらに、支出のカテゴリー分けや月ごとのレポート機能も提供します。
        </p>
        <p className="text-gray-300 mb-6">
          なぜこのアプリを作ろうと思ったかというと、レシートを簡単に管理し、税務署に提出する書類にデジタルのタイムスタンプを打つことで証明ができることを知ったからです。これにより、写真に撮った領収書をすぐに捨てることができ、今までぐちゃぐちゃになったレシートを税理士に送る手間がなくなります。
        </p>
        <p className="text-gray-300 mb-6">
          私たちはこのプロジェクトを通じて、レシート管理の新しい世界を作りたいと思っています。このプロジェクトはオープンソースで進めていくので、開発者の方はぜひ興味があれば参加してください。
        </p>
        <p className="text-gray-300">
          今後のアップデートで、さらに多くの機能を追加していく予定です。ぜひご期待ください！
        </p>
      </article>
    </BlogLayout>
  );
};

export default ProjectStart;