import React, { useState, useEffect, useContext } from 'react';
import FileUpload from './FileUpload'; // Import your FileUpload component
import { fetchNoAuth, fetchWithAuth } from '../utils/apiUtils';
import { AuthContext } from '../contexts/AuthContext';

function FileManager() {
    const [files, setFiles] = useState([]);
    const { isLoggedIn, login, logout, getUserToken} = useContext(AuthContext);

    const fetchFiles = async () => {
        try {
            const response = await fetchWithAuth('/api/file', getUserToken());
            setFiles(response.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    }

    useEffect(() => {
        fetchFiles();
    }, []);

    return (
        <div>
            <FileUpload onFetchFiles={fetchFiles} />
            <h3>Uploaded Files</h3>
            <ul>
                {files.map(file => (
                    <li key={file.id}>{file.file_name}</li> // Adjust according to your file object structure
                ))}
            </ul>
        </div>
    );
}

export default FileManager;