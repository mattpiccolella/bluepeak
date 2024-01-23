import React, { useState } from 'react';
import axios from 'axios';
import { fetchNoAuth, fetchWithAuth } from '../utils/apiUtils';

function FileUpload() {
    const [file, setFile] = useState(null);

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
            const response = await fetchNoAuth('/api/file/upload', {method: 'POST', data: formData});
            console.log('File uploaded successfully', response.data)
            file = null;
        } catch(error) {
            console.error('Error uploading file', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} />
            <button type="submit">Upload</button>
        </form>
    );
}

export default FileUpload;