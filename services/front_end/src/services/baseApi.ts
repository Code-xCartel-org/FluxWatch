import {
    type BaseQueryFn,
    createApi,
    type FetchArgs,
    fetchBaseQuery,
    type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import {logout} from "@/store/slices/authSlice.ts";
import {clearUser} from "@/store/slices/userSlice.ts";
import {eraseCookie} from "@/utils/cookies";
import {type RootState} from "@/store/store";
import {API_URL} from "@/config.ts";
import {REDUX_IDENTIFIERS} from "@/constants/redux.ts";
import {HEADERS} from "@/constants/headers.ts";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, {getState}) => {
        if (!headers.has(HEADERS.AUTHORIZATION)) {
            const token = (getState() as RootState).auth.token;
            if (token) headers.set(HEADERS.AUTHORIZATION, `${HEADERS.TOKEN} ${token}`);
        }
        return headers;
    },
});

// Interceptor: Catches 401s globally
const baseQueryWithReAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions,
) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // Force logout if the token is expired or invalid
        eraseCookie(HEADERS.AUTH_TOKEN);
        api.dispatch(clearUser());
        api.dispatch(logout());
        // Optional: window.location.href = "/login";
    }
    return result;
};

export const baseApi = createApi({
    reducerPath: REDUX_IDENTIFIERS.API_REDUCER,
    baseQuery: baseQueryWithReAuth,
    endpoints: () => ({}),
});
