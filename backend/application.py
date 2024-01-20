from flask import Flask
from config import Config
from extensions import db
from routes import main
from routes.api import api
from routes.ai import ai
from flask_cors import CORS
from models import Conversation
import os
import openai

def create_app(config_class=Config):
    application = Flask(__name__)
    application.config.from_object(config_class)

    db.init_app(application)

    application.register_blueprint(main)
    application.register_blueprint(api, url_prefix='/api')
    application.register_blueprint(ai, url_prefix='/ai')

    with application.app_context():
        db.create_all()

    # Enable CORS for running on different ports
    CORS(application)

    return application

application = create_app()

if __name__ == '__main__':
    application.run(debug=True)