import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, ShieldAlert, ArrowRight, User as UserIcon, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [requestedRole, setRequestedRole] = useState('ROLE_USER');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password, requestedRole);
            toast.success("Welcome back!", {
                icon: '🛍️',
                style: { borderRadius: '20px', background: '#1f2937', color: '#fff', fontWeight: 'bold' }
            });
            if (data.role === 'ROLE_ADMIN') {
                navigate('/admin/dashboard');
            } else {
                navigate('/customer/dashboard');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Invalid credentials", {
                icon: '🚫',
                style: { borderRadius: '20px', background: '#ef4444', color: '#fff', fontWeight: 'bold' }
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/10 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            <div className="w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl shadow-blue-100 border border-gray-100 relative z-10 transition-all hover:shadow-blue-200/50 duration-700">
                <div className="text-center space-y-4 mb-12">
                    <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-200 mx-auto rotate-[10deg] animate-bounce-subtle">
                        <LogIn size={32} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter">Sign In</h2>
                        <p className="text-gray-400 font-medium text-sm tracking-wide mt-2">Access your personalized shopping experience</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 text-left">
                    <div className="space-y-6">
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full pl-16 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Secret Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-16 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Access Role</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setRequestedRole('ROLE_USER')}
                                    className={`flex items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all font-black uppercase tracking-widest text-[10px] ${requestedRole === 'ROLE_USER' ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100'}`}
                                >
                                    <UserIcon size={16} /> Customer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRequestedRole('ROLE_ADMIN')}
                                    className={`flex items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all font-black uppercase tracking-widest text-[10px] ${requestedRole === 'ROLE_ADMIN' ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100'}`}
                                >
                                    <Shield size={16} /> Admin
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full py-6 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm hover:bg-blue-600 transition-all active:scale-95 shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 group relative overflow-hidden"
                        >
                            <span>Authenticate Now</span>
                            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>

                    <div className="text-center pt-8">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">
                            New member? <Link to="/register" className="text-blue-600 hover:underline decoration-2 underline-offset-4 decoration-blue-200">Create an account</Link>
                        </p>
                    </div>
                </form>

                <div className="mt-12 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4 items-center">
                    <ShieldAlert className="text-amber-500 shrink-0" size={20} />
                    <p className="text-[10px] text-amber-700 font-bold leading-tight uppercase tracking-tight">
                        Admins must select the Admin role to access backend management tools.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
