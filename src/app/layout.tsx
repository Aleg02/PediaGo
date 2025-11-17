// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { Session } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import './globals.css';
import TopMenu from '@/components/TopMenu';
import SupabaseProvider from '@/components/SupabaseProvider';

// Métadonnées et police restent inchangées...
export const metadata: Metadata = {
  title: 'PediaGo',
  description: 'Le bon geste, maintenant !',
};

const inter = Inter({ subsets: ['latin'], display: 'swap' });

// Remplace createServerComponentClient(...)
async function getInitialSession(): Promise<Session | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getInitialSession();

  return (
    <html lang="fr">
      <body className={`${inter.className} bg-neutral-100 text-slate-900`}>
        <SupabaseProvider initialSession={session}>
          <TopMenu />
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
