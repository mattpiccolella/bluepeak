from flask import Flask
from config import Config
from extensions import db
from routes import main
from routes.api import api

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)

    app.register_blueprint(main)
    app.register_blueprint(api, url_prefix='/api')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)