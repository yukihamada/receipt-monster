export interface Receipt {
  id: string; // undefined を許可しない
  issuer: string;
  amount: number;
  transactionDate: string;
  imageUrl: string;
}