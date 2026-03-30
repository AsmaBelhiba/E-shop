import { X, ShoppingCart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const ProductDetailsPanel = ({ product, isOpen, onClose, onAddToCart }) => {
    if (!product) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Panel */}
            <div className={`fixed inset-y-0 right-0 w-full max-w-xl bg-white z-[70] shadow-2xl transition-transform duration-700 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-hidden flex flex-col`}>
                <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tighter italic underline decoration-blue-600 decoration-4 underline-offset-4">Product Detail</h2>
                    <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-2xl transition-all active:scale-90 text-gray-400">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                    {/* Image */}
                    <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner group">
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

                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 block mb-2">{product.category?.name || 'Premium Series'}</span>
                                <h1 className="text-4xl font-black text-gray-900 tracking-tight">{product.name}</h1>
                            </div>
                            <span className="text-4xl font-black text-blue-600">${product.price}</span>
                        </div>
                        <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Overview</h3>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            {product.description || "This exclusive item represents the pinnacle of craftsmanship and design. Carefully selected and tested to ensure the highest quality standards, it's designed to elevate your everyday experience with sophistication and reliability."}
                        </p>
                    </div>

                    {/* Key Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-8">
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                            <ShieldCheck className="text-green-500" size={20} />
                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-900 block">Warranty</span>
                            <span className="text-[10px] text-gray-400 block font-medium">2 Year Protection</span>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                            <Truck className="text-blue-500" size={20} />
                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-900 block">Shipping</span>
                            <span className="text-[10px] text-gray-400 block font-medium">Free Global Delivery</span>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                            <RefreshCw className="text-purple-500" size={20} />
                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-900 block">Returns</span>
                            <span className="text-[10px] text-gray-400 block font-medium">30 Day Returns</span>
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-gray-50 bg-gray-50/30 backdrop-blur-md">
                    <button
                        onClick={() => onAddToCart?.(product)}
                        className="w-full py-6 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm hover:bg-blue-600 transition-all active:scale-95 shadow-2xl shadow-gray-200 flex items-center justify-center gap-3 relative overflow-hidden group"
                    >
                        <ShoppingCart size={20} className="group-hover:animate-bounce" />
                        <span>Add to Cart</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default ProductDetailsPanel;
