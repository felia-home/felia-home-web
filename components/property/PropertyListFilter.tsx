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
      params.delete("page"); // フィルター変更時はページをリセット
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
      className="bg-white rounded-xl border p-4 tb:p-5 mb-6"
      style={{ borderColor: "#E5E5E5" }}
    >
      {/* ヘッダー行 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} style={{ color: "#5BAD52" }} />
          <span className="text-sm font-bold text-gray-700">絞り込み</span>
          {hasFilter && (
            <span
              className="text-xs px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: "#5BAD52" }}
            >
              適用中
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            <span className="font-bold text-gray-700">{total}</span> 件
          </span>
          {hasFilter && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
            >
              <X size={12} />
              クリア
            </button>
          )}
        </div>
      </div>

      {/* フィルター行 */}
      <div className="flex flex-wrap gap-3">
        {/* 現在の絞り込みタグ */}
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

        {/* 物件種別 */}
        <FilterSelect
          label="物件種別"
          value={type || ""}
          options={PROPERTY_TYPES}
          onChange={(v) => updateParam("type", v || null)}
        />

        {/* 価格帯 */}
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

        {/* 間取り */}
        <FilterSelect
          label="間取り"
          value={searchParams.get("layout") || ""}
          options={LAYOUTS}
          onChange={(v) => updateParam("layout", v || null)}
        />

        {/* ソート（右寄せ） */}
        <div className="ml-auto">
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
      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
      style={{ backgroundColor: "#EBF7EA", color: "#5BAD52" }}
    >
      {label}
      <button onClick={onRemove} className="hover:opacity-70">
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
      className="text-sm border rounded-lg px-3 py-1.5 text-gray-600 bg-white cursor-pointer
                 hover:border-felia-green focus:outline-none focus:border-felia-green
                 transition-colors"
      style={{ borderColor: value ? "#5BAD52" : "#E5E5E5" }}
    >
      <option value="">{label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}
