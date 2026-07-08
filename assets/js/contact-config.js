window.RW_CONTACT_ENDPOINT = '';
(function installRafalWorkshopFullPageBackground(){
  var heroUrl = '/rafal-wilk-digital-workshop/assets/images/private-command-center-hero.webp?v=20260708-full-page-bg-1';
  var css = `
html{background:#05080d!important;}
body.rw-v2-ready:not(.app-open){
  min-height:100vh!important;
  background:#05080d!important;
  color:#eaf3ff!important;
}
body.rw-v2-ready:not(.app-open)::before,
body.rw-v2-ready:not(.app-open)::after{display:none!important;content:none!important;}
body.rw-v2-ready:not(.app-open) .rw-full-page-bg,
body.rw-v2-ready:not(.app-open) .rw-full-page-bg-shade{
  position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;pointer-events:none!important;
}
body.rw-v2-ready:not(.app-open) .rw-full-page-bg{
  object-fit:cover!important;object-position:center center!important;display:block!important;z-index:0!important;
  transform:scale(1.135)!important;transform-origin:center center!important;filter:saturate(1.04) contrast(1.04)!important;
}
body.rw-v2-ready:not(.app-open) .rw-full-page-bg-shade{
  z-index:1!important;
  background:
    radial-gradient(circle at 74% 20%,rgba(125,211,252,.16),transparent 26%),
    linear-gradient(90deg,rgba(2,6,14,.42) 0%,rgba(2,6,14,.24) 45%,rgba(2,6,14,.10) 100%),
    linear-gradient(180deg,rgba(0,0,0,.20) 0%,rgba(0,0,0,.06) 44%,rgba(0,0,0,.32) 100%)!important;
}
body.rw-v2-ready:not(.app-open) .rw-header{
  position:fixed!important;top:24px!important;left:50%!important;right:auto!important;transform:translateX(-50%)!important;
  width:min(1500px,calc(100vw - 72px))!important;max-width:calc(100vw - 72px)!important;margin:0!important;z-index:9999!important;
  background:transparent!important;border:0!important;box-shadow:none!important;backdrop-filter:none!important;
}
body.rw-v2-ready:not(.app-open) .rw-header .rw-wrap{
  width:100%!important;max-width:none!important;min-height:0!important;padding:0!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:18px!important;
}
body.rw-v2-ready:not(.app-open) .rw-brand{
  max-width:min(520px,calc(100vw - 260px))!important;padding:10px 15px!important;border-radius:999px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;
  background:rgba(5,10,18,.58)!important;border:1px solid rgba(255,255,255,.24)!important;box-shadow:0 14px 34px rgba(0,0,0,.28)!important;backdrop-filter:blur(16px)!important;
}
body.rw-v2-ready:not(.app-open) .rw-title,
body.rw-v2-ready:not(.app-open) .rw-brand-main{color:#fff!important;white-space:nowrap!important;}
body.rw-v2-ready:not(.app-open) .rw-owner-mark{flex:0 0 auto!important;}
body.rw-v2-ready:not(.app-open) .rw-lang{
  flex:0 0 auto!important;padding:5px!important;border-radius:999px!important;background:rgba(5,10,18,.52)!important;border:1px solid rgba(255,255,255,.22)!important;box-shadow:0 14px 34px rgba(0,0,0,.28)!important;backdrop-filter:blur(16px)!important;
}
body.rw-v2-ready:not(.app-open) .rw-lang-btn{color:#eaf6ff!important;border-radius:999px!important;}
body.rw-v2-ready:not(.app-open) .rw-lang-btn[aria-pressed="true"],
body.rw-v2-ready:not(.app-open) .rw-lang-btn.active{color:#10233f!important;background:rgba(255,255,255,.90)!important;}
body.rw-v2-ready:not(.app-open) main.wrap{
  width:min(1500px,calc(100vw - 72px))!important;max-width:1500px!important;margin:118px auto 72px!important;padding:0!important;position:relative!important;z-index:3!important;
}
body.rw-v2-ready:not(.app-open) .rw-v2-shell{display:grid!important;gap:24px!important;}
body.rw-v2-ready:not(.app-open) .rw-v2-hero,
body.rw-v2-ready:not(.app-open) .rw-v2-hero * ,
body.rw-v2-ready:not(.app-open) .rw-v2-hero-poster,
body.rw-v2-ready:not(.app-open) .rw-v2-toolbar,
body.rw-v2-ready:not(.app-open) .rw-v2-main-hero-img{display:none!important;visibility:hidden!important;content:none!important;}
body.rw-v2-ready:not(.app-open) main.wrap .grid{
  position:relative!important;z-index:4!important;margin-top:0!important;padding:0!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:16px!important;
}
body.rw-v2-ready:not(.app-open) main.wrap .card,
body.rw-v2-ready:not(.app-open) .rw-v2-contact{
  color:#f7fbff!important;background:rgba(8,18,32,.58)!important;border:1px solid rgba(226,241,255,.22)!important;border-radius:16px!important;box-shadow:0 22px 60px rgba(0,0,0,.28)!important;backdrop-filter:blur(18px)!important;
}
body.rw-v2-ready:not(.app-open) main.wrap .card .title,
body.rw-v2-ready:not(.app-open) main.wrap .card h2,
body.rw-v2-ready:not(.app-open) main.wrap .card h3{color:#fff!important;}
body.rw-v2-ready:not(.app-open) main.wrap .card .desc,
body.rw-v2-ready:not(.app-open) main.wrap .card p{color:rgba(234,246,255,.78)!important;}
body.rw-v2-ready:not(.app-open) main.wrap .btn,
body.rw-v2-ready:not(.app-open) main.wrap .card a{
  background:rgba(255,255,255,.10)!important;color:#fff!important;border:1px solid rgba(255,255,255,.24)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.10)!important;
}
body.rw-v2-ready:not(.app-open) main.wrap .btn:hover,
body.rw-v2-ready:not(.app-open) main.wrap .card a:hover{background:rgba(255,255,255,.16)!important;filter:none!important;}
body.rw-v2-ready:not(.app-open) .rw-v2-contact{margin-top:4px!important;}
body.rw-v2-ready:not(.app-open) .privacy-footer,
body.rw-v2-ready:not(.app-open) footer{position:relative!important;z-index:3!important;color:rgba(234,246,255,.78)!important;background:rgba(5,10,18,.38)!important;border-top:1px solid rgba(255,255,255,.16)!important;backdrop-filter:blur(14px)!important;}
@media (max-width:1240px){
  body.rw-v2-ready:not(.app-open) main.wrap .grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;}
}
@media (max-width:920px){
  body.rw-v2-ready:not(.app-open) .rw-header{top:12px!important;width:calc(100vw - 28px)!important;max-width:calc(100vw - 28px)!important;}
  body.rw-v2-ready:not(.app-open) .rw-brand{max-width:calc(100vw - 188px)!important;}
  body.rw-v2-ready:not(.app-open) main.wrap{width:calc(100vw - 28px)!important;max-width:calc(100vw - 28px)!important;margin-top:92px!important;}
  body.rw-v2-ready:not(.app-open) .rw-full-page-bg{object-position:60% center!important;transform:scale(1.15)!important;}
  body.rw-v2-ready:not(.app-open) main.wrap .grid{grid-template-columns:1fr!important;}
}
@media (max-width:560px){
  body.rw-v2-ready:not(.app-open) .rw-header{width:calc(100vw - 16px)!important;max-width:calc(100vw - 16px)!important;}
  body.rw-v2-ready:not(.app-open) .rw-brand{max-width:calc(100vw - 150px)!important;padding:8px 10px!important;}
  body.rw-v2-ready:not(.app-open) .rw-title,body.rw-v2-ready:not(.app-open) .rw-brand-main{font-size:12px!important;}
  body.rw-v2-ready:not(.app-open) .rw-lang-btn{min-width:36px!important;height:30px!important;padding:0 7px!important;font-size:11px!important;}
  body.rw-v2-ready:not(.app-open) main.wrap{width:calc(100vw - 18px)!important;max-width:calc(100vw - 18px)!important;margin-top:82px!important;}
  body.rw-v2-ready:not(.app-open) .rw-full-page-bg{object-position:64% center!important;transform:scale(1.18)!important;}
}
  `;
  function applyStyle(){var oldStyle=document.getElementById('rw-workshop-hero-background');if(oldStyle)oldStyle.remove();var style=document.createElement('style');style.id='rw-workshop-hero-background';style.textContent=css;document.head.appendChild(style);}
  function installFullPageBackground(){
    if(document.body.classList.contains('app-open')) return;
    document.querySelectorAll('.rw-v2-main-hero-img').forEach(function(el){el.remove();});
    var oldImg=document.querySelector('.rw-full-page-bg');
    if(!oldImg){
      oldImg=document.createElement('img');
      oldImg.className='rw-full-page-bg';
      oldImg.alt='Rafal Wilk Digital Workshop dashboard background';
      oldImg.decoding='async';
      oldImg.fetchPriority='high';
      document.body.prepend(oldImg);
    }
    if(oldImg.getAttribute('src')!==heroUrl) oldImg.src=heroUrl;
    if(!document.querySelector('.rw-full-page-bg-shade')){
      var shade=document.createElement('div');
      shade.className='rw-full-page-bg-shade';
      document.body.insertBefore(shade, oldImg.nextSibling);
    }
  }
  function removeHeroCopy(){
    document.querySelectorAll('.rw-v2-hero h1,.rw-v2-hero h2,.rw-v2-hero p,.rw-v2-hero .rw-v2-copy,.rw-v2-hero .rw-v2-title,.rw-v2-hero .rw-v2-subtitle').forEach(function(el){el.remove();});
  }
  function applyAll(){applyStyle();installFullPageBackground();removeHeroCopy();}
  applyAll();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',applyAll,{once:true});
  window.addEventListener('load',applyAll,{once:true});
  window.setTimeout(applyAll,300);
  window.setTimeout(applyAll,1200);
  window.setTimeout(applyAll,2500);
})();
