import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "採用情報",
  description:
    "フェリアホームでは不動産営業スタッフを募集しています。月給30万円以上、完全週休2日制、宅建資格支援制度あり。未経験・第二新卒歓迎。",
};

export default function RecruitPage() {
  return (
    <div className="bg-[#fafaf8]">

      {/* 1. ヒーローセクション */}
      <section className="pt-28 pb-20 bg-[#1a3a2a] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c9a96e'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="container-xl relative z-10 text-center">
          <p className="text-[#c9a96e] text-xs tracking-[0.4em] mb-6 font-serif">RECRUIT</p>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            人生を任せてもらう<br />
            <span className="text-[#c9a96e]">それが私たちの仕事です。</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto leading-relaxed text-base">
            家を「買いたい」「売りたい」というお客様の10年後、20年後の未来を見据えた提案で、お客様をサポートしていきます。
            <br className="hidden sm:block" />
            私たちと共に、お客様の人生を「幸せ」なものへ。
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <a href="#entry" className="bg-[#c9a96e] text-white px-8 py-3.5 rounded-full text-sm font-bold hover:bg-[#b8935a] transition-colors">
              応募する（新卒・中途）
            </a>
            <a href="#requirements" className="border border-white/40 text-white px-8 py-3.5 rounded-full text-sm hover:bg-white/10 transition-colors">
              募集要項を見る
            </a>
          </div>
        </div>
      </section>

      {/* 2. 会社の強み */}
      <section className="py-20 bg-white">
        <div className="container-xl">
          <div className="text-center mb-12">
            <p className="text-[#c9a96e] text-xs tracking-[0.4em] mb-3 font-serif">OUR STRENGTH</p>
            <h2 className="font-serif text-3xl font-bold text-[#1c1b18]">フェリアホームで働く魅力</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                no: "01",
                title: "スキルアップが早い",
                desc: "物件提案から融資相談まで一貫して担当。分業制でないため、不動産仲介の全業務を習得できます。",
              },
              {
                no: "02",
                title: "都内人気エリア特化",
                desc: "城南・城西・都心エリアに特化し、他社と差別化された高い物件収集能力を持っています。",
              },
              {
                no: "03",
                title: "フットワークの軽さ",
                desc: "大手にはできない柔軟な対応力。社員の声も反映されやすく、アイデアを活かせる環境です。",
              },
              {
                no: "04",
                title: "和気あいあいとした職場",
                desc: "20代スタッフ多数。ギスギスした雰囲気はなく、上司にも相談しやすいチームワーク重視の環境。",
              },
            ].map((item) => (
              <div key={item.no} className="bg-[#fafaf8] rounded-2xl p-6 border border-[#e8e6e0]">
                <div className="font-serif text-4xl font-bold text-[#c9a96e]/30 mb-3">{item.no}</div>
                <h3 className="font-serif text-lg font-bold text-[#1a3a2a] mb-3">{item.title}</h3>
                <p className="text-sm text-[#706e68] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. こんな方を求めています */}
      <section className="py-20 bg-[#fafaf8]">
        <div className="container-xl">
          <div className="text-center mb-12">
            <p className="text-[#c9a96e] text-xs tracking-[0.4em] mb-3 font-serif">WANTED</p>
            <h2 className="font-serif text-3xl font-bold text-[#1c1b18]">こんな方におすすめです</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              "周囲とのコミュニケーションを大切にできる方",
              "成長したい！という意欲をお持ちの方",
              "前向きな姿勢で業務に取り組める方",
              "お客様の役に立ちたいという気持ちを持つ方",
              "話すこと・聞くことが好きな方",
              "不動産売買仲介を一通り覚えたい方",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-5 border border-[#e8e6e0]">
                <div className="w-6 h-6 rounded-full bg-[#1a3a2a] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-sm text-[#1c1b18] leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-[#706e68] mt-8">
            ※ 不動産経験不問・学歴不問・第二新卒歓迎・ブランクOK
          </p>
        </div>
      </section>

      {/* 4. 社員インタビュー */}
      <section className="py-20 bg-white">
        <div className="container-xl">
          <div className="text-center mb-12">
            <p className="text-[#c9a96e] text-xs tracking-[0.4em] mb-3 font-serif">INTERVIEW</p>
            <h2 className="font-serif text-3xl font-bold text-[#1c1b18]">社員インタビュー</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#fafaf8] rounded-2xl p-8 border border-[#e8e6e0]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-[#1a3a2a] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#c9a96e] font-serif text-2xl font-bold">星</span>
                </div>
                <div>
                  <div className="text-xs text-[#706e68] mb-1">営業部部長 / 2019年4月入社</div>
                  <div className="font-serif text-xl font-bold text-[#1c1b18]">星 俊彦</div>
                  <div className="text-xs text-[#c9a96e] mt-1">モットー：「全てはお客様の為に」</div>
                </div>
              </div>
              <div className="space-y-4 text-sm text-[#706e68] leading-relaxed">
                <div>
                  <span className="font-bold text-[#1c1b18]">自社の強み：</span>
                  都内人気エリアに特化し、物件収集能力が高く他社との競争力が高い。物件提案から融資提案まで一貫して担当するため、不動産仲介の全業務を習得できます。
                </div>
                <div>
                  <span className="font-bold text-[#1c1b18]">会社の雰囲気：</span>
                  20代スタッフも多く、社内は和気あいあいとした雰囲気。スタッフ同士協力し合い、主体性を重んじているので各自のアイデアを活かせます。
                </div>
                <div>
                  <span className="font-bold text-[#1c1b18]">趣味：</span>
                  船釣り（東京湾）・ゴルフ（千葉）・妻とのランチ
                </div>
              </div>
            </div>
            <div className="bg-[#fafaf8] rounded-2xl p-8 border border-[#e8e6e0]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-[#1a3a2a] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#c9a96e] font-serif text-2xl font-bold">伊</span>
                </div>
                <div>
                  <div className="text-xs text-[#706e68] mb-1">営業部係長 / 2022年4月入社</div>
                  <div className="font-serif text-xl font-bold text-[#1c1b18]">伊藤 貴洋</div>
                  <div className="text-xs text-[#c9a96e] mt-1">モットー：丁寧な説明 / 好きな言葉：人皆我が師</div>
                </div>
              </div>
              <div className="space-y-4 text-sm text-[#706e68] leading-relaxed">
                <div>
                  <span className="font-bold text-[#1c1b18]">自社の強み：</span>
                  発展途上中のため社員の声が反映されやすい環境。分業制でないため、他社に比べスキルアップが早くできます。
                </div>
                <div>
                  <span className="font-bold text-[#1c1b18]">向いている人：</span>
                  話すこと・聞くことが好きな方、明るく元気のある方、給与面で正当な評価を受けたい方。
                </div>
                <div>
                  <span className="font-bold text-[#1c1b18]">趣味：</span>
                  バスケ・フットサル
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 募集要項 */}
      <section id="requirements" className="py-20 bg-[#fafaf8]">
        <div className="container-xl">
          <div className="text-center mb-12">
            <p className="text-[#c9a96e] text-xs tracking-[0.4em] mb-3 font-serif">JOB DESCRIPTION</p>
            <h2 className="font-serif text-3xl font-bold text-[#1c1b18]">募集要項</h2>
          </div>
          <div className="bg-white rounded-2xl border border-[#e8e6e0] overflow-hidden max-w-3xl mx-auto">
            {[
              { label: "職種", value: "不動産営業（売買仲介）" },
              { label: "応募資格", value: "普通自動車免許（AT限定OK）/ 学歴不問 / 未経験歓迎 / 第二新卒歓迎 / ブランクOK" },
              { label: "雇用形態", value: "正社員（試用期間3ヶ月・待遇変更なし）" },
              { label: "給与", value: "月給30万円以上 ※経験者優遇" },
              { label: "勤務時間", value: "9:30〜18:30（実働8時間）" },
              { label: "休日・休暇", value: "完全週休2日制（火・水）/ 年間休日117日+有給 / 年末年始10日 / GW2日 / 夏季9日 / 産前産後・育児休暇" },
              { label: "勤務地", value: "千駄ヶ谷本店（渋谷区千駄ヶ谷）/ 幡ヶ谷支店（渋谷区幡ヶ谷）※希望考慮・転居転勤なし" },
              { label: "福利厚生", value: "昇給年1回 / 役職手当 / 宅建資格手当1.5万円/月 / 交通費全額支給 / 社会保険完備 / 宅建資格取得支援 / 社員旅行 / 報奨金" },
            ].map((item, i) => (
              <div key={i} className={`grid grid-cols-3 ${i !== 0 ? "border-t border-[#e8e6e0]" : ""}`}>
                <div className="p-5 bg-[#fafaf8] col-span-1">
                  <span className="text-sm font-bold text-[#1a3a2a]">{item.label}</span>
                </div>
                <div className="p-5 col-span-2">
                  <span className="text-sm text-[#1c1b18] leading-relaxed">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. 勤務地 */}
      <section className="py-20 bg-white">
        <div className="container-xl">
          <div className="text-center mb-12">
            <p className="text-[#c9a96e] text-xs tracking-[0.4em] mb-3 font-serif">LOCATION</p>
            <h2 className="font-serif text-3xl font-bold text-[#1c1b18]">勤務地</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              {
                name: "千駄ヶ谷本店",
                address: "〒151-0051 渋谷区千駄ヶ谷4-16-7 北参道DTビル1階",
                access: "JR線「千駄ヶ谷駅・代々木駅」より徒歩7分\n副都心線「北参道駅」より徒歩4分",
                tel: "03-5981-8601",
                note: undefined,
              },
              {
                name: "幡ヶ谷支店",
                address: "〒151-0072 渋谷区幡ヶ谷2-1-4 ACN渋谷幡ヶ谷ビル3階",
                access: "京王新線「幡ヶ谷駅」北口より徒歩2分",
                tel: "03-6276-7614",
                note: "2022年移転・新築オフィス",
              },
            ].map((loc) => (
              <div key={loc.name} className="bg-[#fafaf8] rounded-2xl p-6 border border-[#e8e6e0]">
                <h3 className="font-serif text-lg font-bold text-[#1a3a2a] mb-4">{loc.name}</h3>
                <div className="space-y-3 text-sm text-[#706e68]">
                  <div className="flex items-start gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5 text-[#c9a96e]">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#c9a96e"/>
                    </svg>
                    <span>{loc.address}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
                      <path d="M4 10h16M4 10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8zM8 10V6a4 4 0 0 1 8 0v4" stroke="#c9a96e" strokeWidth="1.5"/>
                    </svg>
                    <span className="whitespace-pre-line">{loc.access}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
                      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" fill="#c9a96e"/>
                    </svg>
                    <span>{loc.tel}</span>
                  </div>
                  {loc.note && (
                    <div className="bg-[#c9a96e]/10 rounded-lg px-3 py-2 text-xs text-[#c9a96e] font-bold">
                      {loc.note}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. 採用フロー */}
      <section className="py-20 bg-[#fafaf8]">
        <div className="container-xl">
          <div className="text-center mb-12">
            <p className="text-[#c9a96e] text-xs tracking-[0.4em] mb-3 font-serif">FLOW</p>
            <h2 className="font-serif text-3xl font-bold text-[#1c1b18]">採用フロー</h2>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-4xl mx-auto">
            {[
              { step: "01", label: "応募", desc: "フォームよりご応募" },
              { step: "02", label: "書類選考", desc: "1週間以内にご連絡" },
              { step: "03", label: "面接", desc: "1〜2回（オンライン可）" },
              { step: "04", label: "内定", desc: "入社日はご相談可" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#1a3a2a] flex items-center justify-center mx-auto mb-3">
                    <span className="text-[#c9a96e] font-serif font-bold text-sm">{item.step}</span>
                  </div>
                  <div className="font-bold text-sm text-[#1c1b18]">{item.label}</div>
                  <div className="text-xs text-[#706e68] mt-1">{item.desc}</div>
                </div>
                {i < 3 && (
                  <div className="hidden md:block text-[#c9a96e] text-2xl flex-shrink-0">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. 応募ボタン */}
      <section id="entry" className="py-20 bg-[#1a3a2a] text-white">
        <div className="container-xl text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">
            スタッフ一同、<br className="sm:hidden" />皆様からのご応募をお待ちしております
          </h2>
          <p className="text-white/60 mb-10 text-sm">
            ご不明な点がございましたら、お気軽にお問合せください。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:recruit@felia-home.co.jp"
              className="bg-[#c9a96e] text-white px-10 py-4 rounded-full font-bold text-sm hover:bg-[#b8935a] transition-colors"
            >
              新卒採用に応募する
            </a>
            <a
              href="mailto:recruit@felia-home.co.jp"
              className="border-2 border-white text-white px-10 py-4 rounded-full font-bold text-sm hover:bg-white/10 transition-colors"
            >
              中途採用に応募する
            </a>
          </div>
          <p className="text-white/40 text-xs mt-6">
            ※ 応募後、担当者より3営業日以内にご連絡いたします。
          </p>
        </div>
      </section>

    </div>
  );
}
