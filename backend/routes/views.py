from . import main
from flask import jsonify

@main.route('/')
def home():
    return jsonify({"message": "Hello, World!"})

@main.route('/login')
def login():
    return jsonify({"message": "Login!"})


# Error handlers
@main.app_errorhandler(404)
def not_found_error(error):
    return jsonify({"error": "Resource not found"}), 404

@main.app_errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500