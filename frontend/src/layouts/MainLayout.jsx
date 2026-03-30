import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main>
                <Outlet />
            </main>
            <footer className="bg-gray-50 border-t border-gray-100 py-12 mt-20">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
                    <p className="font-medium">&copy; 2026 E-Shop. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
