
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: TransactionType;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface FinancialSummary {
  balance: number;
  income: number;
  expenses: number;
}

export interface AIInsight {
  title: string;
  message: string;
  suggestion: string;
  priority: 'low' | 'medium' | 'high';
}
