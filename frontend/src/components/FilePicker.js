import React, { useState } from 'react';

const FileList = ({ files, selectedFiles, onFileSelect }) => {
    return (
        <div>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">Select files</h2>
            {files.map(file => (
                <div key={file.id} className='mb-1'>
                    <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => onFileSelect(file)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700 ml-2">{file.file_name}</span>
                </div>
            ))}
        </div>
    );
};

export { FileList };
