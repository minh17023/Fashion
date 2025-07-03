from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload
from backend.database import get_db
from backend.models.order import Order
from backend.models.orderitem import OrderItem
from backend.models.cart import Cart
from backend.models.cartitem import CartItem
from backend.models.product import Product
from backend.schemas.order import OrderCreate, OrderOut, OrderStatus
from backend.dependencies.auth import get_current_user, get_current_admin
from backend.models.user import User


router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("/", response_model=OrderOut)
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cart = (
        db.query(Cart)
        .options(joinedload(Cart.items).joinedload(CartItem.product))
        .filter(Cart.user_id == current_user.id)
        .first()
    )

    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Giỏ hàng trống")

    for item in cart.items:
        if not item.product:
            raise HTTPException(
                status_code=400,
                detail=f"Sản phẩm ID {item.product_id} không tồn tại"
            )

    total = sum(item.quantity * item.product.price for item in cart.items)

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

@router.post("/buy-now", response_model=OrderOut)
def buy_now(
    product_id: int = Query(...),
    quantity: int = Query(1),
    order_data: OrderCreate = Depends(),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại")

    if quantity < 1:
        raise HTTPException(status_code=400, detail="Số lượng không hợp lệ")

    order = Order(
        user_id=current_user.id,
        status="pending",
        total_amount=quantity * product.price,
        receiver_name=order_data.receiver_name,
        receiver_phone=order_data.receiver_phone,
        shipping_address=order_data.shipping_address,
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    order_item = OrderItem(
        order_id=order.id,
        product_id=product.id,
        quantity=quantity,
        price=product.price,
    )
    db.add(order_item)
    db.commit()
    db.refresh(order)

    return order

@router.get("/me", response_model=list[OrderOut])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    orders = (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )
    return orders

@router.get("/all", response_model=list[OrderOut])
def get_all_orders(db: Session = Depends(get_db)):
    orders = (
        db.query(Order)
        .options(joinedload(Order.items))
        .order_by(Order.created_at.desc())
        .all()
    )
    return orders


# -------------------------- USER ACTIONS ---------------------------

@router.post("/{order_id}/pay")
def user_pay_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Đơn hàng không tồn tại")

    if order.status != OrderStatus.pending:
        raise HTTPException(status_code=400, detail="Chỉ đơn hàng đang chờ xử lý mới được thanh toán")

    order.status = OrderStatus.paid
    db.commit()
    return {"message": "Thanh toán thành công"}

@router.post("/{order_id}/confirm")
def confirm_received(order_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Đơn hàng không tồn tại")
    if order.status != OrderStatus.shipped:
        raise HTTPException(status_code=400, detail="Chỉ có thể xác nhận khi đơn đang giao")
    order.status = OrderStatus.completed
    db.commit()
    return {"message": "Đã xác nhận đã nhận hàng."}

@router.post("/{order_id}/cancel")
def request_cancel(
    order_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Đơn hàng không tồn tại")
    
    if order.status != OrderStatus.pending:
        raise HTTPException(status_code=400, detail="Chỉ có thể yêu cầu hủy đơn khi đang chờ xử lý")

    order.status = OrderStatus.cancel_requested
    db.commit()
    return {"message": "Đã yêu cầu hủy đơn hàng."}

@router.post("/{order_id}/return")
def request_return(order_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Đơn hàng không tồn tại")
    if order.status != OrderStatus.completed:
        raise HTTPException(status_code=400, detail="Chỉ có thể yêu cầu hoàn hàng sau khi đơn đã hoàn tất")
    order.status = OrderStatus.return_requested
    db.commit()
    return {"message": "Đã yêu cầu hoàn trả đơn hàng."}

# -------------------------- ADMIN ACTIONS ---------------------------

@router.post("/{order_id}/accept-cancel")
def admin_accept_cancel(order_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Đơn hàng không tồn tại")
    if order.status != OrderStatus.cancel_requested:
        raise HTTPException(status_code=400, detail="Đơn hàng không có yêu cầu hủy")
    order.status = OrderStatus.canceled
    db.commit()
    return {"message": "Đã hủy đơn hàng."}

@router.post("/{order_id}/ship")
def admin_ship_order(order_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Đơn hàng không tồn tại")
    if order.status != OrderStatus.paid:
        raise HTTPException(status_code=400, detail="Chỉ có thể chuyển sang đang giao khi đã thanh toán")
    order.status = OrderStatus.shipped
    db.commit()
    return {"message": "Đơn hàng đang được giao."}

@router.post("/{order_id}/accept-return")
def admin_accept_return(order_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Đơn hàng không tồn tại")
    if order.status != OrderStatus.return_requested:
        raise HTTPException(status_code=400, detail="Đơn hàng không có yêu cầu hoàn trả")
    order.status = OrderStatus.returned
    db.commit()
    return {"message": "Đã xác nhận hoàn trả đơn hàng."}

@router.get("/stats")
def get_order_stats(db: Session = Depends(get_db)):
    # Doanh số bán = tổng tiền của các đơn đã thanh toán/thành công/giao hàng
    sales_statuses = [
        OrderStatus.paid,
        OrderStatus.shipped,
        OrderStatus.completed,
    ]
    sales = (
        db.query(Order)
        .filter(Order.status.in_(sales_statuses))
        .all()
    )
    total_sales = sum(o.total_amount for o in sales)

    # Doanh số hoàn trả = tổng tiền của các đơn hoàn trả
    returned_orders = (
        db.query(Order)
        .filter(Order.status == OrderStatus.returned)
        .all()
    )
    returned_sales = sum(o.total_amount for o in returned_orders)

    return {
        "total_sales": total_sales,
        "canceled_sales": returned_sales  # ✅ Đổi key để frontend không cần sửa
    }
