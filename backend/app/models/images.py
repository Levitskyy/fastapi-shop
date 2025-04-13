from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import mapped_column, Mapped, relationship
from app.models.base import Base

if TYPE_CHECKING:
    from app.models.products import Product

class Image(Base):
    __tablename__ = 'Images'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    product_id: Mapped[int] = mapped_column(ForeignKey('Products.id'))
    path: Mapped[str]

    # relationships
    product: Mapped["Product"] = relationship(back_populates='images', lazy='joined')