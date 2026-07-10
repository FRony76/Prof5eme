import { KIND_STYLE } from "../theme.js";
import { FIGURES } from "../figures/index.jsx";
import Table from "./Table.jsx";

export default function CourseView({ course, c }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <p style={{ margin:0, fontSize:16.5, lineHeight:1.72, color:"#2A2A38" }}>{course.intro}</p>
      {course.sections.map((s, i) => {
        const ks = KIND_STYLE[s.kind];
        return (
          <div key={i} style={{ background: ks ? ks.bg : "#F4F2EC", borderLeft:`4px solid ${ks ? ks.borderColor : "#D1D5DB"}`, borderRadius:"0 14px 14px 0", padding:"16px 20px" }}>
            {ks && <div style={{ fontSize:11, fontWeight:700, color:ks.labelColor, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>{ks.label}</div>}
            <div style={{ fontSize:15.5, fontWeight:700, color:"#191927", marginBottom:s.table||s.b?8:0 }}>{s.h}</div>
            {s.table && <Table data={s.table} c={c} />}
            {s.b && <p style={{ fontSize:15, lineHeight:1.75, color:"#2A2A38", margin:0, whiteSpace:"pre-wrap" }}>{s.b}</p>}
            {s.fig && FIGURES[s.fig] && <div style={{ margin:"12px auto 0", textAlign:"center" }}>{FIGURES[s.fig](c)}</div>}
          </div>
        );
      })}
      {course.keypoints && course.keypoints.length > 0 && (
        <div style={{ background:c.lit, borderRadius:16, padding:"18px 20px" }}>
          <div style={{ fontWeight:700, fontSize:14, marginBottom:8, display:"flex", alignItems:"center", gap:7, color:c.txt }}>✎ À retenir</div>
          <ul style={{ margin:0, paddingLeft:20, fontSize:15, lineHeight:1.7, color:"#2A2A38" }}>
            {course.keypoints.map((k, i) => (
              <li key={i} style={{ marginBottom:4 }}>{k}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
