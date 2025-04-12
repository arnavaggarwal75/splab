from fastapi import APIRouter, Request, Response, status
from app.db.crud import *
from fastapi.responses import JSONResponse

router = APIRouter(
    prefix="/tabs",
    tags=["tabs"]
)

@router.get("/")
async def test_root():
    return {"Hello from tabs !"}

@router.post("/create")
async def create_tab(request: Request):
    body: dict = await request.json()
    owner_name: str = body.get("owner_name")
    owner_payment_id: str = body.get("owner_payment_id")
    items: list[dict] = body.get("items")
    owner: dict = {
        "name": owner_name,
        "payment_info": owner_payment_id
    }
    tab_id: str = create_tab(items=items, owner=owner)
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={"link": f"/{tab_id}"}
    )

@router.delete("/{tab_id}")
async def delete_tab(tab_id: str):
    if delete_tab(tab_id) is not None:
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    else:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"error": f"Tab with ID '{tab_id}' not found or invalid."}
        )


@router.post("/add_member")
async def add_member():
    return {f"Adding member to a specific tab!"}

