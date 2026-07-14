window.RW_CONTACT_ENDPOINT = '';
(function installRafalWorkshopHomepageFix(){
  var heroUrl = 'assets/images/private-command-center-hero-bracelets.webp?v=20260708-bracelets-1';
  var css = `
html,body{min-height:100%!important;}
body:not(.app-open){
  margin:0!important;min-height:100vh!important;overflow-x:hidden!important;background:#05080d!important;color:#eaf3ff!important;
}
body:not(.app-open)::before,
body:not(.app-open)::after{display:none!important;content:none!important;}
body:not(.app-open) .rw-full-page-bg,
body:not(.app-open) .rw-full-page-bg-shade{
  position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;pointer-events:none!important;
}
body:not(.app-open) .rw-full-page-bg{
  object-fit:cover!important;object-position:center center!important;display:block!important;z-index:0!important;
  transform:scale(1.08)!important;transform-origin:center center!important;filter:saturate(1.05) contrast(1.05)!important;
}
body:not(.app-open) .rw-full-page-bg-shade{
  z-index:1!important;
  background:
    radial-gradient(circle at 73% 20%,rgba(125,211,252,.12),transparent 28%),
    linear-gradient(90deg,rgba(2,6,14,.40) 0%,rgba(2,6,14,.20) 46%,rgba(2,6,14,.08) 100%),
    linear-gradient(180deg,rgba(0,0,0,.18) 0%,rgba(0,0,0,.03) 46%,rgba(0,0,0,.30) 100%)!important;
}
body.app-open .rw-full-page-bg,
body.app-open .rw-full-page-bg-shade{display:none!important;}
body:not(.app-open)>*:not(.rw-full-page-bg):not(.rw-full-page-bg-shade){position:relative!important;z-index:2!important;}
body:not(.app-open) .rw-header,
body:not(.app-open)>header{
  position:fixed!important;top:22px!important;left:50%!important;right:auto!important;transform:translateX(-50%)!important;
  width:min(1220px,calc(100vw - 64px))!important;max-width:calc(100vw - 64px)!important;margin:0!important;z-index:9999!important;
  background:transparent!important;border:0!important;box-shadow:none!important;backdrop-filter:none!important;
}
body:not(.app-open) .rw-header{display:block!important;visibility:visible!important;opacity:1!important;}
body:not(.app-open)>header:not(.rw-header){display:none!important;}
body:not(.app-open) .rw-header .rw-wrap,
body:not(.app-open)>header .rw-wrap,
body:not(.app-open)>header .wrap{
  width:100%!important;max-width:none!important;min-height:0!important;padding:0!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:18px!important;
}
body:not(.app-open) .rw-brand,
body:not(.app-open) .rw-title{
  display:inline-flex!important;align-items:center!important;visibility:visible!important;opacity:1!important;
  max-width:min(520px,calc(100vw - 260px))!important;padding:10px 15px!important;border-radius:999px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;
  color:#fff!important;background:rgba(5,10,18,.58)!important;border:1px solid rgba(255,255,255,.24)!important;box-shadow:0 14px 34px rgba(0,0,0,.28)!important;backdrop-filter:blur(16px)!important;
  font-size:13px!important;line-height:1.2!important;font-weight:650!important;letter-spacing:0!important;
}
body:not(.app-open) .rw-brand-copy,
body:not(.app-open) .rw-brand-line,
body:not(.app-open) .rw-brand-main{
  display:inline-flex!important;align-items:center!important;visibility:visible!important;opacity:1!important;
}
body:not(.app-open) .rw-brand-main{color:#fff!important;white-space:nowrap!important;font-size:13px!important;line-height:1.2!important;font-weight:650!important;}
body:not(.app-open) .rw-owner-mark{flex:0 0 auto!important;}
body:not(.app-open) .rw-lang{
  flex:0 0 auto!important;padding:5px!important;border-radius:999px!important;background:rgba(5,10,18,.52)!important;border:1px solid rgba(255,255,255,.22)!important;box-shadow:0 14px 34px rgba(0,0,0,.28)!important;backdrop-filter:blur(16px)!important;
}
body:not(.app-open) .rw-lang-btn{color:#eaf6ff!important;border-radius:999px!important;}
body:not(.app-open) .rw-lang-btn[aria-pressed="true"],
body:not(.app-open) .rw-lang-btn.active{color:#10233f!important;background:rgba(255,255,255,.90)!important;}
body:not(.app-open) .rw-v2-floating-lang{display:none!important;}
body:not(.app-open) main,
body:not(.app-open) main.wrap{
  display:block!important;height:auto!important;min-height:auto!important;overflow:visible!important;
  width:min(1220px,calc(100vw - 64px))!important;max-width:1220px!important;margin:0 auto 72px!important;padding:116px 0 0!important;position:relative!important;z-index:3!important;
}
body:not(.app-open) .rw-v2-shell{display:grid!important;gap:24px!important;}
body:not(.app-open) .rw-v2-hero,
body:not(.app-open) .rw-v2-hero * ,
body:not(.app-open) .rw-v2-hero-poster,
body:not(.app-open) .rw-v2-toolbar,
body:not(.app-open) .rw-v2-main-hero-img{display:none!important;visibility:hidden!important;content:none!important;}
body:not(.app-open) main .grid,
body:not(.app-open) main.wrap .grid{
  display:grid!important;grid-template-columns:repeat(3,minmax(280px,1fr))!important;gap:18px!important;margin:0!important;padding:0!important;align-items:stretch!important;grid-auto-rows:auto!important;overflow:visible!important;
}
body:not(.app-open) main .grid>* ,
body:not(.app-open) main.wrap .card,
body:not(.app-open) main .card,
body:not(.app-open) .rw-v2-contact{
  min-height:142px!important;height:auto!important;overflow:visible!important;color:#f7fbff!important;background:rgba(8,18,32,.62)!important;border:1px solid rgba(226,241,255,.24)!important;border-radius:16px!important;box-shadow:0 22px 60px rgba(0,0,0,.30)!important;backdrop-filter:blur(18px)!important;
}
body:not(.app-open) main .grid>*{padding:16px!important;}
body:not(.app-open) main .card .title,
body:not(.app-open) main .card h2,
body:not(.app-open) main .card h3{color:#fff!important;}
body:not(.app-open) main .card .desc,
body:not(.app-open) main .card p{color:rgba(234,246,255,.78)!important;}
body:not(.app-open) main .btn,
body:not(.app-open) main .card a{
  background:rgba(255,255,255,.10)!important;color:#fff!important;border:1px solid rgba(255,255,255,.24)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.10)!important;
}
body:not(.app-open) main .btn:hover,
body:not(.app-open) main .card a:hover{background:rgba(255,255,255,.16)!important;filter:none!important;}
body:not(.app-open) .rw-v2-contact{margin-top:48px!important;}
body:not(.app-open) .privacy-footer,
body:not(.app-open) footer{position:relative!important;z-index:3!important;color:rgba(234,246,255,.78)!important;background:rgba(5,10,18,.38)!important;border-top:1px solid rgba(255,255,255,.16)!important;backdrop-filter:blur(14px)!important;}
body:not(.app-open) [data-rw-hide-home-agent],
body:not(.app-open) [class*="voice" i],
body:not(.app-open) [id*="voice" i],
body:not(.app-open) [class*="agent" i],
body:not(.app-open) [id*="agent" i]{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;}
@media (max-width:1040px){
  body:not(.app-open) main .grid,body:not(.app-open) main.wrap .grid{grid-template-columns:repeat(2,minmax(260px,1fr))!important;}
}
@media (max-width:720px){
  body:not(.app-open) .rw-header,body:not(.app-open)>header{top:12px!important;width:calc(100vw - 28px)!important;max-width:calc(100vw - 28px)!important;}
  body:not(.app-open) .rw-brand,body:not(.app-open) .rw-title{max-width:calc(100vw - 188px)!important;}
  body:not(.app-open) main,body:not(.app-open) main.wrap{width:calc(100vw - 28px)!important;max-width:calc(100vw - 28px)!important;padding-top:94px!important;}
  body:not(.app-open) .rw-full-page-bg{object-position:60% center!important;transform:scale(1.12)!important;}
  body:not(.app-open) main .grid,body:not(.app-open) main.wrap .grid{grid-template-columns:1fr!important;}
}
@media (max-width:560px){
  body:not(.app-open) .rw-header,body:not(.app-open)>header{width:calc(100vw - 16px)!important;max-width:calc(100vw - 16px)!important;}
  body:not(.app-open) .rw-brand,body:not(.app-open) .rw-title{max-width:calc(100vw - 150px)!important;padding:8px 10px!important;font-size:12px!important;}
  body:not(.app-open) .rw-lang-btn{min-width:36px!important;height:30px!important;padding:0 7px!important;font-size:11px!important;}
  body:not(.app-open) main,body:not(.app-open) main.wrap{width:calc(100vw - 18px)!important;max-width:calc(100vw - 18px)!important;padding-top:84px!important;}
  body:not(.app-open) .rw-full-page-bg{object-position:64% center!important;transform:scale(1.15)!important;}
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
  function installFullPageBackground(){
    if(!document.body) return;
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
  function hideHomeVoiceAgent(){
    if(!document.body || document.body.classList.contains('app-open')) return;
    var phrases=['Agent Głosowy Platformy','Asystent głosowy platformy','Start nasłuchu','Test głosu','Wydaj polecenie','Przestań mówić'];
    var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    var nodes=[];
    while(walker.nextNode()){
      var txt=(walker.currentNode.nodeValue||'').trim();
      if(phrases.some(function(p){return txt.indexOf(p)>-1;})) nodes.push(walker.currentNode);
    }
    nodes.forEach(function(node){
      var el=node.parentElement;
      var candidate=el;
      for(var i=0;i<8 && el && el!==document.body;i++,el=el.parentElement){
        var text=el.textContent||'';
        if(text.indexOf('Agent Głosowy Platformy')>-1 || text.indexOf('Asystent głosowy platformy')>-1 || text.indexOf('Start nasłuchu')>-1){candidate=el;}
      }
      if(candidate && candidate!==document.body) candidate.setAttribute('data-rw-hide-home-agent','true');
    });
  }
  function applyAll(){applyStyle();installFullPageBackground();removeHeroCopy();hideHomeVoiceAgent();}
  applyAll();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',applyAll,{once:true});
  window.addEventListener('load',applyAll,{once:true});
  window.setTimeout(applyAll,300);
  window.setTimeout(applyAll,1200);
  window.setTimeout(applyAll,2500);
})();