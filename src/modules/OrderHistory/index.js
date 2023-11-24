// OrderHistory.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all'); // Default tab is 'all'

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/v1/order/user', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }
                });
                const data = await response.json();
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Error fetching orders. Please try again.');
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const formatPriceVND = (price) => {
        if (price != null) {
            return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
        }
        return 'Price not available';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Đang xử lý':
                return 'bg-yellow-300'; // Muted yellow
            case 'Đang vận chuyển':
                return 'bg-blue-300';   // Muted blue
            case 'Hoàn thành':
                return 'bg-green-300';  // Muted green
            default:
                return 'bg-gray-300';   // Muted gray
        }
    };
    
    

    const filterOrdersByStatus = (status) => {
        return status === 'all' ? orders : orders.filter(order => order.status === status);
    };

    const renderOrders = (status) => {
        const filteredOrders = filterOrdersByStatus(status);

        return (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredOrders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    filteredOrders.map((order) => (
                        <div
                            key={order?.id}
                            className={` p-4 rounded-md shadow-md transition duration-300 transform hover:scale-105 ${getStatusColor(order?.status)}`}

                        >
                            <p className="text-lg font-semibold mb-2">Order #{order?.id}</p>
                            <p className="text-gray-600 mb-2">Date: {format(new Date(order?.orderDate), 'dd/MM/yyyy')}</p>
                            <p className="text-white mb-2">Status: {order?.status}</p>
                            <ul className="list-disc pl-5 mb-4">
                                {order?.orderDetails?.map((detail) => (
                                    <li key={detail?.id}>{detail?.product?.name}</li>
                                ))}
                            </ul>
                            <div className="flex justify-between items-center">
                                <p className="text-gray-700">
                                    Total: {formatPriceVND(order?.totalPrice)}
                                </p>
                                <Link
                                    to={`/order/${order?.id}`}
                                    className="text-blue-500 hover:underline bg-blue-100 px-2 py-1 rounded-md"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        );
    };

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-3xl font-semibold mb-4">Order History</h1>
            {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!loading && !error && (
                <>
                    <div className="flex space-x-4 mb-4">
                        <button
                            className={`py-2 px-4 rounded-md ${activeTab === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => setActiveTab('all')}
                        >
                            All Orders
                        </button>
                        <button
                            className={`py-2 px-4 rounded-md ${activeTab === 'Đang xử lý' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => setActiveTab('Đang xử lý')}
                        >
                            Đang xử lý
                        </button>
                        <button
                            className={`py-2 px-4 rounded-md ${activeTab === 'Đang vận chuyển' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => setActiveTab('Đang vận chuyển')}
                        >
                            Đang vận chuyển
                        </button>
                        <button
                            className={`py-2 px-4 rounded-md ${activeTab === 'Hoàn thành' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => setActiveTab('Hoàn thành')}
                        >
                            Hoàn thành
                        </button>
                    </div>
                    {renderOrders(activeTab)}
                </>
            )}
        </div>
    );
};

export default OrderHistory;
