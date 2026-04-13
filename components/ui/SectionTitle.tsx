// components/ui/SectionTitle.tsx

interface SectionTitleProps {
  en: string;         // 英字大見出し（例: "Felia Selection"）
  ja: string;         // 日本語サブタイトル（例: "厳選物件情報"）
  align?: "left" | "center";
}

export function SectionTitle({ en, ja, align = "center" }: SectionTitleProps) {
  const alignClass = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`mb-8 tb:mb-12 ${alignClass}`}>
      <h2
        className="font-montserrat font-bold text-3xl tb:text-4xl pc:text-5xl tracking-wider text-felia-green"
        style={{ fontFamily: "'Montserrat', sans-serif", color: "#5BAD52" }}
      >
        {en}
      </h2>
      <p className="mt-2 text-sm tb:text-base text-gray-500 tracking-widest">
        {ja}
      </p>
      <div
        className="mt-3 mx-auto"
        style={{
          width: align === "center" ? "40px" : "40px",
          marginLeft: align === "left" ? "0" : "auto",
          height: "3px",
          backgroundColor: "#5BAD52",
        }}
      />
    </div>
  );
}
