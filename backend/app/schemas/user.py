from pydantic import BaseModel, ConfigDict


class UserBase(BaseModel):
    username: str


class UserCreate(UserBase):
    password: str


class User(UserCreate):
    id: int
    disabled: bool
    role: str
 
    model_config = ConfigDict(from_attributes=True)

class UserGet(BaseModel):
    id: int
    username: str
    password_hash: str = ""
    disabled: bool
    role: str

class UserUpdate(BaseModel):
    username: str | None = None
    password: str | None = None
    disabled: bool | None = None
    role: str | None = None