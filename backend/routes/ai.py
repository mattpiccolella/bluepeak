from flask import Blueprint, jsonify, request, current_app
from openai import OpenAI
from llama_index import VectorStoreIndex, SimpleDirectoryReader
from models import Conversation, User, Message, Document
from llama_index import Document as LlamaDocument
import boto3, pdb

client = OpenAI()

ai = Blueprint('ai', __name__)

def read_files_from_s3(bucket_name, documents):
    s3 = boto3.resource('s3')
    bucket = s3.Bucket(bucket_name)

    llama_documents = []

    for document in documents:
        obj = bucket.Object(document.s3_file_name)
        body = obj.get()['Body'].read()
        llama_document = LlamaDocument(
            text=body.decode('utf-8'),
            metadata={
                'file_name': document.file_name
            }
        )
        llama_documents.append(llama_document)

    return llama_documents

def load_data_into_index(documents):
    index = VectorStoreIndex.from_documents(documents)
    index.storage_context.persist()

    return index

def get_index_for_conversation(conversation):
    # TODO: include saving of the index
    documents = conversation.documents
    s3_documents = read_files_from_s3(current_app.config['S3_DOCUMENT_STORE'], documents)
    index = load_data_into_index(s3_documents)
    return index

def query_index(index, query):
    query_engine = index.as_query_engine(similar_top_k=5)
    response = query_engine.query(query)
    return response