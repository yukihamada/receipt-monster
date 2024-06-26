# レシートモンスター - オープンソース書類管理アプリケーション

レシートモンスターは、重要書類を簡単かつ安全に管理するための分散型証明サービスクライアントアプリケーションです。Next.jsフレームワークを使用し、VercelやCloudflareのデータレスデータベースで動作します。紙のレシートや領収書を写真で撮影してデジタル証明を取得することで、安心して書類を処理できるサービスを提供します。

![メインの写真](https://doceater.io/readme1.webp)

## 概要

レシートモンスターは、紙のレシートや重要書類をデジタル化し、その存在を証明するためのツールです。写真を撮るだけでタイムスタンプ付きのデジタル証明を取得でき、書類の存在を確実に証明します。紙のレシートを撮影後に捨てても安心です。現在、書類はローカルストレージに保存されていますが、将来的にはより高度な保存方法を検討中です。

[サービスのURLはこちら](https://doceater.io/)

### 特徴

- **簡単な書類管理**: スマホでレシートを撮影し、デジタル保存が可能。
- **タイムスタンプ**: アップロード時にハッシュ化し、ブロックチェーンやタイムスタンプサービスを使用して証明。
- **オリジナルモンスター育成**: アップロードしたレシートによって、あなただけのオリジナルモンスターが成長。
- **分散型証明**: 書類の証明にブロックチェーン技術を使用し、改ざん防止を保証。
- **仮想通貨トークン**: 証明サービスの利用には仮想通貨トークンが必要。
- **OpenAI API**: レシート内容の解析にOpenAIのAPIを使用。

![可愛いモンスターたち](https://doceater.io/monsters.webp)

## 使い方の例

### 家計簿の管理

毎日の買い物のレシートを撮影してデジタル保存することで、家計簿管理が簡単に。支出をいつでも確認でき、税務処理も安心です。

### 経費精算

ビジネスでの経費精算時にレシートモンスターを使用してレシートをデジタル化し、証明書類として提出。経費精算がスムーズになり、紙のレシートを探す手間が省けます。

### 法的証明

重要書類や契約書をデジタル化し、タイムスタンプを付与して存在を証明。法的な紛争時にも安心です。

![レシートを捨てる様子](https://doceater.io/trush.webp)

## インストール

以下の手順に従ってプロジェクトをローカル環境にセットアップします。

### 前提条件

- Node.js（バージョン14以上）
- npm（Node Package Manager）
- OpenAI APIキー

### 手順

1. リポジトリをクローンします。

    ```bash
    git clone https://github.com/yourusername/receipt-monster.git
    ```

2. プロジェクトディレクトリに移動します。

    ```bash
    cd receipt-monster
    ```

3. 必要な依存関係をインストールします。

    ```bash
    npm install
    ```

4. 環境変数を設定します。`.env.local`ファイルを作成し、必要なAPIキーや設定を追加します。

    ```plaintext
    OPENAI_API_KEY=your_openai_api_key
    CLOUDFLARE_ACCOUNT_ID=
    CLOUDFLARE_API_TOKEN=
    ANTHROPIC_API_KEY=

    NEXT_PUBLIC_FIREBASE_API_KEY=
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
    NEXT_PUBLIC_FIREBASE_APP_ID=
    FIREBASE_MEASUREMENT_ID=

    FIREBASE_TYPE=
    FIREBASE_PROJECT_ID=
    FIREBASE_PRIVATE_KEY_ID=
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE ----\n"
    FIREBASE_CLIENT_EMAIL=
    FIREBASE_CLIENT_ID=
    FIREBASE_AUTH_URI=
    FIREBASE_TOKEN_URI=
    FIREBASE_AUTH_PROVIDER_X509_CERT_URL=
    FIREBASE_CLIENT_X509_CERT_URL=
    FIREBASE_UNIVERSE_DOMAIN=googleapis.com

    # Polygon設定
    POLYGON_RPC_URL=https://polygon-rpc.com
    POLYGON_PRIVATE_KEY=your_polygon_private_key_here
    POLYGON_CONTRACT_ADDRESS=

    # Ethereum設定
    ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID
    ETHEREUM_PRIVATE_KEY=your_ethereum_private_key_here
    ETHEREUM_CONTRACT_ADDRESS=

    # Binance Smart Chain設定
    BINANCE_RPC_URL=https://bsc-dataseed.binance.org
    BINANCE_PRIVATE_KEY=
    BINANCE_CONTRACT_ADDRESS=0xabcdefabcdefabcdefabcdefabcdefabcdefabcd

    # Solana設定
    SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
    SOLANA_PRIVATE_KEY=
    SOLANA_PROGRAM_ID=

    # その他の設定
    NODE_ENV=development

    # Stripe
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_********************************
    STRIPE_SECRET_KEY=sk_live_************************
    ```

5. 開発サーバーを起動します。

    ```bash
    npm run dev
    ```

ブラウザで `http://localhost:3000` にアクセスし、レシートモンスターをお楽しみください。

## デプロイ

レシートモンスターはVercel上で簡単にデプロイできます。以下のリンクを使用して、ワンクリックでデプロイを行ってください。

[![デプロイ](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yukihamada/receipt-monster)

以上の手順で、レシートモンスターを簡単にセットアップし、重要書類のデジタル管理を始めることができます。