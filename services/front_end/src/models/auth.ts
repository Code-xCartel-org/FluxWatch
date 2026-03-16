export interface User {
    id: string;
    username: string;
    email: string;
    role?: "admin" | "user" | "manager";
    avatar?: string;
    createdAt: string;
}

export interface AuthRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}