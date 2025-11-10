"use client";

import * as React from "react";

type Tone =
  | "default"
  | "constantes"
  | "isr"
  | "sedation"
  | "perf"
  | "choc"
  | "asthme";

const toneBg: Record<Tone, string> = {
  default: "bg-white",
  constantes: "bg-slate-50",
  isr: "bg-amber-50/60",
  sedation: "bg-violet-50/70",
  perf: "bg-sky-50/70",
  choc: "bg-rose-50/70",
  asthme: "bg-emerald-50/70",
};

const toneBadge: Record<Tone, string> = {
  default: "bg-slate-100 text-slate-600",
  constantes: "bg-slate-200 text-slate-700",
  isr: "bg-amber-100 text-amber-800",
  sedation: "bg-violet-100 text-violet-800",
  perf: "bg-sky-100 text-sky-800",
  choc: "bg-rose-100 text-rose-800",
  asthme: "bg-emerald-100 text-emerald-800",
};

export default function SectionCard({
  title,
  tone = "default",
  children,
  className = "",
}: {
  title: string;
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-2xl border border-black/10 shadow-sm ${toneBg[tone]} ${className}`}
    >
      <div
        className={`absolute -top-2 left-3 rounded-full px-3 py-1 text-[11px] font-medium tracking-wide ${toneBadge[tone]} shadow-sm`}
      >
        {title}
      </div>
      <div className="px-4 pt-5 pb-3">{children}</div>
    </div>
  );
}

/* Lignes compactes (clé → valeur) */
export function KV({
  k,
  v,
  bold = false,
}: {
  k: string;
  v: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1 text-[15px] leading-5">
      <span className="text-slate-500">{k}</span>
      <span className={bold ? "font-semibold" : "font-medium"}>{v}</span>
    </div>
  );
}

/* Lignes texte simples (une ligne, style description) */
export function Line({ children }: { children: React.ReactNode }) {
  return <div className="py-1 text-[15px] text-slate-800">{children}</div>;
}

/* Micro note grise (sous-ligne) */
export function Note({ children }: { children: React.ReactNode }) {
  return <div className="mt-1 text-[12px] text-slate-500">{children}</div>;
}
