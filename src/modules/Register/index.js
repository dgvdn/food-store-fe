import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '' })
    const [errorMessages, setErrorMessages] = useState(null)

    const handelFormSubmit = (e) => {
        e.preventDefault();
        setErrorMessages(null); // Reset error messages
    
        // Define the registration endpoint on your server (replace with the actual endpoint)
        const registrationEndpoint = "http://localhost:8080/auth/register";
    
        axios
            .post(registrationEndpoint, formData)
            .then((res) => {
                // Registration was successful
                console.log("Registration successful:", res.data);
                // You can handle success, such as displaying a success message or redirecting the user.
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    // Client received an error response (5xx, 4xx)
                    setErrorMessages("Invalid username or password");
                } else if (err.request) {
                    // Client never received a response, or the request never left
                } else {
                    setErrorMessages("An error occurred. Please try again later.");
                }
                console.log("Registration failed:", err);
            });
    };
    

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
            window.location.href = '/'
        }
    }, [])

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                {errorMessages && <div className="text-red-500 text-center">{errorMessages}</div>}
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-10 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Register your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" action="#" method="POST" onSubmit={handelFormSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Username
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    autoComplete="email"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign up
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Already have account?{' '}
                        <a href="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </>
    )
}

export default Register