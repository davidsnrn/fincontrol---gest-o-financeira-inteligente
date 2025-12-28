import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { AppContext } from '../App';
import { StorageService } from '../services/storage';
import { Button, Icon } from '../components/UI';
import { Category, TransactionType } from '../types';

const CATEGORY_ICONS = [
    'payments', 'work', 'restaurant', 'directions_car', 'home',
    'health_and_safety', 'school', 'sports_esports', 'shopping_bag',
    'account_balance', 'flight', 'movie', 'fitness_center', 'pets',
    'cleaning_services', 'card_giftcard', 'checkroom', 'fastfood'
];

const COLORS = [
    '#ef4444', '#f59e0b', '#10b981', '#137fec', '#8b5cf6', '#ec4899',
    '#64748b', '#078838', '#0ea5e9', '#f43f5e', '#d946ef', '#f97316'
];

const CategoryForm: React.FC = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const context = useContext(AppContext);

    // Parse query params
    const queryParams = new URLSearchParams(location.search);
    const initialParentId = queryParams.get('parentId') || undefined;
    const initialType = (queryParams.get('type') as TransactionType) || 'EXPENSE';

    const [name, setName] = useState('');
    const [icon, setIcon] = useState('payments');
    const [color, setColor] = useState('#137fec');
    const [type, setType] = useState<TransactionType>(initialType);
    const [parentId, setParentId] = useState<string | undefined>(initialParentId);

    useEffect(() => {
        if (id && context?.categories) {
            const cat = context.categories.find(c => String(c.id) === String(id));
            if (cat) {
                setName(cat.name);
                setIcon(cat.icon);
                setColor(cat.color);
                setType(cat.type);
                setParentId(cat.parentId);
            }
        }
    }, [id, context?.categories]);

    const handleSave = () => {
        if (!name) return;

        const category: Category = {
            id: id || Date.now().toString(),
            name,
            icon,
            color,
            type,
            parentId
        };

        StorageService.saveCategory(category);
        context?.refreshData();
        navigate(parentId ? `/categories/${parentId}` : '/categories');
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
            <header className="flex items-center justify-between p-4 pb-2 sticky top-0 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md z-10">
                <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
                    <Icon name="arrow_back" />
                </button>
                <h2 className="text-lg font-bold">{id ? 'Editar' : 'Nova'} {parentId ? 'Subcategoria' : 'Categoria'}</h2>
                <button onClick={handleSave} className="text-primary font-bold">Salvar</button>
            </header>

            <div className="flex-1 p-6 space-y-8 no-scrollbar overflow-y-auto pb-32">
                <div className="flex flex-col items-center justify-center py-4">
                    <div
                        className="size-24 rounded-[32px] flex items-center justify-center text-white shadow-xl shadow-current/20 mb-6 transition-all duration-300"
                        style={{ backgroundColor: color }}
                    >
                        <Icon name={icon} filled className="text-[48px]" />
                    </div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-transparent border-none text-center text-3xl font-extrabold text-slate-900 dark:text-white focus:ring-0 p-0 w-full"
                        placeholder="Nome da Categoria"
                        autoFocus
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Tipo de Categoria</h3>
                    <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-2xl">
                        <button
                            onClick={() => { setType('INCOME'); setParentId(undefined); }}
                            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${type === 'INCOME' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500'}`}
                        >
                            Receita
                        </button>
                        <button
                            onClick={() => { setType('EXPENSE'); setParentId(undefined); }}
                            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${type === 'EXPENSE' ? 'bg-white dark:bg-slate-700 shadow-sm text-danger' : 'text-slate-500'}`}
                        >
                            Despesa
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Categoria Pai (Opcional)</h3>
                    <select
                        value={parentId || ''}
                        onChange={(e) => setParentId(e.target.value || undefined)}
                        className="w-full h-14 bg-white dark:bg-slate-800 rounded-2xl border-none font-bold text-sm px-4 focus:ring-2 focus:ring-primary/20 appearance-none"
                    >
                        <option value="">Nenhuma (Categoria Principal)</option>
                        {context?.categories
                            .filter(c => c.type === type && String(c.id) !== String(id) && !c.parentId)
                            .map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))
                        }
                    </select>
                </div>

                <div className="space-y-4">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Escolha um ícone</h3>
                    <div className="grid grid-cols-4 gap-4">
                        {CATEGORY_ICONS.map(ic => (
                            <button
                                key={ic}
                                onClick={() => setIcon(ic)}
                                className={`aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 ${icon === ic ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700'}`}
                            >
                                <Icon name={ic} className="text-2xl" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Escolha uma cor</h3>
                    <div className="grid grid-cols-6 gap-4">
                        {COLORS.map(c => (
                            <button
                                key={c}
                                onClick={() => setColor(c)}
                                className={`aspect-square rounded-full transition-all duration-300 ${color === c ? 'ring-4 ring-primary/20 scale-125' : 'scale-100'}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </div>

                <div className="pt-4 space-y-3">
                    <Button fullWidth onClick={handleSave} className="!h-16">
                        <Icon name="check" /> {id ? 'Salvar Alterações' : 'Criar Categoria'}
                    </Button>
                    {id && (
                        <Button
                            variant="ghost"
                            fullWidth
                            className="!text-danger"
                            onClick={() => {
                                if (window.confirm('Excluir esta categoria?')) {
                                    StorageService.deleteCategory(id);
                                    context?.refreshData();
                                    navigate('/categories');
                                }
                            }}
                        >
                            <Icon name="delete" /> Excluir Categoria
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryForm;
