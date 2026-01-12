"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";

type AllowedCountry = "US" | "CA" | "AU" | "UK" | "IE" | "NZ";

type CountryCfg = {
  id: AllowedCountry;
  name: string;
  dialCode: string;        // without leading +
  dropLeadingZero: boolean;
  nanp?: boolean;          // North American Numbering Plan
};

const COUNTRIES: CountryCfg[] = [
  { id: "US", name: "United States", dialCode: "1",  dropLeadingZero: false, nanp: true },
  { id: "CA", name: "Canada",        dialCode: "1",  dropLeadingZero: false, nanp: true },
  { id: "AU", name: "Australia",     dialCode: "61", dropLeadingZero: true },
  { id: "UK", name: "United Kingdom",dialCode: "44", dropLeadingZero: true },
  { id: "IE", name: "Ireland",       dialCode: "353",dropLeadingZero: true },
  { id: "NZ", name: "New Zealand",   dialCode: "64", dropLeadingZero: true },
];

function findCountryByPrefix(raw: string | null | undefined, allowed: CountryCfg[]): CountryCfg | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  const sorted = [...allowed].sort((a, b) => b.dialCode.length - a.dialCode.length);
  for (const c of sorted) if (digits.startsWith(c.dialCode)) return c;
  return null;
}

function normalizePhoneE164(country: CountryCfg, raw: string): string {
  if (!raw) return "";
  const hasPlus = raw.trim().startsWith("+");
  let digits = raw.replace(/\D/g, "");
  if (hasPlus && digits.startsWith(country.dialCode)) {
    digits = digits.slice(country.dialCode.length);
  }
  if (country.nanp && digits.length === 11 && digits.startsWith("1")) {
    digits = digits.slice(1);
  }
  if (country.dropLeadingZero && digits.length > 1) {
    digits = digits.replace(/^0+/, "");
  }
  return `+${country.dialCode}${digits}`;
}

export default function PhoneInput({
  value,
  onChange,
  allowed = ["US", "CA", "AU", "UK", "IE", "NZ"],
  className,
  onBlur,
}: {
  value: string;
  onChange: (e164: string) => void;
  allowed?: AllowedCountry[];
  className?: string;
  onBlur?: (e164: string) => void;
}) {
  const allowedCountries = useMemo(() => COUNTRIES.filter((c) => allowed.includes(c.id)), [allowed]);
  const [country, setCountry] = useState<CountryCfg>(() => allowedCountries.find((c) => c.id === "AU") || allowedCountries[0]);
  const [national, setNational] = useState<string>("");
  const lastEmitted = useRef<string | null>(null);
  const debounceId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const geoInit = useRef(false);
  const [open, setOpen] = useState(false);

  // UK → GB mapping for react-country-flag
  const flagCode = (id: AllowedCountry) => (id === "UK" ? "GB" : id);

  // Derive initial country/national from incoming value
  useEffect(() => {
    if (!geoInit.current && !value) {
      geoInit.current = true;
      fetch("/api/geo")
        .then(r => r.json())
        .then((d: any) => {
          const found = allowedCountries.find(c => c.id === d.country);
          if (found) setCountry(found);
        })
        .catch(() => {});
    }
    if (!value) return;
    if (lastEmitted.current === value) return;
    const c = findCountryByPrefix(value, allowedCountries);
    if (c) {
      if (country.id !== c.id) setCountry(c);
      const digits = value.replace(/\D/g, "");
      const nationalDigits = digits.startsWith(c.dialCode) ? digits.slice(c.dialCode.length) : digits;
      if (nationalDigits !== national) setNational(nationalDigits);
    } else if (national === "") {
      const cleaned = value.replace(/^\+/, "").replace(/\D/g, "");
      if (cleaned !== national) setNational(cleaned);
    }
  }, [value, allowedCountries, country.id, national]);

  // Emit normalized value when national or country changes
  useEffect(() => {
    const e164 = normalizePhoneE164(country, national);
    if (e164 !== value) {
      if (debounceId.current) clearTimeout(debounceId.current);
      debounceId.current = setTimeout(() => {
        lastEmitted.current = e164;
        onChange(e164);
      }, 180);
    }
    return () => {
      if (debounceId.current) { clearTimeout(debounceId.current); debounceId.current = null; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, national]);

  return (
    <div className={className}>
      {/* Single rounded pill: flag + dial code + chevron | divider | input */}
      <div
        className="flex items-center rounded-2xl border border-black/10 bg-white shadow-sm px-1 py-1 focus-within:ring-4 focus-within:ring-blue-500/15"
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      >
        {/* Country trigger */}
        <div className="relative">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-zinc-50 active:bg-zinc-100"
          >
            <ReactCountryFlag
              svg
              countryCode={flagCode(country.id)}
              title={country.name}
              style={{ width: "18px", height: "14px", borderRadius: "2px" }}
            />
            <span className="text-zinc-600">(+{country.dialCode})</span>
            <svg className="h-4 w-4 text-zinc-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
            </svg>
          </button>

          {open && (
            <div role="listbox" className="absolute z-50 mt-2 w-80 max-h-72 overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-2xl">
              {allowedCountries.map(c => (
                <button
                  key={c.id}
                  type="button"
                  role="option"
                  aria-selected={c.id === country.id}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { setCountry(c); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left ${c.id === country.id ? "bg-zinc-50" : "hover:bg-zinc-50 active:bg-zinc-100"}`}
                >
                  <ReactCountryFlag
                    svg
                    countryCode={flagCode(c.id)}
                    title={c.name}
                    style={{ width: "18px", height: "14px", borderRadius: "2px" }}
                  />
                  <span className="font-medium">{c.name}</span>
                  <span className="ml-auto text-zinc-500">(+{c.dialCode})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-7 bg-zinc-200 mx-2" />

        {/* Phone input */}
        <input
          aria-label="Phone number"
          inputMode="tel"
          autoComplete="tel"
          className="flex-1 px-3 py-2 bg-transparent outline-none text-[15px] placeholder:text-zinc-400"
          placeholder="Mobile number"
          value={national}
          onChange={(e) => {
            const cleaned = e.currentTarget.value.replace(/[^0-9]/g, "");
            setNational(cleaned);
          }}
          onBlur={() => {
            // Flush any pending debounce and emit latest E.164 immediately before external blur handlers run
            const e164 = normalizePhoneE164(country, national);
            if (debounceId.current) { clearTimeout(debounceId.current); debounceId.current = null; }
            if (e164 !== lastEmitted.current) {
              lastEmitted.current = e164;
              onChange(e164);
            }
            onBlur?.(e164);
          }}
        />
      </div>

      {/* Helper line, like your original */}
      <div className="text-xs text-zinc-600 mt-1"></div>
    </div>
  );
}
