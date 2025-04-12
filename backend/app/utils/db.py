import random
import string
from app.db import db

def generate_unique_tab_id():
    while True:
        letters = ''.join(random.choices(string.ascii_lowercase, k=3))
        digits = ''.join(random.choices(string.digits, k=3))
        tab_id = letters + digits
        doc_ref = db.collection("Tabs").document(tab_id)
        if not doc_ref.get().exists:
            return tab_id
        
def invalid_tab_id(tab_id):
    doc_ref = db.collection("Tabs").document(tab_id)
    return not doc_ref.get().exists