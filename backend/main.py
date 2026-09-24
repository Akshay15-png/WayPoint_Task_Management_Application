from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from datetime import datetime, date, timezone, timedelta
from database import SessionLocal, engine, Base
from models import User as UserModel
from models import Task as TaskModel
from auth import create_access_token, get_current_user_id

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

class createTasks(BaseModel):
    title:str
    description:str
    priority:str="medium"
    dueDate:date|None=None
    status: str = "todo"

class updateTasks(BaseModel): 
    title: str | None = None 
    description: str | None = None 
    priority: str | None = None 
    dueDate: date | None = None 
    status: str | None = None

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

        access_token = create_access_token(existing_user.id)

        return {
            "message": "Login successful",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": existing_user.id,
                "username": existing_user.username,
                "email": existing_user.email
            }
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Login failed: {str(e)}"
        )

# Get Task
@app.get("/tasks")
def get_tasks(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    try:
        tasks = (
            db.query(TaskModel)
            .filter(TaskModel.user_id == user_id)
            .all()
        )

        return [
            {
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "status": task.status,
                "priority": task.priority,
                "dueDate": task.due_date,
                "createdAt": task.created_at,
                "updatedAt": task.updated_at,
                "userId": task.user_id
            }
            for task in tasks
        ]

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch tasks: {str(e)}"
        )

# Post Task
@app.post("/tasks")
def post_task(
    task: createTasks,
    user_id: int = Depends(get_current_user_id), 
    db: Session = Depends(get_db)):
    try:

        new_task = TaskModel(
            title=task.title,
            description=task.description,
            priority=task.priority,
            due_date=task.dueDate,
            user_id=user_id
            
        )

        db.add(new_task)
        db.commit()
        db.refresh(new_task)

        return {
            "message": "New task created successfully",
            "user_id": new_task.user_id,
            # "username": new_user.username,
            "task": new_task.title,
            "priority": new_task.priority,
            "dueDate": new_task.due_date
        }

    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Task creation failed: {str(e)}"
        )

# Patch Task
@app.patch("/tasks/{task_id}")
def update_task(
    task_id: int,
    task: updateTasks,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    try:
        existing_task = (
            db.query(TaskModel)
            .filter(
                TaskModel.id == task_id,
                TaskModel.user_id == user_id
            )
            .first()
        )

        if not existing_task:
            raise HTTPException(
                status_code=404,
                detail="Task not found"
            )

        if task.title is not None:
            existing_task.title = task.title

        if task.description is not None:
            existing_task.description = task.description

        if task.priority is not None:
            existing_task.priority = task.priority

        if task.dueDate is not None:
            existing_task.due_date = task.dueDate

        if task.status is not None:
            existing_task.status = task.status

            if task.status == "done":
                existing_task.completed = True
                existing_task.completed_at = datetime.now(timezone.utc)
            else:
                existing_task.completed = False
                existing_task.completed_at = None
            

        db.commit()
        db.refresh(existing_task)

        return {
            "message": "Task updated successfully",
            "task": {
                "id": existing_task.id,
                "title": existing_task.title,
                "description": existing_task.description,
                "status": existing_task.status,
                # "completed": existing_task.completed,
                "priority": existing_task.priority,
                "dueDate": existing_task.due_date,
                "createdAt": existing_task.created_at,
                "updatedAt": existing_task.updated_at,
                "userId": existing_task.user_id
            }
        }

    except HTTPException:
        raise

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Task update failed: {str(e)}"
        )

# Delete Task
@app.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
    ):
    try:
        existing_task = (
            db.query(TaskModel)
            .filter(
                TaskModel.id == task_id,
                TaskModel.user_id == user_id
            )
            .first()
        )

        if not existing_task:
            raise HTTPException(
                status_code=404,
                detail="Task not found"
            )

        db.delete(existing_task)
        db.commit()

        return {
            "message": "Task Deleted successfully",
            "task": {
                "id": task_id,
            }
        }

    except HTTPException:
        raise

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Task update failed: {str(e)}"
        )   


#Analytic summary section
@app.get("/analytics/summary")
def analytics_summary(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    try:
        tasks = (
            db.query(TaskModel)
            .filter(TaskModel.user_id == user_id)
            .all()
        )

        total_tasks = len(tasks)

        completed_tasks = sum(
            1 for task in tasks
            if task.status == "done"
        )

        remaining_tasks = total_tasks - completed_tasks

        completed_dates = [
        task.completed_at
        for task in tasks
        if task.status == "done" and task.completed_at is not None
        ]

        # calculation of streaks
        def calculate_streaks(completed_dates):
            if not completed_dates:
                return 0, 0

            # Convert timestamps into unique calendar dates
            dates = sorted({
                dt.date()
                for dt in completed_dates
            })

            # Best streak
            best = 1
            current_run = 1

            for i in range(1, len(dates)):
                if dates[i] - dates[i - 1] == timedelta(days=1):
                    current_run += 1
                else:
                    current_run = 1

                best = max(best, current_run)

            # Current streak
            today = datetime.now(timezone.utc).date()

            date_set = set(dates)

            if today in date_set:
                current = 0
                day = today

                while day in date_set:
                    current += 1
                    day -= timedelta(days=1)

            elif today - timedelta(days=1) in date_set:
                current = 0
                day = today - timedelta(days=1)

                while day in date_set:
                    current += 1
                    day -= timedelta(days=1)

            else:
                current = 0

            return current, best
        current_streak, best_streak = calculate_streaks(completed_dates)
        
        # calculation of last 24h
        def calculate_last24h(completed_dates):
            now = datetime.now(timezone(timedelta(hours=5, minutes=30)))

            buckets = [0] * 8

            for completed_at in completed_dates:
                # Your database stores completed_at as a naive UTC datetime
                if completed_at.tzinfo is None:
                    completed_at = completed_at.replace(tzinfo=timezone(timedelta(hours=5, minutes=30)))

                hours_ago = (now - completed_at).total_seconds() / 3600

                if 0 <= hours_ago <= 24:
                    bucket_index = min(7, int(hours_ago // 3))
                    buckets[7 - bucket_index] += 1

            result = []

            for i in range(8):
                bucket_time = now - timedelta(hours=(7 - i) * 3)

                result.append({
                    "label": bucket_time.strftime("%-I %p"),
                    "completed": buckets[i]
                })

            return result
        last24h = calculate_last24h(completed_dates)

        # calculation of weekly completed tasks
        def calculate_weekly(completed_dates):
            ist = timezone(timedelta(hours=5, minutes=30))
            now = datetime.now(ist)
            today = now.date()

            result = []

            for i in range(6, -1, -1):
                day = today - timedelta(days=i)

                count = 0

                for completed_at in completed_dates:
                    if completed_at.tzinfo is None:
                        completed_at = completed_at.replace(tzinfo=ist)

                    if completed_at.astimezone(ist).date() == day:
                        count += 1

                result.append({
                    "label": day.strftime("%a"),
                    "date": day.isoformat(),
                    "completed": count
                })

            return result
        weekly = calculate_weekly(completed_dates)

        # calculation of monthly completed tasks
        def calculate_monthly(completed_dates):
            ist = timezone(timedelta(hours=5, minutes=30))
            now = datetime.now(ist)
            today = now.date()

            result = []

            for i in range(5, -1, -1):
                week_end = today - timedelta(days=i * 7)
                week_start = week_end - timedelta(days=6)

                count = 0

                for completed_at in completed_dates:
                    if completed_at.tzinfo is None:
                        completed_at = completed_at.replace(tzinfo=ist)

                    completed_date = completed_at.astimezone(ist).date()

                    if week_start <= completed_date <= week_end:
                        count += 1

                result.append({
                    "label": f"{week_start.month}/{week_start.day}",
                    "completed": count
                })

            return result
        monthly = calculate_monthly(completed_dates)



        return {
            "totalTasks": total_tasks,
            "completedTasks": completed_tasks,
            "remainingTasks": remaining_tasks,
            "currentStreak": current_streak,
            "bestStreak": best_streak,
            "last24h": last24h,
            "weekly": weekly,
            "monthly": monthly,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analytics calculation failed: {str(e)}"
        )
