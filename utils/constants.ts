// アプリケーション全体の設定
export const APP_NAME = 'レシートモンスター';
export const APP_DESCRIPTION = '経理をスマートに';

// Firebase設定
export const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// レシート関連の定数
export const MAX_FREE_RECEIPTS = 10;
export const MAX_TOTAL_RECEIPTS = 1000;

// アップロードメッセージ
export const uploadMessages = [
  'レシートを食べています...',
  '数字を消化中...',
  '経費を計算しています...',
  'お金を節約中...',
  'レシートの山を登っています...',
  '領収書の海を泳いでいます...',
  '経理の迷宮を探索中...',
  'レシートの森を冒険中...',
  '会計の宇宙を旅しています...',
  'レシートと対話中...',
];

// レシートの項目ラベル
export const receiptLabels: { [key: string]: string } = {
  issuer: '発行者',
  amount: '金額',
  date: '日付',
  category: 'カテゴリー',
  paymentMethod: '支払方法',
  taxAmount: '税額',
  notes: 'メモ',
};

// カテゴリーオプション
export const categoryOptions = [
  '食費',
  '交通費',
  '住居費',
  '光熱費',
  '通信費',
  '教育費',
  '医療費',
  '娯楽費',
  'その他',
];

// 支払方法オプション
export const paymentMethodOptions = [
  '現金',
  'クレジットカード',
  'デビットカード',
  '電子マネー',
  'QRコード決済',
  'その他',
];

// エラーメッセージ
export const ERROR_MESSAGES = {
  UPLOAD_FAILED: 'アップロードに失敗しました。もう一度お試しください。',
  DELETE_FAILED: '削除に失敗しました。もう一度お試しください。',
  UPDATE_FAILED: '更新に失敗しました。もう一度お試しください。',
  LOGIN_FAILED: 'ログインに失敗しました。もう一度お試しください。',
  LOGOUT_FAILED: 'ログアウトに失敗しました。もう一度お試しください。',
  FETCH_FAILED: 'データの取得に失敗しました。もう一度お試しください。',
};

// アニメーション設定
export const ANIMATION_DURATION = 0.3;

// ページネーション設定
export const ITEMS_PER_PAGE = 10;

// 画像アップロード設定
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

// API エンドポイント
export const API_ENDPOINTS = {
  PROCESS_RECEIPT: '/api/process-receipt',
  FETCH_RECEIPTS: '/api/receipts',
  UPDATE_RECEIPT: '/api/receipts',
  DELETE_RECEIPT: '/api/receipts',
};

// ローカルストレージキー
export const STORAGE_KEYS = {
  THEME: 'receipt-monster-theme',
  USER_PREFERENCES: 'receipt-monster-user-preferences',
};

// デフォルトのテーマ設定
export const DEFAULT_THEME = 'light';

// 日付フォーマット
export const DATE_FORMAT = 'YYYY-MM-DD';

// 通貨フォーマット
export const CURRENCY_FORMAT = 'ja-JP';

// タイムゾーン
export const TIMEZONE = 'Asia/Tokyo';