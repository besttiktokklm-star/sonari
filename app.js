(function(){
  function applyTheme(){ const s=localStorage.getItem('sonari-theme')||'dark'; document.documentElement.classList.toggle('light', s==='light'); }
  applyTheme();
  document.getElementById('themeToggle')?.addEventListener('click', ()=>{ const c=localStorage.getItem('sonari-theme')||'dark'; localStorage.setItem('sonari-theme', c==='dark'?'light':'dark'); applyTheme(); });
  document.getElementById('langPT')?.addEventListener('click', ()=> SONARI_I18N.set('pt'));
  document.getElementById('langEN')?.addEventListener('click', ()=> SONARI_I18N.set('en'));

  const cookie=document.getElementById('cookie');
  if(cookie && !localStorage.getItem('sonari-cookies')){ cookie.style.display='block'; document.getElementById('cookieAccept')?.addEventListener('click', ()=>{ localStorage.setItem('sonari-cookies','1'); cookie.remove(); }); }

  if('serviceWorker' in navigator){ navigator.serviceWorker.register('sw.js'); }
  let dp=null; window.addEventListener('beforeinstallprompt', e=>{ e.preventDefault(); dp=e; });
  document.getElementById('installBtn')?.addEventListener('click', ()=>{ if(dp){dp.prompt(); dp=null;} else alert('Use “Add to Home Screen”.'); });

  let isPremium = localStorage.getItem('sonari-premium')==='1';
  function setPremium(v){ isPremium=!!v; localStorage.setItem('sonari-premium', v?'1':'0'); document.querySelectorAll('[data-premium]').forEach(el=> el.classList.toggle('locked', !isPremium)); }
  setPremium(isPremium);
  document.getElementById('goPremium')?.addEventListener('click', ()=>{ setPremium(true); alert('Premium ativo (demo).'); });

  if(document.getElementById('playBtn')){
    const $ = (id)=>document.getElementById(id);
    let ctx, master, nodes={}, timer=null, endAt=0, current={name:'Relax 1'};
    function init(){
      if(ctx) return;
      ctx = new (window.AudioContext||window.webkitAudioContext)();
      master = ctx.createGain(); master.connect(ctx.destination); master.gain.value=0.8;
      nodes.rain={gain:ctx.createGain()}; nodes.pink={gain:ctx.createGain()}; nodes.pad={gain:ctx.createGain()};
      nodes.rain.gain.connect(master); nodes.pink.gain.connect(master); nodes.pad.gain.connect(master);

      const size=2*ctx.sampleRate; const buf=ctx.createBuffer(1,size,ctx.sampleRate); const d=buf.getChannelData(0);
      for(let i=0;i<size;i++) d[i]=Math.random()*2-1;
      const src=ctx.createBufferSource(); src.buffer=buf; src.loop=true;
      const hp=ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=500;
      const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=6500;
      const g=ctx.createGain(); g.gain.value=0.5; src.connect(hp).connect(lp).connect(g).connect(nodes.rain.gain); src.start();

      const N=4096; const sp=ctx.createScriptProcessor(N,1,1); let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
      sp.onaudioprocess=(e)=>{const out=e.outputBuffer.getChannelData(0);for(let i=0;i<N;i++){const w=Math.random()*2-1;b0=0.99886*b0+w*0.0555179;b1=0.99332*b1+w*0.0750759;b2=0.969*b2+w*0.153852;b3=0.8665*b3+w*0.3104856;b4=0.55*b4+w*0.5329522;b5=-0.7616*b5-w*0.016898;out[i]=(b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.11;b6=w*0.115926;}};
      sp.connect(nodes.pink.gain);

      const o1=ctx.createOscillator(), o2=ctx.createOscillator(); o1.type='sine'; o2.type='triangle'; o1.frequency.value=220; o2.frequency.value=222.2;
      const lpf=ctx.createBiquadFilter(); lpf.type='lowpass'; lpf.frequency.value=650; const pg=ctx.createGain(); pg.gain.value=0.25;
      const lfo=ctx.createOscillator(); const lfoG=ctx.createGain(); lfo.frequency.value=0.08; lfoG.gain.value=80; lfo.connect(lfoG).connect(lpf.frequency);
      o1.connect(lpf); o2.connect(lpf); lpf.connect(pg).connect(nodes.pad.gain); o1.start(); o2.start(); lfo.start();
      nodes.pad={...nodes.pad,o1,o2,lpf,pg,lfo};
    }
    function apply(){
      if(!ctx) return;
      nodes.rain.gain.gain.value = $('rain').value/100*0.9;
      nodes.pink.gain.gain.value = $('pink').value/100*0.6;
      nodes.pad.gain.gain.value  = $('pad').value/100*0.7;
      master.gain.value = $('master').value/100;
      document.getElementById('meta').innerHTML = current.name + ' • <span id=\"timer\">20:00</span>';
    }
    function start(){
      init(); apply(); ctx.resume();
      const mins=parseInt(document.getElementById('mins').value,10); endAt=Date.now()+mins*60*1000;
      clearInterval(timer);
      timer=setInterval(()=>{
        const left=Math.max(0,endAt-Date.now()); const s=Math.round(left/1000);
        const mm=(''+Math.floor(s/60)).padStart(2,'0'); const ss=(''+(s%60)).padStart(2,'0');
        document.getElementById('timer').textContent=mm+':'+ss;
        const total=mins*60*1000; const r=(total-left)/total; document.getElementById('bar').style.width=(r*100)+'%';
        if(left<=0){ stop(); }
      },250);
      document.getElementById('playBtn').textContent='⏸️';
    }
    function pause(){ ctx&&ctx.suspend(); document.getElementById('playBtn').textContent='▶️'; clearInterval(timer); }
    function stop(){ pause(); document.getElementById('bar').style.width='0%'; document.getElementById('timer').textContent='00:00'; }
    document.getElementById('playBtn').addEventListener('click', ()=>{ if(!ctx || ctx.state!=='running'){ start(); } else { pause(); } });
    document.getElementById('stopBtn').addEventListener('click', stop);
    ['rain','pink','pad','master','mins'].forEach(id=> document.getElementById(id)?.addEventListener('input', apply));
    document.querySelectorAll('.tile').forEach(card=> card.addEventListener('click', ()=>{
      const premiumOnly=card.hasAttribute('data-premium');
      if(premiumOnly && !isPremium){ alert(SONARI_I18N.t('premium_gate')); location.href='plans.html'; return; }
      const preset=JSON.parse(card.dataset.preset||'{}'); ['rain','pink','pad','mins'].forEach(k=>{ if(preset[k]!=null) document.getElementById(k).value=preset[k]; });
      current.name=preset.name||'Custom'; apply(); start();
    }));
  }

  // Load waves background
  try{ if(!document.getElementById('wavesBG')){ const s=document.createElement('script'); s.src='js/waves.js'; document.body.appendChild(s);} }catch(e){}
})();