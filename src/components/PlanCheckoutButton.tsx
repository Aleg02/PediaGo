"use client";

import { useMemo, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";

const PLAN_LABELS: Record<string, string> = {
  yearly: "Basculer sur l’offre annuelle",
  monthly: "Choisir l’offre mensuelle",
};

type PlanCheckoutButtonProps = {
  plan: "monthly" | "yearly";
  className?: string;
  label?: string;
};

export function PlanCheckoutButton({ plan, className, label }: PlanCheckoutButtonProps) {
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buttonLabel = useMemo(() => {
    if (!session) return "Connectez-vous";
    if (loading) return "Redirection...";
    return label ?? PLAN_LABELS[plan] ?? "Continuer";
  }, [session, loading, label, plan]);

  const handleCheckout = async () => {
    if (!session) return;

    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ billingPeriod: plan, plan }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? "Impossible de créer la session Stripe.");
      }

      const data = await response.json();
      if (data.checkoutUrl) {
        window.location.assign(data.checkoutUrl);
        return;
      }

      throw new Error("Réponse Stripe inattendue.");
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Erreur inconnue.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading || !session}
        className={
          className ??
          "inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        }
      >
        {buttonLabel}
      </button>
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}
