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
        <div class='file-uploader'>
            <form onSubmit={handleSubmit}>
                <input class='file-input' type="file" id="fileInput" onChange={handleFileChange} />
                <button class='upload-btn' type="submit">Upload</button>
            </form>
        </div>
    );
}

export default FileUpload;