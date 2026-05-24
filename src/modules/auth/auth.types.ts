export type RegisterInput = {
    email: string;
    name?: string;
    password: string;
};

export type LoginInput = {
    email: string;
    password: string;
};

export type AuthUser = {
    id: string;
    email: string;
    name: string | null;
    createdAt: Date;
};

export type JWTPayload = {
    userId: string;
    email: string;
};

export type LoginResponse = {
    user: AuthUser;
    token: string;
};
