import { Request, Response } from "express";
import { StripeService } from "./stripe.service";
import prisma from "../../lib/prisma";


const stripeService = new StripeService();

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event;

  try {
    event = stripeService.client.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as any;

      const subscription = await stripeService.client.subscriptions.retrieve(
        session.subscription
      ) as unknown as any;

      await prisma.subscription.upsert({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        update: {
          status: subscription.status,
          stripePriceId: subscription.items.data[0].price.id,
          currentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
        create: {
          organizationId: session.metadata.organizationId,
          stripeCustomerId: subscription.customer as string,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          planKey: "default", // map from priceId later
          status: subscription.status,
          currentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      });

      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as any;

      await prisma.subscription.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          status: subscription.status,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          currentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      });

      break;
    }
  }

  res.json({ received: true });
};