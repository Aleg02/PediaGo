"use client";

import { useEffect, useMemo, useState } from "react";
import AgeWeightPicker from "@/components/AgeWeightPicker";
import SearchBar from "@/components/SearchBar";
import ProtocolCard from "@/components/ProtocolCard";
import Fuse from "fuse.js";
import { PROTOCOLS, type Protocol } from "@/data/protocols";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  // Valeurs par défaut du mockup
  const [ageLabel, setAgeLabel] = useState<string | null>("10 mois");
  const [weightKg, setWeightKg] = useState<number | null>(10);

  // État "search mode"
  const [searchMode, setSearchMode] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (ageLabel === "10 mois" && weightKg == null) setWeightKg(10);
  }, [ageLabel, weightKg]);

  // Index Fuse (recherche floue)
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
    if (query.trim().length < 3) return [];
    return fuse.search(query.trim()).map((r) => r.item);
  }, [fuse, query]);

  const openProtocol = (slug: string) => {
    // On navigue vers la page protocole
    router.push(`/protocols/${slug}`);
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-[420px] mx-auto px-6">
        {/* Titre + sous-titre */}
        <div className={`text-center ${searchMode ? "mt-2" : "mt-6"}`}>
          <h1 className="text-[36px] leading-[1.1] font-semibold tracking-tight">PediaGo</h1>
          <p className="text-slate-500 mt-2">Le bon geste, maintenant !</p>
        </div>

        {/* Âge / Poids */}
        <div className={`${searchMode ? "mt-2" : "mt-6"}`}>
          <AgeWeightPicker
            ageLabel={ageLabel}
            setAgeLabel={setAgeLabel}
            weightKg={weightKg}
            setWeightKg={setWeightKg}
          />
        </div>

        {/* Barre de recherche */}
        <SearchBar
          onFocus={() => setSearchMode(true)}
          onChange={setQuery}
          autoFocus={false}
          value=""
        />

        {/* Zone “Search mode” */}
        {searchMode && (
          <div className="w-full max-w-[420px] mx-auto mt-6 space-y-3">
            {query.trim().length >= 3 ? (
              hits.length > 0 ? (
                <div className="space-y-3">
                  {hits.map((p) => (
                    <ProtocolCard key={p.slug} item={p} onOpen={openProtocol} />
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-500 text-sm">
                  Aucun protocole ne correspond à « {query} ».
                </div>
              )
            ) : (
              <p className="text-center text-sm text-slate-500">
                Tape au moins <strong>3</strong> caractères (ex. “ana”, “acr”, “asthme”).
              </p>
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

        <div className="h-16" />
      </div>
    </main>
  );
}
