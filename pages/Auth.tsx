
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { Button, Icon } from '../components/UI';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');

  const handleBiometry = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      context?.setAuthenticated(true);
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background-light dark:bg-background-dark p-8">
      <header className="mb-12">
        <div className="flex items-center gap-2 mb-8">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon name="account_balance_wallet" className="text-primary text-2xl" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white">FinControl</span>
        </div>

        <div className="relative mb-6 flex justify-center">
          <div className="relative">
            <div className="size-28 rounded-full border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden bg-slate-200">
              <img src="https://picsum.photos/seed/user1/200/200" alt="Avatar" />
            </div>
            <div className="absolute bottom-1 right-1 size-7 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
              <Icon name="check" className="text-white text-sm font-bold" />
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white">Bem-vindo, Alex</h2>
        <p className="text-center text-slate-500 mt-2">Para sua segurança, confirme sua identidade</p>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div
          onClick={handleBiometry}
          className="relative group cursor-pointer"
        >
          {isAuthenticating && (
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse"></div>
          )}
          <div className={`relative bg-white dark:bg-slate-800 rounded-full p-10 shadow-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-center transition-all ${isAuthenticating ? 'scale-110' : 'active:scale-95'}`}>
            <Icon name="fingerprint" className={`text-6xl ${isAuthenticating ? 'text-primary animate-pulse' : 'text-slate-300'}`} />
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className={`font-bold transition-opacity ${isAuthenticating ? 'opacity-100' : 'opacity-0'}`}>
            {isAuthenticating ? 'Escaneando...' : ''}
          </p>
          <p className="text-sm text-slate-400 mt-1">Toque no sensor para desbloquear</p>
        </div>
      </div>

      <div className="space-y-4">
        <Button fullWidth variant="secondary" onClick={() => setError('Fallback PIN não configurado neste demo.')}>
          <Icon name="dialpad" /> Usar PIN Numérico
        </Button>
        <div className="flex justify-between px-2 text-sm">
          <span className="text-slate-500 cursor-pointer hover:text-primary transition-colors" onClick={() => alert('Opção de trocar conta pendente')}>Trocar conta</span>
          <span className="text-primary font-bold cursor-pointer hover:underline" onClick={() => alert('Recuperação de senha pendente')}>Esqueci minha senha</span>
        </div>
      </div>

      {error && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg text-sm font-bold">
          {error}
        </div>
      )}
    </div>
  );
};

export default AuthPage;
