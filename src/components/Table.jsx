export default function Table({ data, c }) {
  return (
    <div style={{ overflowX:"auto", marginBottom:8 }}>
      <table style={{ borderCollapse:"collapse", fontSize:13, width:"100%" }}>
        <tbody>
          {data.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} style={{ border:"1px solid #EAE7DE", padding:"6px 10px", background:ri===0?c.lit:"white", fontWeight:ri===0?700:400, color:ri===0?c.txt:"#2A2A38", textAlign:"center", whiteSpace:"nowrap" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
