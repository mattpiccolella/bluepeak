from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
import datetime

class Conversation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # Add other fields here
    messages = db.relationship('Message', backref='conversation')
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    last_updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    def serialize(self):
        # Convert the object's state to a serializable dictionary
        return {
            'conversation_id': self.id,
            'user_id': self.user_id,
            'created_at': self.created_at,
            'last_updated_at': self.last_updated_at,
            'messages': [message.serialize() for message in self.messages]
        }

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    conversations = db.relationship('Conversation', backref='user')
    # Add other fields here

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        # Convert the object's state to a serializable dictionary
        return {
            'id': self.id,
            'email': self.email,
            'created_at': self.created_at
        }

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(1280), nullable=False)
    role = db.Column(db.String(128), nullable=False)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversation.id'))
    # Add other fields here

    def serialize(self):
        # Convert the object's state to a serializable dictionary
        return {
            'id': self.id,
            'content': self.content,
            'role': self.role
        }