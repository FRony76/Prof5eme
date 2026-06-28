import { useEffect } from "react";
import { APP_VERSION } from "./constants.js";
import { AppProvider, useAppState } from "./state/AppContext.jsx";
import LoginScreen from "./components/LoginScreen.jsx";
import HomeScreen from "./screens/HomeScreen.jsx";
import SetupScreen from "./screens/SetupScreen.jsx";
import QuizScreen from "./screens/QuizScreen.jsx";
import CardsScreen from "./screens/CardsScreen.jsx";
import CardsView from "./screens/CardsView.jsx";
import BankScreen from "./screens/BankScreen.jsx";
import BankView from "./screens/BankView.jsx";

function AppInner() {
  const { state, dispatch } = useAppState();
  const { authed, screen } = state;

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

  if (authed === null) {
    return (
      <div style={{ minHeight: "100vh", background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, -apple-system, sans-serif", color: "#9CA3AF", fontSize: 14 }}>
        Chargement…
      </div>
    );
  }
  if (!authed) return <LoginScreen onSuccess={() => dispatch({ type: "SET", payload: { authed: true } })} />;

  if (screen === "bank-view")  return <BankView />;
  if (screen === "bank")       return <BankScreen />;
  if (screen === "cards-view") return <CardsView />;
  if (screen === "cards")      return <CardsScreen />;
  if (screen === "setup")      return <SetupScreen />;
  if (screen === "home")       return <HomeScreen />;
  return <QuizScreen />;
}

export default function App() {
  return <AppProvider><AppInner /></AppProvider>;
}
