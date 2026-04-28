// components/home/AccessSection.tsx
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getCompanyInfo, getCompanyBranches } from "@/lib/api";
import { MapPin, Phone, Clock, Calendar, Building2 } from "lucide-react";

export async function AccessSection() {
  const [company, branches] = await Promise.all([
    getCompanyInfo(),
    getCompanyBranches(),
  ]);

  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const mainStore = {
    name:    company?.name    ?? "株式会社フェリアホーム",
    address: company?.address ?? "",
    phone:   company?.phone   ?? "",
    hours:   company?.hours   ?? "",
    holiday: company?.holiday ?? "",
    license: company?.license ?? "",
    lat:     company?.lat     ?? 35.6773,
    lng:     company?.lng     ?? 139.6858,
    access_text: company?.access_text ?? "",
  };

  const activeBranches = branches
    .filter((b) => b.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);

  const mapSrc = (lat: number, lng: number) =>
    mapsKey
      ? `https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${lat},${lng}&zoom=16`
      : null;

  return (
    <section style={{ padding: "64px 0", backgroundColor: "#F8F8F8" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <SectionTitle en="Access" ja="会社情報・アクセス" />

        {/* 本店 */}
        <StoreSection
          store={mainStore}
          mapSrc={mapSrc(mainStore.lat, mainStore.lng)}
          showLicense
          label="本店"
        />

        {/* 支店 */}
        {activeBranches.map((branch) => (
          <StoreSection
            key={branch.id}
            store={{
              name: branch.name,
              address: branch.address,
              phone: branch.phone ?? "",
              hours: mainStore.hours,
              holiday: mainStore.holiday,
              license: "",
              lat: branch.lat ?? 35.6773,
              lng: branch.lng ?? 139.6858,
              access_text: branch.access_text ?? "",
            }}
            mapSrc={mapSrc(branch.lat ?? 35.6773, branch.lng ?? 139.6858)}
            showLicense={false}
            label="支店"
          />
        ))}
      </div>
    </section>
  );
}

function StoreSection({
  store,
  mapSrc,
  showLicense,
  label,
}: {
  store: {
    name: string;
    address: string;
    phone: string;
    hours: string;
    holiday: string;
    license: string;
    lat: number;
    lng: number;
    access_text: string;
  };
  mapSrc: string | null;
  showLicense: boolean;
  label: string;
}) {
  return (
    <div style={{ marginBottom: "48px" }}>
      {/* 店舗ラベル */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <span style={{
          backgroundColor: "#5BAD52", color: "#fff",
          fontSize: "11px", padding: "3px 10px",
          borderRadius: "20px", fontWeight: "bold",
          fontFamily: "'Montserrat', sans-serif",
          letterSpacing: "0.05em",
        }}>
          {label.toUpperCase()}
        </span>
        <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#1a1a1a", margin: 0 }}>
          {store.name}
        </h3>
      </div>

      <div
        className="access-store-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px",
          alignItems: "start",
        }}
      >
        {/* 会社情報カード */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "28px",
          border: "1px solid #E5E5E5",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <InfoRow icon={<MapPin size={16} style={{ color: "#5BAD52" }} />} label="所在地" value={store.address} />
            <InfoRow icon={<Phone size={16} style={{ color: "#5BAD52" }} />} label="電話番号" value={store.phone} isPhone />
            <InfoRow icon={<Clock size={16} style={{ color: "#5BAD52" }} />} label="営業時間" value={store.hours} />
            <InfoRow icon={<Calendar size={16} style={{ color: "#5BAD52" }} />} label="定休日" value={store.holiday} />
            {showLicense && store.license && (
              <InfoRow icon={<Building2 size={16} style={{ color: "#5BAD52" }} />} label="宅建業免許" value={store.license} />
            )}
            {store.access_text && (
              <InfoRow icon={<MapPin size={16} style={{ color: "#5BAD52" }} />} label="アクセス" value={store.access_text} />
            )}
          </div>

          {store.phone && (
            <a
              href={`tel:${store.phone.replace(/-/g, "")}`}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "8px", marginTop: "20px", padding: "14px",
                borderRadius: "12px", backgroundColor: "#5BAD52",
                color: "white", fontWeight: "bold", fontSize: "18px",
                textDecoration: "none",
              }}
            >
              <Phone size={20} />
              {store.phone}
            </a>
          )}
        </div>

        {/* Google Maps */}
        <div style={{
          borderRadius: "16px", overflow: "hidden",
          border: "1px solid #E5E5E5", aspectRatio: "4/3",
          backgroundColor: "#EBF7EA",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {mapSrc ? (
            <iframe
              src={mapSrc}
              width="100%" height="100%"
              style={{ border: 0, display: "block" }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div style={{ textAlign: "center", color: "#666", fontSize: "13px", padding: "24px" }}>
              <MapPin size={32} style={{ color: "#5BAD52", margin: "0 auto 8px", display: "block" }} />
              <p>地図を表示できません</p>
            </div>
          )}
        </div>
      </div>
    </div>
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
          <p style={{ fontSize: "14px", color: "#333", fontWeight: "500", margin: 0, lineHeight: 1.6 }}>{value}</p>
        )}
      </div>
    </div>
  );
}
