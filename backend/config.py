import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a-very-hard-to-guess-string'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///mydatabase.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False