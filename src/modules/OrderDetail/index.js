import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

const OrderDetail = () => {
    const [order, setOrder] = useState(null);
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8080/api/v1/order/${id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }
                });
                const data = await response.json();
                setOrder(data);
            } catch (error) {
                console.error('Error fetching order:', error);
                setError('Error fetching order. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

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

    return (
        <div className="container mx-auto mt-8">
            {loading && <p className="text-center text-gray-700">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {order && (
                <>
                    <div className="mb-4">
                        <Link
                            to="/orders"
                            className="text-blue-500 hover:underline text-sm flex items-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-4 h-4 mr-1"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                                />
                            </svg>
                            Back to Order History
                        </Link>
                    </div>
                    <h1 className="text-3xl font-semibold mb-4 text-center">Order Detail</h1>
                    <div className="bg-white p-8 rounded-md shadow-md">
                        <p className="text-lg font-semibold mb-4 text-center bg-yellow-200 p-2 rounded-md">
                            Order #{order?.id}
                        </p>
                        <p className="text-gray-600 mb-2">Date: {format(new Date(order?.orderDate), 'dd/MM/yyyy')}</p>
                        <p className={`text-gray-70 p-2 rounded-md ${getStatusColor(order?.status)}`}>Status: {order?.status}</p>

                        {/* Additional Order Details */}
                        <div className="mt-4">
                            <p className="text-gray-600">Payment Method: {order?.paymentMethod}</p>
                            <p className="text-gray-600">Delivery Address: {order?.deliveryAddress}</p>
                            <p className="text-gray-600">Recipient Name: {order?.recipientName}</p>
                            <p className="text-gray-600">Recipient Phone: {order?.recipientPhone}</p>
                        </div>

                        {/* Order Items with Product Images */}
                        <h2 className="text-xl font-semibold mt-6 mb-4 text-center">Ordered Items</h2>
                        <ul className="list-disc pl-5">
                            {order?.orderDetails?.map((detail) => (
                                <li key={detail?.id} className="flex items-center mb-4 bg-blue-100 p-4 rounded-md">
                                    <img
                                        src={detail?.product?.imageUrl}
                                        alt={detail?.product?.name}
                                        className="w-16 h-16 mr-4 object-cover rounded-full"
                                    />
                                    <div>
                                        <p className="text-gray-800">
                                            {detail?.quantity} x {detail?.product?.name}
                                        </p>
                                        <p className="text-gray-600">Total: {formatPriceVND(detail?.totalPrice)}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Total Price */}
                        <p className="text-gray-800 mt-6 text-center bg-purple-200 p-4 rounded-md">
                            Total Price: {formatPriceVND(order?.totalPrice)}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default OrderDetail;
