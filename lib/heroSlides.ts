// lib/heroSlides.ts

export interface HeroSlide {
  id: number;
  image: string | null;       // null の場合はグラデーション表示
  gradient?: string;          // image が null の場合に使用
  catchCopy: string;
  subCopy: string;
  buttonLabel?: string;
  buttonHref?: string;
}

// 画像が揃ったら image パスを差し替える
// 画像が不要なスライドは image: null のまま gradient を使用
export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image: "/hero/slide-01.jpg",
    catchCopy: "理想の住まいと、\n出会う場所。",
    subCopy: "東京の不動産売買はフェリアホームへ",
    buttonLabel: "物件を探す",
    buttonHref: "/search",
  },
  {
    id: 2,
    image: "/hero/slide-02.jpg",
    catchCopy: "あなたの大切な資産を、\n正直に査定します。",
    subCopy: "売却をお考えの方、まずは無料査定から",
    buttonLabel: "無料査定を依頼する",
    buttonHref: "/sell/valuation",
  },
  {
    id: 3,
    image: null,
    gradient: "linear-gradient(135deg, #1a2a3a 0%, #2d3d5a 40%, #4a6fa5 100%)",
    catchCopy: "会員登録で、\n未公開物件が見られます。",
    subCopy: "厳選された非公開物件を会員限定でご紹介",
    buttonLabel: "無料会員登録",
    buttonHref: "/members/register",
  },
];
