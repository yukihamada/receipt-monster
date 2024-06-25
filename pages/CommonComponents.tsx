import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, MotionProps } from 'framer-motion';
import styled from 'styled-components';
import { FaHome, FaInfoCircle, FaServicestack, FaAddressBook, FaEnvelope, FaLock, FaGithub, FaFileContract, FaUser } from 'react-icons/fa';
import { Auth } from 'firebase/auth';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

// isLoggedInプロップを追加
export const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <header className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-extrabold">レシモン</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" legacyBehavior>
                <a className="flex items-center hover:text-yellow-300 transition duration-300 whitespace-nowrap text-sm">
                  <FaHome className="mr-1" />ホーム
                </a>
              </Link>
            </li>
            {!isLoggedIn && (
              <li>
                <Link href="/services" legacyBehavior>
                  <a className="flex items-center hover:text-yellow-300 transition duration-300 whitespace-nowrap text-sm">
                    サービス紹介
                  </a>
                </Link>
              </li>
            )}
          </ul>
        </nav>
        {isLoggedIn ? (
          <Link href="/account" legacyBehavior>
            <a className="bg-yellow-300 text-black px-4 py-2 rounded hover:bg-yellow-400 transition duration-300 whitespace-nowrap text-sm flex items-center">
              <FaUser className="mr-1" />マイアカウント
            </a>
          </Link>
        ) : (
          <Link href="/signup" legacyBehavior>
            <a className="bg-yellow-300 text-black px-4 py-2 rounded hover:bg-yellow-400 transition duration-300 whitespace-nowrap text-sm">
              登録
            </a>
          </Link>
        )}
      </div>
    </header>
  );
};

export const Footer: React.FC = () => (
  <footer className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white p-4 text-center shadow-lg">
    <nav className="overflow-x-auto">
      <ul className="flex justify-center space-x-4">
        <li><Link href="/" legacyBehavior><a className="flex items-center hover:text-yellow-300 transition duration-300 whitespace-nowrap text-sm"><FaHome className="mr-1" />ホーム</a></Link></li>
        <li><Link href="/services" legacyBehavior><a className="flex items-center hover:text-yellow-300 transition duration-300 whitespace-nowrap text-sm"><FaServicestack className="mr-1" />サービス紹介</a></Link></li>
        <li><Link href="/contact" legacyBehavior><a className="flex items-center hover:text-yellow-300 transition duration-300 whitespace-nowrap text-sm"><FaEnvelope className="mr-1" />お問い合わせ</a></Link></li>
        <li><Link href="/privacy-policy" legacyBehavior><a className="flex items-center hover:text-yellow-300 transition duration-300 whitespace-nowrap text-sm"><FaLock className="mr-1" />プライバシーポリシー</a></Link></li>
        <li><Link href="/terms-of-service" legacyBehavior><a className="flex items-center hover:text-yellow-300 transition duration-300 whitespace-nowrap text-sm"><FaFileContract className="mr-1" />利用規約</a></Link></li>
      </ul>
    </nav>
    <p>
      <a href="https://github.com/yukihamada/nextreceipt" className="flex items-center justify-center hover:text-yellow-300 transition duration-300 whitespace-nowrap text-sm">
        <FaGithub className="mr-1" />オープンソースプロジェクトはこちら
      </a>
    </p>
    <p className="text-sm">&copy; 2023 レシートモンスター</p>
  </footer>
);

export interface Receipt {
  id: string;
  timestamp: string;
  imageUrl?: string;
  imageOrientation?: number;
  issuerAddress?: string;
  issuerContact?: string;
  issuerRegistrationNumber?: string;
  taxCategory?: string;
  reducedTaxRate?: string;
  serialNumber?: string;
  [key: string]: string | number | boolean | undefined;
}

export const labels: Record<keyof Receipt, string> = {
  transactionDate: "取引日",
  recipient: "宛名",
  amount: "金額",
  purpose: "但し書き",
  issuer: "発行者名",
  issuerAddress: "発行者の住所・連絡先",
  issuerContact: "発行者の連絡先",
  registrationNumber: "発行者の登番号",
  taxCategory: "税区分",
  reducedTax: "軽減税率の適用",
  serialNumber: "通し番号",
  imageOrientation: "像向き"
};

export const uploadMessages: string[] = [
  "レシートモンスターへようそ！",
  "このシステムはレシートを簡に理できます。",
  "アップロード中です。少々お待ちください。",
  "レシートのデータを自動で読み取ります。",
  "アップロードが完了すると、結果が表示されます。",
  "日本の税務申告にも対応しています。",
  "ダウンロードも簡単にできます。",
  "いろんなファイル形式に対応する予定です。",
  "オープンソースなので日々アップデートされま��。",
  "データは安全に管理され、プライバシーも保護されます。"
];

export const MotionDiv = styled(motion.div).attrs<MotionProps & React.HTMLAttributes<HTMLDivElement>>(() => ({
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: 0.4 }
}))<Omit<MotionProps & React.HTMLAttributes<HTMLDivElement>, 'onDragStart'>>`
  // 必要なスタイルをここに記述
`;

export const StyledMotionDiv = styled(motion.div)`
  position: relative;
  // 必要スタイルをここに記述
`;

export default Header;
