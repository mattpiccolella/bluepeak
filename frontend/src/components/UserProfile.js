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
        <div className="bg-white shadow-md rounded-lg overflow-hidden pt-16">
            <div className="p-4 flex">
                {userData ? (
                    <>
                        <ImageSelector imageUrl={userData.user.profile_picture} updateImage={handleImageChange} /> {/* Pass null if no initial image */}
                        <div className="flex flex-col justify-center">
                            <h2 className="text-lg font-semibold">{userData.user.name}</h2>
                            <p className="text-gray-600 text-lg">{userData.user.email}</p>
                            <p className="text-gray-600">{userData.user.bio}</p>
                        </div>
                    </>):
                    (<><p>Loading data...</p></>)
                }
            </div>
        </div>
        </>
    );
}

export default UserProfile;