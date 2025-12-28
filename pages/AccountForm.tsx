import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { AppContext } from '../App';
import { StorageService } from '../services/storage';
import { Card, Icon, Button } from '../components/UI';
import { Account, AccountType, CardBrand, AccountStatus } from '../types';
import { getBankMeta, INSTITUTIONS } from '../constants';

const accountTypes: { value: AccountType; label: string; icon: string }[] = [
    { value: 'BANK', label: 'Conta Corrente/Banco', icon: 'account_balance' },
    { value: 'WALLET', label: 'Dinheiro (Carteira)', icon: 'wallet' },
    { value: 'CREDIT_CARD', label: 'Cartão de Crédito', icon: 'credit_card' },
    { value: 'DEBIT_CARD', label: 'Cartão de Débito', icon: 'payments' },
    { value: 'INVESTMENT', label: 'Investimento', icon: 'trending_up' }
];

const cardBrands: { value: CardBrand; label: string }[] = [
    { value: 'NONE', label: 'Nenhuma' },
    { value: 'VISA', label: 'Visa' },
    { value: 'MASTERCARD', label: 'Mastercard' },
    { value: 'AMEX', label: 'American Express' },
    { value: 'ELO', label: 'Elo' },
    { value: 'NONE', label: 'Outra / Nenhuma' }
];

const colors = [
    '#137fec', '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
    '#f59e0b', '#10b981', '#06b6d4', '#1f2937'
];

const AccountForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const context = useContext(AppContext);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialType = (queryParams.get('type') as AccountType) || 'BANK';

    // Campos gerais
    const [name, setName] = useState('');
    const [type, setType] = useState<AccountType>(initialType);
    const [balance, setBalance] = useState('');
    const [color, setColor] = useState(colors[0]);
    const [institution, setInstitution] = useState('');
    const [notes, setNotes] = useState('');

    // Campos específicos de Cartão de Crédito
    const [creditLimit, setCreditLimit] = useState('');
    const [currentBalance, setCurrentBalance] = useState('');
    const [brand, setBrand] = useState<CardBrand>('NONE');
    const [closingDay, setClosingDay] = useState('');
    const [dueDay, setDueDay] = useState('');
    const [dynamicClosing, setDynamicClosing] = useState(false);
    const [dynamicDueDate, setDynamicDueDate] = useState(false);
    const [lastDigits, setLastDigits] = useState('');
    const [isAlternativeText, setIsAlternativeText] = useState(false);
    const [isMainCard, setIsMainCard] = useState(false);

    // Campos específicos de Cartão de Débito
    const [linkedBankAccount, setLinkedBankAccount] = useState('');

    // Campos específicos de Carteira
    const [lowBalanceAlert, setLowBalanceAlert] = useState('');

    // Auto-update color and name when institution changes
    useEffect(() => {
        if (institution && !id) {
            const meta = getBankMeta(institution);
            if (meta) {
                // Only auto-set color if it wasn't manually set? 
                // For now, let's override to help user, but maybe allow manual change later.
                // The prompt says "Livre escolha", so we shouldn't force it hard if they picked something else,
                // but usually selecting a bank resets the color theme. I'll keep this behavior.
                setColor(meta.color);
            }
            // Auto-generate name for cards
            if (type === 'CREDIT_CARD' || type === 'DEBIT_CARD') {
                const inst = INSTITUTIONS.find(i => i.id === institution);
                if (inst) {
                    const cardType = type === 'CREDIT_CARD' ? 'Crédito' : 'Débito';
                    setName(`${inst.name} ${cardType}`);
                }
            }
        }
    }, [institution, type, id]);

    useEffect(() => {
        if (id) {
            const existing = context?.accounts.find(a => a.id === id);
            if (existing) {
                setName(existing.name);
                setType(existing.type);
                setBalance(existing.balance.toString().replace('.', ','));
                setColor(existing.color);
                setBrand(existing.brand || 'NONE');
                setLastDigits(existing.lastDigits || '');
                setInstitution(existing.institution || '');
                setNotes(existing.notes || '');

                // Credit card fields
                setCreditLimit(existing.creditLimit?.toString().replace('.', ',') || '');
                setCurrentBalance(existing.balance?.toString().replace('.', ',') || '');
                setDueDay(existing.dueDay?.toString() || '');
                setClosingDay(existing.closingDay?.toString() || '');

                // Debit card fields
                setLinkedBankAccount(existing.linkedBankAccount || '');

                // Wallet fields
                setLowBalanceAlert(existing.lowBalanceAlert?.toString().replace('.', ',') || '');
            }
        }
    }, [id, context?.accounts]);

    const handleSave = () => {
        // For cards, name is auto-generated
        if ((type === 'CREDIT_CARD' || type === 'DEBIT_CARD') && !institution) {
            alert('Por favor, selecione a instituição financeira.');
            return;
        }

        if (type !== 'CREDIT_CARD' && type !== 'DEBIT_CARD' && !name) {
            alert('Por favor, preencha o nome da conta.');
            return;
        }

        // Validações específicas por tipo
        if (type === 'CREDIT_CARD') {
            if (!creditLimit) {
                alert('Para cartão de crédito, informe o limite.');
                return;
            }
        }

        const parsedBalance = balance ? parseFloat(balance.replace(/\./g, '').replace(',', '.')) : 0;
        const parsedCreditLimit = creditLimit ? parseFloat(creditLimit.replace(/\./g, '').replace(',', '.')) : undefined;
        const parsedCurrentBalance = currentBalance ? parseFloat(currentBalance.replace(/\./g, '').replace(',', '.')) : undefined;
        const parsedLowBalanceAlert = lowBalanceAlert ? parseFloat(lowBalanceAlert.replace(/\./g, '').replace(',', '.')) : undefined;

        const newAccount: Account = {
            id: id || Date.now().toString(),
            name,
            type,
            balance: type === 'CREDIT_CARD' ? (parsedCurrentBalance || 0) : parsedBalance,
            color,
            logo: undefined,
            institution,
            status: 'ACTIVE',
            notes,
            brand: (type === 'CREDIT_CARD' || type === 'DEBIT_CARD') ? brand : 'NONE',
            lastDigits: (type === 'CREDIT_CARD' || type === 'DEBIT_CARD') ? lastDigits : undefined,

            // Credit card specific
            creditLimit: type === 'CREDIT_CARD' ? parsedCreditLimit : undefined,
            availableLimit: type === 'CREDIT_CARD' ? parsedCreditLimit : undefined,
            dueDay: type === 'CREDIT_CARD' && dueDay ? parseInt(dueDay) : undefined,
            closingDay: type === 'CREDIT_CARD' && closingDay ? parseInt(closingDay) : undefined,
            bestPurchaseDay: type === 'CREDIT_CARD' && closingDay ? parseInt(closingDay) : undefined,
            allowInstallments: type === 'CREDIT_CARD' ? true : undefined,
            interestRate: undefined,

            // Debit card specific
            linkedBankAccount: type === 'DEBIT_CARD' ? linkedBankAccount : undefined,

            // Wallet specific
            lowBalanceAlert: type === 'WALLET' ? parsedLowBalanceAlert : undefined,
        };

        StorageService.saveAccount(newAccount);
        context?.refreshData();
        navigate('/accounts');
    };

    const handleDelete = () => {
        if (id && confirm('Tem certeza que deseja excluir esta conta?')) {
            StorageService.deleteAccount(id);
            context?.refreshData();
            navigate('/accounts');
        }
    };

    const isCard = type === 'CREDIT_CARD' || type === 'DEBIT_CARD';

    return (
        <div className="p-4 space-y-6 pb-20">
            <header className="flex items-center gap-4 px-1">
                <button
                    onClick={() => navigate('/accounts')}
                    className="size-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-sm active:scale-95"
                >
                    <Icon name="arrow_back" />
                </button>
                <h2 className="text-xl font-bold">{id ? 'Editar Cartão' : 'Novo Cartão'}</h2>
            </header>

            <div className="space-y-6">
                {/* Nome (apenas para não-cartões) */}
                {!isCard && (
                    <section className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Nome *</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ex: Carteira, Poupança"
                                className="w-full h-14 px-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-transparent focus:border-primary outline-none font-bold transition-all"
                            />
                        </div>
                    </section>
                )}

                {/* Tipo de Conta */}
                <section className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Tipo de Conta *</label>
                    <div className="grid grid-cols-2 gap-3">
                        {accountTypes.map(at => (
                            <button
                                key={at.value}
                                onClick={() => setType(at.value)}
                                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${type === at.value
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-transparent bg-white dark:bg-slate-800 text-slate-400'
                                    }`}
                            >
                                <Icon name={at.icon} className={type === at.value ? 'fill-1' : ''} />
                                <span className="text-[10px] font-black uppercase text-center leading-tight">{at.label}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Campos Específicos de Cartão de Crédito */}
                {type === 'CREDIT_CARD' && (
                    <section className="space-y-4">
                        {/* Instituição */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Instituição *</label>
                            <div className="relative">
                                <select
                                    value={institution}
                                    onChange={(e) => setInstitution(e.target.value)}
                                    className="w-full h-14 px-4 pr-10 rounded-2xl bg-white dark:bg-slate-800 border-2 border-transparent focus:border-primary outline-none font-bold transition-all appearance-none"
                                >
                                    <option value="">Selecione...</option>
                                    {INSTITUTIONS.map(inst => (
                                        <option key={inst.id} value={inst.id}>{inst.name}</option>
                                    ))}
                                </select>
                                <Icon name="expand_more" className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                                {institution && getBankMeta(institution)?.logo && (
                                    <div className="absolute right-12 top-1/2 -translate-y-1/2 size-6">
                                        <img src={getBankMeta(institution)?.logo} alt="Logo" className="w-full h-full object-contain" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Limite */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Limite</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">R$</span>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={creditLimit}
                                    onChange={(e) => setCreditLimit(e.target.value)}
                                    placeholder="0,00"
                                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-transparent focus:border-primary outline-none font-black text-xl transition-all"
                                />
                            </div>
                        </div>

                        {/* Fatura atual */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Fatura atual</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">R$</span>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={currentBalance}
                                    onChange={(e) => setCurrentBalance(e.target.value)}
                                    placeholder="0,00"
                                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-transparent focus:border-primary outline-none font-black text-xl transition-all"
                                />
                            </div>
                        </div>

                        {/* Bandeira do cartão */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Bandeira do cartão</label>
                            <div className="relative">
                                <select
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value as CardBrand)}
                                    className="w-full h-14 px-4 pr-10 rounded-2xl bg-white dark:bg-slate-800 border-2 border-transparent focus:border-primary outline-none font-bold transition-all appearance-none"
                                >
                                    {cardBrands.map(b => (
                                        <option key={b.value} value={b.value}>{b.label}</option>
                                    ))}
                                </select>
                                <Icon name="expand_more" className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                            </div>
                        </div>

                        {/* Conta - Nenhuma */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                Conta
                                <button className="size-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                    <Icon name="help" className="text-xs text-slate-500" />
                                </button>
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full h-14 px-4 pr-10 rounded-2xl bg-white dark:bg-slate-800 border-2 border-transparent outline-none font-bold transition-all appearance-none opacity-50"
                                    disabled
                                >
                                    <option>Nenhuma</option>
                                </select>
                                <Icon name="expand_more" className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                            </div>
                        </div>

                        {/* Fecha dia */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Fecha dia</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    min="1"
                                    max="31"
                                    value={closingDay}
                                    onChange={(e) => setClosingDay(e.target.value)}
                                    placeholder="01"
                                    disabled={dynamicClosing}
                                    className="flex-1 h-14 px-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-transparent focus:border-primary outline-none font-bold transition-all disabled:opacity-50"
                                />
                                <label className="flex items-center gap-2 cursor-pointer relative">
                                    <input
                                        type="checkbox"
                                        checked={dynamicClosing}
                                        onChange={(e) => setDynamicClosing(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                            <p className="text-xs text-slate-400 px-1">Fechamento dinâmico</p>
                        </div>

                        {/* Vence dia */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Vence dia</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    min="1"
                                    max="31"
                                    value={dueDay}
                                    onChange={(e) => setDueDay(e.target.value)}
                                    placeholder="01"
                                    disabled={dynamicDueDate}
                                    className="flex-1 h-14 px-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-transparent focus:border-primary outline-none font-bold transition-all disabled:opacity-50"
                                />
                                <label className="flex items-center gap-2 cursor-pointer relative">
                                    <input
                                        type="checkbox"
                                        checked={dynamicDueDate}
                                        onChange={(e) => setDynamicDueDate(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                            <p className="text-xs text-slate-400 px-1">Vencimento em dias úteis</p>
                        </div>

                        {/* Últimos 4 dígitos */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Últimos 4 dígitos</label>
                            <input
                                type="text"
                                maxLength={4}
                                value={lastDigits}
                                onChange={(e) => setLastDigits(e.target.value.replace(/\D/g, ''))}
                                placeholder="Um valor que identifique o cartão..."
                                className="w-full h-14 px-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-transparent focus:border-primary outline-none font-medium transition-all text-sm"
                            />
                        </div>

                        {/* Outro */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                Outro
                                <button className="size-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                    <Icon name="help" className="text-xs text-slate-500" />
                                </button>
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full h-14 px-4 pr-10 rounded-2xl bg-white dark:bg-slate-800 border-2 border-transparent focus:border-primary outline-none font-bold transition-all appearance-none"
                                >
                                    <option value="">Selecione...</option>
                                </select>
                                <Icon name="expand_more" className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                            </div>
                        </div>

                        {/* Considerar como texto alternativo */}
                        <Card className="p-4">
                            <label className="flex items-center justify-between cursor-pointer relative">
                                <div className="flex items-center gap-3">
                                    <Icon name="text_fields" className="text-primary" />
                                    <p className="font-bold text-sm">Considerar como texto alternativo</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={isAlternativeText}
                                    onChange={(e) => setIsAlternativeText(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </Card>

                        {/* Cartão principal */}
                        <Card className="p-4">
                            <label className="flex items-center justify-between cursor-pointer relative">
                                <div className="flex items-center gap-3">
                                    <Icon name="star" className="text-primary" />
                                    <p className="font-bold text-sm">Cartão principal</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={isMainCard}
                                    onChange={(e) => setIsMainCard(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </Card>
                    </section>
                )}

                {/* Campos Específicos de Cartão de Débito */}
                {type === 'DEBIT_CARD' && (
                    <section className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Instituição *</label>
                            <div className="relative">
                                <select
                                    value={institution}
                                    onChange={(e) => setInstitution(e.target.value)}
                                    className="w-full h-14 px-4 pr-10 rounded-2xl bg-white dark:bg-slate-800 border-2 border-transparent focus:border-primary outline-none font-bold transition-all appearance-none"
                                >
                                    <option value="">Selecione...</option>
                                    {INSTITUTIONS.map(inst => (
                                        <option key={inst.id} value={inst.id}>{inst.name}</option>
                                    ))}
                                </select>
                                <Icon name="expand_more" className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                                {institution && getBankMeta(institution)?.logo && (
                                    <div className="absolute right-12 top-1/2 -translate-y-1/2 size-6">
                                        <img src={getBankMeta(institution)?.logo} alt="Logo" className="w-full h-full object-contain" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Saldo</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">R$</span>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={balance}
                                    onChange={(e) => setBalance(e.target.value)}
                                    placeholder="0,00"
                                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-transparent focus:border-primary outline-none font-black text-xl transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Bandeira</label>
                            <div className="relative">
                                <select
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value as CardBrand)}
                                    className="w-full h-14 px-4 pr-10 rounded-2xl bg-white dark:bg-slate-800 border-2 border-transparent focus:border-primary outline-none font-bold transition-all appearance-none"
                                >
                                    {cardBrands.map(b => (
                                        <option key={b.value} value={b.value}>{b.label}</option>
                                    ))}
                                </select>
                                <Icon name="expand_more" className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Últimos 4 Dígitos</label>
                            <input
                                type="text"
                                maxLength={4}
                                value={lastDigits}
                                onChange={(e) => setLastDigits(e.target.value.replace(/\D/g, ''))}
                                placeholder="0000"
                                className="w-full h-14 px-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-transparent focus:border-primary outline-none font-black transition-all"
                            />
                        </div>
                    </section>
                )}

                {/* Campos Específicos de Carteira */}
                {type === 'WALLET' && (
                    <section className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Saldo</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">R$</span>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={balance}
                                    onChange={(e) => setBalance(e.target.value)}
                                    placeholder="0,00"
                                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-transparent focus:border-primary outline-none font-black text-xl transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Alerta de Saldo Baixo</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">R$</span>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={lowBalanceAlert}
                                    onChange={(e) => setLowBalanceAlert(e.target.value)}
                                    placeholder="Ex: 50,00"
                                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-transparent focus:border-primary outline-none font-bold transition-all"
                                />
                            </div>
                        </div>
                    </section>
                )}

                {/* Cor de Identificação */}
                <section className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Cor e Identidade</label>
                    <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl">
                        <div className="relative">
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="size-14 rounded-full overflow-hidden cursor-pointer border-none p-0 bg-transparent"
                            />
                            <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-700 pointer-events-none"></div>
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-sm">Cor Personalizada</p>
                            <p className="text-xs text-slate-500">Toque no círculo para alterar</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <button
                                type="button"
                                onClick={() => setColor('transparent')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase border-2 transition-all ${color === 'transparent' ? 'border-primary text-primary bg-primary/10' : 'border-slate-200 text-slate-400'
                                    }`}
                            >
                                Transparente
                            </button>
                        </div>
                    </div>
                </section>

                {/* Observações */}
                <section className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Observações</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Anotações adicionais..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-transparent focus:border-primary outline-none font-medium transition-all resize-none"
                    />
                </section>

                {/* Botões de Ação */}
                <div className="pt-6 space-y-3">
                    <Button fullWidth onClick={handleSave} className="!h-16 shadow-xl shadow-primary/20">
                        <Icon name="check" /> Salvar
                    </Button>
                    {id && (
                        <button
                            onClick={handleDelete}
                            className="w-full py-4 text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all"
                        >
                            <Icon name="delete" className="inline mr-2" />
                            Excluir Conta
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountForm;
