from flask import Blueprint, jsonify

api = Blueprint('api', __name__)

@api.route('/data')
def get_data():
    return jsonify({"data": "Hello from Flask!"})