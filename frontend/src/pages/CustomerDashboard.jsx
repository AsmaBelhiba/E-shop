import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Tags, ArrowRight, ShoppingCart, TrendingUp, Clock, Layout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import ProductCard from '../components/ProductCard';

const CustomerDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ products: 0, categories: 0 });
    const [recentProducts, setRecentProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [pCount, cCount, recent] = await Promise.all([
                    productService.getProductCount(),
                    categoryService.getCategoryCount(),
                    productService.getRecentProducts()
                ]);
                setStats({ products: pCount, categories: cCount });
                setRecentProducts(recent);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/30 p-8 pt-24">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic">
                            Hello, <span className="text-blue-600 underline decoration-gray-100 underline-offset-8">{user?.fullName || 'Valued Member'}</span>
                        </h1>
                        <p className="text-gray-400 font-medium tracking-wide">Welcome to your personal shopping dashboard</p>
                    </div>
                    <Link
                        to="/products"
                        className="px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 shadow-2xl shadow-blue-100 transition-all flex items-center gap-3 active:scale-95 group"
                    >
                        Start Shopping <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-blue-50 transition-all group overflow-hidden relative">
                        <div className="relative z-10 flex items-center justify-between">
                            <div className="space-y-4">
                                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center p-3">
                                    <Package size={28} />
                                </div>
                                <div>
                                    <p className="text-4xl font-black text-gray-900">{stats.products}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Products</p>
                                </div>
                            </div>
                            <TrendingUp className="text-green-500 opacity-20 group-hover:opacity-100 transition-opacity" size={40} />
                        </div>
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-50/30 rounded-full blur-2xl" />
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-blue-50 transition-all group overflow-hidden relative">
                        <div className="relative z-10 flex items-center justify-between">
                            <div className="space-y-4">
                                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center p-3">
                                    <Tags size={28} />
                                </div>
                                <div>
                                    <p className="text-4xl font-black text-gray-900">{stats.categories}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Active Categories</p>
                                </div>
                            </div>
                            <Layout className="text-purple-500 opacity-20 group-hover:opacity-100 transition-opacity" size={40} />
                        </div>
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-50/30 rounded-full blur-2xl" />
                    </div>

                    <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-200 group overflow-hidden relative">
                        <div className="relative z-10 space-y-6">
                            <div className="w-14 h-14 bg-white/20 text-white rounded-2xl flex items-center justify-center p-3 backdrop-blur-md border border-white/20">
                                <ShoppingCart size={28} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white italic tracking-tighter">Your purchases await</h3>
                                <Link to="/cart" className="mt-4 inline-flex items-center gap-2 text-white/80 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
                                    View Panier <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                    </div>
                </div>

                {/* Recent Products Section */}
                <div className="space-y-8 pt-8">
                    <div className="flex justify-between items-end border-b border-gray-100 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-10 bg-blue-600 rounded-full"></div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight italic">New Arrivals</h2>
                        </div>
                        <Link to="/products" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:tracking-[0.25em] transition-all flex items-center gap-2">
                            Explore All <Clock size={14} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {recentProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={() => navigate('/cart')}
                                onShowDetails={() => navigate(`/product/${product.id}`)}
                            />
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 pb-12">
                    <Link to="/categories" className="group bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-2xl transition-all flex items-center justify-between ring-1 ring-gray-100/50">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-gray-900 italic tracking-tighter">Browse Categories</h3>
                            <p className="text-sm text-gray-400 font-medium">Find exactly what you're looking for</p>
                        </div>
                        <div className="p-5 bg-gray-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:translate-x-2">
                            <ArrowRight size={24} />
                        </div>
                    </Link>
                    <Link to="/purchases" className="group bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex items-center justify-between ring-1 ring-gray-200/20">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-gray-900 italic tracking-tighter">Order History</h3>
                            <p className="text-sm text-gray-400 font-medium">Track and repeat past orders</p>
                        </div>
                        <div className="p-5 bg-gray-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:translate-x-2">
                            <ArrowRight size={24} />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
