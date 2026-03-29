import {baseApi} from "./baseApi.ts";
import {login, logout} from "@/store/slices/authSlice.ts";
import {eraseCookie} from "@/utils/cookies";
import {toBase64} from "@/utils";
import {
    type LoginFormValues,
    type SignUpFormValues,
    type ForgotPasswordFormValues,
} from "@/schemas/auth.ts";
import {API_ENDPOINTS, HTTP_METHODS} from "@/constants/api.ts";
import {HEADERS} from "@/constants/headers.ts";
import type {AuthResponse, SessionsResponse} from "@/models/auth.ts";

type SignOutArgs =
    | {scope: "current"}
    | {scope: "all"}
    | {scope: "revoke"; sessionId: string; principal: string};

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

        forgotPassword: builder.mutation<{msg: string}, ForgotPasswordFormValues>({
            query: (body) => ({
                url: API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
                method: HTTP_METHODS.POST,
                body,
            }),
        }),

        changePassword: builder.mutation<{msg: string}, {password: string; token?: string}>({
            query: ({token, password}) => ({
                url: API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
                method: HTTP_METHODS.POST,
                ...(token && {
                    headers: {
                        [HEADERS.AUTHORIZATION]: `${HEADERS.TOKEN} ${token}`,
                    },
                }),
                body: {password},
            }),
        }),

        getSessions: builder.query<SessionsResponse, void>({
            query: () => ({
                url: API_ENDPOINTS.AUTH.SESSIONS,
                method: HTTP_METHODS.GET,
            }),
        }),

        signOut: builder.mutation<void, SignOutArgs>({
            query: (args) => {
                const scope = args.scope === "revoke" ? "current" : args.scope;
                const headers: Record<string, string> =
                    args.scope === "revoke"
                        ? {
                              [HEADERS.AUTHORIZATION]: `${HEADERS.TOKEN} ${toBase64(`${args.sessionId}:${args.principal}`)}`,
                          }
                        : {};
                return {
                    url: `${API_ENDPOINTS.AUTH.SIGN_OUT}?scope=${scope}`,
                    method: HTTP_METHODS.DELETE,
                    headers,
                };
            },
            async onQueryStarted(args, {dispatch, queryFulfilled}) {
                await queryFulfilled;
                if (args.scope === "revoke") {
                    dispatch(
                        authApi.util.updateQueryData("getSessions", undefined, (draft) => {
                            draft.sessions = draft.sessions.filter((s) => s.id !== args.sessionId);
                        }),
                    );
                } else {
                    eraseCookie(HEADERS.AUTH_TOKEN);
                    dispatch(logout());
                }
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
    useForgotPasswordMutation,
    useChangePasswordMutation,
    useSignOutMutation,
} = authApi;
