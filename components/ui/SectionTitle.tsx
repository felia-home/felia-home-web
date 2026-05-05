// components/ui/SectionTitle.tsx

interface SectionTitleProps {
  en: string;         // 英字大見出し（例: "Felia Selection"）
  ja: string;         // 日本語サブタイトル（例: "厳選物件情報"）
  align?: "left" | "center";
}

export function SectionTitle({ en, ja, align = "center" }: SectionTitleProps) {
  const textAlign = align === "center" ? "center" : "left";

  return (
    <div style={{ marginBottom: "32px", textAlign }}>
      <h2
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: "bold",
          fontSize: "clamp(28px, 4vw, 48px)",
          letterSpacing: "0.1em",
          color: "#5BAD52",
          margin: 0,
          lineHeight: 1.1,
        }}
      >
        {en}
      </h2>
      <p
        style={{
          marginTop: "8px",
          fontSize: "clamp(13px, 1.4vw, 16px)",
          color: "#888",
          letterSpacing: "0.2em",
        }}
      >
        {ja}
      </p>
      <div
        style={{
          marginTop: "12px",
          marginLeft: align === "center" ? "auto" : "0",
          marginRight: align === "center" ? "auto" : "0",
          width: "40px",
          height: "3px",
          backgroundColor: "#5BAD52",
        }}
      />
    </div>
  );
}
