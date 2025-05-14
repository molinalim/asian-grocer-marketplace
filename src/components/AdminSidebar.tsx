
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Package, Users, ShoppingCart, Home } from 'lucide-react';

const AdminSidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white bg-opacity-80 rounded-lg shadow-md p-6 h-fit">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-primary">Admin Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your store</p>
      </div>
      
      <nav className="space-y-1">
        <NavLink 
          to="/admin" 
          end
          className={({ isActive }) => 
            `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive 
                ? 'bg-primary text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Home className="mr-3 h-5 w-5" />
          Dashboard
        </NavLink>
        
        <NavLink 
          to="/admin/products" 
          className={({ isActive }) => 
            `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive 
                ? 'bg-primary text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Package className="mr-3 h-5 w-5" />
          Products
        </NavLink>
        
        <NavLink 
          to="/admin/orders" 
          className={({ isActive }) => 
            `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive 
                ? 'bg-primary text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <ShoppingCart className="mr-3 h-5 w-5" />
          Orders
        </NavLink>
        
        <NavLink 
          to="/admin/users" 
          className={({ isActive }) => 
            `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive 
                ? 'bg-primary text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Users className="mr-3 h-5 w-5" />
          Users
        </NavLink>
        
        <div className="pt-6 mt-6 border-t border-gray-200">
          <NavLink 
            to="/"
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
          >
            <Home className="mr-3 h-5 w-5" />
            Return to Store
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
