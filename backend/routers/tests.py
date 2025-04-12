from fastapi import APIRouter

router = APIRouter(
    prefix="/tests",
    tags=["tests"]
)

@router.get("/")
async def test_root():
    return {"This test worked ! The backend is running unga bunga - 🐒"}
