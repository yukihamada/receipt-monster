import { AppProps } from 'next/app';
import './globals.css';
import { Header, Footer } from './CommonComponents';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
