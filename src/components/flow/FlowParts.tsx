// src/components/flow/FlowParts.tsx
import React from "react";

export function FlowBlock({
  title,
  subtitle,
  items,
  bg = "bg-white",
}: {
  title: string;
  subtitle?: string;
  items?: string[];
  bg?: string;
}) {
  return (
    <div className={`rounded-xl border border-black/10 shadow-sm ${bg} px-4 py-3`}>
      <p className="font-medium">{title}</p>
      {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
      {items?.length ? (
        <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-700">
          {items.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function FlowRibbon({
  title,
  subtitle,
  gradient,
  rightBadge,
  leftAsideTitle,
  leftAsideItems,
  items,
}: {
  title: string;
  subtitle?: string;
  gradient: string; // ex: "from-indigo-400 via-sky-400 to-cyan-400"
  rightBadge?: string;
  leftAsideTitle?: string;
  leftAsideItems?: string[];
  items?: string[];
}) {
  const hasAside = Boolean(leftAsideTitle) || Boolean(leftAsideItems?.length);

  return (
    <div className="relative">
      <div
        className={`rounded-xl border border-black/10 shadow-sm bg-gradient-to-r ${gradient} text-white px-4 py-3`}
      >
        <div className={hasAside ? "flex flex-col gap-4 sm:flex-row" : "space-y-2"}>
          <div className="flex-1 space-y-1.5">
            <p className="font-medium">{title}</p>
            {subtitle && <p className="text-sm/5 text-white/90">{subtitle}</p>}
            {items?.length ? (
              <ul className="mt-1 list-disc pl-5 space-y-1 text-white/90 text-sm">
                {items.map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
            ) : null}
          </div>
          {hasAside && (
            <div className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white/90 shadow-inner sm:w-56">
              {leftAsideTitle && <p className="text-xs font-semibold uppercase tracking-wide text-white/80">{leftAsideTitle}</p>}
              {leftAsideItems?.length ? (
                <ul className="mt-2 list-disc space-y-1.5 pl-4">
                  {leftAsideItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}
        </div>
      </div>
      {rightBadge && (
        <span className="absolute -right-2 -top-2 rounded-full bg-slate-900 text-white text-[11px] px-2 py-1 shadow">
          {rightBadge}
        </span>
      )}
    </div>
  );
}

export function FlowChevron() {
  return (
    <div className="flex justify-center -my-1">
      {/* chevron vers le bas */}
      <svg width="20" height="20" viewBox="0 0 24 24" className="text-slate-400">
        <path
          d="M6 9l6 6 6-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
