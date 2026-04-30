// app/members/favorites/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FavoriteButton } from "@/components/ui/FavoriteButton";

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
              const mainImage = p.images?.[0]?.url ?? null;
              const location = [p.city, p.town].filter(Boolean).join("");
              return (
                <Link
                  key={fav.id ?? p.id}
                  href={`/properties/${p.id}`}
                  style={{ textDecoration: "none", color: "inherit", display: "block" }}
                >
                  <div style={{
                    backgroundColor: "#fff", borderRadius: "12px",
                    overflow: "hidden", border: "1px solid #e8e8e8",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    height: "100%", display: "flex", flexDirection: "column",
                  }}>
                    <div style={{ position: "relative", aspectRatio: "4/3", backgroundColor: "#f0f0f0", flexShrink: 0 }}>
                      {mainImage ? (
                        <Image src={mainImage} alt={p.title ?? "物件"} fill quality={80}
                          style={{ objectFit: "cover" }} sizes="33vw" />
                      ) : (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", color: "#bbb" }}>🏠</div>
                      )}
                      <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 2 }}>
                        <FavoriteButton propertyId={p.id} size="sm" />
                      </div>
                    </div>
                    <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ minHeight: "36px", marginBottom: "8px" }}>
                        {p.title && (
                          <p style={{
                            fontSize: "13px", fontWeight: "bold", color: "#333",
                            margin: 0, lineHeight: 1.4,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}>
                            {p.title}
                          </p>
                        )}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1, marginBottom: "10px" }}>
                        {location && <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>📍 {location}</p>}
                        {p.rooms && <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>🚪 {p.rooms}</p>}
                      </div>
                      <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "10px", marginTop: "auto" }}>
                        {p.price != null ? (
                          <p style={{ margin: 0 }}>
                            <span style={{ fontSize: "20px", fontWeight: "bold", color: "#5BAD52" }}>{p.price.toLocaleString()}</span>
                            <span style={{ fontSize: "12px", color: "#5BAD52", marginLeft: "2px" }}>万円</span>
                          </p>
                        ) : <p style={{ fontSize: "14px", color: "#888", margin: 0 }}>応相談</p>}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
