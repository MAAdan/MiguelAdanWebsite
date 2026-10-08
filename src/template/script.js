(()=>{
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
/* ---------- language switch (the MADS LanguageSwitch in the settings card): remember the choice ---------- */
document.getElementById('langSwitch').addEventListener('click',e=>{try{localStorage.setItem('ma-lang',e.currentTarget.dataset.lang)}catch(_){}});
/* ---------- MA emblem ---------- */
const CHEV="m 59.516071,24.012484 a 9,9 0 0 0 -7.024377,3.746541 9,9 0 0 0 2.061889,12.559958 9,9 0 0 0 0.435632,0.293522 l -0.0088,0.0124 31.213082,22.409485 0.0031,0.0026 a 9,9 0 0 0 6.012553,2.268079 9,9 0 0 0 6.027003,-2.27066 l 31.213577,-22.409487 -0.009,-0.01246 a 9,9 0 0 0 0.43511,-0.293522 9,9 0 0 0 2.06189,-12.559959 9,9 0 0 0 -7.02437,-3.746542 9,9 0 0 0 -5.53506,1.684648 9,9 0 0 0 -0.41756,0.318844 l -0.009,-0.01294 -26.736831,19.195727 -26.73687,-19.195728 -0.0093,0.01292 a 9,9 0 0 0 -0.41703,-0.318843 9,9 0 0 0 -5.535579,-1.684651 z";
const TRI="m 175.63678,24.135913 c -3.6603,-9.8e-5 -6.9043,2.35681 -8.03517,5.837887 l -30.01488,68.92211 c 0,0 -1.28081,3.49822 -1.28093,4.53539 -9e-5,4.66584 3.78255,8.44825 8.44858,8.44807 3.84967,-2.3e-4 6.31551,-2.78748 8.17779,-6.32933 l 23.15259,-52.876881 25.48785,53.289261 c 1.87052,3.42799 4.36956,5.91708 8.06049,5.91695 4.66583,-10e-5 8.44816,-3.78243 8.44807,-8.44807 0,-0.0561 -0.008,-2.46168 -1.32912,-4.548559 l -33.0801,-68.907907 c -1.1305,-3.481486 -4.3746,-5.838873 -8.03517,-5.838921 z";
const TC=[177.5,68], CC=[92,44];
const B=(x,y,w,h,r,rot=0,o=1)=>({x,y,w,h,r,rot,o});
const H=(x,y,r,o=1)=>({x,y,r,o});
const MA_BARS=[B(59.76,68.03,18,88.3,9),B(124.52,68.02,18,87.8,9),B(177,89.8,27,18,9)];
const S={
  ma:{bars:MA_BARS,heads:[H(59.76,30,0,0),H(124.52,30,0,0),H(177,80,0,0)],tk:0,chev:{o:1,s:1,x:0,y:0},tri:{x:0,y:0,rot:0,s:1,o:1},click:0,tech:.55,glow:['#3a86ff','#ffbe0b']},
  tickets:{bars:[B(72,60,40,40,3,-5),B(134,82,40,40,3,4),B(196,58,40,40,3,-3)],heads:[H(72,50,0,0),H(134,70,0,0),H(196,50,0,0)],tk:1,chev:{o:0,s:.5,x:30,y:10},tri:{x:-10,y:10,rot:0,s:.4,o:0},click:0,tech:0,glow:['#ffbe0b','#fb5607']},
  people:{bars:[B(84,100,26,42,13),B(132,96,28,50,14),B(180,100,26,42,13)],heads:[H(84,66,11),H(132,56,12.5),H(180,66,11)],tk:0,chev:{o:0,s:.5,x:40,y:30},tri:{x:0,y:20,rot:0,s:.3,o:0},click:0,tech:.1,glow:['#ff006e','#8338ec']},
  pointer:{bars:[MA_BARS[0],MA_BARS[1],B(196,100,4,18,2,0,0)],heads:[H(59.76,30,0,0),H(124.52,30,0,0),H(177,80,0,0)],tk:0,chev:{o:1,s:1,x:0,y:0},tri:{x:10,y:2,rot:-28,s:.95,o:1},click:1,tech:1,glow:['#3a86ff','#8338ec']},
  lead:{bars:[B(74,100,24,40,12),B(116,100,24,40,12),B(177,89.8,6,6,3,0,0)],heads:[H(74,68,10.5),H(116,68,10.5),H(177,80,0,0)],tk:0,chev:{o:0,s:.5,x:0,y:30},tri:{x:8,y:6,rot:-28,s:.72,o:1},click:.8,tech:.5,glow:['#8338ec','#ff006e']},
};
S.pointer2={...S.pointer,tech:1,glow:['#3a86ff','#3a86ff']};
S.lead2={...S.lead,tri:{x:4,y:2,rot:-28,s:.82,o:1},tech:.7,glow:['#8338ec','#3a86ff']};
const BG=(c,b,p)=>({circuits:c,board:b,people:p});
S.ma.bg=BG(.55,0,0);S.tickets.bg=BG(0,1,0);S.people.bg=BG(0,0,1);S.pointer.bg=BG(1,0,0);S.pointer2.bg=BG(1,0,0);S.lead.bg=BG(.45,0,.6);S.lead2.bg=BG(.65,0,.4);

const GRADS=(id)=>`<defs>
<linearGradient id="${id}gL" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffbe0b"/><stop offset="1" stop-color="#fb5607"/></linearGradient>
<linearGradient id="${id}gR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff006e"/><stop offset="1" stop-color="#ffbe0b"/></linearGradient>
<linearGradient id="${id}gA" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fb5608"/><stop offset="1" stop-color="#ff006e"/></linearGradient>
<linearGradient id="${id}gC" gradientUnits="userSpaceOnUse" x1="50.8" y1="44" x2="133.6" y2="44"><stop offset="0" stop-color="#fb5607"/><stop offset="1" stop-color="#ff006e" stop-opacity=".85"/></linearGradient>
</defs>`;
const KEYS=['MA-142','MA-128','MA-97'];
const STATUS=['<path d="M-1 14 L2 10.5 L5 14" fill="none" stroke="#100c20" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/>',
 '<circle cx="0" cy="12.5" r="1.3" fill="#100c20" opacity=".7"/><circle cx="4" cy="12.5" r="1.3" fill="#100c20" opacity=".45"/><circle cx="8" cy="12.5" r="1.3" fill="#100c20" opacity=".25"/>',
 '<path d="M-1 12.5 L1.8 15.2 L6.5 9.8" fill="none" stroke="#100c20" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity=".75"/>'];
const TK=i=>`<g class="tk"><path d="M8 20 L20 8 L20 20 Z" style="fill:var(--mads-theme-background)"/><path d="M8 20 L8 10 Q8 8 10 8 L20 8 Z" fill="#fff" opacity=".35"/><text x="-15" y="-10.5" font-family="JetBrains Mono,monospace" font-size="5.6" font-weight="700" fill="#100c20" opacity=".8">${KEYS[i]}</text><rect x="-15" y="-6" width="26" height="2.6" rx="1.3" fill="#100c20" opacity=".45"/><rect x="-15" y="-1" width="19" height="2.6" rx="1.3" fill="#100c20" opacity=".45"/><circle cx="-11" cy="12.5" r="3.8" fill="#100c20" opacity=".5"/>${STATUS[i]}</g>`;
const COLS=[[44,'{{logo.kanban_todo}}','#ffbe0b'],[106,'{{logo.kanban_in_progress}}','#fb5607'],[168,'{{logo.kanban_done}}','#ff006e']];
const BOARD=`<g class="board">${COLS.map(([x,t,c])=>`<rect x="${x}" y="16" width="56" height="110" rx="7" style="fill:var(--board);stroke:var(--board-line)"/><circle cx="${x+8}" cy="25" r="2.2" fill="${c}"/><text x="${x+13}" y="27" font-family="JetBrains Mono,monospace" font-size="5.4" font-weight="600" letter-spacing=".4" style="fill:var(--mads-theme-text-muted)">${t}</text>`).join('')}<g class="mover"><rect x="55" y="104" width="34" height="13" rx="3" style="fill:var(--mads-theme-surface-raised);stroke:var(--board-line)"/><rect x="59" y="108.5" width="16" height="2" rx="1" style="fill:var(--mads-theme-text-muted)" opacity=".6"/><rect x="59" y="112.5" width="10" height="2" rx="1" style="fill:var(--mads-theme-text-muted)" opacity=".35"/></g></g>`;
function build(svg, key){
  const id='e'+Math.random().toString(36).slice(2,7);
  const fills=[`url(#${id}gL)`,`url(#${id}gR)`,`url(#${id}gA)`];
  svg.innerHTML=GRADS(id)+BOARD+
   `<g class="p p3"><g class="chev"><path d="${CHEV}" fill="url(#${id}gC)"/></g></g>`+
   `<g class="p p4"><g class="tri"><g class="click" transform="translate(175.6 22)"><circle r="6"/><circle r="6"/></g><path d="${TRI}" fill="#ffbe0b"/></g></g>`+
   [0,1,2].map(i=>`<g class="p p${[1,2,5][i]}"><g class="bar"><rect fill="${fills[i]}"/>${TK(i)}</g><circle class="head" fill="${fills[i]}"/></g>`).join('');
  const E={svg,chev:svg.querySelector('.chev'),tri:svg.querySelector('.tri'),click:svg.querySelector('.click'),
    bars:[...svg.querySelectorAll('.bar')].map(g=>({g,r:g.querySelector('rect'),tk:g.querySelector('.tk')})),
    heads:[...svg.querySelectorAll('.head')],board:svg.querySelector('.board'),cur:clone(S[key])};
  apply(E,E.cur); return E;
}
function clone(o){return JSON.parse(JSON.stringify(o))}
function lerp(a,b,t){
  if(typeof a==='number') return a+(b-a)*t;
  if(typeof a==='string') return t<.5?a:b;
  if(Array.isArray(a)) return a.map((v,i)=>lerp(v,b[i],t));
  const o={}; for(const k in a) o[k]=lerp(a[k],b[k],t); return o;
}
function apply(E,s){
  s.bars.forEach((b,i)=>{
    const {g,r,tk}=E.bars[i];
    g.setAttribute('transform',`translate(${b.x} ${b.y}) rotate(${b.rot})`);
    g.setAttribute('opacity',b.o.toFixed(3));
    r.setAttribute('x',-b.w/2);r.setAttribute('y',-b.h/2);r.setAttribute('width',Math.max(0,b.w));r.setAttribute('height',Math.max(0,b.h));
    r.setAttribute('rx',b.r);
    tk.setAttribute('opacity',s.tk.toFixed(3));
    tk.setAttribute('transform',`scale(${(b.w/40).toFixed(3)} ${(b.h/40).toFixed(3)})`);
  });
  s.heads.forEach((h,i)=>{const c=E.heads[i];c.setAttribute('cx',h.x);c.setAttribute('cy',h.y);c.setAttribute('r',Math.max(0,h.r));c.setAttribute('opacity',h.o.toFixed(3));});
  const c=s.chev; E.chev.setAttribute('transform',`translate(${CC[0]+c.x} ${CC[1]+c.y}) scale(${c.s}) translate(${-CC[0]} ${-CC[1]})`); E.chev.setAttribute('opacity',c.o.toFixed(3));
  const t=s.tri; E.tri.setAttribute('transform',`translate(${TC[0]+t.x} ${TC[1]+t.y}) rotate(${t.rot}) scale(${t.s}) translate(${-TC[0]} ${-TC[1]})`); E.tri.setAttribute('opacity',t.o.toFixed(3));
  E.click.setAttribute('opacity',s.click.toFixed(3));
  E.board.setAttribute('opacity',Math.max(0,(s.tk-.3)/.7).toFixed(3));
  E.board.style.display=s.tk>.3?'':'none';
}
function tween(E,to,ms=900){
  const from=clone(E.cur), target=S[to]; const t0=performance.now();
  if(E.raf) cancelAnimationFrame(E.raf);
  if(RM){E.cur=clone(target);apply(E,E.cur);return}
  const step=now=>{let t=Math.min(1,(now-t0)/ms);t=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
    E.cur=lerp(from,target,t);apply(E,E.cur); if(t<1) E.raf=requestAnimationFrame(step)};
  E.raf=requestAnimationFrame(step);
}
const emblems={};
document.querySelectorAll('svg[data-emblem]').forEach((s,i)=>{emblems[s.id||('x'+i)]=build(s,s.dataset.emblem)});

/* ---------- hero logo: after 10 s without activity, show the next career shape for 3 s, then back to MA ---------- */
(()=>{const E=emblems.heroEmblem;if(!E||RM)return;
  const IDLE_MS=10000,HOLD_MS=3000,MORPH_MS=900,SEQ=['pointer','people','tickets'];
  let step=0,last=Date.now(),busy=false,visible=true;
  new IntersectionObserver(es=>es.forEach(e=>{visible=e.isIntersecting;if(!visible&&!busy)last=Date.now()})).observe(E.svg);
  const activity=()=>{if(!busy)last=Date.now()};
  ['pointermove','pointerdown','keydown','scroll','wheel','touchstart'].forEach(ev=>addEventListener(ev,activity,{passive:true}));
  setInterval(()=>{
    if(busy)return;
    if(document.hidden||!visible){last=Date.now();return}
    if(Date.now()-last<IDLE_MS)return;
    busy=true;tween(E,SEQ[step],MORPH_MS);step=(step+1)%SEQ.length;
    setTimeout(()=>{tween(E,'ma',MORPH_MS);setTimeout(()=>{busy=false;last=Date.now()},MORPH_MS)},MORPH_MS+HOLD_MS);
  },250);
})();

/* ---------- evolution tabs ---------- */
const evo=emblems.evoEmblem, evoSec=document.querySelector('.evo'), tabs=[...document.querySelectorAll('.evo-tab')];
const caps={pointer:'{{evo.caption_engineering}}',people:'{{evo.caption_leadership}}',tickets:'{{evo.caption_product}}'};
let evoIdx=0, evoTimer=null, evoUser=false; const EVO_MS=8000; // time each stage stays on screen
function evoGo(i){evoIdx=i;tabs.forEach((t,j)=>t.setAttribute('aria-pressed',j===i));const k=tabs[i].dataset.to;tween(evo,k);document.getElementById('evoCaption').textContent=caps[k];}
function evoAuto(){clearInterval(evoTimer);if(evoUser||RM)return;evoTimer=setInterval(()=>evoGo((evoIdx+1)%3),EVO_MS)}
tabs.forEach((t,i)=>t.addEventListener('click',()=>{evoUser=true;evoSec.classList.add('paused');clearInterval(evoTimer);evoGo(i)}));
new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){evoGo(evoIdx);evoAuto()}else clearInterval(evoTimer)}),{threshold:.35}).observe(evoSec);

