import React from 'react';
import './App.css';
import Headers from './components/Header';
import Home from './modules/Home';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';
import Product from './modules/Product';
import Products from './modules/Products';
import CategoryProducts from './modules/CategoryProducts';
import Cart from './modules/Cart';
import Login from './modules/Login';
import Register from './modules/Register';
import Checkout from './modules/Checkout';
import SuccessPage from './modules/Success';
import CancelPage from './modules/CancelPage';
import OrderHistory from './modules/OrderHistory';
import OrderDetail from './modules/OrderDetail';


function App() {
  return (
    <div>
      <Headers />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<Product />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories/:name" element={<CategoryProducts />} />
        <Route path='cart' element={<Cart />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='*' element={<h1>Page Not Found</h1>} />
        <Route path='/success' element={<SuccessPage />} />
        <Route path='/cancel' element={<CancelPage />} />
        <Route path='orders' element={<OrderHistory />} />
        <Route path="/order/:id" element={<OrderDetail/>} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
