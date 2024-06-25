import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: any) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="description" content="レシートスキャンで経理をスマートに。証拠保管と会計処理を一度に実現。「レシートモンスター」で、ビジネスの効率化と透明性向上を。" />
          <meta name="keywords" content="レシート, 経理, スキャン, ビジネス, 効率化" />
          <meta name="author" content="レシートモンスター" />
          <meta property="og:title" content="レシートモンスター - 経理をスマートに" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://doceater.io" />
          <meta property="og:image" content="https://doceater.io/og-image.webp" />
          <meta property="og:description" content="レシートスキャン経理をスマートに。証拠保管と会計処理を一度に実現。「レシートモンスター」で、ビジネスの効率化と透明性向上を。" />
          <meta property="og:site_name" content="レシートモンスター" />
          <meta property="og:locale" content="ja_JP" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@doceater" />
          <meta name="twitter:title" content="レシートモンスター - 経理をスマートに" />
          <meta name="twitter:description" content="レシートスキャンで経理をスマートに。証拠保管と会計処理を一度に実現。「レシートモンスター」で、ビジネスの効率化と透明性向上を。" />
          <meta name="twitter:image" content="https://doceater.io/og-image.webp" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}