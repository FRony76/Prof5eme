export const FIGURES = {
  fractionBar: (c) => (
    <svg viewBox="0 0 220 42" width="100%" style={{maxWidth:260,display:"block"}} xmlns="http://www.w3.org/2000/svg">
      {[0,1,2,3].map(i => <rect key={i} x={4+i*53} y={4} width={49} height={26} rx={4} fill={i<3?c.pri:"white"} stroke={c.pri} strokeWidth={1.5} opacity={i<3?0.7:0.35}/>)}
      <text x={110} y={39} textAnchor="middle" fontSize={9} fill="#6B7280">3/4 → 3 parts colorées sur 4</text>
    </svg>
  ),
  droiteNombres: (c) => (
    <svg viewBox="0 0 260 42" width="100%" style={{maxWidth:280,display:"block"}} xmlns="http://www.w3.org/2000/svg">
      <line x1={15} y1={20} x2={245} y2={20} stroke="#9CA3AF" strokeWidth={1.5}/>
      <polygon points="245,15 255,20 245,25" fill="#9CA3AF"/>
      {[-5,-4,-3,-2,-1,0,1,2,3,4,5].map(n=>{const x=15+(n+5)*20;return(<g key={n}><line x1={x} y1={16} x2={x} y2={24} stroke="#9CA3AF" strokeWidth={1}/><text x={x} y={36} textAnchor="middle" fontSize={8} fill={n===0?"#111827":n<0?c.pri:"#374151"} fontWeight={n===0?"bold":"normal"}>{n}</text></g>);})}
      <circle cx={15+7*20} cy={20} r={4} fill={c.pri}/><text x={15+7*20} y={13} textAnchor="middle" fontSize={8} fill={c.pri}>+2</text>
      <circle cx={15+2*20} cy={20} r={4} fill={c.txt}/><text x={15+2*20} y={13} textAnchor="middle" fontSize={8} fill={c.txt}>-3</text>
    </svg>
  ),
  repereXY: (c) => (
    <svg viewBox="0 0 155 140" width="100%" style={{maxWidth:195,display:"block"}} xmlns="http://www.w3.org/2000/svg">
      <line x1={10} y1={70} x2={148} y2={70} stroke="#9CA3AF" strokeWidth={1.5}/><polygon points="148,65 156,70 148,75" fill="#9CA3AF"/>
      <line x1={78} y1={130} x2={78} y2={8} stroke="#9CA3AF" strokeWidth={1.5}/><polygon points="73,8 78,0 83,8" fill="#9CA3AF"/>
      <text x={151} y={74} fontSize={9} fill="#6B7280">x</text><text x={76} y={6} textAnchor="end" fontSize={9} fill="#6B7280">y</text>
      {[-3,-2,-1,1,2,3].map(n=>(<g key={n}><line x1={78+n*20} y1={67} x2={78+n*20} y2={73} stroke="#9CA3AF" strokeWidth={1}/><text x={78+n*20} y={82} textAnchor="middle" fontSize={7} fill="#9CA3AF">{n}</text><line x1={75} y1={70-n*20} x2={81} y2={70-n*20} stroke="#9CA3AF" strokeWidth={1}/><text x={71} y={70-n*20+3} textAnchor="end" fontSize={7} fill="#9CA3AF">{n}</text></g>))}
      <circle cx={78+3*20} cy={70-2*20} r={4} fill={c.pri}/><text x={78+3*20+7} y={70-2*20-3} fontSize={8} fill={c.pri} fontWeight="bold">A(3;2)</text>
    </svg>
  ),
  triangleAngles: (c) => (
    <svg viewBox="0 0 160 105" width="100%" style={{maxWidth:200,display:"block"}} xmlns="http://www.w3.org/2000/svg">
      <polygon points="80,10 15,90 145,90" fill={c.lit} stroke={c.pri} strokeWidth={2}/>
      <text x={80} y={9} textAnchor="middle" fontSize={11} fill={c.txt} fontWeight="bold">α</text>
      <text x={14} y={96} fontSize={11} fill={c.txt} fontWeight="bold">β</text>
      <text x={147} y={96} fontSize={11} fill={c.txt} fontWeight="bold">γ</text>
      <text x={80} y={105} textAnchor="middle" fontSize={9} fill="#6B7280">α + β + γ = 180°</text>
    </svg>
  ),
  anglesParalleles: (c) => (
    <svg viewBox="0 0 180 100" width="100%" style={{maxWidth:220,display:"block"}} xmlns="http://www.w3.org/2000/svg">
      <line x1={8} y1={30} x2={172} y2={30} stroke="#9CA3AF" strokeWidth={1.5}/>
      <line x1={8} y1={70} x2={172} y2={70} stroke="#9CA3AF" strokeWidth={1.5}/>
      <text x={2} y={28} fontSize={8} fill="#9CA3AF">d₁</text><text x={2} y={68} fontSize={8} fill="#9CA3AF">d₂</text>
      <text x={168} y={27} fontSize={9} fill={c.txt} fontWeight="bold">∥</text>
      <line x1={48} y1={8} x2={118} y2={96} stroke="#374151" strokeWidth={1.5}/>
      <text x={62} y={28} fontSize={10} fill={c.pri} fontWeight="bold">α</text>
      <text x={92} y={80} fontSize={10} fill={c.pri} fontWeight="bold">α</text>
      <text x={90} y={22} fontSize={8} fill="#6B7280">alternes-internes</text>
      <text x={73} y={94} fontSize={8} fill="#6B7280">égaux</text>
    </svg>
  ),
  symetrieCentrale: (c) => (
    <svg viewBox="0 0 200 58" width="100%" style={{maxWidth:240,display:"block"}} xmlns="http://www.w3.org/2000/svg">
      <line x1={18} y1={28} x2={182} y2={28} stroke={c.pri} strokeWidth={1.5}/>
      <circle cx={40} cy={28} r={5} fill={c.pri}/><text x={40} y={20} textAnchor="middle" fontSize={10} fill={c.txt} fontWeight="bold">A</text>
      <circle cx={100} cy={28} r={5} fill="#374151"/><text x={100} y={20} textAnchor="middle" fontSize={10} fill="#374151" fontWeight="bold">O</text>
      <circle cx={160} cy={28} r={5} fill={c.pri} opacity={0.5}/><text x={160} y={20} textAnchor="middle" fontSize={10} fill={c.txt} fontWeight="bold">A'</text>
      <text x={100} y={50} textAnchor="middle" fontSize={9} fill="#6B7280">O est le milieu de [AA']</text>
    </svg>
  ),
  symetrieAxiale: (c) => (
    <svg viewBox="0 0 200 100" width="100%" style={{maxWidth:240,display:"block"}} xmlns="http://www.w3.org/2000/svg">
      <line x1={100} y1={4} x2={100} y2={96} stroke={c.pri} strokeWidth={2} strokeDasharray="5,3"/><text x={104} y={14} fontSize={9} fill={c.txt} fontWeight="bold">d</text>
      <circle cx={48} cy={48} r={5} fill={c.pri}/><text x={48} y={40} textAnchor="middle" fontSize={10} fill={c.txt} fontWeight="bold">A</text>
      <circle cx={152} cy={48} r={5} fill={c.pri} opacity={0.5}/><text x={152} y={40} textAnchor="middle" fontSize={10} fill={c.txt} fontWeight="bold">A'</text>
      <line x1={48} y1={48} x2={152} y2={48} stroke="#E5E7EB" strokeWidth={1} strokeDasharray="3,3"/>
      <line x1={96} y1={44} x2={104} y2={44} stroke="#9CA3AF" strokeWidth={1.5}/><line x1={96} y1={52} x2={104} y2={52} stroke="#9CA3AF" strokeWidth={1.5}/>
      <text x={100} y={88} textAnchor="middle" fontSize={9} fill="#6B7280">d ⊥ [AA'] et passe par son milieu</text>
    </svg>
  ),
  parallelogramme: (c) => (
    <svg viewBox="0 0 180 100" width="100%" style={{maxWidth:220,display:"block"}} xmlns="http://www.w3.org/2000/svg">
      <polygon points="30,80 70,15 152,15 112,80" fill={c.lit} stroke={c.pri} strokeWidth={2}/>
      <line x1={70} y1={15} x2={112} y2={80} stroke={c.med} strokeWidth={1} strokeDasharray="4,3"/>
      <line x1={30} y1={80} x2={152} y2={15} stroke={c.med} strokeWidth={1} strokeDasharray="4,3"/>
      <circle cx={91} cy={47} r={3} fill={c.pri}/><text x={91} y={42} textAnchor="middle" fontSize={8} fill={c.txt}>I</text>
      <text x={22} y={85} fontSize={9} fill={c.txt} fontWeight="bold">A</text><text x={68} y={11} fontSize={9} fill={c.txt} fontWeight="bold">B</text>
      <text x={153} y={11} fontSize={9} fill={c.txt} fontWeight="bold">C</text><text x={112} y={89} fontSize={9} fill={c.txt} fontWeight="bold">D</text>
    </svg>
  ),
  solidesPaveCube: (c) => (
    <svg viewBox="0 0 200 90" width="100%" style={{maxWidth:240,display:"block"}} xmlns="http://www.w3.org/2000/svg">
      <polygon points="10,62 10,22 52,22 52,62" fill={c.lit} stroke={c.pri} strokeWidth={1.5}/>
      <polygon points="10,22 30,6 72,6 52,22" fill={c.med} stroke={c.pri} strokeWidth={1.5} opacity={0.7}/>
      <polygon points="52,22 72,6 72,46 52,62" fill={c.lit} stroke={c.pri} strokeWidth={1.5} opacity={0.9}/>
      <text x={41} y={78} textAnchor="middle" fontSize={9} fill={c.txt} fontWeight="600">Pavé droit</text>
      <text x={41} y={88} textAnchor="middle" fontSize={8} fill="#9CA3AF">V = L×l×h</text>
      <polygon points="115,62 115,22 155,22 155,62" fill={c.lit} stroke={c.pri} strokeWidth={1.5}/>
      <polygon points="115,22 135,6 175,6 155,22" fill={c.med} stroke={c.pri} strokeWidth={1.5} opacity={0.7}/>
      <polygon points="155,22 175,6 175,46 155,62" fill={c.lit} stroke={c.pri} strokeWidth={1.5} opacity={0.9}/>
      <text x={145} y={78} textAnchor="middle" fontSize={9} fill={c.txt} fontWeight="600">Cube</text>
      <text x={145} y={88} textAnchor="middle" fontSize={8} fill="#9CA3AF">V = c³</text>
    </svg>
  ),
  cylindreFig: (c) => (
    <svg viewBox="0 0 120 112" width="100%" style={{maxWidth:150,display:"block"}} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx={60} cy={25} rx={38} ry={10} fill={c.lit} stroke={c.pri} strokeWidth={1.5}/>
      <rect x={22} y={25} width={76} height={62} fill={c.lit} stroke="none"/>
      <line x1={22} y1={25} x2={22} y2={87} stroke={c.pri} strokeWidth={1.5}/>
      <line x1={98} y1={25} x2={98} y2={87} stroke={c.pri} strokeWidth={1.5}/>
      <ellipse cx={60} cy={87} rx={38} ry={10} fill={c.med} stroke={c.pri} strokeWidth={1.5} opacity={0.7}/>
      <line x1={60} y1={25} x2={98} y2={25} stroke={c.txt} strokeWidth={1} strokeDasharray="3,2"/>
      <text x={81} y={20} fontSize={9} fill={c.txt}>r</text>
      <line x1={103} y1={25} x2={103} y2={87} stroke={c.txt} strokeWidth={1}/>
      <text x={108} y={59} fontSize={9} fill={c.txt}>h</text>
      <text x={60} y={108} textAnchor="middle" fontSize={9} fill="#9CA3AF">V = π×r²×h</text>
    </svg>
  ),
  arbreFacteurs: (c) => (
    <svg viewBox="0 0 160 112" width="100%" style={{maxWidth:200,display:"block"}} xmlns="http://www.w3.org/2000/svg">
      <text x={80} y={16} textAnchor="middle" fontSize={14} fill={c.txt} fontWeight="bold">12</text>
      <line x1={72} y1={18} x2={50} y2={40} stroke="#9CA3AF" strokeWidth={1.5}/><line x1={88} y1={18} x2={110} y2={40} stroke="#9CA3AF" strokeWidth={1.5}/>
      <text x={45} y={52} textAnchor="middle" fontSize={13} fill={c.pri} fontWeight="bold">2</text>
      <text x={116} y={52} textAnchor="middle" fontSize={13} fill={c.txt} fontWeight="bold">6</text>
      <line x1={110} y1={54} x2={92} y2={74} stroke="#9CA3AF" strokeWidth={1.5}/><line x1={120} y1={54} x2={136} y2={74} stroke="#9CA3AF" strokeWidth={1.5}/>
      <text x={87} y={86} textAnchor="middle" fontSize={13} fill={c.pri} fontWeight="bold">2</text>
      <text x={141} y={86} textAnchor="middle" fontSize={13} fill={c.pri} fontWeight="bold">3</text>
      <text x={80} y={108} textAnchor="middle" fontSize={9} fill="#6B7280">12 = 2² × 3</text>
    </svg>
  ),
  etatsMatiereFig: (c) => (
    <svg viewBox="0 0 220 80" width="100%" style={{maxWidth:280,display:"block"}} xmlns="http://www.w3.org/2000/svg">
      {[["Solide",[{x:24,y:28},{x:36,y:28},{x:48,y:28},{x:24,y:40},{x:36,y:40},{x:48,y:40},{x:24,y:52},{x:36,y:52},{x:48,y:52}]],["Liquide",[{x:87,y:48},{x:100,y:44},{x:112,y:50},{x:93,y:58},{x:106,y:55},{x:118,y:62},{x:80,y:62},{x:100,y:66}]],["Gaz",[{x:158,y:24},{x:190,y:36},{x:170,y:55},{x:145,y:46},{x:180,y:64},{x:150,y:68}]]].map(([label,pts],gi)=>(<g key={gi}>
        <rect x={gi*72+8} y={18} width={60} height={52} rx={4} fill="white" stroke={gi===0?c.pri:gi===1?"#9CA3AF":"#E5E7EB"} strokeWidth={1.5}/>
        {pts.map((p,pi)=><circle key={pi} cx={p.x} cy={p.y} r={gi===0?4:gi===1?4:3} fill={c.pri} opacity={gi===0?0.9:gi===1?0.75:0.55}/>)}
        <text x={gi*72+38} y={76} textAnchor="middle" fontSize={9} fill="#6B7280">{label}</text>
      </g>))}
    </svg>
  ),
  circuitSerieFig: (c) => (
    <svg viewBox="0 0 200 100" width="100%" style={{maxWidth:240,display:"block"}} xmlns="http://www.w3.org/2000/svg">
      <rect x={10} y={20} width={180} height={60} rx={4} fill="none" stroke={c.pri} strokeWidth={2}/>
      <rect x={40} y={34} width={30} height={18} rx={2} fill={c.lit} stroke={c.txt} strokeWidth={1.5}/><text x={55} y={47} textAnchor="middle" fontSize={9} fill={c.txt}>L₁</text>
      <rect x={100} y={34} width={30} height={18} rx={2} fill={c.lit} stroke={c.txt} strokeWidth={1.5}/><text x={115} y={47} textAnchor="middle" fontSize={9} fill={c.txt}>L₂</text>
      <circle cx={162} cy={43} r={12} fill="none" stroke="#F59E0B" strokeWidth={2}/><text x={162} y={47} textAnchor="middle" fontSize={9} fill="#B45309">G</text>
      <text x={100} y={94} textAnchor="middle" fontSize={9} fill="#6B7280">I = identique • U = U₁+U₂</text>
    </svg>
  ),
  circuitDerivFig: (c) => (
    <svg viewBox="0 0 200 110" width="100%" style={{maxWidth:240,display:"block"}} xmlns="http://www.w3.org/2000/svg">
      <line x1={10} y1={55} x2={50} y2={55} stroke={c.pri} strokeWidth={2}/>
      <line x1={50} y1={30} x2={50} y2={80} stroke={c.pri} strokeWidth={2}/>
      <line x1={50} y1={30} x2={100} y2={30} stroke={c.pri} strokeWidth={2}/>
      <line x1={50} y1={80} x2={100} y2={80} stroke={c.pri} strokeWidth={2}/>
      <rect x={100} y={20} width={30} height={18} rx={2} fill={c.lit} stroke={c.txt} strokeWidth={1.5}/><text x={115} y={33} textAnchor="middle" fontSize={9} fill={c.txt}>L₁</text>
      <rect x={100} y={70} width={30} height={18} rx={2} fill={c.lit} stroke={c.txt} strokeWidth={1.5}/><text x={115} y={83} textAnchor="middle" fontSize={9} fill={c.txt}>L₂</text>
      <line x1={130} y1={30} x2={160} y2={30} stroke={c.pri} strokeWidth={2}/>
      <line x1={130} y1={80} x2={160} y2={80} stroke={c.pri} strokeWidth={2}/>
      <line x1={160} y1={30} x2={160} y2={80} stroke={c.pri} strokeWidth={2}/>
      <line x1={160} y1={55} x2={190} y2={55} stroke={c.pri} strokeWidth={2}/>
      <circle cx={28} cy={55} r={10} fill="none" stroke="#F59E0B" strokeWidth={2}/><text x={28} y={59} textAnchor="middle" fontSize={9} fill="#B45309">G</text>
      <text x={100} y={104} textAnchor="middle" fontSize={9} fill="#6B7280">U = identique • I = I₁+I₂</text>
    </svg>
  ),
  echellePHFig: (_c) => (
    <svg viewBox="0 0 280 56" width="100%" style={{maxWidth:340,display:"block"}} xmlns="http://www.w3.org/2000/svg">
      {["#CC0000","#E63000","#E67000","#E6A800","#B8CC00","#66CC00","#00AA44","#0099AA","#0077CC","#0055AA","#003388","#220066","#110033","#000033"].map((col,i)=>
        <rect key={i} x={4+i*19.5} y={8} width={19} height={24} fill={col} rx={i===0?3:i===13?3:0}/>
      )}
      {[0,2,4,6,7,8,10,12,14].map(n=>(
        <text key={n} x={4+n*19.5+9.5} y={44} textAnchor="middle" fontSize={8} fill="#374151">{n}</text>
      ))}
      <text x={50} y={54} textAnchor="middle" fontSize={8} fill="#CC0000">ACIDE</text>
      <text x={140} y={54} textAnchor="middle" fontSize={8} fill="#009944">NEUTRE</text>
      <text x={228} y={54} textAnchor="middle" fontSize={8} fill="#003388">BASIQUE</text>
    </svg>
  ),
  compositionAirFig: (_c) => (
    <svg viewBox="0 0 200 100" width="100%" style={{maxWidth:240,display:"block"}} xmlns="http://www.w3.org/2000/svg">
      <rect x={10} y={20} width={112} height={40} fill="#4B9BE8" rx={2}/><text x={66} y={44} textAnchor="middle" fontSize={10} fill="white" fontWeight="bold">N₂ 78%</text>
      <rect x={122} y={20} width={33} height={40} fill="#60C060" rx={2}/><text x={138} y={44} textAnchor="middle" fontSize={9} fill="white" fontWeight="bold">O₂ 21%</text>
      <rect x={155} y={20} width={6} height={40} fill="#B0B0B0" rx={2}/>
      <rect x={161} y={20} width={29} height={40} fill="#E8E8E8" rx={2}/><text x={175} y={41} textAnchor="middle" fontSize={7} fill="#6B7280">Ar</text><text x={175} y={52} textAnchor="middle" fontSize={7} fill="#6B7280">1%</text>
      <text x={100} y={78} textAnchor="middle" fontSize={9} fill="#6B7280">Composition de l'air (en volume)</text>
    </svg>
  ),
  masseVoluFig: (c) => (
    <svg viewBox="0 0 200 100" width="100%" style={{maxWidth:240,display:"block"}} xmlns="http://www.w3.org/2000/svg">
      <rect x={10} y={30} width={70} height={55} rx={4} fill="white" stroke={c.pri} strokeWidth={1.5}/>
      <rect x={10} y={55} width={70} height={30} rx={0} fill="#BFDBFE" stroke="none" opacity={0.6}/>
      <text x={45} y={48} textAnchor="middle" fontSize={8} fill={c.txt}>V₁ = 40 mL</text>
      <rect x={14} y={56} width={2} height={3} fill={c.txt} opacity={0.5}/>
      <text x={10} y={90} fontSize={8} fill="#6B7280">V₁</text>
      <rect x={100} y={30} width={70} height={55} rx={4} fill="white" stroke={c.pri} strokeWidth={1.5}/>
      <rect x={100} y={50} width={70} height={35} rx={0} fill="#BFDBFE" stroke="none" opacity={0.6}/>
      <ellipse cx={135} cy={50} rx={15} ry={8} fill={c.pri} opacity={0.7}/>
      <text x={135} y={46} textAnchor="middle" fontSize={7} fill="white">objet</text>
      <text x={135} y={65} textAnchor="middle" fontSize={8} fill={c.txt}>V₂ = 55 mL</text>
      <text x={135} y={94} textAnchor="middle" fontSize={8} fill="#6B7280">V_objet = V₂ − V₁ = 15 mL</text>
    </svg>
  ),
  systemeSolaireFig: (_c) => (
    <svg viewBox="0 0 280 90" width="100%" style={{maxWidth:340,display:"block"}} xmlns="http://www.w3.org/2000/svg">
      <circle cx={18} cy={45} r={16} fill="#FDE68A" stroke="#F59E0B" strokeWidth={1.5}/><text x={18} y={49} textAnchor="middle" fontSize={7} fill="#92400E">Soleil</text>
      {[{cx:48,r:3,fill:"#9CA3AF",n:"Me"},{cx:63,r:4,fill:"#FDE68A",n:"Vé"},{cx:82,r:5,fill:"#6EE7F7",n:"Te"},{cx:103,r:4,fill:"#FCA5A5",n:"Ma"},{cx:132,r:11,fill:"#FDE68A",n:"Ju"},{cx:163,r:9,fill:"#FCD34D",n:"Sa"},{cx:196,r:6,fill:"#A7F3D0",n:"Ur"},{cx:222,r:6,fill:"#818CF8",n:"Ne"}].map((p,i)=>(
        <g key={i}><circle cx={p.cx} cy={45} r={p.r} fill={p.fill} stroke="rgba(0,0,0,0.15)" strokeWidth={0.5}/><text x={p.cx} y={45+p.r+10} textAnchor="middle" fontSize={7} fill="#6B7280">{p.n}</text></g>
      ))}
      <ellipse cx={163} cy={45} rx={14} ry={4} fill="none" stroke="#FCD34D" strokeWidth={1.5} opacity={0.6}/>
    </svg>
  ),
  reflexion: (c) => (
    <svg viewBox="0 0 180 100" width="100%" style={{maxWidth:220,display:"block"}} xmlns="http://www.w3.org/2000/svg">
      <line x1={0} y1={70} x2={180} y2={70} stroke="#9CA3AF" strokeWidth={2}/>
      <line x1={90} y1={70} x2={90} y2={8} stroke="#D1D5DB" strokeWidth={1} strokeDasharray="4,3"/>
      <text x={92} y={14} fontSize={8} fill="#9CA3AF">normale</text>
      <line x1={25} y1={10} x2={90} y2={70} stroke={c.pri} strokeWidth={2}/>
      <polygon points="90,70 83,55 96,58" fill={c.pri}/>
      <line x1={90} y1={70} x2={155} y2={10} stroke={c.pri} strokeWidth={2}/>
      <polygon points="90,70 94,55 107,63" fill={c.pri}/>
      <text x={58} y={48} fontSize={9} fill={c.txt} fontWeight="bold">i</text>
      <text x={118} y={48} fontSize={9} fill={c.txt} fontWeight="bold">r</text>
      <text x={90} y={86} textAnchor="middle" fontSize={9} fill="#6B7280">i = r</text>
    </svg>
  ),
};

