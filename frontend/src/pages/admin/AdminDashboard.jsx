import { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
    Package, Tags, Users, TrendingUp, DollarSign, Activity,
    ChevronRight, ArrowUpRight, ArrowDownRight, RefreshCw, Truck
} from 'lucide-react';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import userService from '../../services/userService';
import supplierService from '../../services/supplierService';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        products: 0,
        categories: 0,
        users: 0,
        suppliers: 0,
        revenue: 12540.50, // Mock revenue as we don't have a real total yet
    });
    const [chartData, setChartData] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a'];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [pCount, cCount, uCount, sCount, allProducts, allCategories] = await Promise.all([
                    productService.getProductCount(),
                    categoryService.getCategoryCount(),
                    userService.getAllUsers().then(u => u.length),
                    supplierService.getSupplierCount(),
                    productService.getAllProducts(),
                    categoryService.getAllCategories()
                ]);

                setStats(s => ({ ...s, products: pCount, categories: cCount, users: uCount, suppliers: sCount }));

                // Prepare Chart Data (Products per category)
                const categoryMap = {};
                allProducts.forEach(p => {
                    const catName = p.category?.name || 'Uncategorized';
                    categoryMap[catName] = (categoryMap[catName] || 0) + 1;
                });

                const barData = Object.keys(categoryMap).map(name => ({
                    name,
                    count: categoryMap[name]
                }));
                setChartData(barData);

                const pieResults = Object.keys(categoryMap).map(name => ({
                    name,
                    value: categoryMap[name]
                }));
                setPieData(pieResults);

            } catch (error) {
                console.error("Error fetching admin stats", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const StatCard = ({ title, value, icon: Icon, color, trend }) => (
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-2xl hover:shadow-blue-100/30 transition-all duration-500 group relative overflow-hidden">
            <div className="relative z-10 flex justify-between items-start">
                <div className="space-y-4">
                    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center p-3 shadow-lg shadow-current/10 group-hover:rotate-12 transition-transform duration-500`}>
                        <Icon size={28} className="text-white" />
                    </div>
                    <div>
                        <p className="text-4xl font-black text-gray-900 tracking-tight">{value}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">{title}</p>
                    </div>
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <div className={`absolute -right-6 -bottom-6 w-32 h-32 ${color.replace('bg-', 'bg-opacity-5 ')} opacity-10 rounded-full blur-3xl`} />
        </div>
    );

    return (
        <div className="p-8 pb-20 space-y-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic">Enterprise <span className="text-blue-600">Overview</span></h1>
                    <p className="text-gray-400 font-medium tracking-wide">Real-time store metrics and inventory distribution</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="p-4 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-white hover:shadow-xl rounded-2xl transition-all active:scale-95 border border-gray-100"
                >
                    <RefreshCw size={20} />
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                <StatCard title="Total Inventory" value={stats.products} icon={Package} color="bg-blue-600" trend={12} />
                <StatCard title="Categories" value={stats.categories} icon={Tags} color="bg-purple-600" trend={5} />
                <StatCard title="Suppliers" value={stats.suppliers} icon={Truck} color="bg-orange-600" trend={8} />
                <StatCard title="Registered Users" value={stats.users} icon={Users} color="bg-pink-600" trend={24} />
                <StatCard title="Est. Revenue" value={`$${stats.revenue.toLocaleString()}`} icon={DollarSign} color="bg-emerald-600" trend={-2} />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Bar Chart */}
                <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-50 shadow-sm hover:shadow-xl transition-all duration-700 h-[500px] flex flex-col">
                    <div className="flex justify-between items-center mb-10">
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-gray-900 italic tracking-tighter">Inventory Distribution</h3>
                            <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">Stock across primary categories</p>
                        </div>
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors">
                            <Activity size={20} />
                        </div>
                    </div>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.9} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.5} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px -12px rgb(0 0 0 / 0.12)', fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-sm hover:shadow-xl transition-all duration-700 h-[500px] flex flex-col">
                    <div className="space-y-1 mb-10">
                        <h3 className="text-xl font-black text-gray-900 italic tracking-tighter">Market Share</h3>
                        <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">Category Weightage</p>
                    </div>
                    <div className="flex-1 min-h-0 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px -12px rgb(0 0 0 / 0.12)', fontSize: '12px', fontWeight: 'bold' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total</span>
                            <span className="text-3xl font-black text-gray-900">{stats.categories}</span>
                        </div>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-4 justify-center">
                        {pieData.map((d, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">{d.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity Table Mockup */}
            <div className="bg-white rounded-[3rem] border border-gray-50 shadow-sm p-10 space-y-8">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black text-gray-900 italic tracking-tighter">Recent System Activity</h3>
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:gap-3 transition-all">
                        View Audit Log <ChevronRight size={14} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50">
                                <th className="pb-6 px-4 font-black">Event</th>
                                <th className="pb-6 px-4 font-black">User</th>
                                <th className="pb-6 px-4 font-black">Status</th>
                                <th className="pb-6 px-4 font-black text-right">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[1, 2, 3].map((item) => (
                                <tr key={item} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="py-6 px-4 text-sm font-bold text-gray-900 capitalize italic">New product registered</td>
                                    <td className="py-6 px-4 text-xs font-medium text-gray-500">System Automator</td>
                                    <td className="py-6 px-4">
                                        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase">Success</span>
                                    </td>
                                    <td className="py-6 px-4 text-xs text-gray-400 text-right font-medium">2 mins ago</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
