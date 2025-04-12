import socketio
from urllib.parse import parse_qs

# Create a Socket.IO server instance
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=["http://localhost:5173"]
)

@sio.event
async def connect(sid, environ):
    query_string = environ.get('QUERY_STRING', '')
    params = parse_qs(query_string)
    code = params.get('code', [None])[0]
    code = params.get('member_id', [None])[0]

    await sio.enter_room(sid, code)

@sio.event
async def disconnect(sid):
    print(f"[Socket.IO] Client disconnected: {sid}")

@sio.event
async def submit(sid):
    print(f"[Socket.IO] {sid} has finished their selections")

@sio.event
async def update_checkbox(sid, data):
    print(f"[Socket.IO] {sid} is updating checkbox with data: {data}")

# ASGI app to mount into FastAPI
socket_app = socketio.ASGIApp(sio)
