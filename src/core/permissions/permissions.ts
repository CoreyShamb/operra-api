import { Action, Role } from "./permissions.types";

const ROLE_PERMISSIONS: Record<Role, Action[]> = {
    owner: [
        "org:read",
        "org:update",
        "org:delete",
        "member:read",
        "member:invite",
        "member:update",
        "member:remove",
        "booking:create",
        "booking:read",
        "booking:update",
        "booking:delete",
        "customer:create",
        "customer:read",
        "customer:update",
        "customer:delete",
        "api-key:create",
        "api-key:read",
        "api-key:revoke",
        "billing:read",
        "billing:manage",
        "analytics:read",
        "integration:read",
        "integration:manage",
    ],
    admin: [
        "org:read",
        "org:update",
        "member:read",
        "member:invite",
        "member:update",
        "member:remove",
        "booking:create",
        "booking:read",
        "booking:update",
        "booking:delete",
        "customer:create",
        "customer:read",
        "customer:update",
        "customer:delete",
        "api-key:create",
        "api-key:read",
        "api-key:revoke",
        "billing:read",
        "analytics:read",
        "integration:read",
        "integration:manage",
    ],
    member: [
        "org:read",
        "member:read",
        "booking:create",
        "booking:read",
        "booking:update",
        "customer:create",
        "customer:read",
        "analytics:read",
        "integration:read",
    ],
};

const PERMISSION_SETS: Record<Role, Set<Action>> = {
    owner: new Set(ROLE_PERMISSIONS.owner),
    admin: new Set(ROLE_PERMISSIONS.admin),
    member: new Set(ROLE_PERMISSIONS.member),
};

const ROLE_RANK: Record<Role, number> = {
    owner: 3,
    admin: 2,
    member: 1,
};

export function can(role: Role, action: Action): boolean {
    return PERMISSION_SETS[role]?.has(action) ?? false;
}

export function hasMinimumRole(userRole: Role, minimumRole: Role): boolean {
    return ROLE_RANK[userRole] >= ROLE_RANK[minimumRole];
}

export function getRolePermissions(role: Role): Action[] {
    return ROLE_PERMISSIONS[role] ?? [];
}
