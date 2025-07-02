from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import models, schemas
from sqlalchemy import func


router = APIRouter(prefix="/products", tags=["Products"])


@router.get("/search", response_model=list[schemas.product.Product])
def search_products(q: str = Query(...), db: Session = Depends(get_db)):
    return db.query(models.product.Product).filter(
        func.lower(models.product.Product.name).like(f"%{q.lower()}%")
    ).all()


@router.get("/", response_model=list[schemas.product.Product])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.product.Product).all()


@router.get("/{product_id}", response_model=schemas.product.Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(models.product.Product).filter(
        models.product.Product.id == product_id
    ).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product


@router.post("/", response_model=schemas.product.Product)
def create_product(
    data: schemas.product.ProductBase = Body(...),
    db: Session = Depends(get_db)
):
    new_product = models.product.Product(
        name=data.name,
        price=data.price,
        quantity=data.quantity,
        categorie_id=data.categorie_id,
        img=data.img  # base64 string
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product


@router.put("/{product_id}", response_model=schemas.product.Product)
def put_product(product_id: int, product: schemas.product.Product, db: Session = Depends(get_db)):
    db_product = db.query(models.product.Product).filter(
        models.product.Product.id == product_id
    ).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in product.dict().items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product


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


@router.get("/category/{categorie_id}", response_model=list[schemas.product.Product])
def get_products_by_category(categorie_id: int, db: Session = Depends(get_db)):
    return db.query(models.product.Product).filter(
        models.product.Product.categorie_id == categorie_id
    ).all()
