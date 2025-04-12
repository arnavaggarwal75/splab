from app.db import db
from app.utils import generate_unique_tab_id
import random
import string

tabs_collection = db.collection("Tabs")

def create_tab(tab_id: str):
    pass

def get_tab(tab_id: str):
    pass

def delete_tab(tab_id: str):
    pass

def add_items_to_tab(tab_id: str, name: str, price: float, members: dict):
    """Add an item to a tab with associated member contributions."""

def get_items_in_tab(tab_id: str) -> list:
    """Retrieve all items in a tab."""

def update_item_members(tab_id: str, item_id: str, members: dict):
    """Update the members/contributions for an item."""

def add_member_to_tab(tab_id: str, name: str, payment_id: str):
    """Add a new member to the tab."""

def get_members_in_tab(tab_id: str) -> list:
    """Return a list of members in a tab."""

def mark_member_submitted(tab_id: str, member_id: str):
    """Mark a member as done selecting items."""

def mark_member_paid(tab_id: str, member_id: str):
    """Mark a member as having paid."""

def update_member_share(tab_id: str, member_id: str, share: float):
    """Update a member's share of the tab."""