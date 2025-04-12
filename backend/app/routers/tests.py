from fastapi import APIRouter

from ..db.client import db

router = APIRouter(
    prefix="/tests",
    tags=["tests"]
)

@router.get("/")
async def test_root():
    return {"This test worked ! The backend is running unga bunga - 🐒"}

# Sample Read and Write endpoints for Firestore
@router.post("/test-write")
def test_write():
    doc_ref = db.collection("test").document("ping")
    doc_ref.set({"message": "pong", "active": True})
    return {"status": "written"}

@router.get("/test-read")
def test_read():
    doc = db.collection("test").document("ping").get()
    if doc.exists:
        return doc.to_dict()
    return {"error": "Document not found"}

