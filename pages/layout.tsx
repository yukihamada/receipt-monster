import type { Metadata } from "next";
import { UserProvider } from '@auth0/nextjs-auth0/client';

// Google Fontsを直接インポート
import Head from 'next/head';

const metadata: Metadata = {
  title: "レシートモンスター",
  description: "領収書やレシートを安全に簡単に管理できる、AIを使ったオープンソースの経費管理システム。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <html lang="en">
        <Head>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" />
        </Head>
        <body className="font-inter">{children}</body>
      </html>
    </UserProvider>
  );
}
