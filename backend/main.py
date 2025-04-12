from fastapi import FastAPI
from sockets import socket_app
app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

app.mount("/", socket_app)
