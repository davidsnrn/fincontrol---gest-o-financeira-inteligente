import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Icon } from '../components/UI';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white dark:bg-slate-900 overflow-hidden">
      <div className="flex-1 flex flex-col p-8 pt-16 items-center">
        {/* Professional Logo Icon */}
        <div className="size-20 bg-primary rounded-[28px] flex items-center justify-center shadow-2xl shadow-primary/40 mb-10 animate-in zoom-in-50 duration-700">
          <Icon name="account_balance_wallet" className="text-4xl text-white" />
        </div>

        <div className="space-y-4 text-center animate-in slide-in-from-bottom-5 duration-700 delay-200">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
            FinControl<span className="text-primary text-5xl leading-none">.</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-[280px] mx-auto leading-relaxed">
            Gestão financeira inteligente para quem valoriza cada centavo.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full mt-16 animate-in fade-in duration-1000 delay-500">
          <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/5">
            <div className="size-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-3">
              <Icon name="insights" />
            </div>
            <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Dashboard</p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Análise Real</p>
          </div>
          <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/5">
            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
              <Icon name="security" />
            </div>
            <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Seguro</p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Biometria</p>
          </div>
        </div>
      </div>

      <div className="p-10 space-y-4 bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-white/5 animate-in slide-in-from-bottom-10 duration-700 delay-700">
        <Button
          fullWidth
          onClick={() => navigate('/auth')}
          className="!h-16 shadow-xl shadow-primary/20"
        >
          Começar Agora
        </Button>

        <button
          onClick={() => alert('Integração com Google em breve!')}
          className="w-full h-16 rounded-22px border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center gap-3 active:scale-[0.98] transition-all bg-white dark:bg-slate-800 shadow-sm hover:border-primary/30"
        >
          <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="size-6" />
          <span className="font-bold text-slate-700 dark:text-slate-200">Entrar com Google</span>
        </button>

        <div className="pt-2 text-center">
          <p className="text-sm text-slate-400 font-medium">
            Já tem uma conta? <span
              onClick={() => navigate('/auth')}
              className="text-primary font-bold cursor-pointer hover:underline"
            >
              Fazer login
            </span>
          </p>
        </div>

        <p className="text-center text-[10px] text-slate-300 font-medium uppercase tracking-widest pt-4">
          Powered by DeepMind Technology
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;
