import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // PDFにするHTMLコンテンツを生成（モダンでスタイリッシュなデザインにします）
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>証明書</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #ffffff; color: #333; }
          .container { max-width: 800px; margin: auto; padding: 40px; background: white; border: 1px solid #ddd; border-radius: 10px; }
          h1 { text-align: center; color: #2c3e50; }
          p { margin: 10px 0; line-height: 1.6; }
          .highlight { background: #2c3e50; color: white; padding: 5px 10px; border-radius: 5px; }
          .footer { text-align: center; margin-top: 40px; font-size: 0.9em; color: #777; }
          a { color: #2c3e50; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .header, .footer { text-align: center; font-size: 0.9em; color: #555; }
          .header { margin-bottom: 30px; }
          .footer { margin-top: 50px; }
          .logo { text-align: center; margin-bottom: 20px; }
          .logo img { max-width: 150px; }
          .qr-code { text-align: center; margin: 20px 0; }
          .info { display: flex; justify-content: space-between; align-items: center; }
          .info div { flex: 1; }
          .info div:first-child { text-align: left; }
          .info div:last-child { text-align: right; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">
            <img src="https://doceater.io/logo.png" alt="doceater.io">
          </div>
          <p>発行者: <strong>doceater.io</strong></p>
          <p><strong>このファイルはテスト用であり、実際のものではありません。</strong></p>
        </div>
        <div class="container">
          <div class="info">
            <div>
              <p>Comment: <strong>IMG_BF7741E7D786-1.jpeg</strong></p>
            </div>
            <div>
              <p><strong>Jun-26-2024 01:05:58 UTC</strong></p>
            </div>
          </div>
          <div class="qr-code">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://verify.doceater.io" alt="QR Code">
          </div>
          <p><strong>Hash:</strong> <span class="highlight">e6a73696b7bb871a12ff8f68dc67d9a1358e5c7fe9f3d52a4259de535cea5fe1</span></p>
          <p><strong>Transaction:</strong> <span class="highlight">71226b6a0012f91a8d72b12fde5324afe019786e873a651dc35f2743d6844320</span></p>
          <p>ファイルの存在を確認するには、次のURLで証明書を検証してください:</p>
          <p><a href="https://doceater.io/verify" target="_blank">https://doceater.io/verify</a></p>
          <h2>タイムスタンプ証明書の検証</h2>
          <p>doceater.ioは、Solanaブロックチェーンを使用して、データの改ざん防止タイムスタンプを作成するタイムスタンプサービスです。データをバックアップする代わりに、doceater.ioは暗号化されたフィンガープリントをブロックチェーンに埋め込みます。フィンガープリントからデータの内容を推測することは事実上不可能です。したがって、データは会社内に留まり、公開されることはありません。このフィンガープリントをインターフェースを介してdoceater.ioに送信するだけです。RESTful APIの統合は非常に簡単で便利であり、すべてのデータに改ざん防止タイムスタンプを簡単にタグ付けできます。このドキュメントは、doceater.ioで作成されたタイムスタンプを検証する手順と指示を示しています。</p>
          <h3>1. オリジナルファイルのSHA-256を決定する</h3>
          <p>ファイルのSHA-256を計算するためのプログラムやライブラリは多数あります。MD5FILEなどのツールを使用して、ファイルをドラッグアンドドロップするか選択するだけで、ファイルのSHA-256を取得できます。</p>
          <h3>2. 証拠を検証する</h3>
          <p>まず、オリジナルのハッシュが証拠の一部であることを確認する必要があります。これを確認するために、証拠を通常のエディタで開き、その内容をハッシュで検索できます。ハッシュが見つからない場合、ファイルが改ざんされたか、間違った証拠が選択された可能性があります。</p>
          <h3>3. Solanaトランザクションを決定する</h3>
          <p>前のステップでハッシュを決定した後、このハッシュをSolanaブロックチェーンのトランザクションに保存します。</p>
          <h3>4. トランザクションを確認する</h3>
          <p>このトランザクションのログイベントを検索する必要があります。これらのイベントはトピックに分かれています���ハッシュはトピックに含まれているはずです。注意: 一部のサービスでは、ハッシュに0xプレフィックスが付与される場合があります。トランザクションが見つかった場合、ブロック時間が実際の改ざん防止タイムスタンプになります。検索を簡素化するために、証明書にトランザクションを追加しました。</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 doceater.io</p>
          <p>発行者: <strong>doceater.io</strong></p>
        </div>
      </body>
    </html>
  `;

  await page.setContent(htmlContent);
  const pdf = await page.pdf({ format: 'A4' });

  await browser.close();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=certificate.pdf');
  res.send(pdf);
}