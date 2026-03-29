import {baseApi} from "./baseApi.ts";
import {API_ENDPOINTS, HTTP_METHODS} from "@/constants/api.ts";
import type {Account} from "@/models/auth.ts";

export const accountApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSelf: builder.query<Account, void>({
            query: () => ({
                url: API_ENDPOINTS.ACCOUNT.SELF,
                method: HTTP_METHODS.GET,
            }),
        }),
    }),
});

export const {useGetSelfQuery} = accountApi;
