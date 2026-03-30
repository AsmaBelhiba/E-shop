import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Menu, ShoppingBag, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const Navbar = ({ onMenuClick }) => {
    const { user, role, logout, setRole } = useAuth(); // Assuming setRole added to context
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [showRoleSelector, setShowRoleSelector] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActuallyAdmin = user?.role === 'ROLE_ADMIN' || localStorage.getItem('userRole') === 'ROLE_ADMIN';
    const currentRole = role || localStorage.getItem('userRole') || 'ROLE_USER';

    const toggleRole = (newRole) => {
        if (setRole) setRole(newRole);
        localStorage.setItem('userRole', newRole);
        setShowRoleSelector(false);
        if (newRole === 'ROLE_ADMIN') {
            navigate('/admin/dashboard');
        } else {
            navigate('/customer/dashboard');
        }
    };

    return (
        <nav className="bg-white/90 backdrop-blur-xl shadow-lg shadow-blue-50/50 border-b border-gray-50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between h-24 items-center">
                    <div className="flex items-center gap-10">
                        {onMenuClick && (
                            <button
                                onClick={onMenuClick}
                                className="p-3 rounded-2xl lg:hidden hover:bg-gray-100 transition-all active:scale-90"
                            >
                                <Menu size={24} />
                            </button>
                        )}
                        <Link to="/" className="flex items-center gap-4 group">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200 group-hover:rotate-[15deg] transition-all duration-300">
                                <ShoppingBag size={24} />
                            </div>
                            <span className="text-3xl font-black italic tracking-tighter text-gray-900 leading-none">
                                E-SHOP
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center gap-10">
                            <Link to="/products" className="text-[13px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-all">Products</Link>
                            <Link to="/categories" className="text-[13px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-all">Categories</Link>
                            {user && (
                                <Link to={currentRole === 'ROLE_ADMIN' ? "/admin/dashboard" : "/customer/dashboard"} className="text-[13px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-all">Dashboard</Link>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {currentRole !== 'ROLE_ADMIN' && (
                            <Link to="/cart" className="relative p-4 text-gray-900 bg-gray-50/50 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all group">
                                <ShoppingCart size={24} />
                                {cartCount > 0 && (
                                    <span className="absolute top-2 right-2 w-6 h-6 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-4 border-white animate-bounce-subtle">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        <div className="h-8 w-px bg-gray-100 mx-1 hidden sm:block"></div>

                        {user ? (
                            <div className="flex items-center gap-4">
                                {isActuallyAdmin && (
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowRoleSelector(!showRoleSelector)}
                                            className="flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all cursor-pointer shadow-xl shadow-gray-200"
                                        >
                                            <span>{currentRole === 'ROLE_ADMIN' ? 'Admin' : 'Customer'}</span>
                                            <ChevronDown size={14} className={`transition-transform duration-300 ${showRoleSelector ? 'rotate-180' : ''}`} />
                                        </button>

                                        {showRoleSelector && (
                                            <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 animate-in fade-in slide-in-from-top-2 duration-300 ring-1 ring-black/5">
                                                <button
                                                    onClick={() => toggleRole('ROLE_ADMIN')}
                                                    className={`w-full text-left px-5 py-3 text-[11px] font-black uppercase tracking-widest transition-colors ${currentRole === 'ROLE_ADMIN' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
                                                >
                                                    Admin View
                                                </button>
                                                <button
                                                    onClick={() => toggleRole('ROLE_USER')}
                                                    className={`w-full text-left px-5 py-3 text-[11px] font-black uppercase tracking-widest transition-colors ${currentRole === 'ROLE_USER' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
                                                >
                                                    Customer View
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="p-4 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-95 group"
                                    title="Logout"
                                >
                                    <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="px-8 py-4 text-[13px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-all">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-8 py-4 bg-gray-900 text-white text-[13px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 shadow-2xl shadow-blue-100 transition-all active:scale-95"
                                >
                                    Join Now
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
