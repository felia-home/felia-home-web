import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "スタッフ紹介",
  description: "フェリアホームのスタッフをご紹介します。千駄ヶ谷本店・幡ヶ谷支店・コンサルティング事業部のメンバー一覧。",
};

type Staff = {
  name: string;
  nameKana: string;
  position: string;
  store: string;
  image: string;
};

const SENDAGAYA_STAFF: Staff[] = [
  {
    name: "北原 啓輔",
    nameKana: "キタハラ ケイスケ",
    position: "代表取締役",
    store: "千駄ヶ谷本店",
    image: "https://img.hs.aws.multi-use.net/adm1/felia/images/staff/kitahara.jpg",
  },
  {
    name: "伊藤 貴洋",
    nameKana: "イトウ タカヒロ",
    position: "営業部",
    store: "千駄ヶ谷本店",
    image: "https://img.hs.aws.multi-use.net/adm1/felia/images/staff/t.ito.jpg",
  },
  {
    name: "長田 光平",
    nameKana: "ナガタ コウヘイ",
    position: "営業部",
    store: "千駄ヶ谷本店",
    image: "https://img.hs.aws.multi-use.net/adm1/felia/images/staff/k.nagata.jpg",
  },
  {
    name: "表 来希",
    nameKana: "オモテ ライキ",
    position: "営業部",
    store: "千駄ヶ谷本店",
    image: "https://img.hs.aws.multi-use.net/adm1/felia/images/staff/r.omote.jpg",
  },
  {
    name: "齋藤 大空",
    nameKana: "サイトウ タク",
    position: "営業部",
    store: "千駄ヶ谷本店",
    image: "https://img.hs.aws.multi-use.net/adm1/felia/images/staff/t.saito.jpg",
  },
  {
    name: "安井 孝輔",
    nameKana: "ヤスイ コウスケ",
    position: "営業部",
    store: "千駄ヶ谷本店",
    image: "https://img.hs.aws.multi-use.net/adm1/felia/images/staff/k.yasui.jpg",
  },
  {
    name: "中田 真矢",
    nameKana: "ナカダ マサヤ",
    position: "営業部",
    store: "千駄ヶ谷本店",
    image: "https://img.hs.aws.multi-use.net/adm1/felia/images/staff/m.nakada.jpg",
  },
  {
    name: "加藤 遼太朗",
    nameKana: "カトウ リョウタロウ",
    position: "営業部",
    store: "千駄ヶ谷本店",
    image: "https://img.hs.aws.multi-use.net/adm1/felia/images/staff/r.kato.jpg",
  },
  {
    name: "松本 祐輔",
    nameKana: "マツモト ユウスケ",
    position: "",
    store: "千駄ヶ谷本店",
    image: "https://img.hs.aws.multi-use.net/adm1/felia/images/staff/y.matsumoto.jpg",
  },
];

const HATAGAYA_STAFF: Staff[] = [
  {
    name: "波多 隆二",
    nameKana: "ハタ リュウジ",
    position: "営業部 部長",
    store: "幡ヶ谷支店",
    image: "https://img.hs.aws.multi-use.net/adm1/felia/images/staff/hata.jpg",
  },
  {
    name: "中塚 雅人",
    nameKana: "ナカツカ マサト",
    position: "営業部 次長",
    store: "幡ヶ谷支店",
    image: "https://img.hs.aws.multi-use.net/adm1/felia/images/staff/nakatsuka.jpg",
  },
  {
    name: "渡邉 圭介",
    nameKana: "ワタナベ ケイスケ",
    position: "営業部",
    store: "幡ヶ谷支店",
    image: "https://img.hs.aws.multi-use.net/adm1/felia/images/staff/k.watanabe.jpg",
  },
  {
    name: "阿部 楠央",
    nameKana: "アベ ナオ",
    position: "営業部",
    store: "幡ヶ谷支店",
    image: "https://img.hs.aws.multi-use.net/adm1/felia/images/staff/n.abe.png",
  },
];

const CONSULTING_STAFF: Staff[] = [
  {
    name: "星 俊彦",
    nameKana: "ホシ トシヒコ",
    position: "コンサルティング事業部 部長",
    store: "コンサルティング事業部",
    image: "https://img.hs.aws.multi-use.net/adm1/felia/images/staff/hoshi.jpg",
  },
  {
    name: "松 大輔",
    nameKana: "マツ ダイスケ",
    position: "コンサルティング事業部",
    store: "コンサルティング事業部",
    image: "https://img.hs.aws.multi-use.net/adm1/felia/images/staff/d.matsu.jpg",
  },
];

function StaffCard({ staff }: { staff: Staff }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#e8e6e0] hover:shadow-lg transition-shadow">
      <div className="relative h-64 bg-[#e8e6e0]">
        <Image
          src={staff.image}
          alt={staff.name}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      <div className="p-5">
        {staff.position && (
          <div className="text-xs text-[#c9a96e] font-bold tracking-wider mb-2">
            {staff.position}
          </div>
        )}
        <div className="font-serif text-xl font-bold text-[#1c1b18] mb-1">
          {staff.name}
        </div>
        <div className="text-xs text-[#706e68] tracking-wider">
          {staff.nameKana}
        </div>
      </div>
    </div>
  );
}

export default function StaffPage() {
  return (
    <div className="bg-[#fafaf8] min-h-screen">
      {/* ページヘッダー */}
      <section className="pt-28 pb-16 bg-white border-b border-[#e8e6e0]">
        <div className="container-xl">
          <p className="text-[#c9a96e] text-xs tracking-[0.4em] mb-3 font-serif">STAFF</p>
          <h1 className="font-serif text-4xl font-bold text-[#1c1b18]">スタッフ紹介</h1>
        </div>
      </section>

      {/* 千駄ヶ谷本店 */}
      <section className="py-16 bg-[#fafaf8]">
        <div className="container-xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-1 h-8 bg-[#c9a96e]" />
            <h2 className="font-serif text-2xl font-bold text-[#1c1b18]">千駄ヶ谷本店</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {SENDAGAYA_STAFF.map((staff) => (
              <StaffCard key={staff.name} staff={staff} />
            ))}
          </div>
        </div>
      </section>

      {/* 幡ヶ谷支店 */}
      <section className="py-16 bg-white">
        <div className="container-xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-1 h-8 bg-[#c9a96e]" />
            <h2 className="font-serif text-2xl font-bold text-[#1c1b18]">幡ヶ谷支店</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {HATAGAYA_STAFF.map((staff) => (
              <StaffCard key={staff.name} staff={staff} />
            ))}
          </div>
        </div>
      </section>

      {/* コンサルティング事業部 */}
      <section className="py-16 bg-[#fafaf8]">
        <div className="container-xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-1 h-8 bg-[#c9a96e]" />
            <h2 className="font-serif text-2xl font-bold text-[#1c1b18]">コンサルティング事業部</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {CONSULTING_STAFF.map((staff) => (
              <StaffCard key={staff.name} staff={staff} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
