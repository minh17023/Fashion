from pydantic import BaseModel, Field
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserOut(UserBase):
    id: int
    role: Optional[str]
    is_active: Optional[bool] = True

class UserUpdate(BaseModel):
    role: Optional[str] = Field(default=None)
    is_active: Optional[bool] = Field(default=None)
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
