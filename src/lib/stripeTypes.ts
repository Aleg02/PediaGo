import { z } from "zod";

export const StripeMetadataSchema = z.record(z.string(), z.string().nullable().optional());

export const StripeSubscriptionSchema = z.object({
    id: z.string(),
    status: z.string(),
    current_period_end: z.number().nullable(),
    cancel_at: z.number().nullable(),
    customer: z.string().nullable().optional(),
    metadata: StripeMetadataSchema.optional(),
});

export const StripeInvoiceSchema = z.object({
    id: z.string(),
    subscription: z.string().nullable().optional(),
    status: z.string(),
    amount_paid: z.number(),
    currency: z.string(),
});

export const StripeCheckoutSessionSchema = z.object({
    id: z.string(),
    subscription: z.string().nullable().optional(),
    customer: z.string().nullable().optional(),
    metadata: StripeMetadataSchema.optional(),
});

export const StripeEventSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("checkout.session.completed"),
        data: z.object({
            object: StripeCheckoutSessionSchema,
        }),
    }),
    z.object({
        type: z.enum([
            "customer.subscription.created",
            "customer.subscription.updated",
            "customer.subscription.deleted",
        ]),
        data: z.object({
            object: StripeSubscriptionSchema,
        }),
    }),
    z.object({
        type: z.literal("invoice.payment_succeeded"),
        data: z.object({
            object: StripeInvoiceSchema,
        }),
    }),
]);

export type StripeEvent = z.infer<typeof StripeEventSchema>;
