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
      className="relative overflow-hidden py-14 tb:py-20"
      style={{
        background: "linear-gradient(135deg, #0f1f2f 0%, #1a3a5a 50%, #2a5a8a 100%)",
      }}
    >
      {/* 背景装飾 */}
      <div
        className="absolute top-0 right-0 w-[600px] h-full opacity-5"
        style={{
          background: "radial-gradient(circle at 80% 50%, #ffffff, transparent 60%)",
        }}
      />

      <div className="container-content relative z-10">
        <div className="flex flex-col tb:flex-row items-center justify-between gap-8">

          {/* 左: テキスト */}
          <div className="text-center tb:text-left">
            <div className="flex items-center justify-center tb:justify-start gap-2 mb-3">
              <RefreshCw size={16} className="text-white/60" />
              <p className="text-white/60 text-sm tracking-widest">TRADE-UP SUPPORT</p>
            </div>
            <h2
              className="text-white font-bold leading-tight mb-4"
              style={{ fontSize: "clamp(20px, 2.8vw, 34px)" }}
            >
              物件の買い替えを<br />お考えの方へ
            </h2>
            <p className="text-white/70 text-sm tb:text-base leading-relaxed max-w-md">
              「今の家を売りながら、新しい家を探したい」<br />
              売却と購入を同時にサポートします。
            </p>

            {/* ステップ */}
            <div className="flex items-center gap-2 mt-5 justify-center tb:justify-start">
              {steps.map((step, i) => (
                <div key={step.num} className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <span
                      className="font-montserrat font-bold text-sm"
                      style={{ color: "#5BAD52", fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {step.num}
                    </span>
                    <span className="text-white/70 text-xs whitespace-nowrap">{step.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <ArrowRight size={12} className="text-white/30 flex-shrink-0 mb-0.5" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 右: CTA */}
          <div className="flex-shrink-0">
            <Link
              href="/buy/trade-up"
              className="flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-base text-white transition-all duration-200 hover:scale-105 hover:shadow-lg border-2"
              style={{
                borderColor: "#5BAD52",
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
