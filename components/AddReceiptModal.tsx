import React, { useState } from 'react';
import { Modal, Box, TextField, Typography } from '@mui/material';
import { Button } from '@mui/material';
import { Receipt } from '../types/Receipt';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface AddReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (receipt: Partial<Receipt>) => void;
}

const AddReceiptModal: React.FC<AddReceiptModalProps> = ({ isOpen, onClose, onSave }) => {
  const [issuer, setIssuer] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = '';

    if (selectedFile) {
      try {
        const storageRef = ref(storage, `receipts/${Date.now()}_${selectedFile.name}`);
        await uploadBytes(storageRef, selectedFile);
        imageUrl = await getDownloadURL(storageRef);
      } catch (error) {
        console.error('画像アップロードエラー:', error);
      }
    }

    onSave({
      issuer,
      amount: parseFloat(amount),
      transactionDate,
      imageUrl
    });

    setIssuer('');
    setAmount('');
    setTransactionDate('');
    setSelectedFile(null);
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography variant="h6" component="h2">レシートを追加</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="発行者"
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="金額"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="取引日"
            type="date"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ margin: '10px 0' }}
          />
          <Button type="submit" variant="contained" color="primary">
            保存
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddReceiptModal;