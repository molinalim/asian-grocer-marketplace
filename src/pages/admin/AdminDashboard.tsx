
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminSidebar from '@/components/AdminSidebar';

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FCF7]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8CC63F]"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FCF7]">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:block hidden">
            <AdminSidebar />
          </div>
          <div className="lg:hidden block mb-4">
            <details className="bg-white bg-opacity-80 rounded-lg shadow-md">
              <summary className="p-4 font-medium cursor-pointer">
                Admin Navigation
              </summary>
              <div className="p-4 pt-0">
                <AdminSidebar />
              </div>
            </details>
          </div>
          <div className="flex-1 bg-white bg-opacity-80 backdrop-blur-sm rounded-lg shadow-md p-6">
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
