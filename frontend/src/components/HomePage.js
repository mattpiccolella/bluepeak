import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import ChatHistory from '../components/ChatHistory';
import LandingPage from '../components/LandingPage';

function HomePage() {
    const { isLoggedIn, login, logout, getUserToken} = useContext(AuthContext);

    return (
        isLoggedIn ? (
            <ChatHistory />
        ) : (
            <LandingPage />
        )
    );
}

export default HomePage;