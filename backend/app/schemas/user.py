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
