import { useAppState } from "../state/AppContext.jsx";

const DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];

// Calcule, pour la semaine en cours (lundi → dimanche), quels jours
// contiennent au moins une tentative dans historyData.recent.
export function computeWeekActivity(historyData) {
  const recent = historyData?.recent || [];
  const now = new Date();
  const dow = now.getDay(); // 0 = dimanche ... 6 = samedi
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset);

  return DAY_LABELS.map((label, i) => {
    const dayStart = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    const dayEnd = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i + 1);
    const active = recent.some(r => {
      if (!r.created_at) return false;
      const t = new Date(r.created_at).getTime();
      return t >= dayStart.getTime() && t < dayEnd.getTime();
    });
    return { day: label, active };
  });
}

const HOME_SCREENS = ["home", "topics", "topic", "cards-view", "bank-view", "setup", "quiz"];
const PROGRESS_SCREENS = ["history", "attempt"];

export default function AppShell({ children }) {
  const { state, dispatch } = useAppState();
  const { screen, score, streak, historyData, user } = state;

  const goHome = () => dispatch({ type: "SET", payload: { screen: "home" } });
  const goProgress = () => dispatch({ type: "SET", payload: { screen: "history" } });

  const logout = async () => {
    try { await fetch("/api/logout", { method: "POST" }); } catch { /* ignore */ }
    dispatch({ type: "SET", payload: { authed: false } });
  };

  const navActive = HOME_SCREENS.includes(screen) ? "home" : PROGRESS_SCREENS.includes(screen) ? "progress" : "home";
  const weekDots = computeWeekActivity(historyData);
  const userInitial = user ? user.charAt(0).toUpperCase() : "?";

  const navBase = { display: "flex", alignItems: "center", gap: 11, padding: "11px 12px", borderRadius: 11, fontWeight: 600, fontSize: 14.5, cursor: "pointer", transition: "background .15s" };
  const navOn = { ...navBase, background: "#7B74B2", color: "#fff" };
  const navOff = { ...navBase, color: "#B9B9C6" };

  return (
    <div id="rev-app" style={{ display: "flex", minHeight: "100vh", width: "100%", background: "#F4F2EC" }}>
      <style>{`
        *{box-sizing:border-box}
        html,body{margin:0;padding:0}
        body{background:#EDEAE1;font-family:'Figtree',system-ui,sans-serif;color:#191927;-webkit-font-smoothing:antialiased}
        ::selection{background:#5B4FE9;color:#fff}
        @keyframes revFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes revPop{0%{transform:scale(.9);opacity:0}60%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
        @keyframes revBar{from{width:0}}
        .rev-scroll::-webkit-scrollbar{width:10px}
        .rev-scroll::-webkit-scrollbar-thumb{background:#D6D2C6;border-radius:20px;border:3px solid #F4F2EC}
        @media(max-width:780px){
          #rev-app{flex-direction:column}
          #rev-side{position:fixed!important;bottom:0;left:0;right:0;top:auto!important;width:auto!important;height:auto!important;flex-direction:row!important;align-items:center;gap:6px;padding:6px 8px!important;border-top:1px solid #7B74B2;z-index:60}
          #rev-side .rev-logo,#rev-side .rev-streak,#rev-side .rev-profile{display:none!important}
          #rev-nav{flex-direction:row!important;margin:0!important;gap:4px;width:100%;justify-content:space-around}
          #rev-nav>div{flex:1;justify-content:center;font-size:12px;padding:9px 4px!important}
          .rev-topbar{padding:12px 16px!important}
          .rev-pad{padding:22px 16px 96px!important}
          .rev-hero{flex-direction:column!important;align-items:flex-start!important;gap:18px!important;padding:24px!important}
          .rev-grid3,.rev-grid2,.rev-progcols{grid-template-columns:1fr!important}
          .rev-grid4{grid-template-columns:repeat(2,1fr)!important}
        }
      `}</style>

      {/* ============ SIDEBAR ============ */}
      <aside id="rev-side" style={{ width: 248, flex: "none", background: "#5B5488", color: "#F4F2EC", display: "flex", flexDirection: "column", padding: "26px 18px", position: "sticky", top: 0, height: "100vh" }}>
        <div onClick={goHome} className="rev-logo" style={{ display: "flex", alignItems: "center", gap: 11, cursor: "pointer", padding: "0 8px 6px" }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "#5B4FE9", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 19, color: "#fff" }}>5</div>
          <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 20, letterSpacing: "-.5px" }}>Prof5eme</div>
        </div>

        <nav id="rev-nav" style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 26 }}>
          <div onClick={goHome} style={navActive === "home" ? navOn : navOff}>
            <span style={{ fontSize: 18, width: 22, display: "inline-flex", justifyContent: "center" }}>◇</span>Tableau de bord
          </div>
          <div onClick={goProgress} style={navActive === "progress" ? navOn : navOff}>
            <span style={{ fontSize: 18, width: 22, display: "inline-flex", justifyContent: "center" }}>◈</span>Progression
          </div>
        </nav>

        <div className="rev-streak" style={{ marginTop: "auto", background: "#6A63A0", border: "1px solid #7B74B2", borderRadius: 16, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 15 }}>
            <span style={{ fontSize: 17 }}>✺</span>Série de {streak} jours
          </div>
          <div style={{ display: "flex", gap: 5, marginTop: 12 }}>
            {weekDots.map((d, i) => (
              <div key={i} title={d.day} style={{ width: 24, height: 24, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: d.active ? "#8C84D6" : "#7B74B2", color: d.active ? "#fff" : "#E4E1F2" }}>
                {d.day}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12.5, color: "#9A9AAB", marginTop: 11, lineHeight: 1.4 }}>Reviens demain pour ne pas casser ta série 🔥</div>
        </div>

        <div className="rev-profile" style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, padding: 4 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#5B4FE9,#C74AA0)", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: 14 }}>{userInitial}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user || "Élève"}</div>
            <div style={{ fontSize: 12, color: "#9A9AAB" }}>Classe de 5ᵉ</div>
          </div>
        </div>
      </aside>

      {/* ============ MAIN ============ */}
      <main className="rev-scroll" style={{ flex: 1, minWidth: 0, height: "100vh", overflowY: "auto" }}>
        <div className="rev-topbar" style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 40px", position: "sticky", top: 0, background: "rgba(244,242,236,.85)", backdropFilter: "blur(10px)", zIndex: 20, borderBottom: "1px solid #E7E4DB" }}>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, background: "#fff", border: "1px solid #E1DDD2", padding: "8px 14px", borderRadius: 12, fontWeight: 700, fontSize: 14 }}>
              <span style={{ color: "#E0972B" }}>◆</span>{score} pts
            </div>
            <div onClick={logout} style={{ display: "flex", alignItems: "center", gap: 7, background: "#fff", border: "1px solid #E1DDD2", padding: "8px 14px", borderRadius: 12, fontWeight: 600, fontSize: 13, color: "#6B6B7B", cursor: "pointer" }}>
              Se déconnecter
            </div>
          </div>
        </div>

        <div className="rev-pad" style={{ padding: "34px 40px 60px", maxWidth: 1120 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
