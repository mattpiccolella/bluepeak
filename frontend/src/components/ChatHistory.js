import React, { useState, useEffect} from 'react';
import axios from 'axios';

function ChatHistory() {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        // Define the async function that will fetch data
        const fetchChatHistory = async () => {
          try {
            const serverUrl = process.env.REACT_APP_SERVER_URL;
            console.log(serverUrl)
            const response = await axios.get(`${serverUrl}/api/conversations`);
            setChats(response.data.conversations);
            console.log(chats)
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