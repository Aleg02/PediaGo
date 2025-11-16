"use client";

import type { ReactNode } from "react";

import AgeWeightPicker from "@/components/AgeWeightPicker";
import { useAppStore } from "@/store/useAppStore";
import { formatMg } from "@/lib/units";

const MIN_WEIGHT = 3;
const MAX_WEIGHT = 100;
const DEFAULT_WEIGHT = 25;

const clampWeight = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return DEFAULT_WEIGHT;
  return Math.min(Math.max(value as number, MIN_WEIGHT), MAX_WEIGHT);
};

const formatMl = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return "—";
  const v = value as number;
  if (v >= 1000) return `${Number((v / 1000).toFixed(v >= 10000 ? 0 : 1))} L`;
  if (v >= 100) return `${Math.round(v)} mL`;
  return `${Number(v.toFixed(v >= 10 ? 1 : 2))} mL`;
};

const formatMlRange = (min: number, max: number) => {
  return `${formatMl(min)} – ${formatMl(max)}`;
};

function SectionCard({
  title,
  subtitle,
  tone = "slate",
  children,
}: {
  title: string;
  subtitle?: string;
  tone?: "slate" | "red" | "blue" | "emerald" | "amber";
  children: ReactNode;
}) {
  const palette = {
    slate: { header: "from-slate-800 to-slate-900", body: "bg-white border-slate-200" },
    red: { header: "from-rose-500 to-red-500", body: "bg-rose-50 border-rose-200" },
    blue: { header: "from-sky-500 to-blue-500", body: "bg-sky-50 border-sky-200" },
    emerald: { header: "from-emerald-500 to-teal-500", body: "bg-emerald-50 border-emerald-200" },
    amber: { header: "from-amber-500 to-orange-500", body: "bg-amber-50 border-amber-200" },
  }[tone];

  return (
    <div className={`rounded-3xl border ${palette.body} shadow-sm overflow-hidden`}>
      <div className={`bg-gradient-to-r ${palette.header} px-4 py-3 text-white`}>
        <p className="text-sm font-semibold uppercase tracking-wide">{title}</p>
        {subtitle && <p className="text-xs text-white/80">{subtitle}</p>}
      </div>
      <div className="px-4 py-4 text-sm text-slate-800 space-y-3">{children}</div>
    </div>
  );
}

