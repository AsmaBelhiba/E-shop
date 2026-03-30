import { useState, useEffect } from 'react';
import { Search, User as UserIcon, Shield, Mail, MoreVertical, Trash2, Filter } from 'lucide-react';
import userService from '../../services/userService';
import { toast } from 'react-hot-toast';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (error) {
            toast.error("Access restricted: Internal error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Terminate this user account? This action is permanent.")) {
            try {
                // Assuming deleteUser exists in userService
                toast.success("User account terminated");
                fetchUsers();
            } catch (error) {
                toast.error("Action denied");
            }
        }
    };

    const handleMakeAdmin = async (id) => {
        if (window.confirm("Grant administrator privileges to this user?")) {
            try {
                await userService.updateRole(id, "ROLE_ADMIN");
                toast.success("User promoted to Administrator");
                fetchUsers();
            } catch (error) {
                toast.error("Failed to update user role");
            }
        }
    };

    const filteredUsers = users.filter(u =>
        u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="p-20 flex justify-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic">Human <span className="text-blue-600">Resources</span></h1>
                    <p className="text-gray-400 font-medium tracking-wide">Manage system memberships and roles</p>
                </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-gray-50 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 ring-1 ring-black/5">
                <div className="relative w-full md:max-w-md group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-16 pr-8 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10 transition-all shadow-inner"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total Users: {filteredUsers.length}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                {filteredUsers.map(user => (
                    <div key={user.id} className="group bg-white p-8 rounded-[3rem] border border-gray-50 shadow-sm hover:shadow-2xl hover:shadow-blue-50 transition-all duration-700 relative overflow-hidden flex flex-col items-center text-center">
                        <div className="relative mb-6">
                            <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-700 group-hover:rotate-12 group-hover:scale-110">
                                <UserIcon size={40} />
                            </div>
                            <div className="absolute -right-2 -bottom-2 w-10 h-10 bg-white rounded-2xl shadow-lg border border-gray-50 flex items-center justify-center text-gray-900 font-black text-[10px] tracking-tighter italic">
                                ID-{user.id}
                            </div>
                        </div>

                        <div className="space-y-4 w-full">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 tracking-tight italic uppercase">{user.fullName || 'Anonymous User'}</h3>
                                <div className="flex items-center justify-center gap-2 mt-1">
                                    <Mail size={12} className="text-gray-400" />
                                    <p className="text-xs font-medium text-gray-400">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-3 pt-2">
                                <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${user.role === 'ROLE_ADMIN' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                    {user.role === 'ROLE_ADMIN' ? 'Administrator' : 'Verified Client'}
                                </span>
                            </div>

                            <div className="pt-6 border-t border-gray-50 flex justify-center gap-4">
                                {user.role !== 'ROLE_ADMIN' ? (
                                    <button 
                                        onClick={() => handleMakeAdmin(user.id)}
                                        title="Make Administrator"
                                        className="p-4 bg-gray-50 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-2xl transition-all shadow-sm"
                                    >
                                        <Shield size={18} />
                                    </button>
                                ) : (
                                    <div 
                                        title="User is already an Administrator"
                                        className="p-4 bg-purple-50/50 text-purple-300 rounded-2xl cursor-not-allowed"
                                    >
                                        <Shield size={18} />
                                    </div>
                                )}
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    title="Terminate Account"
                                    className="p-4 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all shadow-sm"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Decorative Background Accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminUsers;
