from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware

from backend.models import product, categorie, user
from backend.database import engine, Base
 
from backend.routers import auth
from backend.routers import product
from backend.routers import categorie
from backend.routers import cart
from backend.routers import order
from backend.routers import user

app = FastAPI()

# Tạo các bảng trong cơ sở dữ liệu nếu chưa có
Base.metadata.create_all(bind=engine)

# Middleware cho Google OAuth (bắt buộc)
app.add_middleware(SessionMiddleware, secret_key="supersecretkey123")

# CORS cho React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend chạy ở đây
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(product.router)
app.include_router(categorie.router)
app.include_router(cart.router)
app.include_router(order.router)

