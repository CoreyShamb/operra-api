export type Customer = {
    id: string;
    organizationId: string;
    firstName: string;
    lastName: string;
    email?: string | null;
    phone?: string | null;
    notes?: string | null;
    createdAt: Date;
    updatedAt: Date;
};

export type CreateCustomerInput = {
    organizationId: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    notes?: string;
};

export type UpdateCustomerInput = Partial<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    notes: string;
}>;

export type CustomerQueryParams = {
    organizationId: string;
    search?: string;
    page?: number;
    limit?: number;
};

export type PaginatedCustomers = {
    data: Customer[];
    total: number;
    page: number;
    limit: number;
};