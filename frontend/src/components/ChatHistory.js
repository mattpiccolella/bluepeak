import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { fetchNoAuth, fetchWithAuth } from '../utils/apiUtils';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import '../assets/styles/CardStyle.css';

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
      <div className="chat-container">
        {chats.map((chat) => (
          <Link to={`/chat/${chat.conversation_id}`} key={chat.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div key={chat.conversation_id} className="message">
              <div className="message-content">
                <h2>{chat.title ? chat.title : chat.messages[0].content}</h2>
                <p className='date text-green'>{format(chat.last_updated_at, 'MMMM do, yyyy h:mm a')}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
}

export default ChatHistory;