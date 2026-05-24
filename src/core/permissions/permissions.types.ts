export type Role = "owner" | "admin" | "member";

export type Action =
    | "org:read"
    | "org:update"
    | "org:delete"
    | "member:read"
    | "member:invite"
    | "member:update"
    | "member:remove"
    | "booking:create"
    | "booking:read"
    | "booking:update"
    | "booking:delete"
    | "customer:create"
    | "customer:read"
    | "customer:update"
    | "customer:delete"
    | "api-key:create"
    | "api-key:read"
    | "api-key:revoke"
    | "billing:read"
    | "billing:manage"
    | "analytics:read"
    | "integration:read"
    | "integration:manage";

export type PermissionContext = {
    userId: string;
    organizationId: string;
    role: Role;
};
