export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    user: User;
    access_token: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
}

export interface RegisterResponse {
    user: User;
    access_token: string;
}

export interface RefreshResponse {
    user: User;
    access_token: string;
}

export interface InitialAuthResponse {
    authenticated: boolean;
}

export interface CheckSessionResponse {
    user: User | null,
    is_active: boolean
}

export interface User {
    id: number;
    username: string;
    role: string;
}
