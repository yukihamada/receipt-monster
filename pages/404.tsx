import Link from 'next/link';
import { Header, Footer } from './CommonComponents';

export default function Custom404() {
  return (
    <>
      <div className="not-found-container min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl mb-8">ページが見つかりません</p>
        <Link href="/" legacyBehavior>
          <a className="text-blue-500 hover:underline">ホームに戻る</a>
        </Link>
      </div>
    </>
  );
}
