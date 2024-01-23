from crypt import methods
from flask import Blueprint, jsonify, request
from models import Conversation, User, Message, Document
from extensions import db
from flask_jwt_extended import get_jwt_identity, jwt_required
from openai import OpenAI
from werkzeug.utils import secure_filename
import boto3, uuid

client = OpenAI()
api = Blueprint('api', __name__)

def get_ai_message(prompt, history):
    messages = []

    user_message = Message(content=prompt, role='user')

    history.append({'role': 'user', 'content': prompt})
    messages.append(user_message)

    # Get response from OpenAI
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=history,
        temperature=1,
        max_tokens=256,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )

    ai_response = response.choices[0].message.content

    ai_message = Message(content=ai_response, role='assistant')

    messages.append(ai_message)
    return messages

@api.route('/conversations', methods=['POST'])
@jwt_required()
def add_conversation():
    request_data = request.get_json()

    prompt = request_data.get('prompt')
    current_user_id = get_jwt_identity()

    new_conversation = Conversation(user_id=current_user_id)

    messages = get_ai_message(prompt, [{
                "role": "system",
                "content": "you are a helpful assistant"
            }])

    for message in messages:
        new_conversation.messages.append(message)

    db.session.add(new_conversation)
    db.session.commit()

    return jsonify(new_conversation.serialize())

@api.route('/conversations/<int:conversation_id>', methods=['POST'])
@jwt_required()
def add_message_to_conversation(conversation_id):
    conversation = Conversation.query.filter_by(id=conversation_id).first()

    if not conversation:
        return jsonify({"message": "Conversation not found!"}), 404

    request_data = request.get_json()

    prompt = request_data.get('prompt')
    current_user_id = get_jwt_identity()

    if current_user_id != conversation.user_id:
        return jsonify({"message": "You are not authorized to add messages to this conversation!"}), 401

    history = [{'content': message.content, 'role': message.role} for message in conversation.messages]

    messages = get_ai_message(prompt, history)

    for message in messages:
        conversation.messages.append(message)

    db.session.commit()

    return jsonify(conversation.serialize())

@api.route('/conversations', methods=['GET'])
@jwt_required()
def get_conversations():
    current_user_id = get_jwt_identity()

    conversations = Conversation.query.filter_by(user_id=current_user_id).all()

    return jsonify([conversation.serialize() for conversation in conversations])

@api.route('/conversations/<int:item_id>', methods=['GET'])
@jwt_required()
def get_conversation_by_id(item_id):
    conversation = Conversation.query.filter_by(id=item_id).first()

    if conversation is None:
        return jsonify({"message": "Conversation not found!"}), 404

    current_user_id = get_jwt_identity()

    if current_user_id != conversation.user_id:
        return jsonify({"message": "You are not authorized to add messages to this conversation!"}), 401

    return jsonify(conversation.serialize())

@api.route('/users/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    user = User.query.filter_by(id=user_id).first()

    if user is None:
        return jsonify({"message": "User not found!"}), 404

    return jsonify({"user": user.serialize()})

@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()

    return jsonify({"users": [user.serialize() for user in users]})

@api.route('/users/profile', methods=['GET'])
@jwt_required()
def user_profile():
    current_user_id = get_jwt_identity()

    return get_user_by_id(current_user_id)

@api.route('/file/upload', methods=['POST'])
def upload_file():
    file = request.files['file']

    file_name = secure_filename(file.filename)
    s3_file_name = generate_file_name(secure_filename(file.filename))

    s3_client = boto3.client('s3')
    s3_client.upload_fileobj(file, 'polywise-document-store', s3_file_name)

    new_document = Document(file_name = file_name, content_type = file.content_type, file_size = file.content_length, s3_file_name = s3_file_name)

    db.session.add(new_document)
    db.session.commit()

    return jsonify(new_document.serialize())

def generate_file_name(original_filename):
    extension = original_filename.split('.')[-1]
    unique_filename = f"{uuid.uuid4()}.{extension}"
    return unique_filename