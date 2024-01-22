import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { fetchNoAuth, fetchWithAuth } from '../utils/apiUtils';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function Chat() {
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
        } else {
            fetchChat(chatId)
        }
    }, [chatId]);

    const fetchChat = async (chatId) => {
        try {
            const response = await fetchWithAuth(`/api/conversations/${chatId}`, getUserToken());
            setChatId(response.data.conversation_id);
            setMessages(response.data.messages);
        } catch (error) {
            console.error('Error fetching data', error); // invalid or expired token
        }
    }
    const sendPrompt = async () => {
        setMessages([...messages, { content: input, role: 'user' }]);
        setInput('');

        try {
            if (!chatId) {
                const response = await fetchWithAuth(`/api/conversations`, getUserToken(),  {method: 'POST', data: {prompt: input}});
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
        <div>
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