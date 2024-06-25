import React from 'react';
import Link from 'next/link';
import { Footer, Header } from './CommonComponents';

const TermsOfService: React.FC = () => (
  <div className="min-h-screen flex flex-col transition-colors duration-300 bg-gray-100 text-gray-900">
    <Header />
    <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">利用規約</h1>
        <p className="mb-4">このページでは、レシートモンスターの利用規約について説明します。サービスを利用する前に、必ずお読みください。</p>
        <p className="mb-4">私たちのサービスを利用することで、これらの利用規約に同意したものとみなされます。</p>

        <h2 className="text-2xl font-bold mb-2">第1条（適用）</h2>
        <p className="mb-4">本規約は、ユーザーがレシートモンスター（以下「本サービス」）を利用する際の一切の行為に適用されます。</p>

        <h2 className="text-2xl font-bold mb-2">第2条（利用登録）</h2>
        <p className="mb-4">ユーザーは、本サービスの利用にあたり、所定の方法により利用登録を行うものとします。</p>
        <p className="mb-4">利用登録の申請者が以下の事由に該当する場合、当社は利用登録を拒否することがあります。</p>

        <h2 className="text-2xl font-bold mb-2">第3条（ユーザーIDおよびパスワードの管理）</h2>
        <p className="mb-4">ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。</p>

        <h2 className="text-2xl font-bold mb-2">第4条（禁止事項）</h2>
        <p className="mb-4">ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
        <ul className="list-disc list-inside mb-4">
          <li>法令または公序良俗に違反する行為</li>
          <li>犯罪行為に関連する行為</li>
          <li>サーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
          <li>その他、当社が不適切と判断する行為</li>
        </ul>

        <h2 className="text-2xl font-bold mb-2">第5条（本サービスの提供の停止等）</h2>
        <p className="mb-4">当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく、本サービスの全部または一部の提供を停止または中断することができます。</p>

        <h2 className="text-2xl font-bold mb-2">第6条（利用制限および登録抹消）</h2>
        <p className="mb-4">当社は、以下の場合には、事前の通知なく、ユーザーに対して、本サービスの全部または一部の利用を制限し、またはユーザーとしての登録を抹消することができます。</p>

        <h2 className="text-2xl font-bold mb-2">第7条（退会）</h2>
        <p className="mb-4">ユーザーは、当社の定める手続により、本サービスから退会することができます。</p>

        <h2 className="text-2xl font-bold mb-2">第8条（保証の否認および免責事項）</h2>
        <p className="mb-4">当社は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害など）がないことを明示的にも黙示的にも保証しておりません。</p>

        <h2 className="text-2xl font-bold mb-2">第9条（サービス内容の変更等）</h2>
        <p className="mb-4">当社は、ユーザーに通知することなく、本サービスの内容を変更し、または提供を中止することができます。</p>

        <h2 className="text-2xl font-bold mb-2">第10条（利用規約の変更）</h2>
        <p className="mb-4">当社は、必要と判断した場合には、ユーザーに通知することなく、いつでも本規約を変更することができます。</p>

        <h2 className="text-2xl font-bold mb-2">第11条（個人情報の取扱い）</h2>
        <p className="mb-4">当社は、本サービスの利用によって取得する個人情報については、当社「プライバシーポリシー」に従い適切に取り扱うものとします。</p>

        <h2 className="text-2xl font-bold mb-2">第12条（通知または連絡）</h2>
        <p className="mb-4">ユーザーと当社との間の通知または連絡は、当社の定める方法によって行うものとします。</p>

        <h2 className="text-2xl font-bold mb-2">第13条（権利義務の譲渡の禁止）</h2>
        <p className="mb-4">ユーザーは、当社の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。</p>

        <h2 className="text-2xl font-bold mb-2">第14条（準拠法・裁判管轄）</h2>
        <p className="mb-4">本規約の解釈にあたっては、日本法を準拠法とします。</p>
        <p className="mb-4">本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。</p>

        <Link href="/" legacyBehavior><a className="text-blue-500 hover:underline">ホームに戻る</a></Link>
      </div>
    </main>
    <Footer />
  </div>
);

export default TermsOfService;
