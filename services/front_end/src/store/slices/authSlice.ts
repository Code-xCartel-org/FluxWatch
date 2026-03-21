import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {eraseCookie, getCookie, setCookie} from "@/utils/cookies";
import {REDUX_IDENTIFIERS} from "@/constants/redux-identifiers.ts";
import {HEADERS} from "@/constants/headers.ts";

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    user: any | null;
}

const initialState: AuthState = {
    token: getCookie(HEADERS.AUTH_TOKEN),
    isAuthenticated: !!getCookie(HEADERS.AUTH_TOKEN),
    user: null,
};

const authSlice = createSlice({
    name: REDUX_IDENTIFIERS.AUTH_REDUCER,
    initialState,
    reducers: {
        login: (
            state,
            {payload}: PayloadAction<{ user: any; token: string }>
        ) => {
            state.user = payload.user;
            state.token = payload.token;
            state.isAuthenticated = true;
            setCookie(HEADERS.AUTH_TOKEN, payload.token, 7);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            eraseCookie(HEADERS.AUTH_TOKEN);
        },
    },
});

export const {login, logout} = authSlice.actions;
export default authSlice
