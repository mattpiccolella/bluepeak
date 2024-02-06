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
        <div className="pt-16">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </label>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;