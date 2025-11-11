(function(){
  const $ = (id)=> document.getElementById(id);
  // Theme toggle & persist
  document.querySelector('#themeToggle')?.addEventListener('click', ()=>{
    const cur = document.documentElement.getAttribute('data-theme') || 'system';
    const next = cur==='dark' ? 'light' : cur==='light' ? 'system' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('sonari-theme', next);
  });
  (function(){ const saved = localStorage.getItem('sonari-theme'); if(saved) document.documentElement.setAttribute('data-theme', saved);})();

  // PWA A2HS prompt
  let dp=null; window.addEventListener('beforeinstallprompt', (e)=>{ e.preventDefault(); dp=e; });
  document.querySelector('#installBtn')?.addEventListener('click', async (e)=>{
    e.preventDefault(); if(dp){ dp.prompt(); dp=null; } else alert('Usa “Adicionar ao ecrã inicial” no menu do navegador.');
  });

  // Register SW
  if('serviceWorker' in navigator){ navigator.serviceWorker.register('sw.js'); }

  // Premium gate
  let isPremium = localStorage.getItem('sonari-premium')==='1';
  function setPremium(v){ isPremium = !!v; localStorage.setItem('sonari-premium', v?'1':'0');
    document.querySelectorAll('.tile.locked').forEach(t=> t.style.opacity = isPremium? '1':'0.6');
  }
  setPremium(isPremium);
  document.querySelector('#goPremium')?.addEventListener('click', ()=>{ setPremium(true); alert('Premium ativado (demo local).'); });
  document.querySelector('#revokePremium')?.addEventListener('click', ()=>{ setPremium(false); alert('Premium desativado.'); });

  // Audio Player
  if($('playBtn')){
    let ctx, masterGain, nodes={}, running=false, countdown=null, endAt=0, currentPreset={name:'Relax 1'};
    function init(){ if(ctx) return; ctx=new (window.AudioContext||window.webkitAudioContext)();
      masterGain=ctx.createGain(); masterGain.connect(ctx.destination); masterGain.gain.value = $('master').value/100;
      nodes.rain={gain:ctx.createGain()}; nodes.pink={gain:ctx.createGain()}; nodes.pad={gain:ctx.createGain()};
      nodes.rain.gain.connect(masterGain); nodes.pink.gain.connect(masterGain); nodes.pad.gain.connect(masterGain);
      buildRain(); buildPink(); buildPad(); applyMixer(); }
    function buildRain(){ const size=2*(ctx.sampleRate); const buf=ctx.createBuffer(1,size,ctx.sampleRate); const d=buf.getChannelData(0);
      for(let i=0;i<size;i++) d[i]=Math.random()*2-1; const src=ctx.createBufferSource(); src.buffer=buf; src.loop=true;
      const hp=ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=500; const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=6000;
      const g=ctx.createGain(); g.gain.value=0.5; src.connect(hp).connect(lp).connect(g).connect(nodes.rain.gain); src.start(); nodes.rain={...nodes.rain,src,hp,lp,g}; }
    function buildPink(){ const N=4096; const node=ctx.createScriptProcessor(N,1,1); let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0; node.onaudioprocess=e=>{
        const out=e.outputBuffer.getChannelData(0); for(let i=0;i<N;i++){ const w=Math.random()*2-1; b0=0.99886*b0 + w*0.0555179; b1=0.99332*b1 + w*0.0750759; b2=0.96900*b2 + w*0.1538520; b3=0.86650*b3 + w*0.3104856; b4=0.55000*b4 + w*0.5329522; b5=-0.7616*b5 - w*0.0168980; out[i]=(b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.11; b6=w*0.115926; } };
      node.connect(nodes.pink.gain); nodes.pink.node=node; }
    function buildPad(){ const o1=ctx.createOscillator(), o2=ctx.createOscillator(); o1.type='sine'; o2.type='triangle'; o1.frequency.value=220; o2.frequency.value=222.2;
      const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=600; const g=ctx.createGain(); g.gain.value=0.25; o1.connect(lp); o2.connect(lp); lp.connect(g).connect(nodes.pad.gain);
      const lfo=ctx.createOscillator(); lfo.frequency.value=0.08; const lfoG=ctx.createGain(); lfoG.gain.value=80; lfo.connect(lfoG).connect(lp.frequency); o1.start(); o2.start(); lfo.start(); nodes.pad={...nodes.pad,o1,o2,lp,g,lfo}; }
    function applyMixer(){ if(!ctx) return; nodes.rain.gain.gain.value=$('rain').value/100*0.9; nodes.pink.gain.gain.value=$('pink').value/100*0.6; nodes.pad.gain.gain.value=$('pad').value/100*0.7; masterGain.gain.value=$('master').value/100; const meta = `${$('timerSel').value}:00`; document.getElementById('modeMeta').innerHTML=`Modo: <b>${currentPreset.name}</b> • <span id="timer">${meta}</span>`; }
    function start(){ init(); applyMixer(); running=true; ctx.resume(); const mins=parseInt($('timerSel').value,10); endAt=Date.now()+mins*60*1000; tick(); $('playBtn').textContent='⏸️ Pausar'; }
    function pause(){ running=false; ctx.suspend(); $('playBtn').textContent='▶️ Retomar'; clearInterval(countdown); }
    function stop(){ running=false; clearInterval(countdown); update(0); $('playBtn').textContent='▶️ Reproduzir'; ctx && ctx.suspend(); updateProgress(0); }
    function tick(){ clearInterval(countdown); const total = parseInt($('timerSel').value,10)*60*1000; countdown=setInterval(()=>{ const left=Math.max(0,endAt-Date.now()); update(left); updateProgress((total-left)/total); if(left<=0){ stop(); try{ new Notification('Sessão concluída ✅',{body:`${currentPreset.name} terminou.`}); }catch(e){} } },250); }
    function update(ms){ const s=Math.round(ms/1000); const mm=String(Math.floor(s/60)).padStart(2,'0'); const ss=String(s%60).padStart(2,'0'); document.getElementById('timer').textContent=`${mm}:${ss}`; }
    function updateProgress(ratio){ const el=document.getElementById('progressBar'); if(el) el.style.width = Math.max(0, Math.min(1, ratio))*100 + '%'; }

    document.getElementById('playBtn').addEventListener('click', ()=>{ if(!ctx || ctx.state!=='running' || !running){ start(); } else { pause(); } });
    document.getElementById('stopBtn').addEventListener('click', stop);
    ;['rain','pink','pad','master','timerSel'].forEach(id=> $(id)?.addEventListener('input', applyMixer));

    document.querySelectorAll('.tile').forEach(el=> el.addEventListener('click', ()=>{
      const premiumOnly=el.hasAttribute('data-premium'); if(premiumOnly && !isPremium){ alert('Conteúdo Premium — €5/mês'); location.href='premium.html'; return; }
      const p=JSON.parse(el.dataset.preset); ['rain','pink','pad','timerSel'].forEach(k=> $(k).value=p[k]); currentPreset={name:p.name}; applyMixer(); start();
    }));

    document.getElementById('savePreset')?.addEventListener('click', ()=>{ if(!isPremium) return alert('Guardar presets é Premium.'); const data={name:currentPreset.name, mins:$('timerSel').value, rain:$('rain').value, pink:$('pink').value, pad:$('pad').value}; localStorage.setItem('sonari-preset', JSON.stringify(data)); alert('Preset guardado.'); });
    document.getElementById('loadPreset')?.addEventListener('click', ()=>{ const raw=localStorage.getItem('sonari-preset'); if(!raw) return alert('Nenhum preset guardado.'); const p=JSON.parse(raw); currentPreset={name:p.name||'Personalizado'}; ['rain','pink','pad','timerSel'].forEach(k=> $(k).value=p[k]); applyMixer(); alert('Preset carregado.'); });
    document.getElementById('clearPreset')?.addEventListener('click', ()=>{ localStorage.removeItem('sonari-preset'); alert('Preset apagado.'); });

    if('Notification' in window && Notification.permission==='default') Notification.requestPermission();
  }
})();