import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import { Lock, ArrowRight, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (!token) {
            setValidating(false);
            setTokenValid(false);
            return;
        }
        authService.validateToken(token)
            .then(() => setTokenValid(true))
            .catch(() => setTokenValid(false))
            .finally(() => setValidating(false));
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            toast.error("Passwords do not match", { style: { borderRadius: '20px', background: '#ef4444', color: '#fff', fontWeight: 'bold' } });
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters", { style: { borderRadius: '20px', background: '#ef4444', color: '#fff', fontWeight: 'bold' } });
            return;
        }
        setLoading(true);
        try {
            await authService.setPassword(token, password);
            setDone(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to set password", { style: { borderRadius: '20px', background: '#ef4444', color: '#fff', fontWeight: 'bold' } });
        } finally {
            setLoading(false);
        }
    };

    if (validating) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="min-h-screen bg-gray-50/10 flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl text-center">
                    <div className="w-24 h-24 bg-red-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-red-200 mx-auto mb-8">
                        <XCircle size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 italic tracking-tighter mb-3">Invalid Link</h2>
                    <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8">
                        This password setup link is invalid or has expired. Please register again or contact an administrator.
                    </p>
                    <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all">
                        Back to Register <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        );
    }

    if (done) {
        return (
            <div className="min-h-screen bg-gray-50/10 flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl text-center">
                    <div className="w-24 h-24 bg-green-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-green-200 mx-auto mb-8 rotate-6">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 italic tracking-tighter mb-3">Password Set!</h2>
                    <p className="text-gray-400 text-sm font-medium">Redirecting you to sign in...</p>
                    <div className="mt-6 w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
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
                        <ShieldCheck size={32} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter">Set Password</h2>
                        <p className="text-gray-400 font-medium text-sm tracking-wide mt-2">Create a secure password for your account</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 text-left">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min. 6 characters"
                                    className="w-full pl-16 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Confirm Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    placeholder="Repeat your password"
                                    className={`w-full pl-16 pr-6 py-5 bg-gray-50 border rounded-2xl text-sm font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:bg-white transition-all shadow-inner ${confirm && confirm !== password ? 'border-red-300 focus:border-red-400' : 'border-gray-100 focus:border-blue-600'}`}
                                />
                            </div>
                            {confirm && confirm !== password && (
                                <p className="text-[10px] text-red-500 font-black uppercase tracking-widest ml-4">Passwords do not match</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading || (confirm && confirm !== password)}
                            className="w-full py-6 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm hover:bg-blue-600 transition-all active:scale-95 shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 group disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Confirm Password</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SetPassword;
