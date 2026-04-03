"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function InquiryButton({
  propertyRef,
  propertyType,
}: {
  propertyRef: string;
  propertyType?: string;
}) {
  const { data: session } = useSession();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    if (!session?.user) return;
    setLoading(true);
    try {
      await fetch("/api/member/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          property_ref: propertyRef,
          property_type: propertyType ?? "PRIVATE",
          inquiry_type: "DOCUMENT",
          message: `未公開物件（${propertyRef}）の資料請求`,
        }),
      });
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center text-sm text-green-600 font-bold py-2.5">
        ✅ 資料請求を受け付けました
      </div>
    );
  }

  return (
    <button
      onClick={handleRequest}
      disabled={loading}
      className="block w-full text-center bg-[#c9a96e] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#b8935a] transition-colors disabled:opacity-50"
    >
      {loading ? "送信中..." : "この物件の資料を請求する"}
    </button>
  );
}
