import React from 'react'
import axios from 'axios';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomeCard = () => {
    const [categories, setCategories] = React.useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/product/categories');
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        fetchCategories();
    }, []);

    const Category = ({ categoryName, products }) => {
        // Helper function to format the price in VND
        const formatPriceVND = (price) => {
            // Convert the number to a string and use a regex to format it with periods as thousand separators
            return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
        };

        return (
            <section className="text-gray-600 body-font">
                <div className="container px-5 py-24 mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
                            {categoryName}
                        </h1>
                        <div className="flex mt-6 justify-center">
                            <div className="w-16 h-1 rounded-full bg-indigo-500 inline-flex"></div>
                        </div>
                    </div>
                    <div className="flex flex-wrap -m-4">
                        {products.map((product) => (
                            <Link to={`/products/${product.id}`} className="p-4 md:w-1/3" key={product.id}>
                                <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                                    <img
                                        className="lg:h-48 md:h-36 w-full object-cover object-center"
                                        src={product.image}
                                        alt={product.name}
                                    />
                                    <div className="p-6">
                                        <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                                            {product.category}
                                        </h2>
                                        <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                                            {product.name}
                                        </h1>
                                        <p className="leading-relaxed mb-3">{product.description}</p>
                                        {/* Display formatted price here */}
                                        <div className="text-lg leading-none font-medium text-black mb-1">
                                            {formatPriceVND(product.price)}
                                        </div>
                                        {/* ... */}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        );
    };


    return (
        <div>
            {categories.map(category => (
                <Category key={category.id} categoryName={category.name} products={category.products.map(product => ({
                    ...product,
                    image: product.imageUrl // Ensure to map the imageUrl property to image since that's what the Category component expects
                }))} />
            ))}
        </div>
    );
}

export default HomeCard