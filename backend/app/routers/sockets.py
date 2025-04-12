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
)

# Create a Socket.IO server instance
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=["http://localhost:5173"]
)

sid_associations = {}

@sio.event
async def connect(sid, environ):
    # get input from qs
    query_string = environ.get('QUERY_STRING', '')
    params = parse_qs(query_string)
    code = params.get('code', [None])[0]
    member_id = params.get('member_id', [None])[0]

    sid_associations[sid] = (code, member_id)
    add_member_to_tab(code, member_id)
    await sio.enter_room(sid, code)

@sio.event
async def disconnect(sid):
    tab_id, member_id = sid_associations[sid]
    remove_member_from_tab(tab_id, member_id)
    del sid_associations[sid]
    print(f"[Socket.IO] Client disconnected: {sid}")

@sio.event
async def submit(sid):
    tab_id, member_id = sid_associations[sid]
    mark_member_submitted(tab_id, member_id)
    print(f"[Socket.IO] {sid} finished checking their items.")
    members = get_members_in_tab(tab_id)
    allSubmitted = all(member.get("submitted") for member in members)
    if allSubmitted: await sio.emit("all_submitted", {"tab_id": tab_id}, room=tab_id)

@sio.event
async def update_checkbox(sid, data):
    print(f"[Socket.IO] {sid} is updating checkbox with data: {data}")
    # update checkbox
    if(data.checked):
        add_item_members(data.tab_id, data.item_id, data.member_id)
    else:
        remove_item_members(data.tab_id, data.item_id, data.member_id)
    
    # update everyone's total (assume members_to_update is up to date)
    members_to_update = get_members_in_item(data.tab_id, data.item_id)
    for member in members_to_update:
        share = get_member_share(data.tab_id, data.item_id, member)
        share = get_item_cost(data.tab_id, data.item_id) / len(members_to_update)
        update_member_share(data.tab_id, data.item_id, member, share)

# ASGI app to mount into FastAPI
socket_app = socketio.ASGIApp(sio)
