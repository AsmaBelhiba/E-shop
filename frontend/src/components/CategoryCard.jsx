import { ArrowRight, Tag } from 'lucide-react';

const CategoryCard = ({ category, onClick }) => {
    return (
        <button
            onClick={() => onClick?.(category)}
            className="group w-full text-left bg-white rounded-3xl p-8 border border-gray-50 shadow-sm hover:shadow-2xl hover:shadow-blue-100/30 transition-all duration-500 flex items-center justify-between overflow-hidden relative"
        >
            <div className="flex items-center gap-6 relative z-10">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:rotate-[15deg] shadow-inner shadow-blue-100/50">
                    <Tag size={28} />
                </div>
                <div>
                    <h3 className="text-xl font-black text-gray-900 mb-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{category.name}</h3>
                    <p className="text-sm font-medium text-gray-400">Explore collection</p>
                </div>
            </div>

            <div className="p-4 bg-gray-50 text-gray-400 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 mr-2 shadow-sm transform group-hover:translate-x-2">
                <ArrowRight size={20} />
            </div>

            {/* Background Accent */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-50/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        </button>
    );
};

export default CategoryCard;
