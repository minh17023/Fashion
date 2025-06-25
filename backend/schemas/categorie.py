from pydantic import BaseModel

class CategorieBase(BaseModel):
    name: str

class CategorieCreate(CategorieBase):
    pass

class Categorie(CategorieBase):
    id: int

    class Config:
        from_attributes = True