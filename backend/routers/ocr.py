from fastapi import APIRouter

router = APIRouter(
    prefix="/ocr",
    tags=["ocr"]
)

@router.get("/")
async def test_root():
    return {"Hello from the ocr !"}