/* contact emblem: gentle cycle on hover */
const ce=emblems.contactEmblem; const cycle=['pointer','people','tickets','ma']; let ci=0;
ce.svg.addEventListener('mouseenter',()=>{ci=(ci+1)%4;tween(ce,cycle[ci],700)});
ce.svg.addEventListener('click',()=>{ci=(ci+1)%4;tween(ce,cycle[ci],700)});

/* ---------- map ---------- */
const C={"Stockholm": [308.3, 51.7], "London": [186.5, 129.9], "Madrid": [162.6, 240.8], "Gibraltar": [151.6, 283.6], "Paris": [203.1, 156.4]};
const NS='http://www.w3.org/2000/svg';
const arcs=document.getElementById('arcs'), cg=document.getElementById('cities');
const pairs=[['Madrid','Stockholm'],['Madrid','London'],['London','Stockholm'],['Madrid','Gibraltar'],['Gibraltar','London'],['Madrid','Paris'],['Paris','Stockholm']];
pairs.forEach(([a,b],i)=>{const [x1,y1]=C[a],[x2,y2]=C[b];const mx=(x1+x2)/2,my=(y1+y2)/2,dx=x2-x1,dy=y2-y1;const k=.22;
  const p=document.createElementNS(NS,'path');p.setAttribute('d',`M${x1} ${y1} Q${mx-dy*k} ${my+dx*k} ${x2} ${y2}`);p.setAttribute('class','arc');p.setAttribute('stroke','url(#arcG)');p.style.animationDelay=(i*.3)+'s';arcs.appendChild(p)});
