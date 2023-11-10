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
      <HomeCard />
    </>
  )
}

export default Home