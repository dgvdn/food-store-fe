import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import Categories from '../../components/Categories';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Added isLoading to the state
    const [selectedCategory, setSelectedCategory] = useState("Tất cả sản phẩm");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/v1/product/page?page=0');
                const data = await response.json();
                setProducts(data.content); // Assuming 'content' contains your products array
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const onSort = (sortedProducts) => {
        setFilteredProducts(sortedProducts); // Or update the state however you see fit
    };
    

    const onFilter = (categoryName, categoryUrl) => {
        setSelectedCategory(categoryName); // Update the category name
        setIsLoading(true);
        fetch(categoryUrl)
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setFilteredProducts(data); // Set filtered products
                } else {
                    // Handle case where data is not as expected
                    console.error('Data received is not an array:', data);
                }
            })
            .catch((error) => {
                console.error(`Error fetching products for category ${categoryName}:`, error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const onSearch = (searchedProducts) => {
        setFilteredProducts(searchedProducts);
    };

    return (
        <div className="flex">
            <Categories onFilter={onFilter} onSort={onSort} onSearch={onSearch}/>
            <div className="flex-grow">
                <h2 className="text-center text-3xl mt-12">
                    {selectedCategory} {/* Use the selectedCategoryName state here */}
                </h2>
                {isLoading ? (
                    <p>Loading...</p>
                ) : filteredProducts.length > 0 ? (
                    <ProductCard products={filteredProducts} />
                ) : (
                    <ProductCard products={products} />
                )}
            </div>
        </div>
    );
};

export default Products;