const cols={Stockholm:'#ffbe0b',London:'#fb5607',Gibraltar:'#8338ec',Madrid:'#ff006e',Paris:'#3a86ff'};
const lab={Stockholm:[10,-8,'start'],London:[-12,-4,'end'],Madrid:[12,4,'start'],Gibraltar:[-12,10,'end'],Paris:[11,8,'start']};
const sub={Stockholm:'{{map.country_sweden}}',London:'{{map.country_uk}}',Madrid:'{{map.country_spain}}',Gibraltar:'{{map.country_gibraltar}}',Paris:'{{map.country_france}}'};
const CITY={Stockholm:'{{map.city_stockholm}}',London:'{{map.city_london}}',Madrid:'{{map.city_madrid}}',Gibraltar:'{{map.city_gibraltar}}',Paris:'{{map.city_paris}}'};
Object.entries(C).forEach(([n,[x,y]],i)=>{const g=document.createElementNS(NS,'g');g.setAttribute('class','city');
  g.innerHTML=`<circle class="ping" cx="${x}" cy="${y}" r="6" stroke="${cols[n]}" style="animation-delay:${i*.5}s"/><circle class="core" cx="${x}" cy="${y}" r="5.5" fill="${cols[n]}"/><text x="${x+lab[n][0]}" y="${y+lab[n][1]}" text-anchor="${lab[n][2]}">${CITY[n].toUpperCase()}</text><text class="sub" x="${x+lab[n][0]}" y="${y+lab[n][1]+11}" text-anchor="${lab[n][2]}">${sub[n]}</text>`;cg.appendChild(g)});

