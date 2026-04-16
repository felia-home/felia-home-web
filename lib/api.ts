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
  const res = await fetchFromAdmin<{ properties: Property[] }>("/api/hp/felia-selection");
  return res.properties ?? [];
}

export async function getNewProperties() {
  const res = await fetchFromAdmin<{ properties: Property[] }>(
    "/api/properties?flag=new"
  );
  return res.properties ?? [];
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
  const res = await fetchFromAdmin<{ properties: OpenHouse[] }>("/api/hp/open-house");
  return res.properties ?? [];
}

// ---- お知らせ ----

export async function getNews(limit?: number) {
  const q = limit ? `?limit=${limit}` : "";
  const res = await fetchFromAdmin<{ news: NewsItem[] }>(`/api/hp/news${q}`);
  return res.news ?? [];
}

export async function getNewsById(slug: string) {
  return fetchFromAdmin<NewsItem>(`/api/news/${slug}`);
}

// ---- ヒーローバナー ----

export interface HeroBanner {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  link_target: "_self" | "_blank";
  sort_order: number;
}

export async function getHeroBanners(): Promise<HeroBanner[]> {
  try {
    const res = await fetchFromAdmin<{ banners: HeroBanner[] }>(
      "/api/hp/hero-banners",
      { next: { revalidate: 60 } }
    );
    return res.banners ?? [];
  } catch {
    return [];
  }
}

// ---- エリア設定 ----

export interface AreaSetting {
  id: string;
  area_name: string;
  area_type: "ward" | "city";
  image_url: string | null;
  description?: string | null;
  link_url?: string | null;
  is_active: boolean;
  sort_order: number;
}

export async function getAreas(): Promise<AreaSetting[]> {
  try {
    const res = await fetchFromAdmin<{ areas: AreaSetting[] }>(
      "/api/hp/areas",
      { next: { revalidate: 60 } }
    );
    return res.areas ?? [];
  } catch {
    return [];
  }
}

// ---- 特集・バナー（Phase 2） ----

export async function getFeatures() {
  const res = await fetchFromAdmin<{ features: Feature[] }>("/api/hp/features");
  return res.features ?? [];
}

export async function getBanners() {
  const res = await fetchFromAdmin<{ banners: Banner[] }>(
    "/api/hp/search-banners"
  );
  return res.banners ?? [];
}

export async function getFreeBanners(): Promise<Banner[]> {
  try {
    const res = await fetchFromAdmin<{ banners: Banner[] }>(
      "/api/hp/banners",
      { next: { revalidate: 60 } }
    );
    return res.banners ?? [];
  } catch {
    return [];
  }
}

// ---- 会社情報 ----

export async function getCompanyInfo(): Promise<CompanyInfo | null> {
  try {
    const res = await fetchFromAdmin<{ company: CompanyInfo }>(
      "/api/hp/company",
      { next: { revalidate: 300 } }
    );
    return res.company ?? null;
  } catch {
    return null;
  }
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
  title: string;
  image_url: string;
  link_url: string | null;
  link_target: "_self" | "_blank";
  sort_order: number;
}

export interface CompanyInfo {
  name: string;
  postal_code?: string | null;
  address: string;
  phone: string;
  fax?: string | null;
  email?: string | null;
  hours: string;
  holiday: string;
  license: string;
  lat?: number | null;
  lng?: number | null;
  access_text?: string | null;
}

export interface CompanyBranch {
  id: string;
  name: string;
  postal_code?: string | null;
  address: string;
  phone?: string | null;
  fax?: string | null;
  access_text?: string | null;
  lat?: number | null;
  lng?: number | null;
  is_active: boolean;
  sort_order: number;
}

