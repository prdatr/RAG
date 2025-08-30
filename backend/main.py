from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from langchain_community.embeddings import FakeEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

vector_store = None
llm_config = {}
analytics_data = []


@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    text = (await file.read()).decode("utf-8", errors="ignore")
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    docs = splitter.split_text(text)
    embeddings = FakeEmbeddings(size=256)
    global vector_store
    vector_store = FAISS.from_texts(docs, embeddings)
    return {"status": "ok", "chunks": len(docs)}


@app.post("/llm-config")
async def llm_config_endpoint(cfg: dict):
    llm_config.update(cfg)
    return {"status": "ok"}


@app.get("/analytics")
async def analytics():
    return analytics_data


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
            answer = " ".join([d.page_content for d in docs])
            refs = [f"chunk {i+1}" for i in range(len(docs))]
    if mode == "both" and answer == "No data":
        answer = "LLM response placeholder."
    analytics_data.append({"question": question, "source": "kb" if refs else "llm"})
    return {"answer": answer, "references": refs}


@app.get("/")
async def root():
    return {"message": "RAG backend"}
