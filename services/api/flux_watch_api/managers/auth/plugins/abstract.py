import abc

from flux_watch_api.schema import AccountSessionORM
from flux_watch_api.utils.auth import AuthUser


class Plugin(abc.ABC):
    @abc.abstractmethod
    def authenticate(self, auth_user: AuthUser) -> AccountSessionORM:
        raise NotImplementedError

    @abc.abstractmethod
    def extract(self, cred: str):
        raise NotImplementedError
