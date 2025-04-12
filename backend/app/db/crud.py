from app.db import db
from app.utils import generate_unique_tab_id
from app.utils import invalid_tab_id

tabs_collection = db.collection("Tabs")

def create_tab(items: list[dict], owner: dict):
    tab_id = generate_unique_tab_id()
    tabs_collection.document(tab_id).set({"tab_id": tab_id})
    for item in items:
        tabs_collection.document(tab_id).collection("items").add(item)
    tabs_collection.document(tab_id).collection("members").add(owner)
    return tab_id

def get_tab(tab_id: str):
    if invalid_tab_id(tab_id): return None
    tab = tabs_collection.document(tab_id).get()
    return tab.to_dict()

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
    return [item.to_dict() for item in items] if items else None

def update_item_members(tab_id: str, item_id: str, members: list[int]):
    if invalid_tab_id(tab_id): return None
    item = tabs_collection.document(tab_id).collection("items").document(item_id)
    item.update({"members": members})
    return tab_id   

def add_member_to_tab():
    """Add a new member to the tab."""

def get_members_in_tab():
    """Return a list of members in a tab."""

def mark_member_submitted():
    """Mark a member as done selecting items."""

def mark_member_paid():
    """Mark a member as having paid."""

def update_member_share():
    """Update a member's share of the tab."""