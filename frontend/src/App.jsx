import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useState, useEffect } from 'react';

import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard';
import DriverApply from './pages/DriverApply';
import DriverDashboard from './pages/DriverDashboard';
import Contact from './pages/Contact';
import TestPage from './pages/TestPage';
import SimpleLogin from './pages/SimpleLogin';
import FreshLogin from './pages/FreshLogin';
import UltraSimpleTest from './pages/UltraSimpleTest';
import WorkingLogin from './pages/WorkingLogin';
import LoadingScreen from './components/LoadingScreen';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px' }}>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/working" />;
};

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px' }}>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/working" />;
  if (user?.role !== 'admin') return <Navigate to="/" />;
  return children;
};

const DriverRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px' }}>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/working" />;
  if (user?.role !== 'driver' && user?.role !== 'admin') return <Navigate to="/" />;
  return children;
};

const AppContent = () => {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('noory_loaded');
    if (!hasLoaded) {
      setShowLoading(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    sessionStorage.setItem('noory_loaded', 'true');
    setShowLoading(false);
  };

  if (false) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Shop />} />
      <Route path="/login" element={<Login />} />
      <Route path="/working" element={<WorkingLogin />} />
      <Route path="/newlogin" element={<FreshLogin />} />
      <Route path="/register" element={<Register />} />
      <Route path="/driver-apply" element={<DriverApply />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/simple" element={<SimpleLogin />} />
      <Route path="/ultra" element={<UltraSimpleTest />} />
      
      <Route path="/cart" element={
        <ProtectedRoute>
          <Cart />
        </ProtectedRoute>
      } />
      
      <Route path="/admin" element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      } />
      
      <Route path="/driver-dashboard" element={
        <DriverRoute>
          <DriverDashboard />
        </DriverRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;