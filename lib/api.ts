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
  return fetchFromAdmin<Property[]>("/api/hp/felia-selection");
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
  return fetchFromAdmin<OpenHouse[]>("/api/hp/open-house");
}

// ---- お知らせ ----

export async function getNews(limit?: number) {
  const q = limit ? `?limit=${limit}` : "";
  return fetchFromAdmin<NewsItem[]>(`/api/hp/news${q}`);
}

export async function getNewsById(slug: string) {
  return fetchFromAdmin<NewsItem>(`/api/news/${slug}`);
}

// ---- 特集・バナー（Phase 2） ----

export async function getFeatures() {
  return fetchFromAdmin<Feature[]>("/api/hp/features");
}

export async function getBanners() {
  return fetchFromAdmin<Banner[]>("/api/hp/banners");
}

// ---- 会社情報 ----

export async function getCompanyInfo() {
  return fetchFromAdmin<CompanyInfo>("/api/company");
}

// ---- 物件一覧（絞り込み） ----

export interface PropertyListParams {
  area?: string;
  line?: string;
  flag?: "featured" | "new";
  type?: string;
  priceMin?: number;
  priceMax?: number;
  layout?: string;
  page?: number;
  limit?: number;
  sort?: "newest" | "price_asc" | "price_desc";
}

export interface PropertyListResponse {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getProperties(
  params: PropertyListParams = {}
): Promise<PropertyListResponse> {
  const query = new URLSearchParams();
  if (params.area)     query.set("area",      params.area);
  if (params.line)     query.set("line",      params.line);
  if (params.flag)     query.set("flag",      params.flag);
  if (params.type)     query.set("type",      params.type);
  if (params.priceMin) query.set("priceMin",  String(params.priceMin));
  if (params.priceMax) query.set("priceMax",  String(params.priceMax));
  if (params.layout)   query.set("layout",   params.layout);
  if (params.page)     query.set("page",      String(params.page));
  if (params.limit)    query.set("limit",     String(params.limit ?? 12));
  if (params.sort)     query.set("sort",      params.sort);

  return fetchFromAdmin<PropertyListResponse>(
    `/api/properties?${query.toString()}`,
    { next: { revalidate: 30 } }
  );
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

export interface Feature {
  id: string;
  slug: string;
  title: string;
  subTitle: string;
  image: string;
  href: string;
  order: number;
}

export interface Banner {
  id: string;
  image: string;
  href: string;
  alt: string;
  order: number;
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

// ---- 未公開物件 ----

export interface PrivateProperty {
  id: string;
  property_no: string;
  property_type?: string;
  area?: string;
  town?: string;
  price?: number;
  price_display?: string;
  area_land_m2?: number;
  area_build_m2?: number;
  commission?: number;
  note?: string;
  is_land: boolean;
  is_house: boolean;
  is_mansion: boolean;
}

export async function getPrivateProperties(): Promise<PrivateProperty[]> {
  try {
    const res = await fetchFromAdmin<{ properties: PrivateProperty[] }>(
      "/api/private-properties?filter=ACTIVE",
      { next: { revalidate: 0 } }
    );
    return res.properties ?? [];
  } catch {
    return [];
  }
}

export async function getPrivatePropertyById(
  id: string
): Promise<PrivateProperty | null> {
  try {
    const res = await fetchFromAdmin<{ properties: PrivateProperty[] }>(
      "/api/private-properties?filter=ACTIVE",
      { next: { revalidate: 0 } }
    );
    return res.properties?.find((p) => p.id === id) ?? null;
  } catch {
    return null;
  }
}

// ---- 会員 ----

export interface MemberProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface FavoriteProperty {
  id: string;
  propertyId: string;
  property: Property;
  createdAt: string;
}

export interface MemberInquiry {
  id: string;
  propertyRef?: string;
  propertyType: string;
  message?: string;
  inquiryType: string;
  status: string;
  createdAt: string;
}

export interface MemberProfileInput {
  property_types?:      string[];
  desired_areas?:       string[];
  desired_lines?:       string[];
  budget_max?:          number;
  desired_area_m2_min?: number;
  desired_layout?:      string[];
  purchase_timing?:     string;
  current_residence?:   string;
  current_rent?:        number;
  lease_expiry?:        string;
  has_property_to_sell?: string;
  family_structure?:    string;
  children_ages?:       string;
  down_payment?:        number;
  annual_income_range?: string;
  loan_preapproval?:    string;
  purchase_motivation?: string;
  priority_points?:     string[];
  other_agents?:        string;
  remarks?:             string;
}

// 購入希望条件を保存（初回登録）
export async function saveMemberProfile(
  memberId: string,
  data: MemberProfileInput
) {
  return fetchFromAdmin<{ success: boolean }>(
    `/api/members/${memberId}/profile`,
    {
      method: "POST",
      body: JSON.stringify(data),
      next: { revalidate: 0 },
    }
  );
}

// 購入希望条件を更新
export async function updateMemberProfile(
  memberId: string,
  data: MemberProfileInput
) {
  return fetchFromAdmin<{ success: boolean }>(
    `/api/members/${memberId}/profile`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
      next: { revalidate: 0 },
    }
  );
}

// 会員登録
export async function registerMember(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  return fetchFromAdmin<{ success: boolean; message?: string }>(
    "/api/members/register",
    {
      method: "POST",
      body: JSON.stringify(data),
      next: { revalidate: 0 },
    }
  );
}

// 会員プロフィール取得（memberId はサーバーサイドでセッションから取得）
export async function getMemberProfile(memberId: string) {
  return fetchFromAdmin<MemberProfile>(`/api/members/${memberId}`, {
    next: { revalidate: 0 },
  });
}

// お気に入り一覧
export async function getFavorites(memberId: string) {
  return fetchFromAdmin<FavoriteProperty[]>(
    `/api/members/${memberId}/favorites`,
    { next: { revalidate: 0 } }
  );
}

// お気に入り追加
export async function addFavorite(memberId: string, propertyId: string) {
  return fetchFromAdmin<{ success: boolean }>(
    `/api/members/${memberId}/favorites`,
    {
      method: "POST",
      body: JSON.stringify({ propertyId }),
      next: { revalidate: 0 },
    }
  );
}

// お気に入り削除
export async function removeFavorite(memberId: string, propertyId: string) {
  return fetchFromAdmin<{ success: boolean }>(
    `/api/members/${memberId}/favorites/${propertyId}`,
    { method: "DELETE", next: { revalidate: 0 } }
  );
}

// 問い合わせ履歴
export async function getMemberInquiries(memberId: string) {
  return fetchFromAdmin<MemberInquiry[]>(
    `/api/members/${memberId}/inquiries`,
    { next: { revalidate: 0 } }
  );
}
