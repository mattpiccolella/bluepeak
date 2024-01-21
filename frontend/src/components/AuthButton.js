import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function AuthButton() {
    const { isLoggedIn, login, logout, getUserToken} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login')
    }

    const handleLogout = () => {
        logout()
    }

    return (
        <button onClick={isLoggedIn ? handleLogout : handleLogin }>
            {isLoggedIn ? 'Sign Out' : 'Log In'}
        </button>
    );
};

export default AuthButton;