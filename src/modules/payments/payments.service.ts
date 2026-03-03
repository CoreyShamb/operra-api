import { StripeService } from "./stripe.service";

export class PaymentsService {
  private stripeService = new StripeService();

  async createCheckoutSession(
    organizationId: string,
    priceId: string,
    customerEmail: string
  ) {
    const stripe = this.stripeService.client;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: customerEmail,
      success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/billing?canceled=true`,
      metadata: {
        organizationId,
      },
    });

    return session.url;
  }
}