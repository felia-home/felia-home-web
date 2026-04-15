// components/home/AccessSection.tsx
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getCompanyInfo } from "@/lib/api";
import { MapPin, Phone, Clock, Calendar, Building2 } from "lucide-react";

export async function AccessSection() {
  const company = await getCompanyInfo();

  const name    = company?.name    ?? "株式会社フェリアホーム";
  const address = company?.address ?? "東京都 ※住所を設定してください";
  const phone   = company?.phone   ?? "03-XXXX-XXXX";
  const hours   = company?.hours   ?? "10:00〜18:00";
  const holiday = company?.holiday ?? "水曜日・年末年始";
  const license = company?.license ?? "";
  const lat     = company?.lat     ?? 35.6773;
  const lng     = company?.lng     ?? 139.6858;

  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapSrc  = mapsKey
    ? `https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${lat},${lng}&zoom=16`
    : null;

  return (
    <section style={{ padding: "64px 0", backgroundColor: "#F8F8F8" }}>
      <div className="container-content">
        <SectionTitle en="Access" ja="会社情報・アクセス" />
        <div
          className="grid grid-cols-1 tb:grid-cols-2"
          style={{ gap: "32px", alignItems: "start" }}
        >
          {/* 会社情報カード */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "32px",
            border: "1px solid #E5E5E5",
          }}>
            <h3 style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#1a1a1a",
              marginBottom: "24px",
              paddingBottom: "12px",
              borderBottom: "1px solid #F0F0F0",
            }}>
              {name}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <InfoRow icon={<MapPin size={16} style={{ color: "#5BAD52" }} />} label="所在地" value={address} />
              <InfoRow icon={<Phone size={16} style={{ color: "#5BAD52" }} />} label="電話番号" value={phone} isPhone />
              <InfoRow icon={<Clock size={16} style={{ color: "#5BAD52" }} />} label="営業時間" value={hours} />
              <InfoRow icon={<Calendar size={16} style={{ color: "#5BAD52" }} />} label="定休日" value={holiday} />
              {license && (
                <InfoRow icon={<Building2 size={16} style={{ color: "#5BAD52" }} />} label="宅建業免許" value={license} />
              )}
            </div>

            <a
              href={`tel:${phone.replace(/-/g, "")}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "24px",
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "#5BAD52",
                color: "white",
                fontWeight: "bold",
                fontSize: "18px",
                textDecoration: "none",
              }}
            >
              <Phone size={20} />
              {phone}
            </a>
          </div>

          {/* Google Maps */}
          <div style={{
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid #E5E5E5",
            aspectRatio: "4/3",
            backgroundColor: "#EBF7EA",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {mapSrc ? (
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div style={{ textAlign: "center", color: "#666", fontSize: "13px", padding: "24px" }}>
                <MapPin size={32} style={{ color: "#5BAD52", margin: "0 auto 8px", display: "block" }} />
                <p>Google Maps を表示するには</p>
                <code style={{ fontSize: "11px", display: "block", margin: "4px 0" }}>
                  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                </code>
                <p>を .env.local に設定してください</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ icon, label, value, isPhone }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isPhone?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
      <div style={{ marginTop: "2px", flexShrink: 0 }}>{icon}</div>
      <div>
        <p style={{ fontSize: "11px", color: "#999", marginBottom: "2px" }}>{label}</p>
        {isPhone ? (
          <a
            href={`tel:${value.replace(/-/g, "")}`}
            style={{ fontSize: "15px", fontWeight: "600", color: "#5BAD52", textDecoration: "none" }}
          >
            {value}
          </a>
        ) : (
          <p style={{ fontSize: "14px", color: "#333", fontWeight: "500" }}>{value}</p>
        )}
      </div>
    </div>
  );
}
