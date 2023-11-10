import React, { useState, useEffect } from 'react';

const Categories = ({ onFilter, onSearch, onSort }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Added isLoading to the state
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleSearchChange = (e) => {
        const searchValue = e.target.value;
        setSearchTerm(searchValue);

        // Call the search function when the search input changes
        handleSearch(searchValue);
    };

    const handleSearch = (searchValue) => {
        // Construct the search URL with the search query and page
        const searchUrl = `http://localhost:8080/api/v1/product/search?name=${encodeURIComponent(searchValue)}&page=0`;

        setIsLoading(true);

        fetch(searchUrl)
            .then((response) => response.json())
            .then((data) => {
                if (data && data.content) {
                    onSearch( data.content); // Use 'Search Results' as the category name for search results
                } else {
                    console.error('Search data received is not in the expected format:', data);
                }
            })
            .catch((error) => {
                console.error(`Error fetching search results:`, error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };


    const handleSortChange = (e) => {
        const sortValue = e.target.value; // 'price_low_high' or 'price_high_low'
        const sortParam = sortValue === 'price_low_high' ? 'asc' : 'desc';

        // Check if a category has been selected, else default to "all"
        const categoryName = selectedCategory ? encodeURIComponent(selectedCategory.name) : 'all';
        const sortUrl = `http://localhost:8080/api/v1/product/category/${categoryName}/sorted-by-price?sort=${sortParam}`;

        setIsLoading(true);

        fetch(sortUrl)
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    onSort(data); // Update the parent component's state with sorted products
                } else {
                    console.error('Sorted data received is not an array:', data);
                }
            })
            .catch((error) => {
                console.error(`Error fetching sorted products:`, error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };



    useEffect(() => {
        // Fetch categories from the API endpoint.
        fetch('http://localhost:8080/api/v1/category/all-active')
            .then((response) => response.json())
            .then((data) => { setCategories([{ id: 'all', name: 'Tất cả' }, ...data]); })
            .catch((error) => console.error('Error fetching categories:', error));
    }, []); // Empty dependency array means this effect runs once, similar to componentDidMount.

    // In the Products component
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setSelectedCategoryId(category.id);
        fetchSubCategories(category.id);
        const categoryUrl = `http://localhost:8080/api/v1/product/category/${category.name}`;
        onFilter(category.name, categoryUrl);
    };

    const handleSubCategoryClick = (subCategory) => {
        setSelectedCategory(subCategory);
        const subCategoryUrl = `http://localhost:8080/api/v1/product/category/${subCategory.name}`;
        onFilter(subCategory.name, subCategoryUrl);
    };

    const fetchSubCategories = (id) => {
        const subcategoryUrl = `http://localhost:8080/api/v1/subcategory/category?id=${id}`;
        fetch(subcategoryUrl)
            .then((response) => response.json())
            .then((data) => {
                setSubCategories(data); // Set the subcategories in state
            })
            .catch((error) => {
                console.error(`Error fetching subcategories for category ${id}:`, error);
            });
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
                <select className="w-full p-2 border rounded" onChange={handleSortChange}>
                    <option value="">Sort by</option>
                    <option value="price_low_high">Price: Low to High</option>
                    <option value="price_high_low">Price: High to Low</option>
                </select>
            </div>
            <div>
                <h3 className="font-semibold mb-2">Categories</h3>
                <div className="flex flex-col">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            className="text-left"
                            onClick={() => handleCategoryClick(category)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>
            {selectedCategoryId && (
                <div>
                    <h4 className="font-semibold mb-2">Subcategories</h4>
                    <div className="flex flex-col">
                        {subCategories.map((sub) => (
                            <button
                                key={sub.id}
                                className="text-left"
                                onClick={() => handleSubCategoryClick(sub)}
                            >
                                {sub.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </aside>
    );
};

export default Categories;
