const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-gray-600">
                <div className="space-y-4">
                    <h3 className="text-2xl font-black italic tracking-tighter text-gray-900 underline decoration-blue-500 decoration-4">E-SHOP</h3>
                    <p className="text-sm leading-relaxed">
                        Experience the best in modern e-commerce. Premium products, seamless checkout, and dedicated support.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 mb-4 uppercase tracking-widest text-xs">Shop</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/products" className="hover:text-blue-600 transition-colors">All Products</a></li>
                        <li><a href="/categories" className="hover:text-blue-600 transition-colors">Categories</a></li>
                        <li><a href="/customer/dashboard" className="hover:text-blue-600 transition-colors">New Arrivals</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 mb-4 uppercase tracking-widest text-xs">Customer Service</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/purchases" className="hover:text-blue-600 transition-colors">My Orders</a></li>
                        <li><a href="/cart" className="hover:text-blue-600 transition-colors">View Cart</a></li>
                        <li><a href="#" className="hover:text-blue-600 transition-colors">Help Center</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 mb-4 uppercase tracking-widest text-xs">Stay Connected</h4>
                    <p className="text-sm mb-4">Join our newsletter for exclusive offers.</p>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            placeholder="Email address"
                            className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full"
                        />
                        <button className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors">
                            Join
                        </button>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto border-t border-gray-50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-400">
                <p>&copy; 2026 E-SHOP. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-gray-900">Privacy Policy</a>
                    <a href="#" className="hover:text-gray-900">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
