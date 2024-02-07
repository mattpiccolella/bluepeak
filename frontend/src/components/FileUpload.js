import React, { useState, useContext } from 'react';
import axios from 'axios';
import { fetchNoAuth, fetchWithAuth } from '../utils/apiUtils';
import { AuthContext } from '../contexts/AuthContext';

function FileUpload({ onFetchFiles }) {
    const [file, setFile] = useState(null);
    const { isLoggedIn, login, logout, getUserToken} = useContext(AuthContext);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Logic to send file to server

        if (!file) {
            console.log('No file selected');
            return;
        }

        const formData= new FormData();
        formData.append('file', file);

        try {
            const response = await fetchWithAuth('/api/file/upload', getUserToken(), {method: 'POST', data: formData});
            console.log('File uploaded successfully', response.data)
            setFile(null);
            const fileInput = document.getElementById('fileInput');
            if (fileInput) {
                fileInput.value = '';
            }
            onFetchFiles();
        } catch(error) {
            console.error('Error uploading file', error);
        }

        setFile(null)
    };

    return (
        <div class='flex justify-center items-center my-7'>
            <form onSubmit={handleSubmit} className='flex items-center'>
                <input 
                    type="file"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                    id="fileInput"
                    onChange={handleFileChange} />
                <button class='bg-blue-400 hover:bg-blue-600 text-white text-sm py-1 px-2 rounded' type="submit">Upload</button>
            </form>
        </div>
    );
}

export default FileUpload;