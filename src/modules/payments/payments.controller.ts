import { Request, Response } from "express";
import { PaymentsService } from "./payments.service";

const service = new PaymentsService();

export const createCheckout = async (req: Request, res: Response) => {
  try {
    const { organizationId, priceId, email } = req.body;

    const url = await service.createCheckoutSession(
      organizationId,
      priceId,
      email
    );

    res.json({ url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Checkout creation failed" });
  }
};