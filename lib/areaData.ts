// lib/areaData.ts

export interface AreaItem {
  id: string;
  name: string;         // 区名（日本語）
  image: string;        // /areas/xxx.jpg
  gradient: string;     // 画像読み込み失敗時のフォールバック
  href: string;         // 遷移先
}

export const areaGroups: AreaItem[][] = [
  // グループ1
  [
    { id: "shibuya",   name: "渋谷区",   image: "/areas/shibuya.jpg",   gradient: "linear-gradient(135deg,#2d4a2d,#5BAD52)", href: "/areas/渋谷区" },
    { id: "shinjuku",  name: "新宿区",   image: "/areas/shinjuku.jpg",  gradient: "linear-gradient(135deg,#1a2a3a,#4a6fa5)", href: "/areas/新宿区" },
    { id: "suginami",  name: "杉並区",   image: "/areas/suginami.jpg",  gradient: "linear-gradient(135deg,#2d3a1a,#7a9a3a)", href: "/areas/杉並区" },
    { id: "setagaya",  name: "世田谷区", image: "/areas/setagaya.jpg",  gradient: "linear-gradient(135deg,#1a3a2a,#3a8a5a)", href: "/areas/世田谷区" },
  ],
  // グループ2
  [
    { id: "bunkyo",    name: "文京区",   image: "/areas/bunkyo.jpg",    gradient: "linear-gradient(135deg,#2a1a3a,#6a4a9a)", href: "/areas/文京区" },
    { id: "toshima",   name: "豊島区",   image: "/areas/toshima.jpg",   gradient: "linear-gradient(135deg,#3a2a1a,#9a6a3a)", href: "/areas/豊島区" },
    { id: "nakano",    name: "中野区",   image: "/areas/nakano.jpg",    gradient: "linear-gradient(135deg,#1a3a3a,#3a8a8a)", href: "/areas/中野区" },
    { id: "meguro",    name: "目黒区",   image: "/areas/meguro.jpg",    gradient: "linear-gradient(135deg,#2a2a1a,#7a7a2a)", href: "/areas/目黒区" },
  ],
  // グループ3
  [
    { id: "kita",      name: "北区",     image: "/areas/kita.jpg",      gradient: "linear-gradient(135deg,#1a2a1a,#4a7a4a)", href: "/areas/北区" },
    { id: "itabashi",  name: "板橋区",   image: "/areas/itabashi.jpg",  gradient: "linear-gradient(135deg,#2a1a2a,#7a4a7a)", href: "/areas/板橋区" },
    { id: "nerima",    name: "練馬区",   image: "/areas/nerima.jpg",    gradient: "linear-gradient(135deg,#1a3a1a,#5a9a5a)", href: "/areas/練馬区" },
    { id: "shinagawa", name: "品川区",   image: "/areas/shinagawa.jpg", gradient: "linear-gradient(135deg,#1a1a3a,#4a4a9a)", href: "/areas/品川区" },
  ],
  // グループ4
  [
    { id: "minato",    name: "港区",     image: "/areas/minato.jpg",    gradient: "linear-gradient(135deg,#2a1a1a,#8a3a3a)", href: "/areas/港区" },
    { id: "ota",       name: "大田区",   image: "/areas/ota.jpg",       gradient: "linear-gradient(135deg,#1a2a3a,#3a5a7a)", href: "/areas/大田区" },
    { id: "chiyoda",   name: "千代田区", image: "/areas/chiyoda.jpg",   gradient: "linear-gradient(135deg,#2a2a2a,#6a6a6a)", href: "/areas/千代田区" },
    { id: "chuo",      name: "中央区",   image: "/areas/chuo.jpg",      gradient: "linear-gradient(135deg,#2a1a2a,#7a3a6a)", href: "/areas/中央区" },
  ],
];

export const otherArea: AreaItem = {
  id: "others",
  name: "その他",
  image: "/areas/others.jpg",
  gradient: "linear-gradient(135deg,#2a2a2a,#5BAD52)",
  href: "/properties",
};
