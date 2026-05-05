// app/services/voice/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, User, MessageSquare } from "lucide-react";
import { getTestimonials } from "@/lib/api";
import type { Testimonial } from "@/lib/api";

export const metadata: Metadata = {
  title: "お客様の声",
  description: "フェリアホームをご利用いただいたお客様からの声をご紹介します。",
};

function TestimonialCard({ t }: { t: Testimonial }) {
  const sections = [
    { label: "購入のきっかけ", value: t.trigger_text },
    { label: "決め手", value: t.decision_text },
    { label: "実際に住んでみて", value: t.impression_text },
    { label: "これから購入される方へ", value: t.advice_text },
    { label: "最後に一言", value: t.final_text },
  ].filter((s) => s.value);

  return (
    <div style={{
      backgroundColor: "white",
      borderRadius: "12px",
      overflow: "hidden",
      border: "1px solid #E5E5E5",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    }}>
      {/* ヘッダー */}
      <div style={{
        backgroundColor: "#F0F5F0",
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}>
        {t.image_url ? (
          <div style={{
            position: "relative",
            width: "64px", height: "64px",
            borderRadius: "50%",
            overflow: "hidden", flexShrink: 0,
            border: "2px solid white",
          }}>
            <Image src={t.image_url} alt={t.display_name} fill
              style={{ objectFit: "cover" }} sizes="64px" />
          </div>
        ) : (
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%",
            backgroundColor: "#5BAD52",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <User size={28} style={{ color: "white" }} />
          </div>
        )}
        <div>
          <p style={{ fontWeight: "bold", fontSize: "17px", color: "#1a1a1a", marginBottom: "4px", fontFamily: "'Noto Serif JP', serif" }}>
            {t.display_name}様
          </p>
          <p style={{ fontSize: "13px", color: "#5BAD52", fontWeight: "bold" }}>{t.title}</p>
          {t.staff && (
            <p style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>
              担当: {t.staff.name}
            </p>
          )}
        </div>
      </div>

      {/* 本文 */}
      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {sections.map((s, i) => (
          <div key={i} style={{ borderBottom: i < sections.length - 1 ? "1px solid #F5F5F5" : "none", paddingBottom: i < sections.length - 1 ? "16px" : 0 }}>
            {s.label && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                <div style={{ width: "3px", height: "14px", backgroundColor: "#5BAD52", borderRadius: "2px" }} />
                <p style={{ fontSize: "12px", fontWeight: "bold", color: "#5BAD52" }}>{s.label}</p>
              </div>
            )}
            <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.9 }}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function VoicePage() {
  const testimonials = await getTestimonials();

  return (
    <div style={{ backgroundColor: "#ffffff" }}>

      {/* パンくず */}
      <div style={{ backgroundColor: "#F8F8F8", padding: "8px 0" }}>
        <div className="container-content">
          <nav style={{ fontSize: "12px", color: "#999", display: "flex", alignItems: "center", gap: "4px" }}>
            <Link href="/" style={{ color: "#999", textDecoration: "none" }}>TOP</Link>
            <ChevronRight size={12} />
            <span style={{ color: "#333" }}>お客様の声</span>
          </nav>
        </div>
      </div>

      {/* ヘッダー */}
      <div style={{ backgroundColor: "#F0F5F0", padding: "48px 0 40px" }}>
        <div className="container-content" style={{ textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "56px", height: "56px", borderRadius: "50%",
            backgroundColor: "#5BAD52", marginBottom: "16px",
          }}>
            <MessageSquare size={26} style={{ color: "white" }} />
          </div>
          <h1 style={{
            fontSize: "clamp(24px, 3vw, 36px)", fontWeight: "bold",
            color: "#1a1a1a", marginBottom: "12px",
            fontFamily: "'Noto Serif JP', serif",
          }}>
            お客様の声
          </h1>
          <p style={{ fontSize: "14px", color: "#666" }}>
            フェリアホームをご利用いただいたお客様からいただいたご意見・ご感想です。
          </p>
        </div>
      </div>

      {/* 一覧 */}
      <section style={{ padding: "56px 0 80px" }}>
        <div className="container-content">
          {testimonials.length === 0 ? (
            <div style={{ padding: "64px 0", textAlign: "center" }}>
              <MessageSquare size={48} style={{ color: "#E5E5E5", margin: "0 auto 16px", display: "block" }} />
              <p style={{ color: "#999", fontSize: "14px" }}>現在、お客様の声を準備中です。</p>
            </div>
          ) : (
            <div
              style={{ gap: "24px" }}
              className="grid-2col-resp"
            >
              {testimonials.map((t) => (
                <TestimonialCard key={t.id} t={t} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "48px 0", backgroundColor: "#F0F5F0" }}>
        <div className="container-content" style={{ textAlign: "center" }}>
          <p style={{ fontSize: "15px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "8px" }}>
            ご購入されたお客様へ
          </p>
          <p style={{ fontSize: "13px", color: "#666", marginBottom: "24px" }}>
            フェリアホームをご利用いただいたご感想をお聞かせください
          </p>
          <Link href="/contact" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "14px 40px", borderRadius: "8px",
            border: "2px solid #5BAD52", color: "#5BAD52",
            fontWeight: "bold", fontSize: "14px", textDecoration: "none",
          }}>
            お問い合わせはこちら
          </Link>
        </div>
      </section>

    </div>
  );
}
