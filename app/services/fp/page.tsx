// app/services/fp/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home, GraduationCap, Shield, Wallet } from "lucide-react";

export const metadata: Metadata = {
  title: "無料FPサービス",
  description: "理想の「人生設計」を創る。ファイナンシャルプラン個別相談会のご案内。住宅資金・教育資金・保険資金・老後資金について実績あるFPが対応します。",
};

export default function FPPage() {
  const consultItems = [
    { icon: <Home size={24} style={{ color: "white" }} />, title: "住宅資金", text: "住宅ローンの組み方から、支払いまでの無数の選択肢の中からあなたにぴったりのプランの選定を金融のプロがサポートします。" },
    { icon: <GraduationCap size={24} style={{ color: "white" }} />, title: "教育資金", text: "ライフプランを固めるこのタイミングだからこそ、お子様の将来を真剣に考える機会です。お子様の進路を考え、将来に必要な教育資金を算出します。" },
    { icon: <Shield size={24} style={{ color: "white" }} />, title: "保険資金", text: "自己や病気、災害など万が一の際に経済的なセーフティーネットを担うのが保険です。新しいライフステージにぴったりな保障を組みましょう。" },
    { icon: <Wallet size={24} style={{ color: "white" }} />, title: "老後資金", text: "人生100年時代。老後に向けて実際にいくら必要か。それをどのように貯めていくべきか。教育資金と繰上返済のバランスを踏んで算出しましょう。" },
  ];

  return (
    <div style={{ backgroundColor: "#ffffff" }}>

      {/* パンくず */}
      <div style={{ backgroundColor: "#F8F8F8", padding: "8px 0" }}>
        <div className="container-content">
          <nav style={{ fontSize: "12px", color: "#999", display: "flex", alignItems: "center", gap: "4px" }}>
            <Link href="/" style={{ color: "#999", textDecoration: "none" }}>TOP</Link>
            <ChevronRight size={12} />
            <span style={{ color: "#333" }}>無料FPサービス</span>
          </nav>
        </div>
      </div>

      {/* タイトル */}
      <div className="container-content" style={{ padding: "32px 0 40px" }}>
        <h1 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: "bold", color: "#1a1a1a", fontFamily: "'Noto Serif JP', serif" }}>
          無料ＦＰサービス
        </h1>
      </div>

      {/* メインビジュアル */}
      <section style={{ padding: "0 0 64px" }}>
        <div className="container-content">
          <div style={{ display: "grid", gap: "32px", alignItems: "center" }}
            className="grid-cols-1 tb:grid-cols-2">

            {/* 左: 画像エリア */}
            <div style={{ position: "relative" }}>
              <div style={{
                width: "100%", aspectRatio: "4/3", borderRadius: "8px",
                background: "linear-gradient(135deg, #1a2a3a, #2d4a6a)",
                display: "flex", alignItems: "flex-end", padding: "24px",
              }}>
                {/* 相談無料バッジ */}
                <div style={{
                  position: "absolute", bottom: "24px", left: "24px",
                  backgroundColor: "#4a8a8a", borderRadius: "50%",
                  width: "80px", height: "80px",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <p style={{ color: "white", fontSize: "11px", fontWeight: "bold" }}>相談</p>
                  <p style={{ color: "white", fontSize: "11px", fontWeight: "bold" }}>無料</p>
                </div>
              </div>
            </div>

            {/* 右: テキスト */}
            <div>
              <p style={{ fontSize: "13px", color: "#4a8a8a", fontWeight: "bold", letterSpacing: "0.1em", marginBottom: "8px" }}>
                FELIA HOME PRESENTS!!
              </p>

              {/* 4つのタグ */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                {["老後資金", "各種保険資金", "住宅資金", "教育資金"].map((tag) => (
                  <span key={tag} style={{
                    display: "inline-block", padding: "4px 16px",
                    backgroundColor: "#c8a96e", color: "white",
                    fontSize: "13px", fontWeight: "bold", borderRadius: "2px",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              <p style={{ fontSize: "14px", color: "#555", marginBottom: "8px" }}>
                理想の「人生設計」を創る。
              </p>
              <h2 style={{
                fontSize: "clamp(20px, 3vw, 28px)", fontWeight: "bold", color: "#1a1a1a",
                lineHeight: 1.4, marginBottom: "24px", fontFamily: "'Noto Serif JP', serif",
              }}>
                ファイナンシャルプラン<br />個別相談会のご案内
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* 対応内容 */}
      <section style={{ padding: "0 0 64px" }}>
        <div className="container-content">
          <div style={{ display: "grid", gap: "32px" }}
            className="grid-cols-1 tb:grid-cols-[1fr_280px]">
            {/* 左: 説明 */}
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "16px" }}>
                当社と提携している実績のあるファイナンシャルプランナーが対応！
              </h3>
              <ul style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  "低金利下にて、「住宅借入金特別控除、税制を踏まえた、頭金とペアローン混合の算出」",
                  "変動や固定など、金利タイプの選定",
                  "住宅ローンの「返済料型（前払い・金利上乗せ）」「手数料型」の選定",
                  "繰上返済計画の立て方",
                  "「各種疾病団体信用生命保険」の選定",
                  "住宅取得資金贈与、の活用方法",
                ].map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "14px", color: "#444" }}>
                    <span style={{ color: "#4a8a8a", fontWeight: "bold", flexShrink: 0 }}>●</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 右: FPとは */}
            <div style={{ backgroundColor: "#1a2a3a", borderRadius: "8px", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <div style={{ width: "4px", height: "20px", backgroundColor: "#4a8a8a" }} />
                <p style={{ color: "white", fontWeight: "bold", fontSize: "14px" }}>
                  FP<br />
                  <span style={{ fontSize: "11px", fontWeight: "normal" }}>（ファイナンシャルプラン）とは？</span>
                </p>
              </div>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", lineHeight: 1.8 }}>
                総合的な資金計画を立て、経済的な側面から夢や目標の実現に導く方法のこと。これらの計画を立てるためには、金融・税制・不動産・住宅ローン生命保険、年金制度などの幅広い知識が必要になります。これらの知識を備え、夢や目標がかなうよう一緒に考え、サポートさせていただきます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 相談できること */}
      <section style={{ padding: "64px 0", backgroundColor: "#F8F8F8" }}>
        <div className="container-content">
          <h2 style={{ fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: "bold", color: "#1a1a1a", marginBottom: "32px", fontFamily: "'Noto Serif JP', serif" }}>
            ファイナンシャルプランナー　相談できること
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
            className="grid-cols-1 tb:grid-cols-2">
            {consultItems.map((item) => (
              <div key={item.title} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{
                  width: "52px", height: "52px", borderRadius: "50%",
                  backgroundColor: "#1a2a3a", display: "flex",
                  alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontWeight: "bold", fontSize: "15px", color: "#1a2a3a", marginBottom: "6px" }}>
                    {item.title}
                  </p>
                  <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.8 }}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "64px 0" }}>
        <div className="container-content" style={{ textAlign: "center" }}>
          <Link
            href="/contact"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              padding: "16px 40px", border: "2px solid #4a8a8a",
              borderRadius: "4px", color: "#4a8a8a",
              fontWeight: "bold", fontSize: "15px", textDecoration: "none",
            }}
          >
            無料FPサービスについてのお問合せ
          </Link>
        </div>
      </section>

    </div>
  );
}
