import logging
import shutil
from typing import Annotated
import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from sqlalchemy import select

from app.auth.utils import RoleChecker
from app.models.images import Image
from app.models.products import Product
from app.models.user import User
from app.schemas.product import ImageBase, ImageUpdate

from app.database import SessionDep

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
router = APIRouter()

@router.get('/all')
async def get_all_images(db: SessionDep) -> list[ImageBase]:
    query = select(Image)
    result = (await db.execute(query)).scalars().all()
    images = [ImageBase.model_validate(image) for image in result]

    return images

@router.delete('/{path}')
async def delete_image(
    path: str, 
    db: SessionDep,
    user: Annotated[User, Depends(RoleChecker(['admin', 'manager']))]
    ) -> int:
    query = select(Image).where(Image.path==path)
    db_image = (await db.execute(query)).scalar_one_or_none()

    if not db_image:
        raise HTTPException(status_code=404, detail='Запрошенное изображение не найдено')
    
    id = db_image.id
    await db.delete(db_image)
    await db.commit()
    return id

@router.patch('/{path}')
async def update_image(
    path: str, 
    image_update: ImageUpdate, 
    db: SessionDep,
    user: Annotated[User, Depends(RoleChecker(['admin', 'manager']))]
    ) -> ImageBase:
    query = select(Image).where(Image.path==path)
    db_image = (await db.execute(query)).scalar_one_or_none()

    if not db_image:
        raise HTTPException(status_code=404, detail='Запрошенное изображение не найдено')
    
    for attr, val in image_update.model_dump().items():
        if val is not None:
            setattr(db_image, attr, val)
    
    await db.commit()
    await db.refresh(db_image)

    return db_image

MAX_FILE_SIZE = 3 * 1024 * 1024

@router.post('/upload')
async def upload_image(
    file: UploadFile,
    product: str, 
    db: SessionDep,
    user: Annotated[User, Depends(RoleChecker(['admin', 'manager']))],
    ) -> ImageBase:
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Неподходящий тип файла. Выберите файл с расширением png или jpg")
    
    if file.size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Файл слишком большой. Максимальный размер 3 МБ")
    
    query = select(Product).where(Product.title==product)
    db_product = (await db.execute(query)).scalar_one_or_none()

    if not db_product:
        raise HTTPException(status_code=404, detail="Несуществующий продукт")

    filename = f"{uuid.uuid4().hex}.{file.filename.split('.')[-1]}"
    filepath = f"/static/images/{filename}"

    with open(f".{filepath}", "xb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    db_image = Image(path=filepath, product_id=db_product.id)

    db.add(db_image)
    await db.commit()
    await db.refresh(db_image)
    await db.refresh(db_product)

    image = ImageBase.model_validate(db_image)

    return image
