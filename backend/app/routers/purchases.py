import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select

from app.schemas.product import ProductBase, PurchaseBase

from app.database import SessionDep
from app.auth.utils import RoleChecker
from app.models.user import User
from app.models.products import Purchase
from app.schemas.user import UserGet

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
router = APIRouter()

@router.get('/all')
async def get_all_purchases(
    db: SessionDep,
    user: Annotated[User, Depends(RoleChecker(['admin', 'manager']))]
    ) -> list[PurchaseBase]:
    query = select(Purchase)
    result = (await db.execute(query)).scalars().all()
    purchases = [PurchaseBase(id=purchase.id, 
                              product=ProductBase.model_validate(purchase.product), 
                              user=UserGet(id=purchase.user.id, username=purchase.user.username, disabled=purchase.user.disabled, role=purchase.user.role)) for purchase in result]

    return purchases

@router.get('/one/{id}')
async def get_all_purchases(
    id: int,
    db: SessionDep,
    user: Annotated[User, Depends(RoleChecker(['admin', 'manager']))]
    ) -> PurchaseBase:
    query = select(Purchase).where(Purchase.id==id)
    purchase = (await db.execute(query)).scalar_one_or_none()
    purchase = PurchaseBase(id=purchase.id, 
                              product=ProductBase.model_validate(purchase.product), 
                              user=UserGet(id=purchase.user.id, username=purchase.user.username, disabled=purchase.user.disabled, role=purchase.user.role))

    return purchase

@router.post('/buy/{id}')
async def buy_product(
    id: int,
    db: SessionDep,
    user: Annotated[User, Depends(RoleChecker(['admin', 'manager', 'user']))]
    ) -> None:
    logger.info(user)
    new_purchase = Purchase(product_id=id, user_id=user.id)
    
    db.add(new_purchase)
    await db.commit()
    await db.refresh(new_purchase)

@router.delete('/{id}')
async def delete_purchase(
    id: int,
    db: SessionDep,
    user: Annotated[User, Depends(RoleChecker(['admin', 'manager']))]
    ) -> bool:
    query = select(Purchase).where(Purchase.id==id)
    result = (await db.execute(query)).scalar_one_or_none()

    if not result:
        raise HTTPException(status_code=404, detail='Запрошенная покупка не найдена')
    
    db.delete(result)
    await db.commit()
    return True