export type User = {
    id: string;
    email: string;
    name: string | null;
    createdAt: Date;
    updatedAt: Date;
};

export type UpdateProfileInput = {
    name?: string;
    email?: string;
};

export type ChangePasswordInput = {
    currentPassword: string;
    newPassword: string;
};
