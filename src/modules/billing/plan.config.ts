export type PlanFeatureFlags = {
  reporting: boolean;
  advancedReporting: boolean;
  apiAccess: boolean;
  multiLocation: boolean;
};

export type PlanConfig = {
  key: PlanKey;
  stripePriceId: string | null;
  isFree: boolean;
  staffLimit: number | null;
  bookingLimit: number | null;
  locations: number | null;
  features: PlanFeatureFlags;
};

export type PlanKey =
  | "free"
  | "starter"
  | "growth"
  | "business"
  | "professional";

export const PLANS: Record<string, PlanConfig> = {
  FREE: {
    key: "free",
    stripePriceId: null,
    isFree: true,
    staffLimit: 1,
    bookingLimit: 10,
    locations: 1,
    features: {
      reporting: false,
      advancedReporting: false,
      apiAccess: false,
      multiLocation: false,
    },
  },

  STARTER: {
    key: "starter",
    stripePriceId: process.env.STRIPE_PRICE_STARTER ?? null,
    isFree: false,
    staffLimit: 1,
    bookingLimit: 50,
    locations: 1,
    features: {
      reporting: false,
      advancedReporting: false,
      apiAccess: false,
      multiLocation: false,
    },
  },

  GROWTH: {
    key: "growth",
    stripePriceId: process.env.STRIPE_PRICE_GROWTH ?? null,
    isFree: false,
    staffLimit: 5,
    bookingLimit: null,
    locations: 1,
    features: {
      reporting: true,
      advancedReporting: false,
      apiAccess: false,
      multiLocation: false,
    },
  },

  BUSINESS: {
    key: "business",
    stripePriceId: process.env.STRIPE_PRICE_BUSINESS ?? null,
    isFree: false,
    staffLimit: 15,
    bookingLimit: null,
    locations: 1,
    features: {
      reporting: true,
      advancedReporting: true,
      apiAccess: false,
      multiLocation: false,
    },
  },

  PROFESSIONAL: {
    key: "professional",
    stripePriceId: process.env.STRIPE_PRICE_PRO ?? null,
    isFree: false,
    staffLimit: null,
    bookingLimit: null,
    locations: null,
    features: {
      reporting: true,
      advancedReporting: true,
      apiAccess: true,
      multiLocation: true,
    },
  },
};

export function getPlanByKey(planKey: string): PlanConfig | null {
  const normalizedKey = planKey.trim().toLowerCase();

  const plan = Object.values(PLANS).find((item) => item.key === normalizedKey);

  return plan ?? null;
}

export function getAllPlans(): PlanConfig[] {
  return Object.values(PLANS);
}

export function isPaidPlan(planKey: string): boolean {
  const plan = getPlanByKey(planKey);
  return !!plan && !plan.isFree;
}