
import React, { useState } from 'react';
import { Search, Eye, ChevronDown } from 'lucide-react';
import SearchBar from '@/components/SearchBar';

// Mock order data
const mockOrders = [
  {
    id: "ORD123459",
    customer: "John Doe",
    email: "john@example.com",
    date: "2023-05-08",
    status: "Delivered",
    total: 89.95,
    items: [
      { id: "1", name: "Premium Jasmine Rice", price: 14.99, quantity: 2 },
      { id: "7", name: "Sriracha Hot Sauce", price: 4.99, quantity: 1 },
    ]
  },
  {
    id: "ORD123458",
    customer: "Jane Smith",
    email: "jane@example.com",
    date: "2023-05-07",
    status: "Processing",
    total: 145.50,
    items: [
      { id: "2", name: "Instant Ramen Variety Pack", price: 12.99, quantity: 3 },
      { id: "6", name: "Frozen Dumplings", price: 15.99, quantity: 1 },
      { id: "9", name: "Pocky Chocolate Sticks", price: 3.49, quantity: 5 },
    ]
  },
  {
    id: "ORD123457",
    customer: "Robert Johnson",
    email: "robert@example.com",
    date: "2023-05-06",
    status: "Shipped",
    total: 62.75,
    items: [
      { id: "4", name: "Green Tea", price: 8.99, quantity: 2 },
      { id: "8", name: "Miso Paste", price: 7.99, quantity: 3 },
    ]
  },
  {
    id: "ORD123456",
    customer: "Emily Brown",
    email: "emily@example.com",
    date: "2023-05-05",
    status: "Delivered",
    total: 79.95,
    items: [
      { id: "3", name: "Premium Soy Sauce", price: 6.99, quantity: 2 },
      { id: "10", name: "Coconut Milk", price: 2.99, quantity: 4 },
      { id: "12", name: "Bubble Tea Kit", price: 18.99, quantity: 1 },
    ]
  },
  {
    id: "ORD123455",
    customer: "Michael Wilson",
    email: "michael@example.com",
    date: "2023-05-04",
    status: "Delivered",
    total: 54.50,
    items: [
      { id: "5", name: "Korean Kimchi", price: 9.99, quantity: 2 },
      { id: "11", name: "Bok Choy", price: 2.49, quantity: 3 },
    ]
  },
];

// Status options
const statusOptions = ["All", "Processing", "Shipped", "Delivered"];

const AdminOrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };
  
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="sm:w-2/3">
          <SearchBar onSearch={handleSearch} placeholder="Search orders..." />
        </div>
        <div className="sm:w-1/3">
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
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
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.customer}</div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select 
                        defaultValue={order.status}
                        className={`text-sm rounded px-2 py-1 ${
                          order.status === 'Delivered' 
                            ? 'bg-green-100 text-green-800' 
                            : order.status === 'Processing' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => toggleOrderDetails(order.id)}
                        className="text-primary hover:text-primary-hover flex items-center"
                      >
                        <Eye className="h-5 w-5 mr-1" />
                        <ChevronDown className={`h-4 w-4 transform transition-transform ${
                          expandedOrder === order.id ? 'rotate-180' : ''
                        }`} />
                      </button>
                    </td>
                  </tr>
                  {expandedOrder === order.id && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-gray-50">
                        <div className="text-sm">
                          <h4 className="font-medium mb-2">Order Items</h4>
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {order.items.map((item) => (
                                <tr key={item.id}>
                                  <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                                  <td className="px-4 py-2 text-sm text-gray-900">${item.price.toFixed(2)}</td>
                                  <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                                  <td className="px-4 py-2 text-sm text-gray-900">${(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr>
                                <td colSpan={3} className="px-4 py-2 text-sm font-medium text-right">Total:</td>
                                <td className="px-4 py-2 text-sm font-bold">${order.total.toFixed(2)}</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
