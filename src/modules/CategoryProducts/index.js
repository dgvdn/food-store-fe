import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ProductCard from '../../components/ProductCard'

const CategoryProducts = () => {
    const { name } = useParams()
    const [products, setProducts] = useState([])
    useEffect(() => {
        const fecthProducts = async () => {
            const response = await fetch(`https://fakestoreapi.com/products/category/${name}`)
            const data = await response.json()
            console.log(data)
            setProducts(data)
        }
        fecthProducts()
    }, [])

    if (products.length === 0) return <h1>Loading...</h1>
    return (
        <ProductCard products={products} />
    )
}

export default CategoryProducts