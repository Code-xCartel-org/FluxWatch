from sqlalchemy.dialects.postgresql import TEXT
from sqlalchemy.orm import Mapped, mapped_column

from flux_watch_api.schema.utils.meta import MetaFields


class ParentMixin:
    parent: Mapped[str] = mapped_column(MetaFields.PARENT, TEXT, index=True, nullable=False)
