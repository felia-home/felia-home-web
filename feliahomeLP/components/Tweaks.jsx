// Tweaks

function TweaksPanel({ active, tweaks, setTweaks }) {
  if (!active) return null;
  return (
    <div className="tweaks-panel">
      <div className="tweaks-head">
        <div className="tweaks-title">Tweaks</div>
        <div className="tweaks-sub">デザインの調整</div>
      </div>
      <div className="tweaks-body">
        <div className="tweaks-group">
          <div className="tweaks-group-label">登録フォームのステップ数</div>
          <div className="tweaks-seg">
            {[1, 2].map((n) => (
              <button
                key={n}
                className={"tweaks-seg-btn" + (tweaks.formSteps === n ? " on" : "")}
                onClick={() => setTweaks({ formSteps: n })}
              >
                <span className="tweaks-seg-num">{n}</span>
                <span className="tweaks-seg-jp">{n === 1 ? "1ステップ（一括）" : "2ステップ（推奨）"}</span>
              </button>
            ))}
          </div>
          <div className="tweaks-hint">
            2ステップは心理的負担を減らし完了率を高めます。1ステップは情報を一度に確認できます。
          </div>
        </div>
      </div>
    </div>
  );
}

window.TweaksPanel = TweaksPanel;
