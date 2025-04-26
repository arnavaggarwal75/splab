import socketio
from urllib.parse import parse_qs
from app.db import (
    add_item_members,
    remove_item_members,
    get_members_in_item,
    update_member_share,
    get_member_share,
    get_item_cost,
    get_members_in_tab,
    mark_member_submitted,
    member_exists,
    set_member_online_status,
    get_total_tax,
    get_subtotal,
    update_member_tip,
    increase_total_tip,
)

# Create a Socket.IO server instance
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=["http://localhost:5173", "http://10.20.89.2:5173"]
)

sid_associations = {}

@sio.event
async def connect(sid, environ):
    query_string = environ.get('QUERY_STRING', '')
    params = parse_qs(query_string)
    tab_id = params.get('tab_id', [None])[0]
    member_id = params.get('member_id', [None])[0] 
    print(f"[Socket.IO] tab_id: {tab_id} member_id: {member_id}")
    if not member_exists(tab_id, member_id):
        print(f"A socket connection was attempted with a nonexistant user... not returning...")
        return
    print(f"Member id {member_id} connected to socket for tab {tab_id}")
    sid_associations[sid] = (tab_id, member_id)
    set_member_online_status(tab_id, member_id, True)
    await sio.enter_room(sid, tab_id) 

@sio.event
async def disconnect(sid):
    if sid not in sid_associations: return
    tab_id, member_id = sid_associations[sid]
    set_member_online_status(tab_id, member_id, False)
    del sid_associations[sid]
    print(f"[Socket.IO] Client disconnected: {sid}")

@sio.event
async def submit(sid, data):
    tab_id = data.get("tab_id")
    member_id = data.get("member_id")
    tip = data.get("tip") if data.get("tip") != "" else 0

    mark_member_submitted(tab_id, member_id)
    print(f"[Socket.IO] {sid} finished checking their items.")
    update_member_tip(tab_id, member_id, tip if tip != None else 0)
    increase_total_tip(tab_id, tip if tip != None else 0)

    members = get_members_in_tab(tab_id)    
    allSubmitted = all(member.get("submitted") for member in members)
    if allSubmitted: 
        print("All members have submitted their items.")
        await sio.emit("all_submitted", {"tab_id": tab_id}, room=tab_id)

@sio.event
async def update_checkbox(sid, data):
    print(f"[Socket.IO] {sid} is updating checkbox with data: {data}")
    tab_id = data.get("tab_id")
    item_id = data.get("item_id")
    member_id = data.get("member_id")
    checked = data.get("checked")
    member_name = data.get("member_name")
    # update checkbox
    if checked:
        add_item_members(tab_id, item_id, member_id, member_name)
    else:
        remove_item_members(tab_id, item_id, member_id)
    members_to_update = [m.get("id") for m in get_members_in_item(tab_id, item_id)]
    num_members = len(members_to_update)
    item_cost = get_item_cost(tab_id, item_id)
    total_tax = get_total_tax(tab_id)
    subtotal = get_subtotal(tab_id)
    if checked:
        for member in members_to_update:
            share = get_member_share(tab_id, member)
            if member_id == member: # increase share
                share += item_cost / num_members
            else: # decrease share
                share -= item_cost / (num_members - 1)
                share += item_cost / num_members
            tax = share / subtotal * total_tax
            update_member_share(tab_id, member, share, tax)
    else: # checkbox was unchecked
        for member in members_to_update:
            share = get_member_share(tab_id, member)
            share -= item_cost / (num_members + 1)
            share += item_cost / num_members
            tax = share / subtotal * total_tax
            update_member_share(tab_id, member, share, tax)
        share = get_member_share(tab_id, member_id)
        share -= item_cost / (num_members + 1)
        tax = share / subtotal * total_tax
        update_member_share(tab_id, member_id, share, tax)

# ASGI app to mount into FastAPI
socket_app = socketio.ASGIApp(sio)
