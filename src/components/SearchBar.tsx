"use client";
import { useState, type RefObject } from "react";

type Props = {
  onFocus?: () => void;
  onChange?: (q: string) => void;
  onClear?: () => void;
  autoFocus?: boolean;
  value?: string;
  className?: string;
  inputRef?: RefObject<HTMLInputElement | null>;
};

export default function SearchBar({
  onFocus,
  onChange,
  onClear,
  autoFocus,
  value,
  className,
  inputRef,
}: Props) {
  const [internalValue, setInternalValue] = useState(value ?? "");
  const isControlled = value !== undefined;
  const inputValue = isControlled ? value : internalValue;
  const showClear = inputValue.length > 0;

  return (
    <div className={`w-full max-w-[420px] mx-auto ${className ?? "mt-8"}`}>
      <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 focus-within:border-blue-500/50 focus-within:shadow-[0_8px_30px_rgba(37,99,235,0.12)] focus-within:ring-4 focus-within:ring-blue-500/10 hover:border-slate-300 hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)]">
        <input
          ref={inputRef}
          type="search"
          className="w-full bg-transparent px-5 py-4 pl-12 text-[16px] font-medium leading-6 text-slate-900 placeholder:text-slate-400 focus:outline-none"
          placeholder="Rechercher un protocole..."
          value={inputValue}
          autoFocus={autoFocus}
          onFocus={onFocus}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              inputRef?.current?.blur();
              event.currentTarget.blur();
            }
          }}
          onChange={(e) => {
            const nextValue = e.target.value;
            setInternalValue(nextValue);
            onChange?.(nextValue);
          }}
          aria-label="Rechercher un protocole"
        />
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {showClear && (
          <button
            type="button"
            onClick={() => {
              setInternalValue("");
              onChange?.("");
              onClear?.();
              inputRef?.current?.focus();
            }}
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600 active:scale-95"
            aria-label="Effacer la recherche"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
