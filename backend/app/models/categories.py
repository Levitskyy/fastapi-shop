from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import mapped_column, Mapped, relationship
from app.models.base import Base

if TYPE_CHECKING:
    from app.models.products import Product

class Category(Base):
    __tablename__ = 'Categories'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(64), unique=True, index=True)

    # relationships
    products: Mapped[list["Product"]] = relationship(back_populates='category')