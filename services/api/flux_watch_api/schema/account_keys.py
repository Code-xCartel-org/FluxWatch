from datetime import datetime

from sqlalchemy import TIMESTAMP, Boolean, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from flux_watch_api.schema.account import AccountORM
from flux_watch_api.schema.utils.base import Base


class AccountApiKeyORM(Base):
    __tablename__ = "account_api_key"

    account_id: Mapped[int] = mapped_column(ForeignKey("account.id"), unique=True, nullable=False)
    api_key: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    ttl: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), nullable=False)
    usage_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_used_at: Mapped[datetime | None] = mapped_column(TIMESTAMP(timezone=True), nullable=True)
    usage_window_start: Mapped[datetime | None] = mapped_column(
        TIMESTAMP(timezone=True), nullable=True
    )
    daily_limit: Mapped[int] = mapped_column(Integer, default=1000, nullable=False)

    account: Mapped[AccountORM] = relationship("AccountORM", back_populates="api_key")