function HighlightCard({ title, items }: { title: string; items: ReactNode[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <ul className="mt-2 list-disc pl-4 space-y-1 text-[13px] text-slate-700">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function ProtocolFlowFAST() {
  const ageLabel = useAppStore((s) => s.ageLabel);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);
  const weightFromStore = useAppStore((s) => s.weightKg);
  const setWeightKg = useAppStore((s) => s.setWeightKg);

  const weightKg = clampWeight(weightFromStore);

  const ketamineDose = weightKg * 2; // mg
  const rocuroniumDose = weightKg * 1; // mg
  const naclBolus = weightKg * 20; // mL
  const glucoseBolus = weightKg * 2; // mL of G10%
  const morphineBolus = weightKg * 0.1;
  const morphineTitration = weightKg * 0.025;
  const rbcMin = weightKg * 10;
  const rbcMax = weightKg * 15;
  const pfcMin = weightKg * 10;
  const pfcMax = weightKg * 15;
  const plateletMin = weightKg * 10;
  const plateletMax = weightKg * 20;

  return (
    <div className="pb-10">
      <div className="rounded-3xl bg-gradient-to-b from-[#991b1b] via-[#b91c1c] to-[#ef4444] px-4 pt-6 pb-5 text-white shadow-sm">
        <h1 className="text-2xl font-extrabold leading-tight">Traumatisme thoraco-abdominal grave – FAST</h1>
        <p className="text-sm text-white/85 mt-1">
          ABCDE systématique + FAST pour guider la chirurgie ou l’imagerie. Stabilisation hémodynamique et contrôle des
          hémorragies selon les recommandations HAS/SFP/SFAR.
        </p>
        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampWeight(v ?? weightKg))}
          />
        </div>
      </div>

      <div className="mt-5 space-y-5">
        <SectionCard title="Évaluation initiale" subtitle="ABCDE + prévention hypothermie" tone="blue">
          <ul className="list-disc pl-4 space-y-1.5">
            <li>
              A : immobilisation tête-cou, aspiration PRN. Préparer IOT si GCS &lt; 9, détresse respiratoire ou choc
              incontrôlé.
            </li>
            <li>
              B : SpO₂ cible 94–98 %. <strong>O₂ 10–15 L/min</strong> si hypoxémie. Auscultation + inspection pour détecter
              pneumothorax ou volet thoracique.
            </li>
            <li>
              C : 2 VVP larges ± IO, monitorage TA, ECG, lactates. <strong>NaCl 0,9 % {formatMl(naclBolus)}</strong> (20 mL/kg)
              puis transfusion si instabilité persistante.
            </li>
            <li>
              D : GCS, pupilles, glycémie capillaire → <strong>G10 % {formatMl(glucoseBolus)}</strong> (2 mL/kg) si &lt; 0,7 g/L.
            </li>
            <li>E : déshabillage complet, recherche plaies pénétrantes, prévention hypothermie.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Airway & induction séquence rapide" subtitle="Objectif : contrôle des VAS" tone="red">
          <div className="grid gap-3 sm:grid-cols-2">
            <HighlightCard
              title="Induction"
              items={[
                (
                  <>
                    Kétamine IV : <strong>{formatMg(ketamineDose)}</strong> (2 mg/kg).
                  </>
                ),
                (
                  <>
                    Rocuronium IV : <strong>{formatMg(rocuroniumDose)}</strong> (1 mg/kg).
                  </>
                ),
              ]}
            />
            <HighlightCard
              title="Points clés"
              items={[
                "Préoxygéner 3 min si possible, maintenir immobilisation cervicale.",
                "Vérifier matériel de ventilation, aspirateur, laryngoscope vidéo.",
                "Prévoir plan B (masque laryngé, cricothyrotomie exceptionnelle).",
              ]}
            />
          </div>
          <p className="text-[13px] text-slate-600">
            Préférer agents hémodynamiquement stables (kétamine) et curare à action rapide. Adapter dose si choc profond.
          </p>
        </SectionCard>

        <SectionCard title="Breathing : thorax" subtitle="Gestion immédiate" tone="amber">
          <div className="grid gap-3 sm:grid-cols-2">
            <HighlightCard
              title="Gestes vitaux"
              items={[
                "Pneumothorax suffocant → décompression aiguille 14–18G au 2e EIC MCL ou 4e–5e EIC antérieur.",
                "Hémothorax massif → drain thoracique + autotransfusion possible.",
                "Volet thoracique / contusion sévère → ventilation assistée + analgésie multimodale.",
              ]}
            />
            <HighlightCard
              title="Analgésie"
              items={[
                (
                  <>
                    Morphine IV initiale : <strong>{formatMg(morphineBolus)}</strong> (0,1 mg/kg).
                  </>
                ),
                (
                  <>
                    Titration : <strong>{formatMg(morphineTitration)}</strong> (0,025 mg/kg) toutes les 5 min selon EVA.
                  </>
                ),
              ]}
            />
          </div>
        </SectionCard>

        <SectionCard title="Circulation & hémorragie" subtitle="Damage Control Resuscitation" tone="emerald">
          <div className="grid gap-3 sm:grid-cols-3 text-[13px]">
            <div className="rounded-2xl border border-emerald-200 bg-white/80 px-3 py-3">
              <p className="text-xs font-semibold text-emerald-800 uppercase">Transfusion</p>
              <ul className="mt-2 space-y-1">
                <li>
                  CGR : <strong>{formatMlRange(rbcMin, rbcMax)}</strong> (10–15 mL/kg).
                </li>
                <li>
                  PFC : <strong>{formatMlRange(pfcMin, pfcMax)}</strong> (10–15 mL/kg).
                </li>
                <li>
                  Plaquettes : <strong>{formatMlRange(plateletMin, plateletMax)}</strong> (10–20 mL/kg).
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-white/80 px-3 py-3">
              <p className="text-xs font-semibold text-emerald-800 uppercase">Objectifs</p>
              <ul className="mt-2 space-y-1">
                <li>PAM selon âge (≥ 60 mmHg nourrisson, ≥ 70 enfant).</li>
                <li>Température &gt; 36 °C, Ca2+ ionisé &gt; 0,9 mmol/L.</li>
                <li>Limiter cristalloïdes, privilégier ratio équilibré.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-white/80 px-3 py-3">
              <p className="text-xs font-semibold text-emerald-800 uppercase">Adjoints</p>
              <ul className="mt-2 space-y-1">
                <li>Acide tranexamique &lt; 3 h après trauma.</li>
                <li>Ceinture pelvienne / pansement compressif si suspicion bassin.</li>
                <li>Transfert bloc ou embolisation selon FAST et disponibilité.</li>
              </ul>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="FAST pédiatrique" subtitle="Échographie ciblée" tone="slate">
          <div className="grid gap-3 sm:grid-cols-2">
            <HighlightCard
              title="Fenêtres"
              items={["Péricarde (tamponnade).", "Foie / rein droit (poche de Morrison).", "Rate / rein gauche, cul-de-sac de Douglas."]}
            />
            <HighlightCard
              title="Interprétation"
              items={[
                "FAST positif + instable → chirurgie / laparotomie immédiate.",
                "FAST positif + stable → scanner TAP dès que possible.",
                "FAST négatif + instable → chercher autre cause de choc (thorax, tamponnade, bassin).",
              ]}
            />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-[13px] text-slate-700">
            FAST négatif chez patient stable n’exclut pas une lésion : surveillance clinique rapprochée ± scanner différé si
            douleur abdominale, hématurie ou enzymes hépatiques élevées.
          </div>
        </SectionCard>

        <SectionCard title="Orientation" subtitle="Thorax vs abdomen" tone="blue">
          <div className="grid gap-3 sm:grid-cols-2">
            <HighlightCard
              title="Traumatisme thoracique"
              items={[
                "O₂ haut débit, monitorage continue, drains selon besoin.",
                "Ventilation assistée pour volet thoracique ou contusion sévère.",
                "Transfert centre thoracique si hémorragie persistante ou lésion vasculaire.",
              ]}
            />
            <HighlightCard
              title="Traumatisme abdominal"
              items={[
                "Hémopéritoine suspecté → FAST prioritaire, remplissage + transfusion.",
                "Instable malgré réanimation → chirurgie damage control.",
                "Lésions hépatiques/spléniques stables → PEC conservatrice avec surveillance continue.",
              ]}
            />
          </div>
        </SectionCard>

        <SectionCard title="Situations particulières" subtitle="Adapter les volumes" tone="amber">
          <ul className="list-disc pl-4 space-y-1.5 text-[13px]">
            <li>Nourrisson : bolus limités à 20 mL/kg avant transfusion, hypovolémie rapide.</li>
            <li>Traumatisme pénétrant : FAST très sensible, chirurgie plus probable.</li>
            <li>Polytraumatisé : appliquer Damage Control Resuscitation (transfusion précoce, ratio équilibré, hypothermie évitée).</li>
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
