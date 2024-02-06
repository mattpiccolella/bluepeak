import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { fetchNoAuth, fetchWithAuth } from '../utils/apiUtils';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FileList } from './FilePicker';

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
        <div class='chat-container pt-16'>
            <FileList
                files={availableFiles}
                selectedFiles={selectedFiles}
                onFileSelect={updateSelectedFiles} />
            <div class='messages-container'>
                {messages.map((res, index) => (
                    <div class='chat-message'>
                        <p><b>{res.role}</b></p>
                        <p>{res.content}</p>
                    </div>
                ))}
            </div>
            <div class='chat-footer'>
                <input 
                    type="text"
                    value={input}
                    class='chat-input'
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendPrompt()}
                />
                <button class='send-button' onClick={sendPrompt}>Send</button>
            </div>
        </div>
    );
}

export default Chat;