import React, { useEffect, useState } from 'react'
import Hero from '../../components/Hero'
import Products from '../../components/ProductCard'
import StatCard from '../../components/StatCard'
import Categories from '../../components/Categories'
import HomeCard from '../../components/HomeCard'

const Home = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fecthProducts = async () => {
      const response = await fetch('https://fakestoreapi.com/products?limit=12')
      const data = await response.json()
      console.log(data)
      setProducts(data) 
    }
    fecthProducts()
  }, [])

  return (
    <>
      <Hero />
      <Categories />
      <h2 className="text-center text-3xl mt-12">Products</h2>
      <div className="flex flex-wrap justify-center">
       {
        products.length > 0 ? 
        <Products products={products} />
        : <p>Loading...</p>
       }
      </div>
      <Products />
      <StatCard />
      <HomeCard />
    </>
  )
}

export default Home