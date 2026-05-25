import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, ChevronRight, User, ShoppingBag, CreditCard, Filter, Search } from 'lucide-react';
import orderService from '../../services/orderService';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getAllOrders();
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch all orders", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filteredOrders = (orders || []).filter(order => 
        (order.user?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id?.toString().includes(searchTerm)
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic">Order <span className="text-blue-600">Fulfillment</span></h1>
                    <p className="text-gray-400 font-medium tracking-wide">Manage and track all customer acquisitions</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by Order ID or Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-[3.5rem] p-20 border border-gray-50 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                            <ShoppingBag size={48} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-gray-900">No Orders Found</h3>
                            <p className="text-gray-400 text-sm">Your search didn't return any order matches.</p>
                        </div>
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <div key={order.id} className="bg-white rounded-[3rem] border border-gray-50 shadow-sm hover:shadow-2xl hover:shadow-blue-100/30 transition-all duration-700 overflow-hidden group">
                            <div className="p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                                <div className="flex flex-wrap items-center gap-6">
                                    <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-gray-200 group-hover:scale-105 transition-transform duration-500">
                                        <Package size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">Order ID</span>
                                            <span className="text-lg font-black text-gray-900 italic tracking-tight leading-none">#{order.id.toString().padStart(6, '0')}</span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-2">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                <Clock size={12} />
                                                <span>{new Date(order.orderDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                                                <User size={12} />
                                                <span>{order.user?.fullName}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-10 lg:text-right">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">Status & Payment</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-tighter flex items-center gap-1">
                                                <CheckCircle size={12} /> Confirmed
                                            </span>
                                            <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-[9px] font-black uppercase tracking-tighter flex items-center gap-1">
                                                <CreditCard size={12} /> {order.paymentType || 'COD'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">Total Value</p>
                                        <div className="flex flex-col items-end mt-1">
                                            <span className="text-2xl font-black text-gray-900 italic tracking-tighter leading-none">
                                                ${((order.totalAmount || 0) + (order.deliveryFees || 0)).toFixed(2)}
                                            </span>
                                            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1">
                                                {order.deliveryFees > 0 ? `Incl. $${order.deliveryFees.toFixed(2)} delivery` : 'Free Delivery'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <button className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 hover:bg-blue-600 hover:text-white hover:shadow-lg transition-all duration-500">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Order Items Summary */}
                            <div className="px-8 pb-8 flex flex-wrap gap-4">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-2xl border border-gray-50/80">
                                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-white shadow-sm border border-gray-100">
                                            <img src={item.product?.imageUrl} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-700 uppercase tracking-tighter">
                                            {item.product?.name} <span className="text-gray-400 ml-1">x{item.quantity}</span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
