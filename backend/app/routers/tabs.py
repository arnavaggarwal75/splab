from fastapi import APIRouter, Request, Response, status
from app.db import (
    create_tab,
    delete_tab,
    mark_member_paid,
    add_items_to_tab,
    get_items_in_tab,
    update_item_members,
    add_item_members,
    remove_item_members,
    get_members_in_item,
    update_member_share,
    get_member_share,
    get_item_cost,
    add_member_to_tab,
    remove_member_from_tab,
)
from fastapi.responses import JSONResponse

router = APIRouter(
    prefix="/tabs",
    tags=["tabs"]
)

@router.get("/")
async def test_root():
    return {"Hello from tabs !"}

@router.post("/create")
async def create_tab_api(request: Request):
    body: dict = await request.json()
    owner_name: str = body.get("owner_name")
    owner_payment_id: str = body.get("owner_payment_id")
    items: list[dict] = body.get("items")
    owner: dict = {
        "name": owner_name,
        "payment_info": owner_payment_id
    }
    tab_id, member_id = create_tab(items, owner)
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={"tab_id": tab_id, "member_id": member_id}
    )

@router.get("/{tab_id}")
async def get_tab_items_api(tab_id: str):
    items: list[dict] = get_items_in_tab(tab_id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"items": items}
    )

@router.delete("/{tab_id}")
async def delete_tab_api(tab_id: str):
    if delete_tab(tab_id) is not None:
        return Response("message: Tab deleted successfully", status_code=204)
    else:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"error": f"Tab with ID '{tab_id}' not found or invalid."}
        )

@router.post("/mark_paid/{tab_id}/{member_id}")
async def mark_member_paid(tab_id: str, member_id: str):
    mark_member_paid(tab_id, member_id)
    return JSONResponse(
        status_code=200,
        content={"message": f"Member {member_id} in tab {tab_id} marked as paid."}
    )