
import React from 'react';

export interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-3">Categories</h3>
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-4 py-2 rounded-full text-sm ${
            selectedCategory === null
              ? 'bg-primary text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          onClick={() => onSelectCategory(null)}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedCategory === category.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
