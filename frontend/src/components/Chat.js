import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { fetchNoAuth, fetchWithAuth } from '../utils/apiUtils';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FileList } from './FilePicker';
import { sanitizeHtml } from 'sanitize-html-react';

function Chat() {
    // File management
    const [availableFiles, setAvailableFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);

    // Chat management
    const [input, setInput] = useState('');
    const [chatId, setChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const { isLoggedIn, login, logout, getUserToken} = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            setChatId(id);
        } else {
            setChatId(null);
        }
    }, [id]);

    useEffect(() => {
        if (!chatId) {
            setMessages([]);
            setSelectedFiles([]);
        } else {
            fetchChat(chatId);
        }
    }, [chatId]);

    useEffect(() => {
        fetchAvailableFiles();
    }, []);

    const fetchAvailableFiles = async () => {
        try {
            const response = await fetchWithAuth('/api/file', getUserToken());
            setAvailableFiles(response.data);
        } catch (error) {
            console.error('Error fetching data', error); // invalid or expired token
        }
    }

    const updateSelectedFiles = async (file) => {
        var newSelectedFiles = [];
        if (selectedFiles.includes(file.id)) {
            newSelectedFiles = selectedFiles.filter(f => f !== file.id);
        } else {
            newSelectedFiles = [...selectedFiles, file.id];
        }

        // Update backend piece
        // Only do it if the chat is completed
        if (chatId) {
            console.log('Updating the backend with the selected files', newSelectedFiles)
            try {
                const response = await fetchWithAuth(`/api/conversations/${chatId}/documents`, getUserToken(),  {method: 'PUT', data: {document_ids: newSelectedFiles}});
            } catch (error) {
                console.error('Error fetching data', error); // invalid or expired token
            }
        }

        setSelectedFiles(newSelectedFiles);
    }

    const fetchChat = async (chatId) => {
        try {
            const response = await fetchWithAuth(`/api/conversations/${chatId}`, getUserToken());
            setChatId(response.data.conversation_id);
            setMessages(response.data.messages);
            setSelectedFiles(response.data.documents.map(file => file.id))
        } catch (error) {
            console.error('Error fetching data', error); // invalid or expired token
        }
    }

    const sendPrompt = async () => {
        setMessages([...messages, { content: input, role: 'user' }]);
        setInput('');

        try {
            if (!chatId) {
                const response = await fetchWithAuth(`/api/conversations`, getUserToken(),  {method: 'POST', data: {prompt: input, document_ids: selectedFiles}});
                navigate(`/chat/${response.data.conversation_id}`)
            } else {
                const response = await fetchWithAuth(`/api/conversations/${chatId}`, getUserToken(),  {method: 'POST', data: {prompt: input}});
                fetchChat(chatId)
            }
        } catch (error) {
            console.error('Error fetching data', error); // invalid or expired token
        }
    };

    return (
        <div class='flex flex-1 overflow-hidden'>
            <aside className="bg-gray-400 w-64 p-4 overflow-auto">
                <FileList
                    files={availableFiles}
                    selectedFiles={selectedFiles}
                    onFileSelect={updateSelectedFiles} />
            </aside>
            <div className="flex flex-1 flex-col">
                <main className='flex-1 p-4 overflow-auto'>
                    {messages.map((res, index) => (
                        <div className='rounded overflow-hidden shadow-lg bg-white p-4 m-4'>
                            <p><b>{res.role}</b></p>
                            <div dangerouslySetInnerHTML={{ __html: res.content }}></div>
                        </div>
                    ))}
                </main>
                <div className='mt-auto bg-gray-200 p-4'>
                    <div class='flex items-center space-x-2'>
                        <input
                            type="text"
                            value={input}
                            className='flex-1 border-gray-300 border-2 rounded-l p-2'
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendPrompt()}
                        />
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r' onClick={sendPrompt}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;