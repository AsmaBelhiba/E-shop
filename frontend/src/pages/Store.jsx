import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Filter, ShoppingBag, LayoutGrid, List as ListIcon, ChevronDown, SlidersHorizontal } from 'lucide-react';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import ProductCard from '../components/ProductCard';
import ProductDetailsPanel from '../components/ProductDetailsPanel';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

const Store = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(location.state?.selectedCategory || 'All');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    useEffect(() => {
        if (location.state?.selectedCategory) {
            setSelectedCategory(location.state.selectedCategory);
        }
    }, [location.state?.selectedCategory]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pList, cList] = await Promise.all([
                    productService.getAllProducts(),
                    categoryService.getAllCategories()
                ]);
                setProducts(pList);
                setFilteredProducts(pList);
                setCategories(cList);
            } catch (error) {
                console.error("Error fetching store data", error);
                toast.error("Failed to load products");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        let result = products;
        if (selectedCategory !== 'All') {
            result = result.filter(p => p.category?.name === selectedCategory);
        }
        if (searchQuery) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        setFilteredProducts(result);
    }, [searchQuery, selectedCategory, products]);

    const handleShowDetails = (product) => {
        navigate(`/product/${product.id}`);
    };

    const handleAddToCart = (product) => {
        addToCart(product);
        toast.success(`${product.name} added to cart!`, {
            style: {
                borderRadius: '20px',
                background: '#1f2937',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '12px'
            },
            iconTheme: {
                primary: '#3b82f6',
                secondary: '#fff',
            }
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/20 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-6 space-y-12">
                {/* Hero Header */}
                <div className="bg-gray-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl shadow-blue-100">
                    <div className="relative z-10 max-w-2xl space-y-6">
                        <span className="text-blue-500 font-black uppercase tracking-[.4em] text-[10px] bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20 backdrop-blur-md">Collection 2026</span>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none italic">
                            Elevate Your <span className="text-blue-500 underline decoration-white/20 underline-offset-[12px] decoration-8">Everyday</span> Essentials
                        </h1>
                        <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-lg">
                            Curated excellence from around the globe. Discover products that combine function with high-end aesthetic.
                        </p>
                    </div>
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-8 bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-gray-50 shadow-sm sticky top-28 z-40 ring-1 ring-black/5">
                    <div className="relative w-full lg:max-w-md group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-8 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                        />
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <div className="relative flex-1 lg:flex-none min-w-[200px]">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full appearance-none pl-6 pr-12 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 focus:bg-white transition-all shadow-inner cursor-pointer"
                            >
                                <option value="All">All Collections</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                        <button className="p-5 bg-gray-900 text-white rounded-2xl hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-blue-100/50">
                            <SlidersHorizontal size={20} />
                        </button>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="space-y-10">
                    <div className="flex justify-between items-end border-b border-gray-100 pb-8">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 italic tracking-tighter">Premium Collection</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-2">Showing {filteredProducts.length} Results</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200"><LayoutGrid size={18} /></button>
                            <button className="p-3 bg-white text-gray-400 border border-gray-100 rounded-xl hover:text-blue-600 transition-colors"><ListIcon size={18} /></button>
                        </div>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                            {filteredProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={handleAddToCart}
                                    onShowDetails={handleShowDetails}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200 space-y-6">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShoppingBag className="text-gray-300" size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 italic tracking-tighter">No items found</h3>
                            <p className="text-gray-400 max-w-xs mx-auto text-sm font-medium">We couldn't find any products matching your current filters. Try resetting your search.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                                className="px-8 py-4 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-gray-200"
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <ProductDetailsPanel
                product={selectedProduct}
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                onAddToCart={(p) => { handleAddToCart(p); setIsPanelOpen(false); }}
            />
        </div>
    );
};

export default Store;
