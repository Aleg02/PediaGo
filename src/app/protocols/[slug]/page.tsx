import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { PROTOCOLS } from "@/data/protocols";
import { PROTOCOL_DETAILS } from "@/data/protocolDetails";
import ProtocolClientPage from "./ProtocolClientPage";
import type { Protocol } from "@/data/protocols";
import type { ProtocolSection } from "@/data/protocolDetails";

// Types pour les données Supabase
type CardRow = {
  id: string;
  slug: string;
  protocol: string | null;
  title: string;
  version: string | null;
  tags: string[] | null;
  icon: string | null;
  accent_color: string | null;
  sources: { label: string; url?: string }[] | null;
  content: Record<string, unknown> | null;
  is_premium: boolean;
};

type SupabaseCardSectionRow = {
  id: string;
  title: string;
  body: string | null;
  content: { bullets?: unknown } | null;
  position: number | null;
};

type CardWithSectionsRow = CardRow & {
  card_sections?: SupabaseCardSectionRow[] | null;
};

// Mappers (dupliqués de cardsClient.ts car on ne peut pas importer du code client-side facilement si il utilise des hooks ou autre, 
// mais cardsClient utilise supabaseFetch qui est safe. Cependant, ici on utilise AdminClient).
function mapCardRow(row: CardRow): Protocol {
  return {
    slug: row.slug || row.protocol || row.id,
    title: row.title,
    version: row.version ?? undefined,
    tags: row.tags ?? undefined,
    icon: row.icon ?? "🩺",
    accentColor: row.accent_color ?? "#0ea5e9",
    accessLevel: row.is_premium ? "premium" : "free",
    sources: Array.isArray(row.sources) && row.sources.length > 0 ? row.sources : undefined,
  };
}

function mapSections(rows: SupabaseCardSectionRow[]): ProtocolSection[] {
  return rows
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((row) => ({
      title: row.title,
      bullets: extractBullets(row),
    }))
    .filter((section) => section.bullets.length > 0);
}

function extractBullets(row: SupabaseCardSectionRow): string[] {
  const fromContent = Array.isArray(row.content?.bullets)
    ? (row.content?.bullets as unknown[]).filter((item): item is string => typeof item === "string")
    : [];

  if (fromContent.length > 0) {
    return fromContent;
  }

  return row.body ? [row.body] : [];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  // 1. Récupérer la session utilisateur (pour vérifier les droits)
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  // 2. Récupérer la fiche via Admin Client (pour contourner RLS et voir si elle est premium)
  // On utilise Admin car si l'utilisateur n'est pas premium, RLS masquerait la fiche premium,
  // et on ne pourrait pas distinguer "404" de "403".
  const adminClient = getSupabaseAdminClient();

  const { data: cards, error } = await adminClient
    .from("cards")
    .select("*, card_sections(*)")
    .eq("slug", slug)
    .limit(1);

  const cardRow = cards?.[0] as CardWithSectionsRow | undefined;

  // Fallback local si pas de DB ou erreur
  const fallbackProtocol = PROTOCOLS.find((p) => p.slug === slug);
  const fallbackSections = PROTOCOL_DETAILS[slug] ?? [];

  let protocol: Protocol | null = null;
  let sections: ProtocolSection[] = [];

  if (cardRow) {
    protocol = mapCardRow(cardRow);
    sections = mapSections(cardRow.card_sections ?? []);
  } else if (fallbackProtocol) {
    protocol = fallbackProtocol;
    sections = fallbackSections;
  }

  // 3. Vérification des droits et Redirection
  if (protocol?.accessLevel === "premium") {
    let canViewPremium = false;

    if (session?.user) {
      // Vérifier les entitlements via la vue (en utilisant le client authentifié ou admin)
      // On utilise admin pour être sûr de lire la vue pour cet utilisateur
      const { data } = await adminClient
        .from("user_entitlements")
        .select("can_view_premium")
        .eq("user_id", session.user.id)
        .maybeSingle();

      // Cast explicite pour éviter l'erreur de type 'never' si l'inférence échoue
      const entitlement = data as { can_view_premium: boolean | null } | null;
      canViewPremium = entitlement?.can_view_premium ?? false;
    }

    if (!canViewPremium) {
      const target = protocol.title ?? slug;
      redirect(`/subscribe?reason=premium&slug=${encodeURIComponent(target)}`);
    }
  }

  return (
    <ProtocolClientPage
      slug={slug}
      protocol={protocol}
      sections={sections}
      error={error?.message}
    />
  );
}
