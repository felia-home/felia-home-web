// lib/tokyoMapData.ts

export interface WardPath {
  id: string;
  name: string;
  path: string;          // SVG path d属性
  clickable: boolean;    // true=クリッカブル / false=グレーアウト
  href?: string;
  labelX: number;        // 区名ラベルのX座標
  labelY: number;        // 区名ラベルのY座標
}

// viewBox="0 0 500 480" を前提とした簡略パス
// 実際の区界を大まかに再現した手書きパス
export const tokyoWards: WardPath[] = [
  // ── クリッカブル17区 ──────────────────────────────

  // 千代田区（中心部）
  { id: "chiyoda", name: "千代田区", clickable: true, href: "/properties?area=千代田区",
    labelX: 252, labelY: 230,
    path: "M238,215 L265,210 L272,225 L268,242 L245,245 L235,235 Z" },

  // 中央区
  { id: "chuo", name: "中央区", clickable: true, href: "/properties?area=中央区",
    labelX: 285, labelY: 245,
    path: "M268,225 L290,218 L298,230 L295,250 L275,255 L268,242 Z" },

  // 港区
  { id: "minato", name: "港区", clickable: true, href: "/properties?area=港区",
    labelX: 248, labelY: 268,
    path: "M225,250 L268,242 L275,255 L270,280 L248,290 L220,278 Z" },

  // 新宿区
  { id: "shinjuku", name: "新宿区", clickable: true, href: "/properties?area=新宿区",
    labelX: 205, labelY: 228,
    path: "M185,210 L235,205 L238,215 L235,235 L215,245 L188,238 Z" },

  // 文京区
  { id: "bunkyo", name: "文京区", clickable: true, href: "/properties?area=文京区",
    labelX: 255, labelY: 200,
    path: "M238,185 L275,180 L282,195 L272,215 L265,210 L238,215 L235,200 Z" },

  // 渋谷区
  { id: "shibuya", name: "渋谷区", clickable: true, href: "/properties?area=渋谷区",
    labelX: 195, labelY: 268,
    path: "M170,255 L215,245 L220,278 L210,298 L178,295 L165,278 Z" },

  // 豊島区
  { id: "toshima", name: "豊島区", clickable: true, href: "/properties?area=豊島区",
    labelX: 212, labelY: 193,
    path: "M190,178 L238,172 L238,185 L235,200 L215,205 L188,200 Z" },

  // 中野区
  { id: "nakano", name: "中野区", clickable: true, href: "/properties?area=中野区",
    labelX: 163, labelY: 235,
    path: "M140,222 L185,218 L188,238 L178,252 L148,252 L135,240 Z" },

  // 杉並区
  { id: "suginami", name: "杉並区", clickable: true, href: "/properties?area=杉並区",
    labelX: 145, labelY: 268,
    path: "M108,255 L165,248 L170,255 L165,278 L148,290 L105,282 Z" },

  // 目黒区
  { id: "meguro", name: "目黒区", clickable: true, href: "/properties?area=目黒区",
    labelX: 210, labelY: 310,
    path: "M178,295 L225,285 L230,305 L222,325 L192,328 L172,315 Z" },

  // 品川区
  { id: "shinagawa", name: "品川区", clickable: true, href: "/properties?area=品川区",
    labelX: 255, labelY: 315,
    path: "M230,285 L275,278 L282,300 L278,328 L252,335 L230,320 L222,305 Z" },

  // 大田区
  { id: "ota", name: "大田区", clickable: true, href: "/properties?area=大田区",
    labelX: 210, labelY: 360,
    path: "M172,330 L230,325 L235,355 L228,388 L195,395 L162,375 L158,348 Z" },

  // 世田谷区
  { id: "setagaya", name: "世田谷区", clickable: true, href: "/properties?area=世田谷区",
    labelX: 148, labelY: 318,
    path: "M105,295 L172,288 L178,315 L172,330 L158,345 L105,340 L88,318 Z" },

  // 北区
  { id: "kita", name: "北区", clickable: true, href: "/properties?area=北区",
    labelX: 242, labelY: 165,
    path: "M218,145 L272,140 L278,158 L275,178 L238,182 L215,178 L212,160 Z" },

  // 板橋区
  { id: "itabashi", name: "板橋区", clickable: true, href: "/properties?area=板橋区",
    labelX: 182, labelY: 155,
    path: "M148,138 L218,132 L218,145 L212,165 L190,172 L148,165 L138,150 Z" },

  // 練馬区
  { id: "nerima", name: "練馬区", clickable: true, href: "/properties?area=練馬区",
    labelX: 148, labelY: 185,
    path: "M100,168 L190,162 L190,178 L185,200 L158,208 L100,200 Z" },

  // ── 非クリッカブル（城東エリア）─────────────────────

  // 台東区
  { id: "taito", name: "台東区", clickable: false,
    labelX: 305, labelY: 205,
    path: "M290,192 L318,188 L322,205 L315,220 L295,222 L288,210 Z" },

  // 墨田区
  { id: "sumida", name: "墨田区", clickable: false,
    labelX: 325, labelY: 228,
    path: "M310,215 L342,210 L348,228 L340,248 L318,250 L308,235 Z" },

  // 江東区
  { id: "koto", name: "江東区", clickable: false,
    labelX: 340, labelY: 270,
    path: "M310,248 L365,242 L372,268 L368,298 L335,305 L305,290 L305,262 Z" },

  // 荒川区
  { id: "arakawa", name: "荒川区", clickable: false,
    labelX: 305, labelY: 182,
    path: "M285,168 L318,162 L322,178 L318,192 L290,195 L282,182 Z" },

  // 足立区
  { id: "adachi", name: "足立区", clickable: false,
    labelX: 315, labelY: 148,
    path: "M268,128 L365,120 L372,145 L365,165 L318,168 L275,162 L265,148 Z" },

  // 葛飾区
  { id: "katsushika", name: "葛飾区", clickable: false,
    labelX: 368, labelY: 178,
    path: "M345,158 L400,152 L408,175 L400,198 L365,202 L342,188 Z" },

  // 江戸川区
  { id: "edogawa", name: "江戸川区", clickable: false,
    labelX: 390, labelY: 235,
    path: "M362,205 L415,198 L422,228 L415,262 L375,268 L358,248 L355,225 Z" },
];
