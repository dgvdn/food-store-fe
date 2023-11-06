// import React, { useEffect } from 'react'
// import FeatureCard from '../FeatureCard'

// const Categories = () => {
//     const [categories, setCategories] = React.useState([]);
//     useEffect(() => {
//         fetch('https://fakestoreapi.com/products/categories')
//             .then(res => res.json())
//             .then(json => setCategories(json))
//     }, [])
//     if (categories.length === 0)  return <h1>Loading...</h1>
//   return (
//         <FeatureCard cards={categories}/>
//   )
// }

// export default Categories

import React, { useState } from 'react';

const Categories = ({ onFilter, onSearch, onSort }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value);
    };

    const handleSortChange = (e) => {
        onSort(e.target.value);
    };

    return (
        <aside className="border-r p-4 w-1/4">
            <div className="mb-4">
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="w-full p-2 border rounded" 
                    value={searchTerm}
                    onChange={handleSearchChange} 
                />
            </div>
            <div className="mb-4">
                <select 
                    className="w-full p-2 border rounded" 
                    onChange={handleSortChange}>
                    <option value="">Sort by</option>
                    <option value="name">Name</option>
                    <option value="price_low_high">Price: Low to High</option>
                    <option value="price_high_low">Price: High to Low</option>
                </select>
            </div>
            <div>
                <h3 className="font-semibold mb-2">Categories</h3>
                <div className="flex flex-col">
                    {/* This list would be dynamically generated from props or state */}
                    <button className="text-left" onClick={() => onFilter('electronics')}>Electronics</button>
                    <button className="text-left" onClick={() => onFilter('clothing')}>Clothing</button>
                    <button className="text-left" onClick={() => onFilter('accessories')}>Accessories</button>
                    {/* Add more buttons for different categories */}
                </div>
            </div>
        </aside>
    );
};

export default Categories;
