import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { fetchNoAuth, fetchWithAuth } from '../utils/apiUtils';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

function ChatHistory() {
    const [chats, setChats] = useState([]);
    const { isLoggedIn, login, logout, getUserToken} = useContext(AuthContext);

    useEffect(() => {
        // Define the async function that will fetch data
        const fetchChatHistory = async () => {
          try {
            const response = await fetchWithAuth('/api/conversations', getUserToken());
            setChats(response.data);
          } catch (error) {
            console.error("Error fetching data: ", error);
          }
        };
        // Call the function
        fetchChatHistory();
      }, []); 


    return (
        <div>
          {chats.map((chat) => (
            <Link to={`/chat/${chat.conversation_id}`} key={chat.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <p>{chat.messages[0].content} | {chat.last_updated_at}</p>
            </Link>
          ))}
        </div>
    );
}

export default ChatHistory;