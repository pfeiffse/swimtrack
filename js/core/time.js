 'use strict';
// SwimTrack Stage 3 - zentrale Zeitfunktionen.
const SwimTime = Object.freeze({
  toCentiseconds(min, sec, hundredths) {
    return (parseInt(min,10)||0)*6000 + (parseInt(sec,10)||0)*100 + (parseInt(hundredths,10)||0);
  },
  fromCentiseconds(value) {
    const cs=Math.max(0,parseInt(value,10)||0);
    const min=Math.floor(cs/6000);
    const rest=cs-min*6000;
    const sec=Math.floor(rest/100);
    const hundredths=rest-sec*100;
    return {timeMin:min,timeSec:sec,timeMs:hundredths};
  },
  validate(min,sec,hundredths) {
    return Number.isInteger(min)&&min>=0 && Number.isInteger(sec)&&sec>=0&&sec<=59 && Number.isInteger(hundredths)&&hundredths>=0&&hundredths<=99;
  },
  format(min,sec,hundredths) {
    const m=parseInt(min,10)||0,s=parseInt(sec,10)||0,h=parseInt(hundredths,10)||0;
    if(m>0) return m+':'+String(s).padStart(2,'0')+','+String(h).padStart(2,'0');
    return s+','+String(h).padStart(2,'0')+' s';
  }
});
// Kompatibilitätsnamen: bestehende Fachmodule funktionieren ohne Daten-/UI-Umbau.
const fmtTime=(min,sec,ms)=>SwimTime.format(min,sec,ms);
const timeToCs=(min,sec,ms)=>SwimTime.toCentiseconds(min,sec,ms);
function wkFmtTime(min,sec,ms){return SwimTime.format(min,sec,ms);}
function wkTimeToCs(min,sec,ms){return SwimTime.toCentiseconds(min,sec,ms);}
function wkFmt(min,sec,ms){return SwimTime.format(min,sec,ms);}
function wkToCs(min,sec,ms){return SwimTime.toCentiseconds(min,sec,ms);}
function wkValidClock(min,sec,hs){return SwimTime.validate(min,sec,hs);}
function wkCsToParts(cs){return SwimTime.fromCentiseconds(cs);}
