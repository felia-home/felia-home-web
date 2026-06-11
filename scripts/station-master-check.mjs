// HP 沿線駅マスタ 検証スクリプト
// 実行: node scripts/station-master-check.mjs

import { STATION_CODE_TABLE } from "../lib/station-master-data.ts";

function softenChars(s) {
  return s.replace(/[ヶ]/g, "ケ").replace(/[ヵ]/g, "カ");
}
function normalizeKey(s) {
  return softenChars((s ?? "").normalize("NFKC").replace(/[\s　]+/g, ""));
}
function getLinesByStation(stationName) {
  const key = normalizeKey(stationName);
  if (!key) return [];
  const seen = new Set();
  const out = [];
  for (const e of STATION_CODE_TABLE) {
    if (normalizeKey(e.station) === key) {
      if (!seen.has(e.line)) { seen.add(e.line); out.push(e.line); }
    }
  }
  return out;
}
function getStationsByLine(lineName) {
  const key = normalizeKey(lineName);
  if (!key) return [];
  const seen = new Set();
  const out = [];
  for (const e of STATION_CODE_TABLE) {
    if (normalizeKey(e.line) === key && e.station) {
      if (!seen.has(e.station)) { seen.add(e.station); out.push(e.station); }
    }
  }
  return out;
}

console.log("=== マスタサイズ ===");
console.log(`STATION_CODE_TABLE.length = ${STATION_CODE_TABLE.length}`);
console.log("");

console.log("=== getLinesByStation('池袋') ===");
const ikebukuro = getLinesByStation("池袋");
console.log(`${ikebukuro.length}沿線: ${JSON.stringify(ikebukuro)}`);
const want = ["山手線", "東武東上線", "西武池袋線", "丸ノ内線", "有楽町線", "埼京線", "副都心線"];
const matchedAll = want.every(w => ikebukuro.some(l => l.includes(w)));
console.log(`期待7沿線 (${want.join(" / ")}) を含む: ${matchedAll ? "✓" : "✗"}`);
console.log("");

console.log("=== getLinesByStation('保谷') ===");
const hoya = getLinesByStation("保谷");
console.log(`${hoya.length}沿線: ${JSON.stringify(hoya)}`);
const onlyIkebukuroLine = hoya.length === 1 && hoya[0].includes("西武池袋");
console.log(`西武池袋線のみ: ${onlyIkebukuroLine ? "✓" : "✗"}`);
console.log("");

console.log("=== getStationsByLine('東京メトロ丸ノ内線') ===");
const marunouchi = getStationsByLine("東京メトロ丸ノ内線");
console.log(`${marunouchi.length}駅`);
console.log(`サンプル(先頭10件): ${JSON.stringify(marunouchi.slice(0, 10))}`);
console.log(`池袋を含む: ${marunouchi.includes("池袋") ? "✓" : "✗"}`);
console.log(`新宿を含む: ${marunouchi.includes("新宿") ? "✓" : "✗"}`);
console.log("");

console.log("=== getLinesByStation('新宿') ===");
const shinjuku = getLinesByStation("新宿");
console.log(`${shinjuku.length}沿線: ${JSON.stringify(shinjuku)}`);
