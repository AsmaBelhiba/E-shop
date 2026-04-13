import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Tags,
    Users,
    Settings,
    LogOut,
    ChevronRight,
    ArrowUpRight,
    TrendingUp,
    Truck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { logout, role } = useAuth();
    const location = useLocation();
    
    const currentRole = role || localStorage.getItem('userRole') || 'ROLE_USER';

    const menuItems = [
        { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Inventory', path: '/admin/products', icon: Package },
        { name: 'Taxonomy', path: '/admin/categories', icon: Tags },
        { name: 'Suppliers', path: '/admin/suppliers', icon: Truck },
    ];

    if (currentRole === 'ROLE_SUPERADMIN') {
        menuItems.push({ name: 'Human Resources', path: '/admin/users', icon: Users });
    }

    return (
        <aside className="w-80 h-[calc(100vh-6rem)] sticky top-24 bg-white border-r border-gray-50 flex flex-col p-8 space-y-12 transition-all duration-700">
            {/* Admin Header */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100 italic font-black">
                        A
                    </div>
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 leading-none">Control Center</h4>
                        <p className="text-[10px] text-gray-400 font-bold mt-1">Management Suite v1.0</p>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between group cursor-pointer hover:bg-white hover:shadow-xl transition-all duration-500">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="text-blue-600" size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">System Live</span>
                    </div>
                    <ArrowUpRight className="text-gray-300 group-hover:text-blue-600 transition-colors" size={14} />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 ml-4 mb-6">Menu Architecture</p>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center justify-between p-5 rounded-3xl transition-all duration-500 group relative overflow-hidden ${isActive
                                ? 'bg-gray-900 text-white shadow-2xl shadow-gray-200'
                                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <div className="flex items-center gap-4 relative z-10">
                                <item.icon size={20} className={isActive ? 'text-blue-500' : 'group-hover:text-blue-600 transition-colors'} />
                                <span className={`text-[11px] font-black uppercase tracking-widest ${isActive ? 'italic' : ''}`}>
                                    {item.name}
                                </span>
                            </div>
                            {isActive && <ChevronRight size={16} className="text-blue-500 relative z-10" />}

                            {/* Hover Accent */}
                            {!isActive && (
                                <div className="absolute inset-0 bg-blue-50 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="pt-8 space-y-2 border-t border-gray-50">
                <button className="w-full flex items-center gap-4 p-5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-3xl transition-all duration-500 group text-[11px] font-black uppercase tracking-widest">
                    <Settings size={20} className="group-hover:rotate-180 transition-transform duration-1000" />
                    <span>Global Settings</span>
                </button>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-4 p-5 text-red-400 hover:text-white hover:bg-red-500 rounded-3xl transition-all duration-500 group text-[11px] font-black uppercase tracking-widest shadow-red-100 hover:shadow-xl"
                >
                    <LogOut size={20} />
                    <span>Terminate Session</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
