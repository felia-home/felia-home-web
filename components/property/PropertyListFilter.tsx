// components/property/PropertyListFilter.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { SlidersHorizontal, X } from "lucide-react";

const PROPERTY_TYPES = ["戸建て", "マンション", "土地", "収益物件"];
const PRICE_RANGES = [
  { label: "〜3,000万円",     max: 3000 },
  { label: "〜5,000万円",     max: 5000 },
  { label: "〜7,000万円",     max: 7000 },
  { label: "〜1億円",         max: 10000 },
  { label: "1億円以上",       min: 10000 },
];
const LAYOUTS = ["1K/1DK", "1LDK/2DK", "2LDK/3DK", "3LDK以上"];
const SORT_OPTIONS = [
  { value: "newest",     label: "新着順" },
  { value: "price_asc",  label: "価格が安い順" },
  { value: "price_desc", label: "価格が高い順" },
];

export function PropertyListFilter({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const clearAll = () => {
    router.push(pathname);
  };

  const area  = searchParams.get("area");
  const line  = searchParams.get("line");
  const flag  = searchParams.get("flag");
  const type  = searchParams.get("type");
  const sort  = searchParams.get("sort") || "newest";
  const hasFilter = !!(area || line || flag || type ||
    searchParams.get("priceMax") || searchParams.get("layout"));

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        border: "1px solid #E5E5E5",
        padding: "16px",
        marginBottom: "24px",
      }}
    >
      {/* ヘッダー行 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <SlidersHorizontal size={16} style={{ color: "#5BAD52" }} />
          <span
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#444",
            }}
          >
            絞り込み
          </span>
          {hasFilter && (
            <span
              style={{
                fontSize: "11px",
                padding: "2px 8px",
                borderRadius: "9999px",
                color: "#fff",
                backgroundColor: "#5BAD52",
              }}
            >
              適用中
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "14px", color: "#888" }}>
            <span style={{ fontWeight: "bold", color: "#444" }}>{total}</span> 件
          </span>
          {hasFilter && (
            <button
              type="button"
              onClick={clearAll}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                color: "#999",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <X size={12} />
              クリア
            </button>
          )}
        </div>
      </div>

      {/* フィルター行 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
        {area && (
          <ActiveTag label={area} onRemove={() => updateParam("area", null)} />
        )}
        {line && (
          <ActiveTag label={line} onRemove={() => updateParam("line", null)} />
        )}
        {flag && (
          <ActiveTag
            label={flag === "featured" ? "厳選物件" : "新着物件"}
            onRemove={() => updateParam("flag", null)}
          />
        )}

        <FilterSelect
          label="物件種別"
          value={type || ""}
          options={PROPERTY_TYPES}
          onChange={(v) => updateParam("type", v || null)}
        />

        <FilterSelect
          label="価格帯"
          value={searchParams.get("priceMax") || ""}
          options={PRICE_RANGES.map((r) => r.label)}
          onChange={(v) => {
            const found = PRICE_RANGES.find((r) => r.label === v);
            if (found) {
              updateParam("priceMax", found.max ? String(found.max) : null);
              updateParam("priceMin", found.min ? String(found.min) : null);
            } else {
              updateParam("priceMax", null);
              updateParam("priceMin", null);
            }
          }}
        />

        <FilterSelect
          label="間取り"
          value={searchParams.get("layout") || ""}
          options={LAYOUTS}
          onChange={(v) => updateParam("layout", v || null)}
        />

        <div style={{ marginLeft: "auto" }}>
          <FilterSelect
            label="並び順"
            value={sort}
            options={SORT_OPTIONS.map((s) => s.label)}
            onChange={(label) => {
              const found = SORT_OPTIONS.find((s) => s.label === label);
              updateParam("sort", found?.value || "newest");
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ActiveTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "12px",
        padding: "4px 10px",
        borderRadius: "9999px",
        backgroundColor: "#EBF7EA",
        color: "#5BAD52",
      }}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          display: "flex",
          alignItems: "center",
          color: "inherit",
        }}
      >
        <X size={10} />
      </button>
    </span>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        fontSize: "14px",
        border: `1px solid ${value ? "#5BAD52" : "#E5E5E5"}`,
        borderRadius: "8px",
        padding: "6px 12px",
        color: "#555",
        backgroundColor: "#fff",
        cursor: "pointer",
        outline: "none",
        transition: "border-color 0.15s ease",
      }}
    >
      <option value="">{label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}
