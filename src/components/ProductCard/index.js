import React from 'react'
import { Link } from 'react-router-dom';

const ProductCard = ({ products = []}) => {
    const formatPriceVND = (price) => {
        // Convert the number to a string and use a regex to format it with periods as thousand separators
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
    };
    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-wrap -m-4">
                    {
                        products.map((product) => {
                            console.log(product, 'product');
                            const { id, name, price, description, category, img } = product;
                            return (
                                <Link to={`/products/${id}`} className="lg:w-1/4 md:w-1/2 p-4 w-full border border-opacity-50 cursor-pointer">
                                    <a className="block relative h-48 rounded overflow-hidden">
                                        <img alt={name} className="object-contain object-center w-full h-full block" src={img} />
                                    </a>
                                    <div className="mt-4">
                                        <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1 uppercase">{category.name}</h3>
                                        <h2 className="text-gray-900 title-font text-lg font-medium">
                                            {name}
                                        </h2>
                                        <p className="mt-1 text-md font-semibold">{formatPriceVND(price)}</p>
                                    </div>
                                </Link>)

                        })
                    }
                </div>
            </div>
        </section>
    )
}

export default ProductCard