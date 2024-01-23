import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload'; // Import your FileUpload component

function FileManager() {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        console.log('Fetching files...');
        // Fetch the list of files from your server and update state
        // Example: fetch('/api/files').then(res => res.json()).then(data => setFiles(data));
    }, []);

    return (
        <div>
            <FileUpload />
            <h3>Uploaded Files</h3>
            <ul>
                {files.map(file => (
                    <li key={file.id}>{file.name}</li> // Adjust according to your file object structure
                ))}
            </ul>
        </div>
    );
}

export default FileManager;