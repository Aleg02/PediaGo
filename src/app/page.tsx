"use client";

import { useState, useEffect, useMemo } from "react";
import AgeWeightPicker from "@/components/AgeWeightPicker";
import SearchBar from "@/components/SearchBar";
import ProtocolCard from "@/components/ProtocolCard";
import Fuse from "fuse.js";
import { PROTOCOLS, type Protocol } from "@/data/protocols";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import Disclaimer from "@/components/Disclaimer";

export default function HomePage() {
  const router = useRouter();

  // store global
  const ageLabel = useAppStore((s) => s.ageLabel);
  const weightKg = useAppStore((s) => s.weightKg);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);
  const setWeightKg = useAppStore((s) => s.setWeightKg);

  // état page
  const [searchMode, setSearchMode] = useState(false);
  const [query, setQuery] = useState("");

  // valeurs par défaut
  useEffect(() => {
    if (ageLabel == null && weightKg == null) {
      setAgeLabel("10 mois");
      setWeightKg(10);
    }
  }, [ageLabel, weightKg, setAgeLabel, setWeightKg]);

  // index Fuse
  const fuse = useMemo(
    () =>
      new Fuse(PROTOCOLS, {
        keys: ["title", "slug"],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    []
  );

  const hits: Protocol[] = useMemo(() => {
    const q = query.trim();
    if (q.length === 0) {
      return [...PROTOCOLS].sort((a, b) =>
        a.title.localeCompare(b.title, "fr", { sensitivity: "base" })
      );
    }
    return fuse.search(q).map((r) => r.item);
  }, [fuse, query]);

  const openProtocol = (slug: string) => {
    router.push(`/protocols/${slug}`);
  };

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* --- HEADER : titre / slogan en haut --- */}
      <header className="w-full max-w-[420px] mx-auto text-center mt-8 px-6">
        <h1 className="text-[36px] leading-[1.1] font-semibold tracking-tight">PediaGo</h1>
        <p className="text-slate-500 mt-2 text-base">Le bon geste, maintenant !</p>
      </header>

      {/* --- BLOC CENTRAL (âge/poids + recherche + résultats/disclaimer) --- */}
      <section className="w-full max-w-[420px] mx-auto px-6 flex-1 flex flex-col items-center">
        <div className="w-full mt-40 space-y-4">
          {/* Âge / Poids */}
          <AgeWeightPicker
            ageLabel={ageLabel}
            setAgeLabel={setAgeLabel}
            weightKg={weightKg}
            setWeightKg={setWeightKg}
          />

          {/* Barre de recherche juste sous âge/poids */}
          <SearchBar
            onFocus={() => setSearchMode(true)}
            onChange={(value) => {
              setQuery(value);
              if (value.trim().length === 0) {
                setSearchMode(false);
              } else {
                setSearchMode(true);
              }
            }}
            autoFocus={false}
            value={query}
          />

          {/* HOME : disclaimer directement sous la barre */}
          {!searchMode && (
            <Disclaimer className="mt-10" />
          )}

          {/* MODE RECHERCHE : résultats sous la barre */}
          {searchMode && (
            <div className="mt-6 space-y-3">
              {hits.length > 0 ? (
                hits.map((p) => (
                  <ProtocolCard key={p.slug} item={p} onOpen={openProtocol} />
                ))
              ) : (
                <div className="text-center text-slate-500 text-sm">
                  Aucun protocole ne correspond à « {query} ».
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={() => {
                    setSearchMode(false);
                    setQuery("");
                  }}
                  className="mt-6 text-slate-600 underline underline-offset-4"
                >
                  Quitter le mode recherche
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MODE RECHERCHE : disclaimer collé en bas */}
      {searchMode && (
        <footer className="mt-auto w-full max-w-[420px] mx-auto px-6 mb-4">
          <Disclaimer />
        </footer>
      )}
    </main>
  );
}
