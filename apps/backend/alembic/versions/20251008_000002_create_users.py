from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "20251008_000002"
down_revision = "20250925_000001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Проверяем, существует ли таблица
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    tables = inspector.get_table_names()
    
    if "users" not in tables:
        op.create_table(
            "users",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("username", sa.String(length=150), nullable=False, unique=True),
            sa.Column("password_hash", sa.String(length=255), nullable=False),
            sa.Column("role", sa.String(length=32), nullable=False),
        )


def downgrade() -> None:
    op.drop_table("users")