export async function getCompanyBranches(): Promise<CompanyBranch[]> {
  try {
    const res = await fetchFromAdmin<{ branches: CompanyBranch[] }>(
      "/api/hp/company-branches",
      { next: { revalidate: 300 } }
    );
    return res.branches ?? [];
  } catch {
    return [];
  }
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

// ---- プライベートセレクション トークン検証 ----

export type TokenVerifyResult =
  | { valid: true; customerId: string; email: string; expiresAt: string }
  | { valid: false; reason: "not_found" | "expired" | "no_token" | "server_error" };

export async function verifyPrivateSelectionToken(
  token: string
): Promise<TokenVerifyResult> {
  try {
    return await fetchFromAdmin<TokenVerifyResult>(
      `/api/private-selection/verify?token=${encodeURIComponent(token)}`,
      { next: { revalidate: 0 } }
    );
  } catch {
    return { valid: false, reason: "server_error" };
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

// 購入希望条件
export interface MemberProfileData {
  id?: string;
  member_id?: string;
  property_types?: string[];
  desired_areas?: string[];
  desired_lines?: string[];
  budget_max?: number;
  desired_area_m2_min?: number;
  desired_layout?: string[];
  purchase_timing?: string;
  current_residence?: string;
  current_rent?: number;
  lease_expiry?: string;
  has_property_to_sell?: string;
  family_structure?: string;
  children_ages?: string;
  down_payment?: number;
  annual_income_range?: string;
  loan_preapproval?: string;
  purchase_motivation?: string;
  priority_points?: string[];
  other_agents?: string;
  remarks?: string;
}

export async function getMemberProfileData(
  memberId: string
): Promise<MemberProfileData | null> {
  try {
    return await fetchFromAdmin<MemberProfileData>(
      `/api/members/${memberId}/profile`,
      { next: { revalidate: 0 } }
    );
  } catch {
    return null;
  }
}

// ---- スタッフ ----

export interface StaffMember {
  id: string;
  name: string;
  name_kana?: string | null;
  position?: string | null;
  department?: string | null;
  store_name?: string | null;
  photo_url?: string | null;
  bio?: string | null;
  catchphrase?: string | null;
  qualification?: string | null;
  favorite_word?: string | null;
  hobby?: string | null;
  memorable_client?: string | null;
  sub_images?: string[];
  sort_order: number;
}

export async function getStaffList(): Promise<StaffMember[]> {
  try {
    const res = await fetchFromAdmin<{ staff: StaffMember[] }>(
      "/api/hp/staff",
      { next: { revalidate: 60 } }
    );
    return res.staff ?? [];
  } catch {
    return [];
  }
}

export async function getStaffById(id: string): Promise<StaffMember | null> {
  try {
    const res = await fetchFromAdmin<{ staff: StaffMember }>(
      `/api/hp/staff/${id}`,
      { next: { revalidate: 60 } }
    );
    return res.staff ?? null;
  } catch {
    return null;
  }
}

// ---- 売却実績 ----

export interface SaleResult {
  id: string;
  year_month: string;
  area: string;
  property_type: string;
  comment?: string | null;
  image_url_1?: string | null;
  image_url_2?: string | null;
  image_url_3?: string | null;
  sort_order: number;
}

export async function getSaleResults(): Promise<SaleResult[]> {
  try {
    const res = await fetchFromAdmin<{ results: SaleResult[] }>(
      "/api/hp/sale-results",
      { next: { revalidate: 60 } }
    );
    return res.results ?? [];
  } catch {
    return [];
  }
}

// ---- お客様の声 ----

export interface Testimonial {
  id: string;
  display_name: string;
  image_url?: string | null;
  title: string;
  trigger_text?: string | null;
  decision_text?: string | null;
  impression_text?: string | null;
  advice_text?: string | null;
  final_text?: string | null;
  staff?: { name: string } | null;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetchFromAdmin<{ testimonials: Testimonial[] }>(
      "/api/hp/testimonials",
      { next: { revalidate: 60 } }
    );
    return res.testimonials ?? [];
  } catch {
    return [];
  }
}

// ---- WEBチラシ ----

export interface WebFlyer {
  id: string;
  name: string;
  distribute_month: string;
  front_image_url?: string | null;
  back_image_url?: string | null;
  pdf_url?: string | null;
  sort_order: number;
}

export async function getWebFlyers(): Promise<WebFlyer[]> {
  try {
    const res = await fetchFromAdmin<{ flyers: WebFlyer[] }>(
      "/api/hp/web-flyers",
      { next: { revalidate: 60 } }
    );
    return res.flyers ?? [];
  } catch {
    return [];
  }
}
