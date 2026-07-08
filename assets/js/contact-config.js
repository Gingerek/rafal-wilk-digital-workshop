window.RW_CONTACT_ENDPOINT = '';
(function installRafalWorkshopHeroBackground(){
  var heroUrl = 'assets/images/private-command-center-hero.webp?v=20260708-hero-fix-1';
  var css = `
html{
  background:#dce8f0 url("${heroUrl}") center top / contain no-repeat fixed!important;
}
body.rw-v2-ready:not(.app-open){
  min-height:100vh!important;
  background:
    linear-gradient(180deg, rgba(9,18,31,.18) 0%, rgba(9,18,31,.08) 34%, rgba(238,246,252,.72) 78%, rgba(238,246,252,.92) 100%),
    url("${heroUrl}") center top / contain no-repeat fixed,
    #dce8f0!important;
  color:#132238!important;
}
body.rw-v2-ready:not(.app-open)::before,
body.rw-v2-ready:not(.app-open)::after{
  display:none!important;
  content:none!important;
}
body.rw-v2-ready:not(.app-open) .rw-header{
  background:rgba(10,20,34,.72)!important;
  color:#fff!important;
  border:1px solid rgba(255,255,255,.22)!important;
  box-shadow:0 18px 48px rgba(15,23,42,.20)!important;
  backdrop-filter:blur(16px)!important;
}
body.rw-v2-ready:not(.app-open) .rw-title,
body.rw-v2-ready:not(.app-open) .rw-brand-main{
  color:#fff!important;
}
body.rw-v2-ready:not(.app-open) main.wrap{
  width:min(1180px,calc(100vw - 32px))!important;
  max-width:1180px!important;
  margin:22px auto 88px!important;
  padding:0!important;
  position:relative!important;
  z-index:2!important;
}
body.rw-v2-ready:not(.app-open) .rw-v2-shell{
  display:grid!important;
  gap:18px!important;
}
body.rw-v2-ready:not(.app-open) .rw-v2-hero{
  display:block!important;
  position:relative!important;
  width:100%!important;
  min-height:clamp(620px,64vw,900px)!important;
  border-radius:24px!important;
  overflow:hidden!important;
  border:1px solid rgba(255,255,255,.42)!important;
  background:
    linear-gradient(90deg, rgba(8,18,32,.22) 0%, rgba(8,18,32,.08) 36%, rgba(8,18,32,.02) 100%),
    url("${heroUrl}") center center / contain no-repeat,
    #dce8f0!important;
  box-shadow:0 34px 100px rgba(15,23,42,.24)!important;
}
body.rw-v2-ready:not(.app-open) .rw-v2-hero::before,
body.rw-v2-ready:not(.app-open) .rw-v2-hero::after{
  display:none!important;
  content:none!important;
}
body.rw-v2-ready:not(.app-open) .rw-v2-hero-poster{
  position:absolute!important;
  inset:0!important;
  min-height:inherit!important;
  display:flex!important;
  align-items:flex-start!important;
  justify-content:space-between!important;
  padding:22px 26px!important;
  background:linear-gradient(180deg, rgba(7,15,28,.22) 0%, rgba(7,15,28,0) 42%)!important;
  pointer-events:none!important;
}
body.rw-v2-ready:not(.app-open) .rw-v2-brand-lockup{
  margin:0!important;
  width:max-content!important;
  max-width:calc(100% - 220px)!important;
  padding:9px 14px!important;
  border-radius:999px!important;
  background:rgba(7,15,28,.55)!important;
  border:1px solid rgba(255,255,255,.26)!important;
  color:#fff!important;
  font-size:13px!important;
  line-height:1!important;
  box-shadow:0 12px 30px rgba(15,23,42,.18)!important;
  backdrop-filter:blur(14px)!important;
}
body.rw-v2-ready:not(.app-open) .rw-v2-home-lang{
  pointer-events:auto!important;
  margin:0!important;
  padding:5px!important;
  border-radius:999px!important;
  background:rgba(7,15,28,.48)!important;
  border:1px solid rgba(255,255,255,.22)!important;
  box-shadow:0 12px 30px rgba(15,23,42,.18)!important;
  backdrop-filter:blur(14px)!important;
}
body.rw-v2-ready:not(.app-open) .rw-v2-home-lang button{
  color:#eaf6ff!important;
  border-radius:999px!important;
}
body.rw-v2-ready:not(.app-open) .rw-v2-toolbar{
  display:none!important;
}
body.rw-v2-ready:not(.app-open) main.wrap .grid{
  margin-top:0!important;
  position:relative!important;
  z-index:3!important;
}
body.rw-v2-ready:not(.app-open) main.wrap .card,
body.rw-v2-ready:not(.app-open) .rw-v2-contact{
  background:rgba(255,255,255,.88)!important;
  border:1px solid rgba(216,227,239,.88)!important;
  box-shadow:0 18px 46px rgba(25,57,92,.14)!important;
  backdrop-filter:blur(14px)!important;
}
@media (max-width:920px){
  html{background-size:auto 72vh!important;background-position:58% top!important;}
  body.rw-v2-ready:not(.app-open){background-size:auto 72vh!important;background-position:58% top!important;}
  body.rw-v2-ready:not(.app-open) .rw-v2-hero{
    min-height:560px!important;
    background-size:auto 100%!important;
    background-position:58% center!important;
  }
}
@media (max-width:560px){
  body.rw-v2-ready:not(.app-open) main.wrap{width:calc(100vw - 20px)!important;margin-top:14px!important;}
  body.rw-v2-ready:not(.app-open) .rw-v2-hero{
    min-height:520px!important;
    border-radius:18px!important;
    background-size:auto 100%!important;
    background-position:64% center!important;
  }
  body.rw-v2-ready:not(.app-open) .rw-v2-brand-lockup{max-width:calc(100% - 145px)!important;font-size:11px!important;}
}
  `;
  function applyStyle(){
    var oldStyle=document.getElementById('rw-workshop-hero-background');
    if(oldStyle) oldStyle.remove();
    var style=document.createElement('style');
    style.id='rw-workshop-hero-background';
    style.textContent=css;
    document.head.appendChild(style);
  }
  applyStyle();
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',applyStyle,{once:true});
  window.addEventListener('load',applyStyle,{once:true});
  window.setTimeout(applyStyle,300);
  window.setTimeout(applyStyle,1200);
})();