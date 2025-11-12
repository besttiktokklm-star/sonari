(function(){
  const dict={
    en:{nav_listen:"Listen",nav_plans:"Plans",nav_stories:"Stories",nav_about:"About",nav_support:"Support",
      hero_kicker:"Audio Intelligence • Made in Europe",hero_title:"Intelligent Sound for Focus and Calm",
      hero_lead:"Install the PWA, try 3 free relax tracks and unlock everything with Premium.",
      cta_listen:"Listen now",cta_plans:"See Premium Plans",
      reviews_title:"What people say",rev1:"Helps me enter flow in minutes.",rev2:"Perfect for reading and deep work.",rev3:"The pink-noise + pads mix is amazing.",
      cookies:"We use technical and anonymous cookies.",accept:"Accept",
      plans_title:"Choose your plan",free:"Free",premium:"Premium",per_month:"/month",per_year:"/year",
      faq:"FAQ",cancel_q:"Can I cancel?",cancel_a:"Yes, anytime.",secure_q:"Is it secure?",secure_a:"Demo only. No card data stored.",
      session:"Session",timer:"Timer",rain:"Rain",pink:"Pink",pad:"Pad",
      free_badge:"FREE",premium_badge:"Premium",premium_gate:"Premium content — €5/month",go_premium:"Go Premium",
      footer_privacy:"Privacy",footer_terms:"Terms"
    },
    pt:{nav_listen:"Ouvir",nav_plans:"Planos",nav_stories:"Stories",nav_about:"Sobre",nav_support:"Ajuda",
      hero_kicker:"Inteligência de Áudio • Feito na Europa",hero_title:"Som inteligente para foco e calma",
      hero_lead:"Instala a PWA, experimenta 3 faixas grátis e desbloqueia tudo com Premium.",
      cta_listen:"Ouvir agora",cta_plans:"Ver Planos Premium",
      reviews_title:"O que dizem",rev1:"Ajuda-me a entrar em flow em minutos.",rev2:"Perfeito para leitura e trabalho profundo.",rev3:"A mistura de ruído rosa + pads é incrível.",
      cookies:"Usamos cookies técnicos e anónimos.",accept:"Aceitar",
      plans_title:"Escolhe o teu plano",free:"Grátis",premium:"Premium",per_month:"/mês",per_year:"/ano",
      faq:"FAQ",cancel_q:"Posso cancelar?",cancel_a:"Sim, a qualquer momento.",secure_q:"É seguro?",secure_a:"Demo. Não guardamos dados do cartão.",
      session:"Sessão",timer:"Timer",rain:"Chuva",pink:"Ruído Rosa",pad:"Pad",
      free_badge:"GRÁTIS",premium_badge:"Premium",premium_gate:"Conteúdo Premium — €5/mês",go_premium:"Ativar Premium",
      footer_privacy:"Privacidade",footer_terms:"Termos"
    }
  };
  function apply(){
    const lang = localStorage.getItem('sonari-lang') || ((navigator.language||'en').startsWith('pt')?'pt':'en');
    document.documentElement.setAttribute('lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const k=el.getAttribute('data-i18n'); if(dict[lang][k]) el.textContent=dict[lang][k];
    });
  }
  window.SONARI_I18N={apply,set:(l)=>{localStorage.setItem('sonari-lang',l);apply();},t:(k)=>{const lang=localStorage.getItem('sonari-lang')||((navigator.language||'en').startsWith('pt')?'pt':'en');return dict[lang][k]||k;}};
  apply();
})();