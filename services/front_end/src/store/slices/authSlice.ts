import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {eraseCookie, getCookie, getExpiry, setCookie} from "@/utils/cookies";
import {REDUX_IDENTIFIERS} from "@/constants/redux.ts";
import {HEADERS} from "@/constants/headers.ts";
import type {AuthResponse} from "@/models/auth.ts";

interface AuthState {
    token: string | null;
    ttl: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    token: getCookie(HEADERS.AUTH_TOKEN),
    ttl: getExpiry(HEADERS.AUTH_TOKEN),
    isAuthenticated: !!getCookie(HEADERS.AUTH_TOKEN),
};

const authSlice = createSlice({
    name: REDUX_IDENTIFIERS.AUTH_REDUCER,
    initialState,
    reducers: {
        login: (state, {payload}: PayloadAction<AuthResponse>) => {
            state.token = payload.accessToken;
            state.ttl = payload.ttl;
            state.isAuthenticated = true;
            setCookie(HEADERS.AUTH_TOKEN, payload.accessToken, payload.ttl);
        },
        logout: (state) => {
            state.token = null;
            state.ttl = null;
            state.isAuthenticated = false;
            eraseCookie(HEADERS.AUTH_TOKEN);
        },
    },
});

export const {login, logout} = authSlice.actions;
export default authSlice;
