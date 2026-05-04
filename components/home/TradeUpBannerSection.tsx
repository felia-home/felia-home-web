// components/home/TradeUpBannerSection.tsx
import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";

const steps = [
  { num: "01", label: "売却査定" },
  { num: "02", label: "新居探し" },
  { num: "03", label: "同時進行サポート" },
];

export function TradeUpBannerSection() {
  return (
    <section
      className="banner-section"
      style={{
        background: "linear-gradient(135deg, #0f1f2f 0%, #1a3a5a 50%, #2a5a8a 100%)",
      }}
    >
      {/* 背景装飾 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "600px",
          height: "100%",
          opacity: 0.05,
          pointerEvents: "none",
          background: "radial-gradient(circle at 80% 50%, #ffffff, transparent 60%)",
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="banner-flex-row">
          {/* 左: テキスト */}
          <div className="banner-text-center">
            <div
              className="banner-justify-center"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <RefreshCw size={16} style={{ color: "rgba(255,255,255,0.6)" }} />
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "14px",
                  letterSpacing: "0.15em",
                  margin: 0,
                }}
              >
                TRADE-UP SUPPORT
              </p>
            </div>
            <h2
              style={{
                color: "#fff",
                fontWeight: "bold",
                lineHeight: 1.2,
                marginBottom: "16px",
                fontSize: "clamp(20px, 2.8vw, 34px)",
              }}
            >
              物件の買い替えを<br />お考えの方へ
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "clamp(13px, 1.5vw, 16px)",
                lineHeight: 1.7,
                maxWidth: "28rem",
                margin: 0,
              }}
            >
              「今の家を売りながら、新しい家を探したい」<br />
              売却と購入を同時にサポートします。
            </p>

            {/* ステップ */}
            <div
              className="banner-justify-center"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "20px",
              }}
            >
              {steps.map((step, i) => (
                <div
                  key={step.num}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: "bold",
                        fontSize: "14px",
                        color: "#5BAD52",
                      }}
                    >
                      {step.num}
                    </span>
                    <span
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <ArrowRight
                      size={12}
                      style={{
                        color: "rgba(255,255,255,0.3)",
                        flexShrink: 0,
                        marginBottom: "2px",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 右: CTA */}
          <div style={{ flexShrink: 0 }}>
            <Link
              href="/buy/trade-up"
              className="cta-button-hover"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "16px 32px",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "16px",
                color: "#fff",
                textDecoration: "none",
                border: "2px solid #5BAD52",
                backgroundColor: "rgba(91,173,82,0.15)",
                boxShadow: "0 4px 20px rgba(91,173,82,0.2)",
              }}
            >
              詳しく見る
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
