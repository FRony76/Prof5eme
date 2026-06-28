export default function Table({ data, c }) {
  return (
    <div style={{ overflowX:"auto", marginBottom:8 }}>
      <table style={{ borderCollapse:"collapse", fontSize:12, width:"100%" }}>
        <tbody>
          {data.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} style={{ border:`1px solid ${c.med}`, padding:"4px 8px", background:ri===0?c.lit:"white", fontWeight:ri===0?600:400, color:c.txt, textAlign:"center", whiteSpace:"nowrap" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
