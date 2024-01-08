from flask import Blueprint, jsonify

api = Blueprint('api', __name__)

@api.route('/')
def home():
    return jsonify({"message": "Blueprint API"})