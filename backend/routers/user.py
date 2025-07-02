from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import models, schemas

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=list[schemas.user.UserOut])
def get_all_users(db: Session = Depends(get_db)):
    return db.query(models.user.User).all()


@router.get("/{user_id}", response_model=schemas.user.UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.user.User).filter(models.user.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/", response_model=schemas.user.UserOut)
def create_user(user: schemas.user.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.user.User).filter(models.user.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = models.user.User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


from fastapi import Body

@router.put("/{user_id}", response_model=schemas.user.UserOut)
def update_user(user_id: int, data: schemas.user.UserUpdate = Body(...), db: Session = Depends(get_db)):
    user = db.query(models.user.User).filter(models.user.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Cập nhật từng trường nếu được gửi từ frontend
    if data.role is not None:
        user.role = data.role

    if data.is_active is not None:
        user.is_active = data.is_active

    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.user.User).filter(models.user.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    return {"message": "User deleted successfully"}
