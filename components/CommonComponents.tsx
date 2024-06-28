import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, MotionProps } from 'framer-motion';
import styled from 'styled-components';
import { FaHome, FaInfoCircle, FaServicestack, FaAddressBook, FaEnvelope, FaLock, FaGithub, FaFileContract, FaUser } from 'react-icons/fa';
import { Auth } from 'firebase/auth';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

declare global {
  interface Window {
    difyChatbotConfig: { token: string };
  }
}

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
      <ul className="flex justify-center space-x-4 min-w-max">
        <li><Link href="/" legacyBehavior><a className="flex items-center hover:text-yellow-300 transition duration-300 whitespace-nowrap text-sm"><FaHome className="mr-1" />ホーム</a></Link></li>
        <li><Link href="/services" legacyBehavior><a className="flex items-center hover:text-yellow-300 transition duration-300 whitespace-nowrap text-sm"><FaServicestack className="mr-1" />サービス紹介</a></Link></li>
        <li><Link href="/contact" legacyBehavior><a className="flex items-center hover:text-yellow-300 transition duration-300 whitespace-nowrap text-sm"><FaEnvelope className="mr-1" />お問い合わせ</a></Link></li>
        <li><Link href="/price" legacyBehavior><a className="flex items-center hover:text-yellow-300 transition duration-300 whitespace-nowrap text-sm"><FaInfoCircle className="mr-1" />料金</a></Link></li>
        <li><Link href="/privacy-policy" legacyBehavior><a className="flex items-center hover:text-yellow-300 transition duration-300 whitespace-nowrap text-sm"><FaLock className="mr-1" />プライバシーポリシー</a></Link></li>
        <li><Link href="/terms-of-service" legacyBehavior><a className="flex items-center hover:text-yellow-300 transition duration-300 whitespace-nowrap text-sm"><FaFileContract className="mr-1" />利用規約</a></Link></li>
        <li><Link href="/blog" legacyBehavior><a className="flex items-center hover:text-yellow-300 transition duration-300 whitespace-nowrap text-sm"><FaInfoCircle className="mr-1" />開発ブログ</a></Link></li>
      </ul>
    </nav>
    <p>
      <a href="https://github.com/yukihamada/receipt-monster" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center hover:text-yellow-300 transition duration-300 whitespace-nowrap text-sm">
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
  purpose: "目的",
  issuer: "発行者",
  issuerAddress: "発行者の住所・連絡先",
  issuerContact: "発行者の連絡先",
  registrationNumber: "発者の登番号",
  taxCategory: "税区分",
  reducedTaxRate: "軽減税率の適用",
  serialNumber: "通し番号",
  imageOrientation: "画像像向き",
  hash: "ファイルハッシュ",
  uploadTime: "アップロード時間"
};

export const uploadMessages: string[] = [
  "シートモンスターようそ！",
  "このシステムはレシートを簡に理できま。",
  "アップロード中です。少々お待ちください。",
  "レシートのデータを自動で読み取ります。",
  "アップロードが完了すると、結果が表示されます。",
  "日本の税務申告にも対応しています。",
  "ダウンロドも簡単にできます。",
  "いろんなファイル形式に対応する予定です。",
  "オープンソースなので日々アップデートされます。",
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
  // 要スタイルをここに記述
`;

export const messages = [
  "レシートを食べて成長するモンスター、あなたの財布はスッキリ！",
  "家計簿がゲームに？レシートモンスターで楽しく節約！",
  "タムスタンプ付で安心、あなたの経費精算をサポート！",
  "レシトの山、さようなら。デジタル管理で空間スッキリ！",
  "モンスターと一緒に、楽しく家計管理。成長が見える喜び！",
  "領収書の整理、もう悩まない。レシートモンスターにお任せ！",
  "税務申告の味方、レシートモンスターでラクラク書類準備！",
  "エコな暮らしへの第一歩、紙のレシートにさようなら！",
  "ビジネスマンの強い味方、経費精算をスマートに！",
  "レシートを撮って、モンスター育成。家計管理が楽しくなる！",
  "大切な書類をしっかり保、ブロックチェーンで安心管理！",
  "族で楽しむ家計管理、みんなでモンスター育成！",
  "シーの、AI が解読。家計の見える化をサポート！",
  "財布の中身スッキリ、データはしっかり保管。一石二鳥の便利ツール！",
  "日の買い物が冒険に？レシートモンスターで新い体験を！",
  "領収書の山に埋もれない、スマトな経理担当者になろう！",
  "レシートを撮るたび、モンスターが進化。成長が楽しみにな家計管理！",
  "書類とはおらば、デジタルで安全に保管。未来型の文書管理！",
  "家計のムダを発見！AI 分析でスマートな家計を実現！",
  "レシートがモンスターのエサに？楽しみながら、賢く節約！"
];

export const loadingMessages = [
  "レシートを解析中...",
  "AIがデータを読み取っています...",
  "モンスターにエサをあげています...",
  "家計簿を更新中...",
  "領収書の山を整理しています...",
  "経費精算の準備をしています...",
  "レシートモンスターが進化中..."
];

const CommonComponents: React.FC = () => {
  useEffect(() => {
    window.difyChatbotConfig = {
      token: 'EtrfnS1CbiORg2lt'
    };

    const script = document.createElement('script');
    script.src = "https://udify.app/embed.min.js";
    script.id = "EtrfnS1CbiORg2lt";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <Header />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.difyChatbotConfig = {
              token: 'EtrfnS1CbiORg2lt'
            };
          `,
        }}
      />
      <script
        src="https://udify.app/embed.min.js"
        id="EtrfnS1CbiORg2lt"
        defer
      />
    </>
  );
};

export default CommonComponents;

