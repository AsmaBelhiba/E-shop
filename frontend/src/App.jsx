import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';

// Layouts & Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

// Pages
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Store from './pages/Store';
import ProductPage from './pages/ProductPage';
import Categories from './pages/Categories';
import CartPage from './pages/CartPage';
import UserOrders from './pages/UserOrders';
import CustomerDashboard from './pages/CustomerDashboard';
// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSuppliers from './pages/admin/AdminSuppliers';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();

  if (loading) return null;

  const currentRole = role || localStorage.getItem('userRole') || 'ROLE_USER';

  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    return <Navigate to={currentRole === 'ROLE_ADMIN' ? "/admin/dashboard" : "/customer/dashboard"} />;
  }

  return children;
};

const AdminLayout = ({ children }) => {
  return (
    <div className="flex bg-gray-50/30 min-h-screen pt-24">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

const MainLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">
      {children}
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Customer Routes (General) */}
              <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
              <Route path="/products" element={<MainLayout><Store /></MainLayout>} />
              <Route path="/product/:id" element={<MainLayout><ProductPage /></MainLayout>} />
              <Route path="/categories" element={<MainLayout><Categories /></MainLayout>} />

              {/* Protected Customer Routes */}
              <Route path="/customer/dashboard" element={
                <ProtectedRoute allowedRoles={['ROLE_USER']}>
                  <MainLayout><CustomerDashboard /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/cart" element={
                <ProtectedRoute allowedRoles={['ROLE_USER']}>
                  <MainLayout><CartPage /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/purchases" element={
                <ProtectedRoute allowedRoles={['ROLE_USER']}>
                  <MainLayout><UserOrders /></MainLayout>
                </ProtectedRoute>
              } />

              {/* Protected Admin Routes */}
              <Route path="/admin/*" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <AdminLayout>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="categories" element={<AdminCategories />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="suppliers" element={<AdminSuppliers />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              } />

              {/* Generic Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <Toaster position="bottom-right" reverseOrder={false} />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
