window.RW_CONTACT_ENDPOINT = '';
(function installRafalWorkshopHeroV3(){
  'use strict';

  var HERO_URL = 'assets/images/private-command-center-hero-ai-assistant.webp?v=20260714-v3-2';
  var SOURCE = {
    width:1704,
    height:923,
    face:{cx:446.25,cy:507.78,rx:393.36,ry:578.47},
    left:{x:234.69,y:382.17,w:196.68,h:87.60},
    right:{x:547.06,y:408.61,w:157.01,h:80.99}
  };
  var state = {resizeFrame:0,blinkTimer:0};

  var css = `
body.rw-v2-ready{
  --rw-home-bg:url("${HERO_URL}")!important;
}
body.rw-v2-ready.rw-v2-phase-dawn,
body.rw-v2-ready.rw-v2-phase-morning,
body.rw-v2-ready.rw-v2-phase-day,
body.rw-v2-ready.rw-v2-phase-afternoon,
body.rw-v2-ready.rw-v2-phase-sunset,
body.rw-v2-ready.rw-v2-phase-night{
  --rw-home-bg:url("${HERO_URL}")!important;
}
body.rw-v2-ready:not(.app-open),
body.rw-v2-ready:not(.app-open) .rw-v2-shell{
  background-image:var(--rw-home-bg)!important;
  background-position:center center!important;
  background-size:cover!important;
  image-rendering:auto!important;
}
body.rw-v2-ready:not(.app-open) .rw-v2-shell{
  isolation:isolate!important;
}
body.rw-v2-ready:not(.app-open) .rw-v2-assistant-blink,
body.rw-v2-ready:not(.app-open) .rw-v2-assistant-eye-blink{
  display:none!important;visibility:hidden!important;opacity:0!important;
}
body.rw-v2-ready:not(.app-open) .rw-v3-face-rig{
  position:absolute!important;inset:0!important;width:100%!important;height:100%!important;z-index:18!important;
  overflow:hidden!important;pointer-events:none!important;contain:layout paint style!important;
  --rw-v3-face-cx:25%;--rw-v3-face-cy:52%;--rw-v3-face-rx:24%;--rw-v3-face-ry:64%;
}
body.rw-v2-ready.app-open .rw-v3-face-rig{display:none!important;}
body.rw-v2-ready:not(.app-open) .rw-v3-face-occlusion,
body.rw-v2-ready:not(.app-open) .rw-v3-face-plate{
  position:absolute!important;inset:0!important;width:100%!important;height:100%!important;
  background:url("${HERO_URL}") center center/cover no-repeat!important;
  -webkit-mask-image:radial-gradient(ellipse var(--rw-v3-face-rx) var(--rw-v3-face-ry) at var(--rw-v3-face-cx) var(--rw-v3-face-cy),#000 0 70%,rgba(0,0,0,.95) 78%,rgba(0,0,0,.45) 88%,transparent 100%)!important;
  mask-image:radial-gradient(ellipse var(--rw-v3-face-rx) var(--rw-v3-face-ry) at var(--rw-v3-face-cx) var(--rw-v3-face-cy),#000 0 70%,rgba(0,0,0,.95) 78%,rgba(0,0,0,.45) 88%,transparent 100%)!important;
}
body.rw-v2-ready:not(.app-open) .rw-v3-face-occlusion{
  z-index:1!important;opacity:.88!important;filter:blur(5px) brightness(.56) saturate(.86)!important;transform:scale(1.012)!important;
}
body.rw-v2-ready:not(.app-open) .rw-v3-face-plate{
  z-index:2!important;transform-origin:var(--rw-v3-face-cx) var(--rw-v3-face-cy)!important;
  filter:drop-shadow(0 18px 34px rgba(0,0,0,.32)) drop-shadow(0 0 16px rgba(70,190,255,.16))!important;
  animation:rwV3FaceFloat 13.8s cubic-bezier(.45,.05,.55,.95) infinite!important;
  will-change:transform!important;backface-visibility:hidden!important;
}
body.rw-v2-ready:not(.app-open) .rw-v3-eye{
  position:absolute!important;overflow:hidden!important;transform-origin:center!important;border-radius:52% 52% 46% 46%!important;
  filter:drop-shadow(0 0 4px rgba(80,210,255,.18))!important;
}
body.rw-v2-ready:not(.app-open) .rw-v3-eye-left{
  left:var(--rw-v3-left-x)!important;top:var(--rw-v3-left-y)!important;width:var(--rw-v3-left-w)!important;height:var(--rw-v3-left-h)!important;transform:rotate(-2deg)!important;
}
body.rw-v2-ready:not(.app-open) .rw-v3-eye-right{
  left:var(--rw-v3-right-x)!important;top:var(--rw-v3-right-y)!important;width:var(--rw-v3-right-w)!important;height:var(--rw-v3-right-h)!important;transform:rotate(4deg)!important;
}
body.rw-v2-ready:not(.app-open) .rw-v3-lid{
  position:absolute!important;left:-8%!important;width:116%!important;pointer-events:none!important;
  background:url("${HERO_URL}") no-repeat!important;background-size:var(--rw-v3-bg-w) var(--rw-v3-bg-h)!important;
  filter:brightness(.90) contrast(1.08) saturate(.96)!important;will-change:transform!important;backface-visibility:hidden!important;
}
body.rw-v2-ready:not(.app-open) .rw-v3-lid-upper{
  top:-10%!important;height:80%!important;border-radius:0 0 54% 54%/0 0 88% 88%!important;
  box-shadow:inset 0 -1px 0 rgba(119,218,255,.45),0 5px 8px rgba(0,0,0,.20)!important;
  transform:translate3d(0,-105%,0)!important;
}
body.rw-v2-ready:not(.app-open) .rw-v3-lid-lower{
  bottom:-8%!important;height:42%!important;border-radius:54% 54% 0 0/88% 88% 0 0!important;
  box-shadow:inset 0 1px 0 rgba(98,205,255,.34),0 -3px 7px rgba(0,0,0,.18)!important;
  transform:translate3d(0,105%,0)!important;
}
body.rw-v2-ready:not(.app-open) .rw-v3-lid::after{
  content:""!important;position:absolute!important;inset:0!important;
  background:repeating-linear-gradient(90deg,transparent 0 10px,rgba(103,205,235,.09) 11px 12px),repeating-linear-gradient(0deg,transparent 0 8px,rgba(103,205,235,.06) 9px 10px)!important;
  mix-blend-mode:screen!important;opacity:.45!important;
}
body.rw-v2-ready:not(.app-open) .rw-v3-eye-crease{
  position:absolute!important;left:7%!important;right:7%!important;top:67%!important;height:1.5px!important;border-radius:999px!important;
  background:linear-gradient(90deg,transparent,rgba(122,226,255,.70),transparent)!important;box-shadow:0 0 6px rgba(80,205,255,.32)!important;
  opacity:0!important;transform:scaleX(.72)!important;will-change:opacity,transform!important;
}
body:not(.app-open) [data-rw-hide-home-agent],
body:not(.app-open) [class*="voice" i],
body:not(.app-open) [id*="voice" i],
body:not(.app-open) [class*="agent" i],
body:not(.app-open) [id*="agent" i]{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;}
@keyframes rwV3FaceFloat{
  0%,100%{transform:perspective(1600px) translate3d(-1px,5px,0) rotateY(-.7deg) rotateZ(-.15deg) scale(1.001);}
  50%{transform:perspective(1600px) translate3d(2px,-7px,0) rotateY(1.1deg) rotateZ(.18deg) scale(1.004);}
}
@media (prefers-reduced-motion:reduce){
  body.rw-v2-ready:not(.app-open) .rw-v3-face-plate{animation:none!important;transform:none!important;}
}
@media (max-width:720px){
  body.rw-v2-ready:not(.app-open) .rw-v3-face-plate{animation-duration:16s!important;}
}
  `;

  function applyStyle(){
    var style=document.getElementById('rw-workshop-hero-v3');
    if(!style){style=document.createElement('style');style.id='rw-workshop-hero-v3';document.head.appendChild(style);}
    style.textContent=css;
  }

  function eyeMarkup(side){
    return '<div class="rw-v3-eye rw-v3-eye-'+side+'"><span class="rw-v3-lid rw-v3-lid-upper"></span><span class="rw-v3-lid rw-v3-lid-lower"></span><span class="rw-v3-eye-crease"></span></div>';
  }

  function installRig(){
    var shell=document.querySelector('.rw-v2-shell');
    if(!shell)return null;
    var rig=shell.querySelector('.rw-v3-face-rig');
    if(!rig){
      rig=document.createElement('div');rig.className='rw-v3-face-rig';rig.setAttribute('aria-hidden','true');
      rig.innerHTML='<div class="rw-v3-face-occlusion"></div><div class="rw-v3-face-plate">'+eyeMarkup('left')+eyeMarkup('right')+'</div>';
      shell.appendChild(rig);
    }
    layoutRig(rig);startBlink(rig);return rig;
  }

  function layoutRig(rig){
    if(!rig)return;
    var rect=rig.getBoundingClientRect();
    var width=rect.width||window.innerWidth||1,height=rect.height||window.innerHeight||1;
    var scale=Math.max(width/SOURCE.width,height/SOURCE.height);
    var bgW=SOURCE.width*scale,bgH=SOURCE.height*scale;
    var ox=(width-bgW)/2,oy=(height-bgH)/2;
    var px=function(v){return v.toFixed(2)+'px';};
    rig.style.setProperty('--rw-v3-face-cx',px(ox+SOURCE.face.cx*scale));
    rig.style.setProperty('--rw-v3-face-cy',px(oy+SOURCE.face.cy*scale));
    rig.style.setProperty('--rw-v3-face-rx',px(SOURCE.face.rx*scale));
    rig.style.setProperty('--rw-v3-face-ry',px(SOURCE.face.ry*scale));
    rig.style.setProperty('--rw-v3-bg-w',px(bgW));
    rig.style.setProperty('--rw-v3-bg-h',px(bgH));
    positionEye(rig,'left',SOURCE.left,scale,ox,oy);
    positionEye(rig,'right',SOURCE.right,scale,ox,oy);
  }

  function positionEye(rig,side,data,scale,ox,oy){
    var eye=rig.querySelector('.rw-v3-eye-'+side);if(!eye)return;
    var x=ox+data.x*scale,y=oy+data.y*scale,w=data.w*scale,h=data.h*scale;
    var prefix='--rw-v3-'+side+'-';
    rig.style.setProperty(prefix+'x',x.toFixed(2)+'px');rig.style.setProperty(prefix+'y',y.toFixed(2)+'px');
    rig.style.setProperty(prefix+'w',w.toFixed(2)+'px');rig.style.setProperty(prefix+'h',h.toFixed(2)+'px');
    var lidLeft=x-w*.08,upperTop=y-h*.10,lowerTop=y+h*(1-.42+.08);
    var upper=eye.querySelector('.rw-v3-lid-upper'),lower=eye.querySelector('.rw-v3-lid-lower');
    if(upper)upper.style.backgroundPosition=(ox-lidLeft).toFixed(2)+'px '+(oy-upperTop+h*.36).toFixed(2)+'px';
    if(lower)lower.style.backgroundPosition=(ox-lidLeft).toFixed(2)+'px '+(oy-lowerTop-h*.28).toFixed(2)+'px';
  }

  function setEye(eye,p){
    if(!eye)return;p=Math.max(0,Math.min(1,p));
    var upper=eye.querySelector('.rw-v3-lid-upper'),lower=eye.querySelector('.rw-v3-lid-lower'),crease=eye.querySelector('.rw-v3-eye-crease');
    var up=Math.pow(p,.88),low=Math.pow(p,1.18);
    if(upper)upper.style.setProperty('transform','translate3d(0,'+(-105+up*102).toFixed(2)+'%,0)','important');
    if(lower)lower.style.setProperty('transform','translate3d(0,'+(105-low*100).toFixed(2)+'%,0)','important');
    if(crease){var line=Math.max(0,Math.min(1,(p-.70)/.30));crease.style.setProperty('opacity',(.72*line).toFixed(3),'important');crease.style.setProperty('transform','scaleX('+(.72+line*.28).toFixed(3)+')','important');}
  }

  function setBlink(rig,left,right){
    setEye(rig.querySelector('.rw-v3-eye-left'),left);setEye(rig.querySelector('.rw-v3-eye-right'),right==null?left:right);
  }

  function blinkProgress(elapsed,duration,delay){
    var t=Math.max(0,elapsed-delay),close=duration*.36,hold=duration*.075,open=duration-close-hold;
    if(t<=0)return 0;if(t<close){var c=t/close;return 1-Math.pow(1-c,3);}if(t<close+hold)return 1;
    if(t<duration){var o=(t-close-hold)/open,e=o*o*(3-2*o);return 1-e;}return 0;
  }

  function animateBlink(rig,duration,done){
    var start=performance.now();
    function frame(now){var elapsed=now-start;setBlink(rig,blinkProgress(elapsed,duration,0),blinkProgress(elapsed,duration,24));
      if(elapsed<duration+26)requestAnimationFrame(frame);else{setBlink(rig,0,0);if(done)done();}}
    requestAnimationFrame(frame);
  }

  function startBlink(rig){
    if(!rig||rig.dataset.rwV3BlinkActive==='true')return;rig.dataset.rwV3BlinkActive='true';setBlink(rig,0,0);
    if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    function schedule(delay){clearTimeout(state.blinkTimer);state.blinkTimer=setTimeout(run,delay);}
    function run(){
      if(document.hidden||document.body.classList.contains('app-open')){schedule(2400);return;}
      var duration=1900+Math.random()*420;
      animateBlink(rig,duration,function(){if(Math.random()<.045)setTimeout(function(){animateBlink(rig,1550+Math.random()*220);},820+Math.random()*360);});
      schedule(6900+Math.random()*6500);
    }
    schedule(4600+Math.random()*3000);
  }

  function hideLegacyHomeElements(){
    document.querySelectorAll('.rw-full-page-bg,.rw-full-page-bg-shade').forEach(function(el){el.remove();});
    document.querySelectorAll('.rw-v2-hero h1,.rw-v2-hero h2,.rw-v2-hero p,.rw-v2-hero .rw-v2-copy,.rw-v2-hero .rw-v2-title,.rw-v2-hero .rw-v2-subtitle').forEach(function(el){el.remove();});
    if(!document.body||document.body.classList.contains('app-open'))return;
    var phrases=['Agent Głosowy Platformy','Asystent głosowy platformy','Start nasłuchu','Test głosu','Wydaj polecenie','Przestań mówić'];
    var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),nodes=[];
    while(walker.nextNode()){var txt=(walker.currentNode.nodeValue||'').trim();if(phrases.some(function(p){return txt.indexOf(p)>-1;}))nodes.push(walker.currentNode);}
    nodes.forEach(function(node){var el=node.parentElement,candidate=el;for(var i=0;i<8&&el&&el!==document.body;i++,el=el.parentElement){var text=el.textContent||'';if(text.indexOf('Agent Głosowy Platformy')>-1||text.indexOf('Asystent głosowy platformy')>-1||text.indexOf('Start nasłuchu')>-1)candidate=el;}if(candidate&&candidate!==document.body)candidate.setAttribute('data-rw-hide-home-agent','true');});
  }

  function install(){applyStyle();hideLegacyHomeElements();installRig();}
  function requestLayout(){if(state.resizeFrame)cancelAnimationFrame(state.resizeFrame);state.resizeFrame=requestAnimationFrame(function(){state.resizeFrame=0;layoutRig(document.querySelector('.rw-v3-face-rig'));});}

  applyStyle();install();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  window.addEventListener('load',install,{once:true});window.addEventListener('resize',requestLayout,{passive:true});window.addEventListener('orientationchange',requestLayout,{passive:true});
  var observer=new MutationObserver(function(){if(!document.querySelector('.rw-v3-face-rig'))install();});
  if(document.documentElement)observer.observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(install,250);setTimeout(install,900);setTimeout(install,1800);setTimeout(install,3200);
})();
