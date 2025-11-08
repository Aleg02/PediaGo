"use client";

import { useState, useEffect, useMemo } from "react";   // ✅ ← c’est suffisant en Next 16
import AgeWeightPicker from "@/components/AgeWeightPicker";
import SearchBar from "@/components/SearchBar";
import ProtocolCard from "@/components/ProtocolCard";
import Fuse from "fuse.js";
import { PROTOCOLS, type Protocol } from "@/data/protocols";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";


export default function HomePage() {
  const router = useRouter();

  // On lit/écrit dans le store global
  const ageLabel = useAppStore((s) => s.ageLabel);
  const weightKg = useAppStore((s) => s.weightKg);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);
  const setWeightKg = useAppStore((s) => s.setWeightKg);

  // État "search mode" géré localement à la page (pas besoin de global)
  const [searchMode, setSearchMode] = useState(false);
  const [query, setQuery] = useState("");

  // S’assure que les valeurs par défaut existent (au cas où le store est vide)
  useEffect(() => {
    if (ageLabel == null) setAgeLabel("10 mois");
    if (weightKg == null) setWeightKg(10);
  }, [ageLabel, weightKg, setAgeLabel, setWeightKg]);

  const fuse = useMemo(
    () => new Fuse(PROTOCOLS, { keys: ["title", "slug"], threshold: 0.35, ignoreLocation: true }),
    []
  );

  const hits: Protocol[] = useMemo(() => {
    if (query.trim().length < 3) return [];
    return fuse.search(query.trim()).map((r) => r.item);
  }, [fuse, query]);

  const openProtocol = (slug: string) => {
    router.push(`/protocols/${slug}`);
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-[420px] mx-auto px-6">
        <div className={`text-center ${searchMode ? "mt-2" : "mt-6"}`}>
          <h1 className="text-[36px] leading-[1.1] font-semibold tracking-tight">PediaGo</h1>
          <p className="text-slate-500 mt-2">Le bon geste, maintenant !</p>
        </div>

        <div className={`${searchMode ? "mt-2" : "mt-6"}`}>
          <AgeWeightPicker
            ageLabel={ageLabel}
            setAgeLabel={setAgeLabel}
            weightKg={weightKg}
            setWeightKg={setWeightKg}
          />
        </div>

        <SearchBar onFocus={() => setSearchMode(true)} onChange={setQuery} />

        {searchMode && (
          <div className="w-full max-w-[420px] mx-auto mt-6 space-y-3">
            {query.trim().length >= 3 ? (
              hits.length ? (
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
