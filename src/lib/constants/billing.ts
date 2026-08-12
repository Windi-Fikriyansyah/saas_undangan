import { PlanType } from "@/generated/prisma/client";

export const PLAN_LIMITS = {
  [PlanType.FREE_TRIAL]: {
    maxOrders: 2,
    allowPremiumTemplates: false,
    maxGuests: 50,
  },
  [PlanType.STARTER]: {
    maxOrders: 10,
    allowPremiumTemplates: false,
    maxGuests: 500,
  },
  [PlanType.PRO]: {
    maxOrders: 999999, // Unlimited
    allowPremiumTemplates: true,
    maxGuests: 999999, // Unlimited
  },
  [PlanType.BUSINESS]: {
    maxOrders: 999999,
    allowPremiumTemplates: true,
    maxGuests: 999999,
    whiteLabel: true,
  }
};
