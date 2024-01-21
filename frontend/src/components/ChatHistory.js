import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { fetchNoAuth, fetchWithAuth } from '../utils/apiUtils';

function ChatHistory() {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        // Define the async function that will fetch data
        const fetchChatHistory = async () => {
          try {
            const response = await fetchNoAuth('/api/conversations');
            setChats(response.data.conversations);
          } catch (error) {
            console.error("Error fetching data: ", error);
          }
        };
        console.log(chats);
        // Call the function
        fetchChatHistory();
      }, []); 


    return (
        <div>
            {chats.map((chat) => (
                <p key={chat.id}>{chat.prompt}</p>
            ))}
        </div>
    );
}

export default ChatHistory;