/* ---------- circuits background ---------- */
const cv=document.getElementById('circuits'), cx=cv.getContext('2d');
let CX={}, traces=[], pulses=[], circuitPaths=null, W=0, Hh=0, dpr=1;
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function genCircuits(){
  const cs=getComputedStyle(document.documentElement), V=n=>cs.getPropertyValue(n).trim(); CX={a:V('--cx-a')||'rgba(58,134,255,.3)',b:V('--cx-b')||'rgba(131,56,236,.3)',chip:V('--cx-chip')||'rgba(20,16,44,.9)',chipLine:V('--cx-chip-line')||'rgba(131,56,236,.45)',pulse:V('--cx-pulse')||'rgba(160,200,255,.95)',o:parseFloat(V('--cx-o'))||.9};
  dpr=Math.min(1.25,devicePixelRatio||1); W=Math.max(1,innerWidth); Hh=Math.max(1,innerHeight); cv.width=W*dpr; cv.height=Hh*dpr; cv.style.width=W+'px'; cv.style.height=Hh+'px';
  const R=rng(7), G=18, cols=Math.ceil(W/G)+1, rows=Math.ceil(Hh/G)+1, used=new Uint8Array(cols*rows);
  const U=(c,r)=>c<0||r<0||c>=cols||r>=rows||used[r*cols+c];
  traces=[]; const chips=[];
  const nChips=Math.round(W*Hh/90000);
  for(let i=0;i<nChips;i++){const w=2+Math.floor(R()*3),h=2+Math.floor(R()*3),c=Math.floor(R()*(cols-w)),r=Math.floor(R()*(rows-h));chips.push({c,r,w,h});for(let y=r;y<=r+h;y++)for(let x=c;x<=c+w;x++)used[y*cols+x]=1}
  const dirs=[[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
  function walk(c,r,d){const pts=[[c,r]];let len=6+Math.floor(R()*22);
    for(let s=0;s<len;s++){ if(R()<.16){d=(d+(R()<.5?1:7))%8} const [dx,dy]=dirs[d]; const nc=c+dx,nr=r+dy; if(U(nc,nr))break; c=nc;r=nr;used[r*cols+c]=1;pts.push([c,r]);}
    if(pts.length>3) traces.push(pts.map(([a,b])=>[a*G,b*G]));}
  chips.forEach(ch=>{for(let x=ch.c;x<=ch.c+ch.w;x++){ if(R()<.8)walk(x,ch.r-1,6); if(R()<.8)walk(x,ch.r+ch.h+1,2);} for(let y=ch.r;y<=ch.r+ch.h;y++){ if(R()<.7)walk(ch.c-1,y,4); if(R()<.7)walk(ch.c+ch.w+1,y,0);} });
  for(let i=0;i<nChips*4;i++){const c=Math.floor(R()*cols),r=Math.floor(R()*rows);if(!U(c,r)){used[r*cols+c]=1;walk(c,r,[0,2,4,6][Math.floor(R()*4)])}}
  // vector paths, redrawn every frame (no hidden canvas, which Safari can silently blank when canvas memory runs out)
  const pA=new Path2D(),pB=new Path2D(),pads=new Path2D(),dots=new Path2D(),chipP=new Path2D();
  traces.forEach((t,i)=>{const p=i%3?pA:pB;t.forEach(([x,y],j)=>j?p.lineTo(x,y):p.moveTo(x,y));
    const [ex,ey]=t[t.length-1];pads.moveTo(ex+3,ey);pads.arc(ex,ey,3,0,Math.PI*2);const [sx,sy]=t[0];dots.moveTo(sx+1.8,sy);dots.arc(sx,sy,1.8,0,Math.PI*2)});
  chips.forEach(ch=>{const x=ch.c*G,y=ch.r*G,w=ch.w*G,h=ch.h*G;if(chipP.roundRect)chipP.roundRect(x+2,y+2,w-4,h-4,4);else chipP.rect(x+2,y+2,w-4,h-4)});
  circuitPaths={pA,pB,pads,dots,chipP};
  const nP=Math.max(2,Math.min(3,Math.round(W*Hh/450000)));
  pulses=Array.from({length:Math.min(nP,traces.length)},()=>({t:Math.floor(R()*traces.length),p:R(),v:.06+R()*.08}));
}
/* ---------- section backdrops: one canvas, one themed layer per section ---------- */
const PAL={amber:'#ffbe0b',orange:'#fb5607',pink:'#ff006e',violet:'#8338ec',azure:'#3a86ff'};
const rgba=(h,a)=>{const n=parseInt(h.slice(1),16);return`rgba(${n>>16&255},${n>>8&255},${n&255},${a})`};
const RR=(c,x,y,w,h,r)=>{c.beginPath();if(c.roundRect)c.roundRect(x,y,w,h,r);else c.rect(x,y,w,h)};
const Lr=rng(11), pick=a=>a[Math.floor(Math.random()*a.length)];
let BD={};
function genBoard(){
  const n=Math.max(3,Math.min(6,Math.round(W/300))), lw=W/n, cw=Math.min(118,lw*.52), ch=cw*.64, gap=30, rows=Math.max(3,Math.floor((Hh-60)/(ch+gap)));
  const slot=(l,r)=>({x:l*lw+lw/2+((l*7+r*13)%5-2)*lw*.04,y:60+r*(ch+gap)+ch/2});
  const cards=[];
  for(let l=0;l<n;l++)for(let r=0;r<rows;r++) if(Lr()<.4){const p=slot(l,r);cards.push({l,r,x:p.x,y:p.y,c:pick([PAL.amber,PAL.orange,PAL.pink,PAL.amber]),rot:(Lr()-.5)*.08,a:1,age:Lr()*6,mv:null})}
  BD={n,lw,cw,ch,rows,slot,cards,timer:0};
}
function occupied(l,r){return BD.cards.some(c=>c.l===l&&c.r===r&&c.a>0)}
function drawBoard(c,dt){
  const B=BD;
  c.setLineDash([3,7]);c.strokeStyle=rgba(PAL.violet,.25);c.lineWidth=1;
  for(let i=1;i<B.n;i++){c.beginPath();c.moveTo(i*B.lw,0);c.lineTo(i*B.lw,Hh);c.stroke()}
  c.setLineDash([]);
  B.timer+=dt;
  if(B.timer>2.2){B.timer=0;
    const movers=B.cards.filter(k=>!k.mv&&k.l<B.n-1&&k.a===1);
    if(movers.length){const k=pick(movers);const nl=k.l+1;let nr=k.r;if(occupied(nl,nr)){const free=[...Array(B.rows).keys()].filter(r=>!occupied(nl,r));if(!free.length)return;nr=pick(free)}
      const p=B.slot(nl,nr);k.mv={fx:k.x,fy:k.y,tx:p.x,ty:p.y,t:0};k.l=nl;k.r=nr;k.age=0}}
  B.cards.forEach(k=>{
    k.age+=dt;
    if(k.mv){k.mv.t=Math.min(1,k.mv.t+dt/1.5);const e=k.mv.t<.5?4*k.mv.t**3:1-Math.pow(-2*k.mv.t+2,3)/2;k.x=k.mv.fx+(k.mv.tx-k.mv.fx)*e;k.y=k.mv.fy+(k.mv.ty-k.mv.fy)*e-Math.sin(e*Math.PI)*14;if(k.mv.t>=1)k.mv=null}
    if(k.l===B.n-1&&!k.mv&&k.age>7){k.a=Math.max(0,k.a-dt*.6);if(k.a===0){const free=[...Array(B.rows).keys()].filter(r=>!occupied(0,r));if(free.length){k.l=0;k.r=pick(free);const p=B.slot(0,k.r);k.x=p.x;k.y=p.y;k.age=0;k.fadeIn=true}}}
    if(k.fadeIn){k.a=Math.min(1,k.a+dt*.8);if(k.a>=1)k.fadeIn=false}
    const lift=k.mv?1:0;
    c.save();c.translate(k.x,k.y);c.rotate(k.rot+(lift?.05:0));c.globalAlpha*=k.a;
    const w=B.cw,h=B.ch;
    if(lift){c.shadowColor=rgba(k.c,.5);c.shadowBlur=18}
    RR(c,-w/2,-h/2,w,h,5);c.fillStyle=rgba(k.c,lift?.3:.12);c.fill();c.shadowBlur=0;
    c.strokeStyle=rgba(k.c,.38);c.lineWidth=1;c.stroke();
    c.fillStyle=rgba(k.c,.4);RR(c,-w/2+10,-h/2+10,w*.3,4,2);c.fill();
    c.fillStyle=rgba(k.c,.24);RR(c,-w/2+10,-h/2+20,w*.62,4,2);c.fill();RR(c,-w/2+10,-h/2+29,w*.45,4,2);c.fill();
    c.beginPath();c.arc(-w/2+14,h/2-11,4.5,0,7);c.fill();
    c.beginPath();c.moveTo(w/2-12,h/2);c.lineTo(w/2,h/2-12);c.lineTo(w/2,h/2);c.closePath();c.fillStyle=rgba(k.c,.3);c.fill();
    c.restore();
  });
}
let PP={};
function genPeople(){
  const sp=Math.max(210,Math.min(300,W/5)), nodes=[];
  for(let y=sp*.45;y<Hh+sp*.3;y+=sp*.95)for(let x=sp*.35;x<W+sp*.2;x+=sp){const jx=(Lr()-.5)*sp*.4,jy=(Lr()-.5)*sp*.3;nodes.push({x:x+jx+((Math.round(y/sp)%2)*sp*.5),y:y+jy,ph:Lr()*6.28,s:.8+Lr()*.5,c:pick([PAL.pink,PAL.violet,PAL.pink,PAL.orange])})}
  const links=[];nodes.forEach((a,i)=>nodes.forEach((b,j)=>{if(j>i&&Math.hypot(a.x-b.x,a.y-b.y)<sp*1.3)links.push([i,j])}));
  const msgs=Array.from({length:Math.max(1,Math.min(2,Math.round(W*Hh/650000)))},()=>({k:Math.floor(Lr()*links.length),t:Lr(),d:Lr()<.5?1:-1,v:.16+Lr()*.12}));
  PP={nodes,links,msgs,time:0,pulses:[],pt:0};
}
function drawPeople(c,dt){
  const P=PP;P.time+=dt;
  const pos=n=>[n.x,n.y+Math.sin(P.time*.7+n.ph)*3];
  c.lineWidth=1;c.strokeStyle=rgba(PAL.violet,.2);
  P.links.forEach(([i,j])=>{const[a,b]=[pos(P.nodes[i]),pos(P.nodes[j])];c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke()});
  P.pt+=dt;if(P.pt>5.5){P.pt=0;P.pulses.push({n:Math.floor(Math.random()*P.nodes.length),t:0})}
  P.pulses=P.pulses.filter(p=>(p.t+=dt/1.8)<1);
  P.pulses.forEach(p=>{const n=P.nodes[p.n],[x,y]=pos(n);c.strokeStyle=rgba(n.c,.5*(1-p.t));c.lineWidth=1.5;c.beginPath();c.arc(x,y-4,10+p.t*38,0,7);c.stroke()});
  P.nodes.forEach(n=>{const[x,y]=pos(n),s=n.s;c.fillStyle=rgba(n.c,.24);c.beginPath();c.arc(x,y-13*s,5.5*s,0,7);c.fill();RR(c,x-6.5*s,y-5*s,13*s,17*s,6.5*s);c.fill()});
  P.msgs.forEach(m=>{m.t+=m.v*dt;if(m.t>1){const end=P.links[m.k][m.d>0?1:0];const opts=P.links.map((l,i)=>[l,i]).filter(([l])=>l[0]===end||l[1]===end);const [l,i]=pick(opts);m.k=i;m.d=l[0]===end?1:-1;m.t=0}
    const[i,j]=P.links[m.k],a=pos(P.nodes[m.d>0?i:j]),b=pos(P.nodes[m.d>0?j:i]);const x=a[0]+(b[0]-a[0])*m.t,y=a[1]+(b[1]-a[1])*m.t;
    const g=c.createRadialGradient(x,y,0,x,y,8);g.addColorStop(0,rgba(PAL.pink,.95));g.addColorStop(1,rgba(PAL.pink,0));c.fillStyle=g;c.beginPath();c.arc(x,y,8,0,7);c.fill()});
}
let FL={};
function genFlights(){
  const arcs=[];const n=Math.max(4,Math.min(8,Math.round(W/200)));
  for(let i=0;i<n;i++){const x0=Lr()*W*.35,y0=Hh*(.25+Lr()*.7),x1=W*(.6+Lr()*.4),y1=Hh*(.1+Lr()*.8);arcs.push({x0,y0,x1,y1,cx:(x0+x1)/2,cy:Math.min(y0,y1)-Hh*(.15+Lr()*.3)})}
  const tr=Array.from({length:Math.max(2,Math.min(4,n-2))},(_,i)=>({a:i%arcs.length,t:Lr(),v:.05+Lr()*.05}));
  FL={arcs,tr};
}
const qpt=(a,t)=>[(1-t)*(1-t)*a.x0+2*(1-t)*t*a.cx+t*t*a.x1,(1-t)*(1-t)*a.y0+2*(1-t)*t*a.cy+t*t*a.y1];
function drawFlights(c,dt){
  c.lineWidth=1.2;c.setLineDash([4,8]);
  FL.arcs.forEach(a=>{c.strokeStyle=rgba(PAL.orange,.3);c.beginPath();c.moveTo(a.x0,a.y0);c.quadraticCurveTo(a.cx,a.cy,a.x1,a.y1);c.stroke()});
  c.setLineDash([]);
  FL.arcs.forEach(a=>[[a.x0,a.y0],[a.x1,a.y1]].forEach(([x,y])=>{c.fillStyle=rgba(PAL.pink,.5);c.beginPath();c.arc(x,y,3,0,7);c.fill();c.strokeStyle=rgba(PAL.pink,.25);c.beginPath();c.arc(x,y,8,0,7);c.stroke()}));
  FL.tr.forEach(p=>{p.t+=p.v*dt;if(p.t>1){p.t=0;p.a=Math.floor(Math.random()*FL.arcs.length)}const a=FL.arcs[p.a];
    for(let k=14;k>=0;k--){const t=p.t-k*.008;if(t<0)continue;const[x,y]=qpt(a,t);c.fillStyle=rgba(PAL.amber,(1-k/14)*.6);c.beginPath();c.arc(x,y,k?1.8:3.2,0,7);c.fill()}});
}
let CP=[];
const GRD=[[PAL.amber,PAL.orange],[PAL.pink,PAL.amber],[PAL.orange,PAL.pink]];
const CP_GAP=56; // minimum clear space between pills (px)
const cpR=p=>Math.max(p.w,p.h)/2; // bounding circle, independent of rotation
function cpFree(p,x,y,skip){return CP.every(q=>q===skip||Math.hypot(q.x-x,q.y-y)>=cpR(q)+cpR(p)+CP_GAP)}
function genCapsules(){
  const n=Math.max(6,Math.min(16,Math.round(W*Hh/100000)));
  CP=[];
  for(let i=0;i<n;i++){const w=10+Lr()*26,vert=Lr()<.7;
    const p={w:vert?w:w*2.6,h:vert?w*(2.6+Lr()*2.4):w,rot:(Lr()-.5)*.9,vx:(Lr()-.5)*8,vy:-3-Lr()*6,vr:(Lr()-.5)*.05,g:pick(GRD),a:.12+Lr()*.12};
    for(let t=0;t<80;t++){const x=Lr()*W,y=Lr()*Hh;if(cpFree(p,x,y)){p.x=x;p.y=y;CP.push(p);break}}}
}
function drawCapsules(c,dt){
  const m=80;
  CP.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=p.vr*dt;
    if(p.y<-m-p.h){for(let t=0;t<25;t++){const x=Math.random()*W,y=Hh+m+Math.random()*120;if(cpFree(p,x,y,p)){p.x=x;p.y=y;break}}if(p.y<0)p.y=Hh+m+200}
    if(p.x<-m)p.x=W+m;if(p.x>W+m)p.x=-m});
  // keep pills apart: gently push any pair that gets closer than the minimum gap
  if(dt>0)for(let i=0;i<CP.length;i++)for(let j=i+1;j<CP.length;j++){const a=CP[i],b=CP[j];let dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1;const min=cpR(a)+cpR(b)+CP_GAP;
    if(d<min){const push=Math.min(min-d,40)*dt*1.6;dx/=d;dy/=d;a.x-=dx*push;a.y-=dy*push;b.x+=dx*push;b.y+=dy*push}}
  CP.forEach(p=>{c.save();c.translate(p.x,p.y);c.rotate(p.rot);const g=c.createLinearGradient(0,-p.h/2,0,p.h/2);g.addColorStop(0,rgba(p.g[1],p.a));g.addColorStop(1,rgba(p.g[0],p.a));c.fillStyle=g;RR(c,-p.w/2,-p.h/2,p.w,p.h,Math.min(p.w,p.h)/2);c.fill();c.restore()});
}
let GL=[];
const TOK=['{ }','</>','=>','MCP','Swift','SQL','git','λ','JSON','API','0101','Obj‑C','[ ]','fn()','&&','Python','agent','REST','Xcode','prompt'];
function genGlyphs(){
  const n=Math.max(8,Math.min(24,Math.round(W*Hh/55000)));
  GL=Array.from({length:n},()=>({t:pick(TOK),x:Lr()*W,y:Lr()*Hh,s:12+Lr()*16,vy:-5-Lr()*9,c:pick([PAL.azure,PAL.violet,PAL.pink,PAL.orange,PAL.amber]),a:.2+Lr()*.2}));
}
function drawGlyphs(c,dt){
  c.textAlign='center';c.textBaseline='middle';
  GL.forEach(g=>{g.y+=g.vy*dt;if(g.y<-30){g.y=Hh+30;g.x=Math.random()*W;g.t=pick(TOK)}c.font=`600 ${g.s}px "JetBrains Mono", ui-monospace, monospace`;c.fillStyle=rgba(g.c,g.a);c.fillText(g.t,g.x,g.y)});
}
let RP={};
function genRipples(){RP={src:[[W*.18,Hh*.72,PAL.pink],[W*.82,Hh*.3,PAL.amber],[W*.6,Hh*.88,PAL.violet]],t:0}}
function drawRipples(c,dt){
  RP.t+=dt;c.lineWidth=1.4;
  const [a,b]=[RP.src[0],RP.src[1]];c.strokeStyle=rgba(PAL.orange,.18);c.setLineDash([3,7]);c.beginPath();c.moveTo(a[0],a[1]);c.quadraticCurveTo(W*.5,Hh*.2,b[0],b[1]);c.stroke();c.setLineDash([]);
  RP.src.forEach(([x,y,col],i)=>{for(let k=0;k<3;k++){const t=((RP.t+i*1.1)/4.5+k/3)%1;c.strokeStyle=rgba(col,.4*(1-t));c.beginPath();c.arc(x,y,12+t*220,0,7);c.stroke()}c.fillStyle=rgba(col,.5);c.beginPath();c.arc(x,y,4,0,7);c.fill()});
}
function drawCircuitLayer(c,dt){
  const P=circuitPaths;if(!P)return;
  c.lineWidth=1.3;c.lineJoin='round';c.strokeStyle=CX.a;c.stroke(P.pA);c.strokeStyle=CX.b;c.stroke(P.pB);c.strokeStyle=CX.a;c.stroke(P.pads);c.fillStyle=CX.a;c.fill(P.dots);
  c.strokeStyle=CX.chipLine;c.fillStyle=CX.chip;c.fill(P.chipP);c.stroke(P.chipP);
  pulses.forEach(pu=>{const t=traces[pu.t];if(!t)return;pu.p+=pu.v*dt*(40/t.length);if(pu.p>1){pu.p=0;pu.t=Math.floor(Math.random()*traces.length)}
    const f=pu.p*(t.length-1),i=Math.floor(f),k=f-i,a=t[i],b=t[Math.min(i+1,t.length-1)];const x=a[0]+(b[0]-a[0])*k,y=a[1]+(b[1]-a[1])*k;
    const g=c.createRadialGradient(x,y,0,x,y,9);g.addColorStop(0,CX.pulse);g.addColorStop(1,'rgba(58,134,255,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,9,0,7);c.fill()});
}
const LAYERS={capsules:drawCapsules,circuits:drawCircuitLayer,board:drawBoard,people:drawPeople,flights:drawFlights,glyphs:drawGlyphs,ripples:drawRipples};
const DW={},TW={};Object.keys(LAYERS).forEach(k=>{DW[k]=0;TW[k]=0});
function genAll(){genCircuits();genBoard();genPeople();genFlights();genCapsules();genGlyphs();genRipples()}
const secEls={hero:document.querySelector('.hero'),evo:document.getElementById('evolution'),teams:document.getElementById('teams'),tl:document.querySelector('.timeline'),kit:document.getElementById('toolkit'),contact:document.getElementById('contact')};
function secW(el){const r=el.getBoundingClientRect(),c=innerHeight/2;if(r.top<=c&&r.bottom>=c)return 1;const d=r.top>c?r.top-c:c-r.bottom;return Math.max(0,1-d/(innerHeight*.35))}
let tlBg={circuits:0,board:0,people:0};
const EVO_BG={pointer:'circuits',people:'people',tickets:'board'};
function targets(){
  Object.keys(TW).forEach(k=>TW[k]=0);
  const w={};for(const k in secEls)w[k]=secW(secEls[k]);
  TW.capsules=w.hero;TW.flights=w.teams;TW.glyphs=w.kit;TW.ripples=w.contact;
  const ek=EVO_BG[tabs[evoIdx].dataset.to];
  // wide screens show the big background year in the career timeline, so the timeline animations are kept for smaller screens only
  const tlAnim=matchMedia('(max-width: 980px)').matches?w.tl:0;
  ['circuits','board','people'].forEach(k=>{TW[k]=Math.max(tlAnim*tlBg[k],k===ek?w.evo:0)});
}
let last=0;cv.style.opacity=1;
let lastDraw=0, idle=false;
function frame(now){
  requestAnimationFrame(frame);
  if(document.hidden||now-lastDraw<32)return; // ~30 fps is plenty for slow ambient motion
  lastDraw=now;
  let dt=Math.min(.08,(now-last)/1000||0);last=now;
  targets();
  const anyOn=Object.keys(TW).some(k=>TW[k]>0||DW[k]>=.01);
  if(!anyOn){if(!idle){cx.setTransform(1,0,0,1,0,0);cx.clearRect(0,0,cv.width,cv.height);idle=true}return}
  idle=false;
  const ease=Math.min(1,dt*3.5);
  cx.setTransform(1,0,0,1,0,0);cx.clearRect(0,0,cv.width,cv.height);cx.setTransform(dpr,0,0,dpr,0,0);
  const mdt=RM?0:dt;
  for(const k in LAYERS){DW[k]+=(TW[k]-DW[k])*(RM?1:ease);if(DW[k]<.01)continue;cx.save();cx.globalAlpha=DW[k]*CX.o;LAYERS[k](cx,mdt);cx.restore()}
}
genAll(); requestAnimationFrame(frame);
const themeRefresh=()=>{genAll();onScroll()};
try{matchMedia('(prefers-color-scheme: light)').addEventListener('change',()=>setTimeout(themeRefresh,50))}catch(e){}
new MutationObserver(()=>setTimeout(themeRefresh,50)).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
let rz; addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>{if(innerWidth!==W||Math.abs(innerHeight-Hh)>150)genAll();onScroll()},200)});

