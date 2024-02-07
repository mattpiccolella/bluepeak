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
<div className="flex flex-1 justify-center bg-gray-100 pt-8">
  <div className="w-full max-w-md">
    <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Register</h2>
    <form onSubmit={onSubmit} className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email:
        </label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password:
        </label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
        />
      </div>
      <div className="flex justify-center">
        <button type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Register
        </button>
      </div>
    </form>
  </div>
</div>

    );
}

export default Register;