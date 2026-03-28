import {baseApi} from "./baseApi.ts";
import {login, logout} from "@/store/slices/authSlice.ts";
import {clearUser} from "@/store/slices/userSlice.ts";
import {eraseCookie} from "@/utils/cookies";
import {toBase64} from "@/utils";
import {type LoginFormValues, type SignUpFormValues} from "@/schemas/auth.ts";
import {API_ENDPOINTS, HTTP_METHODS} from "@/constants/api.ts";
import {HEADERS} from "@/constants/headers.ts";
import type {AuthResponse, SessionsResponse} from "@/models/auth.ts";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginFormValues>({
            query: (credentials) => ({
                url: API_ENDPOINTS.AUTH.SIGN_IN,
                method: HTTP_METHODS.POST,
                headers: {
                    [HEADERS.AUTHORIZATION]: `${HEADERS.RESIDENT} ${toBase64(`${credentials.password}:${credentials.email}`)}`,
                },
            }),
            async onQueryStarted(_args, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(login(data));
                } catch (error) {
                    console.error("Login Side-effect failed:", error);
                }
            },
        }),

        register: builder.mutation<AuthResponse, SignUpFormValues>({
            query: (credentials) => ({
                url: API_ENDPOINTS.AUTH.SIGN_UP,
                method: HTTP_METHODS.POST,
                body: credentials,
            }),
        }),

        activate: builder.mutation<{msg: string}, string>({
            query: (token) => ({
                url: API_ENDPOINTS.AUTH.ACTIVATE,
                method: HTTP_METHODS.POST,
                headers: {
                    [HEADERS.AUTHORIZATION]: `${HEADERS.TOKEN} ${token}`,
                },
            }),
        }),

        resendEmail: builder.mutation<{msg: string}, string>({
            query: (token) => ({
                url: API_ENDPOINTS.AUTH.RESEND_EMAIL,
                method: HTTP_METHODS.POST,
                headers: {
                    [HEADERS.AUTHORIZATION]: `${HEADERS.TOKEN} ${token}`,
                },
            }),
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: `${API_ENDPOINTS.AUTH.SIGN_OUT}?scope=current`,
                method: HTTP_METHODS.DELETE,
            }),
            async onQueryStarted(_args, {dispatch, queryFulfilled}) {
                await queryFulfilled;
                eraseCookie(HEADERS.AUTH_TOKEN);
                dispatch(clearUser());
                dispatch(logout());
            },
        }),

        getSessions: builder.query<SessionsResponse, void>({
            query: () => ({
                url: API_ENDPOINTS.AUTH.SESSIONS,
                method: HTTP_METHODS.GET,
            }),
        }),

        revokeSession: builder.mutation<void, {sessionId: string; principal: string}>({
            query: ({sessionId, principal}) => ({
                url: `${API_ENDPOINTS.AUTH.SIGN_OUT}?scope=current`,
                method: HTTP_METHODS.DELETE,
                headers: {
                    [HEADERS.AUTHORIZATION]: `${HEADERS.TOKEN} ${toBase64(`${sessionId}:${principal}`)}`,
                },
            }),
            async onQueryStarted({sessionId}, {dispatch, queryFulfilled}) {
                await queryFulfilled;
                dispatch(
                    authApi.util.updateQueryData("getSessions", undefined, (draft) => {
                        draft.sessions = draft.sessions.filter((s) => s.id !== sessionId);
                    }),
                );
            },
        }),

        logoutAllSessions: builder.mutation<void, void>({
            query: () => ({
                url: `${API_ENDPOINTS.AUTH.SIGN_OUT}?scope=all`,
                method: HTTP_METHODS.DELETE,
            }),
            async onQueryStarted(_args, {dispatch, queryFulfilled}) {
                await queryFulfilled;
                eraseCookie(HEADERS.AUTH_TOKEN);
                dispatch(clearUser());
                dispatch(logout());
            },
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useActivateMutation,
    useResendEmailMutation,
    useGetSessionsQuery,
    useRevokeSessionMutation,
    useLogoutMutation,
    useLogoutAllSessionsMutation,
} = authApi;
