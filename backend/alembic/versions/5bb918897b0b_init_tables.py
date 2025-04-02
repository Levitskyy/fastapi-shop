"""Init tables

Revision ID: 5bb918897b0b
Revises: 
Create Date: 2025-04-02 05:40:52.005307

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5bb918897b0b'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('Brands',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('title', sa.String(length=64), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_Brands_title'), 'Brands', ['title'], unique=True)
    op.create_table('Categories',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('title', sa.String(length=64), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_Categories_title'), 'Categories', ['title'], unique=True)
    op.create_table('Images',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('path', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('RefreshTokens',
    sa.Column('jti', sa.String(), nullable=False),
    sa.Column('username', sa.String(length=64), nullable=False),
    sa.Column('expiration_date', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.Column('disabled', sa.Boolean(), nullable=False),
    sa.PrimaryKeyConstraint('jti')
    )
    op.create_index(op.f('ix_RefreshTokens_jti'), 'RefreshTokens', ['jti'], unique=False)
    op.create_index(op.f('ix_RefreshTokens_username'), 'RefreshTokens', ['username'], unique=False)
    op.create_table('Users',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('username', sa.String(length=64), nullable=False),
    sa.Column('password_hash', sa.String(), nullable=False),
    sa.Column('role', sa.String(), nullable=False),
    sa.Column('disabled', sa.Boolean(), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_Users_id'), 'Users', ['id'], unique=False)
    op.create_index(op.f('ix_Users_username'), 'Users', ['username'], unique=True)
    op.create_table('Products',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('title', sa.String(length=64), nullable=False),
    sa.Column('description', sa.String(), nullable=False),
    sa.Column('category_id', sa.Integer(), nullable=False),
    sa.Column('brand_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['brand_id'], ['Brands.id'], ),
    sa.ForeignKeyConstraint(['category_id'], ['Categories.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_Products_title'), 'Products', ['title'], unique=True)
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_Products_title'), table_name='Products')
    op.drop_table('Products')
    op.drop_index(op.f('ix_Users_username'), table_name='Users')
    op.drop_index(op.f('ix_Users_id'), table_name='Users')
    op.drop_table('Users')
    op.drop_index(op.f('ix_RefreshTokens_username'), table_name='RefreshTokens')
    op.drop_index(op.f('ix_RefreshTokens_jti'), table_name='RefreshTokens')
    op.drop_table('RefreshTokens')
    op.drop_table('Images')
    op.drop_index(op.f('ix_Categories_title'), table_name='Categories')
    op.drop_table('Categories')
    op.drop_index(op.f('ix_Brands_title'), table_name='Brands')
    op.drop_table('Brands')
    # ### end Alembic commands ###
