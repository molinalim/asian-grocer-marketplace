
import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Package, Heart, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const AccountSidebar: React.FC = () => {
  const { logout, isAdmin } = useAuth();

  return (
    <aside className="w-full md:w-64 bg-white bg-opacity-80 rounded-lg shadow-md p-6 h-fit">
      <h2 className="text-lg font-semibold mb-6">Account</h2>
      
      <nav className="space-y-1">
        <NavLink 
          to="/account/profile" 
          className={({ isActive }) => 
            `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive 
                ? 'bg-primary text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <User className="mr-3 h-5 w-5" />
          Profile
        </NavLink>
        
        <NavLink 
          to="/account/orders" 
          className={({ isActive }) => 
            `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive 
                ? 'bg-primary text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Package className="mr-3 h-5 w-5" />
          Order History
        </NavLink>
        
        <NavLink 
          to="/account/wishlist" 
          className={({ isActive }) => 
            `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive 
                ? 'bg-primary text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Heart className="mr-3 h-5 w-5" />
          Wishlist
        </NavLink>
        
        {isAdmin() && (
          <NavLink 
            to="/admin" 
            className={({ isActive }) => 
              `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive 
                  ? 'bg-secondary text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <Package className="mr-3 h-5 w-5" />
            Admin Dashboard
          </NavLink>
        )}
        
        <button 
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default AccountSidebar;
