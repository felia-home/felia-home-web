// lib/api.ts
const ADMIN_API_URL = process.env.ADMIN_API_URL || "http://localhost:3001";

async function fetchFromAdmin<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${ADMIN_API_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    // Next.js のキャッシュ設定（必要に応じて変更）
    next: { revalidate: 60 }, // 60秒キャッシュ
  });

  if (!res.ok) {
    throw new Error(`Admin API Error: ${res.status} ${res.statusText} (${path})`);
  }

  return res.json();
}

// ---- 物件 ----

export async function getFeaturedProperties() {
  return fetchFromAdmin<Property[]>("/api/properties?flag=featured");
}

export async function getNewProperties() {
  return fetchFromAdmin<Property[]>("/api/properties?flag=new");
}

export async function getPropertiesByArea(area: string) {
  return fetchFromAdmin<Property[]>(`/api/properties?area=${encodeURIComponent(area)}`);
}

export async function getPropertiesByLine(line: string) {
  return fetchFromAdmin<Property[]>(`/api/properties?line=${encodeURIComponent(line)}`);
}

export async function getPropertyById(id: string) {
  return fetchFromAdmin<Property>(`/api/properties/${id}`);
}

// ---- 現地販売会 ----

export async function getOpenHouses() {
  return fetchFromAdmin<OpenHouse[]>("/api/open-houses");
}

// ---- お知らせ ----

export async function getNews(limit?: number) {
  const q = limit ? `?limit=${limit}` : "";
  return fetchFromAdmin<NewsItem[]>(`/api/news${q}`);
}

export async function getNewsById(slug: string) {
  return fetchFromAdmin<NewsItem>(`/api/news/${slug}`);
}

// ---- 会社情報 ----

export async function getCompanyInfo() {
  return fetchFromAdmin<CompanyInfo>("/api/company");
}

// ---- 型定義 ----

export interface Property {
  id: string;
  name: string;
  propertyType: string;
  address: string;
  price: number;
  area: number;
  layout: string;
  nearestStation: string;
  walkMinutes: number;
  mainImage: string;
  images: string[];
  isFeatured: boolean;
  isNew: boolean;
  isOpenHouse: boolean;
  isMembersOnly: boolean;
  openHouseDate?: string;
  description?: string;
  buildingYear?: number;
  structure?: string;
  floors?: string;
  managementFee?: number;
  repairReserve?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OpenHouse {
  id: string;
  propertyId: string;
  propertyName: string;
  address: string;
  date: string;
  startTime: string;
  endTime: string;
  image?: string;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  publishedAt: string;
}

export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  hours: string;
  holiday: string;
  access: string;
  lat: number;
  lng: number;
  licenseNumber: string;
}
