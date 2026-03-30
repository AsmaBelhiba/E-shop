import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Package, Image as ImageIcon, ExternalLink, MoreVertical, X, ArrowRight } from 'lucide-react';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import supplierService from '../../services/supplierService';
import { toast } from 'react-hot-toast';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        imageUrl: '',
        categoryId: '',
        supplierId: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [pList, cList, sList] = await Promise.all([
                productService.getAllProducts(),
                categoryService.getAllCategories(),
                supplierService.getAllSuppliers()
            ]);
            setProducts(pList);
            setCategories(cList);
            setSuppliers(sList);
        } catch (error) {
            toast.error("Failed to fetch product data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                price: product.price,
                description: product.description || '',
                imageUrl: product.imageUrl || '',
                categoryId: product.category?.id || '',
                supplierId: product.supplier?.id || ''
            });
        } else {
            setEditingProduct(null);
            setFormData({ name: '', price: '', description: '', imageUrl: '', categoryId: '', supplierId: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const productToSave = {
            ...formData,
            category: { id: formData.categoryId },
            supplier: formData.supplierId ? { id: formData.supplierId } : null
        };

        try {
            if (editingProduct) {
                await productService.updateProduct(editingProduct.id, productToSave);
                toast.success("Product updated successfully");
            } else {
                await productService.createProduct(productToSave);
                toast.success("Product created successfully");
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            toast.error("Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await productService.deleteProduct(id);
                toast.success("Product removed");
                fetchData();
            } catch (error) {
                toast.error("Delete failed");
            }
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic">Product <span className="text-blue-600">Inventory</span></h1>
                    <p className="text-gray-400 font-medium tracking-wide">Manage your premium product catalog</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 shadow-2xl shadow-blue-100 transition-all flex items-center gap-3 active:scale-95 group"
                >
                    <Plus size={18} /> New Product
                </button>
            </div>

            {/* Search & Stats */}
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-gray-50 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 ring-1 ring-black/5">
                <div className="relative w-full md:max-w-md group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Filter by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-16 pr-8 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10 transition-all"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="px-6 py-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center gap-4">
                        <Package className="text-blue-600" size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">{filteredProducts.length} Items</span>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-[3rem] border border-gray-50 shadow-sm overflow-hidden p-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50">
                                <th className="p-8">Product Details</th>
                                <th className="p-8">Category</th>
                                <th className="p-8">Price</th>
                                <th className="p-8">Status</th>
                                <th className="p-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProducts.map(product => (
                                <tr key={product.id} className="group hover:bg-gray-50/50 transition-all duration-500">
                                    <td className="p-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-2xl bg-gray-50 overflow-hidden shadow-inner group-hover:scale-110 transition-transform">
                                                <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black text-gray-900">{product.name}</h3>
                                                <p className="text-[10px] text-gray-400 font-medium truncate max-w-xs">{product.description || 'No description provided'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                                            {product.category?.name || 'Exclusive'}
                                        </span>
                                    </td>
                                    <td className="p-8">
                                        <span className="text-lg font-black text-gray-900">${product.price}</span>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Active</span>
                                        </div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenModal(product)}
                                                className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-10 border-b border-gray-50 flex justify-between items-center sticky top-0 bg-white z-10">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 italic tracking-tighter">
                                    {editingProduct ? 'Edit' : 'Create'} <span className="text-blue-600">Product</span>
                                </h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Fill in the product specifications</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-all text-gray-400"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Product Display Name</label>
                                    <input
                                        type="text" required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all"
                                        placeholder="Ex: Premium Watch"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Price ($)</label>
                                    <input
                                        type="number" required step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Category Assignment</label>
                                <select
                                    required
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all cursor-pointer"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Supplier Source</label>
                                <select
                                    value={formData.supplierId}
                                    onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all cursor-pointer"
                                >
                                    <option value="">Select a supplier (Optional)</option>
                                    {suppliers.map(sup => (
                                        <option key={sup.id} value={sup.id}>{sup.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">External Image URL</label>
                                <div className="relative group">
                                    <ImageIcon size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="url"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        className="w-full pl-16 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all"
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Product Description</label>
                                <textarea
                                    rows="4"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all resize-none"
                                    placeholder="Write something about this product..."
                                />
                            </div>

                            <div className="pt-6 sticky bottom-0 bg-white border-t border-gray-50">
                                <button
                                    type="submit"
                                    className="w-full py-6 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm hover:bg-blue-600 transition-all active:scale-95 shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 group"
                                >
                                    <span>{editingProduct ? 'Save Changes' : 'Launch Product'}</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
