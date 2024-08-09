import React from 'react';

interface SearchBarProps {
    onSearch: (searchQuery: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    return (
        <div>
            <input
                type="text"
                placeholder="Search todos"
                onChange={(e) => onSearch(e.target.value)}
                className="w-full p-2 border rounded-md"
            />
        </div>
    );
};

export default SearchBar;
