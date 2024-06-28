import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import './globals.css';
import AdminLayout from './admin/AdminLayout';
import Header, { Footer } from '../components/CommonComponents';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // 管理画面のパスを判定
  const isAdmin = router.pathname.startsWith('/admin');

  return isAdmin ? (
    <AdminLayout>
      <Component {...pageProps} />
    </AdminLayout>
  ) : (
    <>
      <Header />
        <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
