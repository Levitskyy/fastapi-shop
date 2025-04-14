import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select

from app.schemas.product import PurchaseBase

from app.database import SessionDep
from app.auth.utils import RoleChecker
from app.models.user import User
from app.models.products import Purchase

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
    purchases = [PurchaseBase.model_validate(purchase) for purchase in result]

    return purchases

@router.post('/buy/{id}')
async def buy_product(
    id: int,
    db: SessionDep,
    user: Annotated[User, Depends(RoleChecker(['admin', 'manager', 'user']))],
) -> bool:
    new_purchase = Purchase(product_id=id, user_id=user.id)
    
    db.add(new_purchase)
    await db.commit()
    await db.refresh(new_purchase)
    return True

@router.delete('/{id}')
async def delete_purchase(
    id: int,
    db: SessionDep,
    user: Annotated[User, Depends(RoleChecker(['admin', 'manager']))],
) -> bool:
    query = select(Purchase).where(Purchase.id==id)
    result = (await db.execute(query)).scalar_one_or_none()

    if not result:
        raise HTTPException(status_code=404, detail='Запрошенная покупка не найдена')
    
    db.delete(result)
    await db.commit()
    return True