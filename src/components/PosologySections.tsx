"use client";

import { useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import {
  findPosoByWeight,
  entriesOfSection,
  unitLine,
  formatNum,
  calcVolumeFromConc,
} from "@/data/posology";

// Protocole → sections à afficher (ajuste si besoin)
const SECTION_MAP: Record<string, string[]> = {
  aag: [
    "constantes",
    "iot",
    "isr",
    "perfusion_transfusion",
    "sedation",
    "etat_de_choc",
    "exacerbation_asthme",
  ],
  anaphylaxie: ["constantes", "iot", "etat_de_choc", "divers"],
  "choc-hemorragique": ["constantes", "perfusion_transfusion", "etat_de_choc"],
  "acr-enfant": ["constantes", "acr"],
  eme: ["constantes", "eme", "sedation"],
};

// Titres lisibles
const TITLES: Record<string, string> = {
  constantes: "CONSTANTES",
  iot: "IOT",
  isr: "ISR",
  perfusion_transfusion: "PERF / TRANSF",
  sedation: "SÉDATION",
  etat_de_choc: "ÉTAT DE CHOC",
  exacerbation_asthme: "EXACERBATION ASTHME",
  acr: "ACR",
  eme: "EME",
  divers: "DIVERS",
};

type Props = { slug: string };

export default function PosologySections({ slug }: Props) {
  const weightKg = useAppStore((s) => s.weightKg) ?? 10;
  const setWeightKg = useAppStore((s) => s.setWeightKg);

  const entry = useMemo(() => findPosoByWeight(weightKg), [weightKg]);
  const sectionsToShow = SECTION_MAP[slug] ?? [];

  return (
    <div className="space-y-6">
      {/* Barre de poids en haut */}
      <div>
        <label className="text-slate-600 text-sm">Poids (kg)</label>
        <input
          type="number"
          min={1}
          value={weightKg}
          onChange={(e) => setWeightKg(Number(e.target.value))}
          className="mt-1 w-full rounded-full border border-black/10 shadow-sm px-4 py-2"
        />
      </div>

      {!entry ? (
        <div className="text-sm text-slate-500">
          Aucune donnée posologique disponible pour {formatNum(weightKg, 0)} kg.
        </div>
      ) : (
        sectionsToShow.map((secKey) => (
          <SectionBlock key={secKey} entry={entry} sectionKey={secKey} />
        ))
      )}
    </div>
  );
}

/* =======================
   Rendu d’une section
   ======================= */
function SectionBlock({ entry, sectionKey }: { entry: any; sectionKey: string }) {
  const title = TITLES[sectionKey] ?? sectionKey.toUpperCase();

  // CONSTANTES
  if (sectionKey === "constantes") {
    const c = entry.constantes ?? entry.data?.constantes;
    return (
      <Card title={title}>
        <Rows>
          <Row label="FC" value={c?.fc_min && c?.fc_max ? `${c.fc_min}-${c.fc_max}/min` : c?.fc ?? "—"} />
          <Row label="PAS" value={c?.pas ? `${c.pas} mmHg` : "—"} />
          <Row label="FR" value={c?.fr ? `${c.fr}/min` : c?.fr_text ?? "—"} />
        </Rows>
      </Card>
    );
  }

  // IOT
  if (sectionKey === "iot") {
    const i = entry.iot ?? entry.data?.iot;
    return (
      <Card title={title}>
        <Rows>
          <Row label="Lame" value={i?.lame ?? "—"} />
          <Row
            label="Tube"
            value={i?.tube ? `${i.tube.type ?? ""} ${i.tube.size ?? ""}`.trim() : i?.sit ?? "—"}
          />
          <Row label="Distance" value={i?.distance_cm ? `${i.distance_cm} cm` : i?.distance ?? "—"} />
          <Row label="SNG" value={i?.sng_ch ? `${i.sng_ch} CH` : i?.sng ?? "—"} />
        </Rows>
      </Card>
    );
  }

  // Récupérer la section "brute" (pour détecter si ce sont des valeurs texte)
  const raw =
    (entry.sections && entry.sections[sectionKey]) ??
    entry[sectionKey] ??
    (entry.data && entry.data[sectionKey]) ??
    null;

  // 1) Cas “liste clé → texte” (ex. perfusion_transfusion)
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const entries = Object.entries(raw);
    const allStrings = entries.length > 0 && entries.every(([, v]) => typeof v === "string");
    if (allStrings) {
      return (
        <Card title={title} divided>
          {entries.map(([k, v]) => (
            <SimpleLine key={k} name={labelize(k)} text={String(v)} />
          ))}
        </Card>
      );
    }
  }

  // 2) Cas “sous-objets” (médicaments, posologies détaillées)
  const pairs = entriesOfSection(entry, sectionKey);
  if (pairs.length > 0) {
    return (
      <Card title={title} divided>
        {pairs.map(([key, obj]) => (
          <DrugLine key={key} name={labelize(key)} data={obj} />
        ))}
      </Card>
    );
  }

  // 3) Fallback texte si structure atypique
  return (
    <Card title={title}>
      <pre className="px-4 py-3 text-xs text-slate-600 whitespace-pre-wrap">
        {raw ? (typeof raw === "object" ? JSON.stringify(raw, null, 2) : String(raw)) : "—"}
      </pre>
    </Card>
  );
}

