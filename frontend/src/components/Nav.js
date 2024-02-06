import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthButton from './AuthButton'
import { AuthContext } from '../contexts/AuthContext';

function Nav() {
    const { isLoggedIn, login, logout, getUserToken} = useContext(AuthContext);
    return (
    <nav class="bg-gray-800 p-2 mt-0 w-full">
    { isLoggedIn ? (
        <div class='container flex flex-wrap items-center'>
            <div class="flex w-full md:w-1/2 justify-center md:justify-start text-white font-extrabold">
                <a class="text-white no-underline hover:text-white hover:no-underline" href="/">
                    <span class="text-2xl pl-2"><i class="em em-grinning"></i>Polywise</span>
                </a>
            </div>
            <div class="flex w-full pt-2 content-center justify-between md:w-1/2 md:justify-end">
                <Link class="mr-3" to="/"><button class="inline-block py-2 px-4 text-white no-underline">Home</button></Link>
                <Link class="mr-3" to="/chat"><button class="inline-block text-gray-400 no-underline hover:text-gray-200 hover:text-underline py-2 px-4">New Chat</button></Link>
                <Link class="mr-3" to="/documents"><button class="inline-block text-gray-400 no-underline hover:text-gray-200 hover:text-underline py-2 px-4">Documents</button></Link>
                <Link class="mr-3" to="/user-profile"><button class="inline-block text-gray-400 no-underline hover:text-gray-200 hover:text-underline py-2 px-4">User Profile</button></Link>
                <AuthButton class="mr-3 text-white"/>
            </div>
        </div>
    ) : (
        <div>
            <Link to="/"><button>Home</button></Link>
            <AuthButton />
            <Link to="/register"><button>Register</button></Link>
        </div>
    )
    }
    </nav>
    );
}

export default Nav;
