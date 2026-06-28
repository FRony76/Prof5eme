import { KIND_STYLE } from "../theme.js";
import { FIGURES } from "../figures/index.jsx";
import Table from "./Table.jsx";

export default function CourseView({ course, c }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <p style={{ margin:0, fontSize:14, lineHeight:1.7, color:"#374151", padding:"10px 14px", background:"white", borderRadius:8, border:"1.5px solid #E5E7EB" }}>{course.intro}</p>
      {course.sections.map((s, i) => {
        const ks = KIND_STYLE[s.kind];
        return (
          <div key={i} style={{ background:"white", border:"1.5px solid #E5E7EB", borderLeft:`4px solid ${ks ? ks.borderColor : "#D1D5DB"}`, borderRadius:"0 8px 8px 0", padding:"12px 14px" }}>
            {ks && <div style={{ fontSize:9.5, fontWeight:700, color:ks.labelColor, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>{ks.label}</div>}
            <div style={{ fontSize:13.5, fontWeight:600, color:"#111827", marginBottom:s.table||s.b?6:0 }}>{s.h}</div>
            {s.table && <Table data={s.table} c={c} />}
            {s.b && <p style={{ fontSize:12.5, lineHeight:1.85, color:"#374151", margin:0, whiteSpace:"pre-wrap" }}>{s.b}</p>}
            {s.fig && FIGURES[s.fig] && <div style={{ margin:"10px auto 0", textAlign:"center" }}>{FIGURES[s.fig](c)}</div>}
          </div>
        );
      })}
      {course.keypoints && course.keypoints.length > 0 && (
        <div style={{ background:c.lit, border:`1.5px solid ${c.med}`, borderRadius:10, padding:"12px 14px" }}>
          <div style={{ fontSize:9.5, fontWeight:700, color:c.txt, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>À retenir</div>
          {course.keypoints.map((k, i) => (
            <div key={i} style={{ fontSize:12.5, color:c.txt, lineHeight:1.7, display:"flex", gap:6, alignItems:"flex-start", marginBottom:i<course.keypoints.length-1?3:0 }}>
              <span style={{ flexShrink:0, fontWeight:600 }}>•</span><span>{k}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
