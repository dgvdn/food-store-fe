import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const SuccessPage = () => {
  useEffect( () => {
    const paymentMethod = localStorage.getItem('paymentMethod');
    if (paymentMethod === 'CreditCard') {
      const formData = JSON.parse(localStorage.getItem('formData'));
      const accessToken = localStorage.getItem('accessToken');

      const orderEndpoint = 'http://localhost:8080/api/v1/order/create';
      const queryParams = `paymentMethod=${paymentMethod}&address=${formData.address}&name=${formData.name}&phone=${formData.phoneNumber}`;

      try {
        const response =  fetch(`${orderEndpoint}?${queryParams}`, {
          method: 'POST', // Change the method if needed
          headers: {
            'Content-Type': 'application/json', // Adjust content type if sending JSON
            'Authorization': `Bearer ${accessToken}`,
          },
          // Include a body if using POST or another method that supports it
          // body: JSON.stringify(yourData),
        });

        if (!response.ok) {
          throw new Error('Failed to place the order.');
        }

        // Handle success (e.g., display a success message, reset the form, etc.)
        console.log('Order placed successfully!');
      } catch (error) {
        // Handle errors (e.g., display an error message)
        console.error('Error placing the order:', error.message);
      }

      localStorage.removeItem('formData');
      localStorage.removeItem('paymentMethod')
    }
  }, []);

  return (
    <div className="container mx-auto mt-8 text-center">
      <h1 className="text-3xl font-semibold mb-4">Order Placed Successfully!</h1>
      <p className="text-gray-600 mb-4">Thank you for your purchase. Your order has been successfully placed.</p>
      <div className="flex justify-center">
        <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
