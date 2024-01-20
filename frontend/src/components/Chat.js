import React, { useState } from 'react';
import axios from 'axios';

function Chat() {
    const [input, setInput] = useState('');
    const [responses, setResponses] = useState([]);

    const sendPrompt = async () => {
        const serverUrl = process.env.REACT_APP_SERVER_URL;
        const response = await axios.get(`${serverUrl}/ai/data`, { params: {prompt: input } });
        setResponses([...responses, { prompt: input, response: response.data }]);
        setInput('');

        await axios.post(`${serverUrl}/api/conversations`, { prompt: input, response: response.data });
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
                {responses.map((res, index) => (
                    <p key={index}><b>Prompt:</b> {res.prompt} <br /><b>Response:</b> {res.response.response}</p>
                ))}
            </div>
        </div>
    );
}

export default Chat;