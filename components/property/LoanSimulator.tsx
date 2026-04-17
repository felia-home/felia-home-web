"use client";
import { useState, useMemo } from "react";

interface LoanSimulatorProps {
  price: number; // 万円単位
}

export default function LoanSimulator({ price }: LoanSimulatorProps) {
  const [years, setYears] = useState(35);
  const [rate, setRate] = useState(0.725);
  const [downPayment, setDownPayment] = useState(0); // 頭金（万円）

  // 月額返済計算（元利均等返済）
  const monthlyPayment = useMemo(() => {
    const principal = (price - downPayment) * 10000; // 円に変換
    if (principal <= 0) return 0;
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    if (monthlyRate === 0) return Math.round(principal / months);
    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(payment);
  }, [price, downPayment, years, rate]);

  const totalPayment = monthlyPayment * years * 12;
  const totalInterest = totalPayment - (price - downPayment) * 10000;

  const formatMan = (yen: number) => {
    const man = Math.round(yen / 10000);
    return man.toLocaleString() + "万円";
  };

  return (
    <div style={{
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "20px",
      border: "1px solid #e8e8e8",
    }}>
      <p style={{
        fontSize: "13px",
        fontWeight: "bold",
        color: "#333",
        margin: "0 0 16px",
        borderLeft: "3px solid #5BAD52",
        paddingLeft: "8px",
      }}>
        ローンシミュレーション
      </p>

      {/* 月額表示 */}
      <div style={{
        backgroundColor: "#f0f9ef",
        borderRadius: "8px",
        padding: "16px",
        textAlign: "center",
        marginBottom: "16px",
      }}>
        <p style={{ fontSize: "11px", color: "#666", margin: "0 0 4px" }}>月々の返済額（目安）</p>
        <p style={{ fontSize: "28px", fontWeight: "bold", color: "#5BAD52", margin: 0, lineHeight: 1 }}>
          {monthlyPayment > 0
            ? `${Math.round((monthlyPayment / 10000) * 10) / 10}万円`
            : "—"}
        </p>
        <p style={{ fontSize: "10px", color: "#999", margin: "4px 0 0" }}>
          ※概算。実際の返済額は金融機関にご確認ください
        </p>
      </div>

      {/* 設定項目 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

        {/* 頭金 */}
        <div>
          <label style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "4px" }}>
            頭金：{downPayment.toLocaleString()}万円
          </label>
          <input
            type="range"
            min={0}
            max={Math.floor(price * 0.5)}
            step={100}
            value={downPayment}
            onChange={e => setDownPayment(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#5BAD52" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#aaa" }}>
            <span>0万円</span>
            <span>{Math.floor(price * 0.5).toLocaleString()}万円</span>
          </div>
        </div>

        {/* 返済年数 */}
        <div>
          <label style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "4px" }}>
            返済年数
          </label>
          <div style={{ display: "flex", gap: "6px" }}>
            {[10, 15, 20, 25, 30, 35].map(y => (
              <button
                key={y}
                onClick={() => setYears(y)}
                style={{
                  flex: 1,
                  padding: "6px 0",
                  border: "1px solid",
                  borderColor: years === y ? "#5BAD52" : "#e0e0e0",
                  borderRadius: "4px",
                  backgroundColor: years === y ? "#5BAD52" : "#fff",
                  color: years === y ? "#fff" : "#555",
                  fontSize: "11px",
                  cursor: "pointer",
                  fontWeight: years === y ? "bold" : "normal",
                }}
              >
                {y}年
              </button>
            ))}
          </div>
        </div>

        {/* 金利 */}
        <div>
          <label style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "4px" }}>
            金利（年）：{rate}%
          </label>
          <input
            type="range"
            min={0.1}
            max={3.0}
            step={0.025}
            value={rate}
            onChange={e => setRate(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#5BAD52" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#aaa" }}>
            <span>0.1%</span>
            <span>3.0%</span>
          </div>
        </div>

      </div>

      {/* 合計 */}
      {monthlyPayment > 0 && (
        <div style={{
          marginTop: "12px",
          padding: "10px",
          backgroundColor: "#fafafa",
          borderRadius: "6px",
          fontSize: "11px",
          color: "#666",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span>借入金額</span>
            <span>{(price - downPayment).toLocaleString()}万円</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span>総返済額</span>
            <span>{formatMan(totalPayment)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>うち利息</span>
            <span>{formatMan(totalInterest)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
