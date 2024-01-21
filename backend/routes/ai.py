from flask import Blueprint, jsonify, request
from openai import OpenAI

client = OpenAI()

ai = Blueprint('ai', __name__)

@ai.route('/data', methods=['GET'])
def get_data():
    prompt = request.args.get('prompt')
    # Retrieve conversation history from the database
    session_id = 12345
    history = get_conversation_history(session_id)
    
    # Append user message to the history
    user_message = "Who was the first president of the United States?"
    history.append({'role': 'user', 'content': user_message})

    # Get response from OpenAI
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "you are a helpful assistant"
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=1,
        max_tokens=256,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )

    ai_response = response.choices[0].message.content

    # Append AI response to the history and update in the database
    history.append({'role': 'assistant', 'content': ai_response})
    update_conversation_history(session_id, history, ai_response)

    return jsonify({"response": ai_response})


# Assume a function that gets and updates conversation history
def get_conversation_history(session_id):
    # Retrieve conversation history from your database
    history = []
    return history

def update_conversation_history(session_id, user_input, ai_response):
    # Update conversation history in your database
    pass