"""Adding user to a file

Revision ID: 7dbd0c6c9d86
Revises: 17567ba964d7
Create Date: 2024-01-22 20:51:51.300986

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7dbd0c6c9d86'
down_revision: Union[str, None] = '17567ba964d7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
