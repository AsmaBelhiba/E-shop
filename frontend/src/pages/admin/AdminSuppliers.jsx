import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Truck, ArrowRight, X, Mail, Phone, MapPin } from 'lucide-react';
import supplierService from '../../services/supplierService';
import { toast } from 'react-hot-toast';

const AdminSuppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        address: ''
    });

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const data = await supplierService.getAllSuppliers();
            setSuppliers(data);
        } catch (error) {
            toast.error("Failed to fetch suppliers");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (supplier = null) => {
        if (supplier) {
            setEditingSupplier(supplier);
            setFormData({
                name: supplier.name,
                email: supplier.email,
                phoneNumber: supplier.phoneNumber,
                address: supplier.address
            });
        } else {
            setEditingSupplier(null);
            setFormData({
                name: '',
                email: '',
                phoneNumber: '',
                address: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSupplier) {
                await supplierService.updateSupplier(editingSupplier.id, formData);
                toast.success("Supplier updated");
            } else {
                await supplierService.createSupplier(formData);
                toast.success("Supplier created");
            }
            setIsModalOpen(false);
            fetchSuppliers();
        } catch (error) {
            toast.error("Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this supplier? Check linked products before deleting.")) {
            try {
                await supplierService.deleteSupplier(id);
                toast.success("Supplier removed");
                fetchSuppliers();
            } catch (error) {
                toast.error("Delete failed");
            }
        }
    };

    const filteredSuppliers = suppliers.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic">Supplier <span className="text-blue-600">Network</span></h1>
                    <p className="text-gray-400 font-medium tracking-wide">Manage your inventory sources</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 shadow-2xl shadow-blue-100 transition-all flex items-center gap-3 active:scale-95 group"
                >
                    <Plus size={18} /> New Supplier
                </button>
            </div>

            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-gray-50 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 ring-1 ring-black/5">
                <div className="relative w-full md:max-w-md group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Filter by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-16 pr-8 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10 transition-all shadow-inner"
                    />
                </div>
                <div className="px-6 py-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center gap-4">
                    <Truck className="text-blue-600" size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">{filteredSuppliers.length} Suppliers</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSuppliers.map(sup => (
                    <div key={sup.id} className="group bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-2xl hover:shadow-blue-50 transition-all duration-500 relative overflow-hidden">
                        <div className="relative z-10 flex justify-between items-start">
                            <div className="space-y-6 flex-1">
                                <div className="w-14 h-14 bg-gray-50 text-gray-900 rounded-2xl flex items-center justify-center p-3 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:rotate-6">
                                    <Truck size={24} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">{sup.name}</h3>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <Mail size={12} /> {sup.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <Phone size={12} /> {sup.phoneNumber}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <MapPin size={12} /> {sup.address}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleOpenModal(sup)}
                                    className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-white rounded-xl shadow-sm transition-all"
                                >
                                    <Edit2 size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(sup.id)}
                                    className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-white rounded-xl shadow-sm transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-50/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl relative p-10 space-y-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center border-b border-gray-50 pb-6">
                            <h2 className="text-3xl font-black text-gray-900 italic tracking-tighter">
                                {editingSupplier ? 'Update' : 'Register'} <span className="text-blue-600">Supplier</span>
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-all text-gray-400"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Company Name</label>
                                    <input
                                        type="text" required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-8 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all shadow-inner"
                                        placeholder="Ex: Prime Supplies Inc."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Contact Email</label>
                                    <input
                                        type="email" required
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full px-8 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all shadow-inner"
                                        placeholder="contact@prime.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Phone Number</label>
                                <input
                                    type="text" required
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                    className="w-full px-8 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all shadow-inner"
                                    placeholder="+1 234 567 890"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Headquarters Address</label>
                                <textarea
                                    required
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    rows="3"
                                    className="w-full px-8 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all shadow-inner resize-none"
                                    placeholder="123 Supply Ave, Logistics City"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-6 bg-gray-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-blue-600 transition-all active:scale-95 shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 group mt-4"
                            >
                                <span>{editingSupplier ? 'Commit Updates' : 'Authorize Supplier'}</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSuppliers;
