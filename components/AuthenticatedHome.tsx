import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { FaUpload, FaFileInvoice } from 'react-icons/fa';
import ReceiptList from './ReceiptList';
import ReportView from './ReportView';
import { useAuth } from '../hooks/useAuth';
import { uploadMessages } from '../utils/constants';
import { Receipt } from '../types';
import { uploadReceipt } from '../utils/uploadReceipt';
import { useMediaQuery } from 'react-responsive';
import { useRealTimeReceipts } from '../hooks/useRealTimeReceipts';
import { Button, Grid, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, DialogContentText } from '@mui/material';
import { styled } from '@mui/system';
import { Theme, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import CloseIcon from '@mui/icons-material/Close';

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  margin: theme.spacing(1),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-3px)'
  },
})) as typeof Button;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
});

// 新しい型定義を追加
type ReceiptWithId = Omit<Receipt, 'amount'> & {
  id: string;
  amount: number | { grossAmount: number };
};

const AuthenticatedHome: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showReport, setShowReport] = useState(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [sortField, setSortField] = useState<'registrationDate' | 'transactionDate'>('registrationDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [newReceipt, setNewReceipt] = useState<Partial<Receipt>>({
    issuer: '吉祥寺交通株式会社',
    address: '',
    transactionDate: '2024-07-26',
    amount: '1900',
    taxCategory: '',
    purpose: '',
    registrationNumber: '',
    serialNumber: '',
    imageUrl: ''
  });
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<{ file: File; preview: string | null; uploaded: boolean }[]>([]);
  const [selectedReceiptIds, setSelectedReceiptIds] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!user) return;

    const receiptsRef = collection(db, 'receipts');
    const q = query(
      receiptsRef,
      orderBy(sortField, sortOrder)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedReceipts = querySnapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id } as Receipt))
        .filter(receipt => receipt.userId === user.uid);
      setReceipts(fetchedReceipts);
    });

    return () => unsubscribe();
  }, [user, sortField, sortOrder]);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedReceipt(null);
  }, []);

  const handleSelectReceipt = useCallback((receipt: ReceiptWithId) => {
    if (receipt.id) {
      const formattedReceipt: Receipt = {
        ...receipt,
        amount: typeof receipt.amount === 'number' 
          ? receipt.amount.toString() 
          : (receipt.amount as { grossAmount: number }).grossAmount.toString()
      };
      setSelectedReceipt(formattedReceipt);
      setIsModalOpen(true);
    }
  }, []);

  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }, []);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
      console.warn('日付が提供さていません。現在の日付を使用します。');
      return new Date().toISOString().split('T')[0];  // 現在の日付をYYYY-MM-DD形式で返す
    }

    // 様々な日付形式に対応
    const formats = [
      /^(\d{4})-(\d{2})-(\d{2})$/,        // YYYY-MM-DD
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,  // DD/MM/YYYY or D/M/YYYY
      /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/,  // YYYY/MM/DD or YYYY/M/D
      /^(\d{1,2})\/(\d{1,2})\/(\d{2})\s+\d{2}:\d{2}$/ // DD/MM/YY HH:MM
    ];

    for (let format of formats) {
      const match = dateString.match(format);
      if (match) {
        let [_, first, second, third] = match;
        if (format.source.includes('\\s+\\d{2}:\\d{2}$')) {
          // DD/MM/YY HH:MM 形式の場合
          const year = `20${third}`; // 2桁の年を4桁に変換
          return `${year}-${second.padStart(2, '0')}-${first.padStart(2, '0')}`;
        } else if (format.source.startsWith('^(\\d{4})')) {
          // YYYY-MM-DD or YYYY/MM/DD 形式の場合
          return `${first}-${second.padStart(2, '0')}-${third.padStart(2, '0')}`;
        } else {
          // DD/MM/YYYY 形式の場合
          return `${third}-${second.padStart(2, '0')}-${first.padStart(2, '0')}`;
        }
      }
    }

    console.warn(`未知の日付形式です: ${dateString}`);
    return new Date().toISOString().split('T')[0];  // 未知形式の場合は現在の日付を返す
  };

  const handleUpload = useCallback(async (files: File[]) => {
    if (!isClient || !user) return;

    setIsUploading(true);
    setUploadProgress(0);

    // プレビュー画像を設定
    const newPreviews = files.map(file => ({
      file,
      preview: file.type !== 'image/heic' && !file.name.toLowerCase().endsWith('.heic')
        ? URL.createObjectURL(file)
        : null,
      uploaded: false
    }));
    setPreviewImages(newPreviews);

    try {
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        
        // HEICファイルの場合、JPEGに変換
        if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
          const heic2any = (await import('heic2any')).default;
          const jpegBlob = await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.8
          }) as Blob;
          file = new File([jpegBlob], file.name.replace(/\.heic$/i, '.jpg'), { type: 'image/jpeg' });
        }

        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/api/process-receipt', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('レシートの処理に失敗しました');
        }

        const result = await response.json();
        console.log('APIからの生のレスポンス:', result);  // デバッグ用

        // レシートデータをReceipt型に変換
        const newReceipt: Receipt = {
          ...result,
          id: result.hash || crypto.randomUUID(),
          name: result.purpose || '未指定',
          amount: (parseFloat(result.amount) || 0).toFixed(2),
          transactionDate: formatDate(result.transactionDate),
          registrationDate: new Date().toISOString(),
          category: getCategory(result.purpose || ''),
          memo: `発行者: ${result.issuer || '不明'}, 目的: ${result.purpose || '不明'}`,
          imageUrl: result.imageUrl || '',
          timestamp: new Date().getTime().toString(),
          issuer: result.issuer || '不明',
          userId: user.uid,
          currency: result.currency || 'JPY',
          recipient: result.recipient || '不明',
          issuerAddress: result.issuerAddress || '',
          issuerContact: result.issuerContact || '',
          noryoshusho: result.noryoshusho || '',
          reducedTaxRate: result.reducedTaxRate || '不明',
          registrationNumber: result.registrationNumber || '不明',
          serialNumber: result.serialNumber || '',
          taxCategory: result.taxCategory || '不明',
          purpose: result.purpose || '不明',
        };

        console.log('フォーマット後のレシートデータ:', newReceipt);  // デバッグ用

        // Firebaseにレシートを追加
        const docRef = await addDoc(collection(db, 'receipts'), newReceipt);
        console.log('レシートが追加されました。ID:', docRef.id);

        // アップロード完了を示し、HEICファイルの場合はアップロード後の画像URLを設定
        setPreviewImages(prev => prev.map((img, index) => 
          index === i ? { ...img, uploaded: true, preview: result.imageUrl || img.preview } : img
        ));

        // 進捗をより細かく更新
        const updateProgress = (progress: number) => {
          setUploadProgress(prev => Math.min(prev + progress, ((i + 1) / files.length) * 100));
        };

        for (let j = 0; j < 50; j++) {
          setTimeout(() => updateProgress(0.4), j * 40);
        }
      }
    } catch (error) {
      console.error('アップロードエラー:', error);
    } finally {
      setIsUploading(false);
    }
  }, [isClient, user]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleUpload(acceptedFiles);
  }, [handleUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/heic': ['.heic']
    },
    multiple: true,
  });

  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleUpload(Array.from(files));
    }
  }, [handleUpload]);

  const handleButtonClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  }, []);

  const deleteReceipt = useCallback(async (receiptId: string) => {
    try {
      await deleteDoc(doc(db, 'receipts', receiptId));
      console.log('レシートが削除されました');
    } catch (error) {
      console.error('レシート削除エラー:', error);
    }
  }, []);

  const handleDeleteReceipt = useCallback((receiptId: string) => {
    deleteReceipt(receiptId);
  }, [deleteReceipt]);

  const handleSort = useCallback((field: 'registrationDate' | 'transactionDate') => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  }, [sortField, sortOrder]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewReceipt(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSaveReceipt = useCallback(async () => {
    if (!user) return;

    const now = new Date();
    const receiptToSave: Receipt = {
      ...newReceipt,
      id: now.getTime().toString(),
      registrationDate: now.toISOString(),
      category: getCategory(newReceipt.purpose || ''),
      timestamp: now.getTime().toString(),
      userId: user.uid,
    } as Receipt;

    try {
      const docRef = await addDoc(collection(db, 'receipts'), receiptToSave);
      console.log('レシートが追加されました。ID:', docRef.id);
      handleCloseModal();
    } catch (error) {
      console.error('レシート追加エラー:', error);
      alert('レシの追加に失敗しました');
    }
  }, [newReceipt, user, handleCloseModal]);

  const handleOpenImageModal = useCallback(() => {
    setIsImageModalOpen(true);
  }, []);

  const handleCloseImageModal = useCallback(() => {
    setIsImageModalOpen(false);
  }, []);

  const renderReceiptDetails = (receipt: Receipt) => {
    return (
      <div>
        <p><strong>発行者:</strong> {receipt.issuer}</p>
        <p><strong>日付:</strong> {receipt.transactionDate}</p>
        <p><strong>額:</strong> {receipt.amount} {receipt.currency}</p>
        <p><strong>目的:</strong> {receipt.purpose}</p>
        <p><strong>カテゴリ:</strong> {receipt.category}</p>
        {receipt.VAT_Total && <p><strong>VAT合計:</strong> {receipt.VAT_Total}</p>}
        {receipt.Subtotal && <p><strong>小計:</strong> {receipt.Subtotal}</p>}
      </div>
    );
  };

  if (!isClient) {
    return null; // または適切なローディング表示
  }

  // フィルタリングとマッピングのロジックを分離
  const filteredReceipts = receipts
    .filter((receipt: Receipt) =>
      receipt.id !== undefined &&
      (receipt.issuer?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      receipt.amount?.toString().includes(searchQuery) ||
      receipt.transactionDate?.includes(searchQuery))
    )
    .map((receipt): ReceiptWithId => ({
      ...receipt,
      id: receipt.id as string,
      amount: typeof receipt.amount === 'string' ? parseFloat(receipt.amount) : receipt.amount
    }));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}
      >
        <Typography variant="h4" component="h1" gutterBottom color="textPrimary">
          レシート管理
        </Typography>

        <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
          <Grid item>
            <StyledButton
              variant="contained"
              color="primary"
              onClick={handleButtonClick}
            >
              レシートをアッロード
            </StyledButton>
          </Grid>
          <Grid item>
            <StyledButton
              variant="contained"
              color="secondary"
              onClick={handleOpenModal}
            >
              手動で追加
            </StyledButton>
          </Grid>
          <Grid item>
            <StyledButton
              variant="contained"
              color="info"
              onClick={() => setShowReport(!showReport)}
            >
              {showReport ? 'リストを表示' : 'レポートを表示'}
            </StyledButton>
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="検索..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <StyledButton
              fullWidth
              variant="outlined"
              onClick={() => handleSort('registrationDate')}
              endIcon={sortField === 'registrationDate' ? (sortOrder === 'asc' ? '↑' : '↓') : null}
            >
              登録日
            </StyledButton>
          </Grid>
          <Grid item xs={12} sm={3}>
            <StyledButton
              fullWidth
              variant="outlined"
              onClick={() => handleSort('transactionDate')}
              endIcon={sortField === 'transactionDate' ? (sortOrder === 'asc' ? '↑' : '↓') : null}
            >
              取引日
            </StyledButton>
          </Grid>
        </Grid>

        <div className="mb-8">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
            accept="image/jpeg,image/png,image/heic"
            multiple
          />
          <div
            {...getRootProps()}
            style={{
              border: '3px dashed #ccc',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              borderRadius: '8px',
              backgroundColor: theme.palette.background.paper,
              marginBottom: '20px',
            }}
          >
            <input {...getInputProps()} />
            <FaFileInvoice className="mx-auto text-5xl text-gray-400 mb-4" />
            <p className="text-lg mb-4">ここにファルをドロップするか、クリックしてアップロード</p>
            <button
              onClick={handleButtonClick}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition duration-300 ease-in-out"
            >
              ファイルを選択
            </button>
          </div>
          {isUploading && (
            <div className="mt-4">
              <p className="mb-2">アップロード中... {uploadProgress.toFixed(1)}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          )}
          {previewImages.length > 0 && (
            <div className="mt-4">
              <p>アップロード中の画像:</p>
              <div className="flex flex-wrap">
                {previewImages.map((img, index) => (
                  <div key={index} className="relative w-24 h-24 m-2">
                    {img.preview ? (
                      <img src={img.preview} alt={`プレビュー ${index + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                        HEIC
                      </div>
                    )}
                    {img.uploaded ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-50 text-white">
                        ✓
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 text-white">
                        ⟳
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {showReport ? (
            <ReportView
              receipts={receipts}
              onSelectReceipts={(receiptIds: string[]) => {
                const receipt = receipts.find(r => r.id === receiptIds[0]);
                if (receipt && receipt.id) {
                  const receiptWithId: ReceiptWithId = {
                    ...receipt,
                    id: receipt.id,
                    amount: typeof receipt.amount === 'string' ? { grossAmount: parseFloat(receipt.amount) } : receipt.amount
                  };
                  handleSelectReceipt(receiptWithId);
                }
              }}
            />
          ) : (
            <ReceiptList
              receipts={filteredReceipts}
              onSelectReceipt={handleSelectReceipt}
              deleteReceipt={handleDeleteReceipt}
              selectedReceiptIds={selectedReceiptIds}
              onSelectReceiptIds={setSelectedReceiptIds}
            />
          )}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >

        </motion.div>

        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 50,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{
                backgroundColor: theme.palette.background.paper,
                padding: '20px',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '500px',
              }}>
                <h2 className="text-lg font-bold mb-4">レシートの詳細</h2>
                <DialogContent>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="発行者"
                    name="issuer"
                    value={newReceipt.issuer}
                    onChange={handleInputChange}
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="住所"
                    name="address"
                    value={newReceipt.address}
                    onChange={handleInputChange}
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="取引日"
                    name="transactionDate"
                    type="date"
                    value={newReceipt.transactionDate}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="金額"
                    name="amount"
                    type="number"
                    value={newReceipt.amount}
                    onChange={handleInputChange}
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="税区分"
                    name="taxCategory"
                    value={newReceipt.taxCategory}
                    onChange={handleInputChange}
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="軽減税率"
                    name="reducedTaxRate"
                    value={newReceipt.reducedTaxRate}
                    onChange={handleInputChange}
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="目的"
                    name="purpose"
                    value={newReceipt.purpose}
                    onChange={handleInputChange}
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="登録番号"
                    name="registrationNumber"
                    value={newReceipt.registrationNumber}
                    onChange={handleInputChange}
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="シリアル番号"
                    name="serialNumber"
                    value={newReceipt.serialNumber}
                    onChange={handleInputChange}
                  />
                  {/* 画像アップロード機能はここに追加 */}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseModal}>キャンセル</Button>
                  <Button onClick={handleSaveReceipt}>保存</Button>
                </DialogActions>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
          <DialogTitle>
            レシートの詳細
            <IconButton
              aria-label="close"
              onClick={handleCloseModal}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {selectedReceipt && renderReceiptDetails(selectedReceipt)}
            {selectedReceipt && selectedReceipt.imageUrl && (
              <img 
                src={selectedReceipt.imageUrl} 
                alt="レシート画像" 
                style={{ maxWidth: '100%', cursor: 'pointer' }} 
                onClick={handleOpenImageModal}
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isImageModalOpen} onClose={handleCloseImageModal} maxWidth="xl" fullWidth>
          <DialogContent>
            {selectedReceipt && (
              <img 
                src={selectedReceipt.imageUrl} 
                alt="レシート画像（拡大）" 
                style={{ width: '100%', height: 'auto' }} 
              />
            )}
          </DialogContent>
        </Dialog>

      </motion.div>
    </ThemeProvider>
  );
};

// カテゴリを推測する関数（実装が必）
function getCategory(purpose: string): string {
  // 目的に基づいてカテゴリを推測するロジクを実装
  return '��分類'; // デフォルト値
}

export default AuthenticatedHome;