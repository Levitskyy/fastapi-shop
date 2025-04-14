from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import mapped_column, Mapped, relationship
from app.models.base import Base



if TYPE_CHECKING:
    from app.models.brands import Brand
    from app.models.categories import Category
    from app.models.images import Image
    from backend.app.models.user import User


class Product(Base):
    __tablename__ = 'Products'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    description: Mapped[str] = mapped_column(nullable=False)
    category_id: Mapped[int] = mapped_column(ForeignKey('Categories.id'))
    brand_id: Mapped[int] = mapped_column(ForeignKey('Brands.id'))

    # relationships
    images: Mapped[list["Image"]] = relationship(back_populates='product', lazy="selectin", cascade='all, delete-orphan', passive_deletes=True)
    category: Mapped["Category"] = relationship(back_populates='products', lazy="joined")
    brand: Mapped["Brand"] = relationship(back_populates='products', lazy="joined")
    purchases: Mapped[list["Purchase"]] = relationship(back_populates='product', lazy='selectin', cascade='all, delete-orphan', passive_deletes=True)

class Purchase(Base):
    __tablename__ = 'Purchases'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    product_id: Mapped[int] = mapped_column(ForeignKey('Products.id'))
    user_id: Mapped[int] = mapped_column(ForeignKey('Users.id'))

    # relationships
    product: Mapped["Product"] = relationship(back_populates='purchases', lazy='joined')
    user: Mapped["User"] = relationship(back_populates='purchases', lazy='joined')