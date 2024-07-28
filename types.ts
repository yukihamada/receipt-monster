export interface Receipt {
  transactionDate: string;
  recipient: string;
  amount: string;
  currency: string;
  purpose: string;
  hash: string;
  imageUrl: string;
  issuer: string;
  issuerAddress: string;
  issuerContact: string;
  noryoshusho: string;
  reducedTaxRate: string;
  registrationNumber: string;
  serialNumber: string;
  taxCategory: string;
  uploadTime: string;
  address?: string; // Added address property
  
  id?: string;
  name?: string;
  registrationDate?: string;
  category?: string;
  memo?: string;
  timestamp?: string;
  userId?: string;
}

export interface ReceiptItem {
    name: string;
    price: number;
    quantity: number;
}