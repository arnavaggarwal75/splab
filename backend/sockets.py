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

    await sio.enter_room(sid, code)

@sio.event
async def message(sid, data):
    print(f"[Socket.IO] Message from {sid}: {data}")
    await sio.emit("response", {"data": "Message received"}, to=sid)

@sio.event
async def disconnect(sid):
    print(f"[Socket.IO] Client disconnected: {sid}")

# ASGI app to mount into FastAPI
socket_app = socketio.ASGIApp(sio)
