(function(){
  const c=document.createElement('canvas'); c.id='wavesBG'; c.style.cssText='position:fixed;inset:0;z-index:-1;opacity:.6;pointer-events:none';
  document.addEventListener('DOMContentLoaded', ()=> document.body.appendChild(c));
  const ctx=c.getContext('2d'); const DPR=Math.min(2, window.devicePixelRatio||1);
  function R(){ c.width=innerWidth*DPR; c.height=innerHeight*DPR; } R(); addEventListener('resize', R);
  let t=0; function wave(y,s,a,f){ ctx.beginPath(); for(let x=0;x<c.width;x+=6){ const yv=y+Math.sin(x*f + t*s)*a; if(x===0) ctx.moveTo(x,yv); else ctx.lineTo(x,yv);} const g=ctx.createLinearGradient(0,0,c.width,0); g.addColorStop(0,'rgba(24,240,139,0.18)'); g.addColorStop(1,'rgba(82,242,255,0.18)'); ctx.strokeStyle=g; ctx.lineWidth=2*DPR; ctx.stroke(); }
  (function loop(){ t+=0.01; ctx.clearRect(0,0,c.width,c.height); const h=c.height; wave(h*0.35,0.9,18*DPR,0.004*DPR); wave(h*0.5,0.7,26*DPR,0.003*DPR); wave(h*0.65,0.5,20*DPR,0.0036*DPR); requestAnimationFrame(loop); })();
})();