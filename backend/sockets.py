import socketio

# Create a Socket.IO server instance
sio = socketio.AsyncServer(async_mode='asgi')

@sio.event
async def connect(sid, environ):
    print(f"[Socket.IO] Client connected: {sid}")

@sio.event
async def message(sid, data):
    print(f"[Socket.IO] Message from {sid}: {data}")
    await sio.emit("response", {"data": "Message received"}, to=sid)

@sio.event
async def disconnect(sid):
    print(f"[Socket.IO] Client disconnected: {sid}")

# ASGI app to mount into FastAPI
socket_app = socketio.ASGIApp(sio)
