import { loadStripe } from '@stripe/stripe-js';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const [carts, setCarts] = React.useState([])
    const [paymentMethod, setPaymentMethod] = React.useState('COD')
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState({
        name: '',
        address: '',
        phoneNumber: '',
    });

    React.useEffect(() => {
        const carts = localStorage.getItem('cart')
        setCarts(JSON.parse(carts))
    }
        , [])


    const formatPriceVND = (price) => {
        // Check if price is defined and not null
        if (price != null) {
            // Convert the number to a string and use a regex to format it with periods as thousand separators
            return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
        }
        // Handle the case when price is undefined or null
        return 'Price not available';
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        console.log(`Input changed - ${name}: ${value}`);
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };



    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const accessToken = localStorage.getItem('accessToken');

        const orderEndpoint = 'http://localhost:8080/api/v1/order/create';
        const queryParams = `paymentMethod=${paymentMethod}&address=${formData.address}&name=${formData.name}&phone=${formData.phoneNumber}`;

        try {
            const response = await fetch(`${orderEndpoint}?${queryParams}`, {
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
            navigate('/success');
        } catch (error) {
            // Handle errors (e.g., display an error message)
            console.error('Error placing the order:', error.message);
        }
    };

    const handleCheckout = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        const accessToken = localStorage.getItem('accessToken');

        try {
            const response = await fetch('http://localhost:8080/api/v1/checkout/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            const sessionUrl = await response.text();
            window.location.href = sessionUrl;
        } catch (error) {
            console.log(error);
        }
    }

    const handlePayment = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        localStorage.setItem('formData', JSON.stringify(formData))
        if (paymentMethod === 'CreditCard') {
            await handleCheckout(event);
            localStorage.setItem('paymentMethod', 'CreditCard')
        } else if (paymentMethod === 'COD') {
            await handleFormSubmit(event);
            localStorage.setItem('paymentMethod', 'COD')
        }
    };

    return (
        <div>
            <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
                <div className="px-4 pt-8">
                    <p className="text-xl font-medium">Order Summary</p>
                    <p className="text-gray-400">Check your items. And select a suitable shipping method.</p>
                    <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
                        {
                            carts?.cartItems?.map(cart => {
                                return (
                                    <div className="flex flex-col rounded-lg bg-white sm:flex-row">
                                        <img className="m-2 h-24 w-28 rounded-md border object-cover object-center" src={cart?.product?.imageUrl} alt={cart?.name} />
                                        <div className="flex w-full flex-col px-4 py-4">
                                            <span className="font-semibold">{cart?.product?.name}</span>
                                            <span className="float-right text-gray-400">SL: {cart?.quantity}</span>
                                            <p className="text-lg font-bold">{formatPriceVND(cart?.totalPrice)}</p>
                                        </div>
                                    </div>
                                )
                            })

                        }

                    </div>
                </div>
                <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
                    <form onSubmit={handlePayment}>
                        <p className="text-xl font-medium">Payment Details</p>
                        <p className="text-gray-400">Complete your order by providing your detail informations.</p>
                        <div className="">
                            <label for="name" className="mt-4 mb-2 block text-sm font-medium">Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange} className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder='Enter your name' />
                                <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 8L6 20H18L20 8M4 8L5.71624 9.37299C6.83218 10.2657 7.39014 10.7121 7.95256 10.7814C8.4453 10.8421 8.94299 10.7173 9.34885 10.4314C9.81211 10.1051 10.0936 9.4483 10.6565 8.13476L12 5M4 8C4.55228 8 5 7.55228 5 7C5 6.44772 4.55228 6 4 6C3.44772 6 3 6.44772 3 7C3 7.55228 3.44772 8 4 8ZM20 8L18.2838 9.373C17.1678 10.2657 16.6099 10.7121 16.0474 10.7814C15.5547 10.8421 15.057 10.7173 14.6511 10.4314C14.1879 10.1051 13.9064 9.4483 13.3435 8.13476L12 5M20 8C20.5523 8 21 7.55228 21 7C21 6.44772 20.5523 6 20 6C19.4477 6 19 6.44772 19 7C19 7.55228 19.4477 8 20 8ZM12 5C12.5523 5 13 4.55228 13 4C13 3.44772 12.5523 3 12 3C11.4477 3 11 3.44772 11 4C11 4.55228 11.4477 5 12 5ZM12 4H12.01M20 7H20.01M4 7H4.01" />
                                    </svg>
                                </div>
                            </div>
                            <label for="address" className="mt-4 mb-2 block text-sm font-medium">Address</label>
                            <div className="relative">
                                <input type="text" id="address" name="address"
                                    value={formData.address}
                                    onChange={handleInputChange} className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm  shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder="Enter your address" />
                                <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                                    </svg>
                                </div>
                            </div>
                            <label for="phoneNumber" className="mt-4 mb-2 block text-sm font-medium">Phone Number</label>
                            <div className="relative">

                                <input type="text" id="phoneNumber" name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange} className="w-full rounded-md border border-gray-200 px-2 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder="Enter your phone number" />
                                <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 3V4.4C10 4.96005 10 5.24008 10.109 5.45399C10.2049 5.64215 10.3578 5.79513 10.546 5.89101C10.7599 6 11.0399 6 11.6 6H12.4C12.9601 6 13.2401 6 13.454 5.89101C13.6422 5.79513 13.7951 5.64215 13.891 5.45399C14 5.24008 14 4.96005 14 4.4V3M9.2 21H14.8C15.9201 21 16.4802 21 16.908 20.782C17.2843 20.5903 17.5903 20.2843 17.782 19.908C18 19.4802 18 18.9201 18 17.8V6.2C18 5.0799 18 4.51984 17.782 4.09202C17.5903 3.71569 17.2843 3.40973 16.908 3.21799C16.4802 3 15.9201 3 14.8 3H9.2C8.0799 3 7.51984 3 7.09202 3.21799C6.71569 3.40973 6.40973 3.71569 6.21799 4.09202C6 4.51984 6 5.07989 6 6.2V17.8C6 18.9201 6 19.4802 6.21799 19.908C6.40973 20.2843 6.71569 20.5903 7.09202 20.782C7.51984 21 8.07989 21 9.2 21Z" />
                                    </svg>
                                </div>

                            </div>
                            {/* Radio buttons for payment method */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium">
                                    Payment Method
                                </label>
                                <div className="mt-2">
                                    <div className="flex items-center">
                                        <input
                                            id="payment-cod"
                                            type="radio"
                                            value="COD"
                                            checked={paymentMethod === 'COD'}
                                            onChange={() => setPaymentMethod('COD')}
                                            className="form-radio h-4 w-4 text-gray-700 focus:ring-gray-500"
                                        />
                                        <label htmlFor="payment-cod" className="ml-2 text-sm text-gray-700">
                                            Cash on Delivery (COD)
                                        </label>
                                    </div>
                                    <div className="flex items-center mt-2">
                                        <input
                                            id="payment-credit-card"
                                            type="radio"
                                            value="CreditCard"
                                            checked={paymentMethod === 'CreditCard'}
                                            onChange={() => setPaymentMethod('CreditCard')}
                                            className="form-radio h-4 w-4 text-gray-700 focus:ring-gray-500"
                                        />
                                        <label htmlFor="payment-credit-card" className="ml-2 text-sm text-gray-700">
                                            Credit Card
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 border-t border-b py-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-900">Subtotal</p>
                                    <p className="font-semibold text-gray-900">{formatPriceVND(carts?.totalPrice)}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-900">Shipping</p>
                                    <p className="font-semibold text-gray-900">{formatPriceVND(25000)}</p>
                                </div>
                            </div>
                            <div className="mt-6 flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">Total</p>
                                <p className="text-2xl font-semibold text-gray-900">{formatPriceVND(carts?.totalPrice + 25000)}</p>
                            </div>
                        </div>
                        <button className="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white">Place Order</button>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default Checkout