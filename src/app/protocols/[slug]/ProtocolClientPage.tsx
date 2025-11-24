"use client";

import type { ComponentType } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Protocol } from "@/data/protocols";
import type { ProtocolSection } from "@/data/protocolDetails";
import { useUserEntitlements } from "@/hooks/useUserEntitlements";

// Flows (bandes + chevrons)
import ProtocolFlowAAG from "@/components/ProtocolFlowAAG";
import ProtocolFlowAnaphylaxie from "@/components/ProtocolFlowAnaphylaxie";
import ProtocolFlowChoc from "@/components/ProtocolFlowChoc";
import ProtocolFlowACR from "@/components/ProtocolFlowACR";
import ProtocolFlowEME from "@/components/ProtocolFlowEME";
import ProtocolFlowCFS from "@/components/ProtocolFlowCFS";
import ProtocolFlowHypoglycemie from "@/components/ProtocolFlowHypoglycemie";
import ProtocolFlowAcidocetose from "@/components/ProtocolFlowAcidocetose";
import ProtocolFlowAntalgiques from "@/components/ProtocolFlowAntalgiques";
import ProtocolFlowBronchiolite from "@/components/ProtocolFlowBronchiolite";
import ProtocolFlowBronchospasme from "@/components/ProtocolFlowBronchospasme";
import ProtocolFlowSepsisPurpura from "@/components/ProtocolFlowSepsisPurpura";
import ProtocolFlowSepsisNeonatal from "@/components/ProtocolFlowSepsisNeonatal";
import ProtocolFlowFievreNourrisson from "@/components/ProtocolFlowFievreNourrisson";
import ProtocolFlowTCC from "@/components/ProtocolFlowTCC";
import ProtocolFlowLaryngite from "@/components/ProtocolFlowLaryngite";
import ProtocolFlowPCB from "@/components/ProtocolFlowPCB";
import ProtocolFlowDeshydratation from "@/components/ProtocolFlowDeshydratation";
import ProtocolFlowDeshydratationSansChoc from "@/components/ProtocolFlowDeshydratationSansChoc";
import ProtocolFlowPneumopathieMyco from "@/components/ProtocolFlowPneumopathieMyco";
import ProtocolFlowMeningite from "@/components/ProtocolFlowMeningite";
import ProtocolFlowMEA from "@/components/ProtocolFlowMEA";
import ProtocolFlowTSV from "@/components/ProtocolFlowTSV";
import ProtocolFlowFAST from "@/components/ProtocolFlowFAST";
import ProtocolFlowPolytrauma from "@/components/ProtocolFlowPolytrauma";
import ProtocolFlowNoyade from "@/components/ProtocolFlowNoyade";
import ProtocolFlowBrulures from "@/components/ProtocolFlowBrulures";
import ProtocolFlowBruluresChimiques from "@/components/ProtocolFlowBruluresChimiques";
import ProtocolFlowInhalationCO from "@/components/ProtocolFlowInhalationCO";
import ProtocolFlowTraumatismeThoracique from "@/components/ProtocolFlowTraumatismeThoracique";
import ProtocolFlowPlaiePenetranteThoracoAbdominale from "@/components/ProtocolFlowPlaiePenetranteThoracoAbdominale";
import ProtocolFlowTraumatismeRachisCervical from "@/components/ProtocolFlowTraumatismeRachisCervical";
import ProtocolFlowCoupDeChaleur from "@/components/ProtocolFlowCoupDeChaleur";
import ProtocolFlowHypothermie from "@/components/ProtocolFlowHypothermie";
import ProtocolFlowIntoxParacetamol from "@/components/ProtocolFlowIntoxParacetamol";
import ProtocolFlowIntoxBZD from "@/components/ProtocolFlowIntoxBZD";
import ProtocolFlowIntoxOpioides from "@/components/ProtocolFlowIntoxOpioides";
import ProtocolFlowCaustiques from "@/components/ProtocolFlowCaustiques";
import ProtocolFlowPileBouton from "@/components/ProtocolFlowPileBouton";
import ProtocolFlowIntoxBBIC from "@/components/ProtocolFlowIntoxBBIC";
import ProtocolFlowCorpsEtrangerInhale from "@/components/ProtocolFlowCorpsEtrangerInhale";
import ProtocolFlowCorpsEtrangerOeso from "@/components/ProtocolFlowCorpsEtrangerOeso";
import ProtocolFlowBRUE from "@/components/ProtocolFlowBRUE";
import ProtocolFlowTVFV from "@/components/ProtocolFlowTVFV";
import ProtocolFlowBradycardie from "@/components/ProtocolFlowBradycardie";
import ProtocolFlowHyperkaliemie from "@/components/ProtocolFlowHyperkaliemie";
import ProtocolFlowHyponatremie from "@/components/ProtocolFlowHyponatremie";
import ProtocolFlowKawasakiChoc from "@/components/ProtocolFlowKawasakiChoc";

