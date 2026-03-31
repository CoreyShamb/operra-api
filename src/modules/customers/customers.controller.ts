import { Request, Response } from "express";
import {
    createCustomerSchema,
    customerQuerySchema,
    updateCustomerSchema,
} from "./customers.validation";
import {
    createCustomer,
    deleteCustomer,
    getCustomerById,
    getCustomers,
    updateCustomer,
} from "./customers.service";

export async function createCustomerHandler(req: Request, res: Response) {
    const validatedBody = createCustomerSchema.parse(req.body);
    const customer = await createCustomer(validatedBody);

    return res.status(201).json({
        success: true,
        data: customer,
    });
}

export async function getCustomersHandler(req: Request, res: Response) {
    const validatedQuery = customerQuerySchema.parse(req.query);
    const customers = await getCustomers(validatedQuery);

    return res.status(200).json({
        success: true,
        ...customers,
    });
}

export async function getCustomerByIdHandler(req: Request, res: Response) {
    const idParam = req.params.id;

    if (Array.isArray(idParam) || !idParam) {
        return res.status(400).json({
            success: false,
            message: "Invalid customer id",
        });
    }

    const customer = await getCustomerById(idParam);

    return res.status(200).json({
        success: true,
        data: customer,
    });
}

export async function updateCustomerHandler(req: Request, res: Response) {
    const idParam = req.params.id;

    if (Array.isArray(idParam) || !idParam) {
        return res.status(400).json({
            success: false,
            message: "Invalid customer id",
        });
    }

    const validatedBody = updateCustomerSchema.parse(req.body);

    const customer = await updateCustomer(idParam, validatedBody);

    return res.status(200).json({
        success: true,
        data: customer,
    });
}

export async function deleteCustomerHandler(req: Request, res: Response) {
    const idParam = req.params.id;

    if (Array.isArray(idParam) || !idParam) {
        return res.status(400).json({
            success: false,
            message: "Invalid customer id",
        });
    }

    await deleteCustomer(idParam);

    return res.status(200).json({
        success: true,
        message: "Customer deleted successfully",
    });
}