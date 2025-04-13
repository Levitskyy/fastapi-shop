import logging
from typing import Annotated

from app.auth.utils import RoleChecker
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select

from app.models.brands import Brand
from app.schemas.product import BrandBase, BrandUpdate

from app.database import SessionDep
from app.models.user import User

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
router = APIRouter()

@router.get('/all')
async def get_all_brands(
    db: SessionDep,
    ) -> list[BrandBase]:
    query = select(Brand)
    result = (await db.execute(query)).scalars().all()
    brands = [BrandBase.model_validate(brand) for brand in result]

    return brands

@router.post('/new')
async def add_new_brand(
    brand: BrandBase, 
    db: SessionDep,
    user: Annotated[User, Depends(RoleChecker(['admin', 'manager']))]
    ) -> int:
    db_brand = Brand(**brand.model_dump())
    db.add(db_brand)
    await db.commit()
    await db.refresh(db_brand)

    return db_brand.id

@router.delete('/{title}')
async def delete_brand(
    title: str, 
    db: SessionDep,
    user: Annotated[User, Depends(RoleChecker(['admin', 'manager']))]
    ) -> int:
    query = select(Brand).where(Brand.title==title)
    db_brand = (await db.execute(query)).scalar_one_or_none()

    if not db_brand:
        raise HTTPException(status_code=404, detail='Запрошенный бренд не найден')
    
    id = db_brand.id
    await db.delete(db_brand)
    await db.commit()
    return id

@router.patch('/{title}')
async def update_brand(
    title: str, 
    brand_update: BrandUpdate, 
    db: SessionDep,
    user: Annotated[User, Depends(RoleChecker(['admin', 'manager']))]
    ) -> BrandBase:
    query = select(Brand).where(Brand.title==title)
    db_brand = (await db.execute(query)).scalar_one_or_none()

    if not db_brand:
        raise HTTPException(status_code=404, detail='Запрошенный бренд не найден')
    
    for attr, val in brand_update.model_dump().items():
        if val is not None:
            setattr(db_brand, attr, val)
    
    await db.commit()
    await db.refresh(db_brand)

    return db_brand
