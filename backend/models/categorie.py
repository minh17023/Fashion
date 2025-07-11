from sqlalchemy import Column, Integer, String
from backend.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    img = Column(String(255), nullable=True)