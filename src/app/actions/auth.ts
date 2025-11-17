// src/app/actions/auth.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database';

export async function logoutAction() {
  // On crée le client Supabase via notre helper SSR
  const supabase = await createServerSupabaseClient();

  // Déconnexion de l’utilisateur
  await supabase.auth.signOut();

  // Invalidation du cache des pages concernées
  revalidatePath('/');
  revalidatePath('/mon-compte');
}
