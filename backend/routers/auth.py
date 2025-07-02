from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse

from backend.schemas.user import UserCreate, UserOut, Token
from backend.models.user import User
from backend.utils.auth import get_password_hash, verify_password, create_access_token
from backend.database import get_db
from backend.dependencies.auth import get_current_user
from ..utils.email import send_login_notification
import os

from authlib.integrations.starlette_client import OAuth

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Cấu hình OAuth Google
oauth = OAuth()
oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    access_token_url="https://accounts.google.com/o/oauth2/token",
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    api_base_url="https://www.googleapis.com/oauth2/v1/",
    authorize_params={"access_type": "offline"},
    client_kwargs={"scope": "email profile"},
)

# ------------------ Google Login ------------------

@router.get("/google-login")
async def google_login(request: Request):
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/google-callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    token = await oauth.google.authorize_access_token(request)
    resp = await oauth.google.get("userinfo", token=token)
    user_info = resp.json()

    email = user_info.get("email")
    name = user_info.get("name")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(username=name, email=email, hashed_password="google_oauth")
        db.add(user)
        db.commit()
        db.refresh(user)

    #  Gửi email thông báo
    # await send_login_notification(email, name)
        
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Tài khoản đã bị vô hiệu hóa")

    access_token = create_access_token(data={"sub": user.username})
    return RedirectResponse(url=f"http://localhost:3000/login?token={access_token}")


# Đăng ký Facebook OAuth
oauth.register(
    name="facebook",
    client_id=os.getenv("FACEBOOK_CLIENT_ID"),
    client_secret=os.getenv("FACEBOOK_CLIENT_SECRET"),
    access_token_url="https://graph.facebook.com/v10.0/oauth/access_token",
    authorize_url="https://www.facebook.com/v10.0/dialog/oauth",
    api_base_url="https://graph.facebook.com/v10.0/",
    client_kwargs={"scope": "email"},
)

@router.get("/facebook-login")
async def facebook_login(request: Request):
    redirect_uri = "http://localhost:8000/auth/facebook-callback"
    return await oauth.facebook.authorize_redirect(request, redirect_uri)

@router.get("/facebook-callback")
async def facebook_callback(request: Request, db: Session = Depends(get_db)):
    token = await oauth.facebook.authorize_access_token(request)
    resp = await oauth.facebook.get("me?fields=id,name,email", token=token)
    user_info = resp.json()

    email = user_info.get("email")
    name = user_info.get("name")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(username=name, email=email, hashed_password="facebook_oauth")
        db.add(user)
        db.commit()
        db.refresh(user)
    
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Tài khoản đã bị vô hiệu hóa")

    access_token = create_access_token(data={"sub": user.username})
    return RedirectResponse(url=f"http://localhost:3000/login?token={access_token}")


# ------------------ Đăng ký ------------------

@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Tên đăng nhập đã tồn tại")
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email đã tồn tại")
    hashed_password = get_password_hash(user.password)
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        role="user"  # mặc định là user
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# ------------------ Đăng nhập ------------------

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Sai thông tin đăng nhập")

    # Gửi email thông báo (nếu bạn bật)
    # await send_login_notification(user.email, user.username)
    
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Tài khoản đã bị vô hiệu hóa")

    access_token = create_access_token(data={"sub": user.username, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

# ------------------ Lấy thông tin cá nhân ------------------

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# ------------------ API chỉ cho Admin ------------------

@router.get("/admin")
def get_admin_data(current_user: User = Depends(get_current_user)):
    print("ROLE FROM DB:", current_user.role)
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Không đủ quyền truy cập")
    return {"message": "Bạn là admin, truy cập thành công!"}
