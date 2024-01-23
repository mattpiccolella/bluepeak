from flask import Blueprint, jsonify, request
from openai import OpenAI
from llama_index import VectorStoreIndex, SimpleDirectoryReader

client = OpenAI()

ai = Blueprint('ai', __name__)

def load_data_into_index():
    documents = SimpleDirectoryReader('sample/').load_data()
    index = VectorStoreIndex.from_documents(documents)

    index.storage_context.persist()

    return index

@ai.route('/data', methods=['GET'])
def get_data():
    index = load_data_into_index()

    query_engine = index.as_query_engine(similar_top_k=5)
    response = query_engine.query('what is the 18th amendment?')

    pdb.set_trace()

    return jsonify({'message': response.response})