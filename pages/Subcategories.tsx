import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../App';
import { Icon, Button, Card } from '../components/UI';

const SubcategoriesPage: React.FC = () => {
    const { parentId } = useParams<{ parentId: string }>();
    const context = useContext(AppContext);
    const navigate = useNavigate();

    const parent = context?.categories.find(c => String(c.id) === String(parentId));
    const subcategories = context?.categories
        .filter(c => String(c.parentId) === String(parentId))
        .sort((a, b) => a.name.localeCompare(b.name)) || [];

    if (!parent) {
        return (
            <div className="p-8 text-center text-slate-500">
                <p>Categoria não encontrada.</p>
                <Button onClick={() => navigate('/categories')} className="mt-4">Voltar</Button>
            </div>
        );
    }

    return (
        <div className="p-4 pt-6 space-y-6 min-h-screen bg-background-light dark:bg-background-dark">
            <header className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/categories')} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                        <Icon name="arrow_back" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold">{parent.name}</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Subcategorias</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate(`/category/edit/${parent.id}`)}
                        className="size-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                        <Icon name="edit" />
                    </button>
                    <button
                        onClick={() => navigate(`/category/new?parentId=${parent.id}&type=${parent.type}`)}
                        className="size-10 flex items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20 hover:scale-110 transition-transform"
                    >
                        <Icon name="add" />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-3">
                {subcategories.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-700/50">
                        <div className="size-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                            <Icon name="account_tree" className="text-3xl text-slate-200" />
                        </div>
                        <p className="text-sm text-slate-400 max-w-[200px] mx-auto">Você não tem subcategorias em <b>{parent.name}</b> ainda.</p>
                        <Button
                            variant="ghost"
                            className="mt-4 text-primary"
                            onClick={() => navigate(`/category/new?parentId=${parent.id}&type=${parent.type}`)}
                        >
                            Criar a primeira
                        </Button>
                    </div>
                ) : (
                    subcategories.map(child => (
                        <Card
                            key={child.id}
                            onClick={() => navigate(`/category/edit/${child.id}`)}
                            className="flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer border-none shadow-sm hover:shadow-md bg-white dark:bg-slate-800"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className="size-10 rounded-xl flex items-center justify-center text-white"
                                    style={{ backgroundColor: child.color }}
                                >
                                    <Icon name={child.icon} filled className="text-sm" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{child.name}</h4>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Toque para editar</p>
                                </div>
                            </div>
                            <Icon name="edit" className="text-slate-300 group-hover:text-primary transition-colors text-sm" />
                        </Card>
                    ))
                )}
            </div>

            <div className="pt-4">
                <Button
                    fullWidth
                    variant="secondary"
                    onClick={() => navigate(`/category/new?parentId=${parent.id}&type=${parent.type}`)}
                    className="border-dashed border-2 bg-transparent hover:bg-primary/5 hover:border-primary hover:text-primary"
                >
                    <Icon name="add_circle" /> Adicionar Subcategoria
                </Button>
            </div>
        </div>
    );
};

export default SubcategoriesPage;
