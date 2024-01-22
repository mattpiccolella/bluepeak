import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or '0ExPPiyXakX6cA8P6F3P'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'rONXdhMf0ohi9f4P6dsm'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=30)
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///mydatabase.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False