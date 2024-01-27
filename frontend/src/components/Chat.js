import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { fetchNoAuth, fetchWithAuth } from '../utils/apiUtils';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FileList } from './FilePicker';
import EditableTitle from './EditableTitle';

function Chat() {
    // File management
    const [availableFiles, setAvailableFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);

    // Wait until you have everything
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Chat management
    const [input, setInput] = useState('');
    const [chatId, setChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [title, setTitle] = useState('');
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
            setTitle('');
            setIsLoading(false);
        } else {
            fetchChat(chatId);
            debugger;
            setIsLoading(false);
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
            setTitle(response.data.title && response.data.title !== '' ? response.data.title : response.data.messages[0].content);
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

    const saveTitle = async (title) => {
        try {
            const response = await fetchWithAuth(`/api/conversations/${chatId}/title`, getUserToken(),  {method: 'PUT', data: {title: title}});
            setTitle(title);
        } catch (error) {
            console.error('Error fetching data', error); // invalid or expired token
        }
    }

    if (isLoading) {
        return <div>Loading...</div>;
      }
    
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <EditableTitle initialTitle={title} onSave={saveTitle} />
            <FileList
                files={availableFiles}
                selectedFiles={selectedFiles}
                onFileSelect={updateSelectedFiles} />
            <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendPrompt()}
            />
            <button onClick={sendPrompt}>Send</button>
            <div>
                {messages.map((res, index) => (
                    <p key={index}><b>{res.role}</b> {res.content} <br /></p>
                ))}
            </div>
        </div>
    );
}

export default Chat;