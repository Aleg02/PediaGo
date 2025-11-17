import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/database";

// Plan par défaut (tu adapteras quand ta logique d'abonnement sera en place)
const DEFAULT_PLAN_CODE = "premium";

// Typage minimal des paramètres pour la session Stripe
type CreateStripeCheckoutSessionArgs = {
  userId: string;
  email?: string;
  successUrl: string;
  cancelUrl: string;
  priceId: string;
  planCode: string;
};

// Stub temporaire en attendant ta vraie implémentation Stripe
async function createStripeCheckoutSession(
  _args: CreateStripeCheckoutSessionArgs,
): Promise<{ url: string | null }> {
  // Ici tu mettras ton vrai appel Stripe plus tard.
  // Pour l'instant on lève une erreur explicite si quelqu'un appelle cette route.
  throw new Error("createStripeCheckoutSession n'est pas encore implémentée.");
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies }) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentification requise." },
      { status: 401 },
    );
  }

  const priceId = process.env.STRIPE_PRICE_PREMIUM_ID;
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!priceId || !secretKey) {
    return NextResponse.json(
      { error: "Stripe n'est pas configuré." },
      { status: 500 },
    );
  }

  const origin = request.headers.get("origin") ?? new URL(request.url).origin;
  const successUrl = `${origin}/subscribe?status=success&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/subscribe?status=cancel`;

  try {
    const session = await createStripeCheckoutSession({
      userId: user.id,
      email: user.email ?? undefined,
      successUrl,
      cancelUrl,
      priceId,
      planCode: DEFAULT_PLAN_CODE,
    });

    if (!session.url) {
      throw new Error("Stripe a renvoyé une session sans URL.");
    }

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Erreur Stripe checkout", error);
    return NextResponse.json(
      { error: "Impossible de créer la session de paiement." },
      { status: 500 },
    );
  }
}
