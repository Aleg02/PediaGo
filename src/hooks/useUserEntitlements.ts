"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import type { Database } from "@/types/database";

type EntitlementsState = {
  loading: boolean;
  canViewPremium: boolean;
  subscriptionStatus: string | null;
  subscriptionTier: string | null;
  error: string | null;
};

const initialState: EntitlementsState = {
  loading: false,
  canViewPremium: false,
  subscriptionStatus: null,
  subscriptionTier: null,
  error: null,
};

export function useUserEntitlements() {
  const session = useSession();
  const supabase = useSupabaseClient<Database>();
  const [state, setState] = useState<EntitlementsState>(initialState);

  const fetchEntitlements = useCallback(async () => {
    if (!session) {
      setState({ ...initialState });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    const { data, error } = await supabase
      .from("user_entitlements")
      .select("can_view_premium, subscription_status, subscription_tier")
      .eq("user_id", session.user.id)
      .single();

    if (error || !data) {
      setState({
        loading: false,
        canViewPremium: false,
        subscriptionStatus: null,
        subscriptionTier: null,
        error: error?.message ?? "Impossible de vérifier les droits.",
      });
      return;
    }

    setState({
      loading: false,
      canViewPremium: Boolean(data.can_view_premium),
      subscriptionStatus: data.subscription_status ?? null,
      subscriptionTier: data.subscription_tier ?? null,
      error: null,
    });
  }, [session, supabase]);

  useEffect(() => {
    if (!session) {
      setState({ ...initialState });
      return;
    }

    fetchEntitlements();
  }, [session, fetchEntitlements]);

  useEffect(() => {
    if (!session) {
      return;
    }

    const channel = supabase
      .channel(`entitlements-${session.user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${session.user.id}`,
        },
        () => {
          fetchEntitlements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, supabase, fetchEntitlements]);

  return {
    loading: state.loading,
    canViewPremium: state.canViewPremium,
    subscriptionStatus: state.subscriptionStatus,
    subscriptionTier: state.subscriptionTier,
    error: state.error,
    hasSession: Boolean(session),
    refreshEntitlements: fetchEntitlements,
  };
}

