// src/data/protocols.ts
export type Protocol = {
  slug: string;
  title: string;
  version?: string;
  tags?: string[];
  icon: string;
  accentColor: string;
};

export const PROTOCOLS: Protocol[] = [
  {
    slug: "eme",
    title: "État de mal épileptique (EME)",
    version: "V0.1",
    tags: ["neuro", "urgence"],
    icon: "⚡️",
    accentColor: "#6366f1",
  },
  {
    slug: "acr-enfant",
    title: "Arrêt cardiorespiratoire (enfant)",
    version: "V0.1",
    tags: ["réa"],
    icon: "❤️‍🩹",
    accentColor: "#ef4444",
  },
  {
    slug: "choc-hemorragique",
    title: "Choc hémorragique (enfant)",
    version: "V0.1",
    tags: ["hémorragie"],
    icon: "🩸",
    accentColor: "#f97316",
  },
  {
    slug: "anaphylaxie",
    title: "Anaphylaxie (enfant)",
    version: "V0.1",
    tags: ["allergie"],
    icon: "🌿",
    accentColor: "#22c55e",
  },
  {
    slug: "aag",
    title: "Asthme aigu grave (AAG)",
    version: "V0.1",
    tags: ["respiratoire"],
    icon: "💨",
    accentColor: "#0ea5e9",
  },
  {
    slug: "antalgiques",
    title: "Antalgiques (pédiatrie)",
    version: "V0.1",
    tags: ["douleur"],
    icon: "💊",
    accentColor: "#f59e0b",
  },
];
