from enum import StrEnum


class Scheme(StrEnum):
    RESIDENT = "Resident"
    TOKEN = "Token"
    API_KEY = "ApiKey"


class LogoutScope(StrEnum):
    ALL = "all"
    CURRENT = "current"
