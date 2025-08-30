from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from pathlib import Path
from io import BytesIO
from typing import List
import requests
import json

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CONFIG_FILE = Path(__file__).parent / "config.json"
llm_config: dict = {}
vector_store = None
analytics_data: List[dict] = []
ALLOWED_EXTS = {".pdf", ".ppt", ".pptx", ".doc", ".docx", ".txt", ".md"}


def load_config():
    if CONFIG_FILE.exists():
        with CONFIG_FILE.open() as f:
            llm_config.update(json.load(f))


def save_config():
    CONFIG_FILE.parent.mkdir(parents=True, exist_ok=True)
    with CONFIG_FILE.open("w") as f:
        json.dump(llm_config, f)


load_config()


@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    if not llm_config.get("key"):
        return {"error": "LLM not configured"}
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTS:
        return {"error": "Unsupported file type"}
    content = await file.read()
    text = ""
    if ext == ".pdf":
        from pypdf import PdfReader
        reader = PdfReader(BytesIO(content))
        text = "".join(page.extract_text() or "" for page in reader.pages)
    else:
        text = content.decode("utf-8", errors="ignore")
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    docs = splitter.split_text(text)
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=llm_config.get("key"))
    global vector_store
    vector_store = FAISS.from_texts(docs, embeddings)
    return {"status": "ok", "chunks": len(docs)}


@app.post("/llm-config")
async def llm_config_endpoint(cfg: dict):
    llm_config.update(cfg)
    save_config()
    return {"status": "ok"}


@app.get("/llm-config")
async def get_llm_config_endpoint():
    load_config()
    return llm_config


@app.get("/analytics")
async def analytics():
    return analytics_data


@app.get("/health")
async def health() -> dict:
    """Simple health check for deployment environments."""
    return {"status": "ok"}


@app.post("/chat")
async def chat(body: dict):
    question = body.get("question", "")
    mode = body.get("mode", "kb")
    instructions = body.get("instructions", "")
    answer = "No data"
    refs = []
    if vector_store:
        docs = vector_store.similarity_search(question, k=2)
        if docs:
            context = "\n".join([d.page_content for d in docs])
            refs = [f"chunk {i+1}" for i in range(len(docs))]
            prompt = f"{instructions}\nContext:\n{context}\nQuestion: {question}"
            url = f"{llm_config.get('endpoint')}?key={llm_config.get('key')}"
            resp = requests.post(url, json={"contents": [{"parts": [{"text": prompt}]}]})
            data = resp.json()
            answer = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "No data")
    if mode == "both" and (answer == "No data" or not answer.strip()):
        url = f"{llm_config.get('endpoint')}?key={llm_config.get('key')}"
        resp = requests.post(url, json={"contents": [{"parts": [{"text": question}]}]})
        data = resp.json()
        answer = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "No data")
    analytics_data.append({"question": question, "source": "kb" if refs else "llm"})
    return {"answer": answer, "references": refs}


@app.get("/")
async def root():
    return {"message": "RAG backend"}
