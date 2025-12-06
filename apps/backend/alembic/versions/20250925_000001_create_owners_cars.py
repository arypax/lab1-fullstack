from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "20250925_000001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("username", sa.String(length=150), nullable=False, unique=True),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=32), nullable=False),
    )
    op.create_table(
        "owners",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("firstname", sa.String(length=100), nullable=False),
        sa.Column("lastname", sa.String(length=100), nullable=False),
    )

    op.create_table(
        "cars",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("brand", sa.String(length=100), nullable=False),
        sa.Column("model", sa.String(length=100), nullable=False),
        sa.Column("color", sa.String(length=50), nullable=False),
        sa.Column("registration_number", sa.String(length=50), nullable=False, unique=True),
        sa.Column("model_year", sa.Integer(), nullable=False),
        sa.Column("price", sa.Numeric(12, 2), nullable=False),
        sa.Column("owner_id", sa.Integer(), sa.ForeignKey("owners.id", ondelete="CASCADE"), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("users")
    op.drop_table("cars")
    op.drop_table("owners")


