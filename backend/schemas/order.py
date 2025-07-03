from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum
 

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
class OrderStatus(str, Enum):
    pending = "pending"
    paid = "paid"
    shipped = "shipped"
    completed = "completed"
    canceled = "canceled"
    cancel_requested = "cancel_requested"
    return_requested = "return_requested"
    returned = "returned"

class OrderOut(BaseModel):
    id: int
    user_id: int
    status: OrderStatus  
    created_at: datetime
    total_amount: float
    receiver_name: str
    receiver_phone: str
    shipping_address: str
    items: List[OrderItemOut]


    class Config:
        from_attributes = True
