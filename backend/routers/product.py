from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import models, schemas
from sqlalchemy import func
import os
import shutil
from datetime import datetime

router = APIRouter(prefix="/products", tags=["Products"])

UPLOAD_DIR = "static/uploads/products"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Search sản phẩm
@router.get("/search", response_model=list[schemas.product.Product])
def search_products(q: str = Query(...), db: Session = Depends(get_db)):
    return db.query(models.product.Product).filter(
        func.lower(models.product.Product.name).like(f"%{q.lower()}%")
    ).all()

# Lấy tất cả sản phẩm
@router.get("/", response_model=list[schemas.product.Product])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.product.Product).all()

# Lấy sản phẩm theo ID
@router.get("/{product_id}", response_model=schemas.product.Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(models.product.Product).filter(
        models.product.Product.id == product_id
    ).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

# Tạo mới sản phẩm
@router.post("/", response_model=schemas.product.Product)
def create_product(
    name: str = Form(...),
    price: int = Form(...),
    quantity: int = Form(...),
    categorie_id: int = Form(...),
    img: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    img_path = ""
    if img:
        filename = f"{datetime.utcnow().timestamp()}_{img.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(img.file, buffer)
        img_path = f"/{file_path.replace(os.sep, '/')}"

    new_product = models.product.Product(
        name=name,
        price=price,
        quantity=quantity,
        categorie_id=categorie_id,
        img=img_path
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

# Cập nhật sản phẩm
@router.put("/{product_id}", response_model=schemas.product.Product)
def put_product(
    product_id: int,
    name: str = Form(...),
    price: int = Form(...),
    quantity: int = Form(...),
    categorie_id: int = Form(...),
    img: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    db_product = db.query(models.product.Product).filter(
        models.product.Product.id == product_id
    ).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    db_product.name = name
    db_product.price = price
    db_product.quantity = quantity
    db_product.categorie_id = categorie_id

    if img:
        filename = f"{datetime.utcnow().timestamp()}_{img.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(img.file, buffer)
        db_product.img = f"/{file_path.replace(os.sep, '/')}"

    db.commit()
    db.refresh(db_product)
    return db_product

# Xóa sản phẩm
@router.delete("/{product_id}")
def del_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(models.product.Product).filter(
        models.product.Product.id == product_id
    ).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted"}

# Lấy sản phẩm theo danh mục
@router.get("/category/{categorie_id}", response_model=list[schemas.product.Product])
def get_products_by_category(categorie_id: int, db: Session = Depends(get_db)):
    return db.query(models.product.Product).filter(
        models.product.Product.categorie_id == categorie_id
    ).all()
