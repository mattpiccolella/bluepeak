import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthButton from './AuthButton'
import { AuthContext } from '../contexts/AuthContext';

function Nav() {
    const { isLoggedIn, login, logout, getUserToken} = useContext(AuthContext);
    return (
    <nav className="bg-gray-800 text-white fixed top-0 left-0 w-full z-10">
        <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between">
                <div className="flex space-x-4">
                    <div>
                        <a href="/" className="flex items-center py-5 px-2 text-white-700 hover:text-white-400">
                            <span className="font-bold">Polywise</span>
                        </a>
                    </div>
                    { isLoggedIn ? (
                        <div className="hidden md:flex items-center space-x-1">
                            <Link to="/chat"><a className="py-5 px-3 hover:underline">New Chat</a></Link>
                            <Link to="/documents"><a className="py-5 px-3 hover:underline">Documents</a></Link>
                            <Link to="/user-profile"><a className="py-5 px-3 hover:underline">User Profile</a></Link>
                        </div>
                    ) : (<></>)
                    }
                </div>
                <div className="hidden md:flex items-center space-x-1">
                    <AuthButton />
                    { isLoggedIn?
                    <></> : (<Link to="/register"><a className="py-5 px-3 hover:underline">Register</a></Link>)
                    }
                </div>
            </div>
        </div>
    </nav>
    );
}

export default Nav;
