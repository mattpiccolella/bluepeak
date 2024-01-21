from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class Conversation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    prompt = db.Column(db.String(128), nullable=False)
    response = db.Column(db.String(1280), nullable=True)
    # Add other fields here

    def serialize(self):
        # Convert the object's state to a serializable dictionary
        return {
            'id': self.id,
            'prompt': self.prompt,
            'response': self.response
        }

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    # Add other fields here

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        # Convert the object's state to a serializable dictionary
        return {
            'id': self.id,
            'email': self.email
        }