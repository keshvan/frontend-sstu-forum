import { authApi } from "../api/api";
import { loginUser, logoutUser, setAuthData } from "../slices/auth";
import { CheckSessionResponse, InitialAuthResponse, LoginRequest, LoginResponse, RefreshResponse, RegisterRequest, RegisterResponse } from "../types/auth";
import { store } from "../store";
import axios, { AxiosError } from "axios";
import { ForumService } from "./forumService";

const dispatch = store.dispatch;

export const AuthService = {
    login: async (req:  LoginRequest): Promise<LoginResponse> => {
        try {
            const res = await authApi.post<LoginResponse>('/login', req);
            const accessToken = res.data.access_token;
            const user = res.data.user;

            if (accessToken && user && user.username) {
                localStorage.setItem('access_token', accessToken);
                ForumService.connectToChat();
                //dispatch(loginUser(user.username));
                return res.data;
            } else {
                localStorage.removeItem('access_token');
                //dispatch(logoutUser());
                throw new Error('Failed to login');
            }
        } catch (error) {
            localStorage.removeItem('access_token');
            throw error;
        }
    },

    register: async (req: RegisterRequest): Promise<RegisterResponse> => {
        try {
           const res = await authApi.post<RegisterResponse>('/register', req);
           const accessToken = res.data.access_token;
           const user = res.data.user;

            if (accessToken && user && user.username) {
                localStorage.setItem('access_token', accessToken);
                ForumService.connectToChat();
                //dispatch(loginUser(user.username));
                return res.data;
            } else {
                localStorage.removeItem('access_token');
                //dispatch(logoutUser());
                throw new Error('Failed to register');
            }
        } catch (error) {
            localStorage.removeItem('access_token');
            throw error;
        }
    },

    logout: async (): Promise<{success: boolean}> => {
        try {
            localStorage.removeItem('access_token');
            ForumService.disconnectFromChat();
            //dispatch(logoutUser());
            await authApi.post('/logout');
            return {success: true};
        } catch (error) {
            throw error;
        }
    },
    
    checkSession: async(): Promise<CheckSessionResponse> => {
        try {
            const res = await authApi.get<CheckSessionResponse>("/check-session", {validateStatus: () => true});
            console.log(res.data)
            return res.data;
        } catch (error) {
            throw error;
        }
    }
}
