// components/home/AccessSection.tsx
import { MapPin, Phone, Clock, CalendarX } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getCompanyInfo } from "@/lib/api";

// Google Maps が未設定の場合のフォールバック用デフォルト値
const DEFAULT_COMPANY = {
  name: "株式会社フェリアホーム",
  address: "東京都 ※住所を設定してください",
  phone: "03-XXXX-XXXX",
  hours: "10:00〜18:00",
  holiday: "水曜日・年末年始",
  access: "※アクセス方法を設定してください",
  lat: 35.6762,
  lng: 139.6503,
  licenseNumber: "東京都知事（X）第XXXXX号",
};

export async function AccessSection() {
  let company = DEFAULT_COMPANY;
  try {
    const data = await getCompanyInfo();
    if (data) company = { ...DEFAULT_COMPANY, ...data };
  } catch {
    // Admin APIが未起動の場合はデフォルト値を使用
  }

  const mapsEmbedUrl = `https://maps.google.com/maps?q=${company.lat},${company.lng}&z=16&output=embed`;

  return (
    <section className="section-padding" style={{ backgroundColor: "#F8F8F8" }}>
      <div className="container-content">
        <SectionTitle en="Access" ja="会社情報・アクセス" />

        <div className="grid grid-cols-1 tb:grid-cols-2 gap-8 tb:gap-12 items-start">

          {/* 左: 店舗情報 */}
          <div>
            <div
              className="bg-white rounded-xl p-6 tb:p-8 border"
              style={{ borderColor: "#E5E5E5" }}
            >
              {/* 会社名 */}
              <h3
                className="font-bold text-xl tb:text-2xl mb-6 pb-4 border-b"
                style={{ color: "#333333", borderColor: "#E5E5E5" }}
              >
                {company.name}
              </h3>

              {/* 情報リスト */}
              <dl className="space-y-4">
                <InfoRow icon={MapPin} label="所在地" value={company.address} />
                <InfoRow icon={Phone} label="電話番号" value={company.phone} isPhone />
                <InfoRow icon={Clock} label="営業時間" value={company.hours} />
                <InfoRow icon={CalendarX} label="定休日" value={company.holiday} />
              </dl>

              {/* アクセス */}
              {company.access && company.access !== DEFAULT_COMPANY.access && (
                <div className="mt-5 pt-5 border-t" style={{ borderColor: "#E5E5E5" }}>
                  <p className="text-xs font-bold text-gray-400 tracking-widest mb-2">ACCESS</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{company.access}</p>
                </div>
              )}

              {/* 免許番号 */}
              <p className="mt-5 pt-4 border-t text-xs text-gray-400" style={{ borderColor: "#F0F0F0" }}>
                宅地建物取引業 {company.licenseNumber}
              </p>
            </div>

            {/* 電話CTA */}
            <a
              href={`tel:${company.phone.replace(/-/g, "")}`}
              className="mt-4 flex items-center justify-center gap-3 w-full py-4 rounded-xl font-bold text-white transition-all hover:scale-[1.02]"
              style={{
                backgroundColor: "#5BAD52",
                boxShadow: "0 4px 12px rgba(91,173,82,0.3)",
              }}
            >
              <Phone size={20} />
              <span className="text-lg tracking-wider">{company.phone}</span>
            </a>
          </div>

          {/* 右: Google Maps */}
          <div
            className="rounded-xl overflow-hidden border"
            style={{ borderColor: "#E5E5E5", aspectRatio: "4/3" }}
          >
            {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
              <iframe
                src={mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${company.name}の地図`}
              />
            ) : (
              // APIキー未設定時のプレースホルダー
              <div
                className="w-full h-full flex flex-col items-center justify-center gap-3"
                style={{ backgroundColor: "#E8F5E8" }}
              >
                <MapPin size={40} style={{ color: "#5BAD52" }} />
                <p className="text-sm text-gray-500 text-center">
                  Google Maps を表示するには<br />
                  <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                  </code><br />
                  を .env.local に設定してください
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

// 情報行コンポーネント
function InfoRow({
  icon: Icon,
  label,
  value,
  isPhone = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  isPhone?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
        style={{ backgroundColor: "#EBF7EA" }}
      >
        <Icon size={14} style={{ color: "#5BAD52" }} />
      </div>
      <div>
        <dt className="text-xs text-gray-400 tracking-widest mb-0.5">{label}</dt>
        <dd className="text-sm font-medium text-gray-700">
          {isPhone ? (
            <a
              href={`tel:${value.replace(/-/g, "")}`}
              className="hover:underline"
              style={{ color: "#5BAD52" }}
            >
              {value}
            </a>
          ) : (
            value
          )}
        </dd>
      </div>
    </div>
  );
}
