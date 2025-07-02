from pydantic import BaseModel
from typing import Optional

class CategorieBase(BaseModel):
    name: str
    img: Optional[str] = None  

class CategorieCreate(CategorieBase):
    pass

class Categorie(CategorieBase):
    id: int

    class Config:
        from_attributes = True  
