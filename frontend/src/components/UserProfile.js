import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
    // Logic to fetch and display user profile data goes here
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const serverUrl = process.env.REACT_APP_SERVER_URL;
                const response = await axios.get(`${serverUrl}/api/users/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('Data fetched successfully', response.data);

                setUserData(response.data)
                // Handle your data
            } catch (error) {
                console.error('Error fetching data', error);
                // If the token is invalid or expired
                navigate('/login');
            }
        };

        fetchData();
    }, [navigate]);
    return (
        <div>
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