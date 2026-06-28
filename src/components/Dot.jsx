export default function Dot({ filled, color }) {
  return <div style={{ width: 8, height: 8, borderRadius: "50%", background: filled ? color : "#D1D5DB", transition: "background 0.2s" }} />;
}
