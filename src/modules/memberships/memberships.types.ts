export type MembershipRole = "owner" | "admin" | "member";

export type Membership = {
    id: string;
    userId: string;
    organizationId: string;
    role: MembershipRole;
    createdAt: Date;
    updatedAt: Date;
};

export type MembershipWithUser = Membership & {
    user: {
        id: string;
        email: string;
        name: string | null;
    };
};

export type AddMemberInput = {
    organizationId: string;
    email: string;
    role: MembershipRole;
};

export type UpdateMemberRoleInput = {
    role: MembershipRole;
};

export type MembershipQueryParams = {
    organizationId: string;
};
