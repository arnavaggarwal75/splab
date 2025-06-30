from fastapi import APIRouter
from app.db import db, create_tab, get_tab, add_items_to_tab, get_items_in_tab, update_item_members, add_member_to_tab, get_members_in_tab

router = APIRouter(
    prefix="/tests",
    tags=["tests"]
)

@router.get("/")
async def test_root():
    return {"This test worked ! The backend is running unga bunga - 🐒"}

@router.get("/ci-cd")
def test_cicd():
    return {"CI-CD Pipeline worked!!!"}

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

@router.get("/test-crud")
async def test_create_tab():
    test_tab_id = "ejr349"  
    res2 = get_items_in_tab(test_tab_id)
    res5 = get_members_in_tab(test_tab_id)
    return {
        "get_items_result": res2,
        "get_members_result": res5
    }
    # test_items = [
    #     {"name": "Samosa", "price": 12.5, "members": ["1", "2"]},
    #     {"name": "Chai", "price": 8, "members": ["2", "3"]}
    # ]
    # res1 = add_items_to_tab(test_tab_id, test_items)
    # res2 = get_items_in_tab(test_tab_id)
    # return {"res1": res1, "res2": res2}

    # return get_tab("ejr349")
    # return create_tab(owner={"name": "RIthvik", "payment_info": "1231321"}, items = [{"name": "potato", "price": 25, "members": ['1', '2', '3']}, {"name": "apple", "price": 230, "members": ['4', '5']}])
