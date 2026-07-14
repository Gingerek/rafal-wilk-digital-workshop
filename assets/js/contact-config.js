window.RW_CONTACT_ENDPOINT = '';
(function installRafalWorkshopHeroV4(){
  'use strict';

  var HERO_URL = 'assets/images/private-command-center-hero-ai-assistant.webp?v=20260714-v4-1';
  var CLOSED_URL = 'assets/images/private-command-center-hero-eye-blink-overlay.png?v=20260714-v4-1';
  var SOURCE = {
    width:1704,
    height:923,
    face:{cx:446.25,cy:507.78,rx:393.36,ry:578.47},
    left:{x:234.69,y:382.17,w:196.68,h:87.60,rotate:-2},
    right:{x:547.06,y:408.61,w:157.01,h:80.99,rotate:4}
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
body.rw-v2-ready:not(.app-open) .rw-v2-shell{isolation:isolate!important;}
body.rw-v2-ready:not(.app-open) .rw-v2-assistant-blink,
body.rw-v2-ready:not(.app-open) .rw-v2-assistant-eye-blink{
  display:none!important;visibility:hidden!important;opacity:0!important;
}
body.rw-v2-ready:not(.app-open) .rw-v4-face-rig{
  position:absolute!important;inset:0!important;width:100%!important;height:100%!important;z-index:18!important;
  overflow:hidden!important;pointer-events:none!important;contain:layout paint style!important;
  --rw-v4-face-cx:25%;--rw-v4-face-cy:52%;--rw-v4-face-rx:24%;--rw-v4-face-ry:64%;
}
body.rw-v2-ready.app-open .rw-v4-face-rig{display:none!important;}
body.rw-v2-ready:not(.app-open) .rw-v4-face-occlusion,
body.rw-v2-ready:not(.app-open) .rw-v4-face-plate{
  position:absolute!important;inset:0!important;width:100%!important;height:100%!important;
  background:url("${HERO_URL}") center center/cover no-repeat!important;
  -webkit-mask-image:radial-gradient(ellipse var(--rw-v4-face-rx) var(--rw-v4-face-ry) at var(--rw-v4-face-cx) var(--rw-v4-face-cy),#000 0 70%,rgba(0,0,0,.95) 78%,rgba(0,0,0,.45) 88%,transparent 100%)!important;
  mask-image:radial-gradient(ellipse var(--rw-v4-face-rx) var(--rw-v4-face-ry) at var(--rw-v4-face-cx) var(--rw-v4-face-cy),#000 0 70%,rgba(0,0,0,.95) 78%,rgba(0,0,0,.45) 88%,transparent 100%)!important;
}
body.rw-v2-ready:not(.app-open) .rw-v4-face-occlusion{
  z-index:1!important;opacity:.90!important;filter:blur(5px) brightness(.56) saturate(.86)!important;transform:scale(1.012)!important;
}
body.rw-v2-ready:not(.app-open) .rw-v4-face-plate{
  z-index:2!important;transform-origin:var(--rw-v4-face-cx) var(--rw-v4-face-cy)!important;
  filter:drop-shadow(0 18px 34px rgba(0,0,0,.32)) drop-shadow(0 0 16px rgba(70,190,255,.16))!important;
  animation:rwV4FaceFloat 14.8s cubic-bezier(.45,.05,.55,.95) infinite!important;
  will-change:transform!important;backface-visibility:hidden!important;
}
body.rw-v2-ready:not(.app-open) .rw-v4-eye{
  position:absolute!important;overflow:hidden!important;transform-origin:center!important;
  border-radius:53% 53% 47% 47%/58% 58% 42% 42%!important;
  background:rgba(3,20,32,.98)!important;
  box-shadow:inset 0 0 8px rgba(2,8,14,.55),0 0 5px rgba(80,210,255,.12)!important;
  isolation:isolate!important;
}
body.rw-v2-ready:not(.app-open) .rw-v4-eye-left{
  left:var(--rw-v4-left-x)!important;top:var(--rw-v4-left-y)!important;width:var(--rw-v4-left-w)!important;height:var(--rw-v4-left-h)!important;transform:rotate(-2deg)!important;
}
body.rw-v2-ready:not(.app-open) .rw-v4-eye-right{
  left:var(--rw-v4-right-x)!important;top:var(--rw-v4-right-y)!important;width:var(--rw-v4-right-w)!important;height:var(--rw-v4-right-h)!important;transform:rotate(4deg)!important;
}
body.rw-v2-ready:not(.app-open) .rw-v4-eye-layer{
  position:absolute!important;inset:-10%!important;width:120%!important;height:120%!important;
  background-repeat:no-repeat!important;background-size:var(--rw-v4-bg-w) var(--rw-v4-bg-h)!important;
  transform-origin:50% 49%!important;backface-visibility:hidden!important;will-change:transform,opacity!important;
}
body.rw-v2-ready:not(.app-open) .rw-v4-eye-closed{
  z-index:1!important;background-image:url("${CLOSED_URL}")!important;
  opacity:0!important;transform:translate3d(0,0,0) scaleY(.94)!important;
  filter:brightness(.92) contrast(1.06) saturate(.88)!important;
}
body.rw-v2-ready:not(.app-open) .rw-v4-eye-open{
  z-index:2!important;background-image:url("${HERO_URL}")!important;
  opacity:1!important;transform:translate3d(0,0,0) scaleY(1)!important;
  filter:brightness(1.01) contrast(1.02) saturate(1.02)!important;
}
body.rw-v2-ready:not(.app-open) .rw-v4-eye-crease{
  position:absolute!important;left:8%!important;right:8%!important;top:51%!important;height:2px!important;z-index:3!important;
  border-radius:999px!important;background:linear-gradient(90deg,transparent,rgba(142,228,255,.82),transparent)!important;
  box-shadow:0 0 7px rgba(80,205,255,.40),0 1px 4px rgba(0,0,0,.46)!important;
  opacity:0!important;transform:scaleX(.72)!important;will-change:opacity,transform!important;
}
body:not(.app-open) [data-rw-hide-home-agent],
body:not(.app-open) [class*="voice" i],
body:not(.app-open) [id*="voice" i],
body:not(.app-open) [class*="agent" i],
body:not(.app-open) [id*="agent" i]{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;}
@keyframes rwV4FaceFloat{
  0%,100%{transform:perspective(1700px) translate3d(-1px,5px,0) rotateY(-.65deg) rotateX(.12deg) rotateZ(-.12deg) scale(1.001);}
  50%{transform:perspective(1700px) translate3d(2px,-8px,0) rotateY(1.05deg) rotateX(-.10deg) rotateZ(.16deg) scale(1.004);}
}
@media (prefers-reduced-motion:reduce){
  body.rw-v2-ready:not(.app-open) .rw-v4-face-plate{animation-duration:24s!important;}
}
@media (max-width:720px){
  body.rw-v2-ready:not(.app-open) .rw-v4-face-plate{animation-duration:18s!important;}
}
  `;

  function applyStyle(){
    var old=document.getElementById('rw-workshop-hero-v3');if(old)old.remove();
    var style=document.getElementById('rw-workshop-hero-v4');
    if(!style){style=document.createElement('style');style.id='rw-workshop-hero-v4';document.head.appendChild(style);}
    style.textContent=css;
  }

  function eyeMarkup(side){
    return '<div class="rw-v4-eye rw-v4-eye-'+side+'"><span class="rw-v4-eye-layer rw-v4-eye-closed"></span><span class="rw-v4-eye-layer rw-v4-eye-open"></span><span class="rw-v4-eye-crease"></span></div>';
  }

  function installRig(){
    var shell=document.querySelector('.rw-v2-shell');
    if(!shell)return null;
    shell.querySelectorAll('.rw-v3-face-rig').forEach(function(el){el.remove();});
    var rig=shell.querySelector('.rw-v4-face-rig');
    if(!rig){
      rig=document.createElement('div');rig.className='rw-v4-face-rig';rig.setAttribute('aria-hidden','true');
      rig.innerHTML='<div class="rw-v4-face-occlusion"></div><div class="rw-v4-face-plate">'+eyeMarkup('left')+eyeMarkup('right')+'</div>';
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
    rig.style.setProperty('--rw-v4-face-cx',px(ox+SOURCE.face.cx*scale));
    rig.style.setProperty('--rw-v4-face-cy',px(oy+SOURCE.face.cy*scale));
    rig.style.setProperty('--rw-v4-face-rx',px(SOURCE.face.rx*scale));
    rig.style.setProperty('--rw-v4-face-ry',px(SOURCE.face.ry*scale));
    rig.style.setProperty('--rw-v4-bg-w',px(bgW));
    rig.style.setProperty('--rw-v4-bg-h',px(bgH));
    positionEye(rig,'left',SOURCE.left,scale,ox,oy);
    positionEye(rig,'right',SOURCE.right,scale,ox,oy);
  }

  function positionEye(rig,side,data,scale,ox,oy){
    var eye=rig.querySelector('.rw-v4-eye-'+side);if(!eye)return;
    var x=ox+data.x*scale,y=oy+data.y*scale,w=data.w*scale,h=data.h*scale;
    var prefix='--rw-v4-'+side+'-';
    rig.style.setProperty(prefix+'x',x.toFixed(2)+'px');rig.style.setProperty(prefix+'y',y.toFixed(2)+'px');
    rig.style.setProperty(prefix+'w',w.toFixed(2)+'px');rig.style.setProperty(prefix+'h',h.toFixed(2)+'px');
    var layerLeft=x-w*.10,layerTop=y-h*.10;
    eye.querySelectorAll('.rw-v4-eye-layer').forEach(function(layer){
      layer.style.backgroundPosition=(ox-layerLeft).toFixed(2)+'px '+(oy-layerTop).toFixed(2)+'px';
    });
  }

  function smoothStep(t){t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);}

  function setEye(eye,p){
    if(!eye)return;p=Math.max(0,Math.min(1,p));
    var open=eye.querySelector('.rw-v4-eye-open');
    var closed=eye.querySelector('.rw-v4-eye-closed');
    var crease=eye.querySelector('.rw-v4-eye-crease');
    var close=smoothStep(p);
    var scaleY=Math.max(.035,1-close*.965);
    if(open){
      open.style.setProperty('transform','translate3d(0,'+(close*2.8).toFixed(2)+'%,0) scaleY('+scaleY.toFixed(4)+')','important');
      open.style.setProperty('opacity',(1-close*.22).toFixed(3),'important');
    }
    if(closed){
      closed.style.setProperty('opacity',smoothStep((p-.08)/.92).toFixed(3),'important');
      closed.style.setProperty('transform','translate3d(0,'+((1-close)*-.8).toFixed(2)+'%,0) scaleY('+(0.88+close*.12).toFixed(4)+')','important');
    }
    if(crease){
      var line=smoothStep((p-.60)/.40);
      crease.style.setProperty('opacity',(.80*line).toFixed(3),'important');
      crease.style.setProperty('transform','scaleX('+(.72+line*.28).toFixed(3)+')','important');
    }
  }

  function setBlink(rig,left,right){
    setEye(rig.querySelector('.rw-v4-eye-left'),left);
    setEye(rig.querySelector('.rw-v4-eye-right'),right==null?left:right);
  }

  function blinkProgress(elapsed,duration,delay){
    var t=elapsed-delay;if(t<=0)return 0;
    var close=duration*.41,hold=duration*.10,open=duration-close-hold;
    if(t<close){var c=t/close;return 1-Math.pow(1-c,3.2);}
    if(t<close+hold)return 1;
    if(t<duration){var o=(t-close-hold)/open;return 1-smoothStep(o);}
    return 0;
  }

  function animateBlink(rig,duration,done){
    var start=performance.now();
    function frame(now){
      var elapsed=now-start;
      setBlink(rig,blinkProgress(elapsed,duration,0),blinkProgress(elapsed,duration,34));
      if(elapsed<duration+40){requestAnimationFrame(frame);}else{setBlink(rig,0,0);if(done)done();}
    }
    requestAnimationFrame(frame);
  }

  function startBlink(rig){
    if(!rig||rig.dataset.rwV4BlinkActive==='true')return;
    rig.dataset.rwV4BlinkActive='true';setBlink(rig,0,0);
    function schedule(delay){clearTimeout(state.blinkTimer);state.blinkTimer=setTimeout(run,delay);}
    function run(){
      if(document.hidden||document.body.classList.contains('app-open')){schedule(1800);return;}
      var duration=1650+Math.random()*350;
      animateBlink(rig,duration,function(){
        if(Math.random()<.06)setTimeout(function(){animateBlink(rig,1350+Math.random()*220);},620+Math.random()*280);
      });
      schedule(6500+Math.random()*5200);
    }
    setTimeout(function(){if(!document.hidden&&!document.body.classList.contains('app-open'))animateBlink(rig,1800);},900);
    schedule(6200+Math.random()*1800);
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
  function requestLayout(){if(state.resizeFrame)cancelAnimationFrame(state.resizeFrame);state.resizeFrame=requestAnimationFrame(function(){state.resizeFrame=0;layoutRig(document.querySelector('.rw-v4-face-rig'));});}

  applyStyle();install();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  window.addEventListener('load',install,{once:true});window.addEventListener('resize',requestLayout,{passive:true});window.addEventListener('orientationchange',requestLayout,{passive:true});
  var observer=new MutationObserver(function(){if(!document.querySelector('.rw-v4-face-rig'))install();});
  if(document.documentElement)observer.observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(install,250);setTimeout(install,900);setTimeout(install,1800);setTimeout(install,3200);
})();