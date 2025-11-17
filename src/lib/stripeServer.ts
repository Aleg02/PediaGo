const STRIPE_API_BASE = "https://api.stripe.com/v1";

type StripeRequestOptions = {
  method?: "GET" | "POST";
  body?: URLSearchParams | string;
};

export type StripeCheckoutSession = {
  id: string;
  url?: string | null;
  subscription?: string | null;
  customer?: string | null;
  metadata?: Record<string, string>;
};

export type StripeSubscription = {
  id: string;
  status: string;
  current_period_end: number | null;
  cancel_at: number | null;
  customer?: string | null;
  metadata?: Record<string, string>;
};

async function stripeRequest<T>(path: string, options: StripeRequestOptions = {}): Promise<T> {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Clé Stripe manquante (STRIPE_SECRET_KEY).");
  }

  const response = await fetch(`${STRIPE_API_BASE}${path}`, {
    method: options.method ?? "GET",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: options.body ? options.body.toString() : undefined,
  });

  const payload = await response.json();

  if (!response.ok) {
    const message = payload?.error?.message ?? "Erreur Stripe";
    throw new Error(message);
  }

  return payload as T;
}

export async function createStripeCheckoutSession(params: {
  userId: string;
  email?: string;
  successUrl: string;
  cancelUrl: string;
  priceId: string;
  planCode: string;
}): Promise<StripeCheckoutSession> {
  const body = new URLSearchParams();
  body.set("mode", "subscription");
  body.set("success_url", params.successUrl);
  body.set("cancel_url", params.cancelUrl);
  body.set("line_items[0][price]", params.priceId);
  body.set("line_items[0][quantity]", "1");
  body.set("allow_promotion_codes", "true");
  body.set("metadata[supabase_user_id]", params.userId);
  body.set("metadata[plan_code]", params.planCode);
  body.set("subscription_data[metadata][supabase_user_id]", params.userId);
  body.set("subscription_data[metadata][plan_code]", params.planCode);

  if (params.email) {
    body.set("customer_email", params.email);
  }

  return stripeRequest<StripeCheckoutSession>("/checkout/sessions", {
    method: "POST",
    body,
  });
}

export async function retrieveStripeSubscription(subscriptionId: string): Promise<StripeSubscription> {
  return stripeRequest<StripeSubscription>(`/subscriptions/${subscriptionId}`);
}
