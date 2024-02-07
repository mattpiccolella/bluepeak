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
      <div class="flex-1 overflow-auto px-7">
        {chats.map((chat) => (
          <Link to={`/chat/${chat.conversation_id}`} key={chat.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div key={chat.conversation_id} className="bg-gray-100 my-3 p-2 border-l-4 border-blue-500">
              <div className="ml-3">
                <h2>{chat.title ? chat.title : chat.messages[0].content}</h2>
                <p className='mt-1 text-gray-500 text-xs'>{format(chat.last_updated_at, 'MMMM do, yyyy h:mm a')}</p>
              </div>
            </div>
          </Link>
        ))}
        <div className="flex justify-center">
          <button class='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded'><Link to='/chat'>New Chat</Link></button>
        </div>
      </div>
    );
}

export default ChatHistory;