from pydantic import BaseModel
from typing import List
from .product import ProductOut  # Đảm bảo bạn đã có ProductOut schema

# Base cho CartItem - dùng khi tạo mới
class CartItemBase(BaseModel):
    product_id: int
    quantity: int

class CartItemCreate(CartItemBase):
    pass

# CartItem dùng để hiển thị (response)
class CartItemOut(CartItemBase):
    id: int
    product: ProductOut  # Liên kết đến sản phẩm (để lấy tên, giá, ảnh,...)

    class Config:
        from_attributes = True

# Giỏ hàng đầy đủ trả về cho frontend
class CartOut(BaseModel):
    id: int
    user_id: int
    items: List[CartItemOut]

    class Config:
        from_attributes = True
