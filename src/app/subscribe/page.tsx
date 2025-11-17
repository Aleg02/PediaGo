"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUserEntitlements } from "@/hooks/useUserEntitlements";

const PREMIUM_PLAN = {
  name: "PediaGo+ Premium",
  description: "Accès illimité aux fiches critiques, calculs automatiques et mises à jour validées par l’équipe médicale.",
  price: "49 € HT / mois",
  planCode: "Premium mensuel",
  perks: [
    "Toutes les fiches premium (ACR, anaphylaxie, hypoglycémie, etc.)",
    "Calculs automatiques poids/âge sans erreur",
    "Accès anticipé aux nouvelles fiches validées",
    "Support prioritaire par l’équipe médicale",
  ],
};

export default function SubscribePage() {
  const session = useSession();
  const searchParams = useSearchParams();
  const { canViewPremium, subscriptionStatus, loading, refreshEntitlements } = useUserEntitlements();
  const [creatingCheckout, setCreatingCheckout] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const statusParam = searchParams.get("status");
  const reason = searchParams.get("reason");
  const blockedSlug = searchParams.get("slug");
  const successMessage = statusParam === "success";
  const cancelMessage = statusParam === "cancel";

  useEffect(() => {
    if (successMessage) {
      refreshEntitlements();
    }
  }, [successMessage, refreshEntitlements]);

  const ctaLabel = useMemo(() => {
    if (!session) {
      return "Connectez-vous pour souscrire";
    }
    if (canViewPremium) {
      return "Vous êtes déjà Premium";
    }
    return creatingCheckout ? "Redirection vers Stripe..." : "Passer Premium";
  }, [session, canViewPremium, creatingCheckout]);

  const handleCheckout = async () => {
    if (!session) {
      return;
    }

    setError(null);
    setCreatingCheckout(true);

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        credentials: "same-origin",
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
      console.error(checkoutError);
      setError(checkoutError instanceof Error ? checkoutError.message : "Erreur inconnue.");
      setCreatingCheckout(false);
    }
  };

  const showCheckoutButton = Boolean(session) && !canViewPremium;

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="h-1 w-full bg-gradient-to-r from-[#8b5cf6] via-[#3b82f6] to-[#22c55e]" />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-12">
        <Link href="/" className="text-sm font-medium text-[#2563eb] underline">
          ← Retour à l’accueil
        </Link>
        <header className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Abonnement</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Passer en Premium</h1>
          <p className="text-base text-slate-600">
            Débloquez l’ensemble des fiches critiques PediaGo+ et laissez l’application calculer toutes les posologies pour vous.
          </p>
        </header>

        {(successMessage || cancelMessage) && (
          <div
            className={`rounded-2xl border px-5 py-4 text-sm ${
              successMessage
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            {successMessage
              ? "Paiement confirmé par Stripe. Votre accès sera rafraîchi automatiquement sous quelques secondes."
              : "Retour Stripe annulé. Vous pouvez relancer la souscription quand vous le souhaitez."}
          </div>
        )}

        {!session && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Compte requis</p>
            <p className="mt-1">
              Créez un compte ou connectez-vous avant de lancer le paiement Stripe afin de rattacher l’abonnement à vos fiches.
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
              <Link className="rounded-full border border-slate-200 px-4 py-2" href="/login">
                Se connecter / créer un compte
              </Link>
            </div>
          </div>
        )}

        {reason === "premium" && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
            <p className="font-semibold">Fiche réservée aux abonnés</p>
            <p className="mt-1">
              {blockedSlug
                ? `La fiche « ${blockedSlug} » est incluse dans la formule Premium.`
                : "La ressource demandée fait partie des contenus Premium."}
            </p>
          </div>
        )}

        <section className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6 shadow-inner shadow-slate-200/50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{PREMIUM_PLAN.planCode}</p>
              <h2 className="text-2xl font-semibold text-slate-900">{PREMIUM_PLAN.name}</h2>
              <p className="mt-2 text-sm text-slate-600">{PREMIUM_PLAN.description}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-slate-900">{PREMIUM_PLAN.price}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Sans engagement</p>
            </div>
          </div>

          <ul className="mt-6 grid gap-3">
            {PREMIUM_PLAN.perks.map((perk) => (
              <li key={perk} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  ✓
                </span>
                <span>{perk}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3">
            {showCheckoutButton ? (
              <button
                type="button"
                onClick={handleCheckout}
                disabled={creatingCheckout || loading}
                className="rounded-full bg-slate-900 px-6 py-3 text-center text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {ctaLabel}
              </button>
            ) : (
              <div className="rounded-full border border-slate-200 px-6 py-3 text-center text-base font-semibold text-slate-500">
                {ctaLabel}
              </div>
            )}
            {canViewPremium && (
              <p className="text-center text-sm text-emerald-700">
                Votre abonnement est actif (statut : {subscriptionStatus ?? "active"}).
              </p>
            )}
            {error && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
          </div>
        </section>

        <section className="rounded-3xl border border-dashed border-slate-200/80 bg-white/70 p-6 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Comment ça marche ?</p>
          <ol className="mt-3 space-y-2 list-decimal pl-5">
            <li>Sélectionnez « Passer Premium » pour ouvrir le checkout Stripe sécurisé.</li>
            <li>Stripe confirme le paiement et renvoie l’évènement à PediaGo via un webhook.</li>
            <li>Supabase met à jour votre profil et l’accès premium est disponible instantanément.</li>
          </ol>
          <p className="mt-3">
            Besoin d’aide ? Contactez {" "}
            <a className="font-semibold text-[#2563eb]" href="mailto:contact@pediago.app">
              contact@pediago.app
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
