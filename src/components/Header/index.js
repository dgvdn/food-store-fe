import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const navigations = [
    {
        name: 'Home',
        path: '/',
    },
    {
        name: 'Products',
        path: '/products',
    },
    {
        name: 'About',
        path: '/about',
    },
    {
        name: 'Contact',
        path: '/contact',
    },
];

const Header = () => {
    const [userData, setUserData] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);


    useEffect(() => {
        // Check if there is an 'accessToken' in local storage
        const accessToken = localStorage.getItem('accessToken');
        console.log(accessToken);

        if (accessToken) {
            // If 'accessToken' exists, make a network request to fetch user details
            fetch('http://localhost:8080/user-details/info', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    // Set the user data in the state
                    setUserData(data);
                    console.log(data);
                })
                .catch((error) => {
                    console.error('Failed to fetch user details:', error);
                });

        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            console.log('Document was clicked');
            console.log(dropdownRef.current);
            console.log(event.target);

            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                console.log('Click was outside dropdownRef');
                setDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);



    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const logout = () => {
        // Remove the 'accessToken' from local storage
        localStorage.removeItem('accessToken');
        // Go to home page
        window.location.href = '/';
    };

    return (
        <header className="text-gray-600 body-font shadow-lg">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <Link to={'/'} className="flex cursor-pointer title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                    <span className="ml-3 text-xl">Ecommerce</span>
                </Link>
                <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
                    {navigations.map((navigation) => {
                        return (
                            <Link to={navigation.path} className="mr-5 hover:text-gray-900">
                                {navigation.name}
                            </Link>
                        );
                    })}
                </nav>
                <Link
                    to="/cart"
                    className="inline-flex items-center text-white bg-indigo-500 border-0 py-2 px-4 focus:outline-none hover:bg-indigo-700 rounded text-base mt-4 md:mt-0"
                >
                    Go to Cart
                    <svg
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        className="w-4 h-4 ml-1"
                        viewBox="0 0 24 24"
                    >
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                </Link>
                {userData ? (
                    <div className="relative ml-4 inline-flex items-center">
                        <button
                            onClick={toggleDropdown}
                            className="ml-4 inline-flex items-center text-white bg-indigo-500 border-0 py-2 px-4 focus:outline-none hover:bg-indigo-700 rounded text-base mt-4 md:mt-0"
                            type="button"
                        >
                            {userData.username}
                            <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                            </svg>
                        </button>
                        {dropdownOpen && (
                            <div
                                className="absolute left-0 mt-2 py-2 w-44 bg-white rounded-md shadow-lg z-20"
                                style={{ top: '100%' }}
                            >
                                <ul className="py-1" aria-labelledby="dropdownDefaultButton">
                                    <li>
                                        <Link to={'/profile'} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={logout}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    // If user data doesn't exist, display the "Login" button
                    <Link
                        to="/login" // Specify the login route
                        className="ml-4 inline-flex items-center text-white bg-indigo-500 border-0 py-2 px-4 focus:outline-none hover:bg-indigo-700 rounded text-base mt-4 md:mt-0"
                    >
                        Login
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;
