from fastapi import APIRouter, Request, Response, status
from app.db import (
    create_tab,
    delete_tab,
    mark_member_paid,
    get_items_in_tab,
    get_members_in_tab,
    get_payment_info,
    get_tab,
    add_member_to_tab,
    get_owner_name,
    get_one_member,
    get_bill_summary,
    update_member_name,
    update_item_members,
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
    tax: float = body.get("tax")
    subtotal: float = body.get("subtotal")
    items: list[dict] = body.get("items")

    tab_id = create_tab(items, owner_name, owner_payment_id, tax, subtotal)
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={"tab_id": tab_id}
    )

@router.post("/add_member")
async def add_member_to_tab_api(request: Request):
    body: dict = await request.json()
    tab_id = body.get("tab_id")
    name = body.get("name")
    is_owner = body.get("is_owner")
    if is_owner:
        payment_info = body.get("payment_info")
        member : dict = {
            "name": name,
            "payment_info": payment_info,
            "is_owner": is_owner,
            "submitted": False,
            "online": False,
            "share": 0.0,
            "tax": 0.0,
        }
        member_id = add_member_to_tab(tab_id, member)
    else:
        member: dict = {
            "name": name,
            "is_owner": is_owner,
            "paid": False,
            "submitted": False,
            "online": False,
            "share": 0.0,
            "tax": 0.0,
        }
        member_id = add_member_to_tab(tab_id, member)
        print("Member_id", member_id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"member_id": member_id}
    )


@router.get("/items/{tab_id}")
async def get_tab_items_api(tab_id: str):
    items: list[dict] = get_items_in_tab(tab_id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"items": items}
    )

@router.get("/info/{tab_id}")
async def get_tab_info_api(tab_id: str):
    response = get_tab(tab_id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=response
    )

@router.get("/{tab_id}/owner_name")
async def get_owner_name_api(tab_id: str):
    owner_name: str = get_owner_name(tab_id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"owner_name": owner_name}
    )

@router.delete("/{tab_id}")
async def delete_tab_api(tab_id: str):
    if delete_tab(tab_id) is not None:
        return JSONResponse(
            status_code=200,
            content={"message": "Tab deleted successfully"}
        )
    else:
        return JSONResponse(
            status_code=404,
            content={"error": f"Tab with ID '{tab_id}' not found or invalid."}
        )

@router.get("/{tab_id}/members")
async def get_members(tab_id: str):
    members: dict = get_members_in_tab(tab_id)
    if members is None:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"error": f"Tab with ID '{tab_id}' not found or invalid."}
        )
    else:
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"members": members}
        )

@router.get("/{tab_id}/members/{member_id}")
async def get_single_member(tab_id: str, member_id: str):
    member: dict = get_one_member(tab_id, member_id)
    print("Member", member)
    if member is None:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"error": f"Error fetching member {member_id} in tab {tab_id}"}
        )
    else:
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"member": member}
        )
    

@router.get("/share/{tab_id}/{member_id}")
async def get_member_share_api(tab_id: str, member_id: str):
    member = get_one_member(tab_id, member_id)
    payment_info = get_payment_info(tab_id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"member": member, "payment_info": payment_info},
    )

@router.get("/{tab_id}/owner_summary")
async def get_owner_summary_api(tab_id: str):
    members: list = get_members_in_tab(tab_id)
    bill_summary: dict = get_bill_summary(tab_id)
    if members is None or bill_summary is None:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"error": f"Tab with ID '{tab_id}' not found or invalid."}
        )
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"members": members, "bill_summary": bill_summary}
    )

@router.post("/mark_paid/{tab_id}/{member_id}")
async def mark_member_paid_api(tab_id: str, member_id: str):
    mark_member_paid(tab_id, member_id)
    return JSONResponse(
        status_code=200,
        content={"message": f"Member {member_id} in tab {tab_id} marked as paid."}
    )

@router.put("/member_name/{tab_id}/{member_id}")
async def update_member_name_api(tab_id: str, member_id: str, request: Request):
    new_name: str = (await request.json()).get("name")
    member = get_one_member(tab_id, member_id)
    if member is None:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"error": f"Member {member_id} not found in tab {tab_id}"}
        )
    else:
        update_member_name(tab_id, member_id, new_name, member.get("is_owner", False))
        tab = get_tab(tab_id)
        for item in tab.get("items", []):
            members_in_item : list[dict] = item.get("members", [])
            for member in members_in_item:
                if member.get("id") == member_id:
                    member["name"] = new_name
            update_item_members(tab_id, item["id"], members_in_item)
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Member updated successfully", "member": member}
        )
