
import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = "Search for products..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full max-w-md">
      <div className="relative w-full">
        <input
          type="text"
          className="w-full pl-4 pr-10 py-2 border border-gray-300 bg-white bg-opacity-80 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary-hover"
        >
          <Search size={20} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
