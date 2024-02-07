import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()

    const { isLoggedIn, login, logout, getUserToken } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const serverUrl = process.env.REACT_APP_SERVER_URL;
            const response = await axios.post(`${serverUrl}/login`, { 'email': email, password });
            login(response.data.access_token);
            navigate('/user-profile')
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
    <div className="pt-8 flex justify-center flex-1 bg-gray-100">
        <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
                </label>
                <input type="text" value={email} onChange={e => setEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
                </label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                />
            </div>
            <div className="flex items-center justify-between">
                <button type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Login
                </button>
            </div>
            </form>
        </div>
    </div>

    );
}

export default Login;