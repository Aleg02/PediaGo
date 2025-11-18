// src/lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

// Fonction utilitaire pour créer un client Supabase côté serveur
export async function createServerSupabaseClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies();   // cookies() est asynchrone sur Next 16

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: CookieOptions) => {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // cookies() ne peut pas écrire depuis un Server Component ; on ignore l’erreur
          }
        },
        remove: (name: string, options: CookieOptions) => {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // idem, on ignore l’erreur côté Server Component
          }
        }
      }
    }
  );
}
