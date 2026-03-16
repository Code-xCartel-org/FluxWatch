import abc

from flux_watch_api.database.query_builder.base import QueryModel
from flux_watch_api.database.query_builder.features import FilterFeature, ModelFeature
from flux_watch_api.schema import AccountORM, AccountSessionORM
from flux_watch_api.utils.auth import AuthUser


class AccountSearch(QueryModel):
    features = [
        ModelFeature(AccountORM),
        FilterFeature("principal"),
    ]


class Plugin(abc.ABC):
    @abc.abstractmethod
    def authenticate(self, auth_user: AuthUser) -> AccountSessionORM:
        raise NotImplementedError

    @abc.abstractmethod
    def extract(self, cred: str):
        raise NotImplementedError
