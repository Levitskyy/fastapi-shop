import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select

from app.models.brands import Brand
from app.models.categories import Category
from app.models.products import Product
from app.schemas.product import ProductBase, ProductNew, ProductUpdate

from app.database import SessionDep
from app.auth.utils import RoleChecker
from app.models.user import User

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
router = APIRouter()

@router.get('/search')
async def get_specific_products(
    db: SessionDep,
    title: str = "",
    limit: int = 50,
    skip: int = 0,
    ) -> list[ProductBase]:
    query = select(Product).where(func.lower(Product.title).like(f"%{title.lower()}%")).limit(limit).offset(skip)
    result = (await db.execute(query)).scalars().all()
    products = [ProductBase.model_validate(product) for product in result]
    logger.info(title.lower())
    return products

@router.post('/new')
async def add_new_product(
    product: ProductNew, 
    db: SessionDep,
    user: Annotated[User, Depends(RoleChecker(['admin', 'manager']))]
    ) -> int:
    query = select(Category).where(Category.title==product.category.title)
    db_category = (await db.execute(query)).scalar_one_or_none()
    if not db_category:
        raise HTTPException(status_code=404, detail='Запрошенная категория не найдена')
    
    query = select(Brand).where(Brand.title==product.brand.title)
    db_brand = (await db.execute(query)).scalar_one_or_none()
    if not db_brand:
        raise HTTPException(status_code=404, detail='Запрошенный бренд не найден')
    
    db_product = Product(
        title=product.title,
        description=product.description,
        category_id=db_category.id,
        brand_id=db_brand.id,
        )

    db.add(db_product)
    await db.commit()
    await db.refresh(db_product)

    return db_product.id

@router.delete('/{title}')
async def delete_product(
    title: str, 
    db: SessionDep,
    user: Annotated[User, Depends(RoleChecker(['admin', 'manager']))]
    ) -> int:
    query = select(Product).where(Product.title==title)
    db_product = (await db.execute(query)).scalar_one_or_none()

    if not db_product:
        raise HTTPException(status_code=404, detail='Запрошенный продукт не найден')
    
    id = db_product.id
    await db.delete(db_product)
    await db.commit()
    return id

@router.patch('/{title}')
async def update_product(
    title: str, 
    product_update: ProductUpdate, 
    db: SessionDep,
    user: Annotated[User, Depends(RoleChecker(['admin', 'manager']))],
    ) -> ProductBase:
    query = select(Product).where(Product.title==title)
    db_product = (await db.execute(query)).scalar_one_or_none()

    if not db_product:
        raise HTTPException(status_code=404, detail='Запрошенный продукт не найден')
    
    for attr, val in product_update.model_dump().items():
        if val is not None:
            setattr(db_product, attr, val)
    
    await db.commit()
    await db.refresh(db_product)

    return db_product

@router.get('/buy/{id}')
async def buy_product(
    id: int,
    db: SessionDep,
    user: Annotated[User, Depends(RoleChecker(['admin', 'manager', 'user']))],
):
    pass
