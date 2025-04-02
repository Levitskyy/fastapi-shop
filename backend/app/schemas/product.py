from pydantic import BaseModel, ConfigDict

class CategoryBase(BaseModel):
    title: str
    
    model_config = ConfigDict(from_attributes=True)

class BrandBase(BaseModel):
    title: str
    
    model_config = ConfigDict(from_attributes=True)

class ImageBase(BaseModel):
    path: str
    
    model_config = ConfigDict(from_attributes=True)

class ProductBase(BaseModel):
    title: str
    description: str
    category: CategoryBase
    brand: BrandBase
    images: list[ImageBase]
    
    model_config = ConfigDict(from_attributes=True)

