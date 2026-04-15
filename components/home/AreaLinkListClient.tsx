// components/home/AreaLinkListClient.tsx
"use client";

interface AreaLink {
  id: string;
  area_name: string;
  href: string;
}

interface AreaLinkListClientProps {
  areas: AreaLink[];
}

export function AreaLinkListClient({ areas }: AreaLinkListClientProps) {
  const fallbackAreas = [
    "渋谷区","新宿区","杉並区","世田谷区",
    "文京区","豊島区","中野区","目黒区",
    "北区","板橋区","練馬区","品川区",
    "港区","大田区","千代田区","中央区",
  ];

  const items = areas.length > 0
    ? areas
    : fallbackAreas.map((name) => ({
        id: name,
        area_name: name,
        href: `/areas/${encodeURIComponent(name)}`,
      }));

  return (
    <div>
      <p
        style={{
          fontSize: "13px",
          color: "#666",
          marginBottom: "16px",
          fontWeight: "500",
        }}
      >
        エリアを選択して物件を探す
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {items.map((area) => (
          <a
            key={area.id}
            href={area.href}
            style={{
              display: "inline-block",
              padding: "8px 16px",
              borderRadius: "24px",
              border: "1px solid #E5E5E5",
              fontSize: "13px",
              color: "#333",
              textDecoration: "none",
              transition: "all 0.2s ease",
              backgroundColor: "white",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#5BAD52";
              e.currentTarget.style.color = "#5BAD52";
              e.currentTarget.style.backgroundColor = "#EBF7EA";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E5E5E5";
              e.currentTarget.style.color = "#333";
              e.currentTarget.style.backgroundColor = "white";
            }}
          >
            {area.area_name}
          </a>
        ))}
      </div>
    </div>
  );
}
