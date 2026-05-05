// app/voice/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, User } from "lucide-react";
import { getTestimonials } from "@/lib/api";
import type { Testimonial } from "@/lib/api";

export const metadata: Metadata = {
  title: "お客様の声",
  description: "フェリアホームをご利用いただいたお客様の声をご紹介します。",
};

function TestimonialCard({ t }: { t: Testimonial }) {
  const sections = [
    { label: "購入のきっかけ", text: t.trigger_text },
    { label: "決め手", text: t.decision_text },
    { label: "実際に住んでみて", text: t.impression_text },
    { label: "これから購入される方へ", text: t.advice_text },
    { label: "最後に一言", text: t.final_text },
  ].filter((s) => s.text);

  return (
    <div style={{ border: "1px solid #E5E5E5", borderRadius: "12px", overflow: "hidden", backgroundColor: "white" }}>
      <div style={{ backgroundColor: "#F0F5F0", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
        {t.image_url ? (
          <div style={{ position: "relative", width: "60px", height: "60px", borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
            <Image src={t.image_url} alt={t.display_name} fill style={{ objectFit: "cover" }} sizes="60px" />
          </div>
        ) : (
          <div style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#5BAD52", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <User size={28} style={{ color: "white" }} />
          </div>
        )}
        <div>
          <p style={{ fontWeight: "bold", fontSize: "16px", color: "#1a1a1a", marginBottom: "4px" }}>{t.display_name}様</p>
          <p style={{ fontSize: "13px", color: "#5BAD52", fontWeight: "bold" }}>{t.title}</p>
          {t.staff && <p style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>担当: {t.staff.name}</p>}
        </div>
      </div>
      <div style={{ padding: "20px" }}>
        {sections.map((s, i) => (
          <div key={i} style={{ marginBottom: i < sections.length - 1 ? "16px" : 0 }}>
            {s.label && (
              <p style={{ fontSize: "12px", fontWeight: "bold", color: "#5BAD52", marginBottom: "4px", borderLeft: "3px solid #5BAD52", paddingLeft: "8px" }}>
                {s.label}
              </p>
            )}
            <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.8 }}>{s.text}</p>
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
      <div style={{ backgroundColor: "#F8F8F8", padding: "8px 0" }}>
        <div className="container-content">
          <nav style={{ fontSize: "12px", color: "#999", display: "flex", alignItems: "center", gap: "4px" }}>
            <Link href="/" style={{ color: "#999", textDecoration: "none" }}>TOP</Link>
            <ChevronRight size={12} />
            <span style={{ color: "#333" }}>お客様の声</span>
          </nav>
        </div>
      </div>

      <div className="container-content" style={{ padding: "32px 0 20px" }}>
        <h1 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: "bold", color: "#1a1a1a", fontFamily: "'Noto Serif JP', serif" }}>
          お客様の声
        </h1>
        <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>
          フェリアホームをご利用いただいたお客様からいただいたご意見・ご感想です。
        </p>
      </div>

      <div className="container-content" style={{ paddingBottom: "64px" }}>
        {testimonials.length === 0 ? (
          <div style={{ padding: "64px 0", textAlign: "center", color: "#999" }}>
            <p>現在、お客様の声を準備中です。</p>
          </div>
        ) : (
          <div style={{ gap: "24px" }}
            className="grid-2col-resp">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} t={t} />
            ))}
          </div>
        )}

        {/* 投稿CTA */}
        <div style={{ marginTop: "64px", padding: "40px", backgroundColor: "#F0F5F0", borderRadius: "12px", textAlign: "center" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "8px" }}>
            ご購入されたお客様へ
          </h2>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "24px" }}>
            フェリアホームをご利用いただいたご感想をお聞かせください
          </p>
          <Link href="/voice/submit" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "12px 32px", borderRadius: "8px",
            border: "2px solid #5BAD52", color: "#5BAD52",
            fontWeight: "bold", fontSize: "14px", textDecoration: "none",
          }}>
            お客様の声を投稿する
          </Link>
        </div>
      </div>
    </div>
  );
}
