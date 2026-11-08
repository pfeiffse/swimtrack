'use strict';
// Stage 2: Datumshelfer.
const today=()=>new Date().toISOString().slice(0,10);
const fmtDate=s=>{if(!s)return'';return new Date(s+'T12:00:00').toLocaleDateString('de-DE',{weekday:'short',day:'2-digit',month:'2-digit',year:'numeric'});};
const fmtDateS=s=>{if(!s)return'';return new Date(s+'T12:00:00').toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'});};
const getWS=d=>{const dt=new Date(d+'T12:00:00');const day=dt.getDay();dt.setDate(dt.getDate()+(day===0?-6:1-day));return dt.toISOString().slice(0,10);};
const getWD=ws=>{const dates=[],d=new Date(ws+'T12:00:00');for(let i=0;i<7;i++){dates.push(d.toISOString().slice(0,10));d.setDate(d.getDate()+1);}return dates;};
