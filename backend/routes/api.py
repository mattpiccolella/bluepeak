from flask import Blueprint, jsonify, request
from models import Conversation
from extensions import db

api = Blueprint('api', __name__)

@api.route('/data')
def get_data():
    return jsonify({"data": "Hello from Flask! I'm testing a deploy change here"})


@api.route('/conversation/add', methods=['POST'])
def add_conversation():
    request_data = request.get_json()

    prompt = request_data.get('prompt')

    new_conversation = Conversation(prompt=prompt)

    db.session.add(new_conversation)
    db.session.commit()

    return jsonify({"message": "Conversation added successfully!"})