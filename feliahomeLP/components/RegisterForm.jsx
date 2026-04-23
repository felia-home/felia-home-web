// 会員登録フォーム・2段階

const { useState: useFormState } = React;

function RegisterForm({ steps: totalSteps = 2 }) {
  const [step, setStep] = useFormState(1);
  const [submitted, setSubmitted] = useFormState(false);
  const [data, setData] = useFormState({
    email: "", password: "",
    lastName: "", firstName: "", phone: "",
    area: "", propertyType: "", budget: "",
    agree: false,
  });
  const [errors, setErrors] = useFormState({});

  const update = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setData((d) => ({ ...d, [k]: v }));
    setErrors((er) => ({ ...er, [k]: null }));
  };

  const validateStep1 = () => {
    const er = {};
    if (!data.email) er.email = "メールアドレスを入力してください";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) er.email = "メールアドレスの形式が正しくありません";
    if (!data.password) er.password = "パスワードを設定してください";
    else if (data.password.length < 8) er.password = "8文字以上で設定してください";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const validateStep2 = () => {
    const er = {};
    if (!data.lastName) er.lastName = "姓を入力してください";
    if (!data.firstName) er.firstName = "名を入力してください";
    if (!data.phone) er.phone = "電話番号を入力してください";
    if (!data.agree) er.agree = "利用規約への同意が必要です";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const handleNext = () => {
    if (totalSteps === 1) {
      if (validateStep1() && validateStep2()) setSubmitted(true);
      return;
    }
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else {
      if (validateStep2()) setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="register-card">
        <div className="form-success">
          <div className="form-success-mark">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <path d="M10 20l7 7 13-14" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <h3 className="form-success-title">ご登録ありがとうございます</h3>
          <p className="form-success-desc">
            確認メールを <em>{data.email}</em> にお送りしました。<br />
            メール内のリンクをクリックして、登録を完了してください。
          </p>
          <button className="form-success-reset" onClick={() => { setSubmitted(false); setStep(1); }}>
            別のアカウントで登録する
          </button>
        </div>
      </div>
    );
  }

  const renderStep1 = () => (
    <>
      <div className="form-field">
        <label className="form-label">
          <span className="form-label-jp">
            メールアドレス
            <span className="form-label-required">必須</span>
          </span>
          <span className="form-label-sub">ご連絡用</span>
        </label>
        <input
          type="email"
          className={"form-input" + (errors.email ? " form-input--error" : "")}
          value={data.email}
          onChange={update("email")}
          placeholder="example@felia-home.co.jp"
          autoComplete="email"
        />
        {errors.email && <div className="form-error">{errors.email}</div>}
      </div>

      <div className="form-field">
        <label className="form-label">
          <span className="form-label-jp">
            パスワード
            <span className="form-label-required">必須</span>
          </span>
          <span className="form-label-sub">8文字以上</span>
        </label>
        <input
          type="password"
          className={"form-input" + (errors.password ? " form-input--error" : "")}
          value={data.password}
          onChange={update("password")}
          placeholder="半角英数字・記号で入力"
          autoComplete="new-password"
        />
        {errors.password && <div className="form-error">{errors.password}</div>}
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="form-row">
        <div className="form-field">
          <label className="form-label">
            <span className="form-label-jp">姓<span className="form-label-required">必須</span></span>
          </label>
          <input
            type="text"
            className={"form-input" + (errors.lastName ? " form-input--error" : "")}
            value={data.lastName}
            onChange={update("lastName")}
            placeholder="山田"
          />
          {errors.lastName && <div className="form-error">{errors.lastName}</div>}
        </div>
        <div className="form-field">
          <label className="form-label">
            <span className="form-label-jp">名<span className="form-label-required">必須</span></span>
          </label>
          <input
            type="text"
            className={"form-input" + (errors.firstName ? " form-input--error" : "")}
            value={data.firstName}
            onChange={update("firstName")}
            placeholder="太郎"
          />
          {errors.firstName && <div className="form-error">{errors.firstName}</div>}
        </div>
      </div>

      <div className="form-field">
        <label className="form-label">
          <span className="form-label-jp">電話番号<span className="form-label-required">必須</span></span>
          <span className="form-label-sub">ハイフンあり・なし どちらも可</span>
        </label>
        <input
          type="tel"
          className={"form-input" + (errors.phone ? " form-input--error" : "")}
          value={data.phone}
          onChange={update("phone")}
          placeholder="090-0000-0000"
        />
        {errors.phone && <div className="form-error">{errors.phone}</div>}
      </div>

      <div className="form-row">
        <div className="form-field">
          <label className="form-label">
            <span className="form-label-jp">ご希望エリア<span className="form-label-optional">任意</span></span>
          </label>
          <select className="form-input form-select" value={data.area} onChange={update("area")}>
            <option value="">選択してください</option>
            <option>港区</option>
            <option>渋谷区</option>
            <option>新宿区</option>
            <option>千代田区</option>
            <option>中央区</option>
            <option>目黒区</option>
            <option>世田谷区</option>
            <option>杉並区</option>
            <option>中野区</option>
            <option>品川区</option>
            <option>その他</option>
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">
            <span className="form-label-jp">物件種別<span className="form-label-optional">任意</span></span>
          </label>
          <select className="form-input form-select" value={data.propertyType} onChange={update("propertyType")}>
            <option value="">選択してください</option>
            <option>新築戸建て</option>
            <option>中古戸建て</option>
            <option>マンション</option>
            <option>土地</option>
            <option>その他</option>
          </select>
        </div>
      </div>

      <div className="form-field">
        <label className="form-label">
          <span className="form-label-jp">ご予算<span className="form-label-optional">任意</span></span>
        </label>
        <select className="form-input form-select" value={data.budget} onChange={update("budget")}>
          <option value="">選択してください</option>
          <option>〜 5,000万円</option>
          <option>5,000万円 〜 1億円</option>
          <option>1億円 〜 3億円</option>
          <option>3億円 〜 5億円</option>
          <option>5億円以上</option>
        </select>
      </div>

      <label className={"form-agree" + (errors.agree ? " form-agree--error" : "")}>
        <input type="checkbox" checked={data.agree} onChange={update("agree")} />
        <span className="form-agree-box">
          <span className="form-agree-check">✓</span>
        </span>
        <span className="form-agree-text">
          <a href="#" className="form-agree-link">利用規約</a> および
          <a href="#" className="form-agree-link">プライバシーポリシー</a> に同意します
        </span>
      </label>
      {errors.agree && <div className="form-error">{errors.agree}</div>}
    </>
  );

  const renderAll = () => (
    <>
      {renderStep1()}
      <div className="form-section-rule" />
      {renderStep2()}
    </>
  );

  return (
    <div className="register-card" id="register">
      <div className="register-card-inner">
        <div className="register-header">
          <div className="register-eyebrow">
            <span className="dot" />
            <span>無料会員登録フォーム</span>
          </div>
          <h2 className="register-title">
            8,111件の未公開物件へ、<br />
            今すぐアクセス
          </h2>
          <p className="register-desc">
            {totalSteps === 2
              ? <>ご登録は2ステップ・約60秒で完了します。</>
              : <>ご登録は約60秒で完了します。</>}
          </p>
        </div>

        {totalSteps === 2 && (
          <div className="form-steps">
            <div className={"form-step" + (step >= 1 ? " form-step--on" : "")}>
              <span className="form-step-num">1</span>
              <span className="form-step-label">アカウント情報</span>
            </div>
            <div className="form-steps-rule">
              <div className="form-steps-rule-fill" style={{ width: step >= 2 ? "100%" : "0%" }} />
            </div>
            <div className={"form-step" + (step >= 2 ? " form-step--on" : "")}>
              <span className="form-step-num">2</span>
              <span className="form-step-label">お客様情報</span>
            </div>
          </div>
        )}

        <div className="form-body">
          {totalSteps === 1 ? renderAll() : (step === 1 ? renderStep1() : renderStep2())}
        </div>

        <div className="form-actions">
          {totalSteps === 2 && step === 2 && (
            <button className="btn-ghost" onClick={() => setStep(1)}>
              <span>← 戻る</span>
            </button>
          )}
          <button className="btn-primary btn-primary--full" onClick={handleNext}>
            <span>
              {totalSteps === 2 && step === 1 ? "次へ進む" : "登録を完了する"}
            </span>
            <span className="btn-primary-arrow">→</span>
          </button>
        </div>

        <div className="form-foot">
          <div className="form-foot-item">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <rect x="3" y="7" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
            <span>SSL暗号化通信</span>
          </div>
          <div className="form-foot-item">
            <span className="dot" />
            <span>登録・月額 完全無料</span>
          </div>
          <div className="form-foot-item">
            <span className="dot" />
            <span>いつでも退会可能</span>
          </div>
        </div>
      </div>

      <aside className="register-aside">
        <div className="register-aside-eyebrow">会員登録でご利用いただける機能</div>
        <ul className="register-aside-list">
          <li><span className="register-aside-num">1</span><span>未公開物件 8,111件の閲覧・資料請求</span></li>
          <li><span className="register-aside-num">2</span><span>物件のお気に入り保存・比較</span></li>
          <li><span className="register-aside-num">3</span><span>検索条件保存・マッチングメール</span></li>
          <li><span className="register-aside-num">4</span><span>希望エリアの月次マーケット情報</span></li>
        </ul>
        <div className="register-aside-rule" />
        <div className="register-aside-quote">
          <p>「一般には公開されていなかった渋谷区の戸建て物件を、競合なく購入できました。」</p>
          <div className="register-aside-quote-cite">— 会員 M様（40代・港区在住）</div>
        </div>
      </aside>
    </div>
  );
}

window.RegisterForm = RegisterForm;
