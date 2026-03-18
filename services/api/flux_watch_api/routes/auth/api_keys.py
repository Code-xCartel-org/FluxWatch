from fastapi import APIRouter, Depends

from flux_watch_api.models.account import ApiKey
from flux_watch_api.models.response_schema import KeyResponse
from flux_watch_api.repository.auth.api_keys import ApiKeysRepository

api_key_router = APIRouter()


@api_key_router.get("/generate", tags=["key_gen"])
def generate_new_key(ak_repo: ApiKeysRepository = Depends()):
    key = ak_repo.generate_new_key()
    return KeyResponse(key=key)


@api_key_router.get("", tags=["get_key"], response_model=ApiKey | None)
def get_key(ak_repo: ApiKeysRepository = Depends()):
    return ak_repo.get_key()
