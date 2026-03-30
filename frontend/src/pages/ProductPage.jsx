import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ShieldCheck, Truck, RefreshCw, ArrowLeft } from 'lucide-react';
import productService from '../services/productService';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error("Failed to load product", error);
                toast.error("Failed to load product details");
                // Navigate back if product not found
                navigate('/products');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [id, navigate]);

    const handleAddToCart = () => {
        if (!product) return;
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

    if (!product) return null;

    return (
        <div className="min-h-screen bg-white pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-6 space-y-12">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors font-black uppercase tracking-widest text-[10px]"
                >
                    <ArrowLeft size={16} /> Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Image Gallery */}
                    <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-inner group relative">
                        <img
                            src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80'}
                            alt={product.name}
                            onError={(e) => {
                                if (e.target.src !== 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80') {
                                    e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80';
                                }
                            }}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                    </div>

                    {/* Product Details */}
                    <div className="space-y-10">
                        {/* Basic Info */}
                        <div className="space-y-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 inline-block px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                                {product.category?.name || 'Premium Series'}
                            </span>
                            <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-none italic">{product.name}</h1>
                            <span className="text-5xl font-black text-blue-600 block">${product.price}</span>
                        </div>
                        
                        <div className="h-1 w-20 bg-blue-600 rounded-full"></div>

                        {/* Description */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Overview</h3>
                            <p className="text-gray-600 leading-relaxed font-medium text-lg">
                                {product.description || "This exclusive item represents the pinnacle of craftsmanship and design. Carefully selected and tested to ensure the highest quality standards, it's designed to elevate your everyday experience with sophistication and reliability."}
                            </p>
                        </div>

                        {/* Key Features */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
                                <ShieldCheck className="text-green-500" size={24} />
                                <span className="text-xs font-black uppercase tracking-wider text-gray-900 block">Warranty</span>
                                <span className="text-[10px] text-gray-400 block font-bold">2 Year Protection</span>
                            </div>
                            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
                                <Truck className="text-blue-500" size={24} />
                                <span className="text-xs font-black uppercase tracking-wider text-gray-900 block">Shipping</span>
                                <span className="text-[10px] text-gray-400 block font-bold">Free Global Delivery</span>
                            </div>
                            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
                                <RefreshCw className="text-purple-500" size={24} />
                                <span className="text-xs font-black uppercase tracking-wider text-gray-900 block">Returns</span>
                                <span className="text-[10px] text-gray-400 block font-bold">30 Day Returns</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-6">
                            <button
                                onClick={handleAddToCart}
                                className="w-full py-6 bg-gray-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-sm hover:bg-blue-600 transition-all active:scale-95 shadow-2xl shadow-gray-200 flex items-center justify-center gap-4 relative overflow-hidden group"
                            >
                                <ShoppingCart size={22} className="group-hover:animate-bounce" />
                                <span>Add to Cart - ${product.price}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
