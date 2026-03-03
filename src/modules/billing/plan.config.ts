export const PLANS = {
    STARTER: {
        key: "starter",
        priceId: process.env.STRIPE_PRICE_STARTER!,
        staffLimit: 1,
        bookingLimit: 50,
        locations: 1,
        features: {
            reporting: false,
            advancedReporting: false,
            apiAccess: false,
            multiLocation:false
        }
    },

    GROWTH: {
        key: "growth",
        priceId: process.env.STRIPE_PRICE_GROWTH!,
        staffLimit: 5,
        bookingLimit: null,
        locations: 1,
        features: {
            rerporting: true,
            advancedReporting: false,
            apiAccess: false,
            multiLocation: false
        }
    },

    BUSINESS: {
        key: "business",
        priceId: process.env.STRIPE_PRICE_BUSINESS!,
        staffLimit: 15,
        bookingLimit: null,
        locations: 1,
        features: {
            reporting: true,
            advancedReporting: true,
            apiAccess: false,
            multiLocation: false
        }
    },

    PROFESSIONAL: {
        key: "professional",
        priceId: process.env.STRIPE_PRICE_PRO!,
        staffLimit: null,
        bookingLimit: null,
        locations: null,
        features: {
            reporting: true,
            advancedReporting: true,
            apiAccess: true,
            multiLocation: true
        }
    }
} as const;