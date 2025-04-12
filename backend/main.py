from fastapi import FastAPI
from google.cloud import firestore

app = FastAPI()

db = firestore.Client.from_service_account_json('./serviceAccountKey.json')

@app.get("/")
def read_root():
    return {"Hello": "World"}


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