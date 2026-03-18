from datetime import datetime, timezone

import bcrypt

from flux_watch_api.core.base_repository import Repository
from flux_watch_api.database.query_builder.base import QueryModel
from flux_watch_api.database.query_builder.features import FilterFeature, ModelFeature
from flux_watch_api.errors.rest_errors import TooManyRequestsError, UnauthorizedError
from flux_watch_api.managers.auth.plugins.abstract import Plugin
from flux_watch_api.models.auth import Scheme
from flux_watch_api.models.user import AuthUser
from flux_watch_api.schema import AccountApiKeyORM, AccountSessionORM
from flux_watch_api.utils.auth import AuthUtils
from flux_watch_api.utils.utilities import key_auth_user


class KeySearch(QueryModel):
    features = [
        ModelFeature(AccountApiKeyORM),
        FilterFeature("is_active"),
    ]


class KeyPlugin(Plugin):
    def __init__(self, repo: Repository, auth_utils: AuthUtils):
        super().__init__()
        self._handler = repo
        self._auth_utils = auth_utils

    def authenticate(self, auth_user: AuthUser, **kwargs) -> AccountSessionORM:
        now = datetime.now(timezone.utc)

        candidates, _ = self._handler.get_many(KeySearch, {"is_active": True})

        key = None
        for key_obj in candidates:
            if bcrypt.checkpw(auth_user.credentials.encode(), key_obj.api_key.encode()):
                key = key_obj

        if not key:
            raise UnauthorizedError("Invalid credentials")

        if not key.is_active:
            raise UnauthorizedError("Account key is inactive")

        if not self._auth_utils.validate_password(auth_user.credentials, key.api_key):
            raise UnauthorizedError(detail="Invalid credentials")

        if key.ttl < now:
            raise UnauthorizedError(detail="Account key has expired")

        if not key.usage_window_start or key.usage_window_start.date() != now.date():
            key.usage_window_start = now
            key.usage_count = 0

        if key.usage_count >= key.daily_limit:
            raise TooManyRequestsError(detail="Account key has exceeded daily limit")

        key.usage_count += 1
        key.last_used_at = now

        return self._auth_utils.make_session(account=key.account)

    def extract(self, cred: str) -> AuthUser:
        return key_auth_user(scheme=Scheme.API_KEY, encoded=cred)
