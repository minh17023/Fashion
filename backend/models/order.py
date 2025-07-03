from sqlalchemy import Column, Integer, Float, ForeignKey, Enum, DateTime, String
from sqlalchemy.orm import relationship
from backend.database import Base
import enum
from datetime import datetime

class OrderStatus(str, enum.Enum):
    pending = "pending"                   # Mặc định khi mới đặt
    paid = "paid"                         # Admin xác nhận đơn
    shipped = "shipped"                   # Đơn đang được giao
    completed = "completed"              # Người dùng xác nhận nhận hàng

    cancel_requested = "cancel_requested"  # Người dùng yêu cầu hủy
    canceled = "canceled"                  # Admin xác nhận hủy

    return_requested = "return_requested"  # Người dùng yêu cầu hoàn hàng
    returned = "returned"                  # Admin xác nhận hoàn hàng

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    status = Column(Enum(OrderStatus), default=OrderStatus.pending)
    created_at = Column(DateTime, default=datetime.utcnow)
    total_amount = Column(Float, default=0)
    receiver_name = Column(String(255), nullable=False)
    receiver_phone = Column(String(20), nullable=False)
    shipping_address = Column(String(500), nullable=False)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete")