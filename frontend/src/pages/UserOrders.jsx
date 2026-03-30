import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const UserOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Assuming /api/orders/my is the endpoint for current user orders
                const res = await axios.get('http://localhost:8080/api/orders/my', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setOrders(res.data);
            } catch (error) {
                console.error("Orders fetch failed", error);
                // Fallback to empty if not implemented yet
                setOrders([]);
            } finally {
                setIsLoading(false);
            }
        };
        if (user) fetchOrders();
    }, [user]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50/20 pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center space-y-8">
                <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-50">
                    <Clock className="text-gray-200" size={60} />
                </div>
                <div className="space-y-2">
                    <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter">No purchase history</h2>
                    <p className="text-gray-400 font-medium">Your future acquisitions will appear here.</p>
                </div>
                <Link
                    to="/products"
                    className="px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 shadow-2xl shadow-blue-100 transition-all flex items-center gap-3 active:scale-95 group"
                >
                    Visit the Store <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/10 pt-32 pb-20 px-6">
            <div className="max-w-5xl mx-auto space-y-12">
                <div className="space-y-2 border-b border-gray-100 pb-8">
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic">Order <span className="text-blue-600">History</span></h1>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">Track your premium acquisitions</p>
                </div>

                <div className="space-y-8">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white rounded-[3rem] border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-blue-50 transition-all duration-700 overflow-hidden group">
                            <div className="p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative">
                                <div className="flex items-center gap-8 relative z-10">
                                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-blue-600 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-700">
                                        <Package size={32} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Order</span>
                                            <span className="text-lg font-black text-gray-900 italic tracking-tight">#{order.id.toString().padStart(6, '0')}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                                            <Clock size={12} />
                                            <span>{new Date(order.orderDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:items-end gap-2 relative z-10">
                                    <span className="text-3xl font-black text-gray-900 italic tracking-tighter">${order.totalAmount || '0.00'}</span>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                                        <CheckCircle size={14} />
                                        Delivered
                                    </div>
                                </div>

                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            {/* Line Items Preview */}
                            <div className="px-10 pb-10 grid grid-cols-2 md:grid-cols-4 gap-6">
                                {order.items?.map(item => (
                                    <div key={item.id} className="flex flex-col items-center text-center space-y-3 bg-gray-50/50 p-4 rounded-3xl border border-gray-50">
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm">
                                            <img src={item.product?.imageUrl} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-900 truncate w-24 uppercase tracking-tighter">{item.product?.name}</p>
                                            <p className="text-[9px] font-bold text-gray-400">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserOrders;
