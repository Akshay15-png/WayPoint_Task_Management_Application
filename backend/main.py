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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


class regUser(BaseModel):
    name: str
    email: str
    passwd: str

class loginUser(BaseModel):
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

# Registration
@app.post("/auth/register")
def user_register(user: regUser, db: Session = Depends(get_db)):
    try:
        def pass_to_hash():
            user_pass=user.passwd
            pass_bytes=user_pass.encode('utf-8')
            salt=bcrypt.gensalt()
            pass_hash=bcrypt.hashpw(pass_bytes,salt)
            return pass_hash.decode("utf-8")

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

# login
@app.post("/auth/login")
def user_login(user: loginUser, db: Session = Depends(get_db)):
    try:
        existing_user = (
            db.query(UserModel)
            .filter(UserModel.email == user.email)
            .first()
        )

        if not existing_user:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        password_matches = bcrypt.checkpw(
            user.passwd.encode("utf-8"),
            existing_user.password_hash.encode("utf-8")
        )

        if not password_matches:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        # return {
        #     "message": "Login successful",
        #     "user_id": existing_user.id,
        #     "username": existing_user.username,
        #     "email": existing_user.email
        # }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Login failed: {str(e)}"
        )
