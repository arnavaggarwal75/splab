from app.db import db
from app.utils import generate_unique_tab_id
from app.utils import invalid_tab_id
from google.cloud import firestore

tabs_collection = db.collection("Tabs")

def create_tab(items: list[dict], owner: dict):
    tab_id = generate_unique_tab_id()
    print(f"Creating tab {tab_id}")
    tabs_collection.document(tab_id).set({"tab_id": tab_id})
    for item in items:
        tabs_collection.document(tab_id).collection("items").add(item)
    tabs_collection.document(tab_id).collection("members").add(owner)
    return tab_id

def get_tab(tab_id: str):
    if invalid_tab_id(tab_id): return None
    tab = tabs_collection.document(tab_id).get()
    tab_data = tab.to_dict() or {}
    items_ref = tabs_collection.document(tab_id).collection("items").get()
    tab_data["items"] = [{"id": item.id, **item.to_dict()} for item in items_ref]
    members_ref = tabs_collection.document(tab_id).collection("members").get()
    tab_data["members"] = [{"id": member.id, **member.to_dict()} for member in members_ref]
    return tab_data

def delete_tab(tab_id: str):
    if invalid_tab_id(tab_id): return None
    tabs_collection.document(tab_id).delete()
    return tab_id

def add_items_to_tab(tab_id: str, items: list[dict]):
    if invalid_tab_id(tab_id): return None
    for item in items:
        tabs_collection.document(tab_id).collection("items").add(item)
    return tab_id
    
def get_items_in_tab(tab_id: str):
    if invalid_tab_id(tab_id): return None
    items = tabs_collection.document(tab_id).collection("items").get()
    return [{"id": item.id, **item.to_dict()} for item in items] if items else None

def update_item_members(tab_id: str, item_id: str, members: list[str]):
    if invalid_tab_id(tab_id): return None
    item = tabs_collection.document(tab_id).collection("items").document(item_id)
    item.update({"members": members})
    return tab_id

def add_item_members(tab_id: str, item_id: str, member_id: str):
    update_item_members(tab_id, item_id, firestore.ArrayUnion([member_id]))

def remove_item_members(tab_id: str, item_id: str, member_id: str):
    update_item_members(tab_id, item_id, firestore.ArrayRemove([member_id]))

def get_members_in_item(tab_id: str, item_id: str):
    if invalid_tab_id(tab_id): return None
    item = tabs_collection.document(tab_id).collection("items").document(item_id).get()
    if item.exists:
        item_dict = item.to_dict()
        members = item_dict.get("members", [])
        return members
    else:
        return []

def add_member_to_tab(tab_id: str, member: dict):
    if invalid_tab_id(tab_id): return None
    tabs_collection.document(tab_id).collection("members").add(member)
    return tab_id

def remove_member_from_tab(tab_id: str, member_id: str):
    """Remove a member from the tab"""

def get_members_in_tab(tab_id: str):
    if invalid_tab_id(tab_id): return None
    members = tabs_collection.document(tab_id).collection("members").get()
    return [{"id": member.id, **member.to_dict()} for member in members] if members else None

def mark_member_submitted(tab_id: str, member_id: str):
    if invalid_tab_id(tab_id): return None
    member = tabs_collection.document(tab_id).collection("members").document(member_id)
    member.update({"submitted": True})
    return tab_id

def mark_member_paid(tab_id: str, member_id: str):
    if invalid_tab_id(tab_id): return None
    member = tabs_collection.document(tab_id).collection("members").document(member_id)
    member.update({"paid": True})
    return tab_id

def get_member_share():
    """Get a member's share of the tab."""

def update_member_share(tab_id: str, member_id: str, share: float):
    if invalid_tab_id(tab_id): return None
    member = tabs_collection.document(tab_id).collection("members").document(member_id)
    member.update({"share": share})
    return tab_id

def get_item_cost(tab_id: str, item_id: str):
    if invalid_tab_id(tab_id): return None
    item = tabs_collection.document(tab_id).collection("items").document(item_id).get()
    if item.exists:
        return item.to_dict().get("price", 0)
    else:
        return 0

