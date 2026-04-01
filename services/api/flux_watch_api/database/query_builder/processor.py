class Sorting:
    def __init__(self, param_name: str = "order"):
        self.param_name = param_name

    def apply(self, query, model, params, default_ordering=None):
        raw = getattr(params, self.param_name, None)

        fields = raw.split(",") if raw else (default_ordering or [])
        if not fields:
            return query

        for field in fields:
            desc = field.startswith("-")
            name = field[1:] if desc else field

            column = getattr(model, name, None)
            if column is not None:
                query = query.order_by(column.desc() if desc else column.asc())

        return query


class Pagination:
    def __init__(self, page_param="page", size_param="page_size"):
        self.page_param = page_param
        self.size_param = size_param

    def apply(self, query, params, max_page_size=None):
        page = getattr(params, self.page_param, 1)
        size = getattr(params, self.size_param, 20)

        if max_page_size:
            size = min(size, max_page_size)

        offset = (page - 1) * size
        return query.offset(offset).limit(size)
