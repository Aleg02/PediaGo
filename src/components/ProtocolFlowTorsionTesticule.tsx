"use client";

import { useEffect } from "react";

import AgeWeightPicker, { estimateAgeFromWeight } from "@/components/AgeWeightPicker";
import { FlowBlock, FlowChevron, FlowRibbon } from "@/components/flow/FlowParts";
import { formatMg } from "@/lib/units";
import { useAppStore } from "@/store/useAppStore";

const MIN_W = 3;
const MAX_W = 120;
const DEFAULT_W = 30;

const clampWeight = (value: number | null | undefined) => {
    if (!Number.isFinite(value ?? NaN)) return DEFAULT_W;
    return Math.min(Math.max(value as number, MIN_W), MAX_W);
};

const formatMl = (value: number) => {
    if (value < 1) return `${Number(value.toFixed(2))} mL`;
    if (value < 10) return `${Number(value.toFixed(1))} mL`;
    return `${Math.round(value)} mL`;
};

export default function ProtocolFlowTorsionTesticule() {
    const weightFromStore = useAppStore((s) => s.weightKg);
    const setWeightKg = useAppStore((s) => s.setWeightKg);
    const ageLabel = useAppStore((s) => s.ageLabel);
    const setAgeLabel = useAppStore((s) => s.setAgeLabel);

    const weightKg = clampWeight(weightFromStore);

    useEffect(() => {
        if (!ageLabel) {
            const estimated = estimateAgeFromWeight(weightKg);
            if (estimated) setAgeLabel(estimated);
        }
    }, [ageLabel, setAgeLabel, weightKg]);

    const paracetamolDose = Math.min(weightKg * 15, 1000);
    const nalbuphineDose = Math.min(weightKg * 0.2, 20);
    const morphineBolus = Math.min(weightKg * 0.1, 5);
    const bolusNacl = weightKg * 20;

    return (
        <div className="pb-8">
            <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-red-900 to-rose-800 px-4 pt-6 pb-5 text-white shadow-sm">
                <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Urologie · Chirurgie</p>
                <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">Torsion du cordon spermatique</h1>
                <p className="text-sm text-white/85 mt-1">
                    Tout scrotum aigu est une torsion jusqu'à preuve chirurgicale du contraire. Urgence absolue {"<"} 6h.
                </p>

                <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
                    <AgeWeightPicker
                        ageLabel={ageLabel ?? ""}
                        setAgeLabel={(v) => setAgeLabel(v)}
                        weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
                        setWeightKg={(v) => setWeightKg(clampWeight(v ?? weightKg))}
                    />
                </div>
                <p className="mt-3 text-[13px] text-white/80">Version 2025 – EAU, ESPU, AFU, HAS.</p>
            </div>

            <div className="mt-5 space-y-5">
                <div className="space-y-3">
                    <FlowRibbon
                        title="Signes d'appel & Anamnèse"
                        subtitle="Tableau brutal"
                        gradient="from-amber-500 via-orange-500 to-rose-500"
                    />
                    <FlowBlock
                        title="Symptômes"
                        items={[
                            "Douleur brutale, unilatérale, intense, scrotale ou inguinale.",
                            "Irradiations fosse iliaque ou lombaire (attention douleur abdo isolée chez le petit).",
                            "Nausées/vomissements fréquents (réaction vagale).",
                            "Souvent au réveil (torsion nocturne) ou post-trauma mineur.",
                            "Absence de fièvre et de brûlures mictionnelles généralement.",
                        ]}
                    />
                </div>

                <FlowChevron />

                <div className="space-y-3">
                    <FlowRibbon
                        title="Examen Physique"
                        subtitle="Signes clés"
                        gradient="from-red-600 via-rose-600 to-orange-600"
                    />
                    <FlowBlock
                        title="Inspection / Palpation"
                        items={[
                            "Testicule rétracté à l'anneau (ascensionné) et horizontalisé.",
                            "Testicule très douloureux, augmenté de volume.",
                            "Cordon spermatique épaissi, tours de spire parfois palpables.",
                            "Scrotum inflammatoire/œdème : signe tardif de mauvais pronostic.",
                        ]}
                    />
                    <FlowBlock
                        title="Réflexe Crémastérien"
                        items={[
                            "⚠️ ABOLI du côté atteint (Signe le plus sensible > 95%).",
                            "Gratter face interne cuisse → absence d'ascension testiculaire = très évocateur.",
                        ]}
                    />
                </div>

                <FlowChevron />

                <div className="space-y-3">
                    <FlowRibbon
                        title="Diagnostics Différentiels"
                        subtitle="Scrotum aigu"
                        gradient="from-slate-500 via-slate-600 to-slate-700"
                    />
                    <FlowBlock
                        title="Torsion d'Hydatide"
                        items={[
                            "Douleur plus progressive, pôle supérieur.",
                            "\"Blue Dot Sign\" (tache bleutée visible par transparence).",
                            "Réflexe crémastérien conservé.",
                        ]}
                    />
                    <FlowBlock
                        title="Orchi-épididymite"
                        items={[
                            "Rare avant puberté (sauf malformation).",
                            "Fièvre, brûlures mictionnelles (BU+).",
                            "Signe de Prehn POSITIF (soulagement au soulèvement) - aggrave la torsion.",
                        ]}
                    />
                    <FlowBlock
                        title="Hernie inguinale étranglée"
                        items={["Masse inguinale douloureuse, irréductible, signes occlusifs."]}
                    />
                </div>

                <FlowChevron />

                <div className="space-y-3">
                    <FlowRibbon
                        title="Stratégie & Règle des 6H"
                        subtitle="Urgence chirurgicale"
                        gradient="from-emerald-500 via-teal-500 to-cyan-500"
                    />
                    <FlowBlock
                        title="Pronostic"
                        items={[
                            "< 6h : > 90% sauvetage.",
                            "12h : < 50% sauvetage.",
                            "24h : < 10% (atrophie quasi certaine).",
                        ]}
                    />
                    <FlowBlock
                        title="Place de l'Imagerie (Écho-Doppler)"
                        items={[
                            "⚠️ NE DOIT JAMAIS RETARDER L'EXPLORATION CHIRURGICALE.",
                            "Indication : Uniquement si doute sérieux ET délai court (< 4h).",
                            "Signes : Absence flux artériel, \"Whirlpool sign\".",
                            "Piège : Flux conservé n'élimine pas une torsion intermittente/incomplète.",
                        ]}
                    />
                </div>

                <FlowChevron />

                <div className="space-y-3">
                    <FlowRibbon
                        title="Mesures Immédiates (Pré-op)"
                        subtitle="Mise en condition"
                        gradient="from-sky-500 via-cyan-500 to-blue-600"
                    />
                    <FlowBlock
                        title="Actions"
                        items={[
                            "Mise à jeun stricte immédiate.",
                            "Pose VVP systématique.",
                            "Bilan pré-op (Groupe, Rh, RAI, Coag).",
                            "BU pour éliminer infection urinaire.",
                        ]}
                    />
                    <FlowBlock
                        title="Remplissage (si besoin)"
                        items={[
                            <>Si choc vagal ou jeûne prolongé : NaCl 0,9% 20 mL/kg → <strong>{formatMl(bolusNacl)}</strong>.</>,
                        ]}
                    />
                </div>

                <FlowChevron />

                <div className="space-y-3">
                    <FlowRibbon
                        title="Antalgie IV"
                        subtitle="AINS contre-indiqués (chirurgie)"
                        gradient="from-purple-500 via-fuchsia-500 to-rose-500"
                    />
                    <FlowBlock
                        title="Paracétamol"
                        items={[
                            <>15 mg/kg IV → <strong>{formatMg(paracetamolDose)}</strong> (max 1 g) toutes les 6h.</>,
                        ]}
                    />
                    <FlowBlock
                        title="Nalbuphine (douleur modérée/sévère)"
                        items={[
                            <>0,2 mg/kg IV → <strong>{formatMg(nalbuphineDose)}</strong> (max 20 mg) toutes les 4-6h.</>,
                        ]}
                    />
                    <FlowBlock
                        title="Morphine (douleur intense)"
                        items={[
                            <>Bolus initial 0,1 mg/kg IV → <strong>{formatMg(morphineBolus)}</strong> (max 5 mg sauf surveillance spécifique).</>,
                            "Titration possible selon protocole douleur.",
                        ]}
                    />
                </div>

                <FlowChevron />

                <div className="space-y-3">
                    <FlowRibbon
                        title="Traitement Chirurgical"
                        subtitle="Exploration scrotale"
                        gradient="from-indigo-500 via-blue-500 to-sky-500"
                    />
                    <FlowBlock
                        title="Geste"
                        items={[
                            "Voie d'abord scrotale ou inguinale.",
                            "Détorsion du cordon et vérification vitalité (recoloration).",
                            "Orchidopexie (fixation) bilatérale systématique.",
                            "Orchidectomie si nécrose avérée.",
                        ]}
                    />
                    <FlowBlock
                        title="Manœuvre externe"
                        items={[
                            "Tentative de détorsion manuelle (\"Livre ouvert\") uniquement si délai chirurgical inévitable.",
                            "Ne remplace PAS la chirurgie et la fixation.",
                        ]}
                    />
                </div>

                <FlowChevron />

                <div className="space-y-3">
                    <FlowRibbon
                        title="Arbre Décisionnel"
                        subtitle="Synthèse"
                        gradient="from-slate-900 via-gray-800 to-slate-700"
                    />
                    <FlowBlock
                        title="Suspicion Forte"
                        items={[
                            "Réflexe aboli + Testicule ascensionné + Douleur brutale.",
                            "👉 Mettre à jeun + VVP + Analgésie + Appel CHIRURGIEN Immédiat + BLOC (Pas d'imagerie).",
                        ]}
                    />
                    <FlowBlock
                        title="Doute Clinique / Atypique"
                        items={[
                            "👉 Échographie Doppler en URGENCE.",
                            "Flux absent/Whirlpool → BLOC.",
                            "Flux présent mais douleur persistante → Avis Urologue (Exploration probable).",
                            "Hyperhémie + Infection → Traitement médical (Orchi-épididymite).",
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}
