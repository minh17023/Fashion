from pydantic import BaseModel

class ProductBase(BaseModel):
    name: str
    price: float
    quantity: int
    categorie_id: int
    img: str

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Connfig:
        from_attributes = True