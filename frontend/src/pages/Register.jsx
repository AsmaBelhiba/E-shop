import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, UserPlus, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(email, fullName);
            setSubmitted(true);
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed", {
                icon: '🚫',
                style: { borderRadius: '20px', background: '#ef4444', color: '#fff', fontWeight: 'bold' }
            });
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50/10 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

                <div className="w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl shadow-green-100 border border-gray-100 relative z-10 text-center">
                    <div className="w-24 h-24 bg-green-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-green-200 mx-auto mb-8 rotate-6">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 italic tracking-tighter mb-3">Check Your Email</h2>
                    <p className="text-gray-400 font-medium text-sm leading-relaxed mb-2">
                        We sent a password setup link to:
                    </p>
                    <p className="text-blue-600 font-black text-sm mb-8">{email}</p>
                    <p className="text-gray-400 text-xs font-semibold leading-relaxed mb-8">
                        Click the link in the email to create your password. The link expires in 24 hours.
                    </p>
                    <Link to="/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">
                        Back to Sign In <ArrowRight size={12} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/10 flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            <div className="w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl shadow-blue-100 border border-gray-100 relative z-10">
                <div className="text-center space-y-4 mb-12">
                    <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-200 mx-auto rotate-[10deg]">
                        <UserPlus size={32} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter">Register</h2>
                        <p className="text-gray-400 font-medium text-sm tracking-wide mt-2">
                            Create your account — a setup email will be sent to you
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 text-left">
                    <div className="space-y-6">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter your full name"
                                className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                            />
                        </div>

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
                    </div>

                    {/* Info box */}
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3 items-start">
                        <CheckCircle2 className="text-blue-500 shrink-0 mt-0.5" size={16} />
                        <p className="text-[10px] text-blue-700 font-bold leading-tight uppercase tracking-tight">
                            After registering, you'll receive an email to set your password. Your role will be assigned by an administrator.
                        </p>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-6 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm hover:bg-blue-600 transition-all active:scale-95 shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 group disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>

                    <div className="text-center pt-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 hover:underline decoration-2 underline-offset-4 decoration-blue-200">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
