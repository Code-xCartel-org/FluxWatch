from datetime import datetime, timezone

from flux_watch_api.core.base_repository import Repository
from flux_watch_api.errors.rest_errors import NotFoundError, UnauthorizedError
from flux_watch_api.managers.auth.plugins.abstract import Plugin
from flux_watch_api.models.auth import Scheme
from flux_watch_api.models.common import AccountSearch
from flux_watch_api.models.user import AuthUser
from flux_watch_api.schema import AccountORM, AccountSessionORM
from flux_watch_api.utils.auth import AuthUtils
from flux_watch_api.utils.utilities import extract_auth_user


class TokenPlugin(Plugin):
    def __init__(self, repo: Repository, auth_utils: AuthUtils):
        super().__init__()
        self._handler = repo
        self._auth_utils = auth_utils

    def authenticate(self, auth_user: AuthUser, **kwargs) -> AccountSessionORM:
        try:
            account: AccountORM = self._handler.get_one(
                AccountSearch, {"principal": auth_user.principal}
            )
        except NotFoundError as e:
            raise UnauthorizedError("Invalid credentials") from e

        if not account.is_active and not kwargs.get("skip_active_check", False):
            raise UnauthorizedError(detail="account is not active")

        if len(account.sessions) < 1:
            raise UnauthorizedError("Session not found")

        active_sessions = [s for s in account.sessions if not s.expired]

        current_session = next(
            (s for s in active_sessions if str(s.id) == auth_user.credentials), None
        )

        if not current_session:
            raise UnauthorizedError("Session not found")

        if not hasattr(current_session, "ttl"):
            self._handler.delete_one(current_session)
            raise UnauthorizedError("Invalid session")

        if current_session.ttl <= datetime.now(timezone.utc):
            self._handler.delete_one(current_session)
            raise UnauthorizedError("Session expired")

        return self._auth_utils.make_session(account=account)

    def extract(self, cred: str) -> AuthUser:
        return extract_auth_user(scheme=Scheme.TOKEN, encoded=cred)
