from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from .routers import tests
from .routers import ocr
from sockets import socket_app

from google.cloud import firestore
from .services.ocr import extract_receipt_info

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = firestore.Client.from_service_account_json('./serviceAccountKey.json')

app.include_router(tests.router)
app.include_router(ocr.router)
app.mount("/", socket_app)

@app.get("/")
def read_root():
    return {"The backend is running unga bunga - 🐒"}

@app.post("/extract-receipt-info")
async def extract_receipt(file: UploadFile):
    image_data = await file.read()
    result = extract_receipt_info(image_data, file.filename)
    return result



# Sample Read and Write endpoints for Firestore
@app.post("/test-write")
def test_write():
    doc_ref = db.collection("test").document("ping")
    doc_ref.set({"message": "pong", "active": True})
    return {"status": "written"}

@app.get("/test-read")
def test_read():
    doc = db.collection("test").document("ping").get()
    if doc.exists:
        return doc.to_dict()
    return {"error": "Document not found"}

