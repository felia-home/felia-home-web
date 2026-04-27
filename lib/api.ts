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

export const getFeliaSectionProperties = getFeaturedProperties;

export async function getNewProperties() {
  const res = await fetchFromAdmin<{ properties: Property[] }>(
    "/api/properties?flag=new&published_hp=true"
  );
  return res.properties ?? [];
}

export async function getPropertiesByArea(area: string) {
  return fetchFromAdmin<Property[]>(`/api/properties?area=${encodeURIComponent(area)}&published_hp=true`);
}

export async function getPropertiesByLine(line: string) {
  return fetchFromAdmin<Property[]>(`/api/properties?line=${encodeURIComponent(line)}&published_hp=true`);
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

export async function getPropertyNews(limit?: number): Promise<NewsItem[]> {
  const q = limit ? `?type=property&limit=${limit}` : "?type=property";
  try {
    const res = await fetchFromAdmin<{ news: NewsItem[] }>(`/api/hp/news${q}`);
    return res.news ?? [];
  } catch {
    return [];
  }
}

export async function getInformationNews(limit?: number): Promise<NewsItem[]> {
  const q = limit ? `?type=information&limit=${limit}` : "?type=information";
  try {
    const res = await fetchFromAdmin<{ news: NewsItem[] }>(`/api/hp/news${q}`);
    return res.news ?? [];
  } catch {
    return [];
  }
}

export async function getAllNews(limit?: number): Promise<NewsItem[]> {
  const q = limit ? `?limit=${limit}` : "";
  try {
    const res = await fetchFromAdmin<{ news: NewsItem[] }>(`/api/hp/news${q}`);
    return res.news ?? [];
  } catch {
    return [];
  }
}

export async function getNewsById(id: string): Promise<NewsItem | null> {
  try {
    const res = await fetchFromAdmin<{ news: NewsItem }>(`/api/news/${id}`);
    return res.news ?? null;
  } catch {
    return null;
  }
}

// ---- HPセクション表示管理 ----

export interface HpSection {
  section_key: string;
  label: string;
  is_visible: boolean;
  sort_order: number;
  heading: string | null;
  subheading: string | null;
}

export async function getHpSections(): Promise<HpSection[]> {
  try {
    const res = await fetchFromAdmin<{ sections: HpSection[] }>("/api/hp/sections");
    return res.sections ?? [];
  } catch {
    // セクション取得失敗時は全セクション表示（フォールバック）
    return [];
  }
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
    console.log("FreeBanner API response:", JSON.stringify(res).substring(0, 200));
    return res.banners ?? [];
  } catch {
    return [];
  }
}

// ---- 売却実績 ----

export interface SaleResult {
  id: string;
  sale_year: number;
  sale_month: number | null;
  area_ward: string;
  area_town: string;
  property_type: string;
  floor_plan_image_url: string | null;
  comment: string | null;
  sort_order: number;
  staff: {
    id: string;
    name: string;
    photo_url: string | null;
  } | null;
}

