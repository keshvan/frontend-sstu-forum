import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginRequest, LoginResponse, User } from "../types/auth";
import { AuthService } from "../services/authService";

interface AuthState {
    isAuthenticated: boolean;
    username: string | null;
}


const initialState: AuthState = {
    isAuthenticated: false,
    username: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthData: (state, action: PayloadAction<{ isAuthenticated: boolean, username: string | null }>) => {
            state.isAuthenticated = action.payload.isAuthenticated;
            state.username = action.payload.username;
        },

        loginUser: (state, action: PayloadAction<string>) => {
            state.isAuthenticated = true;
            state.username = action.payload;
        },
        
        logoutUser: (state) => {
            state.isAuthenticated = false;
            state.username = null;
        }
    },
});


export const { setAuthData, loginUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;

