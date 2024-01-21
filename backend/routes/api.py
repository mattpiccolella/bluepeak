from crypt import methods
from flask import Blueprint, jsonify, request
from models import Conversation, User
from extensions import db

api = Blueprint('api', __name__)

@api.route('/conversations', methods=['POST'])
def add_conversation():
    request_data = request.get_json()

    prompt = request_data.get('prompt')

    new_conversation = Conversation(prompt=prompt)

    db.session.add(new_conversation)
    db.session.commit()

    return jsonify({"message": "Conversation added successfully!"})

@api.route('/conversations', methods=['GET'])
def get_conversations():
    conversations = Conversation.query.all()

    return jsonify({"conversations": [conversation.serialize() for conversation in conversations]})

@api.route('/conversations/<int:item_id>', methods=['GET'])
def get_conversation_by_id(item_id):
    conversation = Conversation.query.filter_by(id=item_id).first()

    if conversation is None:
        return jsonify({"message": "Conversation not found!"}), 404

    return jsonify({"conversation": conversation.serialize()})

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