"""Doing the initial catchup

Revision ID: d9073a7afbb7
Revises: 
Create Date: 2024-01-23 22:19:11.408921

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd9073a7afbb7'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password_hash', sa.String(length=256), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('conversation',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('last_updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('document',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('file_name', sa.String(length=255), nullable=True),
    sa.Column('content_type', sa.String(length=255), nullable=True),
    sa.Column('file_size', sa.Integer(), nullable=True),
    sa.Column('s3_file_name', sa.String(length=255), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('message',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('content', sa.String(length=1280), nullable=False),
    sa.Column('role', sa.String(length=128), nullable=False),
    sa.Column('conversation_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['conversation_id'], ['conversation.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('message')
    op.drop_table('document')
    op.drop_table('conversation')
    op.drop_table('user')
    # ### end Alembic commands ###
