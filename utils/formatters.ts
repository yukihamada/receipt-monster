/**
 * タイムスタンプを相対時間または日付文字列にフォーマットする
 * @param timestamp ISO 8601形式のタイムスタンプ
 * @returns フォーマットされた文字列
 */
export const formatTimestamp = (timestamp: string): string => {
    const now = new Date();
    const receiptDate = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - receiptDate.getTime()) / (1000 * 60));
  
    if (diffInMinutes < 60) {
      return `${diffInMinutes}分前`;
    } else if (diffInMinutes < 24 * 60) {
      return `${Math.floor(diffInMinutes / 60)}時間前`;
    } else if (diffInMinutes < 7 * 24 * 60) {
      return `${Math.floor(diffInMinutes / (24 * 60))}日前`;
    } else {
      return receiptDate.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };
  
  /**
   * 数値を日本円形式にフォーマットする
   * @param amount フォーマットする数値
   * @returns フォーマットされた通貨文字列
   */
  export const formatCurrency = (value: number | string): string => {
    let numericValue: number;

    if (typeof value === 'string') {
      // 文字列から数字のみを抽出
      const numericString = value.replace(/[^\d.]/g, '');
      numericValue = parseFloat(numericString);
    } else {
      numericValue = value;
    }

    // NaNの場合や数値が0の場合は'¥0'を返す
    if (isNaN(numericValue) || numericValue === 0) {
      return '¥0';
    }

    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericValue);
  };
  
  /**
   * 文字列を指定された最大長に切り詰める
   * @param str 元の文字列
   * @param maxLength 最大長
   * @returns 切り詰められた文字列
   */
  export const truncateString = (str: string, maxLength: number): string => {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - 3) + '...';
  };
  
  /**
   * 日付文字列をYYYY-MM-DD形式にフォーマットする
   * @param date 日付文字列またはDate型オブジェクト
   * @returns YYYY-MM-DD形式の文字列
   */
  export const formatDate = (date: string | Date): string => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  /**
   * ファイルサイズを人間が読みやすい形式に変換する
   * @param bytes ファイルサイズ（バイト）
   * @returns フォーマットされたファイルサイズ文字列
   */
  export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };