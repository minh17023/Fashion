from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import models, schemas
import os
from uuid import uuid4

router = APIRouter(prefix="/categories", tags=["Categories"])

UPLOAD_DIR = "static/images/categories"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Get all
@router.get("/", response_model=list[schemas.categorie.Categorie])
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.categorie.Category).all()

# Get one
@router.get("/{categorie_id}", response_model=schemas.categorie.Categorie)
def get_categorie(categorie_id: int, db: Session = Depends(get_db)):
    categorie = db.query(models.categorie.Category).filter(models.categorie.Category.id == categorie_id).first()
    if not categorie:
        raise HTTPException(status_code=404, detail="Categorie not found")
    return categorie

# Create
@router.post("/", response_model=schemas.categorie.Categorie)
def post_categorie(
    name: str = Form(...),
    img: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    img_url = ""
    if img:
        ext = os.path.splitext(img.filename)[-1]
        filename = f"{uuid4().hex}{ext}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as f:
            f.write(img.file.read())
        img_url = f"/static/images/categories/{filename}"

    categorie = models.categorie.Category(name=name, img=img_url)
    db.add(categorie)
    db.commit()
    db.refresh(categorie)
    return categorie

# Update
@router.put("/{categorie_id}", response_model=schemas.categorie.Categorie)
def update_categorie(
    categorie_id: int,
    name: str = Form(...),
    img: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    categorie = db.query(models.categorie.Category).filter(models.categorie.Category.id == categorie_id).first()
    if not categorie:
        raise HTTPException(status_code=404, detail="Categorie not found")

    categorie.name = name

    if img:
        ext = os.path.splitext(img.filename)[-1]
        filename = f"{uuid4().hex}{ext}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as f:
            f.write(img.file.read())
        categorie.img = f"/static/images/categories/{filename}"

    db.commit()
    db.refresh(categorie)
    return categorie

# Delete
@router.delete("/{categorie_id}")
def delete_categorie(categorie_id: int, db: Session = Depends(get_db)):
    used = db.query(models.product.Product).filter_by(categorie_id=categorie_id).first()
    if used:
        raise HTTPException(status_code=400, detail="Danh mục này đang được sử dụng bởi sản phẩm, không thể xóa.")

    categorie = db.query(models.categorie.Category).filter_by(id=categorie_id).first()
    if not categorie:
        raise HTTPException(status_code=404, detail="Danh mục không tồn tại.")

    db.delete(categorie)
    db.commit()
    return {"message": "Xóa danh mục thành công"}
