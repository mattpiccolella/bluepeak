"""Updating file name property

Revision ID: 9b3f8adb8eb3
Revises: d1d75df9ceb0
Create Date: 2024-01-22 20:18:53.112604

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9b3f8adb8eb3'
down_revision: Union[str, None] = 'd1d75df9ceb0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
