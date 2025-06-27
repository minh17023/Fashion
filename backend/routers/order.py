from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.order import Order
from backend.models.orderitem import OrderItem
from backend.models.cart import Cart
from backend.models.cartitem import CartItem
from backend.models.product import Product
from backend.schemas.order import OrderCreate, OrderOut
from backend.dependencies.auth import get_current_user
from backend.models.user import User

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("/", response_model=OrderOut)
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 1. Lấy giỏ hàng của user
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Giỏ hàng trống")

    # 2. Load sản phẩm kèm theo để tránh lỗi item.product = None
    for item in cart.items:
        if not item.product:
            item.product = db.query(Product).filter(Product.id == item.product_id).first()
        if not item.product:
            raise HTTPException(status_code=400, detail=f"Sản phẩm ID {item.product_id} không tồn tại")

    # 3. Tính tổng tiền
    total = sum(item.quantity * item.product.price for item in cart.items)

    # 4. Tạo Order
    order = Order(
        user_id=current_user.id,
        status="pending",
        total_amount=total,
        receiver_name=order_data.receiver_name,
        receiver_phone=order_data.receiver_phone,
        shipping_address=order_data.shipping_address,
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    # 5. Chuyển CartItem sang OrderItem
    for item in cart.items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.product.price
        )
        db.add(order_item)
        db.delete(item)

    db.commit()
    db.refresh(order)
    return order
