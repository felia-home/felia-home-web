// lib/featureLabels.ts
// features 配列の英語キー → 日本語ラベル マッピング
// 未定義のキーは表示時にフィルタで除外する。

export const FEATURE_LABELS: Record<string, string> = {
  // 交通・立地
  station_walk5: "駅徒歩5分以内",
  station_walk10: "駅徒歩10分以内",
  bus_access: "バス便",
  corner_lot: "角地",
  south_facing: "南向き",
  quiet_area: "閑静な住宅街",
  shopping_walk5: "スーパー徒歩5分以内",

  // 周辺施設
  elem_school_1km: "小学校1km以内",
  middle_school_1km: "中学校1km以内",
  nursery_nearby: "保育園近く",
  hospital_nearby: "病院近く",
  park_800m: "公園800m以内",
  park_nearby: "公園近く",
  convenience_nearby: "コンビニ近く",
  supermarket_nearby: "スーパー近く",

  // 建物・設備
  free_design: "自由設計",
  new_construction: "新築",
  renovation: "リノベーション済",
  all_electric: "オール電化",
  city_gas: "都市ガス",
  solar_power: "太陽光発電",
  floor_heating: "床暖房",
  underfloor_storage: "床下収納",
  attic_storage: "小屋裏収納",
  walk_in_closet: "ウォークインクローゼット",
  system_kitchen: "システムキッチン",
  counter_kitchen: "対面式キッチン",
  ih: "IHクッキングヒーター",
  dishwasher: "食洗機",
  bath_dryer: "浴室乾燥機",
  reheating_bath: "追い焚き機能",
  separate_toilet: "トイレ2箇所",
  washlet: "ウォシュレット",
  tv_monitor: "TVモニター付インターホン",
  auto_lock: "オートロック",
  elevator: "エレベーター",
  parking: "駐車場あり",
  garage: "ビルトインガレージ",
  bicycle_parking: "駐輪場あり",
  pet_allowed: "ペット相談可",
  barrier_free: "バリアフリー",

  // 土地・権利
  municipal_water: "公営水道",
  city_sewage: "下水排水",
  private_road_none: "私道負担なし",
  setback_none: "セットバックなし",
  rebuild_possible: "再建築可",
};

/**
 * features 配列の英語キーを日本語ラベルに変換。
 * 未定義のキーは捨てる（英語のまま表示しないため）。
 */
export function displayFeatures(features: readonly string[]): string[] {
  return features
    .map((key) => FEATURE_LABELS[key])
    .filter((label): label is string => !!label);
}
