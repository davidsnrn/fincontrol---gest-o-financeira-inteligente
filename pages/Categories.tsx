
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { Icon, Button, Card } from '../components/UI';
import { TransactionType } from '../types';

const CategoriesPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<TransactionType>('EXPENSE');

  const categories = context?.categories.filter(c => c.type === filterType) || [];

  return (
    <div className="p-4 pt-6 space-y-6 min-h-screen bg-background-light dark:bg-background-dark">
      <header className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <Icon name="arrow_back" />
          </button>
          <h2 className="text-2xl font-bold">Categorias</h2>
        </div>
        <button
          onClick={() => navigate('/category/new')}
          className="size-10 flex items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20 hover:scale-110 transition-transform"
        >
          <Icon name="add" />
        </button>
      </header>

      <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-xl sticky top-4 z-10 shadow-sm transition-all duration-300">
        <button
          onClick={() => setFilterType('INCOME')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-300 ${filterType === 'INCOME' ? 'bg-white dark:bg-slate-700 shadow-md text-primary scale-[1.02]' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          Receitas
        </button>
        <button
          onClick={() => setFilterType('EXPENSE')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-300 ${filterType === 'EXPENSE' ? 'bg-white dark:bg-slate-700 shadow-md text-danger scale-[1.02]' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          Despesas
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 pb-24">
        {categories.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Icon name="category" className="text-5xl mb-4 opacity-10" />
            <p className="text-sm">Nenhuma categoria encontrada.</p>
          </div>
        ) : (
          categories
            .filter(c => !c.parentId)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(parent => {
              const children = context?.categories.filter(c => c.parentId === parent.id) || [];

              return (
                <div key={parent.id} className="space-y-2">
                  <Card
                    onClick={() => navigate(`/categories/${parent.id}`)}
                    className="flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer border-none shadow-sm hover:shadow-md bg-white dark:bg-slate-800 p-5"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="size-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-current/10 group-hover:scale-105 transition-transform duration-300"
                        style={{ backgroundColor: parent.color }}
                      >
                        <Icon name={parent.icon} filled className="text-2xl" />
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-slate-800 dark:text-slate-200">{parent.name}</h4>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-0.5">
                          {children.length} {children.length === 1 ? 'Subcategoria' : 'Subcategorias'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {children.length > 0 && (
                        <div className="flex -space-x-2 mr-2">
                          {children.slice(0, 3).map(child => (
                            <div key={child.id} className="size-6 rounded-full border-2 border-white dark:border-slate-800 overflow-hidden bg-slate-100" style={{ backgroundColor: child.color }}></div>
                          ))}
                        </div>
                      )}
                      <Icon name="chevron_right" className="text-slate-300 group-hover:text-primary transition-colors" />
                    </div>
                  </Card>
                </div>
              );
            })
        )}
      </div>

      <div className="pt-8 text-center text-slate-400">
        <Icon name="info" className="text-xl mb-1" />
        <p className="text-xs max-w-[200px] mx-auto">
          Você pode personalizar ícones e cores para melhor organização visual.
        </p>
      </div>
    </div>
  );
};

export default CategoriesPage;
