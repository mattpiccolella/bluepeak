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
        <div className='mx-7'>
            <FileUpload onFetchFiles={fetchFiles} />
            <div className="grid grid-cols-4 gap-4">
                {files.map(file => (
                    <div key={file.id} className="border rounded p-4 flex flex-col justify-center items-center">
                        <p className="text-xl font-medium">{file.file_name}</p>
                        <button class='bg-red-400 hover:bg-red-600 text-white mt-4 text-sm py-1 px-2 rounded' onClick={() => deleteFile(file.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FileManager;