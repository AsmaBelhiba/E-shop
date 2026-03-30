import { ShoppingCart, Eye } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, onShowDetails }) => {
    return (
        <div className="group bg-white rounded-3xl p-4 border border-gray-50 shadow-sm hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
            {/* Image Container */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-6">
                <img
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'}
                    alt={product.name}
                    onError={(e) => {
                        if (e.target.src !== 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80') {
                            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80';
                        }
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button
                        onClick={() => onShowDetails?.(product)}
                        className="p-4 bg-white text-gray-900 rounded-2xl shadow-xl hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 active:scale-95 translate-y-4 group-hover:translate-y-0 duration-500"
                    >
                        <Eye size={20} />
                    </button>
                    <button
                        onClick={() => onAddToCart?.(product)}
                        className="p-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-200 hover:bg-gray-900 transition-all transform hover:scale-110 active:scale-95 translate-y-4 group-hover:translate-y-0 duration-500 delay-75"
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="space-y-2">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900 truncate pr-2">{product.name}</h3>
                    <span className="text-blue-600 font-extrabold text-lg">${product.price}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-gray-100">
                        {product.category?.name || 'Uncategorized'}
                    </span>
                </div>
                <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed pt-1">
                    {product.description || 'No description available for this premium item.'}
                </p>
            </div>
        </div>
    );
};

export default ProductCard;
