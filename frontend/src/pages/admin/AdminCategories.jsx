import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Tags, ArrowRight, X } from 'lucide-react';
import categoryService from '../../services/categoryService';
import { toast } from 'react-hot-toast';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getAllCategories();
            setCategories(data);
        } catch (error) {
            toast.error("Failed to fetch categories");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setCategoryName(category.name);
        } else {
            setEditingCategory(null);
            setCategoryName('');
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await categoryService.updateCategory(editingCategory.id, { name: categoryName });
                toast.success("Category updated");
            } else {
                await categoryService.createCategory({ name: categoryName });
                toast.success("Category created");
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            toast.error("Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this category? Products in this category might be affected.")) {
            try {
                await categoryService.deleteCategory(id);
                toast.success("Category removed");
                fetchCategories();
            } catch (error) {
                toast.error("Delete failed");
            }
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic">Category <span className="text-blue-600">Taxonomy</span></h1>
                    <p className="text-gray-400 font-medium tracking-wide">Organize your store collections</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 shadow-2xl shadow-blue-100 transition-all flex items-center gap-3 active:scale-95 group"
                >
                    <Plus size={18} /> New Category
                </button>
            </div>

            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-gray-50 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 ring-1 ring-black/5">
                <div className="relative w-full md:max-w-md group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Filter by category name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-16 pr-8 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10 transition-all"
                    />
                </div>
                <div className="px-6 py-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center gap-4">
                    <Tags className="text-blue-600" size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">{filteredCategories.length} Categories</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCategories.map(cat => (
                    <div key={cat.id} className="group bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-2xl hover:shadow-blue-50 transition-all duration-500 relative overflow-hidden">
                        <div className="relative z-10 flex justify-between items-start">
                            <div className="space-y-4">
                                <div className="w-14 h-14 bg-gray-50 text-gray-900 rounded-2xl flex items-center justify-center p-3 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:rotate-6">
                                    <Tags size={24} />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">{cat.name}</h3>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleOpenModal(cat)}
                                    className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-white rounded-xl shadow-sm transition-all"
                                >
                                    <Edit2 size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(cat.id)}
                                    className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-white rounded-xl shadow-sm transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-50/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl relative p-10 space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-black text-gray-900 italic tracking-tighter">
                                {editingCategory ? 'Edit' : 'Create'} <span className="text-blue-600">Category</span>
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-all text-gray-400"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Category Identity</label>
                                <input
                                    type="text" required
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all shadow-inner"
                                    placeholder="Ex: Luxury Accessories"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-6 bg-gray-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-blue-600 transition-all active:scale-95 shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 group"
                            >
                                <span>{editingCategory ? 'Commit Changes' : 'Initialize Category'}</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
