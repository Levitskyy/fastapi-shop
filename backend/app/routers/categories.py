import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select

from app.models.categories import Category
from app.schemas.product import CategoryBase, CategoryUpdate

from app.database import SessionDep
from app.auth.utils import RoleChecker
from app.models.user import User

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
router = APIRouter()

@router.get('/all')
async def get_all_categories(db: SessionDep) -> list[CategoryBase]:
    query = select(Category)
    result = (await db.execute(query)).scalars().all()
    categories = [CategoryBase.model_validate(category) for category in result]

    return categories

@router.post('/new')
async def add_new_category(
    category: CategoryBase, 
    db: SessionDep,
    user: Annotated[User, Depends(RoleChecker(['admin', 'manager']))]
    ) -> int:
    db_category = Category(**category.model_dump())
    db.add(db_category)
    await db.commit()
    await db.refresh(db_category)

    return db_category.id

@router.delete('/{title}')
async def delete_category(
    title: str, 
    db: SessionDep,
    user: Annotated[User, Depends(RoleChecker(['admin', 'manager']))]
    ) -> int:
    query = select(Category).where(Category.title==title)
    db_category = (await db.execute(query)).scalar_one_or_none()

    if not db_category:
        raise HTTPException(status_code=404, detail='Запрошенная категория не найдена')
    
    id = db_category.id
    await db.delete(db_category)
    await db.commit()
    return id

@router.patch('/{title}')
async def update_category(
    title: str, 
    category_update: CategoryUpdate, 
    db: SessionDep,
    user: Annotated[User, Depends(RoleChecker(['admin', 'manager']))]
    ) -> CategoryBase:
    query = select(Category).where(Category.title==title)
    db_category = (await db.execute(query)).scalar_one_or_none()

    if not db_category:
        raise HTTPException(status_code=404, detail='Запрошенная категория не найдена')
    
    for attr, val in category_update.model_dump().items():
        if val is not None:
            setattr(db_category, attr, val)
    
    await db.commit()
    await db.refresh(db_category)

    return db_category
