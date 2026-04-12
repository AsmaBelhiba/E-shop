import { useCart } from '../context/CartContext';
import orderService from '../services/orderService';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CreditCard, ShieldCheck, Truck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const CartPage = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        const orderItems = cart.map(item => ({
            product: { id: item.id },
            quantity: item.quantity,
            price: item.price
        }));

        toast.promise(
            orderService.checkout(orderItems),
            {
                loading: 'Finalizing purchase...',
                success: 'Purchase successful!',
                error: (err) => `Checkout failed: ${err.response?.data?.message || err.message}`,
            },
            {
                style: { borderRadius: '20px', background: '#1f2937', color: '#fff', fontWeight: 'bold' }
            }
        ).then(() => {
            clearCart();
            navigate('/purchases');
        });
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50/20 pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center space-y-8">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-50 relative">
                    <ShoppingBag className="text-gray-200" size={60} />
                    <div className="absolute top-0 right-0 w-8 h-8 bg-blue-600 rounded-full animate-ping" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter">Your panier is empty</h2>
                    <p className="text-gray-400 font-medium">Add some premium products to start your collection.</p>
                </div>
                <Link
                    to="/products"
                    className="px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 shadow-2xl shadow-blue-100 transition-all flex items-center gap-3 active:scale-95 group"
                >
                    Browse Collections <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/20 pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-end justify-between border-b border-gray-100 pb-8">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic">Shopping <span className="text-blue-600">Panier</span></h1>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">{cart.length} Premium Items selected</p>
                        </div>
                        <button
                            onClick={clearCart}
                            className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-500 transition-colors"
                        >Clear Cart</button>
                    </div>

                    <div className="space-y-6">
                        {cart.map(item => (
                            <div key={item.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-50 shadow-sm flex flex-col sm:flex-row items-center gap-8 group hover:shadow-xl hover:shadow-blue-50 transition-all duration-500">
                                <div className="w-32 h-32 rounded-3xl overflow-hidden bg-gray-50 shrink-0 shadow-inner group-hover:rotate-6 transition-transform">
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 space-y-2 text-center sm:text-left">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">{item.category?.name || 'Exclusive'}</span>
                                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                                    <p className="text-2xl font-black text-gray-900">${item.price}</p>
                                </div>
                                <div className="flex flex-col items-center sm:items-end gap-6 h-full justify-between py-2">
                                    <div className="flex items-center bg-gray-50 p-2 rounded-2xl border border-gray-100 gap-4">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors active:scale-90"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="font-black text-gray-900 w-4 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors active:scale-90"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-gray-300 hover:text-red-500 transition-colors p-2"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary */}
                <div className="space-y-8">
                    <div className="bg-gray-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-blue-100 space-y-10 relative overflow-hidden group">
                        <div className="relative z-10 space-y-8">
                            <h3 className="text-2xl font-black italic tracking-tighter">Order Summary</h3>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center text-sm font-medium text-gray-400">
                                    <span>Subtotal</span>
                                    <span className="text-white font-bold">${getCartTotal()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Free Delivery</span>
                                </div>
                                <div className="h-px bg-white/10" />
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-black uppercase tracking-widest text-gray-400 leading-none">Total Value</span>
                                    <span className="text-4xl font-black text-white italic tracking-tighter leading-none">${getCartTotal()}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-gray-900 transition-all active:scale-95 shadow-xl shadow-blue-900/50 flex items-center justify-center gap-3"
                            >
                                <CreditCard size={18} />
                                Secure Checkout
                            </button>
                        </div>

                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/30 transition-all duration-1000" />
                    </div>

                    {/* Trust Badges */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-900">Secure Payment</h4>
                                <p className="text-[10px] text-gray-400 font-medium">SSL Encrypted protection</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                                <Truck size={24} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-900">Global Shipping</h4>
                                <p className="text-[10px] text-gray-400 font-medium">Track your order worldwide</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
