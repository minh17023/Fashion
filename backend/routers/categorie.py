from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import models, schemas

# khởi tạo router với endpoint /users
router = APIRouter(prefix="/categories", tags=["Categories"]) 

@router.get("/", response_model= list[schemas.categorie.Categorie])
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.categorie.Category).all()

@router.get("/{categorie_id}", response_model= schemas.categorie.Categorie)
def get_categorie(categorie_id : int, db: Session = Depends(get_db)):
    categorie = db.query(models.categorie.Category).filter(models.categorie.Category.id == categorie_id).first()
    if not categorie:
        raise HTTPException(status_code=404, detail="Categorie not found")
    
@router.post("/", response_model= schemas.categorie.Categorie)
def post_categorie(categorie: schemas.categorie.CategorieCreate, db: Session= Depends(get_db)):
    db_categorie = models.categorie.Category(**categorie.dict())
    db.add(db_categorie)
    db.commit()
    db.refresh(db_categorie)
    return db_categorie

@router.put("/{categorie_id}", response_model= schemas.categorie.Categorie)
def update_categorie(categorie_id: int, categorie: schemas.categorie.CategorieCreate, db: Session = Depends(get_db)):
    db_categorie = db.query(models.categorie.Category).filter(models.categorie.Category.id == categorie_id).first()
    if not db_categorie:
        raise HTTPException(status_code=404, detail="categorie not found")
    for key, value in categorie.dict().items():
        setattr(db_categorie, key, value)
    db.commit()
    db.refresh(db_categorie)
    return db_categorie

@router.delete("/{categorie_id}")
def delete_categorie(categorie_id: int, db: Session= Depends(get_db)):
    db_categorie = db.query(models.categorie.Category).filter(models.categorie.Category.id == categorie_id).first()
    if not db_categorie:
        raise HTTPException(status_code=404, detail="categories not found")
    db.delete(db_categorie)
    db.commit()
    return {"message": "Delete thanh cong"}