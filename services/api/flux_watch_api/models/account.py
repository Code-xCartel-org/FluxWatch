import datetime
import re
from uuid import UUID

from pydantic import Field, field_validator

from flux_watch_api.models.base import APIModel
from flux_watch_api.utils.auth import AuthUtils

EMAIL_REGEX = re.compile(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")


class AccountCreate(APIModel):
    name: str
    email: str
    password: str = Field(..., min_length=8, max_length=64)

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = v.strip().lower()

        if not EMAIL_REGEX.match(v):
            raise ValueError("Invalid email address")

        return v


class Account(APIModel):
    id: UUID
    name: str
    principal: str
    is_active: bool
    is_locked: bool
    failed_login_attempts: int


class AccountSession(APIModel):
    access_token: str | None
    ttl: datetime.datetime
    account: Account

    def enrich(self, session, auth_utils: AuthUtils):
        self.access_token = auth_utils.make_token(_id=session.id, account=session.account)
        return self