/* =======================
   Lignes de rendu
   ======================= */

function SimpleLine({ name, text }: { name: string; text: string }) {
  return (
    <div className="px-4 py-3 text-sm">
      <div className="font-medium">{name}</div>
      <div className="text-xs text-slate-600 mt-1">• {text}</div>
    </div>
  );
}

function DrugLine({ name, data }: { name: string; data: any }) {
  // 1) Affichage numérique si présent (JSON normalisé)
  const dose =
    data?.dose_mg ??
    data?.dose_ug ??
    data?.dose_mg_per_h ??
    data?.dose_ug_per_min ??
    data?.dose_ug_per_kg_per_min ??
    data?.dose_mg_per_kg ??
    undefined;

  const doseUnit =
    typeof data?.dose_mg === "number" ? "mg" :
    typeof data?.dose_ug === "number" ? "µg" :
    typeof data?.dose_mg_per_h === "number" ? "mg/h" :
    typeof data?.dose_ug_per_min === "number" ? "µg/min" :
    typeof data?.dose_ug_per_kg_per_min === "number" ? "µg/kg/min" :
    typeof data?.dose_mg_per_kg === "number" ? "mg/kg" :
    undefined;

  const vol = data?.volume_ml as number | undefined;
  const rate = data?.rate_ml_per_h as number | undefined;
  const conc =
    data?.prep?.final_conc_mg_per_ml ??
    data?.prep?.stock_conc_mg_per_ml ??
    undefined;
  const computedVol = vol == null ? calcVolumeFromConc(data?.dose_mg, conc) : undefined;

  // 2) Si pas de champs numériques, afficher les champs texte de tes cartes
  const textFields: { label: string; key: string }[] = [
    { label: "Dose", key: "dose" },
    { label: "Bolus", key: "bolus" },
    { label: "Continu", key: "continu" },
    { label: "Volume", key: "volume" },
    { label: "Débit", key: "debit" },
    { label: "Dilution", key: "dilution" },
    { label: "Forme", key: "forme" },
    { label: "Prépa", key: "prep_text" },
    { label: "Durée", key: "duration" },
    { label: "Note", key: "note" },
    // suffixes *text génériques
    { label: "Dose", key: "dose_text" },
    { label: "Débit", key: "rate_text" },
  ];
  const hasNumeric =
    typeof dose === "number" ||
    typeof vol === "number" ||
    typeof rate === "number" ||
    typeof computedVol === "number";

  return (
    <div className="px-4 py-3 text-sm text-slate-800">
      <div className="font-medium">{name}</div>

      {/* Bloc numérique (si dispo) */}
      {hasNumeric && (
        <div className="mt-1 grid grid-cols-1 gap-1 text-[13px] text-slate-700">
          {typeof dose === "number" && (
            <div>
              <span className="text-slate-500">Dose&nbsp;:&nbsp;</span>
              <strong>{unitLine(dose, doseUnit)}</strong>
              {typeof data?.admin_over_min === "number" && (
                <span className="text-slate-500">
                  {" "}
                  sur {formatNum(data.admin_over_min, 0)} min
                </span>
              )}
            </div>
          )}

          {(typeof vol === "number" || typeof computedVol === "number") && (
            <div>
              <span className="text-slate-500">Volume&nbsp;:&nbsp;</span>
              <strong>{formatNum(vol ?? computedVol, 2)} mL</strong>
              {typeof conc === "number" && (
                <span className="text-slate-500"> @ {formatNum(conc, 2)} mg/mL</span>
              )}
            </div>
          )}

          {typeof rate === "number" && (
            <div>
              <span className="text-slate-500">Débit&nbsp;:&nbsp;</span>
              <strong>{formatNum(rate, 2)} mL/h</strong>
            </div>
          )}
        </div>
      )}

      {/* Bloc texte (si présent) */}
      <div className="mt-2 space-y-1 text-xs text-slate-600">
        {textFields.map(({ label, key }) =>
          typeof data?.[key] === "string" && data[key].trim() !== "" ? (
            <div key={key}>• {label} : {data[key]}</div>
          ) : null
        )}
      </div>
    </div>
  );
}

/* =======================
   Composants UI
   ======================= */
function Card({ title, children, divided = false }: { title: string; children: React.ReactNode; divided?: boolean }) {
  return (
    <div className="rounded-xl bg-white border border-black/10 shadow-sm">
      <div className="px-4 py-2 border-b text-xs tracking-wide text-slate-600">{title}</div>
      <div className={divided ? "divide-y" : ""}>{children}</div>
    </div>
  );
}
function Rows({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-3 text-sm text-slate-800 space-y-1">{children}</div>;
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

/* =======================
   Helpers libellés
   ======================= */
function labelize(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\bivse\b/i, "IVSE")
    .replace(/\bae\b/i, "AE")
    .replace(/\biv\b/i, "IV")
    .replace(/\bmgso4\b/i, "MgSO₄")
    .replace(/\bcee\b/i, "CEE")
    .replace(/\bid\b/i, "ID")
    .replace(/\bch\b/i, "CH")
    .replace(/\bpas\b/i, "PAS")
    .replace(/\bfr\b/i, "FR")
    .replace(/^\w/, (m) => m.toUpperCase());
}
