from sqlalchemy import func, select

from flux_watch_api.database.query_builder.base import QueryFeature
from flux_watch_api.database.query_builder.processor import Pagination, Sorting


class QueryBuilder:
    """
    Executes feature pipeline + applies result shaping (sorting & pagination)
    """

    def __init__(self, schema_cls, **kwargs):
        self.schema = schema_cls(**kwargs)
        self.sorting = Sorting()
        self.pagination = Pagination()

    def _build_base(self):
        query = None
        for feature in self.schema.features:
            if not isinstance(feature, QueryFeature):
                raise TypeError(f"Feature {feature} is not a QueryFeature")
            query = feature.apply(query, self.schema)
        return query

    def build(self, paginate: bool = True, sort: bool = True, with_counts: bool = False):
        base_query = self._build_base()
        model = self.schema.model
        params = self.schema.params

        data_query = base_query

        if sort:
            data_query = self.sorting.apply(
                query=data_query,
                model=model,
                params=params,
                default_ordering=getattr(self.schema, "default_ordering", None),
            )

        if paginate:
            data_query = self.pagination.apply(
                query=data_query,
                params=params,
                max_page_size=getattr(self.schema, "max_page_size", None),
            )

        count_query = None
        if with_counts:
            count_query = select(func.count()).select_from(base_query.subquery())

        return data_query, count_query
