from pydantic import BaseModel, ConfigDict

from app.schemas.user import UserGet

class CategoryBase(BaseModel):
    id: int | None = None
    title: str
    
    model_config = ConfigDict(from_attributes=True)

class CategoryUpdate(CategoryBase):
    pass

class BrandBase(BaseModel):
    id: int | None = None
    title: str
    
    model_config = ConfigDict(from_attributes=True)

class BrandUpdate(BrandBase):
    pass

class ImageBase(BaseModel):
    id: int | None = None
    product_id: int
    path: str
    model_config = ConfigDict(from_attributes=True)

class ImageUpdate(BaseModel):
    product_id: int | None = None
    path: str | None = None

class ProductNew(BaseModel):
    id: int | None = None
    title: str
    description: str
    category: CategoryBase
    brand: BrandBase

class ProductBase(ProductNew):
    images: list[ImageBase]
    
    model_config = ConfigDict(from_attributes=True)

class ProductUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    category_id: int | None = None
    brand_id: int | None = None

class ProductCreate(BaseModel):
    title: str
    description: str
    category: str
    brand: str

class PurchaseBase(BaseModel):
    id: int
    product: ProductBase
    user: UserGet
