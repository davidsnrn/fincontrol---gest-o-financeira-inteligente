import React, { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { Card, Icon, Button } from '../components/UI';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const Dashboard: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  const transactions = context?.transactions || [];
  const categories = context?.categories || [];
  const accounts = context?.accounts || [];

  const [showBalance, setShowBalance] = React.useState(true);
  const [selectedMonth, setSelectedMonth] = React.useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());

  const handleMonthChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(y => y - 1);
      } else {
        setSelectedMonth(m => m - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(y => y + 1);
      } else {
        setSelectedMonth(m => m + 1);
      }
    }
  };

  const pendingTransactions = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      return !t.paid && t.type === 'EXPENSE' && d <= new Date(new Date().setDate(new Date().getDate() + 3)); // Due today or past or next 3 days
    });
  }, [transactions]);

  const totalConsolidatedBalance = useMemo(() => {
    return accounts.reduce((acc, a) => acc + a.balance, 0);
  }, [accounts]);

  const chartData = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return months.map((name, index) => {
      const monthTransactions = transactions.filter(t => new Date(t.date).getMonth() === index);
      const income = monthTransactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
      const expense = monthTransactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
      return { name, index, income, expense };
    });
  }, [transactions]);



  const monthSummary = useMemo(() => {
    const monthTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });
    const totalIncome = monthTransactions.filter(t => t.type === 'INCOME').reduce((acc: any, t) => acc + Number(t.amount), 0);
    const totalExpense = monthTransactions.filter(t => t.type === 'EXPENSE').reduce((acc: any, t) => acc + Number(t.amount), 0);
    return {
      balance: totalIncome - totalExpense,
      totalIncome,
      totalExpense,
      transactions: monthTransactions
    };
  }, [transactions, selectedMonth, selectedYear]);

  const categoryPieData = useMemo(() => {
    const expenseTransactions = monthSummary.transactions.filter(t => t.type === 'EXPENSE');
    const grouped = expenseTransactions.reduce((acc, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([id, amount]) => {
      const cat = categories.find(c => String(c.id) === String(id));
      return {
        name: cat?.name || 'Outros',
        value: amount,
        color: cat?.color || '#cbd5e1'
      };
    }).sort((a, b) => b.value - a.value);
  }, [monthSummary.transactions, categories]);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  return (
    <div className="p-4 space-y-6">
      <header className="flex justify-between items-center px-1">
        <div className="pl-14">
          <p className="text-slate-500 text-xs">Exibindo dados de</p>
          <div className="flex items-center gap-2">
            <button onClick={() => handleMonthChange('prev')} className="p-1 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><Icon name="chevron_left" /></button>
            <h2 className="text-lg font-bold leading-tight text-primary flex items-center gap-2">
              {monthNames[selectedMonth]} {selectedYear}
              <Icon name="calendar_month" className="text-sm opacity-50" />
            </h2>
            <button onClick={() => handleMonthChange('next')} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><Icon name="chevron_right" /></button>
          </div>
        </div>
        <button
          onClick={() => alert(`${pendingTransactions.length} contas a pagar próximas do vencimento ou vencidas.`)}
          className="size-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm active:scale-90 transition-transform relative"
        >
          <Icon name="notifications" className="text-slate-600 dark:text-slate-300" />
          {pendingTransactions.length > 0 && (
            <span className="absolute top-2 right-2 size-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
          )}
        </button>
      </header>

      {/* Main Balance Card */}
      <section className="relative overflow-hidden bg-primary rounded-3xl p-6 text-white shadow-xl shadow-primary/20 group">
        <div className="absolute top-0 right-0 size-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="relative z-10 space-y-4">
          <div className="flex justify-between items-center opacity-80">
            <span className="text-sm font-medium">Saldo Total Consolidado</span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="size-10 -mr-2 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
              <Icon name={showBalance ? "visibility" : "visibility_off"} className="text-[20px]" />
            </button>
          </div>
          <div>
            <div className="relative min-h-[44px]">
              {showBalance ? (
                <h1 className="text-4xl font-extrabold tracking-tight transition-all duration-300">
                  {formatCurrency(totalConsolidatedBalance)}
                </h1>
              ) : (
                <div className="flex items-center gap-1.5 h-[44px]">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="size-2.5 bg-white/40 rounded-full"></div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-green-300 text-sm mt-1">
              <Icon name="trending_up" className="text-[16px]" />
              <span className="font-bold">Total em todas as contas</span>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => navigate('/transaction/new')}
              className="flex-1 h-12 bg-white text-primary rounded-2xl flex items-center justify-center gap-2 font-black text-sm shadow-xl shadow-black/10 active:scale-[0.98] hover:scale-[1.02] transition-all"
            >
              <Icon name="add_circle" className="text-xl" />
              <span>Nova Transação</span>
            </button>
            <button
              onClick={() => alert('Scanner de QR Code em breve!')}
              className="size-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center active:scale-95 hover:bg-white/30 transition-all"
            >
              <Icon name="qr_code_scanner" />
            </button>
          </div>
        </div>
      </section>

      {/* Income / Expense Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
              <Icon name="arrow_downward" className="text-[18px]" />
            </div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Ganhos</span>
          </div>
          <p className="text-lg font-extrabold text-green-600">{formatCurrency(monthSummary.totalIncome)}</p>
        </Card>
        <Card className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
              <Icon name="arrow_upward" className="text-[18px]" />
            </div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Gastos</span>
          </div>
          <p className="text-lg font-extrabold text-red-600">{formatCurrency(monthSummary.totalExpense)}</p>
        </Card>
      </div>

      {pendingTransactions.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-700/30 p-4 rounded-3xl flex items-center justify-between cursor-pointer" onClick={() => navigate('/transactions?filter=pending')}>
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-orange-100 dark:bg-orange-800 text-orange-600 flex items-center justify-center">
              <Icon name="priority_high" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white">Contas a Pagar</h4>
              <p className="text-xs text-slate-500">{pendingTransactions.length} contas vencidas ou próximas</p>
            </div>
          </div>
          <Icon name="chevron_right" className="text-slate-400" />
        </div>
      )}

      {/* Monthly Flow Chart */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-bold">Fluxo Mensal</h3>
          <span className="text-slate-400 text-[10px] font-bold uppercase">Toque no mês para filtrar</span>
        </div>
        <Card className="h-48 pt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
              <Bar
                dataKey="expense"
                radius={[4, 4, 0, 0]}
                onClick={(data) => { if (data && data.index !== undefined) setSelectedMonth(data.index) }}
                className="cursor-pointer"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === selectedMonth ? '#137fec' : '#cbd5e1'}
                    className="transition-all duration-300"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </section>

      {/* Category Breakdown */}
      {categoryPieData.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-lg font-bold">Distribuição de Gastos</h3>
          <Card className="flex items-center justify-between p-6">
            <div className="size-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    innerRadius={35}
                    outerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2 pl-4 max-h-[120px] overflow-y-auto no-scrollbar">
              {categoryPieData.map((cat, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 truncate">
                    <div className="size-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }}></div>
                    <span className="font-medium text-slate-500 truncate">{cat.name}</span>
                  </div>
                  <span className="font-bold flex-shrink-0">{formatCurrency(cat.value)}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>
      )}

      {/* Recent Transactions */}
      <section className="space-y-4 pb-10">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-bold">Transações de {monthNames[selectedMonth]}</h3>
          <span className="text-primary text-sm font-bold cursor-pointer" onClick={() => navigate('/transactions')}>Ver Todas</span>
        </div>
        <div className="space-y-3">
          {monthSummary.transactions.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-700/50">
              <Icon name="history_toggle_off" className="text-3xl text-slate-300 mb-2" />
              <p className="text-xs text-slate-400">Nenhuma transação neste mês.</p>
            </div>
          ) : (
            monthSummary.transactions.slice().reverse().map(t => {
              const cat = categories.find(c => String(c.id) === String(t.categoryId));
              const parentCat = cat?.parentId ? categories.find(c => String(c.id) === String(cat.parentId)) : null;
              return (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm active:scale-[0.98] transition-all cursor-pointer hover:shadow-md border border-transparent hover:border-primary/10"
                  onClick={() => navigate(`/transaction/edit/${t.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="size-11 rounded-xl flex items-center justify-center shadow-lg shadow-current/5"
                      style={{ backgroundColor: `${cat?.color}15`, color: cat?.color }}
                    >
                      <Icon name={cat?.icon || 'payments'} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white">{t.description}</h4>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">
                        {parentCat ? `${parentCat.name} > ` : ''}
                        {cat?.name} • {new Date(t.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <p className={`font-extrabold text-sm ${t.type === 'INCOME' ? 'text-green-500' : 'text-slate-900 dark:text-white'}`}>
                    {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
