import { useEffect } from "react";
import { APP_VERSION } from "./constants.js";
import { fetchHistory } from "./lib/api.js";
import { AppProvider, useAppState } from "./state/AppContext.jsx";
import LoginScreen from "./components/LoginScreen.jsx";
import AppShell from "./components/AppShell.jsx";
import HomeScreen from "./screens/HomeScreen.jsx";
import TopicListScreen from "./screens/TopicListScreen.jsx";
import TopicHubScreen from "./screens/TopicHubScreen.jsx";
import SetupScreen from "./screens/SetupScreen.jsx";
import QuizScreen from "./screens/QuizScreen.jsx";
import CardsView from "./screens/CardsView.jsx";
import BankView from "./screens/BankView.jsx";
import HistoryScreen from "./screens/HistoryScreen.jsx";
import AttemptDetailScreen from "./screens/AttemptDetailScreen.jsx";

function AppInner() {
  const { state, dispatch } = useAppState();
  const { authed, screen } = state;

  // Badge de version toujours visible
  useEffect(() => {
    const el = document.createElement("div");
    el.textContent = `v${APP_VERSION}`;
    Object.assign(el.style, {
      position: "fixed", bottom: "10px", right: "12px",
      fontSize: "10.5px", color: "#9CA3AF", pointerEvents: "none",
      userSelect: "none", zIndex: "9999",
      fontFamily: "system-ui, -apple-system, sans-serif",
      letterSpacing: "0.05em",
    });
    document.body.appendChild(el);
    return () => document.body.removeChild(el);
  }, []);

  // Hydratation score/streak depuis la DB dès que l'auth est confirmée
  useEffect(() => {
    if (!authed) return;
    fetchHistory().then(h => {
      if (h) dispatch({ type: "SET", payload: { score: h.score, streak: h.streak, historyData: h } });
    });
  }, [authed]);

  if (authed === null) {
    return (
      <div style={{ minHeight: "100vh", background: "#F4F2EC", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Figtree',system-ui,sans-serif", color: "#9A9AAB", fontSize: 14 }}>
        Chargement…
      </div>
    );
  }
  if (!authed) return <LoginScreen onSuccess={(u) => dispatch({ type: "SET", payload: { authed: true, user: u } })} />;

  return (
    <AppShell>
      {screen === "topics" ? <TopicListScreen />
        : screen === "topic" ? <TopicHubScreen />
        : screen === "cards-view" ? <CardsView />
        : screen === "bank-view" ? <BankView />
        : screen === "setup" ? <SetupScreen />
        : screen === "history" ? <HistoryScreen />
        : screen === "attempt" ? <AttemptDetailScreen />
        : screen === "home" ? <HomeScreen />
        : <QuizScreen />}
    </AppShell>
  );
}

export default function App() {
  return <AppProvider><AppInner /></AppProvider>;
}
