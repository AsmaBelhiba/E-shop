import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import categoryService from '../services/categoryService';
import CategoryCard from '../components/CategoryCard';
import { toast } from 'react-hot-toast';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAllCategories();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories", error);
                toast.error("Failed to load categories");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryClick = (category) => {
        // Typically you'd pass state or search match to the store
        navigate('/products', { state: { selectedCategory: category.name } });
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
                        <span className="text-blue-500 font-black uppercase tracking-[.4em] text-[10px] bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20 backdrop-blur-md">Collections</span>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none italic">
                            Discover <span className="text-blue-500 underline decoration-white/20 underline-offset-[12px] decoration-8">Categories</span>
                        </h1>
                        <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-lg">
                            Browse through our curated collections to find exactly what you're looking for.
                        </p>
                    </div>
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map(category => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            onClick={handleCategoryClick}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Categories;
