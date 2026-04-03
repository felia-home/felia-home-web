import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import InquiryButton from "./InquiryButton";

export const dynamic = "force-dynamic";

type PrivateProperty = {
  id: string;
  property_no: string;
  property_type?: string;
  area?: string;
  town?: string;
  price?: number;
  price_display?: string;
  area_land_m2?: number;
  area_build_m2?: number;
  commission?: string;
  note?: string;
  is_land: boolean;
  is_house: boolean;
  is_mansion: boolean;
};

async function getPrivateProperties(): Promise<PrivateProperty[]> {
  try {
    const res = await fetch(
      `${process.env.ADMIN_API_URL}/api/private-properties?filter=ACTIVE`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.properties ?? [];
  } catch {
    return [];
  }
}

export default async function MypagePrivatePropertiesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const properties = await getPrivateProperties();

  return (
    <div className="bg-[#fafaf8] min-h-screen pt-24 pb-16">
      <div className="container-xl">
        <div className="flex items-center gap-2 text-xs text-[#706e68] mb-6">
          <Link href="/mypage" className="hover:text-[#c9a96e]">マイページ</Link>
          <span>›</span>
          <span>未公開物件</span>
        </div>

        <div className="mb-8">
          <p className="text-[#c9a96e] text-xs tracking-[0.4em] mb-2 font-serif">MEMBERS ONLY</p>
          <h1 className="font-serif text-3xl font-bold">未公開物件</h1>
          <p className="text-sm text-[#706e68] mt-2">
            会員限定の非公開物件情報です。取り扱いにご注意ください。
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          ⚠️ この情報は会員限定です。外部への転載・共有はお控えください。
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#e8e6e0]">
            <div className="w-16 h-16 bg-[#faf6ee] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
              </svg>
            </div>
            <p className="text-[#706e68] mb-2">現在、未公開物件を準備中です。</p>
            <Link href="/contact" className="mt-2 inline-block text-[#c9a96e] hover:underline text-sm">
              物件についてお問合せ →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => {
              const propType = property.is_land ? "土地" : property.is_mansion ? "マンション" : "戸建て";
              return (
                <div key={property.id} className="bg-white rounded-2xl border border-[#e8e6e0] overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-[#1a3a2a] px-5 py-3 flex items-center justify-between">
                    <span className="text-[#c9a96e] text-xs font-bold tracking-wider">{propType}</span>
                    <span className="bg-[#c9a96e]/20 text-[#c9a96e] text-xs px-2 py-0.5 rounded-full">会員限定</span>
                  </div>
                  <div className="p-5">
                    <div className="text-2xl font-bold text-[#1a3a2a] mb-2">
                      {property.price_display ?? (property.price ? `${property.price.toLocaleString()}万円` : "価格応談")}
                    </div>
                    {property.area && (
                      <p className="text-sm text-[#706e68] mb-1 flex items-center gap-1.5">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {property.area}{property.town && ` ${property.town}`}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 my-3 text-xs">
                      {property.area_land_m2 && (
                        <span className="bg-[#f5f5f0] text-[#706e68] px-2.5 py-1 rounded">土地{property.area_land_m2}㎡</span>
                      )}
                      {property.area_build_m2 && (
                        <span className="bg-[#f5f5f0] text-[#706e68] px-2.5 py-1 rounded">建物{property.area_build_m2}㎡</span>
                      )}
                      {property.commission && (
                        <span className="bg-[#f5f5f0] text-[#706e68] px-2.5 py-1 rounded">手数料{property.commission}</span>
                      )}
                    </div>
                    {property.note && (
                      <p className="text-xs text-[#706e68] leading-relaxed mb-4 line-clamp-3 whitespace-pre-line">
                        {property.note}
                      </p>
                    )}
                    <InquiryButton propertyRef={property.property_no} propertyType={propType} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
