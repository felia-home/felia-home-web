// components/sell/SellFAQ.tsx
"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "媒介契約はどのような契約になりますか？",
    a: "媒介契約は、専属専任媒介契約・専任媒介契約・一般媒介契約の三種類になります。どの契約を交わすかは売主様の状況によって変わりますのでご相談ください。",
  },
  {
    q: "住みながら売却活動はできる？",
    a: "可能になります。実際に住みながら売却される方が多くいらっしゃいます。購入希望者が見学に来られた際にはご協力ください。",
  },
  {
    q: "折込チラシやインターネットへの掲載など費用の負担はあるの？",
    a: "売主様が広告費を負担することはありません。基本的に買主様を探すための費用は当社にて負担します。",
  },
  {
    q: "近所に家を売却することを知られたくありません。それは可能？",
    a: "可能です。当社独自のネットワークで買主様をお探しします。また、広告活動も売主様と相談の上変更することが可能です。また、インターネット広告は興味のあるユーザーにしか目に触れない広告なためおすすめしています。",
  },
  {
    q: "家のカギは預けたほうがいいのでしょうか？",
    a: "住みながら売却する場合は必要ありません。すでに退去済みで空き家の場合は預けて頂いたほうが良いです。",
  },
  {
    q: "購入希望者が突然来ることはありますか？",
    a: "購入希望者が突然来ることはありません。事前に売主様へ予定を連絡させて頂いた上で訪問します。",
  },
  {
    q: "購入希望の方が来る前にやっておくことは？",
    a: "できる限りきれいに掃除をすることが大事です。特に玄関はきれいに掃除してください。その他にも目に見えるほこりはふき取ってください。また、部屋の照明はすべてつけて明るい印象にしましょう。窓を開けて部屋を換気してください。",
  },
];

export function SellFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "720px", margin: "0 auto" }}>
      {FAQS.map((faq, i) => (
        <div
          key={i}
          style={{
            backgroundColor: "white",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 18px",
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: "500", color: "#333", lineHeight: 1.5 }}>
              Q. {faq.q}
            </span>
            <span style={{
              flexShrink: 0,
              marginLeft: "12px",
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              backgroundColor: "#4a8a8a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              lineHeight: 1,
            }}>
              {openIndex === i ? "−" : "+"}
            </span>
          </button>
          {openIndex === i && (
            <div style={{ padding: "0 18px 14px", borderTop: "1px solid #F0F0F0" }}>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.8, paddingTop: "10px" }}>
                A. {faq.a}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
