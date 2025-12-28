
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../App';
import { StorageService } from '../services/storage';
import { Button, Icon, Card } from '../components/UI';
import { Transaction, TransactionType } from '../types';

const TransactionForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const context = useContext(AppContext);

  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isFixed, setIsFixed] = useState(false);

  const [installments, setInstallments] = useState('1');
  const [hasInstallments, setHasInstallments] = useState(false);
  const [paid, setPaid] = useState(true); // Default true for now

  useEffect(() => {
    if (id && context?.transactions) {
      const t = context.transactions.find(item => item.id === id);
      if (t) {
        setType(t.type);
        setAmount(t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
        setDescription(t.description);
        setCategoryId(t.categoryId);
        setAccountId(t.accountId || (context.accounts[0]?.id || ''));
        setDate(t.date);
        setIsFixed(t.isFixed);
        setPaid(t.paid);
        if (t.installments) {
          setHasInstallments(true);
          setInstallments(t.installments.total.toString());
        }
      }
    } else {
      // Defaults
      if (context?.categories.length && !categoryId) {
        setCategoryId(context.categories.find(c => c.type === type)?.id || '');
      }
      if (context?.accounts.length && !accountId) {
        setAccountId(context.accounts[0].id);
      }
    }
  }, [id, context, type]); // removed dependencies that cause loops

  const formatMoney = (value: string) => {
    // Basic mask logic handled in Input
    return value;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Permitir apenas números e vírgula
    value = value.replace(/[^0-9,]/g, '');

    // Garantir apenas uma vírgula
    const parts = value.split(',');
    if (parts.length > 2) {
      value = parts[0] + ',' + parts.slice(1).join('');
    }

    setAmount(value);
  };

  const handleBlurAmount = () => {
    if (!amount) return;
    if (!amount.includes(',')) {
      setAmount(amount + ',00');
    } else {
      const parts = amount.split(',');
      if (parts[1].length === 0) setAmount(parts[0] + ',00');
      if (parts[1].length === 1) setAmount(amount + '0');
    }
  };

  const handleSave = () => {
    const numericAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
    if (!numericAmount || !description || !categoryId || !accountId) return;

    const totalInstallments = hasInstallments ? parseInt(installments) : 1;

    // Create main transaction
    const baseTransaction: Transaction = {
      id: id || Date.now().toString(),
      description: totalInstallments > 1 ? `${description} (1/${totalInstallments})` : description,
      amount: numericAmount,
      type,
      categoryId,
      accountId,
      date,
      isFixed,
      paid,
      installments: totalInstallments > 1 ? { current: 1, total: totalInstallments } : undefined
    };

    StorageService.saveTransaction(baseTransaction);

    // Generate future installments
    if (!id && totalInstallments > 1) {
      let lastDate = new Date(date);
      for (let i = 2; i <= totalInstallments; i++) {
        // Add month
        lastDate.setMonth(lastDate.getMonth() + 1);

        const nextTrans: Transaction = {
          id: Date.now().toString() + i,
          description: `${description} (${i}/${totalInstallments})`,
          amount: numericAmount,
          type,
          categoryId,
          accountId,
          date: lastDate.toISOString().split('T')[0],
          isFixed: false,
          paid: false, // Future installments start as unpaid
          installments: { current: i, total: totalInstallments }
        };
        StorageService.saveTransaction(nextTrans);
      }
    }

    context?.refreshData();
    navigate('/dashboard');
  };

  const filteredCategories = context?.categories.filter(c => c.type === type) || [];
  const accounts = context?.accounts || [];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      <header className="flex items-center justify-between p-4 pb-2 sticky top-0 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md z-10">
        <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
          <Icon name="arrow_back" />
        </button>
        <h2 className="text-lg font-bold">{id ? 'Editar' : 'Nova'} {type === 'INCOME' ? 'Receita' : 'Despesa'}</h2>
        <button onClick={handleSave} className="text-primary font-bold">Salvar</button>
      </header>

      <div className="flex-1 p-6 space-y-8 no-scrollbar overflow-y-auto">
        {/* Value Input Area ... */}
        <div className="flex flex-col items-center justify-center py-4">
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Valor da {type === 'INCOME' ? 'entrada' : 'saída'}</p>
          <div className="flex items-center justify-center w-full">
            <span className="text-slate-400 text-3xl font-bold mr-2">R$</span>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={handleAmountChange}
              onBlur={handleBlurAmount}
              className="bg-transparent border-none text-center text-5xl font-extrabold text-slate-900 dark:text-white focus:ring-0 p-0 w-full"
              placeholder="0,00"
              autoFocus={!id}
            />
          </div>
        </div>

        {/* Type Toggle */}
        <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setType('INCOME')}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${type === 'INCOME' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500'}`}
          >
            Receita
          </button>
          <button
            onClick={() => setType('EXPENSE')}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${type === 'EXPENSE' ? 'bg-white dark:bg-slate-700 shadow-sm text-danger' : 'text-slate-500'}`}
          >
            Despesa
          </button>
        </div>

        {/* Dropdowns Section */}
        <div className="space-y-4">

          {/* Conta Dropdown */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px] px-1">Conta / Cartão</label>
            <div className="relative">
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full h-14 px-4 pr-10 rounded-2xl bg-white dark:bg-slate-800 border-2 border-transparent focus:border-primary outline-none font-bold transition-all appearance-none"
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
              <Icon name="expand_more" className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            </div>
          </div>

          {/* Categoria Dropdown */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px] px-1">Categoria</label>
            <div className="relative">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-14 px-4 pr-10 rounded-2xl bg-white dark:bg-slate-800 border-2 border-transparent focus:border-primary outline-none font-bold transition-all appearance-none"
              >
                <option value="">Selecione...</option>
                {filteredCategories
                  .filter(c => !c.parentId)
                  .map(parent => {
                    const children = filteredCategories.filter(c => c.parentId === parent.id);
                    return (
                      <optgroup key={parent.id} label={parent.name}>
                        <option value={parent.id}>{parent.name}</option>
                        {children.map(child => (
                          <option key={child.id} value={child.id}>&nbsp;&nbsp;&nbsp;&nbsp;{child.name}</option>
                        ))}
                      </optgroup>
                    )
                  })
                }
              </select>
              <Icon name="expand_more" className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            </div>
          </div>

        </div>

        {/* Details Form */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Detalhes</h3>
          <Card className="p-1 divide-y divide-slate-100 dark:divide-slate-700/50">
            <div className="flex items-center gap-4 p-4">
              <div className="size-10 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-primary">
                <Icon name="description" />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Descrição</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-transparent border-none p-0 text-base font-bold focus:ring-0 placeholder-slate-300"
                  placeholder="Ex: Compras no Supermercado"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 p-4">
              <div className="size-10 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-primary">
                <Icon name="calendar_today" />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Data</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent border-none p-0 text-base font-bold focus:ring-0"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-primary">
                  <Icon name="event_repeat" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Transação Fixa</h4>
                  <p className="text-xs text-slate-500">Repetir mensalmente</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFixed}
                  onChange={(e) => setIsFixed(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Paid Status Toggle */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className={`size-10 rounded-full flex items-center justify-center ${paid ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                  <Icon name={paid ? 'check_circle' : 'pending'} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{paid ? 'Paga / Recebida' : 'Pendente'}</h4>
                  <p className="text-xs text-slate-500">Status da transação</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={paid}
                  onChange={(e) => setPaid(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            {/* Installments Section */}
            {type === 'EXPENSE' && accounts.find(a => a.id === accountId)?.type === 'CREDIT_CARD' && (
              <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-full bg-purple-50 dark:bg-slate-800 flex items-center justify-center text-purple-600">
                    <Icon name="layers" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Parcelamento</h4>
                    <p className="text-xs text-slate-500">
                      {hasInstallments ? `${installments}x de R$ ${(parseFloat(amount.replace(',', '.')) / Math.max(1, parseInt(installments))).toFixed(2).replace('.', ',')}` : 'À vista'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {hasInstallments && (
                    <select
                      value={installments}
                      onChange={(e) => setInstallments(e.target.value)}
                      className="h-8 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold px-2 outline-none"
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i} value={i + 1}>{i + 1}x</option>
                      ))}
                      <option value="18">18x</option>
                      <option value="24">24x</option>
                    </select>
                  )}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasInstallments}
                      onChange={(e) => {
                        setHasInstallments(e.target.checked);
                        if (!e.target.checked) setInstallments('1');
                        else setInstallments('2');
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                  </label>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="pt-4 flex gap-4 pb-10">
          {id && (
            <Button
              variant="danger"
              className="flex-1 !h-14"
              onClick={() => {
                if (window.confirm('Excluir esta transação?')) {
                  StorageService.deleteTransaction(id);
                  context?.refreshData();
                  navigate('/dashboard');
                }
              }}
            >
              <Icon name="delete" /> Excluir
            </Button>
          )}
          <Button fullWidth onClick={handleSave} className="flex-[2] !h-14">
            <Icon name="check" /> {id ? 'Salvar Alterações' : 'Salvar Transação'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
