"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PROTOCOLS } from "@/data/protocols";
import { PROTOCOL_DETAILS } from "@/data/protocolDetails";
import { DRUGS, DOSING_RULES, WEIGHT_OVERRIDES, PROTOCOL_DRUGS } from "@/data/drugs";
import { computeDose } from "@/lib/dosing";

export default function ProtocolPage() {
  const router = useRouter();
  const { slug } = useParams() as { slug: string };

  const protocol = PROTOCOLS.find((p) => p.slug === slug);
  const sections = PROTOCOL_DETAILS[slug] ?? [];
  const drugIds = PROTOCOL_DRUGS[slug] ?? [];

  const [tab, setTab] = useState<"protocole" | "posologie">("protocole");
  const [weightKg, setWeightKg] = useState<number>(10); // TODO: on branchera avec l'accueil plus tard

  const drugs = useMemo(() => DRUGS.filter(d => drugIds.includes(d.id)), [drugIds]);

  if (!protocol) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Protocole introuvable 😕</p>
          <button onClick={() => router.push("/")} className="underline text-slate-700">Retour</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center">
      <div className="w-full max-w-[420px] px-6 py-8">
        <button onClick={() => router.push("/")} className="text-sm text-slate-500 underline mb-4">
          ← Retour
        </button>

        <h1 className="text-2xl font-semibold mb-2">{protocol.title}</h1>
        {protocol.version && <p className="text-slate-500 text-sm mb-4">Version {protocol.version}</p>}

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setTab("protocole")}
            className={`px-4 py-2 rounded-full ${tab === "protocole" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}
          >
            Protocole
          </button>
          <button
            onClick={() => setTab("posologie")}
            className={`px-4 py-2 rounded-full ${tab === "posologie" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}
          >
            Posologie
          </button>
        </div>

        {/* Contenu */}
        {tab === "protocole" ? (
          <div className="space-y-4">
            {sections.map((sec, idx) => (
              <div key={idx} className="rounded-xl bg-white border border-black/10 shadow-sm px-4 py-3">
                <p className="font-medium mb-2">{sec.title}</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  {sec.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            ))}
            {sections.length === 0 && (
              <p className="text-sm text-slate-500">Contenu détaillé à venir.</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Poids modifiable localement (on synchronisera plus tard via store/global) */}
            <div>
              <label className="text-slate-600 text-sm">Poids (kg)</label>
              <input
                type="number"
                min="1"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="mt-1 w-full rounded-full border border-black/10 shadow-sm px-4 py-2"
              />
            </div>

            {/* Doses calculées pour chaque médicament du protocole */}
            {drugs.map((d) => {
              const rule = DOSING_RULES[d.id];
              const overrides = WEIGHT_OVERRIDES[d.id] ?? [];
              const result = rule ? computeDose(weightKg, rule, overrides) : null;

              return (
                <div key={d.id} className="rounded-xl bg-white border border-black/10 shadow-sm px-4 py-3">
                  <p className="font-medium">{d.name}{d.route ? ` — ${d.route}` : ""}</p>

                  {!result ? (
                    <p className="text-sm text-slate-600 mt-1">Règle non définie.</p>
                  ) : Number.isNaN(result.doseMg) ? (
                    <p className="text-sm text-slate-600 mt-1">{result.note ?? "Voir protocole."}</p>
                  ) : (
                    <div className="text-sm text-slate-700 mt-1">
                      Dose : <strong>{result.doseMg}</strong> mg pour {weightKg} kg
                      {result.frequency && <> — <span className="text-slate-500">{result.frequency}</span></>}
                      <div className="text-xs text-slate-500 mt-1">
                        source: {result.source}{result.note ? ` — ${result.note}` : ""}
                        {result.route ? ` — voie ${result.route}` : ""}
                        {result.maxDailyMg ? ` — max/jour: ${Math.round(result.maxDailyMg)} mg` : ""}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {drugs.length === 0 && (
              <p className="text-sm text-slate-500">Aucun médicament lié à ce protocole (à compléter).</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
