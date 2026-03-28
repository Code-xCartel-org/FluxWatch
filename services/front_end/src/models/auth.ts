export interface Account {
    id: string;
    name: string;
    principal: string;
    isActive: boolean;
    isLocked: boolean;
    failedLoginAttempts: number;
}

export interface AuthResponse {
    accessToken: string;
    ttl: string;
}

export interface Session {
    id: string;
    createdAt: string;
    updatedAt: string;
    ttl: string | null;
}

export interface SessionsResponse {
    sessions: Session[];
}
