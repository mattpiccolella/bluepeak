import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [formData, setFormData] = useState({email: '',password: ''});
    const navigate = useNavigate()

    const { username, email, password } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const serverUrl = process.env.REACT_APP_SERVER_URL;
            const response = await axios.post(`${serverUrl}/register`, { email, password} );
            console.log('Registration successful', response.data);
            navigate('/login')
            // Handle registration success (e.g., redirect to login)
        } catch (error) {
            console.error('Registration failed', error);
            // Handle registration failure (e.g., show error message)
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={email} 
                        onChange={onChange} 
                        required 
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={password} 
                        onChange={onChange} 
                        required 
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;