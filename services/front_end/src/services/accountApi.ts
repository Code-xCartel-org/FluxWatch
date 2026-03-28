import {baseApi} from "./baseApi.ts";
import {API_ENDPOINTS, HTTP_METHODS} from "@/constants/api.ts";
import {setUser} from "@/store/slices/userSlice.ts";
import type {Account} from "@/models/auth.ts";

export const accountApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSelf: builder.query<Account, void>({
            query: () => ({
                url: API_ENDPOINTS.ACCOUNT.SELF,
                method: HTTP_METHODS.GET,
            }),
            async onQueryStarted(_args, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(setUser(data));
                } catch (error) {
                    console.error("Failed to fetch account:", error);
                }
            },
        }),
    }),
});

export const {useGetSelfQuery} = accountApi;
