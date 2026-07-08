window.RW_CONTACT_ENDPOINT = '';
(function installRafalWorkshopHeroBackground(){
  var heroUrl = 'assets/images/main-hero-dashboard.webp?v=20260708-main-hero-1';
  var css = `
html{
  background:#05080d!important;
}
body.rw-v2-ready:not(.app-open){
  min-height:100vh!important;
  background:
    linear-gradient(180deg,#05080d 0%,#07111c 44%,#edf3f8 44.2%,#f5f8fb 100%)!important;
  color:#132238!important;
}
body.rw-v2-ready:not(.app-open)::before,
body.rw-v2-ready:not(.app-open)::after{
  display:none!important;
  content:none!important;
}
body.rw-v2-ready:not(.app-open) .rw-header{
  position:fixed!important;
  top:24px!important;
  left:50%!important;
  right:auto!important;
  transform:translateX(-50%)!important;
  width:min(1320px,calc(100vw - 72px))!important;
  max-width:calc(100vw - 72px)!important;
  margin:0!important;
  z-index:9999!important;
  background:transparent!important;
  border:0!important;
  box-shadow:none!important;
  backdrop-filter:none!important;
}
body.rw-v2-ready:not(.app-open) .rw-header .rw-wrap{
  width:100%!important;
  max-width:none!important;
  min-height:0!important;
  padding:0!important;
  display:flex!important;
  align-items:center!important;
  justify-content:space-between!important;
  gap:18px!important;
}
body.rw-v2-ready:not(.app-open) .rw-brand{
  max-width:min(520px,calc(100vw - 260px))!important;
  padding:10px 15px!important;
  border-radius:999px!important;
  overflow:hidden!important;
  text-overflow:ellipsis!important;
  white-space:nowrap!important;
  background:rgba(5,10,18,.56)!important;
  border:1px solid rgba(255,255,255,.24)!important;
  box-shadow:0 14px 34px rgba(0,0,0,.28)!important;
  backdrop-filter:blur(16px)!important;
}
body.rw-v2-ready:not(.app-open) .rw-title,
body.rw-v2-ready:not(.app-open) .rw-brand-main{
  color:#fff!important;
  white-space:nowrap!important;
}
body.rw-v2-ready:not(.app-open) .rw-owner-mark{
  flex:0 0 auto!important;
}
body.rw-v2-ready:not(.app-open) .rw-lang{
  flex:0 0 auto!important;
  padding:5px!important;
  border-radius:999px!important;
  background:rgba(5,10,18,.50)!important;
  border:1px solid rgba(255,255,255,.22)!important;
  box-shadow:0 14px 34px rgba(0,0,0,.28)!important;
  backdrop-filter:blur(16px)!important;
}
body.rw-v2-ready:not(.app-open) .rw-lang-btn{
  color:#eaf6ff!important;
  border-radius:999px!important;
}
body.rw-v2-ready:not(.app-open) .rw-lang-btn[aria-pressed="true"],
body.rw-v2-ready:not(.app-open) .rw-lang-btn.active{
  color:#10233f!important;
  background:rgba(255,255,255,.90)!important;
}
body.rw-v2-ready:not(.app-open) main.wrap{
  width:min(1320px,calc(100vw - 72px))!important;
  max-width:1320px!important;
  margin:26px auto 90px!important;
  padding:0!important;
  position:relative!important;
  z-index:2!important;
}
body.rw-v2-ready:not(.app-open) .rw-v2-shell{
  display:grid!important;
  gap:24px!important;
}
body.rw-v2-ready:not(.app-open) .rw-v2-hero{
  display:block!important;
  position:relative!important;
  width:100%!important;
  aspect-ratio:1672 / 941!important;
  min-height:0!important;
  height:auto!important;
  max-height:calc(100vh - 52px)!important;
  border-radius:0!important;
  overflow:hidden!important;
  border:1px solid rgba(255,255,255,.16)!important;
  background:
    linear-gradient(90deg,rgba(2,6,14,.10) 0%,rgba(2,6,14,.02) 45%,rgba(2,6,14,0) 100%),
    url("${heroUrl}") center center / cover no-repeat,
    #05080d!important;
  box-shadow:0 38px 120px rgba(0,0,0,.46)!important;
}
body.rw-v2-ready:not(.app-open) .rw-v2-hero::before{
  content:""!important;
  display:block!important;
  position:absolute!important;
  inset:0!important;
  pointer-events:none!important;
  background:
    linear-gradient(180deg,rgba(0,0,0,.18) 0%,rgba(0,0,0,0) 28%,rgba(0,0,0,.16) 100%),
    radial-gradient(circle at 76% 18%,rgba(120,180,230,.10),transparent 28%)!important;
  z-index:1!important;
}
body.rw-v2-ready:not(.app-open) .rw-v2-hero::after{
  content:""!important;
  display:block!important;
  position:absolute!important;
  left:0!important;
  right:0!important;
  bottom:0!important;
  height:1px!important;
  background:linear-gradient(90deg,transparent,rgba(125,211,252,.48),transparent)!important;
  box-shadow:0 0 30px rgba(125,211,252,.30)!important;
  z-index:2!important;
}
body.rw-v2-ready:not(.app-open) .rw-v2-hero-poster{
  display:none!important;
}
body.rw-v2-ready:not(.app-open) .rw-v2-toolbar{
  display:none!important;
}
body.rw-v2-ready:not(.app-open) main.wrap .grid{
  position:relative!important;
  z-index:3!important;
  margin-top:0!important;
  padding:0!important;
  grid-template-columns:repeat(3,minmax(0,1fr))!important;
  gap:16px!important;
}
body.rw-v2-ready:not(.app-open) main.wrap .card,
body.rw-v2-ready:not(.app-open) .rw-v2-contact{
  background:rgba(255,255,255,.92)!important;
  border:1px solid rgba(216,227,239,.92)!important;
  border-radius:14px!important;
  box-shadow:0 18px 46px rgba(25,57,92,.13)!important;
  backdrop-filter:blur(14px)!important;
}
body.rw-v2-ready:not(.app-open) .rw-v2-contact{
  margin-top:4px!important;
}
@media (min-width:1500px){
  body.rw-v2-ready:not(.app-open) .rw-header,
  body.rw-v2-ready:not(.app-open) main.wrap{
    width:min(1500px,calc(100vw - 96px))!important;
    max-width:1500px!important;
  }
}
@media (max-width:920px){
  body.rw-v2-ready:not(.app-open) .rw-header{
    top:12px!important;
    width:calc(100vw - 28px)!important;
    max-width:calc(100vw - 28px)!important;
  }
  body.rw-v2-ready:not(.app-open) .rw-brand{
    max-width:calc(100vw - 188px)!important;
  }
  body.rw-v2-ready:not(.app-open) main.wrap{
    width:calc(100vw - 28px)!important;
    max-width:calc(100vw - 28px)!important;
    margin-top:16px!important;
  }
  body.rw-v2-ready:not(.app-open) .rw-v2-hero{
    aspect-ratio:auto!important;
    min-height:560px!important;
    background-size:auto 100%!important;
    background-position:60% center!important;
  }
  body.rw-v2-ready:not(.app-open) main.wrap .grid{
    grid-template-columns:1fr!important;
  }
}
@media (max-width:560px){
  body.rw-v2-ready:not(.app-open) .rw-header{
    width:calc(100vw - 16px)!important;
    max-width:calc(100vw - 16px)!important;
  }
  body.rw-v2-ready:not(.app-open) .rw-brand{
    max-width:calc(100vw - 150px)!important;
    padding:8px 10px!important;
  }
  body.rw-v2-ready:not(.app-open) .rw-title,
  body.rw-v2-ready:not(.app-open) .rw-brand-main{
    font-size:12px!important;
  }
  body.rw-v2-ready:not(.app-open) .rw-lang-btn{
    min-width:36px!important;
    height:30px!important;
    padding:0 7px!important;
    font-size:11px!important;
  }
  body.rw-v2-ready:not(.app-open) main.wrap{
    width:calc(100vw - 18px)!important;
    max-width:calc(100vw - 18px)!important;
  }
  body.rw-v2-ready:not(.app-open) .rw-v2-hero{
    min-height:520px!important;
    background-size:auto 100%!important;
    background-position:64% center!important;
  }
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