import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { StorageService } from './services/storage';
import { Transaction, Category, UserProfile, Account } from './types';
import { Icon, Button } from './components/UI';

// Pages
import WelcomePage from './pages/Welcome';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';
import TransactionForm from './pages/TransactionForm';
import TransactionsPage from './pages/Transactions';
import CategoriesPage from './pages/Categories';
import SubcategoriesPage from './pages/Subcategories';
import CategoryForm from './pages/CategoryForm';
import SettingsPage from './pages/Settings';
import AccountsPage from './pages/Accounts';
import AccountForm from './pages/AccountForm';

export const AppContext = React.createContext<{
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  userProfile: UserProfile;
  refreshData: () => void;
  isAuthenticated: boolean;
  setAuthenticated: (val: boolean) => void;
  logout: () => void;
} | null>(null);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tabs = [
    { label: 'Início', icon: 'home', path: '/dashboard' },
    { label: 'Contas', icon: 'account_balance', path: '/accounts' },
    { label: 'Transações', icon: 'receipt_long', path: '/transactions' },
    { label: 'Categorias', icon: 'category', path: '/categories' },
    { label: 'Ajustes', icon: 'settings', path: '/settings' },
  ];

  const hideNav = ['/', '/auth'].includes(location.pathname);

  if (hideNav) return <>{children}</>;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark overflow-hidden">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-[70] w-72 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-r border-slate-200 dark:border-white/10 transition-transform duration-500 ease-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full shadow-none'}`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
                <Icon name="account_balance_wallet" className="text-white" />
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white">Minhas Finanças</span>
            </div>
            <button onClick={toggleSidebar} className="p-2 text-slate-400 hover:text-primary transition-colors">
              <Icon name="close" />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {tabs.map(tab => {
              const isActive = location.pathname.startsWith(tab.path);
              return (
                <button
                  key={tab.path}
                  onClick={() => {
                    navigate(tab.path);
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all ${isActive
                    ? 'bg-primary text-white shadow-xl shadow-primary/20'
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                  <Icon name={tab.icon} filled={isActive} />
                  <span>{tab.label}</span>
                  {isActive && <div className="ml-auto size-1.5 bg-white rounded-full" />}
                </button>
              );
            })}
          </nav>

          <Button
            fullWidth
            onClick={() => {
              navigate('/transaction/new');
              setIsSidebarOpen(false);
            }}
            className="mb-6 !h-16"
          >
            <Icon name="add" /> Nova Transação
          </Button>

          <div className="pt-6 border-t border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3 p-2">
              <div className="size-10 rounded-full border-primary overflow-hidden border-2">
                <img src="https://picsum.photos/seed/user1/100/100" alt="User" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">Davi Silva</p>
                <p className="text-[10px] text-slate-500 font-medium">Conta Premium</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative w-full">
        {/* Fixed Hamburger Button - Globally Accessible */}
        <div className="fixed top-5 left-5 z-[55]">
          <button
            onClick={toggleSidebar}
            className="size-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-primary/20 border border-slate-200/50 dark:border-white/10 flex items-center justify-center text-primary active:scale-90 hover:scale-105 transition-all"
          >
            <Icon name={isSidebarOpen ? "close" : "menu"} className="text-2xl" />
          </button>
        </div>

        <main className="flex-1 overflow-y-auto no-scrollbar pt-20 pb-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Usuário',
    email: 'usuario@fincontrol.com',
    theme: 'light'
  });
  const [isAuthenticated, setAuthenticated] = useState(() => {
    // Load authentication state from localStorage
    const saved = localStorage.getItem('isAuthenticated');
    return saved === 'true';
  });

  const refreshData = () => {
    setTransactions(StorageService.getTransactions());
    setCategories(StorageService.getCategories());
    setAccounts(StorageService.getAccounts());
    setUserProfile(StorageService.getUserProfile());
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (userProfile.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [userProfile.theme]);

  // Persist authentication state
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
  }, [isAuthenticated]);

  const logout = () => {
    setAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  const value = useMemo(() => ({
    transactions,
    categories,
    accounts,
    userProfile,
    refreshData,
    isAuthenticated,
    setAuthenticated,
    logout
  }), [transactions, categories, accounts, userProfile, isAuthenticated]);

  return (
    <AppContext.Provider value={value}>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />}
            />
            <Route path="/transaction/new" element={<TransactionForm />} />
            <Route path="/transaction/edit/:id" element={<TransactionForm />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/transactions/:type" element={<TransactionsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:parentId" element={<SubcategoriesPage />} />
            <Route path="/category/new" element={<CategoryForm />} />
            <Route path="/category/edit/:id" element={<CategoryForm />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/account/new" element={<AccountForm />} />
            <Route path="/account/edit/:id" element={<AccountForm />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AppContext.Provider>
  );
}