/* ---------- scroll-driven stage ---------- */
const stage=emblems.stageEmblem, chapters=[...document.querySelectorAll('.chapter')];
const $=id=>document.getElementById(id);
const glow=$('glow'), heroSec=document.querySelector('.hero'), timeline=document.querySelector('.timeline');
const mixOf=c=>c.dataset.mix.split(',').map(Number);
let lastI=-1, lastGa='', lastGb='', lastKey='';
const smooth=t=>t<=0?0:t>=1?1:t*t*(3-2*t);
function hex(h){return[1,3,5].map(i=>parseInt(h.substr(i,2),16))}
function mixHex(a,b,t){const A=hex(a),B=hex(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')}
function onScroll(){
  const vh=innerHeight, anchor=vh*.55;
  let i=0; chapters.forEach((c,j)=>{if(c.getBoundingClientRect().top<anchor)i=j});
  const r=chapters[i].getBoundingClientRect();
  const prog=(anchor-r.top)/r.height;
  const tt=i<chapters.length-1?smooth((prog-.62)/.38):0;
  const a=chapters[i], b=chapters[Math.min(i+1,chapters.length-1)];
  const sa=S[a.dataset.state], sb=S[b.dataset.state];
  const s=lerp(sa,sb,tt); tlBg=s.bg;
  const key=i+':'+tt.toFixed(3);if(key!==lastKey){lastKey=key;stage.cur=s;apply(stage,s)}
  // tech level: fade in only once timeline is reached; hero/intro stays calm
  const tr=timeline.getBoundingClientRect();
  const inTL=tr.top<vh*.6&&tr.bottom>vh*.4;
  const ga=inTL?mixHex(sa.glow[0],sb.glow[0],tt):'#ffbe0b', gb=inTL?mixHex(sa.glow[1],sb.glow[1],tt):'#fb5607';
  if(ga!==lastGa||gb!==lastGb){lastGa=ga;lastGb=gb;glow.style.setProperty('--mads-ambient-a',ga);glow.style.setProperty('--mads-ambient-b',gb)}
  // mix bars
  const ma=mixOf(a), mb=mixOf(b), m=ma.map((v,k)=>v+(mb[k]-v)*tt);
  [['mxT','mxTo'],['mxP','mxPo'],['mxD','mxDo']].forEach(([bar,out],k)=>{$(bar).style.transform='scaleX('+(m[k]/100).toFixed(3)+')';const t=Math.round(m[k])+'%';if($(out).textContent!==t)$(out).textContent=t});
  const cur=tt>.5?b:a;
  if(cur!==lastI){lastI=cur;
    $('stYears').textContent=cur.dataset.years.toUpperCase();$('stRole').textContent=cur.dataset.role;$('stOrg').textContent=cur.dataset.org;$('stPlace').textContent=cur.dataset.place;$('ghostYear').textContent=cur.dataset.ghost;
    // crossfade the stage avatar to this stage's age
    const src='assets/'+cur.dataset.photo, imgs=$('stagePhoto').querySelectorAll('img');
    const front=imgs[0].style.opacity==='0'?imgs[1]:imgs[0], back=front===imgs[0]?imgs[1]:imgs[0];
    if(!front.getAttribute('src').endsWith(cur.dataset.photo)){back.src=src;back.style.opacity=1;front.style.opacity=0}
  }
}
let ticking=false;
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(()=>{onScroll();ticking=false})}},{passive:true});
onScroll();

