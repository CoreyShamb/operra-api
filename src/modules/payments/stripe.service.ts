// src/modules/payments/stripe.service.ts

import Stripe from "stripe";

export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-02-25.clover",
    });
  }

  get client() {
    return this.stripe;
  }
}