// Sections posologie (NOUVEAU rendu V2 depuis le JSON)
import PosologySections from "@/components/PosologySections";

interface ProtocolClientPageProps {
    slug: string;
    protocol: Protocol | null;
    sections: ProtocolSection[];
    error?: string | null;
}

export default function ProtocolClientPage({
    slug,
    protocol,
    sections,
    error: serverError,
}: ProtocolClientPageProps) {
    const router = useRouter();

    const [tab, setTab] = useState<"protocole" | "posologie">("protocole");
    const [showSources, setShowSources] = useState(false);

    // On garde useUserEntitlements pour l'UX (boutons, etc) mais la redirection principale est serveur
    const { canViewPremium } = useUserEntitlements();

    const protocolTitle = protocol?.title;
    const cardError = serverError;

    const FlowBySlug: Record<string, ComponentType | undefined> = {
        aag: ProtocolFlowAAG,
        anaphylaxie: ProtocolFlowAnaphylaxie,
        "choc-hemorragique": ProtocolFlowChoc,
        "acr-enfant": ProtocolFlowACR,
        eme: ProtocolFlowEME,
        "convulsion-febrile-simple": ProtocolFlowCFS,
        hypoglycemie: ProtocolFlowHypoglycemie,
        "deshydratation-aigue-severe": ProtocolFlowDeshydratation,
        "deshydratation-aigue-sans-choc": ProtocolFlowDeshydratationSansChoc,
        "acidocetose-diabetique": ProtocolFlowAcidocetose,
        antalgiques: ProtocolFlowAntalgiques,
        bronchiolite: ProtocolFlowBronchiolite,
        "bronchospasme-nourrisson": ProtocolFlowBronchospasme,
        "fievre-sepsis-purpura": ProtocolFlowSepsisPurpura,
        "sepsis-neonatal-precoce": ProtocolFlowSepsisNeonatal,
        "fievre-nourrisson-moins-3-mois": ProtocolFlowFievreNourrisson,
        "traumatisme-cranien": ProtocolFlowTCC,
        "laryngite-aigue": ProtocolFlowLaryngite,
        "pneumopathie-communautaire-bacterienne": ProtocolFlowPCB,
        "pneumopathie-atypique-mycoplasma": ProtocolFlowPneumopathieMyco,
        "meningite-bacterienne-purulente": ProtocolFlowMeningite,
        "meningo-encephalite-aigue": ProtocolFlowMEA,
        "tachycardie-supraventriculaire": ProtocolFlowTSV,
        "traumatisme-thoraco-abdominal-fast": ProtocolFlowFAST,
        "polytraumatisme-pediatrique": ProtocolFlowPolytrauma,
        "noyade-submersion": ProtocolFlowNoyade,
        "brulures-thermiques-etendues": ProtocolFlowBrulures,
        "brulures-chimiques-pediatriques": ProtocolFlowBruluresChimiques,
        "inhalation-fumees-co": ProtocolFlowInhalationCO,
        "traumatisme-thoracique-pediatrique": ProtocolFlowTraumatismeThoracique,
        "plaie-penetrante-thoraco-abdominale": ProtocolFlowPlaiePenetranteThoracoAbdominale,
        "traumatisme-rachis-cervical": ProtocolFlowTraumatismeRachisCervical,
        "coup-de-chaleur": ProtocolFlowCoupDeChaleur,
        "hypothermie-accidentelle": ProtocolFlowHypothermie,
        "intoxication-paracetamol": ProtocolFlowIntoxParacetamol,
        "intoxication-benzodiazepines": ProtocolFlowIntoxBZD,
        "intoxication-opioides": ProtocolFlowIntoxOpioides,
        "ingestion-caustiques": ProtocolFlowCaustiques,
        "ingestion-pile-bouton": ProtocolFlowPileBouton,
        "intoxication-bb-ic": ProtocolFlowIntoxBBIC,
        "corps-etranger-inhale": ProtocolFlowCorpsEtrangerInhale,
        "corps-etranger-oesophagien": ProtocolFlowCorpsEtrangerOeso,
        "malaise-grave-nourrisson": ProtocolFlowBRUE,
        "troubles-rythme-ventriculaire": ProtocolFlowTVFV,
        "bradycardie-extreme": ProtocolFlowBradycardie,
        "hyperkaliemie-severe": ProtocolFlowHyperkaliemie,
        "hyponatremie-severe": ProtocolFlowHyponatremie,
        "kawasaki-choc": ProtocolFlowKawasakiChoc,
    };
    const Flow = FlowBySlug[slug];

    if (!protocol) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-500 mb-4">Protocole introuvable 😕</p>
                    <button onClick={() => router.push("/?mode=search")} className="underline text-slate-700">
                        Retour
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen w-full flex flex-col items-center bg-slate-50">
            <div className="w-full max-w-[440px] px-6 py-8">
                <button
                    onClick={() => router.push("/?mode=search")}
                    className="text-sm text-slate-500 inline-flex items-center gap-2 mb-5 hover:text-slate-700 transition"
                >
                    ← Retour
                </button>

                <div className="mb-6 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {protocol.icon ? (
                            <div
                                className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-sm"
                                style={{
                                    background: `radial-gradient(circle at 30% 30%, ${protocol.accentColor}22 0%, ${protocol.accentColor}10 100%)`,
                                }}
                                aria-hidden
                            >
                                {protocol.icon}
                            </div>
                        ) : null}
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900">{protocol.title}</h1>
                            {protocol.version && <p className="text-slate-500 text-sm">Version {protocol.version}</p>}
                        </div>
                    </div>
                    {protocol.sources?.length ? (
                        <button
                            onClick={() => setShowSources(true)}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
                        >
                            📚 Sources
                        </button>
                    ) : null}
                </div>

                {cardError && (
                    <div className="mb-6 rounded-2xl border border-rose-200/70 bg-rose-50/80 px-4 py-3 text-sm text-rose-700">
                        Impossible de synchroniser la fiche depuis Supabase. Affichage du contenu local.
                    </div>
                )}

                {/* Tabs */}
                <div className="mb-8">
                    <div className="bg-white border border-slate-200 rounded-full shadow-sm p-1 flex gap-1">
                        <button
                            onClick={() => setTab("protocole")}
                            className={`flex-1 px-5 py-2.5 rounded-full text-sm font-medium transition ${tab === "protocole"
                                    ? "bg-slate-900 text-white shadow"
                                    : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            Protocole
                        </button>
                        <button
                            onClick={() => setTab("posologie")}
                            className={`flex-1 px-5 py-2.5 rounded-full text-sm font-medium transition ${tab === "posologie"
                                    ? "bg-slate-900 text-white shadow"
                                    : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            Posologie
                        </button>
                    </div>
                </div>

                {tab === "protocole" ? (
                    Flow ? (
                        <Flow />
                    ) : (
                        <div className="space-y-4">
                            {sections.map((sec, idx) => (
                                <div key={idx} className="rounded-xl bg-white border border-black/10 shadow-sm px-4 py-3">
                                    <p className="font-medium mb-2">{sec.title}</p>
                                    <ul className="list-disc pl-5 space-y-1 text-slate-700">
                                        {sec.bullets.map((b, i) => (
                                            <li key={i}>{b}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                            {sections.length === 0 && <p className="text-sm text-slate-500">Contenu détaillé à venir.</p>}
                        </div>
                    )
                ) : (
                    // ✅ Rendu POSOLOGIE V2 (depuis posology_normalized.json)
                    <PosologySections slug={slug} />
                )}
                {showSources && protocol.sources?.length ? (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-lg font-semibold text-slate-900">Sources</p>
                                <button
                                    onClick={() => setShowSources(false)}
                                    className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 hover:bg-slate-200"
                                >
                                    Fermer
                                </button>
                            </div>
                            <ul className="space-y-3 text-sm text-slate-700">
                                {protocol.sources.map((source, idx) => (
                                    <li key={idx} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                                        {source.url ? (
                                            <a
                                                href={source.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="underline decoration-dotted underline-offset-2 hover:text-slate-900"
                                            >
                                                {source.label}
                                            </a>
                                        ) : (
                                            <span>{source.label}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : null}
            </div>
        </main>
    );
}
