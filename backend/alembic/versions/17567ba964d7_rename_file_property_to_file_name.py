"""Rename file property to file name

Revision ID: 17567ba964d7
Revises: fd2a3134c422
Create Date: 2024-01-22 20:27:10.778527

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '17567ba964d7'
down_revision: Union[str, None] = 'fd2a3134c422'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column('document', 's3_url', new_column_name='s3_file_name')

def downgrade() -> None:
    op.alter_column('document', 's3_file_name', new_column_name='s3_url')
