from app.db import db
from app.utils import generate_unique_tab_id, invalid_tab_id, clear_subcollection
from google.cloud import firestore

tabs_collection = db.collection("Tabs")

def create_tab(items: list[dict], owner_name: str, owner_payment_id: str):
    tab_id = generate_unique_tab_id()
    print(f"Creating tab {tab_id}")
    tabs_collection.document(tab_id).set({"tab_id": tab_id, "owner_name": owner_name, "payment_info": owner_payment_id})
    for item in items:
        tabs_collection.document(tab_id).collection("items").add(item)
    return (tab_id)

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
    tabs_ref = tabs_collection.document(tab_id)
    clear_subcollection(tabs_ref, "items")
    clear_subcollection(tabs_ref, "members")
    tabs_ref.delete()
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

def update_item_members(tab_id: str, item_id: str, members: list[dict]):
    if invalid_tab_id(tab_id): return None
    item = tabs_collection.document(tab_id).collection("items").document(item_id)
    item.update({"members": members})
    return tab_id

def add_item_members(tab_id: str, item_id: str, member_id: str, member_name: str):
    if invalid_tab_id(tab_id): return None
    item = tabs_collection.document(tab_id).collection("items").document(item_id)
    item.update({
        "members": firestore.ArrayUnion([{
            "id": member_id,
            "name": member_name
        }])
    })
    return tab_id

def remove_item_members(tab_id: str, item_id: str, member_id: str):
    if invalid_tab_id(tab_id): return None
    item_ref = tabs_collection.document(tab_id).collection("items").document(item_id)
    item_doc = item_ref.get()
    if item_doc.exists:
        current_members = item_doc.to_dict().get("members", [])
        updated_members = [m for m in current_members if m.get("id") != member_id]
        item_ref.update({"members": updated_members})

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
    _, doc_ref = tabs_collection.document(tab_id).collection("members").add(member)
    return doc_ref.id

def set_member_online_status(tab_id: str, member_id: str, status: bool):
    if invalid_tab_id(tab_id): return None
    member_ref = tabs_collection.document(tab_id).collection("members").document(member_id)
    print("status", status)
    member_ref.update({"online": status})

def remove_member_from_tab(tab_id: str, member_id: str):
    if invalid_tab_id(tab_id): return None
    tabs_collection.document(tab_id).collection("members").document(member_id).delete()

def get_members_in_tab(tab_id: str):
    if invalid_tab_id(tab_id): return None
    members = tabs_collection.document(tab_id).collection("members").get()
    return [{"id": member.id, **member.to_dict()} for member in members] if members else None

def get_one_member(tab_id: str, member_id: str):
    if invalid_tab_id(tab_id): return None
    member_doc = tabs_collection.document(tab_id).collection("members").document(member_id).get()
    return member_doc.to_dict()

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

def get_member_share(tab_id: str, member_id: str):
    if invalid_tab_id(tab_id): return None
    member = tabs_collection.document(tab_id).collection("members").document(member_id).get()
    if member.exists:
        return member.to_dict().get("share", 0)
    return 0

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

def get_payment_info(tab_id: str):
    if invalid_tab_id(tab_id): return None
    tab = tabs_collection.document(tab_id).get()
    if tab.exists:
        return tab.to_dict().get("payment_info", 0)
    return 0

def get_owner_name(tab_id: str):
    if invalid_tab_id(tab_id): return None
    tab = tabs_collection.document(tab_id).get()
    return tab.to_dict().get("owner_name", "")

def member_exists(tab_id: str, member_id: str):
    if invalid_tab_id(tab_id): return None
    member = tabs_collection.document(tab_id).collection("members").document(member_id).get()
    return member.exists

def set_stripe_account_id(tab_id: str, stripe_account_id: str):
    if invalid_tab_id(tab_id): return None
    tab = tabs_collection.document(tab_id)
    tab.update({"owner_stripe_id": stripe_account_id})
    return tab_id

def get_stripe_account_id(tab_id: str):
    if invalid_tab_id(tab_id): return None
    tab = tabs_collection.document(tab_id).get()
    return tab.to_dict().get("owner_stripe_id", 0)

def update_member_name(tab_id: str, member_id: str, name: str, is_owner: bool):
    if invalid_tab_id(tab_id): return None
    if is_owner:
        tab = tabs_collection.document(tab_id)
        tab.update({"owner_name": name})
    member = tabs_collection.document(tab_id).collection("members").document(member_id)
    member.update({"name": name})
    return tab_id
