import React, { useState } from 'react';
import axios from 'axios';
import { fetchNoAuth, fetchWithAuth } from '../utils/apiUtils';

function Chat() {
    const [input, setInput] = useState('');
    const [responses, setResponses] = useState([]);

    const sendPrompt = async () => {
        const response = await fetchNoAuth(`/ai/data`, { params: {prompt: input } });
        setResponses([...responses, { prompt: input, response: response.data }]);
        setInput('');

        await fetchNoAuth(`/api/conversations`, { method: 'POST', data: {prompt: input, response: response.data.response }});
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