/* ---------- pause off-screen decoration ---------- */
const offIO=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('offscreen',!e.isIntersecting)),{rootMargin:'100px'});
document.querySelectorAll('.hero,.evo,.map,.contact,.stage,.nav').forEach(el=>offIO.observe(el));

/* ---------- hero avatar blink: ~150 ms, every 2.5-6.5 s at random, sometimes twice ---------- */
(()=>{const av=document.getElementById('heroAvatar');if(!av||RM)return;let visible=true;
  new IntersectionObserver(es=>es.forEach(e=>visible=e.isIntersecting)).observe(av);
  const blink=(then)=>{av.classList.add('blinking');setTimeout(()=>{av.classList.remove('blinking');then&&then()},120+Math.random()*60)};
  const next=()=>setTimeout(()=>{if(visible&&!document.hidden){if(Math.random()<.18)blink(()=>setTimeout(()=>blink(),160));else blink()}next()},2500+Math.random()*4000);
  next()})();

/* ---------- product rail ---------- */
const rail=$('rail');
document.querySelectorAll('.rail-btns button').forEach(b=>b.addEventListener('click',()=>rail.scrollBy({left:(b.dataset.dir==='prev'?-1:1)*rail.clientWidth*.8,behavior:'smooth'})));
const vio=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;if(e.isIntersecting&&!RM){v.play().catch(()=>{})}else v.pause()}),{threshold:.5});
rail.querySelectorAll('video').forEach(v=>vio.observe(v));
})();
