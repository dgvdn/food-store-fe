import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import Categories from '../../components/Categories';

const Products = () => {
    const [products, setProducts] = useState([]); // Initializes the products state as an empty array

    useEffect(() => {
        // Simulating a fetch call using the provided JSON data
        const fetchData = async () => {
            // Replace 'https://your-api-endpoint.com/products' with your actual API endpoint
            const response = await fetch('http://localhost:8080/api/v1/product/page?page=0');
            const data = await response.json();
            setProducts(data.content); // Assuming 'content' contains your products array
        };

        fetchData();
    }, []); // The empty array as the second argument ensures this effect only runs once on mount

    return (
        <div className="flex">
            <Categories /> {/* Sidebar for categories */}
            <div className="flex-grow">
                <h2 className="text-center text-3xl mt-12">Products</h2>
                {
                    products.length > 0 ? 
                    <ProductCard products={products} /> // Pass the fetched products to the ProductCard component
                    : <p>Loading...</p> // Display a loading state while fetching data
                }
            </div>
        </div>
    );
}

export default Products;
