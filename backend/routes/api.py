from crypt import methods
from flask import Blueprint, jsonify, request, current_app
from models import Conversation, User, Message, Document
from extensions import db
from flask_jwt_extended import get_jwt_identity, jwt_required
from openai import OpenAI
from .ai import get_index_for_conversation, query_index, upsert_embedding_to_pinecone
from werkzeug.utils import secure_filename
import boto3, uuid, pdb

client = OpenAI()

api = Blueprint('api', __name__)

def route_ai_response_for_conversation(conversation, prompt):
    history = get_history_for_conversation(conversation)

    if len(conversation.documents) == 0:
        return get_ai_message(prompt, history)
    else:
        index = get_index_for_conversation(conversation)
        return get_index_message(index, prompt, history)

def get_index_message(index, prompt, history):
    messages = []

    user_message = Message(content=prompt, role='user')

    history.append({'role': 'user', 'content': prompt})
    messages.append(user_message)

    response = query_index(index, prompt)

    ai_message = Message(content=response.response, role='assistant - index')

    messages.append(ai_message)
    return messages

def get_history_for_conversation(conversation):
    history = [{
                "role": "system",
                "content": "you are a helpful assistant"
    }]
    ELIGIBLE_ROLES = ('user', 'assistant', 'system', 'function')
    for message in conversation.messages:
        history.append({'content': message.content, 'role': message.role if message.role in ELIGIBLE_ROLES else 'assistant'})
    return history

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

    # First, create a new conversation with documents
    new_conversation = Conversation(user_id=current_user_id)
    document_ids = request_data.get('document_ids', [])
    for doc_id in document_ids:
        document = Document.query.get(doc_id)
        if document:
            new_conversation.documents.append(document)

    messages = route_ai_response_for_conversation(new_conversation, prompt)

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

    messages = route_ai_response_for_conversation(conversation, prompt)

    for message in messages:
        conversation.messages.append(message)
    db.session.commit()

    return jsonify(conversation.serialize())

@api.route('/conversations/<int:conversation_id>/documents', methods=['PUT'])
@jwt_required()
def update_documents_on_conversation(conversation_id):
    # Get the list of document IDs from the request
    # Expecting the data in the format: {"document_ids": [1, 2, 3]}
    data = request.json
    document_ids = data.get('document_ids', [])

    try:
        # Find the conversation
        conversation = Conversation.query.get(conversation_id)
        if not conversation:
            return jsonify({'error': 'Conversation not found'}), 404

        # Update the documents associated with the conversation
        # Clear the existing associations
        conversation.documents.clear()

        # Add the new associations
        for doc_id in document_ids:
            document = Document.query.get(doc_id)
            if document:
                conversation.documents.append(document)

        # Commit the changes to the database
        db.session.commit()

        return jsonify({'message': 'Documents updated successfully'}), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/conversations/<int:conversation_id>/title', methods=['PUT'])
@jwt_required()
def update_conversation_title(conversation_id):
    data = request.json
    new_title = data.get('title', '')

    try:
        conversation = Conversation.query.get(conversation_id)
        conversation.title = new_title

        db.session.commit()

        return jsonify({'message': 'Conversation title updated successfully'}), 200
    except:
        db.session.rollback()
        return jsonify({'error': 'Something went wrong'}), 500

@api.route('/conversations', methods=['GET'])
@jwt_required()
def get_conversations():
    current_user_id = get_jwt_identity()

    conversations = Conversation.query.filter_by(user_id=current_user_id).order_by(Conversation.last_updated_at.desc()).all()

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

@api.route('/users/profile_picture', methods=['POST'])
@jwt_required()
def user_profile_picture():
    current_user_id = get_jwt_identity()

    file = request.files['file']

    file_name = secure_filename(file.filename)
    s3_file_name = generate_file_name(secure_filename(file.filename))

    s3_client = boto3.client('s3')
    s3_client.upload_fileobj(file, 'polywise-document-store', s3_file_name)

    user = User.query.get(current_user_id)
    user.profile_picture_s3_link = s3_file_name
    db.session.commit()

    return jsonify({"user": user.serialize()})

@api.route('/file', methods=['GET'])
@jwt_required()
def get_files_for_user():
    current_user_id = get_jwt_identity()

    documents = Document.query.filter_by(user_id=current_user_id)

    return jsonify([document.serialize() for document in documents])

@api.route('/file/upload', methods=['POST'])
@jwt_required()
def upload_file():
    file = request.files['file']
    file_body = file.read()

    file_name = secure_filename(file.filename)
    s3_file_name = generate_file_name(secure_filename(file.filename))

    s3_client = boto3.client('s3')
    s3_client.upload_fileobj(file, 'polywise-document-store', s3_file_name)

    embedding_id = upsert_embedding_to_pinecone(s3_file_name, file_body, current_app.index)

    new_document = Document(file_name = file_name, content_type = file.content_type,
                            file_size = file.content_length, s3_file_name = s3_file_name,
                            user_id = get_jwt_identity(), pinecone_index_id = embedding_id)

    db.session.add(new_document)
    db.session.commit()

    return jsonify(new_document.serialize())

@api.route('/file/<int:file_id>', methods=['DELETE'])
@jwt_required()
def delete_file(file_id):
    document = Document.query.get(file_id)

    if document is None:
        return jsonify({"message": "Document not found!"}), 404

    db.session.delete(document)
    db.session.commit()

    return jsonify({"message": "Document deleted successfully!"})

def generate_file_name(original_filename):
    extension = original_filename.split('.')[-1]
    unique_filename = f"{uuid.uuid4()}.{extension}"
    return unique_filename