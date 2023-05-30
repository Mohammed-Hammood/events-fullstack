import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { UserTypes } from 'types';

const __token__ = "userToken#name";

type AuthTypes = {
    isAuthenticated: boolean;
    token: null | string;
    loading: boolean;
    user: null | UserTypes;
}

const initialState: AuthTypes = {
    isAuthenticated: false,
    token: localStorage.getItem(__token__),
    loading: true,
    user: null,
}

const authSlicer = createSlice({
    initialState,
    name: "auth",
    reducers: {
        login(state, actions: PayloadAction<{ token: string, user: UserTypes }>) {
            const { token, user } = actions.payload;
            state.isAuthenticated = true;
            state.token = token;
            state.user = user
            localStorage.setItem(__token__, token);
        },
        setUser(state, actions: PayloadAction<{ user: UserTypes }>) {
            const { user } = actions.payload;
            state.isAuthenticated = true;
            state.user = user;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
            localStorage.removeItem(__token__);
        },
        setLoading(state, actions: PayloadAction<boolean>) {
            state.loading = actions.payload;
        },

    }
})

export default authSlicer.reducer;
export const { login, logout, setLoading, setUser } = authSlicer.actions