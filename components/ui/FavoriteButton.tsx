"use client";

// components/ui/FavoriteButton.tsx
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface FavoriteButtonProps {
  propertyId: string;
  size?: "sm" | "md" | "lg";
}

export function FavoriteButton({ propertyId, size = "md" }: FavoriteButtonProps) {
  const session = useSession();
  const router = useRouter();
  const isLoggedIn = session?.status === "authenticated";

  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) { setChecked(true); return; }
    fetch(`/api/favorites/${propertyId}`)
      .then((r) => r.json())
      .then((d) => { setIsFavorite(d.is_favorite ?? false); setChecked(true); })
      .catch(() => setChecked(true));
  }, [propertyId, isLoggedIn]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      router.push(`/members/login?callbackUrl=/properties/${propertyId}`);
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await fetch(`/api/favorites/${propertyId}`, { method: "DELETE" });
        setIsFavorite(false);
      } else {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId }),
        });
        setIsFavorite(true);
      }
    } catch {}
    finally { setLoading(false); }
  };

  const sizeStyles = {
    sm: { width: "32px", height: "32px", fontSize: "14px" },
    md: { width: "40px", height: "40px", fontSize: "18px" },
    lg: { width: "48px", height: "48px", fontSize: "22px" },
  }[size];

  if (!checked) return null;

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={isFavorite ? "お気に入りから削除" : "お気に入りに追加"}
      style={{
        ...sizeStyles,
        borderRadius: "50%",
        border: "none",
        backgroundColor: isFavorite ? "#fff0f0" : "rgba(255,255,255,0.9)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        cursor: loading ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
        flexShrink: 0,
        opacity: loading ? 0.6 : 1,
      }}
    >
      <span style={{
        color: isFavorite ? "#e74c3c" : "#aaa",
        transition: "color 0.2s ease",
        lineHeight: 1,
      }}>
        {isFavorite ? "♥" : "♡"}
      </span>
    </button>
  );
}
