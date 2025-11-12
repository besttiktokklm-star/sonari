(function(){
const banner=document.getElementById('cookieBanner');
if(banner&&!localStorage.getItem('cookiesAccepted')){
  banner.style.display='block';
  document.getElementById('acceptCookies').onclick=()=>{localStorage.setItem('cookiesAccepted','1');banner.remove();};
}
const payBtn=document.getElementById('payBtn');
const modal=document.getElementById('checkoutModal');
if(payBtn){payBtn.onclick=()=>modal.classList.remove('hidden');}
document.getElementById('closeModal')?.addEventListener('click',()=>modal.classList.add('hidden'));
document.getElementById('confirmPay')?.addEventListener('click',()=>{alert('Pagamento concluído ✅');localStorage.setItem('sonari-premium','1');modal.classList.add('hidden');});
})();