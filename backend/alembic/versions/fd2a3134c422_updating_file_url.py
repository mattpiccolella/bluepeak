"""Updating file url

Revision ID: fd2a3134c422
Revises: 9b3f8adb8eb3
Create Date: 2024-01-22 20:19:25.709202

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fd2a3134c422'
down_revision: Union[str, None] = '9b3f8adb8eb3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
