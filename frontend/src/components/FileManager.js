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

    const deleteFile = async (fileId) => {
        try {
            const response = await fetchWithAuth(`/api/file/${fileId}`, getUserToken(), { method: 'DELETE' });
            fetchFiles();
        } catch (error) {
            console.error("Error deleting file: ", error);
        }
    }

    useEffect(() => {
        fetchFiles();
    }, []);

    return (
        <div >
            <FileUpload onFetchFiles={fetchFiles} />
            <ul class='file-list'>
                {files.map(file => (
                    <li key={file.id}>
                        <p class='file-name'>{file.file_name}</p>
                        <button class='delete-btn' onClick={() => deleteFile(file.id)}>Delete</button>
                    </li> // Adjust according to your file object structure
                ))}
            </ul>
        </div>
    );
}

export default FileManager;