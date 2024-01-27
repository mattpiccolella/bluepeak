import React, { useState } from 'react';

const FileList = ({ files, selectedFiles, onFileSelect }) => {
    return (
        <div>
            <h2>Pick files</h2>
            {files.map(file => (
                <div key={file.id}>
                    <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => onFileSelect(file)}
                    />
                    {file.file_name}
                </div>
            ))}
        </div>
    );
};

export { FileList };
