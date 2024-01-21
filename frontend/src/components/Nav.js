import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthButton from './AuthButton'
import { AuthContext } from '../contexts/AuthContext';

function Nav() {
    const { isLoggedIn, login, logout, getUserToken} = useContext(AuthContext);
    return (
    <nav>
    { isLoggedIn ? (
        <>
            <Link to="/">Home</Link>
            <Link to="/chat">Chat</Link>
            <Link to="/chat-history" >Chat History</Link>
            <Link to="/add-todo">Add Todo</Link>
            <Link to="/user-profile">User Profile</Link>
            <AuthButton />
        </>
    ) : (
        <>
            <Link to="/">Home</Link>
            <AuthButton />
            <Link to="/register">Register</Link>
        </>
    )
    }
    </nav>
    );
}

export default Nav;
