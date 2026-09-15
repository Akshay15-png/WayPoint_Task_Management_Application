from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import SessionLocal, engine, Base
from models import User as UserModel

import bcrypt


app = FastAPI()

# CORS basic initialization
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


class User(BaseModel):
    name: str
    email: str
    passwd: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"Status": "200"}


@app.post("/auth/register")
def user_register(user: User, db: Session = Depends(get_db)):
    try:
        def pass_to_hash():
            user_pass=user.passwd
            pass_bytes=user_pass.encode('utf-8')
            salt=bcrypt.gensalt()
            pass_hash=bcrypt.hashpw(pass_bytes,salt)
            return pass_hash

        new_user = UserModel(
            username=user.name,
            email=user.email,
            password_hash=pass_to_hash()
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "message": "User registered successfully",
            # "user_id": new_user.id,
            "username": new_user.username,
            "email": new_user.email
        }

    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"User registration failed: {str(e)}"
        )