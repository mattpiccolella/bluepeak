import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { fetchNoAuth, fetchWithAuth } from '../utils/apiUtils';
import ImageSelector from './ImageSelector';

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

    const handleImageChange = async (image) => {
        try {
            const formData = new FormData();
            formData.append('file', image);
            const response = await fetchWithAuth(`/api/users/profile_picture`, getUserToken(), { method: 'POST', data: formData });
            setUserData(response.data);
        } catch (error) {
            console.error('Error updating profile picture', error);
        }
    }
    return (
        <>
        <div class="container mx-auto mt-10">
            <header>
                <h1 class="text-3xl font-bold text-gray-800">Profile</h1>
            </header>
            { userData ? (
                <>
                    <div class="flex flex-col items-center">
                            <ImageSelector imageUrl={userData.user.profile_picture} updateImage={handleImageChange} />
                            <h2 class="mt-2 text-xl font-semibold text-gray-700">{userData.user.name ? userData.user.name : 'Username'}</h2>
                            <p class="mt-1 text-gray-600">{userData.user.email}</p>
                    </div>
                </>)
                :
                (<p>Loading data...</p>)
            }
        </div>
        </>
    );
}

export default UserProfile;