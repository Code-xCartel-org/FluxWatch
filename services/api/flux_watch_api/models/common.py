from flux_watch_api.database.query_builder.base import ParamsBase, QueryModel
from flux_watch_api.database.query_builder.features import FilterFeature, ModelFeature
from flux_watch_api.schema import AccountORM


class AccountSearch(QueryModel):
    class Params(ParamsBase):
        principal: str

    params: Params

    features = [
        ModelFeature(AccountORM),
        FilterFeature("principal"),
    ]
