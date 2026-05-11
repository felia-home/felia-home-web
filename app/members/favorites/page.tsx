// app/members/favorites/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PropertyCard } from "@/components/property/PropertyCard";

export const metadata = { title: "お気に入り物件 | フェリアホーム" };

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/members/login");
  const memberId = (session.user as any).id;

  let favorites: any[] = [];
  try {
    const res = await fetch(
      `${process.env.ADMIN_API_URL}/api/members/${memberId}/favorites`,
      { cache: "no-store" }
    );
    const data = await res.json();
    favorites = data.favorites ?? data ?? [];
  } catch {}

  return (
    <main style={{ backgroundColor: "#f8f8f8", minHeight: "100vh" }}>
      {/* ヘッダー */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e8e8e8", padding: "24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "6px", fontSize: "12px", color: "#aaa", marginBottom: "8px" }}>
            <Link href="/" style={{ color: "#aaa", textDecoration: "none" }}>ホーム</Link>
            <span>›</span>
            <Link href="/members/mypage" style={{ color: "#aaa", textDecoration: "none" }}>マイページ</Link>
            <span>›</span>
            <span style={{ color: "#333" }}>お気に入り物件</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px", color: "#e74c3c" }}>♥</span>
            <h1 style={{ fontSize: "22px", fontWeight: "bold", color: "#333", margin: 0 }}>
              お気に入り物件
            </h1>
            <span style={{ fontSize: "14px", color: "#888" }}>（{favorites.length}件）</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px 80px" }}>
        {favorites.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "80px 0",
            backgroundColor: "#fff", borderRadius: "12px",
            border: "1px solid #e8e8e8",
          }}>
            <p style={{ fontSize: "48px", margin: "0 0 16px", color: "#ddd" }}>♡</p>
            <p style={{ fontSize: "16px", color: "#888", margin: "0 0 8px" }}>
              お気に入り物件がありません
            </p>
            <p style={{ fontSize: "13px", color: "#aaa", margin: "0 0 24px" }}>
              気になる物件の ♡ ボタンを押してお気に入りに追加しましょう
            </p>
            <Link
              href="/search"
              style={{
                display: "inline-block", padding: "12px 28px",
                backgroundColor: "#5BAD52", color: "#fff",
                borderRadius: "6px", textDecoration: "none",
                fontSize: "14px", fontWeight: "bold",
              }}
            >
              物件を探す
            </Link>
          </div>
        ) : (
          <div className="properties-search-grid">
            {favorites.map((fav: any) => {
              const p = fav.property ?? fav;
              if (!p) return null;
              return (
                <PropertyCard
                  key={fav.id ?? p.id}
                  property={p}
                  showFavoriteButton
                />
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
