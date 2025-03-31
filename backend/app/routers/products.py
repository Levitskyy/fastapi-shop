

import logging
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.brands import Brand
from app.models.categories import Category
from app.models.images import Image
from app.models.products import Product
from app.models.user import User


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
router = APIRouter()

@router.get('/all')
async def get_all_products(
    db: Annotated[AsyncSession, Depends(get_db)],
):
    query = select(Product)
    res = (await db.execute(query)).scalars.all()
    
    return res

@router.get('/cat')
async def get_all_categories(
    db: Annotated[AsyncSession, Depends(get_db)],
):
    query = select(Category)
    res = (await db.execute(query)).scalars.all()
    
    return res

@router.get('/brand')
async def get_all_brands(
    db: Annotated[AsyncSession, Depends(get_db)],
):
    query = select(Brand)
    res = (await db.execute(query)).scalars.all()
    
    return res

@router.get('/image')
async def get_all_images(
    db: Annotated[AsyncSession, Depends(get_db)],
):
    query = select(Image)
    res = (await db.execute(query)).scalars.all()
    
    return res

@router.get('/user')
async def get_all_users(
    db: Annotated[AsyncSession, Depends(get_db)],
):
    query = select(User)
    res = (await db.execute(query)).scalars.all()
    
    return res