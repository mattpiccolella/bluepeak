from . import main
from flask import jsonify, request
from flask_jwt_extended import JWTManager, create_access_token
from models import User
from extensions import db

@main.route('/')
def home():
    return jsonify({"message": "Hello, World! Is deploying actually easy?"})

@main.route('/register', methods=['POST'])
def register():
    data = request.json

    new_user = User(email=data['email'])
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201

@main.route('/login', methods=['POST'])
def login():
    data = request.json

    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200

    return jsonify({"message": "Bad username or password"}), 401

# Error handlers
@main.app_errorhandler(404)
def not_found_error(error):
    return jsonify({"error": "Resource not found"}), 404

@main.app_errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500