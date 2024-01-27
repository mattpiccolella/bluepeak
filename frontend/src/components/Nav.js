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
            <Link to="/"><button>Home</button></Link>
            <Link to="/chat"><button>New Chat</button></Link>
            <Link to="/documents"><button>Documents</button></Link>
            <Link to="/user-profile"><button>User Profile</button></Link>
            <AuthButton />
        </>
    ) : (
        <>
            <Link to="/"><button>Home</button></Link>
            <AuthButton />
            <Link to="/register"><button>Register</button></Link>
        </>
    )
    }
    </nav>
    );
}

export default Nav;
