import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { fetchNoAuth, fetchWithAuth } from '../utils/apiUtils';

function UserProfile() {
    // Logic to fetch and display user profile data goes here
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const { isLoggedIn, login, logout, getUserToken} = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            if (!isLoggedIn) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetchWithAuth(`/api/users/profile`, getUserToken());
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching data', error); // invalid or expired token
                navigate('/login');
            }
        };

        fetchData();
    }, [navigate]);
    return (
        <div className="pt-16">
            <h2>User Profile</h2>
            {userData ? (
                <div>
                    <pre>{JSON.stringify(userData, null, 2)}</pre> {/* Example rendering */}
                </div>
            ) : (
                <p>Loading data...</p> // Display a loading message or spinner
            )}
            {/* Display user profile information */}
        </div>
    );
}

export default UserProfile;