export async function getSaleResults(): Promise<SaleResult[]> {
  try {
    const res = await fetchFromAdmin<{ sale_results: SaleResult[] }>(
      "/api/hp/sale-results"
    );
    return res.sale_results ?? [];
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
  city?: string;
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
  if (params.city)     query.set("city",      params.city);
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
  images?: PropertyImage[];
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
  // Prismaから直接返される場合のsnake_caseフィールド
  title?: string | null;
  catch_copy?: string | null;
  property_type?: string | null;
  city?: string | null;
  town?: string | null;
  rooms?: string | null;
  area_build_m2?: number | null;
  area_land_m2?: number | null;
  created_at?: string | null;
  published_at?: string | null;
  station_name1?: string | null;
  station_walk1?: number | null;
  is_open_house?: boolean;
}

export interface OpenHouse {
  id: string;
  title: string | null;
  city: string | null;
  address: string | null;
  open_house_start: string | null;
  open_house_end: string | null;
  is_open_house: boolean;
  station_name1?: string | null;
  station_walk1?: number | null;
  property_type?: string | null;
  price?: number | null;
}

export interface NewsItem {
  id: string;
  title: string;
  category: "NEWS" | "INFORMATION";
  news_type: "property" | "information";
  published_at: string | null;
  is_published: boolean;
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

// ---- 物件詳細（新型） ----

export interface PropertyDetail {
  id: string;
  property_type: string;
  transaction_type: string | null;
  brokerage_type: string | null;
  status: string;
  title: string;
  catch_copy: string | null;
  description_hp: string | null;
  prefecture: string | null;
  city: string | null;
  town: string | null;
  address: string | null;
  address_display_level: string | null;
  price: number | null;
  price_negotiable: boolean;
  station_line1: string | null;
  station_name1: string | null;
  station_walk1: number | null;
  station_line2: string | null;
  station_name2: string | null;
  station_walk2: number | null;
  area_land_m2: number | null;
  area_build_m2: number | null;
  rooms: string | null;
  building_year: number | null;
  building_month: number | null;
  structure: string | null;
  floors_total: number | null;
  direction: string | null;
  use_zone: string | null;
  bcr: number | null;
  far: number | null;
  land_right: string | null;
  road_width: number | null;
  road_type: string | null;
  road_direction: string | null;
  delivery_timing: string | null;
  delivery_status: string | null;
  selling_points: string[];
  is_open_house: boolean;
  open_house_start: string | null;
  open_house_end: string | null;
  is_felia_selection: boolean;
  agent_id: string | null;
  eq_system_kitchen: boolean;
  eq_autolock: boolean;
  eq_elevator: boolean;
  eq_parking: boolean;
  eq_bike_parking: boolean;
  eq_pet_ok: boolean;
  eq_floor_heating: boolean;
  eq_all_electric: boolean;
  eq_solar: boolean;
  eq_walk_in_closet: boolean;
  eq_washlet: boolean;
  eq_bathroom_dryer: boolean;
  eq_tv_intercom: boolean;
  eq_fiber_optic: boolean;
  eq_corner: boolean;
  eq_top_floor: boolean;
  eq_reformed: boolean;
  eq_barrier_free: boolean;
  eq_ev_charger: boolean;
  eq_separate_bath_toilet: boolean;
  eq_counter_kitchen: boolean;
  eq_roof_balcony: boolean;
}

export interface PropertyImage {
  id: string;
  url: string;
  filename: string;
  order?: number;
}

export interface StaffDetail {
  id: string;
  name: string;
  name_kana: string | null;
  position: string | null;
  store_name: string | null;
  photo_url: string | null;
  bio: string | null;
  catchphrase: string | null;
}

export async function getPropertyDetail(id: string): Promise<PropertyDetail | null> {
  try {
    const res = await fetchFromAdmin<any>(`/api/properties/${id}`);
    return res.property ?? res ?? null;
  } catch {
    return null;
  }
}

export async function getPropertyImages(id: string): Promise<PropertyImage[]> {
  try {
    const res = await fetchFromAdmin<{ images: PropertyImage[] }>(`/api/properties/${id}/images`);
    return res.images ?? [];
  } catch {
    return [];
  }
}

export async function getStaffDetail(id: string): Promise<StaffDetail | null> {
  try {
    const res = await fetchFromAdmin<{ staff: StaffDetail }>(`/api/hp/staff/${id}`);
    return res.staff ?? null;
  } catch {
    return null;
  }
}

// ---- 採用スタッフ ----

export interface RecruitStaffInterview {
  question: string;
  answer: string;
}

export interface RecruitStaff {
  id: string;
  name: string;
  name_kana: string | null;
  nickname: string | null;
  position: string | null;
  department: string | null;
  store_name: string | null;
  photo_url: string | null;
  bio: string | null;
  catchphrase: string | null;
  qualification: string | null;
  favorite_word: string | null;
  hobby: string | null;
  memorable_client: string | null;
  daily_mindset: string | null;
  joined_at: string | null;
  motto: string | null;
  favorite: string | null;
  interviews: RecruitStaffInterview[];
}

export async function getRecruitStaff(): Promise<RecruitStaff[]> {
  try {
    const res = await fetchFromAdmin<any>("/api/hp/staff?recruit=true");
    return res.staffs ?? res.staff ?? [];
  } catch {
    return [];
  }
}

// ---- 未公開物件 ----

export interface PrivateProperty {
  id: string;
  property_no?: string | null;
  listing_type?: string | null;
  property_type?: string | null;
  is_land?: boolean;
  is_house?: boolean;
  is_mansion?: boolean;
  area?: string | null;
  town?: string | null;
  price?: number | string | null;
  area_land_m2?: number | null;
  area_build_m2?: number | null;
  commission?: string | null;
  note?: string | null;
  price_display?: string | null;
  transaction_type?: string | null;
  info_date?: string | null;
  seller_name?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
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
