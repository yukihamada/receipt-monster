const exchangeRates: { [key: string]: number } = {
    USD: 151.13,
    EUR: 162.48,
    GBP: 185.35,
    CHF: 169.13,
    AUD: 90.68,
    HKD: 17.21,
    CAD: 102.42,
    SGD: 108.10,
    NZD: 81.75,
    SEK: 11.83,
    NOK: 11.67,
    DKK: 20.01,
    THB: 3.74,
    KRW: 9.59,
    TWD: 4.15,
    CNY: 19.16,
    IDR: 0.79,
    XPF: 1.23,
    MYR: 28.46,
    VND: 0.53,
    PHP: 2.26,
    INR: 1.83, // インドルピー
    BRL: 30.84, // ブラジルレアル
    ZAR: 8.11, // 南アフリカランド
    RUB: 1.58, // ロシアルーブル
    SAR: 40.27, // サウジアラビアリヤル
    AED: 41.15, // UAEディルハム
    TRY: 5.53, // トルコリラ
    MXN: 8.84, // メキシコペソ
    PLN: 36.79, // ポーランドズロチ
    QAR: 41.49, // カタールリヤル
    ILS: 41.14, // イスラエルシェケル
    ARS: 0.0011, // アルゼンチンペソ
    BHD: 400.00, // バーレーンディナール
    BWP: 11.00, // ボツワナプラ
    CLP: 0.18, // チリペソ
    COP: 0.03, // コロンビアペソ
    CZK: 6.96, // チェココルナ
    HUF: 0.42, // ハンガリーフォリント
    ISK: 1.10, // アイスランドクローナ
    KZT: 0.33, // カザフスタンテンゲ
    LKR: 0.44, // スリランカルピー
    PKR: 0.54, // パキスタンルピー
    RON: 33.65, // ルーマニアレウ
    TTD: 22.00, // トリニダード・トバゴドル
    VES: 0.0000001 // ベネズエラボリバル
  };

export function formatCurrency(amount: number, currency: string): string {
  try {
    const formattedAmount = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: currency }).format(amount);
    
    if (currency !== 'JPY') {
      const jpyAmount = amount * (exchangeRates[currency] || 1);
      const jpyFormatted = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(jpyAmount);
      return `${formattedAmount} (約${jpyFormatted})`;
    }
    
    return formattedAmount;
  } catch (error) {
    console.error(`無効な通貨コード: ${currency}。デフォルトの'JPY'を使用します。`);
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
  }
}