import React from 'react';
import { Link } from 'react-router-dom';

const CancelPage = () => {
  return (
    <div className="container mx-auto mt-8 text-center">
      <h1 className="text-3xl font-semibold mb-4">Order Canceled</h1>
      <p className="text-gray-600 mb-4">Your order has been canceled. If you have any questions, please contact our support team.</p>
      <div className="flex justify-center">
        <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default CancelPage;
