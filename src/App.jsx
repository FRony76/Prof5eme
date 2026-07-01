import { useEffect } from "react";
import { APP_VERSION } from "./constants.js";
import { fetchHistory } from "./lib/api.js";
import { AppProvider, useAppState } from "./state/AppContext.jsx";
import LoginScreen from "./components/LoginScreen.jsx";
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
      <div style={{ minHeight: "100vh", background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, -apple-system, sans-serif", color: "#9CA3AF", fontSize: 14 }}>
        Chargement…
      </div>
    );
  }
  if (!authed) return <LoginScreen onSuccess={() => dispatch({ type: "SET", payload: { authed: true } })} />;

  if (screen === "topics")  return <TopicListScreen />;
  if (screen === "topic")   return <TopicHubScreen />;
  if (screen === "cards-view") return <CardsView />;
  if (screen === "bank-view")  return <BankView />;
  if (screen === "setup")   return <SetupScreen />;
  if (screen === "history") return <HistoryScreen />;
  if (screen === "attempt") return <AttemptDetailScreen />;
  if (screen === "home")    return <HomeScreen />;
  return <QuizScreen />;
}

export default function App() {
  return <AppProvider><AppInner /></AppProvider>;
}
