import {
    createCustomer as createCustomerRecord,
    deleteCustomer as deleteCustomerRecord,
    findCustomerByEmail,
    findCustomerById,
    findCustomerByPhone,
    findCustomers,
    updateCustomer as updateCustomerRecord,
} from "./customers.repository";
import {
    CreateCustomerInput,
    CustomerQueryParams,
    UpdateCustomerInput,
} from "./customers.types";

export async function createCustomer(input: CreateCustomerInput) {
    if (input.email) {
        const existingCustomerByEmail = await findCustomerByEmail({
            organizationId: input.organizationId,
            email: input.email,
        });

        if (existingCustomerByEmail) {
            throw new Error("A customer with this email already exists");
        }
    }

    if (input.phone) {
        const existingCustomerByPhone = await findCustomerByPhone({
            organizationId: input.organizationId,
            phone: input.phone,
        });

        if (existingCustomerByPhone) {
            throw new Error("A customer with this phone number already exists");
        }
    }

    return createCustomerRecord({
        organizationId: input.organizationId,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        notes: input.notes,
    });
}

export async function getCustomerById(id: string) {
    const customer = await findCustomerById(id);

    if (!customer) {
        throw new Error("Customer not found");
    }

    return customer;
}

export async function getCustomers(params: CustomerQueryParams) {
    return findCustomers(params);
}

export async function updateCustomer(id: string, input: UpdateCustomerInput) {
    const existingCustomer = await findCustomerById(id);

    if (!existingCustomer) {
        throw new Error("Customer not found");
    }

    if (input.email && input.email !== existingCustomer.email) {
        const existingCustomerByEmail = await findCustomerByEmail({
            organizationId: existingCustomer.organizationId,
            email: input.email,
        });

        if (existingCustomerByEmail && existingCustomerByEmail.id !== id) {
            throw new Error("A customer with this email already exists");
        }
    }

    if (input.phone && input.phone !== existingCustomer.phone) {
        const existingCustomerByPhone = await findCustomerByPhone({
            organizationId: existingCustomer.organizationId,
            phone: input.phone,
        });

        if (existingCustomerByPhone && existingCustomerByPhone.id !== id) {
            throw new Error("A customer with this phone number already exists");
        }
    }

    return updateCustomerRecord(id, {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        notes: input.notes,
    });
}

export async function deleteCustomer(id: string) {
    const existingCustomer = await findCustomerById(id);

    if (!existingCustomer) {
        throw new Error("Customer not found");
    }

    return deleteCustomerRecord(id);
}