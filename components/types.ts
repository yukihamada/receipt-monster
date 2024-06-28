export interface Receipt {
    id: string;
    timestamp: string;
    amount: number;
    issuer: string;
    imageUrl?: string;
    imageOrientation?: number;
    noryoshusho?: string;
    category?: string; // Added field
    description?: string; // Added field
    [key: string]: any; // その他のプロパティを許可
}

export interface ReceiptItem {
    name: string;
    price: number;
    quantity: number;
}
