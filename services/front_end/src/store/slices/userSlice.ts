import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {REDUX_IDENTIFIERS} from "@/constants/redux.ts";
import type {Account} from "@/models/auth.ts";

interface UserState {
    user: Account | null;
}

const initialState: UserState = {
    user: null,
};

const userSlice = createSlice({
    name: REDUX_IDENTIFIERS.USER_REDUCER,
    initialState,
    reducers: {
        setUser: (state, {payload}: PayloadAction<Account>) => {
            state.user = payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
    },
});

export const {setUser, clearUser} = userSlice.actions;
export default userSlice;
