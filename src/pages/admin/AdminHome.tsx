
import React from 'react';
import { ShoppingCart, Users, Database, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock statistics data
const stats = [
  { name: 'Total Orders', value: '124', icon: ShoppingCart, change: '+12%', color: 'bg-blue-500' },
  { name: 'Total Users', value: '45', icon: Users, change: '+8%', color: 'bg-green-500' },
  { name: 'Products', value: '52', icon: Database, change: '+2', color: 'bg-yellow-500' },
  { name: 'Revenue', value: '$12,430', icon: TrendingUp, change: '+18%', color: 'bg-purple-500' },
];

// Mock recent orders
const recentOrders = [
  { id: 'ORD123459', customer: 'John Doe', date: '2023-05-08', total: 89.95, status: 'Delivered' },
  { id: 'ORD123458', customer: 'Jane Smith', date: '2023-05-07', total: 145.50, status: 'Processing' },
  { id: 'ORD123457', customer: 'Robert Johnson', date: '2023-05-06', total: 62.75, status: 'Shipped' },
];

const AdminHome: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className="ml-2 text-sm font-medium text-green-600">{stat.change}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
          <Link 
            to="/admin/orders" 
            className="text-sm font-medium text-primary hover:text-primary-hover"
          >
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'Delivered' 
                        ? 'bg-green-100 text-green-800' 
                        : order.status === 'Processing' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link 
            to="/admin/products/add" 
            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover"
          >
            Add New Product
          </Link>
          <Link 
            to="/admin/orders" 
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Manage Orders
          </Link>
          <Link 
            to="/admin/users" 
            className="inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
