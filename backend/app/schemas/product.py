from pydantic import BaseModel, ConfigDict

class CategoryBase(BaseModel):
    title: str
    
    model_config = ConfigDict(from_attributes=True)

class CategoryUpdate(CategoryBase):
    pass

class BrandBase(BaseModel):
    title: str
    
    model_config = ConfigDict(from_attributes=True)

class BrandUpdate(BrandBase):
    pass

class ImageBase(BaseModel):
    product_id: int
    path: str
    model_config = ConfigDict(from_attributes=True)

class ImageUpdate(BaseModel):
    product_id: int | None = None
    path: str | None = None

class ProductNew(BaseModel):
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
    category: CategoryBase | None = None
    brand: BrandBase | None = None
