import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "スタッフ紹介",
  description: "フェリアホームのスタッフをご紹介します。全員が宅地建物取引士の有資格者です。",
};

type Staff = {
  id: string;
  name: string;
  name_kana?: string;
  role?: string;
  bio?: string;
  photo_url?: string;
  qualification?: string;
};

async function getStaff(): Promise<Staff[]> {
  try {
    const adminUrl = process.env.ADMIN_API_URL ?? "http://localhost:3001";
    const res = await fetch(`${adminUrl}/api/staff?status=ACTIVE`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.staffs ?? [];
  } catch {
    return [];
  }
}

export default async function StaffPage() {
  const staffs = await getStaff();

  return (
    <div className="pt-28 pb-20 bg-[#fafaf8] min-h-screen">
      <div className="container-xl">
        <div className="mb-12 text-center">
          <p className="text-[#c9a96e] text-xs tracking-[0.3em] mb-2 font-serif">STAFF</p>
          <h1 className="font-serif text-3xl font-bold text-[#1c1b18]">スタッフ紹介</h1>
          <p className="text-sm text-[#706e68] mt-4">
            全スタッフが宅地建物取引士の有資格者です。
          </p>
        </div>

        {staffs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {staffs.map((staff) => (
              <div key={staff.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="relative h-64 bg-[#e8e6e0]">
                  {staff.photo_url ? (
                    <Image
                      src={staff.photo_url}
                      alt={staff.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[#706e68]">
                      <span className="text-6xl">👤</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  {staff.role && (
                    <p className="text-[#c9a96e] text-xs tracking-wider mb-1">{staff.role}</p>
                  )}
                  <h2 className="font-serif text-xl font-bold text-[#1c1b18] mb-1">{staff.name}</h2>
                  {staff.name_kana && (
                    <p className="text-xs text-[#706e68] mb-3">{staff.name_kana}</p>
                  )}
                  {staff.qualification && (
                    <p className="text-xs text-[#1a3a2a] bg-[#e8f0eb] px-2 py-1 rounded-full inline-block mb-3">
                      {staff.qualification}
                    </p>
                  )}
                  {staff.bio && (
                    <p className="text-sm text-[#706e68] leading-relaxed line-clamp-4">{staff.bio}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="h-64 bg-[#e8e6e0] flex items-center justify-center text-[#706e68]">
                  <span className="text-6xl">👤</span>
                </div>
                <div className="p-6">
                  <p className="text-[#c9a96e] text-xs tracking-wider mb-1">宅地建物取引士</p>
                  <h2 className="font-serif text-xl font-bold text-[#1c1b18] mb-3">スタッフ {i}</h2>
                  <p className="text-sm text-[#706e68] leading-relaxed">
                    お客様の大切な住まい探しを丁寧にサポートいたします。お気軽にご相談ください。
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
