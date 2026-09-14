from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name:str
    price:float
    availablity:bool | None = None


@app.get("/")
def read_root():
    return {"Status": "200"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}

@app.put("/additem")
def add_item(item_id: int, item: Item ):
    return {"item_id": item_id, "item_name": item.name}