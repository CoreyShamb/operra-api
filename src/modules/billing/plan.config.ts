import { PlanConfig, PlanKey } from "./billing.types";

// PlanKey and PlanConfig are imported from "./billing.types"

export const PLANS: Record<PlanKey, PlanConfig> = {
  free: {
    key: "free",
    name: "Free",
  },

  starter: {
    key: "starter",
    name: "Starter",
    stripePriceId: process.env.STRIPE_PRICE_STARTER,
  },

  growth: {
    key: "growth",
    name: "Growth",
    stripePriceId: process.env.STRIPE_PRICE_GROWTH,
  },

  business: {
    key: "business",
    name: "Business",
    stripePriceId: process.env.STRIPE_PRICE_BUSINESS,
  },

  professional: {
    key: "professional",
    name: "Professional",
    stripePriceId: process.env.STRIPE_PRICE_PROFESSIONAL,
  },
};

export function getPlanByKey(planKey: string) {
  return PLANS[planKey as PlanKey] ?? null;
}