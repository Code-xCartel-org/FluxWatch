import logging
from abc import ABC, abstractmethod
from typing import ClassVar

from pydantic import BaseModel
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.sql import Select

from flux_watch_api.utils.types import GetTypeHintOf

logger = logging.getLogger(__name__)


class ParamsBase(BaseModel):
    order: str | None = None
    page: int = 1
    page_size: int = 10
    search: str | None = None


class QueryModel:
    params: ParamsBase
    params_cls: ClassVar[type] = GetTypeHintOf("params", or_use_nested_class="Params")

    model: DeclarativeBase

    def __init__(self, *, params_cls=None, **kwargs):
        params_cls = params_cls or self.params_cls
        try:
            self.params = params_cls(**kwargs)
        except TypeError as e:
            logger.error(e)
            raise ValueError(
                f"failed to construct {params_cls.__name__} from {params_cls.__qualname__}: ", e
            ) from e


class QueryFeature(ABC):
    """
    Base class for all domain-level query features.
    """

    @abstractmethod
    def apply(self, query: Select | None, schema: "QueryModel") -> Select:
        """
        query  -> current SQLAlchemy Select (or None if first feature)
        schema -> the QueryModel instance; features read params and store state (e.g. _model) on it
        """
        pass
