import { Transaction, Category, UserProfile, Account } from '../types';
import { DEFAULT_CATEGORIES, MOCK_TRANSACTIONS, DEFAULT_ACCOUNTS } from '../constants';

const KEYS = {
  TRANSACTIONS: 'fincontrol_transactions',
  CATEGORIES: 'fincontrol_categories',
  ACCOUNTS: 'fincontrol_accounts',
  USER_PROFILE: 'fincontrol_user_profile',
  AUTH: 'fincontrol_auth'
};

export const StorageService = {
  getTransactions: (): Transaction[] => {
    const data = localStorage.getItem(KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : MOCK_TRANSACTIONS;
  },

  saveTransaction: (transaction: Transaction) => {
    const transactions = StorageService.getTransactions();
    const index = transactions.findIndex(t => t.id === transaction.id);
    if (index > -1) {
      transactions[index] = transaction;
    } else {
      transactions.push(transaction);
    }
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },

  deleteTransaction: (id: string) => {
    const transactions = StorageService.getTransactions().filter(t => t.id !== id);
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },

  getCategories: (): Category[] => {
    const data = localStorage.getItem(KEYS.CATEGORIES);
    return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
  },

  saveCategory: (category: Category) => {
    const categories = StorageService.getCategories();
    const index = categories.findIndex(c => c.id === category.id);
    if (index > -1) {
      categories[index] = category;
    } else {
      categories.push(category);
    }
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
  },

  deleteCategory: (id: string) => {
    const categories = StorageService.getCategories().filter(c => String(c.id) !== String(id) && String(c.parentId) !== String(id));
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
  },

  getAccounts: (): Account[] => {
    const data = localStorage.getItem(KEYS.ACCOUNTS);
    return data ? JSON.parse(data) : DEFAULT_ACCOUNTS;
  },

  saveAccount: (account: Account) => {
    const accounts = StorageService.getAccounts();
    const index = accounts.findIndex(a => a.id === account.id);
    if (index > -1) {
      accounts[index] = account;
    } else {
      accounts.push(account);
    }
    localStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(accounts));
  },

  deleteAccount: (id: string) => {
    const accounts = StorageService.getAccounts().filter(a => a.id !== id);
    localStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(accounts));
  },

  getUserProfile: (): UserProfile => {
    const data = localStorage.getItem(KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : {
      name: 'João Silva',
      email: 'joao.silva@email.com',
      currency: 'BRL',
      biometryEnabled: true,
      backupEnabled: true,
      theme: 'light'
    };
  },

  saveUserProfile: (profile: UserProfile) => {
    localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  resetAll: () => {
    localStorage.clear();
    window.location.reload();
  }
};
