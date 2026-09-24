from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Date
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    status = Column(String(20), nullable=False, default="todo")
    due_date = Column(Date, nullable=True)
    priority = Column(String(20), nullable=False, default="medium")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    completed_at = Column(DateTime, nullable=True)