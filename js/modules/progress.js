'use strict';
// SwimTrack Stage 8 - Fortschritt und Diagramme.
// ── FORTSCHRITT ───────────────────────────────────────────────────────────────
async function renderFortschrittPage(){
  const entries=await dbAll('training');
  const t=today();
  let filtered=entries;
  if(S.period==='week'){const wd=getWD(getWS(t));filtered=entries.filter(e=>wd.includes(e.date));}
  else if(S.period==='month'){const ms=t.slice(0,7)+'-01';filtered=entries.filter(e=>e.date>=ms&&e.date<=t);}
  const totalMin=filtered.reduce((s,e)=>s+e.durationMin,0);
  const avgLoad=filtered.length?(filtered.reduce((s,e)=>s+e.load,0)/filtered.length).toFixed(1):'–';
  setText('fp-entries',filtered.length);setText('fp-min',totalMin);setText('fp-avg',avgLoad);
  const last5=entries.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);
  const alertEl=document.getElementById('load-warning');
  if(alertEl)alertEl.classList.toggle('hidden',!(last5.filter(e=>e.load>=8).length>=3||last5.filter(e=>e.wellbeing<=2).length>=3));
  setTimeout(()=>renderCharts(entries,S.period),50);
  const ae=document.getElementById('all-entries');
  if(ae){
    const sorted=entries.slice().sort((a,b)=>b.date.localeCompare(a.date));
    if(!sorted.length)ae.innerHTML='<div class="empty"><div class="empty-ico">📋</div><p>Noch keine Einträge.</p></div>';
    else ae.innerHTML=sorted.map(e=>buildEntryCard(e,false)).join('');
  }
}
function setPeriod(p,btn){S.period=p;document.querySelectorAll('.pbtn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderFortschrittPage();}

// ── CHARTS ────────────────────────────────────────────────────────────────────
function setupCanvas(id,h){
  const canvas=document.getElementById(id);if(!canvas)return null;
  const dpr=window.devicePixelRatio||1;
  const rect=canvas.parentElement.getBoundingClientRect();
  const W=Math.max(rect.width||300,200),H=h||150;
  canvas.width=W*dpr;canvas.height=H*dpr;
  canvas.style.width=W+'px';canvas.style.height=H+'px';
  const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);ctx.clearRect(0,0,W,H);
  return{ctx,W,H};
}
function drawBar(id,labels,data,color){
  const r=setupCanvas(id,150);if(!r||!data.length)return;
  const{ctx,W,H}=r;
  const pad={t:8,r:8,b:26,l:32};const cW=W-pad.l-pad.r,cH=H-pad.t-pad.b;
  const max=Math.max(...data,1);const gap=cW/data.length;const bW=Math.max(4,gap*.55);
  for(let i=0;i<=4;i++){const y=pad.t+cH-(i/4)*cH;ctx.strokeStyle='#DCDCE8';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(pad.l+cW,y);ctx.stroke();ctx.fillStyle='#9090A8';ctx.font='9px Inter,sans-serif';ctx.textAlign='right';ctx.fillText(Math.round((i/4)*max),pad.l-4,y+3);}
  data.forEach((v,i)=>{
    const x=pad.l+i*gap+gap/2-bW/2;const bH=Math.max(2,(v/max)*cH);const y=pad.t+cH-bH;
    const g=ctx.createLinearGradient(0,y,0,y+bH);g.addColorStop(0,color);g.addColorStop(1,color+'70');
    ctx.fillStyle=g;const rr=Math.min(4,bW/2);
    ctx.beginPath();ctx.moveTo(x+rr,y);ctx.lineTo(x+bW-rr,y);ctx.quadraticCurveTo(x+bW,y,x+bW,y+rr);ctx.lineTo(x+bW,y+bH);ctx.lineTo(x,y+bH);ctx.lineTo(x,y+rr);ctx.quadraticCurveTo(x,y,x+rr,y);ctx.closePath();ctx.fill();
    ctx.fillStyle='#9090A8';ctx.font='9px Inter,sans-serif';ctx.textAlign='center';ctx.fillText(labels[i]||'',pad.l+i*gap+gap/2,H-6);
  });
}
function drawLine(id,labels,data,color,minY,maxY){
  const r=setupCanvas(id,150);if(!r||!data.length)return;
  const{ctx,W,H}=r;
  const pad={t:8,r:8,b:26,l:26};const cW=W-pad.l-pad.r,cH=H-pad.t-pad.b;
  const range=(maxY-minY)||1;
  const toX=i=>pad.l+(i/Math.max(data.length-1,1))*cW;
  const toY=v=>pad.t+cH-((v-minY)/range)*cH;
  const step=Math.ceil(range/4);
  for(let v=minY;v<=maxY;v+=step){const y=toY(v);ctx.strokeStyle='#DCDCE8';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(pad.l+cW,y);ctx.stroke();ctx.fillStyle='#9090A8';ctx.font='9px Inter,sans-serif';ctx.textAlign='right';ctx.fillText(v,pad.l-4,y+3);}
  if(data.length===1){ctx.fillStyle=color;ctx.beginPath();ctx.arc(toX(0),toY(data[0]),4,0,Math.PI*2);ctx.fill();return;}
  const ag=ctx.createLinearGradient(0,pad.t,0,pad.t+cH);ag.addColorStop(0,color+'28');ag.addColorStop(1,color+'00');
  ctx.fillStyle=ag;ctx.beginPath();ctx.moveTo(toX(0),toY(data[0]));data.forEach((v,i)=>{if(i>0)ctx.lineTo(toX(i),toY(v));});ctx.lineTo(toX(data.length-1),pad.t+cH);ctx.lineTo(toX(0),pad.t+cH);ctx.closePath();ctx.fill();
  ctx.strokeStyle=color;ctx.lineWidth=2;ctx.lineJoin='round';ctx.beginPath();data.forEach((v,i)=>i===0?ctx.moveTo(toX(i),toY(v)):ctx.lineTo(toX(i),toY(v)));ctx.stroke();
  data.forEach((v,i)=>{ctx.fillStyle=color;ctx.beginPath();ctx.arc(toX(i),toY(v),3,0,Math.PI*2);ctx.fill();ctx.fillStyle='white';ctx.beginPath();ctx.arc(toX(i),toY(v),1.4,0,Math.PI*2);ctx.fill();});
  const ls=Math.max(1,Math.floor(labels.length/6));ctx.fillStyle='#9090A8';ctx.font='9px Inter,sans-serif';ctx.textAlign='center';labels.forEach((l,i)=>{if(i%ls===0)ctx.fillText(l,toX(i),H-6);});
}
function drawDonut(id,labels,data,legendId){
  const canvas=document.getElementById(id);if(!canvas)return;
  const dpr=window.devicePixelRatio||1;const size=100;
  canvas.width=size*dpr;canvas.height=size*dpr;canvas.style.width=size+'px';canvas.style.height=size+'px';
  const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);ctx.clearRect(0,0,size,size);
  const total=data.reduce((s,v)=>s+v,0);if(!total)return;
  const cx=size/2,cy=size/2,r=size/2-6,inner=r*.54;
  let angle=-Math.PI/2;
  data.forEach((v,i)=>{const slice=(v/total)*Math.PI*2;ctx.fillStyle=CHART_COLORS[i%CHART_COLORS.length];ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,angle,angle+slice);ctx.closePath();ctx.fill();angle+=slice;});
  const isDark=document.documentElement.hasAttribute('data-dark');
  ctx.fillStyle=isDark?'#12152A':'white';ctx.beginPath();ctx.arc(cx,cy,inner,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=isDark?'#F0F0F8':'#0D0D1A';ctx.font='bold '+(Math.round(size*.13))+'px Inter,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(total,cx,cy);
  if(legendId){const el=document.getElementById(legendId);if(el)el.innerHTML=labels.map((l,i)=>'<div class="cleg"><div class="cleg-dot" style="background:'+CHART_COLORS[i%CHART_COLORS.length]+'"></div><span>'+l+': '+data[i]+'</span></div>').join('');}
}
function getWeeksInMonth(ms,t){
  const d=new Date(ms+'T12:00:00'),weeks={};
  while(d.toISOString().slice(0,10)<=t){const ws=getWS(d.toISOString().slice(0,10));if(!weeks[ws])weeks[ws]=[];weeks[ws].push(d.toISOString().slice(0,10));d.setDate(d.getDate()+1);}
  return Object.values(weeks);
}
function renderCharts(entries,period){
  const t=today();
  let minLabels,minData;
  if(period==='week'){const wd=getWD(getWS(t));minLabels=['Mo','Di','Mi','Do','Fr','Sa','So'];minData=wd.map(d=>entries.filter(e=>e.date===d).reduce((s,e)=>s+e.durationMin,0));}
  else if(period==='month'){const ms=t.slice(0,7)+'-01';const weeks=getWeeksInMonth(ms,t);minLabels=weeks.map((_,i)=>'KW'+(i+1));minData=weeks.map(wd=>entries.filter(e=>wd.includes(e.date)).reduce((s,e)=>s+e.durationMin,0));}
  else{const months=[...new Set(entries.map(e=>e.date.slice(0,7)))].sort().slice(-12);minLabels=months.map(m=>new Date(m+'-01').toLocaleDateString('de-DE',{month:'short'}));minData=months.map(m=>entries.filter(e=>e.date.startsWith(m)).reduce((s,e)=>s+e.durationMin,0));}
  drawBar('c-min',minLabels,minData,'#0066FF');
  const r20=entries.slice().sort((a,b)=>a.date.localeCompare(b.date)).slice(-20);
  drawLine('c-load',r20.map(e=>fmtDateS(e.date)),r20.map(e=>e.load),'#FF8F00',1,10);
  drawLine('c-well',r20.map(e=>fmtDateS(e.date)),r20.map(e=>e.wellbeing),'#00C853',1,5);
  let filt=entries;
  if(period==='week'){const wd=getWD(getWS(t));filt=entries.filter(e=>wd.includes(e.date));}
  else if(period==='month'){const ms=t.slice(0,7)+'-01';filt=entries.filter(e=>e.date>=ms&&e.date<=t);}
  const tc={};filt.forEach(e=>{tc[e.type]=(tc[e.type]||0)+1;});
  const types=Object.keys(tc),counts=types.map(t=>tc[t]);
  drawDonut('c-types',types,counts,'types-legend');
}

