// Main App

const { useState: useAppState, useEffect: useAppEffect } = React;

function App() {
  const defaultTweaks = React.useMemo(() => {
    try {
      const el = document.getElementById("tweak-defaults");
      return el ? JSON.parse(el.textContent) : { formSteps: 2 };
    } catch { return { formSteps: 2 }; }
  }, []);

  const [tweaks, setTweaksState] = useAppState(defaultTweaks);
  const [editMode, setEditMode] = useAppState(false);

  useAppEffect(() => {
    const onMsg = (e) => {
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.type === "__activate_edit_mode") setEditMode(true);
      if (e.data.type === "__deactivate_edit_mode") setEditMode(false);
    };
    window.addEventListener("message", onMsg);
    try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch {}
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const setTweaks = (patch) => {
    setTweaksState((t) => ({ ...t, ...patch }));
    try { window.parent.postMessage({ type: "__edit_mode_set_keys", edits: patch }, "*"); } catch {}
  };

  const scrollToForm = () => {
    const el = document.getElementById("register");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <TopNav onCtaClick={scrollToForm} />
      <main>
        <Hero onCtaClick={scrollToForm} />
        <PrivateSelection />
        <Benefits />
        <Privacy />

        <section className="register-section">
          <div className="register-section-inner">
            <div className="register-section-head">
              <div className="register-section-eyebrow">
                <span className="section-eyebrow-rule" />
                <span>無料会員登録</span>
                <span className="section-eyebrow-rule" />
              </div>
              <h2 className="register-section-title">
                あなたの理想の住まい探しを、<br />
                フェリアホームがサポートします
              </h2>
              <p className="register-section-jp">
                未公開物件 8,111件へのアクセスを、60秒の登録で。
              </p>
            </div>
            <RegisterForm steps={tweaks.formSteps} />
          </div>
        </section>
      </main>
      <Footer />
      <TweaksPanel active={editMode} tweaks={tweaks} setTweaks={setTweaks} />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
