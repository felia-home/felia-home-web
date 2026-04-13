// app/members/favorites/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getFavorites } from "@/lib/api";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Heart, ChevronLeft } from "lucide-react";

export const metadata = { title: "お気に入り物件" };

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/members/login");

  const memberId = (session.user as any).id;
  let favorites: any[] = [];
  try {
    favorites = await getFavorites(memberId);
  } catch {}

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b py-8" style={{ borderColor: "#E5E5E5" }}>
        <div className="container-content">
          <Link href="/members/mypage"
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-2">
            <ChevronLeft size={14} /> マイページ
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Heart size={22} style={{ color: "#5BAD52" }} />
            お気に入り物件
          </h1>
          <p className="text-sm text-gray-500 mt-1">{favorites.length}件</p>
        </div>
      </div>

      <div className="container-content py-8">
        {favorites.length === 0 ? (
          <div className="py-20 text-center">
            <Heart size={48} className="mx-auto mb-4 text-gray-200" />
            <p className="text-gray-400 mb-6">お気に入りに保存した物件はありません</p>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white text-sm font-medium"
              style={{ backgroundColor: "#5BAD52" }}
            >
              物件を探す
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 tb:grid-cols-2 pc:grid-cols-3 gap-4 tb:gap-5">
            {favorites.map((fav: any) => (
              <PropertyCard key={fav.id} property={fav.property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
