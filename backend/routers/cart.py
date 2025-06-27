from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from backend.database import get_db
from backend.models.cart import Cart
from backend.models.cartitem import CartItem
from backend.models.user import User
from backend.schemas.cart import CartOut, CartItemCreate  
from backend.dependencies.auth import get_current_user

router = APIRouter(prefix="/cart", tags=["Cart"])


@router.get("/me", response_model=CartOut)
def get_my_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cart = (
        db.query(Cart)
        .options(joinedload(Cart.items).joinedload(CartItem.product))
        .filter(Cart.user_id == current_user.id)
        .first()
    )
    if not cart:
        cart = Cart(user_id=current_user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart


@router.post("/add", response_model=CartOut)
def add_to_cart(
    item: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cart = (
        db.query(Cart)
        .options(joinedload(Cart.items).joinedload(CartItem.product))
        .filter(Cart.user_id == current_user.id)
        .first()
    )
    if not cart:
        cart = Cart(user_id=current_user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)

    existing_item = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.product_id == item.product_id
    ).first()

    if existing_item:
        existing_item.quantity += item.quantity
    else:
        new_item = CartItem(
            cart_id=cart.id,
            product_id=item.product_id,
            quantity=item.quantity
        )
        db.add(new_item)

    db.commit()
    db.refresh(cart)
    return cart


@router.put("/item/{item_id}", response_model=CartOut)
def update_item_quantity(
    item_id: int,
    item: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cart_item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Item not found")

    cart = (
        db.query(Cart)
        .options(joinedload(Cart.items).joinedload(CartItem.product))
        .filter(Cart.id == cart_item.cart_id, Cart.user_id == current_user.id)
        .first()
    )

    cart_item.quantity = item.quantity
    db.commit()
    db.refresh(cart)
    return cart


@router.delete("/item/{item_id}", response_model=CartOut)
def remove_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cart_item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Item not found")

    cart = (
        db.query(Cart)
        .options(joinedload(Cart.items).joinedload(CartItem.product))
        .filter(Cart.id == cart_item.cart_id, Cart.user_id == current_user.id)
        .first()
    )

    db.delete(cart_item)
    db.commit()
    db.refresh(cart)
    return cart


@router.delete("/clear", response_model=CartOut)
def clear_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cart = (
        db.query(Cart)
        .options(joinedload(Cart.items).joinedload(CartItem.product))
        .filter(Cart.user_id == current_user.id)
        .first()
    )
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    for item in cart.items:
        db.delete(item)
    db.commit()
    db.refresh(cart)
    return cart
