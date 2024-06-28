import React from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import './globals.css';
import AdminLayout from './admin/AdminLayout';
import Header, { Footer } from '../components/CommonComponents';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert" style={{ padding: '20px', textAlign: 'center' }}>
      <h2>エラーが発生しました</h2>
      <p>申し訳ありませんが、エラーが発生しました。以下の情報を確認してください。</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // 管理画面のパスを判定
  const isAdmin = router.pathname.startsWith('/admin');

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {isAdmin ? (
        <AdminLayout>
          <Component {...pageProps} />
        </AdminLayout>
      ) : (
        <>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </>
      )}
    </ErrorBoundary>
  );
}

export default MyApp;
