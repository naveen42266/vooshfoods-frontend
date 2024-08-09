import React from 'react';

interface CategoryFilterProps {
    categories: string[];
    onFilter: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, onFilter }) => {
    return (
        <div>
            <select
                onChange={(e) => onFilter(e.target.value)}
                className="w-full p-2 border rounded-md"
            >
                <option value="">All</option>
                {categories.map((category) => (
                    <option key={category} value={category}>
                        {category}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CategoryFilter;
