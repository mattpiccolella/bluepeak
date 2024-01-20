from extensions import db

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