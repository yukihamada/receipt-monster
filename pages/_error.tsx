import React, { ComponentType } from 'react';
import PropTypes from 'prop-types';
import { ErrorBoundary } from 'react-error-boundary';
import { AppProps } from 'next/app';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert" style={{ padding: '20px', textAlign: 'center' }}>
      <h2>エラーが発生しました</h2>
      <p>申し訳ありませんが、エラーが発生しました。以下の情報を確認してください。</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
}

ErrorFallback.propTypes = {
  error: PropTypes.object.isRequired,
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error("ErrorBoundary caught an error", error, info);
      }}
    >
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}

export default MyApp;
