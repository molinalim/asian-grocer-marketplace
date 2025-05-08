
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/hooks/use-toast";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would update the user's profile
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
    setIsEditing(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account ID
          </label>
          <input
            type="text"
            value={user?.id}
            disabled
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditing}
            className={`w-full px-4 py-2 border border-gray-300 rounded-md ${
              !isEditing ? 'bg-gray-100' : 'bg-white focus:outline-none focus:ring-2 focus:ring-primary'
            }`}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!isEditing}
            className={`w-full px-4 py-2 border border-gray-300 rounded-md ${
              !isEditing ? 'bg-gray-100' : 'bg-white focus:outline-none focus:ring-2 focus:ring-primary'
            }`}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Type
          </label>
          <input
            type="text"
            value={user?.role || 'customer'}
            disabled
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md capitalize"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Member Since
          </label>
          <input
            type="text"
            value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
            disabled
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="pt-4 flex justify-end">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="mr-4 px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
