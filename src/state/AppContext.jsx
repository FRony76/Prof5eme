import { createContext, useContext, useReducer, useEffect } from "react";

const initialState = {
  authed: null,
  screen: "home",
  subj: null, topic: null, level: 2,
  qData: null, answer: "", answerMode: "text", photo: null,
  showHint: false, feedback: null, loading: false,
  score: 0, streak: 0, count: 0, phase: "q", celebrated: false,
  cardsSubj: "maths", cardsTopic: null,
  bankSubj: "maths", bankTopic: null, bankIdx: 0,
  bankShowHint: false, bankShowAnswer: false,
  bankAnswerMode: "text", bankAnswer: "", bankPhoto: null,
  bankFeedback: null, bankChecking: false,
  historyData: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET":
      return { ...state, ...action.payload };

    case "QUIZ_START":
      return { ...state, score: 0, streak: 0, count: 0, screen: "quiz" };

    case "QUIZ_NEXT":
      return { ...state, loading: true, qData: null, feedback: null,
        answer: "", answerMode: "text", photo: null, showHint: false,
        phase: "q", celebrated: false };

    case "QUIZ_LOADED":
      return { ...state, loading: false, qData: action.qData };

    case "VALIDATE_START":
      return { ...state, loading: true };

    case "VALIDATE_DONE": {
      const { d, level } = action;
      const resultOk  = d.result_correct === true || d.result_correct === "true";
      const formulaOk = d.formula_recalled !== false && d.formula_recalled !== "false";
      const writtenOk = d.well_written === true || d.well_written === "true";
      const ok   = resultOk && formulaOk && writtenOk;
      const half = !ok && resultOk;
      const streakBonus = ok && state.streak >= 2 ? 5 : 0;
      const pts  = ok ? level * 10 + streakBonus + 2 : half ? level * 3 : 0;
      const fb   = { ...d, _ok: ok, _half: half, _pts: pts, _formulaOk: formulaOk, _writtenOk: writtenOk };
      return { ...state, loading: false, feedback: fb, phase: "fb",
        count: state.count + 1, score: state.score + pts,
        streak: ok ? state.streak + 1 : 0, celebrated: ok };
    }

    case "VALIDATE_ERROR":
      return { ...state, loading: false, phase: "fb",
        feedback: { _ok: false, _half: false, feedback: "Erreur de correction.", correct_answer: "" } };

    case "BANK_SELECT_TOPIC":
      return { ...state, bankTopic: action.topic, bankIdx: 0,
        bankShowHint: false, bankShowAnswer: false,
        bankAnswer: "", bankPhoto: null, bankFeedback: null, bankAnswerMode: "text",
        screen: "bank-view" };

    case "BANK_NAV":
      return { ...state, bankIdx: action.idx,
        bankShowHint: false, bankShowAnswer: false,
        bankAnswer: "", bankPhoto: null, bankFeedback: null, bankAnswerMode: "text" };

    case "CHECK_BANK_START":
      return { ...state, bankChecking: true };

    case "CHECK_BANK_DONE": {
      const d = action.d;
      const resultOk  = d.result_correct === true || d.result_correct === "true";
      const formulaOk = d.formula_recalled !== false && d.formula_recalled !== "false";
      const writtenOk = d.well_written === true || d.well_written === "true";
      const ok   = resultOk && formulaOk && writtenOk;
      const half = !ok && resultOk;
      return { ...state, bankChecking: false,
        bankFeedback: { _ok: ok, _half: half, feedback: d.feedback,
          _formulaOk: formulaOk, _writtenOk: writtenOk } };
    }

    case "CHECK_BANK_ERROR":
      return { ...state, bankChecking: false,
        bankFeedback: { _ok: false, _half: false, feedback: "Erreur de correction, réessaie." } };

    case "RESET_BANK_CHECK":
      return { ...state, bankAnswer: "", bankPhoto: null, bankFeedback: null, bankAnswerMode: "text" };

    default: return state;
  }
}

const AppContext = createContext(null);
export const useAppState = () => useContext(AppContext);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let alive = true;
    fetch("/api/session", { headers: { Accept: "application/json" } })
      .then(r => (r.ok ? r.json() : { authed: false }))
      .then(d => { if (alive) dispatch({ type: "SET", payload: { authed: !!d.authed } }); })
      .catch(() => { if (alive) dispatch({ type: "SET", payload: { authed: false } }); });
    const onExpired = () => dispatch({ type: "SET", payload: { authed: false } });
    window.addEventListener("auth-expired", onExpired);
    return () => { alive = false; window.removeEventListener("auth-expired", onExpired); };
  }, []);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}
