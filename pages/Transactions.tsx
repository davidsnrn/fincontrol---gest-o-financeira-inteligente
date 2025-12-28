import React, { useState, useContext, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { AppContext } from '../App';
import { Icon, Button, Card } from '../components/UI';
import { TransactionType } from '../types';

const TransactionsPage: React.FC = () => {
    const { type } = useParams<{ type?: string }>();
    const context = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const filterParam = queryParams.get('filter');

    const [filterType, setFilterType] = useState<TransactionType | 'ALL' | 'PENDING'>(
        filterParam === 'pending' ? 'PENDING' :
            type?.toLowerCase() === 'income' ? 'INCOME' :
                type?.toLowerCase() === 'expense' ? 'EXPENSE' : 'ALL'
    );

    const transactions = context?.transactions || [];
    const categories = context?.categories || [];

    const filtered = useMemo(() => {
        return transactions
            .filter(t => {
                if (filterType === 'ALL') return true;
                if (filterType === 'PENDING') return t.type === 'EXPENSE' && t.paid === false;
                return t.type === filterType;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, filterType]);

    const formatCurrency = (val: number) => {
        return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    return (
        <div className="p-4 pt-6 space-y-6 min-h-screen bg-background-light dark:bg-background-dark">
            <header className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/dashboard')} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
                        <Icon name="arrow_back" />
                    </button>
                    <h2 className="text-2xl font-bold">Transações</h2>
                </div>
                <button onClick={() => navigate('/transaction/new')} className="size-10 flex items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20 hover:scale-110 transition-transform">
                    <Icon name="add" />
                </button>
            </header>

            <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-xl sticky top-4 z-10 transition-all duration-300 shadow-sm overflow-x-auto no-scrollbar">
                {['ALL', 'INCOME', 'EXPENSE', 'PENDING'].map((t) => (
                    <button
                        key={t}
                        onClick={() => setFilterType(t as any)}
                        className={`flex-1 min-w-[80px] py-2.5 text-xs font-bold rounded-lg transition-all duration-300 ${filterType === t
                            ? 'bg-white dark:bg-slate-700 shadow-md text-primary scale-[1.02]'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        {t === 'ALL' ? 'Tudo' : t === 'INCOME' ? 'Receitas' : t === 'EXPENSE' ? 'Despesas' : 'A Pagar'}
                    </button>
                ))}
            </div>

            <div className="space-y-3 pb-24">
                {filtered.length === 0 ? (
                    <div className="text-center py-24 text-slate-400">
                        <div className="size-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                            <Icon name="search_off" className="text-4xl opacity-30" />
                        </div>
                        <p className="text-sm font-medium">Nenhuma transação encontrada.</p>
                        <Button variant="ghost" className="mt-4" onClick={() => navigate('/transaction/new')}>
                            Começar a registrar
                        </Button>
                    </div>
                ) : (
                    filtered.map(t => {
                        const cat = categories.find(c => c.id === t.categoryId);
                        return (
                            <Card
                                key={t.id}
                                className="flex items-center justify-between p-4 active:scale-[0.98] transition-all cursor-pointer border-none shadow-sm hover:shadow-md group"
                                onClick={() => navigate(`/transaction/edit/${t.id}`)}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="size-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                                        style={{ backgroundColor: `${cat?.color}15`, color: cat?.color }}
                                    >
                                        <Icon name={cat?.icon || 'payments'} />
                                    </div>
                                    <div>
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{t.description}</h4>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                                                {cat?.parentId ? `${categories.find(c => c.id === cat.parentId)?.name} > ` : ''}
                                                {cat?.name} • {new Date(t.date).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-extrabold text-base ${t.type === 'INCOME' ? 'text-green-500' : 'text-slate-900 dark:text-white'}`}>
                                        {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                                    </p>
                                    <Icon name="chevron_right" className="text-slate-300 text-xs" />
                                </div>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default TransactionsPage;
