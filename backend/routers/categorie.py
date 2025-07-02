from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import models, schemas

router = APIRouter(prefix="/categories", tags=["Categories"])

# Lấy tất cả danh mục
@router.get("/", response_model=list[schemas.categorie.Categorie])
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.categorie.Category).all()

# Lấy danh mục theo ID
@router.get("/{categorie_id}", response_model=schemas.categorie.Categorie)
def get_categorie(categorie_id: int, db: Session = Depends(get_db)):
    categorie = db.query(models.categorie.Category).filter(models.categorie.Category.id == categorie_id).first()
    if not categorie:
        raise HTTPException(status_code=404, detail="Categorie not found")
    return categorie

# Thêm danh mục mới
@router.post("/", response_model=schemas.categorie.Categorie)
def post_categorie(categorie: schemas.categorie.CategorieCreate, db: Session = Depends(get_db)):
    db_categorie = models.categorie.Category(**categorie.dict())
    db.add(db_categorie)
    db.commit()
    db.refresh(db_categorie)
    return db_categorie

# Cập nhật danh mục
@router.put("/{categorie_id}", response_model=schemas.categorie.Categorie)
def update_categorie(categorie_id: int, categorie: schemas.categorie.CategorieCreate, db: Session = Depends(get_db)):
    db_categorie = db.query(models.categorie.Category).filter(models.categorie.Category.id == categorie_id).first()
    if not db_categorie:
        raise HTTPException(status_code=404, detail="Categorie not found")
    
    for key, value in categorie.dict().items():
        setattr(db_categorie, key, value)

    db.commit()
    db.refresh(db_categorie)
    return db_categorie

# Xóa danh mục nếu không bị ràng buộc với sản phẩm
@router.delete("/{categorie_id}")
def delete_categorie(categorie_id: int, db: Session = Depends(get_db)):
    # Kiểm tra danh mục có đang được dùng không
    used = db.query(models.product.Product).filter_by(categorie_id=categorie_id).first()
    if used:
        raise HTTPException(status_code=400, detail="Danh mục này đang được sử dụng bởi sản phẩm, không thể xóa.")

    categorie = db.query(models.categorie.Category).filter_by(id=categorie_id).first()
    if not categorie:
        raise HTTPException(status_code=404, detail="Danh mục không tồn tại.")

    db.delete(categorie)
    db.commit()
    return {"message": "Xóa danh mục thành công"}
