import { useState, useEffect } from 'react';
import { Layers3, Plus, Edit2, Trash2, Check, X, Car, Tag } from 'lucide-react';
import { usePlatformStore, Platform } from '../../store/platformStore';
import { useCategoryStore, Category } from '../../store/categoryStore';

const PLATFORM_COLORS = [
    { id: 'bg-black', label: 'Preto', preview: 'bg-black' },
    { id: 'bg-yellow-500', label: 'Amarelo', preview: 'bg-yellow-500' },
    { id: 'bg-green-500', label: 'Verde', preview: 'bg-green-500' },
    { id: 'bg-red-500', label: 'Vermelho', preview: 'bg-red-500' },
    { id: 'bg-orange-500', label: 'Laranja', preview: 'bg-orange-500' },
    { id: 'bg-blue-500', label: 'Azul', preview: 'bg-blue-500' },
    { id: 'bg-purple-500', label: 'Roxo', preview: 'bg-purple-500' },
    { id: 'bg-pink-500', label: 'Rosa', preview: 'bg-pink-500' },
    { id: 'bg-gray-500', label: 'Cinza', preview: 'bg-gray-500' },
];

function PlatformsCategoriesPage() {
    const [activeTab, setActiveTab] = useState<'platforms' | 'categories'>('platforms');

    // Platform state
    const { platforms, fetchPlatforms, addPlatform, updatePlatform, deletePlatform } = usePlatformStore();
    const [editingPlatformId, setEditingPlatformId] = useState<string | null>(null);
    const [editingPlatformName, setEditingPlatformName] = useState('');
    const [editingPlatformColor, setEditingPlatformColor] = useState('bg-gray-500');
    const [newPlatformName, setNewPlatformName] = useState('');
    const [newPlatformColor, setNewPlatformColor] = useState('bg-gray-500');
    const [showNewPlatformForm, setShowNewPlatformForm] = useState(false);
    const [deletingPlatformId, setDeletingPlatformId] = useState<string | null>(null);

    // Category state
    const { categories, fetchCategories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [editingCategoryName, setEditingCategoryName] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
    const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

    useEffect(() => {
        fetchPlatforms();
        fetchCategories();
    }, [fetchPlatforms, fetchCategories]);

    // Platform handlers
    const handleAddPlatform = async () => {
        if (!newPlatformName.trim()) return;
        await addPlatform({
            name: newPlatformName.trim(),
            color: newPlatformColor,
            isActive: true,
            sortOrder: platforms.length,
        });
        setNewPlatformName('');
        setNewPlatformColor('bg-gray-500');
        setShowNewPlatformForm(false);
    };

    const handleEditPlatform = (platform: Platform) => {
        setEditingPlatformId(platform.id);
        setEditingPlatformName(platform.name);
        setEditingPlatformColor(platform.color);
    };

    const handleSavePlatform = async () => {
        if (!editingPlatformId || !editingPlatformName.trim()) return;
        await updatePlatform(editingPlatformId, {
            name: editingPlatformName.trim(),
            color: editingPlatformColor,
        });
        setEditingPlatformId(null);
    };

    const handleDeletePlatform = async (id: string) => {
        await deletePlatform(id);
        setDeletingPlatformId(null);
    };

    // Category handlers
    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        await addCategory({
            name: newCategoryName.trim(),
            icon: 'tag',
            isActive: true,
            sortOrder: categories.length,
        });
        setNewCategoryName('');
        setShowNewCategoryForm(false);
    };

    const handleEditCategory = (category: Category) => {
        setEditingCategoryId(category.id);
        setEditingCategoryName(category.name);
    };

    const handleSaveCategory = async () => {
        if (!editingCategoryId || !editingCategoryName.trim()) return;
        await updateCategory(editingCategoryId, {
            name: editingCategoryName.trim(),
        });
        setEditingCategoryId(null);
    };

    const handleDeleteCategory = async (id: string) => {
        await deleteCategory(id);
        setDeletingCategoryId(null);
    };

    return (
        <div className="space-y-6">
            {/* Page Title */}
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary-100 dark:bg-primary-900/30">
                    <Layers3 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Plataformas e Categorias
                </h1>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                <button
                    onClick={() => setActiveTab('platforms')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition ${activeTab === 'platforms'
                        ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                        }`}
                >
                    <Car className="h-4 w-4" />
                    Plataformas
                </button>
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition ${activeTab === 'categories'
                        ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                        }`}
                >
                    <Tag className="h-4 w-4" />
                    Categorias
                </button>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                {activeTab === 'platforms' ? (
                    <>
                        {/* Platforms List */}
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {platforms.map((platform) => (
                                <div key={platform.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition relative group">
                                    {deletingPlatformId === platform.id ? (
                                        <div className="absolute inset-0 bg-red-50 dark:bg-red-900/30 flex items-center justify-center gap-4 z-10">
                                            <span className="text-sm text-red-700 dark:text-red-300 font-medium">Excluir esta plataforma?</span>
                                            <button
                                                onClick={() => handleDeletePlatform(platform.id)}
                                                className="px-3 py-1.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700"
                                            >
                                                Sim
                                            </button>
                                            <button
                                                onClick={() => setDeletingPlatformId(null)}
                                                className="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-lg"
                                            >
                                                Não
                                            </button>
                                        </div>
                                    ) : null}

                                    {editingPlatformId === platform.id ? (
                                        <div className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded-full ${editingPlatformColor}`} />
                                            <input
                                                type="text"
                                                value={editingPlatformName}
                                                onChange={(e) => setEditingPlatformName(e.target.value)}
                                                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                                autoFocus
                                            />
                                            <select
                                                value={editingPlatformColor}
                                                onChange={(e) => setEditingPlatformColor(e.target.value)}
                                                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                            >
                                                {PLATFORM_COLORS.map((c) => (
                                                    <option key={c.id} value={c.id}>{c.label}</option>
                                                ))}
                                            </select>
                                            <button onClick={handleSavePlatform} className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg">
                                                <Check className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => setEditingPlatformId(null)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded-full ${platform.color}`} />
                                                <span className="text-gray-900 dark:text-white font-medium">{platform.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEditPlatform(platform)}
                                                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeletingPlatformId(platform.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Add Platform Form */}
                        {showNewPlatformForm ? (
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className={`w-4 h-4 rounded-full ${newPlatformColor}`} />
                                    <input
                                        type="text"
                                        value={newPlatformName}
                                        onChange={(e) => setNewPlatformName(e.target.value)}
                                        placeholder="Nome da plataforma"
                                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                        autoFocus
                                    />
                                    <select
                                        value={newPlatformColor}
                                        onChange={(e) => setNewPlatformColor(e.target.value)}
                                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                    >
                                        {PLATFORM_COLORS.map((c) => (
                                            <option key={c.id} value={c.id}>{c.label}</option>
                                        ))}
                                    </select>
                                    <button onClick={handleAddPlatform} className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg">
                                        <Check className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => { setShowNewPlatformForm(false); setNewPlatformName(''); }} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowNewPlatformForm(true)}
                                className="w-full p-4 flex items-center justify-center gap-2 text-primary-600 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition border-t border-gray-100 dark:border-gray-700"
                            >
                                <Plus className="h-4 w-4" />
                                <span className="font-medium">Adicionar Plataforma</span>
                            </button>
                        )}
                    </>
                ) : (
                    <>
                        {/* Categories List */}
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {categories.map((category) => (
                                <div key={category.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition relative group">
                                    {deletingCategoryId === category.id ? (
                                        <div className="absolute inset-0 bg-red-50 dark:bg-red-900/30 flex items-center justify-center gap-4 z-10">
                                            <span className="text-sm text-red-700 dark:text-red-300 font-medium">Excluir esta categoria?</span>
                                            <button
                                                onClick={() => handleDeleteCategory(category.id)}
                                                className="px-3 py-1.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700"
                                            >
                                                Sim
                                            </button>
                                            <button
                                                onClick={() => setDeletingCategoryId(null)}
                                                className="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-lg"
                                            >
                                                Não
                                            </button>
                                        </div>
                                    ) : null}

                                    {editingCategoryId === category.id ? (
                                        <div className="flex items-center gap-3">
                                            <Tag className="h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={editingCategoryName}
                                                onChange={(e) => setEditingCategoryName(e.target.value)}
                                                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                                autoFocus
                                            />
                                            <button onClick={handleSaveCategory} className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg">
                                                <Check className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => setEditingCategoryId(null)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Tag className="h-4 w-4 text-gray-400" />
                                                <span className="text-gray-900 dark:text-white font-medium">{category.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEditCategory(category)}
                                                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeletingCategoryId(category.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Add Category Form */}
                        {showNewCategoryForm ? (
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <Tag className="h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        placeholder="Nome da categoria"
                                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                        autoFocus
                                    />
                                    <button onClick={handleAddCategory} className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg">
                                        <Check className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => { setShowNewCategoryForm(false); setNewCategoryName(''); }} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowNewCategoryForm(true)}
                                className="w-full p-4 flex items-center justify-center gap-2 text-primary-600 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition border-t border-gray-100 dark:border-gray-700"
                            >
                                <Plus className="h-4 w-4" />
                                <span className="font-medium">Adicionar Categoria</span>
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default PlatformsCategoriesPage;
