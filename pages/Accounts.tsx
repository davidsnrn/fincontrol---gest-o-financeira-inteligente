import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { Card, Icon, Button } from '../components/UI';
import { INSTITUTIONS, getBankMeta } from '../constants';
import { AccountType, CardBrand } from '../types';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const accountTypeLabels: Record<string, string> = {
    WALLET: 'Carteira',
    BANK: 'Conta Corrente',
    CREDIT_CARD: 'Cartão de Crédito',
    DEBIT_CARD: 'Cartão de Débito',
    INVESTMENT: 'Investimento'
};

const brandIcons: Record<CardBrand, string> = {
    VISA: 'credit_card',
    MASTERCARD: 'credit_card',
    AMEX: 'credit_card',
    ELO: 'credit_card',
    NONE: 'account_balance'
};

const AccountsPage: React.FC = () => {
    const context = useContext(AppContext);
    const navigate = useNavigate();
    const accounts = context?.accounts || [];

    const formatCurrency = (val: number) => {
        return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    // Grouping
    const accountGroups = {
        'Contas e Carteira': accounts.filter(a => ['BANK', 'WALLET'].includes(a.type)),
        'Cartões': accounts.filter(a => ['CREDIT_CARD', 'DEBIT_CARD'].includes(a.type)),
        'Investimentos': accounts.filter(a => ['INVESTMENT'].includes(a.type))
    };

    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleNewAccount = (type: string) => {
        navigate(`/account/new?type=${type}`);
        setIsModalOpen(false);
    };

    return (
        <div className="p-4 space-y-6 pb-20 relative">
            <header className="flex justify-between items-center px-1">
                <div className="pl-14">
                    <p className="text-slate-500 text-xs">Gerencie suas</p>
                    <h2 className="text-lg font-bold leading-tight">Contas e Cartões</h2>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="size-10 flex items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 active:scale-90 transition-transform"
                >
                    <Icon name="add" />
                </button>
            </header>

            {/* Modal de Nova Conta */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom-10 duration-300" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-black text-slate-800 dark:text-white">Adicionar Nova</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                                <Icon name="close" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => handleNewAccount('BANK')} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><Icon name="account_balance" /></div>
                                <span className="text-xs font-bold">Conta Corrente</span>
                            </button>
                            <button onClick={() => handleNewAccount('WALLET')} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                <div className="p-2 bg-green-100 text-green-600 rounded-xl"><Icon name="wallet" /></div>
                                <span className="text-xs font-bold">Carteira</span>
                            </button>
                            <button onClick={() => handleNewAccount('CREDIT_CARD')} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                <div className="p-2 bg-purple-100 text-purple-600 rounded-xl"><Icon name="credit_card" /></div>
                                <span className="text-xs font-bold">Cartão Crédito</span>
                            </button>
                            <button onClick={() => handleNewAccount('DEBIT_CARD')} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                <div className="p-2 bg-orange-100 text-orange-600 rounded-xl"><Icon name="payments" /></div>
                                <span className="text-xs font-bold">Cartão Débito</span>
                            </button>
                        </div>
                    </div>
                    <div className="absolute inset-0 -z-10" onClick={() => setIsModalOpen(false)}></div>
                </div>
            )}

            <div className="space-y-8">
                {Object.entries(accountGroups).map(([groupName, groupAccounts]) => (
                    groupAccounts.length > 0 && (
                        <div key={groupName} className="space-y-3">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{groupName}</h3>
                            <div className="grid gap-4">
                                {groupAccounts.map(account => (
                                    <Card
                                        key={account.id}
                                        className="relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all hover:shadow-md border-transparent hover:border-primary/20"
                                        onClick={() => navigate(`/account/edit/${account.id}`)}
                                    >
                                        <div
                                            className="absolute top-0 left-0 w-1.5 h-full"
                                            style={{ backgroundColor: account.color }}
                                        />
                                        <div className="flex items-center justify-between p-1">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="size-12 rounded-2xl flex items-center justify-center font-black text-xl text-white overflow-hidden shadow-sm"
                                                    style={{ backgroundColor: account.color }}
                                                >
                                                    {account.institution && getBankMeta(account.institution)?.logo ? (
                                                        <img
                                                            src={getBankMeta(account.institution)?.logo}
                                                            alt={INSTITUTIONS.find(i => i.id === account.institution)?.name}
                                                            className="w-full h-full object-contain p-2"
                                                        />
                                                    ) : account.institution ? (
                                                        INSTITUTIONS.find(i => i.id === account.institution)?.name.charAt(0).toUpperCase()
                                                    ) : (
                                                        <Icon name={account.type === 'CREDIT_CARD' || account.type === 'DEBIT_CARD' ? 'credit_card' : 'account_balance'} />
                                                    )}
                                                </div>
                                                <div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                                            {account.name}
                                                            {account.status === 'INACTIVE' && (
                                                                <span className="text-[9px] px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-900/30 text-red-600 font-black">
                                                                    INATIVA
                                                                </span>
                                                            )}
                                                        </h3>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                                            {account.brand && account.brand !== 'NONE' && (
                                                                <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 font-black text-[9px]">
                                                                    {account.brand}
                                                                </span>
                                                            )}
                                                            {account.lastDigits ? ` **** ${account.lastDigits}` : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-xs text-slate-400 font-bold uppercase">
                                                    {account.type.includes('CARD') ? 'Fatura' : 'Saldo'}
                                                </p>
                                                <p className={`font-black ${account.balance < 0 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                                                    {formatCurrency(account.balance)}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </div>

            <div className="pt-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-1 mb-4">Resumo do Patrimônio</h3>
                <Card className="bg-primary text-white p-6 shadow-xl shadow-primary/20">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-sm opacity-80 mb-1">Saldo Consolidado</p>
                            <h2 className="text-3xl font-black">
                                {formatCurrency(accounts.reduce((acc, a) => acc + a.balance, 0))}
                            </h2>
                        </div>
                        <div className="size-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <Icon name="account_balance_wallet" className="text-2xl" />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AccountsPage;
