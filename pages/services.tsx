import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Footer, Header } from './CommonComponents';

const Introduction: React.FC = () => (
  <div className="min-h-screen flex flex-col transition-colors duration-300 bg-gray-100 text-gray-900">
    <Header />
    <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">書類革命</h1>
            
            <div className="mb-8 text-center">
              <Image src="/monsters.webp" alt="レシートモンスターロゴ" width={200} height={200} className="mx-auto"/>
            </div>

            <p className="mb-6 text-lg text-gray-700 leading-relaxed">
              レシートモンスターは、重要な書類を簡単かつ安全に管理するための革新的なツールです。紙のレシートや領収書をその場で写真を撮るだけで、デジタル証明を簡単に取得できるサービスを提供します。
            </p>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-blue-500">概要</h2>
              <p className="text-gray-700">
                レシートモンスターは、レシートやその他の重要書類をデジタル化して証明するためのツールです。写真を撮るだけで、タイムスタンプ付きのデジタル証明が取得でき、書類の存在を確実に証明します。このサービスを使うことで、紙のレシートをその場で捨ててもデータの存在を証明することができます。さらに、家計簿管理や経費計算にも活用できるため、日々の財務管理や業務効率化にも役立ちます。
              </p>
            </div>

            <div className="mb-8 text-center">
              <Image src="/trush.webp" alt="写真を撮ってゴミに捨てられる様子" width={200} height={200} className="mx-auto"/>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-blue-500">特徴</h2>
              <ul className="list-disc list-inside text-gray-700">
                <li>簡単な書類管理: レシートや領収書をスマホで撮影し、アップロードするだけでデジタル保存が可能。</li>
                <li>タイムスタンプ: アップロード時にハッシュ化し、ブロックチェーンやタイムスタンプサービスを使用して証明。</li>
                <li>オリジナルモンスター育成: アップロードしたレシートによって、あなただけのオリジナルモンスターが成長。</li>
                <li>分散型証明: 書類の証明にはブロックチェーン技術を使用しており、改ざん防止が保証されます。</li>
                <li>OpenAI API: レシートの内容を解析するためにOpenAIのAPIを使用します。</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-blue-500">使い方の例</h2>
              <ul className="list-disc list-inside text-gray-700">
                <li>家計簿の管理: 毎日の買い物のレシートを撮影してデジタル保存。家計簿をつけるのが簡単になり、いつでも支出を確認できます。</li>
                <li>経費精算: ビジネスでの経費精算時に、デジタル化したレシートを証明書類として提出。経費精算のプロセスがスムーズに。</li>
                <li>法的証明: 重要な書類や契約書をデジタル化し、タイムスタンプを付与。法的な紛争時にも安心です。</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-blue-500">紙の書類の保管について</h2>
              <p className="text-gray-700">
                レシートモンスターを利用することで、多くの場合、元の紙の書類を捨てても問題ありません。ただし、法的要件や個人の判断により、一部の重要な書類は原本を保管することをお勧めします。
              </p>
            </div>


            <div className="mb-8 text-center">
              <Image src="/digitalcertificate.webp" alt="デジタル証明" width={200} height={200} className="mx-auto"/>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-blue-500">タイムスタンプについて</h2>
              <p className="text-gray-700">
                タイムスタンプとは、ある出来事が発生した日時を記録するためのデジタル情報です。レシートモンスターでは、信頼できる第三者機関とブロックチェーン技術を使用してタイムスタンプを生成し、データの透明性と改ざん防止を保証しています。
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-blue-500">お客様の声</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-700 italic">&quot;レシートモンスターのおかげで、私の支出管理が劇的に改善しました。使いやすくて本当に助かっています！&quot;</p>
                  <p className="text-right text-gray-600 mt-2">- 田中さん</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-700 italic">&quot;家計簿をつけるのが苦手でしたが、このアプリなら楽しく続けられそうです。素晴らしいアプリをありがとうございます！&quot;</p>
                  <p className="text-right text-gray-600 mt-2">- 佐藤さん</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-700 italic">&quot;レシートモンスターを使って税務申告に使えて助かっています。税務処理が簡素化されました！&quot;</p>
                  <p className="text-right text-gray-600 mt-2">- 高橋さん</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-700 italic">&quot;その場でレシートを捨てられるので、財布がパンパンってことがなくなって嬉しいです！&quot;</p>
                  <p className="text-right text-gray-600 mt-2">- 山田さん</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-700 italic">&quot;オープンソースなので、セキュリティや機能の改善に貢献できるのが嬢しいです！&quot;</p>
                  <p className="text-right text-gray-600 mt-2">- 吉田さん</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-blue-500">よくある質問</h2>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold mb-2">Q: レシートのスキャンはどのくらい正確ですか？</h3>
                <p className="text-gray-700">A: レシートモンスターのスキャン技術は非常に高精度で、ほとんどのレシートを正確に読み取ります。もし誤りがあった場合でも、手動で修正することができます。</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold mb-2">Q: データはどのように保護されていますか？</h3>
                <p className="text-gray-700">A: レシートモンスターは最新のセキュリティ技術を使用しており、データは暗号化され、安全なクラウドサーバーに保存されます。</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Q: タイムスタンプとは何ですか？</h3>
                <p className="text-gray-700">A: タイムスタンプとは、ある出来事が発生した日時を記録するためのデジタル情報です。レシートモンスターでは、信頼できる第三者機関とブロックチェーン技術を使用してタイムスタンプを生成し、データの透明性と改ざん防止を保証しています。</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-blue-500">サポートとお問い合わせ</h2>
              <p className="text-gray-700">
                ご質問やサポートが必要な場合は、<Link href="/support" legacyBehavior><a className="text-blue-500 underline">サポートページ</a></Link>をご覧ください。または、以下のリンクからお問い合わせいただけます。
              </p>
              <div className="text-center mt-4">
                <Link href="/contact" legacyBehavior>
                  <a className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">お問い合わせ</a>
                </Link>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-blue-500">オープンソースプロジェクト</h2>
              <p className="text-gray-700">
                レシートモンスターはオープンソースプロジェクトです。詳細な技術情報や貢献方法については、GitHubリポジトリをご覧ください。
              </p>
              <div className="text-center mt-4">
                <a href="https://github.com/yukihamada/receipt-monster" className="inline-block bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-300">
                  GitHubリポジトリを見る
                </a>
              </div>
            </div>

            <div className="text-center">
              <Link href="/" legacyBehavior>
                <a className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 whitespace-nowrap text-sm">
                  ホームに戻る
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Introduction;