
import React, { useContext } from 'react';
import { AppContext } from '../App';
import { StorageService } from '../services/storage';
import { Card, Icon, Button } from '../components/UI';

const SettingsPage: React.FC = () => {
  const context = useContext(AppContext);
  const profile = context?.userProfile;

  const toggleTheme = () => {
    if (!profile) return;
    const newTheme = profile.theme === 'light' ? 'dark' : 'light';
    StorageService.saveUserProfile({ ...profile, theme: newTheme });
    context.refreshData();
  };

  const handleReset = () => {
    if (window.confirm('Deseja REALMENTE resetar todos os dados? Esta ação é irreversível.')) {
      StorageService.resetAll();
    }
  };

  return (
    <div className="p-4 pt-6 space-y-8">
      <header className="px-1">
        <h2 className="text-2xl font-bold">Configurações</h2>
      </header>

      {/* Profile Info */}
      <section>
        <Card className="flex items-center gap-4 p-5">
          <div className="size-16 rounded-full border-2 border-primary overflow-hidden shadow-lg shadow-primary/10">
            <img src="https://picsum.photos/seed/user1/200/200" alt="Avatar" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold">{profile?.name}</h3>
            <p className="text-sm text-slate-500">{profile?.email}</p>
            <div className="mt-1">
              <span className="bg-green-100 dark:bg-green-900/30 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Premium</span>
            </div>
          </div>
          <button className="text-primary hover:scale-110 active:scale-95 transition-transform" onClick={() => alert('Edição de perfil em breve!')}>
            <Icon name="edit" />
          </button>
        </Card>
      </section>

      {/* Security Section */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">Segurança</h3>
        <Card className="p-0 divide-y divide-slate-100 dark:divide-slate-700/50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                <Icon name="fingerprint" />
              </div>
              <span className="font-bold">Biometria / Face ID</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profile?.biometryEnabled}
                onChange={(e) => {
                  if (profile) {
                    StorageService.saveUserProfile({ ...profile, biometryEnabled: e.target.checked });
                    context.refreshData();
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" onClick={() => alert('Funcionalidade de alterar senha pendente')}>
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                <Icon name="lock" />
              </div>
              <span className="font-bold">Alterar Senha</span>
            </div>
            <Icon name="chevron_right" className="text-slate-300" />
          </div>
        </Card>
      </section>

      {/* Backup Section */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">Dados e Backup</h3>
        <Card className="p-0 divide-y divide-slate-100 dark:divide-slate-700/50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                <Icon name="cloud_sync" />
              </div>
              <div>
                <span className="font-bold block">Backup Automático</span>
                <span className="text-[10px] text-slate-500">Último: Hoje, 09:41</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profile?.backupEnabled}
                onChange={(e) => {
                  if (profile) {
                    StorageService.saveUserProfile({ ...profile, backupEnabled: e.target.checked });
                    context.refreshData();
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" onClick={toggleTheme}>
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                <Icon name={profile?.theme === 'light' ? 'dark_mode' : 'light_mode'} />
              </div>
              <span className="font-bold">Modo Escuro</span>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase">{profile?.theme === 'light' ? 'Desligado' : 'Ligado'}</span>
          </div>
        </Card>
      </section>

      {/* Danger Zone */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest px-2">Zona de Perigo</h3>
        <Card className="p-0 border-red-100 dark:border-red-900/30">
          <button
            onClick={handleReset}
            className="w-full flex items-center gap-4 p-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left"
          >
            <div className="size-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
              <Icon name="delete_forever" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-red-600">Resetar Todos os Dados</p>
              <p className="text-[10px] text-red-400">Essa ação não pode ser desfeita.</p>
            </div>
          </button>
        </Card>
      </section>

      <div className="text-center text-[10px] text-slate-400 pb-10">
        <p>FinControl v1.0.0 (Build 2024)</p>
        <p>© 2024 FinControl Inc. Todos os direitos reservados.</p>
      </div>
    </div>
  );
};

export default SettingsPage;
