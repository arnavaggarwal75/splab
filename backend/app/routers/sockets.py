import socketio
from urllib.parse import parse_qs
from app.db import (
    add_item_members,
    remove_item_members,
    get_members_in_item,
    update_member_share,
    get_member_share,
    get_item_cost,
    add_member_to_tab,
    remove_member_from_tab,
    get_members_in_tab,
    mark_member_submitted,
    member_exists
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
    code = params.get('code', [None])[0]
    member_name = params.get('memberName', [None])[0]
    is_owner = params.get('isOwner', [None])[0]
    member_id = params.get('memberId', [None])[0]
    payment_info = params.get('paymentInfo', [None])[0]
    member : dict = {
        "name": member_name,
        "paid": False,
        "submitted": False,
        "share": 0.0
    } 
    print(f"Member id {member_id} connected to tab {code} and is the owner: {is_owner}")
    if (is_owner == "false"): 
        member_id = add_member_to_tab(code, member)
        await sio.emit("member_registered", {"member_id": member_id}, to=sid)
    elif (is_owner == "true" and not member_exists(code, member_id)):
        member : dict = {
            "name": member_name,
            "payment_info": payment_info,
            "submitted": False,
            "share": 0.0
        }
        member_id = add_member_to_tab(code, member)
        print("Readding owner to the tab")
        await sio.emit("member_registered", {"member_id": member_id}, to=sid)
    sid_associations[sid] = (code, member_id)
    await sio.enter_room(sid, code) 

@sio.event
async def disconnect(sid):
    # tab_id, member_id = sid_associations[sid]
    # remove_member_from_tab(tab_id, member_id)
    del sid_associations[sid]
    print(f"[Socket.IO] Client disconnected: {sid}")

@sio.event
async def submit(sid, data):
    tab_id, member_id, tip = data.get("tab_id"), data.get("member_id"), data.get("tip") if data.get("tip") != "" else 0
    mark_member_submitted(tab_id, member_id)
    print(f"[Socket.IO] {sid} finished checking their items.")
    oldShare = get_member_share(tab_id, member_id)
    print("old share: ", oldShare, "tip: ", tip, "new share: ", float(oldShare) + float(tip))
    update_member_share(tab_id, member_id, float(oldShare) + float(tip))
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
    if checked:
        for member in members_to_update:
            share = get_member_share(tab_id, member)
            if member_id == member: # increase share
                share += item_cost / num_members
            else: # decrease share
                share -= item_cost / (num_members - 1)
                share += item_cost / num_members
            update_member_share(tab_id, member, round(share, 2))
    else: # checkbox was unchecked
        for member in members_to_update:
            share = get_member_share(tab_id, member)
            share -= item_cost / (num_members + 1)
            share += item_cost / num_members
            update_member_share(tab_id, member, round(share, 2))
        share = get_member_share(tab_id, member_id)
        share -= item_cost / (num_members + 1)
        update_member_share(tab_id, member_id, round(share, 2))

# ASGI app to mount into FastAPI
socket_app = socketio.ASGIApp(sio)
