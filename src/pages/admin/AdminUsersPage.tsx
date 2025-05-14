
import React, { useState } from 'react';
import { User, Search, Edit, Trash } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { useToast } from "@/hooks/use-toast";

// Mock user data
const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@asiangrocer.com",
    role: "admin",
    createdAt: "2023-01-01T00:00:00.000Z"
  },
  {
    id: "2",
    name: "John Customer",
    email: "customer@example.com",
    role: "customer",
    createdAt: "2023-01-15T00:00:00.000Z"
  },
  {
    id: "3",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "customer",
    createdAt: "2023-02-10T00:00:00.000Z"
  },
  {
    id: "4",
    name: "Michael Brown",
    email: "michael@example.com",
    role: "customer",
    createdAt: "2023-03-05T00:00:00.000Z"
  },
  {
    id: "5",
    name: "Emily Davis",
    email: "emily@example.com",
    role: "customer",
    createdAt: "2023-04-20T00:00:00.000Z"
  }
];

const AdminUsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState(mockUsers);
  const { toast } = useToast();
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleRoleChange = (userId: string, role: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role } : user
    ));
    
    toast({
      title: "User role updated",
      description: `User role has been changed to ${role}.`,
    });
  };
  
  const handleDeleteUser = (userId: string) => {
    if (userId === "1") {
      toast({
        title: "Cannot delete admin",
        description: "You cannot delete the main admin user.",
        variant: "destructive"
      });
      return;
    }
    
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted.",
      });
    }
  };
  
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} placeholder="Search users..." />
      </div>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className={`text-sm rounded px-2 py-1 ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}
                      disabled={user.id === "1"} // Disable for main admin
                    >
                      <option value="admin">Admin</option>
                      <option value="customer">Customer</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className={`text-red-600 hover:text-red-900 ${
                        user.id === "1" ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={user.id === "1"} // Disable for main admin
                    >
                      <Trash className="h-5 w-5" />
                      <span className="sr-only">Delete</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
