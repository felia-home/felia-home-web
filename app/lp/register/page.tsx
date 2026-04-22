import Link from "next/link";

export default function RegisterLPPage() {
  return (
    <main style={{ backgroundColor: "#fff" }}>

      {/* ① ヒーローセクション */}
      <div style={{
        background: "linear-gradient(160deg, #0d2e16 0%, #1a4a24 40%, #2d7a3a 80%, #5BAD52 100%)",
        padding: "80px 24px 100px",
        textAlign: "center",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* 背景装飾 */}
        <div style={{
          position: "absolute", top: "-80px", right: "-80px",
          width: "400px", height: "400px",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.03)",
        }} />
        <div style={{
          position: "absolute", bottom: "-60px", left: "-60px",
          width: "300px", height: "300px",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.03)",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto" }}>
          <div style={{
            display: "inline-block",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: "20px",
            padding: "6px 20px",
            fontSize: "12px",
            letterSpacing: "0.15em",
            marginBottom: "28px",
            color: "rgba(255,255,255,0.8)",
            fontFamily: "'Montserrat', sans-serif",
          }}>
            FELIA HOME MEMBERSHIP
          </div>

          <h1 style={{
            fontSize: "clamp(28px, 5vw, 52px)",
            fontWeight: "bold",
            lineHeight: 1.25,
            margin: "0 0 24px",
            letterSpacing: "-0.02em",
          }}>
            市場に出ない物件が、<br />
            ここにある。
          </h1>

          <p style={{
            fontSize: "clamp(15px, 2vw, 18px)",
            lineHeight: 1.9,
            opacity: 0.85,
            margin: "0 0 48px",
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto",
          }}>
            フェリアホームの会員になると、<br />
            一般には公開されない非公開物件・未公開物件へ<br />
            アクセスできます。登録は無料です。
          </p>

          <Link
            href="/members/register"
            style={{
              display: "inline-block",
              padding: "20px 56px",
              backgroundColor: "#fff",
              color: "#1a4a24",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "17px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              letterSpacing: "0.02em",
            }}
          >
            無料で会員登録する
          </Link>
          <p style={{ fontSize: "12px", opacity: 0.6, marginTop: "16px" }}>
            登録無料・いつでも退会可能
          </p>
        </div>
      </div>

      {/* ② 会員特典 */}
      <div style={{ padding: "96px 24px", backgroundColor: "#fff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <p style={{
              fontSize: "11px", color: "#5BAD52",
              letterSpacing: "0.3em", margin: "0 0 12px",
              fontFamily: "'Montserrat', sans-serif", fontWeight: "600",
            }}>
              MEMBER BENEFITS
            </p>
            <h2 style={{
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: "bold", color: "#1a1a1a",
              margin: "0 0 16px", lineHeight: 1.3,
            }}>
              会員だけの3つの特典
            </h2>
            <p style={{ fontSize: "15px", color: "#666", margin: 0 }}>
              フェリアホームの会員になることで得られる、特別な価値をご紹介します。
            </p>
          </div>

          <div className="lp-benefits-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "32px",
          }}>
            {[
              {
                num: "01",
                icon: "🔑",
                title: "非公開物件への\nアクセス",
                desc: "売主様のご意向により、一般には公開されない物件情報をご覧いただけます。市場に出る前の情報をいち早くお届けします。",
                accent: true,
              },
              {
                num: "02",
                icon: "🔔",
                title: "新着物件の\nメール通知",
                desc: "ご登録いただいた購入希望条件に合う新着物件が登録されると、いち早くメールでお知らせします。",
                accent: false,
              },
              {
                num: "03",
                icon: "👤",
                title: "専任担当者による\nパーソナルサポート",
                desc: "会員登録後、ご希望に応じてフェリアホームの専任担当者が物件探しをサポートします。",
                accent: false,
              },
            ].map((item) => (
              <div
                key={item.num}
                style={{
                  backgroundColor: item.accent ? "#1a4a24" : "#f9f9f9",
                  borderRadius: "16px",
                  padding: "40px 32px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{
                  position: "absolute", top: "-16px", right: "-8px",
                  fontSize: "80px",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: "bold",
                  color: item.accent ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                  lineHeight: 1,
                  userSelect: "none",
                }}>
                  {item.num}
                </div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ fontSize: "36px", marginBottom: "20px", display: "block" }}>
                    {item.icon}
                  </div>
                  <h3 style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: item.accent ? "#fff" : "#1a1a1a",
                    margin: "0 0 16px",
                    lineHeight: 1.4,
                    whiteSpace: "pre-line",
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontSize: "14px",
                    color: item.accent ? "rgba(255,255,255,0.75)" : "#666",
                    lineHeight: 1.8,
                    margin: 0,
                  }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ③ 登録の流れ */}
      <div style={{ backgroundColor: "#f9f9f9", padding: "96px 24px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <p style={{
              fontSize: "11px", color: "#5BAD52",
              letterSpacing: "0.3em", margin: "0 0 12px",
              fontFamily: "'Montserrat', sans-serif", fontWeight: "600",
            }}>
              HOW TO JOIN
            </p>
            <h2 style={{
              fontSize: "clamp(22px, 4vw, 32px)",
              fontWeight: "bold", color: "#1a1a1a", margin: 0,
            }}>
              登録はたった2ステップ
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {[
              {
                title: "基本情報の入力",
                desc: "お名前・メールアドレス・パスワードを入力するだけ。1〜2分で完了します。",
                time: "約1分",
              },
              {
                title: "購入希望条件の設定",
                desc: "ご希望のエリア・予算・物件種別などを選択します。後からでも変更可能です。",
                time: "約2分",
              },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "24px", alignItems: "flex-start", marginBottom: i < 1 ? "32px" : "0" }}>
                <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: "56px", height: "56px",
                    borderRadius: "50%",
                    backgroundColor: "#5BAD52",
                    color: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Montserrat', sans-serif",
                  }}>
                    <span style={{ fontSize: "8px", opacity: 0.8 }}>STEP</span>
                    <span style={{ fontSize: "20px", fontWeight: "bold", lineHeight: 1 }}>{i + 1}</span>
                  </div>
                  {i < 1 && (
                    <div style={{ width: "2px", height: "40px", backgroundColor: "#d4edda", marginTop: "8px" }} />
                  )}
                </div>
                <div style={{ flex: 1, paddingTop: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#1a1a1a", margin: 0 }}>
                      {item.title}
                    </h3>
                    <span style={{
                      fontSize: "11px",
                      backgroundColor: "#e8f5e6",
                      color: "#5BAD52",
                      padding: "3px 10px",
                      borderRadius: "20px",
                      fontWeight: "bold",
                    }}>
                      {item.time}
                    </span>
                  </div>
                  <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.8, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ④ 安心ポイント */}
      <div style={{ padding: "80px 24px", backgroundColor: "#fff" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div className="lp-assurance-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
            textAlign: "center",
          }}>
            {[
              { icon: "🆓", title: "完全無料", desc: "会員登録・ご利用は\n一切無料です" },
              { icon: "🔒", title: "個人情報保護", desc: "お客様の情報は\n厳重に管理します" },
              { icon: "📧", title: "いつでも退会可能", desc: "マイページから\nいつでも退会できます" },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  padding: "32px 20px",
                  borderRadius: "12px",
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #e8e8e8",
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>{item.icon}</div>
                <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#1a1a1a", margin: "0 0 8px" }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: "13px", color: "#666",
                  margin: 0, lineHeight: 1.7,
                  whiteSpace: "pre-line",
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ⑤ 最終CTA */}
      <div style={{
        background: "linear-gradient(160deg, #0d2e16 0%, #1a4a24 50%, #2d7a3a 100%)",
        padding: "96px 24px",
        textAlign: "center",
        color: "#fff",
      }}>
        <h2 style={{
          fontSize: "clamp(24px, 4vw, 40px)",
          fontWeight: "bold",
          margin: "0 0 16px",
          lineHeight: 1.3,
        }}>
          まずは無料で登録してみる
        </h2>
        <p style={{
          fontSize: "16px",
          opacity: 0.8,
          margin: "0 0 40px",
          lineHeight: 1.8,
        }}>
          非公開物件へのアクセス・新着通知・専任サポート。<br />
          すべて無料でご利用いただけます。
        </p>
        <Link
          href="/members/register"
          style={{
            display: "inline-block",
            padding: "20px 56px",
            backgroundColor: "#fff",
            color: "#1a4a24",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "17px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}
        >
          無料で会員登録する
        </Link>
        <p style={{ fontSize: "12px", opacity: 0.5, marginTop: "16px" }}>
          登録無料・いつでも退会可能・個人情報は厳重に管理
        </p>
      </div>

    </main>
  );
}
