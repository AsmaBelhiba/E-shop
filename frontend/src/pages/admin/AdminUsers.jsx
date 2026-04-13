import { useState, useEffect } from 'react';
import { Search, User as UserIcon, Shield, Mail, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import userService from '../../services/userService';
import { toast } from 'react-hot-toast';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [allRoles, setAllRoles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersData, rolesData] = await Promise.all([
                userService.getAllUsers(),
                userService.getAllRoles()
            ]);
            setUsers(usersData.data);
            setAllRoles(rolesData.data);
        } catch (error) {
            toast.error("Access restricted: Internal error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Terminate this user account? This action is permanent.")) {
            try {
                await userService.deleteUser(id);
                toast.success("User account terminated");
                fetchData();
            } catch (error) {
                toast.error("Action denied");
            }
        }
    };

    const toggleRole = async (user, roleName) => {
        const currentRoleNames = user.roles.map(r => r.name);
        let newRoleNames;
        
        if (currentRoleNames.includes(roleName)) {
            // Don't allow removing ROLE_USER or if it's the last role
            if (roleName === 'ROLE_USER') {
                toast.error("Cannot remove base USER role");
                return;
            }
            newRoleNames = currentRoleNames.filter(r => r !== roleName);
        } else {
            newRoleNames = [...currentRoleNames, roleName];
        }

        try {
            await userService.updateUserRoles(user.id, newRoleNames);
            toast.success("Permissions updated");
            fetchData();
        } catch (error) {
            toast.error("Failed to update roles");
        }
    };

    const filteredUsers = users.filter(u =>
        u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRoleBadgeStyle = (roleName) => {
        switch (roleName) {
            case 'ROLE_SUPERADMIN': return 'bg-red-50 text-red-600 border-red-100';
            case 'ROLE_ADMIN': return 'bg-purple-50 text-purple-600 border-purple-100';
            default: return 'bg-blue-50 text-blue-600 border-blue-100';
        }
    };

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
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic">Identity <span className="text-blue-600">Access</span></h1>
                    <p className="text-gray-400 font-medium tracking-wide">Manage system hierarchies and memberships</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-900/5 flex flex-col md:flex-row justify-between items-center gap-6">
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
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total Identities: {filteredUsers.length}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
                {filteredUsers.map(user => (
                    <div key={user.id} className="group bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-100/30 transition-all duration-700 relative overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                        <div className="md:col-span-4 flex flex-col items-center text-center space-y-4">
                            <div className="relative">
                                <div className="w-28 h-28 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-300 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-700 group-hover:rotate-6 group-hover:scale-110">
                                    <UserIcon size={48} />
                                </div>
                                <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center text-gray-900 font-black text-[11px] tracking-tighter italic">
                                    #{user.id}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 tracking-tight italic uppercase truncate max-w-[200px]">{user.fullName || 'Anonymous'}</h3>
                                <p className="text-xs font-bold text-gray-400 mt-1 truncate max-w-[200px]">{user.email}</p>
                            </div>
                        </div>

                        <div className="md:col-span-8 space-y-6">
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Assigned Privileges</h4>
                                <div className="flex flex-wrap gap-2">
                                    {user.roles.map(role => (
                                        <span key={role.id} className={`px-4 py-2 border rounded-2xl text-[10px] font-black uppercase tracking-widest ${getRoleBadgeStyle(role.name)}`}>
                                            {role.name.replace('ROLE_', '')}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-50 grid grid-cols-3 gap-3">
                                {allRoles.map(role => {
                                    const hasRole = user.roles.some(r => r.name === role.name);
                                    return (
                                        <button
                                            key={role.id}
                                            onClick={() => toggleRole(user, role.name)}
                                            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                                                hasRole 
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' 
                                                : 'bg-white border-gray-100 text-gray-400 hover:border-blue-600 hover:text-blue-600'
                                            }`}
                                        >
                                            <Shield size={16} />
                                            <span className="text-[8px] font-black uppercase tracking-widest leading-none">
                                                {role.name.replace('ROLE_', '')}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => handleDelete(user.id)}
                                className="w-full py-4 bg-red-50 text-red-600 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all shadow-sm"
                            >
                                Terminate Account
                            </button>
                        </div>

                        {/* Decor */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminUsers;
