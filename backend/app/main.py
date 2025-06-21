from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import tests
from .routers import ocr
from .routers import sockets
from .routers import tabs

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://192.168.1.75:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"The backend is running unga bunga - 🐒"}

app.include_router(tests.router)
app.include_router(ocr.router)
app.include_router(tabs.router)
app.mount("/socket.io", sockets.socket_app)


