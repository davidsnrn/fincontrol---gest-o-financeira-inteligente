
export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  parentId?: string; // Para subcategorias
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  categoryId: string;
  accountId: string;
  type: TransactionType;
  isFixed: boolean;
  installments?: {
    current: number;
    total: number;
    billDate?: string; // Data da fatura correspondente
  };
  paid: boolean;
  notes?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  currency: string;
  biometryEnabled: boolean;
  backupEnabled: boolean;
  theme: 'light' | 'dark';
}

export type AccountType = 'WALLET' | 'BANK' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'INVESTMENT';
export type CardBrand = 'VISA' | 'MASTERCARD' | 'AMEX' | 'ELO' | 'NONE';
export type AccountStatus = 'ACTIVE' | 'INACTIVE';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  color: string;
  brand?: CardBrand;
  lastDigits?: string;
  logo?: string;
  institution?: string;
  status: AccountStatus;
  notes?: string;

  // Credit Card specific fields
  creditLimit?: number;
  availableLimit?: number;
  dueDay?: number; // Dia do vencimento (1-31)
  bestPurchaseDay?: number; // Melhor dia para compra
  closingDay?: number; // Dia de fechamento (calculado)
  allowInstallments?: boolean;
  interestRate?: number; // Taxa de juros (%)

  // Debit Card specific fields
  linkedBankAccount?: string;

  // Wallet specific fields
  lowBalanceAlert?: number;
}

export interface FinancialSummary {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  monthlyTrend: number; // percentage
}
