import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or '0ExPPiyXakX6cA8P6F3P'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'rONXdhMf0ohi9f4P6dsm'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=30)
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///mydatabase.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    S3_DOCUMENT_STORE = os.environ.get('S3_DOCUMENT_STORE') or 'polywise-document-store'
    S3_REGION = os.environ.get('S3_REGION') or 'us-west-1'
    PINECONE_API_KEY = os.environ.get('PINECONE_API_KEY') or 'secretkey'
    PINECONE_INDEX_NAME = os.environ.get('PINECONE_INDEX_NAME') or 'polywise-index'