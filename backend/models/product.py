from sqlalchemy import Column, Integer, String, Float, ForeignKey
from backend.database import Base
from sqlalchemy.orm import relationship

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    price = Column(Float)
    quantity = Column(Integer)
    categorie_id = Column(Integer, ForeignKey("categories.id"))
    img = Column(String(255), nullable=True)
    cart_items = relationship("CartItem", back_populates="product", cascade="all, delete")