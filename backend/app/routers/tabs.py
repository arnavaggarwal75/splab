from fastapi import APIRouter

router = APIRouter(
    prefix="/tabs",
    tags=["tabs"]
)

@router.get("/")
async def test_root():
    return {"Hello from tabs !"}

@router.post("/create")
async def create_tab():
    return {"Creating a tab !"}

@router.delete("/{tab_id}")
async def delete_tab(tab_id: int):
    return {f"Tab is settled so, Deleting tab {tab_id}!"}

@router.post("/add_member")
async def add_member():
    return {f"Adding member to a specific tab!"}

