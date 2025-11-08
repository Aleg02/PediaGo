"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { PROTOCOLS } from "@/data/protocols";
import { computeDose } from "@/lib/dosing";


export default function ProtocolPage() {
  const router = useRouter();
  const { slug } = useParams() as { slug: string };

  const protocol = PROTOCOLS.find(p => p.slug === slug);

  const [tab, setTab] = useState<"protocole" | "posologie">("protocole");
  const [weightKg, setWeightKg] = useState<number>(10); // pour test

  if (!protocol) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Protocole introuvable 😕</p>
          <button
            onClick={() => router.push("/")}
            className="underline text-slate-700"
          >
            Retour
          </button>
        </div>
      </main>
    );
  }

  // contenu factice (tu rempliras avec les vrais PDF ensuite)
  const steps = [
    "Libération des voies aériennes",
    "Oxygène, monitoring, VVP",
    "Traitement spécifique selon cause",
  ];

  // posologie fictive : Adrénaline 0,01 mg/kg IM
  const adrDose = computeDose(weightKg, { mg_per_kg: 0.01, per_dose: true });

  return (
    <main className="min-h-screen w-full flex flex-col items-center">
      <div className="w-full max-w-[420px] px-6 py-8">
        <button
          onClick={() => router.push("/")}
          className="text-sm text-slate-500 underline mb-4"
        >
          ← Retour
        </button>

        <h1 className="text-2xl font-semibold mb-2">{protocol.title}</h1>
        <p className="text-slate-500 text-sm mb-4">Version {protocol.version}</p>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setTab("protocole")}
            className={`px-4 py-2 rounded-full ${
              tab === "protocole"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            Protocole
          </button>
          <button
            onClick={() => setTab("posologie")}
            className={`px-4 py-2 rounded-full ${
              tab === "posologie"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            Posologie
          </button>
        </div>

        {/* Contenu */}
        {tab === "protocole" ? (
          <div className="space-y-3">
            {steps.map((s, i) => (
              <div
                key={i}
                className="rounded-xl bg-white border border-black/10 shadow-sm px-4 py-3"
              >
                {s}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl bg-white border border-black/10 shadow-sm px-4 py-3">
              <p className="font-medium mb-1">Adrénaline IM</p>
              <p className="text-sm text-slate-600">
                0,01 mg/kg → <strong>{adrDose.toFixed(2)} mg</strong> pour {weightKg} kg
              </p>
            </div>

            <div className="mt-4">
              <label className="text-slate-600 text-sm">Modifier le poids</label>
              <input
                type="number"
                min="1"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="mt-1 w-full rounded-full border border-black/10 shadow-sm px-4 py-2"
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
