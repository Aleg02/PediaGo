"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import type SupabaseClient from "@supabase/supabase-js/dist/module/SupabaseClient";
import type { Database } from "@/types/database";

type UserEntitlementsRow = Database["public"]["Views"]["user_entitlements"]["Row"];

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
  const sessionUser = (session as { user?: { id?: string } } | null)?.user;
  const userId = sessionUser?.id ?? null;
  const supabase = useSupabaseClient() as unknown as SupabaseClient<Database>;
  const [state, setState] = useState<EntitlementsState>(initialState);

  const fetchEntitlements = useCallback(async () => {
    if (!userId) {
      setState({ ...initialState });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    const { data, error } = await supabase
      .from("user_entitlements")
      .select("can_view_premium, subscription_status, subscription_tier")
      .eq("user_id", userId)
      .maybeSingle<UserEntitlementsRow>();

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
  }, [userId, supabase]);

  useEffect(() => {
    if (!userId) {
      setState({ ...initialState });
      return;
    }

    fetchEntitlements();
  }, [userId, fetchEntitlements]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const channel = supabase
      .channel(`entitlements-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        () => {
          fetchEntitlements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase, fetchEntitlements]);

  return {
    loading: state.loading,
    canViewPremium: state.canViewPremium,
    subscriptionStatus: state.subscriptionStatus,
    subscriptionTier: state.subscriptionTier,
    error: state.error,
    hasSession: Boolean(userId),
    refreshEntitlements: fetchEntitlements,
  };
}

