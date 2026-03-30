import { ArrowRight, ShoppingBag, ShieldCheck, Truck, CreditCard, Star, ChevronRight, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
    const navigate = useNavigate();
    const [trending, setTrending] = useState([]);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const data = await productService.getRecentProducts();
                setTrending(data);
            } catch (error) {
                console.error("Trending fetch failed", error);
            }
        };
        fetchTrending();
    }, []);

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="space-y-10 animate-in slide-in-from-left duration-1000">
                        <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.4em] border border-blue-100 shadow-sm animate-bounce-subtle">
                            <TrendingUp size={14} /> Seasonal Collection 2026
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none italic">
                            Redefining <br />
                            <span className="text-blue-600 underline decoration-gray-100 underline-offset-8">Modern</span> Commerce.
                        </h1>
                        <p className="max-w-md text-gray-400 font-medium text-lg leading-relaxed">
                            Experience a curated selection of premium goods. Bridging the gap between timeless craftsmanship and contemporary design.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 pt-4">
                            <Link
                                to="/products"
                                className="px-12 py-6 bg-gray-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 shadow-2xl shadow-blue-100 transition-all flex items-center justify-center gap-3 active:scale-95 group"
                            >
                                Shop Trends <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                            </Link>
                            <Link
                                to="/categories"
                                className="px-12 py-6 bg-white text-gray-900 border border-gray-100 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-50 hover:shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 group"
                            >
                                View Collections <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="relative group animate-in zoom-in duration-1000 delay-150">
                        <div className="relative z-10 aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl shadow-blue-100 rotate-2 group-hover:rotate-0 transition-transform duration-700">
                            <img
                                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80"
                                alt="Premium Product"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                        </div>
                        {/* Decorative Background for Hero Image */}
                        <div className="absolute -top-10 -right-10 w-96 h-96 bg-blue-100/50 rounded-[4rem] -rotate-6 transition-transform duration-700 group-hover:rotate-0" />
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>

                {/* Background Shapes */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-50/50 -skew-x-12 translate-x-1/2 pointer-events-none" />
            </section>

            {/* Features Bar */}
            <section className="bg-white py-12 border-y border-gray-50">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="flex items-center gap-6 group">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:rotate-12">
                            <Truck size={24} />
                        </div>
                        <div>
                            <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs">Global Shipping</h4>
                            <p className="text-[10px] text-gray-400 font-bold">Fast & secure delivery</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 group">
                        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-3xl flex items-center justify-center shadow-inner group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 group-hover:rotate-12">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs">Buyer Protection</h4>
                            <p className="text-[10px] text-gray-400 font-bold">100% Satisfaction guarantee</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 group">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 group-hover:rotate-12">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs">Secure Payment</h4>
                            <p className="text-[10px] text-gray-400 font-bold">Zero-knowledge encryption</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trending Section */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto space-y-16">
                    <div className="flex justify-between items-end border-b border-gray-100 pb-10">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-none italic">
                                Trending <span className="text-blue-600 underline decoration-gray-100 underline-offset-8">Now</span>
                            </h2>
                            <p className="text-gray-400 font-medium max-w-sm">The most sought-after pieces from our latest catalog.</p>
                        </div>
                        <Link to="/products" className="mb-2 px-8 py-4 bg-gray-50 text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                            Explore All
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {trending.length > 0 ? trending.slice(0, 4).map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={() => navigate('/cart')}
                                onShowDetails={() => navigate(`/product/${product.id}`)}
                            />
                        )) : (
                            [1, 2, 3, 4].map(i => (
                                <div key={i} className="aspect-square bg-gray-50 rounded-[2.5rem] animate-pulse" />
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Premium Experience Section */}
            <section className="bg-gray-50/50 py-32 px-6">
                <div className="max-w-7xl mx-auto bg-white rounded-[4rem] p-12 md:p-24 flex flex-col lg:flex-row items-center gap-20 shadow-2xl shadow-blue-50 border border-gray-50 overflow-hidden relative group">
                    <div className="flex-1 space-y-8 relative z-10">
                        <Star className="text-blue-600 group-hover:rotate-180 transition-transform duration-1000" size={40} fill="currentColor" />
                        <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter italic">
                            A <span className="text-blue-600">World-Class</span> <br />
                            Shopping Pursuit.
                        </h2>
                        <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-lg">
                            We don't just sell products; we deliver a premium experience. Every touchpoint, from browsing to unboxing, is crafted with absolute precision.
                        </p>
                        <div className="flex gap-4">
                            <div className="px-6 py-4 bg-gray-50 rounded-2xl">
                                <p className="text-2xl font-black text-gray-900 leading-none">99%</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">Satisfaction</p>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 rounded-2xl">
                                <p className="text-2xl font-black text-gray-900 leading-none">24/7</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">Support</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 relative animate-in slide-in-from-right duration-1000">
                        <div className="w-full aspect-square bg-gray-900 rounded-[4rem] flex items-center justify-center p-20 shadow-2xl group-hover:scale-105 transition-transform duration-700">
                            <ShoppingBag className="text-blue-500 w-full h-full" strokeWidth={1} />
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl group-hover:-translate-x-4 transition-transform duration-500">
                            <ArrowRight size={40} className="text-white" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
