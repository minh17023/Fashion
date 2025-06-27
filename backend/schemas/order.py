from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
 

class OrderCreate(BaseModel):
    receiver_name: str
    receiver_phone: str
    shipping_address: str

class OrderItemOut(BaseModel):
    id: int
    product_id: int
    order_id: int
    quantity: int
    price: float

    class Config:
        from_attributes = True

class OrderOut(BaseModel):
    id: int
    user_id: int
    status: str
    created_at: datetime
    total_amount: float
    receiver_name: str
    receiver_phone: str
    shipping_address: str
    items: List[OrderItemOut]

    class Config:
        from_attributes = True
