import csv
import os
from flask import Flask, request, jsonify, render_template
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain.vectorstores import FAISS
from langchain.vectorstores.base import Document
from flask_cors import CORS
# Function to read CSV and create vector documents
def read_csv_into_vector_document(file, text_cols):
    with open(file, newline='') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        text_data = []
        for row in csv_reader:
            text = ' '.join([row[col] for col in text_cols])
            text_data.append(text)
        return [Document(page_content=text) for text in text_data]

# Initialize OpenAI API and embeddings
api_key = os.environ.get('OPENAI_API_KEY')
if not api_key:
    raise ValueError('OpenAI API key not found in environment variables.')

data = read_csv_into_vector_document("newchatbotdata.csv", ["term", "definition"])
embeddings = OpenAIEmbeddings(openai_api_key=api_key)
vectors = FAISS.from_documents(data, embeddings)
chain = ConversationalRetrievalChain.from_llm(
    llm=ChatOpenAI(temperature=0.0, model_name='gpt-3.5-turbo', openai_api_key=api_key),
    retriever=vectors.as_retriever()
)

# Initialize Flask app
app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)
history = []

@app.route('/')
def home():
    return render_template('bot.html')

@app.route('/chat', methods=['POST'])
def chat():
    global history
    data = request.json
    query = data.get("query", "")
    if not query:
        return jsonify({"error": "Query is required"}), 400

    try:
        response = chain({"question": query, "chat_history": history})
        history.append((query, response["answer"]))
        return jsonify({"answer": response["answer"]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)