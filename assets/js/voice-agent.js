(function(){
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));

  const KEY_NAME='rwOpenAIKey';
  const PROVIDER_NAME='rwAIProvider';
  const MEM_KEY='rwVoiceCommandMemoryV4';
  const FACTS_KEY='rwVoiceAgentUserFactsV1';
  const LANG_KEY='rwAgentLangV4';
  let recog=null, listening=false, currentAudio=null, rwAudioCtx=null, saveLedTimer=null;
  let lastUiLang='pl-PL', lastModuleTitle='';
  let dragging=false, dx=0, dy=0;

  const langShort={ 'pl-PL':'pl', 'nl-NL':'nl', 'en-US':'en' };
  const langFull={ pl:'pl-PL', nl:'nl-NL', en:'en-US' };

  const UI={
    'pl-PL':{
      title:'Agent Głosowy Platformy', subtitle:'Asystent głosowy platformy', ready:'Gotowy',
      hint:'Wydaj polecenie albo wpisz je poniżej.', listen:'Start nasłuchu', stop:'Stop nasłuchu',
      test:'Test głosu', stopSpeech:'Przestań mówić', send:'Wyślij', refresh:'Odśwież', autoLang:'Język rozpoznawany automatycznie', input:'np. przeanalizuj CV albo policz bill rate dla pay rate 24 i GS',
      apiTitle:'Klucz API do internetu i naturalnego polskiego głosu', apiPlaceholder:'wklej klucz API', activate:'Aktywuj',
      apiSmall:'Po poprawnej aktywacji to okno zniknie. Klucz jest zapisany lokalnie w tej przeglądarce.',
      small:'',
      apiActive:'API aktywny. Polski głos premium i odpowiedzi online są włączone.', apiMissing:'Wklej klucz API, żeby uruchomić głos premium i internet agenta.', noApiForInternet:'Wpisz klucz OpenAI API w małym oknie AI API na platformie, żeby agent mógł korzystać z internetu.', apiError:'Błąd API: ', apiConnectionError:'Nie mogę połączyć się z OpenAI API: ', noAiText:'Nie otrzymałem odpowiedzi z AI.',
      system:'System', you:'Ty', agent:'Agent', module:'Moduł', listening:'Słucham', thinking:'Analizuję', speaking:'Mówię', saved:'Zapamiętałem polecenie.',
      noModule:'Nie widzę aktywnego modułu.', unknown:'Rozumiem polecenie, ale ten moduł nie ma jeszcze przypisanej takiej akcji.',
      voiceTest:'To jest test płynnego, naturalnego głosu polskiego. Agent mówi spokojnie, wyraźnie i bez robotycznego rytmu.',
      blocked:'Przeglądarka zablokowała syntezę mowy. Kliknij Test głosu po otwarciu panelu.', langNames:{'pl-PL':'Polski','nl-NL':'Nederlands','en-US':'English'}
    },
    'nl-NL':{
      title:'Spraakagent van het platform', subtitle:'Stemassistent van het platform', ready:'Klaar',
      hint:'Geef een opdracht of typ die hieronder.', listen:'Start luisteren', stop:'Stop luisteren',
      test:'Stemtest', stopSpeech:'Stop met spreken', send:'Verstuur', refresh:'Vernieuw', autoLang:'Taal wordt automatisch herkend', input:'bijv. analyseer CV of bereken bill rate voor pay rate 24 en GS',
      apiTitle:'API-sleutel voor internet en natuurlijke premium stem', apiPlaceholder:'plak API-sleutel', activate:'Activeren',
      apiSmall:'Na correcte activatie verdwijnt dit venster. De sleutel wordt lokaal in deze browser opgeslagen.',
      small:'In een module heeft de moduletaal voorrang. Buiten modules antwoordt de agent in de taal van de vraag. Zonder API-sleutel gebruikt hij de beste Windows/Edge-stem.',
      apiActive:'API actief. Premium stem en online antwoorden zijn ingeschakeld.', apiMissing:'Plak de API-sleutel om premium stem en internetagent te activeren.', noApiForInternet:'Voer de OpenAI API-sleutel in het kleine AI API-venster op het platform in, zodat de agent internet kan gebruiken.', apiError:'API-fout: ', apiConnectionError:'Ik kan geen verbinding maken met de OpenAI API: ', noAiText:'Ik heb geen AI-antwoord ontvangen.',
      system:'Systeem', you:'Jij', agent:'Agent', module:'Module', listening:'Ik luister', thinking:'Ik analyseer', speaking:'Ik spreek', saved:'Commando opgeslagen.',
      noModule:'Ik zie geen actieve module.', unknown:'Ik begrijp het commando, maar deze module heeft nog geen actie voor die tekst.',
      voiceTest:'Dit is een test van een vloeiende, natuurlijke Nederlandse stem. De agent spreekt rustig, duidelijk en zonder robotisch ritme.',
      blocked:'De browser heeft spraaksynthese geblokkeerd. Klik na het openen van het paneel op Stemtest.', langNames:{'pl-PL':'Polski','nl-NL':'Nederlands','en-US':'English'}
    },
    'en-US':{
      title:'Platform Voice Agent', subtitle:'Futuristic command, voice and calculation module', ready:'Ready',
      hint:'Language and commands automatically follow the active module.', listen:'🎙️ Start listening', stop:'■ Stop listening',
      test:'🔊 Voice test', send:'Send', refresh:'Refresh', input:'e.g. analyze CV or calculate bill rate for pay rate 24 and GS',
      apiTitle:'API key for internet access and premium natural voice', apiPlaceholder:'paste API key', activate:'Activate',
      apiSmall:'After successful activation this box will disappear. The key is stored locally in this browser.',
      small:'Inside a module, the module language has priority. Outside modules, the agent answers in the question language. Without an API key it uses the best Windows/Edge voice.',
      apiActive:'API active. Premium voice and online answers are enabled.', apiMissing:'Paste the API key to enable premium voice and internet agent.', noApiForInternet:'Enter the OpenAI API key in the small AI API window on the platform so the agent can use the internet.', apiError:'API error: ', apiConnectionError:'I cannot connect to the OpenAI API: ', noAiText:'I did not receive an AI response.',
      system:'System', you:'You', agent:'Agent', module:'Module', listening:'Listening', thinking:'Thinking', speaking:'Speaking', saved:'Command saved.',
      noModule:'I cannot see an active module.', unknown:'I understand the command, but this module does not yet have an action for that text.',
      voiceTest:'This is a test of a fluent, natural English voice. The agent speaks calmly, clearly and without a robotic rhythm.',
      blocked:'The browser blocked speech synthesis. Click Voice test after opening the panel.', langNames:{'pl-PL':'Polski','nl-NL':'Nederlands','en-US':'English'}
    }
  };

  const ANSWERS={
    running:{
      'pl-PL':'Uruchamiam akcję w aktywnym module.', 'nl-NL':'Ik start de actie in de actieve module.', 'en-US':'I am starting the action in the active module.'},
    analyzeCv:{
      'pl-PL':'Uruchamiam analizę CV, języków, dopasowania i dojazdu.', 'nl-NL':'Ik start de CV-analyse, talenmatch, matching en reistijdcontrole.', 'en-US':'I am starting the CV, language match, fit and commute analysis.'},
    fillCv:{
      'pl-PL':'Przejdź do pola CV lub przeciągnij plik w module rekrutacyjnym.', 'nl-NL':'Ga naar het CV-veld of sleep het bestand naar de recruitmentmodule.', 'en-US':'Go to the CV field or drag the file into the recruitment module.'},
    billNeedRate:{
      'pl-PL':'Podaj pay rate, na przykład: policz bill rate dla pay rate 24 i GS.', 'nl-NL':'Geef de pay rate door, bijvoorbeeld: bereken bill rate voor pay rate 24 en GS.', 'en-US':'Give me the pay rate, for example: calculate bill rate for pay rate 24 and GS.'},
    budget:{
      'pl-PL':'Uzupełniam dane budżetu i odświeżam kalkulację.', 'nl-NL':'Ik vul de budgetgegevens in en vernieuw de berekening.', 'en-US':'I am filling the budget data and refreshing the calculation.'},
    exported:{
      'pl-PL':'Uruchamiam eksport lub pobieranie w tym module.', 'nl-NL':'Ik start exporteren of downloaden in deze module.', 'en-US':'I am starting export or download in this module.'},
    commandListIntro:{
      'pl-PL':'Dla tego modułu przypisane są między innymi te polecenia: ', 'nl-NL':'Voor deze module zijn onder andere deze commando’s gekoppeld: ', 'en-US':'This module supports commands such as: '}
  };

  const logEl=$('#rwLog');
  function esc(s){return String(s??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]||m));}
  function tr(k, lang=getAgentLang()){return (UI[lang]||UI['pl-PL'])[k] || UI['pl-PL'][k] || k;}
  function log(w,t){ if(!logEl) return; const p=document.createElement('p'); p.className='rw-line'; p.innerHTML='<b>'+esc(w)+':</b> '+esc(t); logEl.appendChild(p); logEl.scrollTop=logEl.scrollHeight; }
  function state(name,hint,cls=''){
    const v=$('#rwVisual'), s=$('#rwState'), h=$('#rwHint');
    if(v){ v.classList.remove('listening','thinking','speaking'); if(cls) v.classList.add(cls); }
    if(s) s.textContent=name; if(h) h.textContent=hint||'';
  }
  function pulseSaveLed(){
    const leds=[$('#rwSaveLed'),$('#rwMemoryDot')].filter(Boolean);
    if(!leds.length) return;
    leds.forEach(led=>{
      led.classList.remove('active');
      void led.offsetWidth;
      led.classList.add('active');
    });
    clearTimeout(saveLedTimer);
    saveLedTimer=setTimeout(()=>leds.forEach(led=>led.classList.remove('active')),520);
  }
  function playMemorySavedClick(){
    try{
      const Ctx=window.AudioContext||window.webkitAudioContext;
      if(!Ctx) return;
      if(!rwAudioCtx) rwAudioCtx=new Ctx();
      if(rwAudioCtx.state==='suspended') rwAudioCtx.resume().catch(()=>{});
      const ctx=rwAudioCtx;
      const now=ctx.currentTime+0.01;
      const osc=ctx.createOscillator();
      const gain=ctx.createGain();
      const filter=ctx.createBiquadFilter();
      osc.type='sine';
      osc.frequency.setValueAtTime(118,now);
      osc.frequency.exponentialRampToValueAtTime(84,now+0.085);
      filter.type='lowpass';
      filter.frequency.setValueAtTime(620,now);
      filter.Q.value=0.9;
      gain.gain.setValueAtTime(0.0001,now);
      gain.gain.exponentialRampToValueAtTime(0.05,now+0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001,now+0.11);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now+0.12);
    }catch(e){}
  }
  function memorySavedFeedback(){
    pulseSaveLed();
    playMemorySavedClick();
  }

  function uniquePushMemory(arr, value, lang){
    const v=String(value||'').replace(/\x00/g,'').trim();
    if(!v) return false;
    const key=normText(v);
    const exists=arr.some(x=>normText(x?.value||x)===key);
    if(exists) return false;
    arr.unshift(memoryFact(v, lang||getAgentLang(), 'user_preference', 1));
    return true;
  }
  function addDontSayAliases(memory, phrase, lang){
    const raw=String(phrase||'').trim().replace(/^[:.,;\s]+|[:.,;\s]+$/g,'');
    if(!raw) return false;
    const prefs=memory.preferences||(memory.preferences={dontSay:[],dontRead:[],silentAck:true});
    if(!Array.isArray(prefs.dontSay)) prefs.dontSay=[];
    if(!Array.isArray(prefs.dontRead)) prefs.dontRead=[];
    const values=[raw];
    const n=normText(raw);
    if(n.includes('znak praw autorskich') || n.includes('praw autorskich') || n.includes('copyright')){
      values.push('©','copyright','znak praw autorskich','praw autorskich','symbol praw autorskich');
    }
    let changed=false;
    values.forEach(v=>{
      changed=uniquePushMemory(prefs.dontSay,v,lang)||changed;
      changed=uniquePushMemory(prefs.dontRead,v,lang)||changed;
    });
    const rule='Nie mów i nie czytaj: '+values.join(', ');
    changed=uniquePushMemory(memory.learned,rule,lang)||changed;
    addMemoryTimeline(memory,'preference','dont_say',values.join(', '),lang,'user_preference');
    return changed;
  }
  function extractForbiddenPhrase(rawText){
    const text=String(rawText||'').trim();
    if(!text) return '';
    const lower=normText(text);
    if(lower.includes('znak praw autorskich') || lower.includes('praw autorskich') || lower.includes('copyright')) return 'znak praw autorskich';

    const patterns=[
      /(?:nigdy\s+)?nie\s+(?:m[oó]w|czytaj|czytać|czytac|odczytuj|u[żz]ywaj|wymawiaj|wypowiadaj)\s+(?:ju[żz]\s+)?(.+?)(?:[.!?]|$)/i,
      /(?:do\s+not|don't|dont|never)\s+(?:say|read|use|speak)\s+(.+?)(?:[.!?]|$)/i,
      /(?:zeg|lees|gebruik)\s+(?:dit\s+)?niet\s+(.+?)(?:[.!?]|$)/i,
      /(?:nooit)\s+(?:zeggen|lezen|gebruiken)\s+(.+?)(?:[.!?]|$)/i
    ];
    for(const re of patterns){
      const m=text.match(re);
      if(m && m[1]){
        let v=m[1].trim();
        v=v.replace(/^(tego|te|to|this|that|dit|dat)\b\s*/i,'').trim();
        v=v.replace(/\b(nigdy|never|nooit)\b.*$/i,'').trim();
        return v;
      }
    }
    return '';
  }
  function rememberSilentPreferenceFromText(text, lang){
    const n=normText(text);
    const looksLikePreference=hasAny(n,[
      'nie mow','nie mów','nie czytaj','nie czytac','nie czytać','nie odczytuj','nie uzywaj','nie używaj','nie wymawiaj','nie wypowiadaj','nigdy nie mow','nigdy nie mów','nigdy nie czytaj','nigdy nie czytac',
      'do not say','dont say','don t say','do not read','dont read','don t read','never say','never read',
      'zeg niet','lees niet','gebruik niet','nooit zeggen','nooit lezen'
    ]);
    if(!looksLikePreference) return false;
    const phrase=extractForbiddenPhrase(text);
    if(!phrase) return false;
    const memory=loadAgentMemory();
    addDontSayAliases(memory,phrase,lang);
    memory.updatedAt=new Date().toISOString();
    saveAgentMemory(memory);
    memorySavedFeedback();
    return true;
  }
  function escapeRegExpAgent(value){
    return String(value||'').replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  }
  function applyMemoryPreferencesToText(text){
    let t=String(text||'');
    const memory=loadAgentMemory();
    const prefs=memory.preferences||{};
    const forbidden=[...(prefs.dontSay||[]),...(prefs.dontRead||[])]
      .map(x=>String(x?.value||x||'').trim())
      .filter(Boolean)
      .sort((a,b)=>b.length-a.length);
    forbidden.forEach(item=>{
      if(item==='©') t=t.replace(/©/g,'');
      else t=t.replace(new RegExp(escapeRegExpAgent(item),'gi'),'');
    });
    return t.replace(/\s{2,}/g,' ').replace(/\s+([,.!?;:])/g,'$1').trim();
  }

  function normalizeLang(v){
    const t=String(v||'').toLowerCase();
    if(t.includes('nl')||t.includes('neder')||t.includes('dutch')) return 'nl-NL';
    if(t.includes('en')||t.includes('eng')) return 'en-US';
    if(t.includes('pl')||t.includes('pol')||t.includes('polski')) return 'pl-PL';
    return null;
  }
  function detectLanguageFromText(input){
    const original=String(input||'').trim();
    if(!original) return null;
    const raw=original.toLowerCase();
    const n=normText(original);
    const words=(n.match(/[a-z0-9ąćęłńóśźż]+/gi)||[]).map(w=>w.toLowerCase());
    const joined=' '+n+' ';
    const score={'pl-PL':0,'nl-NL':0,'en-US':0};

    if(/[ąćęłńóśźż]/i.test(raw)) score['pl-PL']+=8;
    if(/[àáèéëïíóöü]/i.test(raw)) score['nl-NL']+=2;

    const dict={
      'pl-PL':['czy','jest','jesteś','jestes','jak','jaki','jakie','gdzie','kiedy','dlaczego','czemu','ile','możesz','mozesz','chcę','chce','musimy','zrób','zrob','napisz','powiedz','przeanalizuj','policz','dla','oraz','albo','żeby','zeby','który','ktory','mam','mamy','moje','moja','moim','ten','ta','to','tego','też','tez','nie','tak','okno','język','jezyk','wybrany','odpowiadać','odpowiadac'],
      'nl-NL':['de','het','een','ik','jij','je','wij','we','ben','bent','is','zijn','heb','hebt','heeft','waar','waarom','wanneer','hoe','welke','wat','dit','dat','deze','die','niet','wel','moet','moeten','kan','kun','kunt','naar','voor','van','met','als','dan','omdat','want','antwoord','schrijf','bereken','analyseer','taal','gekozen','reageer'],
      'en-US':['the','a','an','i','you','we','am','are','is','have','has','where','why','when','how','what','which','this','that','these','those','not','yes','no','can','could','should','must','please','write','tell','answer','calculate','analyze','language','selected','respond','with','from','for','and','or','because']
    };
    for(const lang of Object.keys(dict)){
      for(const w of dict[lang]){
        if(words.includes(w)) score[lang]+=1.25;
      }
    }

    const phrases={
      'pl-PL':['co to jest','jak to','ile kosztuje','napisz po','po polsku','w języku polskim','w jezyku polskim','chcę żeby','chce zeby','musimy','zrób to','zrob to','nie działa','nie dziala'],
      'nl-NL':['wat is','hoe werkt','waar is','ik wil','ik wil dat','kun je','kan je','schrijf in het nederlands','in het nederlands','niet werkt','wat moet'],
      'en-US':['what is','how does','where is','i want','can you','could you','write in english','in english','does not work','what should']
    };
    for(const lang of Object.keys(phrases)){
      for(const p of phrases[lang]) if(joined.includes(' '+normText(p)+' ')) score[lang]+=4;
    }

    // Krótkie typowe polecenia bez polskich znaków.
    if(/^(czesc|cześć|siema|hej|jestes|jesteś|policz|napisz|zrob|zrób|usun|usuń|dodaj|sprawdz|sprawdź)\b/.test(n)) score['pl-PL']+=5;
    if(/^(hoi|hallo|goedemorgen|goedenavond|bereken|schrijf|verwijder|voeg|controleer)\b/.test(n)) score['nl-NL']+=5;
    if(/^(hi|hello|hey|calculate|write|remove|add|check|analyze)\b/.test(n)) score['en-US']+=5;

    const ranked=Object.entries(score).sort((a,b)=>b[1]-a[1]);
    if(ranked[0][1] >= Math.max(2.5, ranked[1][1]+1)) return ranked[0][0];

    // Jeżeli tekst jest bardzo krótki i niepewny, zachowaj ostatni język agenta.
    return null;
  }

  function setAgentLanguageFromInput(text){
    const detected=detectLanguageFromText(text);
    if(detected){ setAgentLang(detected); return detected; }
    return getAgentLang();
  }

  function getStoredPlatformLang(){
    const keys=['rw_platform_lang','rw_lang','recruiterAiLang','contractBudgetLang','intakeLang','meetingNotesLang','duplicateLang','lang'];
    for(const k of keys){ try{ const v=normalizeLang(localStorage.getItem(k)); if(v) return v; }catch(e){} }
    return null;
  }
  function isVisibleAgentFrame(f){
    try{
      if(!f) return false;
      const r=f.getBoundingClientRect(), cs=getComputedStyle(f);
      return r.width>80 && r.height>80 && cs.display!=='none' && cs.visibility!=='hidden' && +cs.opacity!==0;
    }catch(e){ return false; }
  }
  function getVisibleActiveFrameStrict(){
    const activeId=window.__rwActiveAppId;
    if(activeId){
      const active=document.getElementById(activeId);
      if(isVisibleAgentFrame(active)) return active;
    }
    const frames=$$('iframe').filter(isVisibleAgentFrame);
    return frames[frames.length-1] || null;
  }
  function getActiveFrame(){
    return getVisibleActiveFrameStrict() || $('iframe');
  }
  function getDeepestVisibleDoc(startDoc){
    let doc=startDoc||document;
    for(let depth=0; depth<5; depth++){
      let frames=[];
      try{frames=Array.from(doc.querySelectorAll('iframe')).filter(f=>{
        const r=f.getBoundingClientRect();
        const st=(f.ownerDocument.defaultView||window).getComputedStyle(f);
        return r.width>80 && r.height>80 && st.display!=='none' && st.visibility!=='hidden' && +st.opacity!==0;
      });}catch(e){frames=[];}
      if(!frames.length) break;
      const f=frames[frames.length-1];
      try{
        const next=f.contentDocument || f.contentWindow.document;
        if(!next || next===doc) break;
        doc=next;
      }catch(e){break;}
    }
    return doc;
  }
  function getActiveDoc(){
    const f=getActiveFrame();
    if(!f) return getDeepestVisibleDoc(document);
    try{return getDeepestVisibleDoc(f.contentDocument || f.contentWindow.document);}catch(e){return getDeepestVisibleDoc(document);}
  }
  function getModuleTitle(){
    const d=getActiveDoc();
    let t='';
    try{
      t=(d && (d.querySelector('h1')?.textContent || d.title || d.querySelector('.app-title,.title,.brand-title')?.textContent)) || '';
    }catch(e){}
    if(!t){
      const visible=$$('h1,h2,.app-title,.module-title,.brand-title').filter(el=>el.offsetParent!==null).pop();
      t=visible?.textContent || '';
    }
    return String(t||'').replace(/\s+/g,' ').trim();
  }
  function getLangFromDoc(d){
    if(!d) return null;
    try{
      // Strong module-level hints first. Many embedded tools keep <html lang> static,
      // so active language buttons/selects must override the document fallback.
      let v=normalizeLang(d.body?.getAttribute('data-lang') || d.body?.getAttribute('data-language') || d.body?.dataset?.lang || d.body?.dataset?.language);
      if(v) return v;

      const sel=Array.from(d.querySelectorAll('select')).filter(x=>!x.closest('#rwAgentOverlay,#rwVoicePanel')).find(x=>/lang|taal|język|jezyk|language/i.test(x.id+' '+x.name+' '+x.className));
      v=normalizeLang(sel?.value || sel?.selectedOptions?.[0]?.textContent); if(v) return v;

      const pressed=Array.from(d.querySelectorAll('[data-lang][aria-pressed="true"],[data-language][aria-pressed="true"],[data-locale][aria-pressed="true"],.rw-lang-btn[aria-pressed="true"]')).find(x=>!x.closest('#rwAgentOverlay,#rwVoicePanel'));
      v=normalizeLang(pressed?.getAttribute('data-lang') || pressed?.getAttribute('data-language') || pressed?.getAttribute('data-locale') || pressed?.textContent); if(v) return v;

      const active=Array.from(d.querySelectorAll('[data-lang].active,[data-language].active,[data-locale].active,.rw-lang-btn.active,.lang-btn.active,.language-btn.active,.active[data-lang]')).find(x=>!x.closest('#rwAgentOverlay,#rwVoicePanel'));
      v=normalizeLang(active?.getAttribute('data-lang') || active?.getAttribute('data-language') || active?.getAttribute('data-locale') || active?.textContent); if(v) return v;

      const meta=d.querySelector('meta[http-equiv="content-language"],meta[name="language"],meta[name="lang"]');
      v=normalizeLang(meta?.getAttribute('content')); if(v) return v;

      v=normalizeLang(d.documentElement?.lang || d.body?.getAttribute('lang'));
      if(v) return v;
    }catch(e){}
    return null;
  }
  function detectLangFromWindowAgent(w){
    if(!w) return null;
    try{
      let v=normalizeLang(w.__rwLang || w.rw_lang || w.lang || w.language);
      if(v) return v;
      for(const name of ['currentLang','getLang','getCurrentLang']){
        try{
          const fn=w[name];
          if(typeof fn==='function'){ v=normalizeLang(fn()); if(v) return v; }
        }catch(e){}
      }
    }catch(e){}
    return null;
  }
  function detectLangFromSrcdocAgent(f){
    try{
      const src=String(f?.getAttribute('srcdoc')||'');
      const m=src.match(/<html[^>]*\blang\s*=\s*["']\s*([a-zA-Z_-]+)\s*["']/i);
      return m ? normalizeLang(m[1]) : null;
    }catch(e){ return null; }
  }
  function detectActiveModuleLangStrict(){
    const f=getVisibleActiveFrameStrict();
    if(!f) return null;
    let v=normalizeLang(f.getAttribute('data-module-lang') || f.dataset?.moduleLang);
    if(v) return v;
    try{ v=detectLangFromWindowAgent(f.contentWindow); if(v) return v; }catch(e){}
    try{ v=getLangFromDoc(f.contentDocument || f.contentWindow?.document); if(v) return v; }catch(e){}
    v=detectLangFromSrcdocAgent(f); if(v) return v;
    v=normalizeLang(window.__rwActiveAppLang); if(v) return v;
    return null;
  }
  function detectPlatformLang(){
    const moduleLang=detectActiveModuleLangStrict();
    if(moduleLang) return moduleLang;
    const d=getActiveDoc();
    return getLangFromDoc(d) || getLangFromDoc(document) || getStoredPlatformLang() || normalizeLang($('#rwLang')?.value) || localStorage.getItem(LANG_KEY) || 'pl-PL';
  }
  function resolveAgentLanguageForCommand(text, source){
    const moduleLang=detectActiveModuleLangStrict();
    if(moduleLang) return setAgentLang(moduleLang);
    const detected=detectLanguageFromText(text);
    if(detected) return setAgentLang(detected);
    return syncLangFromPlatform(true);
  }
  function setAgentLang(lang, opts={}){
    lang=normalizeLang(lang)||'pl-PL';
    lastUiLang=lang;
    try{localStorage.setItem(LANG_KEY,lang);}catch(e){}
    const sel=$('#rwLang'); if(sel && sel.value!==lang) sel.value=lang;
    applyAgentTexts(lang);
    if(opts.propagate) propagateLangToModule(lang);
    return lang;
  }
  function getAgentLang(){ return normalizeLang($('#rwLang')?.value) || lastUiLang || 'pl-PL'; }
  function syncLangFromPlatform(force=false){
    const lang=detectPlatformLang();
    const title=getModuleTitle();
    if(force || lang!==lastUiLang || title!==lastModuleTitle){
      lastModuleTitle=title;
      setAgentLang(lang);
      const label=title?`${tr('module',lang)}: ${title}`:tr('ready',lang);
      state(tr('ready',lang), label);
    }
  }
  function propagateLangToModule(lang){
    try{localStorage.setItem('rw_lang', langShort[lang] || 'pl');}catch(e){}
    const d=getActiveDoc(); if(!d) return;
    try{
      if(typeof d.defaultView.setLanguage==='function') d.defaultView.setLanguage(langShort[lang]||lang);
      const btn=d.querySelector(`[data-lang="${langShort[lang]}"]`) || d.querySelector(`[data-lang="${lang}"]`);
      if(btn) btn.click();
      const sel=Array.from(d.querySelectorAll('select')).find(x=>/lang|taal|język|language/i.test(x.id+' '+x.name+' '+x.className));
      if(sel){ sel.value=lang; sel.dispatchEvent(new Event('change',{bubbles:true})); }
      d.documentElement.lang=langShort[lang]||lang;
    }catch(e){}
  }
  function applyAgentTexts(lang){
    const u=UI[lang]||UI['pl-PL'];
    const panel=$('#rwAgentPanel')||$('#rwAgentOverlay')||$('#rwVoicePanel'); if(panel) panel.setAttribute('lang',langShort[lang]||'pl');
    const title=$('.rw-agent-title')||$('.rw-title'); if(title) title.textContent=u.title;
    const sub=$('.rw-agent-subtitle')||$('.rw-sub'); if(sub) sub.textContent=u.subtitle;
    const stateEl=$('#rwState'); if(stateEl && [UI['pl-PL'].ready,UI['nl-NL'].ready,UI['en-US'].ready,'Gotowy','Klaar','Ready'].includes(stateEl.textContent.trim())) stateEl.textContent=u.ready;
    const hint=$('#rwHint'); if(hint && !hint.dataset.locked) hint.textContent=u.hint;
    const listen=$('#rwListenBtn'); if(listen) listen.textContent=listening?u.stop:u.listen;
    const test=$('#rwTestVoiceBtn'); if(test) test.textContent=u.test;
    const stopSpeak=$('#rwStopSpeakBtn'); if(stopSpeak) stopSpeak.textContent=u.stopSpeech || 'Stop';
    const send=$('#rwSendBtn'); if(send) send.textContent=u.send;
    const refresh=$('#rwRefreshBtn'); if(refresh) refresh.textContent=u.refresh;
    const autoLang=$('#rwAutoLang'); if(autoLang) autoLang.textContent=u.autoLang || 'Language detected automatically';
    const input=$('#rwCommandInput'); if(input) input.placeholder=u.input;
    const key=$('#rwApiKey'); if(key) key.placeholder=u.apiPlaceholder;
    const save=$('#rwSaveKey'); if(save) save.textContent=u.activate;
    const apiTitle=$('.rw-api-title'); if(apiTitle) apiTitle.textContent=u.apiTitle;
    const smallApi=$('#rwApiBox small'); if(smallApi) smallApi.textContent=u.apiSmall;
    const small=$('.rw-small'); if(small) small.textContent=u.small;
    const sel=$('#rwLang');
    if(sel){
      Array.from(sel.options).forEach(o=>{ o.textContent=u.langNames[o.value] || o.textContent; });
      sel.title=u.hint;
    }
    updateApiBox();
  }

  function buildMemoryList(){
    const input=$('#rwCommandInput'); if(!input) return;
    let dl=$('#rwCommandMemoryList');
    if(!dl){ dl=document.createElement('datalist'); dl.id='rwCommandMemoryList'; document.body.appendChild(dl); input.setAttribute('list','rwCommandMemoryList'); }
    const mem=loadMemory().slice(-30).reverse();
    dl.innerHTML=mem.map(x=>'<option value="'+esc(x.raw)+'"></option>').join('');
  }
  function loadMemory(){ try{return JSON.parse(localStorage.getItem(MEM_KEY)||'[]')||[];}catch(e){return[];} }
  function saveManualCommand(raw, module, lang, source='manual'){
    const text=String(raw||'').trim(); if(!text) return;
    const norm=normText(text);
    const mem=loadMemory();
    const existing=mem.find(x=>x.norm===norm && x.module===module);
    if(existing){ existing.count=(existing.count||1)+1; existing.ts=Date.now(); existing.lang=lang; existing.source=source; }
    else mem.push({raw:text,norm,module,lang,source,ts:Date.now(),count:1});
    localStorage.setItem(MEM_KEY,JSON.stringify(mem.slice(-250)));
    buildMemoryList();
  }

  function emptyAgentMemory(){
    return {
      profile:{},
      notes:[],
      learned:[],
      preferences:{dontSay:['©','copyright','znak praw autorskich','praw autorskich','symbol praw autorskich'],dontRead:['©','copyright','znak praw autorskich','praw autorskich','symbol praw autorskich'],silentAck:true},
      timeline:[],
      updatedAt:new Date().toISOString(),
      version:3
    };
  }
  function normalizeMemoryShape(data){
    const memory=emptyAgentMemory();
    if(data && typeof data==='object'){
      if(data.profile && typeof data.profile==='object') memory.profile=data.profile;
      if(Array.isArray(data.notes)) memory.notes=data.notes;
      if(Array.isArray(data.learned)) memory.learned=data.learned;
      if(data.preferences && typeof data.preferences==='object') memory.preferences=data.preferences;
      if(!memory.preferences || typeof memory.preferences!=='object') memory.preferences={dontSay:[],dontRead:[],silentAck:true};
      if(!Array.isArray(memory.preferences.dontSay)) memory.preferences.dontSay=[];
      if(!Array.isArray(memory.preferences.dontRead)) memory.preferences.dontRead=[];
      ['©','copyright','znak praw autorskich','praw autorskich','symbol praw autorskich'].forEach(v=>{
        if(!memory.preferences.dontSay.some(x=>String(x?.value||x)===v)) memory.preferences.dontSay.push(v);
        if(!memory.preferences.dontRead.some(x=>String(x?.value||x)===v)) memory.preferences.dontRead.push(v);
      });
      if(typeof memory.preferences.silentAck!=='boolean') memory.preferences.silentAck=true;
      if(Array.isArray(data.timeline)) memory.timeline=data.timeline;
      if(data.user_name?.value && !memory.profile.user_name) memory.profile.user_name=data.user_name;
      if(data.user_location?.value && !memory.profile.user_location) memory.profile.user_location=data.user_location;
      if(data.workplace?.value && !memory.profile.workplace) memory.profile.workplace=data.workplace;
      if(data.job_title?.value && !memory.profile.job_title) memory.profile.job_title=data.job_title;
      if(data.car?.value && !memory.profile.car) memory.profile.car=data.car;
      if(data.camera?.value && !memory.profile.camera) memory.profile.camera=data.camera;
      if(Array.isArray(data.notes) && !memory.notes.length) memory.notes=data.notes;
    }
    memory.notes=memory.notes.filter(Boolean).slice(0,300);
    memory.learned=memory.learned.filter(Boolean).slice(0,300);
    memory.timeline=memory.timeline.filter(Boolean).slice(0,500);
    memory.preferences.dontSay=memory.preferences.dontSay.filter(Boolean).slice(0,300);
    memory.preferences.dontRead=memory.preferences.dontRead.filter(Boolean).slice(0,300);
    memory.updatedAt=new Date().toISOString();
    memory.version=3;
    return memory;
  }
  function loadAgentMemory(){
    const keys=['rwVoiceAgentPermanentMemoryV2','rwVoiceAgentUserFactsV1'];
    for(const key of keys){
      try{
        const raw=localStorage.getItem(key);
        if(raw) return normalizeMemoryShape(JSON.parse(raw));
      }catch(e){}
    }
    return emptyAgentMemory();
  }
  function saveAgentMemory(memory){
    const clean=normalizeMemoryShape(memory);
    try{ localStorage.setItem('rwVoiceAgentPermanentMemoryV2', JSON.stringify(clean)); }catch(e){}
    try{
      const legacy={...clean.profile, notes:clean.notes, learned:clean.learned, preferences:clean.preferences, timeline:clean.timeline, updatedAt:clean.updatedAt, version:clean.version};
      localStorage.setItem('rwVoiceAgentUserFactsV1', JSON.stringify(legacy));
    }catch(e){}
    return clean;
  }
  function loadUserFacts(){ return loadAgentMemory().profile || {}; }
  function saveUserFacts(facts){
    const memory=loadAgentMemory();
    memory.profile=facts && typeof facts==='object' ? facts : {};
    saveAgentMemory(memory);
  }
  function memoryFact(value, lang, source='manual', confidence=1){
    return {value:String(value||'').trim(), lang:lang||getAgentLang(), source, confidence, ts:new Date().toISOString()};
  }
  function addMemoryTimeline(memory, type, key, value, lang, source){
    memory.timeline=Array.isArray(memory.timeline)?memory.timeline:[];
    memory.timeline.unshift({type, key, value:String(value||'').trim(), lang:lang||getAgentLang(), source:source||'manual', ts:new Date().toISOString()});
    memory.timeline=memory.timeline.slice(0,500);
  }
  function rememberUserFact(key, value, lang, source='manual'){
    const clean=String(value||'').replace(/[.!?;,]+$/,'').replace(/\s+/g,' ').trim();
    if(!key || !clean) return null;
    const memory=loadAgentMemory();
    memory.profile=memory.profile||{};
    const previous=memory.profile[key]?.value;
    if(previous && normText(previous)===normText(clean)) return {...memory.profile[key], __isNew:false};
    memory.profile[key]=memoryFact(clean,lang,source,1);
    addMemoryTimeline(memory,'fact',key,clean,lang,source);
    saveAgentMemory(memory);
    return {...memory.profile[key], __isNew:true};
  }
  function rememberUserNote(value, lang, source='manual'){
    const clean=String(value||'').replace(/[.!?;,]+$/,'').replace(/\s+/g,' ').trim();
    if(clean.length<3) return null;
    const memory=loadAgentMemory();
    memory.notes=Array.isArray(memory.notes)?memory.notes:[];
    const exists=memory.notes.some(n=>normText(n.value)===normText(clean));
    if(!exists){
      memory.notes.unshift(memoryFact(clean,lang,source,0.8));
      memory.notes=memory.notes.slice(0,300);
      addMemoryTimeline(memory,'note','note',clean,lang,source);
      saveAgentMemory(memory);
      return {value:clean, __isNew:true};
    }
    return {value:clean, __isNew:false};
  }
  function firstRegexMatch(text, patterns){
    for(const re of patterns){
      const m=String(text||'').match(re);
      if(m && m[1]) return m[1].trim();
    }
    return '';
  }
  function cleanCapturedValue(value){
    return String(value||'')
      .replace(/["“”„]/g,'')
      .replace(/\b(?:i|oraz|ale|a|and|but|en|maar|und|to|jest|is|zijn|ben)\b.*$/iu,'')
      .replace(/[.!?;,]+$/,'')
      .replace(/\s+/g,' ')
      .trim();
  }
  function cleanPersonName(name){
    let n=cleanCapturedValue(name);
    n=n.replace(/\b(?:mieszkam|pracuje|pracuję|mam|lubie|lubię|woon|werk|have|live|like)\b.*$/iu,'').trim();
    return n;
  }
  function learnExplicitPreference(raw, lang, source){
    const pref=firstRegexMatch(raw,[
      /(?:^|[\s,.!?;:])wol[eę]\s+(.{3,180})$/iu,
      /(?:^|[\s,.!?;:])nie\s+lubi[eę]\s+(.{3,180})$/iu,
      /(?:^|[\s,.!?;:])lubi[eę]\s+(.{3,180})$/iu,
      /(?:^|[\s,.!?;:])i\s+prefer\s+(.{3,180})$/iu,
      /(?:^|[\s,.!?;:])i\s+like\s+(.{3,180})$/iu,
      /(?:^|[\s,.!?;:])i\s+do\s+not\s+like\s+(.{3,180})$/iu,
      /(?:^|[\s,.!?;:])ik\s+geef\s+de\s+voorkeur\s+aan\s+(.{3,180})$/iu,
      /(?:^|[\s,.!?;:])ik\s+hou\s+van\s+(.{3,180})$/iu
    ]);
    if(pref) return rememberUserNote(pref,lang,source);
    return null;
  }
  function rememberUserFactFromText(text, lang, source='manual'){
    const raw=String(text||'').trim();
    if(!raw) return null;

    const explicitNote=firstRegexMatch(raw,[
      /(?:^|[\s,.!?;:])zapami[eę]taj\s+(?:że|ze)?\s*(.{3,320})$/iu,
      /(?:^|[\s,.!?;:])zapami[eę]taj\s+to\s*:?\s*(.{3,320})$/iu,
      /(?:^|[\s,.!?;:])remember\s+(?:that)?\s*(.{3,320})$/iu,
      /(?:^|[\s,.!?;:])remember\s+this\s*:?\s*(.{3,320})$/iu,
      /(?:^|[\s,.!?;:])onthoud\s+(?:dat)?\s*(.{3,320})$/iu
    ]);
    if(explicitNote) return rememberUserNote(explicitNote,lang,source);

    const name=cleanPersonName(firstRegexMatch(raw,[
      /(?:^|[\s,.!?;:])nazywam\s+si[eę]\s+([\p{L}'’ -]{2,70})/iu,
      /(?:^|[\s,.!?;:])mam\s+na\s+imi[eę]\s+([\p{L}'’ -]{2,70})/iu,
      /(?:^|[\s,.!?;:])moje\s+imi[eę]\s+to\s+([\p{L}'’ -]{2,70})/iu,
      /(?:^|[\s,.!?;:])jestem\s+([A-ZĄĆĘŁŃÓŚŹŻ][\p{L}'’ -]{1,55})/u,
      /(?:^|[\s,.!?;:])ik\s+heet\s+([\p{L}'’ -]{2,70})/iu,
      /(?:^|[\s,.!?;:])mijn\s+naam\s+is\s+([\p{L}'’ -]{2,70})/iu,
      /(?:^|[\s,.!?;:])my\s+name\s+is\s+([\p{L}'’ -]{2,70})/iu,
      /(?:^|[\s,.!?;:])i\s+am\s+([A-Z][\p{L}'’ -]{1,55})/u
    ]));
    if(name && name.length<=70) return rememberUserFact('user_name', name, lang, source);

    const location=cleanCapturedValue(firstRegexMatch(raw,[
      /(?:^|[\s,.!?;:])mieszkam\s+w\s+([\p{L}0-9'’ .-]{2,90})/iu,
      /(?:^|[\s,.!?;:])mieszkam\s+we\s+([\p{L}0-9'’ .-]{2,90})/iu,
      /(?:^|[\s,.!?;:])moja\s+miejscowo[sś][cć]\s+to\s+([\p{L}0-9'’ .-]{2,90})/iu,
      /(?:^|[\s,.!?;:])my\s+city\s+is\s+([\p{L}0-9'’ .-]{2,90})/iu,
      /(?:^|[\s,.!?;:])i\s+live\s+in\s+([\p{L}0-9'’ .-]{2,90})/iu,
      /(?:^|[\s,.!?;:])ik\s+woon\s+in\s+([\p{L}0-9'’ .-]{2,90})/iu,
      /(?:^|[\s,.!?;:])mijn\s+woonplaats\s+is\s+([\p{L}0-9'’ .-]{2,90})/iu
    ]));
    if(location) return rememberUserFact('user_location', location, lang, source);

    const workplace=cleanCapturedValue(firstRegexMatch(raw,[
      /(?:^|[\s,.!?;:])pracuj[eę]\s+w\s+([\p{L}0-9&'’ .-]{2,90})/iu,
      /(?:^|[\s,.!?;:])pracuj[eę]\s+dla\s+([\p{L}0-9&'’ .-]{2,90})/iu,
      /(?:^|[\s,.!?;:])i\s+work\s+at\s+([\p{L}0-9&'’ .-]{2,90})/iu,
      /(?:^|[\s,.!?;:])i\s+work\s+for\s+([\p{L}0-9&'’ .-]{2,90})/iu,
      /(?:^|[\s,.!?;:])ik\s+werk\s+bij\s+([\p{L}0-9&'’ .-]{2,90})/iu,
      /(?:^|[\s,.!?;:])ik\s+werk\s+voor\s+([\p{L}0-9&'’ .-]{2,90})/iu
    ]));
    if(workplace) return rememberUserFact('workplace', workplace, lang, source);

    const jobTitle=cleanCapturedValue(firstRegexMatch(raw,[
      /(?:^|[\s,.!?;:])pracuj[eę]\s+jako\s+([\p{L}0-9&'’ .-]{2,90})/iu,
      /(?:^|[\s,.!?;:])moje\s+stanowisko\s+to\s+([\p{L}0-9&'’ .-]{2,90})/iu,
      /(?:^|[\s,.!?;:])i\s+work\s+as\s+([\p{L}0-9&'’ .-]{2,90})/iu,
      /(?:^|[\s,.!?;:])my\s+job\s+is\s+([\p{L}0-9&'’ .-]{2,90})/iu,
      /(?:^|[\s,.!?;:])ik\s+werk\s+als\s+([\p{L}0-9&'’ .-]{2,90})/iu,
      /(?:^|[\s,.!?;:])mijn\s+functie\s+is\s+([\p{L}0-9&'’ .-]{2,90})/iu
    ]));
    if(jobTitle) return rememberUserFact('job_title', jobTitle, lang, source);

    const car=cleanCapturedValue(firstRegexMatch(raw,[
      /(?:^|[\s,.!?;:])moje\s+auto\s+to\s+([\p{L}0-9&'’ .-]{2,90})/iu,
      /(?:^|[\s,.!?;:])mam\s+auto\s+([\p{L}0-9&'’ .-]{2,90})/iu,
      /(?:^|[\s,.!?;:])je[zż]d[zż][eę]\s+([\p{L}0-9&'’ .-]{2,90})/iu,
      /(?:^|[\s,.!?;:])my\s+car\s+is\s+([\p{L}0-9&'’ .-]{2,90})/iu,
      /(?:^|[\s,.!?;:])i\s+drive\s+([\p{L}0-9&'’ .-]{2,90})/iu,
      /(?:^|[\s,.!?;:])mijn\s+auto\s+is\s+([\p{L}0-9&'’ .-]{2,90})/iu,
      /(?:^|[\s,.!?;:])ik\s+rij\s+in\s+([\p{L}0-9&'’ .-]{2,90})/iu
    ]));
    if(car) return rememberUserFact('car', car, lang, source);

    const camera=cleanCapturedValue(firstRegexMatch(raw,[
      /(?:^|[\s,.!?;:])mam\s+aparat\s+([\p{L}0-9&'’ .-]{2,90})/iu,
      /(?:^|[\s,.!?;:])moja\s+kamera\s+to\s+([\p{L}0-9&'’ .-]{2,90})/iu,
      /(?:^|[\s,.!?;:])my\s+camera\s+is\s+([\p{L}0-9&'’ .-]{2,90})/iu,
      /(?:^|[\s,.!?;:])mijn\s+camera\s+is\s+([\p{L}0-9&'’ .-]{2,90})/iu
    ]));
    if(camera) return rememberUserFact('camera', camera, lang, source);

    return learnExplicitPreference(raw,lang,source);
  }
  function isQuestionLike(text){
    const n=normText(text);
    return /\?/.test(String(text||'')) || hasAny(n,['jak','jaki','jakie','czy','gdzie','kiedy','dlaczego','ile','co','kim','what','who','where','when','why','how','which','do you','can you','wat','wie','waar','wanneer','waarom','hoe','welke']);
  }
  function getProfileValue(key){
    const memory=loadAgentMemory();
    return memory.profile?.[key]?.value || '';
  }
  function memoryLine(label,value){ return value ? `${label}: ${value}` : ''; }
  function answerUserMemoryQuestion(text, lang){
    const n=normText(text);
    const facts=loadUserFacts();
    const asksName=hasAny(n,[
      'jak ja sie nazywam','jak sie nazywam','jak mam na imie','jakie jest moje imie','moje imie','pamietasz moje imie','pamietasz jak sie nazywam','kim jestem',
      'what is my name','do you remember my name','who am i','how am i called',
      'hoe heet ik','wat is mijn naam','weet je mijn naam','wie ben ik'
    ]);
    if(asksName){
      const name=facts.user_name?.value;
      if(name){
        if(lang==='nl-NL') return `Je heet ${name}.`;
        if(lang==='en-US') return `Your name is ${name}.`;
        return `Nazywasz się ${name}.`;
      }
      if(lang==='nl-NL') return 'Ik heb je naam nog niet opgeslagen.';
      if(lang==='en-US') return 'I do not have your name saved yet.';
      return 'Nie mam jeszcze zapisanego Twojego imienia ani nazwy.';
    }

    const asksLocation=hasAny(n,['gdzie mieszkam','moje miejsce zamieszkania','moja miejscowosc','where do i live','my city','waar woon ik','mijn woonplaats']);
    if(asksLocation){
      const loc=facts.user_location?.value;
      if(loc){
        if(lang==='nl-NL') return `Je woont in ${loc}.`;
        if(lang==='en-US') return `You live in ${loc}.`;
        return `Mieszkasz w ${loc}.`;
      }
      if(lang==='nl-NL') return 'Ik heb je woonplaats nog niet opgeslagen.';
      if(lang==='en-US') return 'I do not have your location saved yet.';
      return 'Nie mam jeszcze zapisanego Twojego miejsca zamieszkania.';
    }

    const asksWork=hasAny(n,['gdzie pracuje','gdzie pracuję','dla kogo pracuje','dla kogo pracuję','jakie mam stanowisko','co robie zawodowo','co robię zawodowo','where do i work','what is my job','waar werk ik','wat is mijn functie']);
    if(asksWork){
      const workplace=facts.workplace?.value;
      const job=facts.job_title?.value;
      if(workplace || job){
        if(lang==='nl-NL') return [job?`Je functie is ${job}`:'', workplace?`je werkt bij ${workplace}`:''].filter(Boolean).join(' en ') + '.';
        if(lang==='en-US') return [job?`Your job is ${job}`:'', workplace?`you work at ${workplace}`:''].filter(Boolean).join(' and ') + '.';
        return [job?`Twoje stanowisko to ${job}`:'', workplace?`pracujesz w ${workplace}`:''].filter(Boolean).join(' i ') + '.';
      }
      if(lang==='nl-NL') return 'Ik heb je werkgegevens nog niet opgeslagen.';
      if(lang==='en-US') return 'I do not have your work details saved yet.';
      return 'Nie mam jeszcze zapisanych informacji o Twojej pracy.';
    }

    const asksCar=hasAny(n,['jakie mam auto','moje auto','czym jezdze','czym jeżdżę','what car do i have','my car','welke auto heb ik','mijn auto']);
    if(asksCar){
      const car=facts.car?.value;
      if(car){
        if(lang==='nl-NL') return `Je auto is ${car}.`;
        if(lang==='en-US') return `Your car is ${car}.`;
        return `Twoje auto to ${car}.`;
      }
      if(lang==='nl-NL') return 'Ik heb je auto nog niet opgeslagen.';
      if(lang==='en-US') return 'I do not have your car saved yet.';
      return 'Nie mam jeszcze zapisanego Twojego auta.';
    }

    const asksMemory=hasAny(n,['co o mnie pamietasz','co pamiętasz o mnie','moja pamiec','moja pamięć','what do you remember about me','what do you know about me','wat weet je over mij','wat onthoud je over mij']);
    if(asksMemory){
      const memory=loadAgentMemory();
      const profile=memory.profile||{};
      const lines=[];
      if(lang==='nl-NL'){
        if(profile.user_name?.value) lines.push(`Je naam is ${profile.user_name.value}`);
        if(profile.user_location?.value) lines.push(`je woont in ${profile.user_location.value}`);
        if(profile.workplace?.value) lines.push(`je werkt bij ${profile.workplace.value}`);
        if(profile.job_title?.value) lines.push(`je functie is ${profile.job_title.value}`);
        if(profile.car?.value) lines.push(`je auto is ${profile.car.value}`);
        if(profile.camera?.value) lines.push(`je camera is ${profile.camera.value}`);
        memory.notes?.slice(0,5).forEach(x=>x?.value && lines.push(x.value));
        return lines.length ? `Ik onthoud: ${lines.join('; ')}.` : 'Ik heb nog geen persoonlijke informatie opgeslagen.';
      }
      if(lang==='en-US'){
        if(profile.user_name?.value) lines.push(`your name is ${profile.user_name.value}`);
        if(profile.user_location?.value) lines.push(`you live in ${profile.user_location.value}`);
        if(profile.workplace?.value) lines.push(`you work at ${profile.workplace.value}`);
        if(profile.job_title?.value) lines.push(`your job is ${profile.job_title.value}`);
        if(profile.car?.value) lines.push(`your car is ${profile.car.value}`);
        if(profile.camera?.value) lines.push(`your camera is ${profile.camera.value}`);
        memory.notes?.slice(0,5).forEach(x=>x?.value && lines.push(x.value));
        return lines.length ? `I remember: ${lines.join('; ')}.` : 'I do not have any personal information saved yet.';
      }
      if(profile.user_name?.value) lines.push(`nazywasz się ${profile.user_name.value}`);
      if(profile.user_location?.value) lines.push(`mieszkasz w ${profile.user_location.value}`);
      if(profile.workplace?.value) lines.push(`pracujesz w ${profile.workplace.value}`);
      if(profile.job_title?.value) lines.push(`Twoje stanowisko to ${profile.job_title.value}`);
      if(profile.car?.value) lines.push(`Twoje auto to ${profile.car.value}`);
      if(profile.camera?.value) lines.push(`Twoja kamera to ${profile.camera.value}`);
      memory.notes?.slice(0,5).forEach(x=>x?.value && lines.push(x.value));
      return lines.length ? `Pamiętam: ${lines.join('; ')}.` : 'Nie mam jeszcze zapisanych informacji osobistych.';
    }
    return null;
  }
  function formatAgentDate(date, lang){
    const locale=lang==='nl-NL'?'nl-NL':lang==='en-US'?'en-US':'pl-PL';
    return new Intl.DateTimeFormat(locale,{timeZone:'Europe/Amsterdam',weekday:'long',year:'numeric',month:'long',day:'numeric'}).format(date);
  }
  function formatAgentDateTime(date, lang){
    const locale=lang==='nl-NL'?'nl-NL':lang==='en-US'?'en-US':'pl-PL';
    const datePart=new Intl.DateTimeFormat(locale,{timeZone:'Europe/Amsterdam',weekday:'long',year:'numeric',month:'long',day:'numeric'}).format(date);
    const timePart=new Intl.DateTimeFormat(locale,{timeZone:'Europe/Amsterdam',hour:'2-digit',minute:'2-digit'}).format(date);
    return `${datePart}, ${timePart} Europe/Amsterdam`;
  }
  function answerDateQuestion(text, lang){
    const n=normText(text);
    const asksDate=hasAny(n,['data','dzisiaj','jaki dzis','jaki dzien','dzisiejsza data','today date','what date','current date','datum','vandaag','welke dag']);
    const asksYesterday=hasAny(n,['wczoraj','yesterday','gisteren']);
    const asksTomorrow=hasAny(n,['jutro','tomorrow','morgen']);
    if(!asksDate && !asksYesterday && !asksTomorrow) return null;
    let offset=0;
    if(asksYesterday) offset=-1;
    if(asksTomorrow) offset=1;
    const target=new Date(Date.now()+offset*24*60*60*1000);
    const formatted=formatAgentDate(target,lang);
    if(lang==='nl-NL') return offset<0?`Gisteren was het ${formatted}.`:offset>0?`Morgen is het ${formatted}.`:`Vandaag is het ${formatted}.`;
    if(lang==='en-US') return offset<0?`Yesterday was ${formatted}.`:offset>0?`Tomorrow is ${formatted}.`:`Today is ${formatted}.`;
    return offset<0?`Wczoraj był ${formatted}.`:offset>0?`Jutro będzie ${formatted}.`:`Dzisiaj jest ${formatted}.`;
  }
  function userFactsForPrompt(lang){
    const memory=loadAgentMemory();
    const p=memory.profile||{};
    const lines=[];
    if(p.user_name?.value) lines.push(`User name: ${p.user_name.value}`);
    if(p.user_location?.value) lines.push(`User location: ${p.user_location.value}`);
    if(p.workplace?.value) lines.push(`Workplace: ${p.workplace.value}`);
    if(p.job_title?.value) lines.push(`Job title: ${p.job_title.value}`);
    if(p.car?.value) lines.push(`Car: ${p.car.value}`);
    if(p.camera?.value) lines.push(`Camera: ${p.camera.value}`);
    if(Array.isArray(memory.notes)) memory.notes.slice(0,20).forEach(x=>x?.value && lines.push(`Saved note: ${x.value}`));
    if(Array.isArray(memory.learned)) memory.learned.slice(0,20).forEach(x=>x?.value && lines.push(`Learned rule: ${x.value}`));
    const prefs=memory.preferences||{};
    const blocked=[...(prefs.dontSay||[]),...(prefs.dontRead||[])].map(x=>x?.value||x).filter(Boolean);
    if(blocked.length) lines.push('Do not say or read these expressions: '+blocked.join(', '));
    return lines.join('\n') || 'No saved user facts.';
  }

  function normText(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9ąćęłńóśźżäöüßéèàçij\s,.:-]/gi,' ').replace(/\s+/g,' ').trim();}
  function hasAny(n, arr){return arr.some(k=>n.includes(k));}
  function parseNumberAfter(txt, words){
    const n=normText(txt).replace(/,/g,'.');
    for(const w of words){
      const m=n.match(new RegExp(w+'\\s*(?:=|:|wynosi|is|van|voor|for)?\\s*([0-9]+(?:\\.[0-9]+)?)','i'));
      if(m) return parseFloat(m[1]);
    }
    const nums=(n.match(/[0-9]+(?:\.[0-9]+)?/g)||[]).map(Number).filter(Number.isFinite);
    return nums.length?nums[0]:null;
  }
  function parsePayRate(txt){return parseNumberAfter(txt,['pay rate','payrate','stawka','stawke','tarief','uurloon','hourly rate','rate']);}
  function parseHours(txt){
    const n=normText(txt).replace(/,/g,'.');
    const m=n.match(/([0-9]+(?:\.[0-9]+)?)\s*(?:h|uur|uren|godzin|hours)/i); if(m) return parseFloat(m[1]);
    return parseNumberAfter(txt,['uren','godzin','hours','hours per week','uur per week']);
  }
  function parseStaffing(txt){
    const n=normText(txt);
    if(/professional|\bps\b|2\.55|2,55/.test(n)) return 'PS';
    if(/general|\bgs\b|2\.45|2,45/.test(n)) return 'GS';
    return 'GS';
  }
  function fmtMoney(v,lang=getAgentLang()){return new Intl.NumberFormat(lang,{style:'currency',currency:'EUR',minimumFractionDigits:2,maximumFractionDigits:2}).format(v);}

  function clickByIdOrText(doc, ids=[], words=[]){
    for(const id of ids){ const el=doc.getElementById(id); if(el){ el.click(); return el; } }
    const candidates=$$('button,a,[role="button"],input[type="button"],input[type="submit"]',doc).filter(el=>el.offsetParent!==null || el.type==='button' || el.type==='submit');
    const normWords=words.map(normText);
    for(const el of candidates){
      const txt=normText(el.textContent||el.value||el.getAttribute('aria-label')||el.title||'');
      if(normWords.some(w=>txt.includes(w))){ el.click(); return el; }
    }
    return null;
  }
  function setValue(doc, selectors, value){
    if(value==null || value==='') return false;
    for(const sel of selectors){
      const el=doc.querySelector(sel);
      if(el){ el.value=String(value).replace('.',','); el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true})); return true; }
    }
    return false;
  }
  function scrollToText(doc, words){
    const w=words.map(normText);
    const nodes=$$('label,h2,h3,textarea,input,section,div',doc).filter(el=>w.some(x=>normText(el.textContent||el.placeholder||el.id||'').includes(x)));
    if(nodes[0]){ nodes[0].scrollIntoView({behavior:'smooth',block:'center'}); return true; }
    return false;
  }

  function runRecruiterCommand(text, lang, doc){
    const n=normText(text);
    const moduleText=normText((getModuleTitle()||'')+' '+(doc?.title||'')+' '+(doc?.body?.innerText||'').slice(0,1200));
    const inRecruiterModule=hasAny(moduleText,['ocena dopasowania cv','rekruter','recruiter','candidate','kandydat','cv']);
    const wantsAnalyze=hasAny(n,['ocen cv','oceń cv','ocena cv','analizuj cv','przeanalizuj cv','analyseer cv','analyze cv','analiza cv','match cv','sprawdz cv','sprawdź cv','jezyki','języki','languages','talen','kilometr','dojazd','commute','afstand','dopasowanie']);
    if(inRecruiterModule && (wantsAnalyze || hasAny(n,['ocen','oceń','analizuj','przeanalizuj','analyseer','analyze','match','dopasuj']))){
      const cv=(doc.querySelector('#cv-input,#cv-text, textarea[name*="cv"], textarea[placeholder*="CV"], textarea[placeholder*="cv"]')?.value||'').trim();
      const job=(doc.querySelector('#job-input,#job-text, textarea[name*="job"], textarea[name*="vacature"], textarea[placeholder*="functie"], textarea[placeholder*="vacature"], textarea[placeholder*="job"], textarea[placeholder*="oferta"], textarea[placeholder*="oferty"]')?.value||'').trim();
      if(!cv || !job) scrollToText(doc,[!cv?'cv':'job',!job?'functie':'']);
      clickByIdOrText(doc,['analyze-btn','analyse-btn','match-btn','cv-analyze-btn'],['analizuj','analyseer','analyze','beoordeel','oceń','ocen','match','dopasowanie','assess']);
      return ANSWERS.analyzeCv[lang];
    }
    if(hasAny(n,['dodaj cv','wklej cv','upload cv','voeg cv','add cv'])){ scrollToText(doc,['cv','drag','przeciągnij','sleep']); return ANSWERS.fillCv[lang]; }
    if(hasAny(n,['opis oferty','job description','functieomschrijving','vacature'])){ scrollToText(doc,['job','functie','oferty','vacature']); return lang==='nl-NL'?'Ik ga naar het veld voor de vacaturetekst.':lang==='en-US'?'I am moving to the job description field.':'Przechodzę do pola opisu oferty.'; }
    return null;
  }
  function runBillRateCommand(text, lang, doc){
    const n=normText(text);
    if(hasAny(n,['bill rate','pay rate','stawka','tarief','markup','gs','ps','general staffing','professional staffing','policz','bereken','calculate'])){
      const pay=parsePayRate(text);
      const type=parseStaffing(text);
      if(pay==null) return ANSWERS.billNeedRate[lang];
      try{ if(typeof doc.defaultView.rwVoiceFillRekentool==='function') doc.defaultView.rwVoiceFillRekentool({payRate:pay,staffingType:type}); }catch(e){}
      setValue(doc,['#pay','#payRate','#workerPayRate','#supplierRate','input[name="payRate"]'],pay);
      const sel=doc.querySelector('#type,#staffingType,select[name="type"],select[name="staffingType"]');
      if(sel){ const target=type==='PS'?'Professional Staffing':'General Staffing'; Array.from(sel.options).forEach(o=>{ if(normText(o.textContent+' '+o.value).includes(normText(target)) || o.value===type) sel.value=o.value; }); sel.dispatchEvent(new Event('change',{bubbles:true})); }
      clickByIdOrText(doc,['calculate','calcBtn','billRateBtn'],['calculate','bereken','policz','bill rate']);
      const markup=type==='PS'?2.55:2.45; const bill=pay*markup;
      return lang==='nl-NL'?`Pay rate ${fmtMoney(pay,lang)} × ${markup} (${type}) = bill rate ${fmtMoney(bill,lang)}.`:lang==='en-US'?`Pay rate ${fmtMoney(pay,lang)} × ${markup} (${type}) = bill rate ${fmtMoney(bill,lang)}.`:`Pay rate ${fmtMoney(pay,lang)} × ${markup} (${type}) = bill rate ${fmtMoney(bill,lang)}.`;
    }
    if(hasAny(n,['merit','podwyzka','podwyżka','increase','verhoging'])){ clickByIdOrText(doc,[],['merit','increase','podwyżka','verhoging']); return lang==='nl-NL'?'Ik open of bereken de merit increase-sectie.':lang==='en-US'?'I am opening or calculating the merit increase section.':'Otwieram albo liczę sekcję Merit Increase.'; }
    if(hasAny(n,['overname','przejecie','przejęcie','transfer fee','fee'])){ clickByIdOrText(doc,[],['overname','przejęcie','fee']); return lang==='nl-NL'?'Ik ga naar de overname fee calculator.':lang==='en-US'?'I am going to the takeover fee calculator.':'Przechodzę do kalkulatora opłaty za przejęcie.'; }
    if(hasAny(n,['consignatie','on call','on-call','dyzur','dyżur'])){ scrollToText(doc,['consignatie','on-call','dyżur']); return lang==='nl-NL'?'Ik ga naar de consignatie-sectie.':lang==='en-US'?'I am going to the on-call section.':'Przechodzę do sekcji Consignatie.'; }
    return null;
  }
  function runBudgetCommand(text, lang, doc){
    const n=normText(text);
    if(hasAny(n,['budget','contract','koszt','kosten','cost','policz','bereken','calculate'])){
      const rate=parsePayRate(text), hours=parseHours(text);
      setValue(doc,['#tarief','#billRate','#rate','#hourlyRate','input[name="tarief"]','input[name="rate"]'],rate);
      setValue(doc,['#uren','#hours','#hoursPerWeek','input[name="uren"]','input[name="hours"]'],hours);
      clickByIdOrText(doc,['calculateBtn','calcBtn','budgetBtn'],['bereken','calculate','policz','budget']);
      return ANSWERS.budget[lang];
    }
    return null;
  }
  function runIntakeCommand(text, lang, doc){
    const n=normText(text);
    if(hasAny(n,['pdf','export','download','pobierz','drukuj','print'])){ clickByIdOrText(doc,['downloadPdfBtn','exportBtn','printBtn'],['pdf','export','download','pobierz','print','drukuj']); return ANSWERS.exported[lang]; }
    if(hasAny(n,['wyczysc','wyczyść','clear','reset','wissen'])){ clickByIdOrText(doc,['clearBtn','resetBtn'],['clear','reset','wissen','wyczyść']); return lang==='nl-NL'?'Ik wis het formulier.':lang==='en-US'?'I am clearing the form.':'Czyszczę formularz.'; }
    return null;
  }
  function runDuplicateCommand(text, lang, doc){
    const n=normText(text);
    if(hasAny(n,['scan','skanuj','duplicates','duplikaty','duplicate','dubbele'])){ clickByIdOrText(doc,['scanBtn','startScanBtn'],['scan','skanuj','duplikaty','duplicates','dubbele']); return lang==='nl-NL'?'Ik start de scan op dubbele bestanden.':lang==='en-US'?'I am starting the duplicate scan.':'Uruchamiam skan duplikatów.'; }
    if(hasAny(n,['folder','map','dodaj folder','add folder'])){ clickByIdOrText(doc,['addFolderBtn','folderBtn'],['folder','map','dodaj']); return lang==='nl-NL'?'Ik open het toevoegen van een map.':lang==='en-US'?'I am opening folder selection.':'Otwieram dodawanie folderu.'; }
    if(hasAny(n,['delete','usun','usuń','verwijder'])){ clickByIdOrText(doc,['deleteBtn','removeBtn'],['delete','remove','usuń','verwijder']); return lang==='nl-NL'?'Ik start verwijderen volgens de selectie.':lang==='en-US'?'I am starting deletion based on the selection.':'Uruchamiam usuwanie według zaznaczenia.'; }
    return null;
  }
  function runMeetingCommand(text, lang, doc){
    const n=normText(text);
    if(hasAny(n,['export','excel','xlsx','pobierz','download'])){ clickByIdOrText(doc,['exportBtn','exportExcelBtn','downloadBtn'],['excel','export','download','pobierz']); return ANSWERS.exported[lang]; }
    if(hasAny(n,['dodaj','add','save','zapisz','opslaan','meeting','spotkanie'])){ clickByIdOrText(doc,['addBtn','saveBtn','addMeetingBtn'],['add','dodaj','save','zapisz','opslaan']); return lang==='nl-NL'?'Ik sla de meetingnotitie op.':lang==='en-US'?'I am saving the meeting note.':'Zapisuję notatkę ze spotkania.'; }
    return null;
  }

  function commandHelp(lang, title){
    const t=normText(title);
    let cmds=[];
    if(t.includes('rekruter')||t.includes('cv')) cmds=['przeanalizuj CV','sprawdź języki','sprawdź kilometry/dojazd','pokaż opis oferty'];
    else if(t.includes('bill')||t.includes('rekentool')||t.includes('rafa')) cmds=['policz bill rate dla pay rate 24 i GS','policz bill rate dla pay rate 24 i PS','otwórz merit increase','otwórz overname fee','pokaż consignatie'];
    else if(t.includes('budget')) cmds=['policz budżet','uzupełnij rate i godziny','odśwież kalkulację'];
    else if(t.includes('intake')) cmds=['pobierz PDF','wyczyść formularz','drukuj intake'];
    else if(t.includes('duplicate')) cmds=['skanuj duplikaty','dodaj folder','usuń zaznaczone'];
    else if(t.includes('meeting')) cmds=['dodaj spotkanie','eksportuj Excel','zapisz notatkę'];
    else cmds=['otwórz moduł CV','otwórz bill rate','zamknij asystenta','test głosu'];
    return ANSWERS.commandListIntro[lang]+cmds.join(', ')+'.';
  }
  function openModuleByCommand(text, lang){
    const n=normText(text);
    if(!hasAny(n,['otworz','otwórz','open','ga naar','sluit','zamknij'])) return null;
    const titles=['Agent Rekruter AI','New Bill Rate','Contract Budget Calculator','Intake Call','Duplicate Files Cleaner','Meeting Notes','Rafał Wilk'];
    const wanted=titles.find(t=>n.includes(normText(t)) || (t.includes('Rekruter')&&hasAny(n,['cv','rekruter','recruiter'])) || (t.includes('Bill')&&hasAny(n,['bill','rekentool','rate'])) || (t.includes('Budget')&&n.includes('budget')) || (t.includes('Intake')&&n.includes('intake')) || (t.includes('Duplicate')&&hasAny(n,['duplicate','duplikat'])) || (t.includes('Meeting')&&hasAny(n,['meeting','spotkan'])));
    if(wanted){
      const el=$$('button,a,div').filter(x=>x.offsetParent!==null).find(x=>normText(x.textContent).includes(normText(wanted)));
      if(el){ el.click(); return lang==='nl-NL'?`Ik open ${wanted}.`:lang==='en-US'?`I am opening ${wanted}.`:`Otwieram ${wanted}.`; }
    }
    return null;
  }

  
  function aiKey(){ return (localStorage.getItem(KEY_NAME)||'').trim(); }
  function detectApiProvider(key){
    const k=(key||'').trim();
    if(/^sk-ant-/i.test(k)) return 'anthropic';
    if(/^sk-(proj-|svcacct-)?/i.test(k) || /^sk-[A-Za-z0-9]/.test(k)) return 'openai';
    return localStorage.getItem(PROVIDER_NAME)||'openai';
  }
  function apiProvider(){
    const saved=(localStorage.getItem(PROVIDER_NAME)||'').trim();
    if(saved==='openai'||saved==='anthropic') return saved;
    return detectApiProvider(aiKey());
  }
  function providerLabel(){ return apiProvider()==='anthropic' ? 'Anthropic' : 'OpenAI'; }
  function compactText(txt,max=9000){ return String(txt||'').replace(/\s+/g,' ').trim().slice(0,max); }
  function collectModuleContext(){
    const d=getActiveDoc();
    const parts=[];
    try{
      parts.push(moduleProfile());
      parts.push('LEARNED CUSTOM SKILLS FOR THIS MODULE:\n'+learnedSkillsForPrompt(getModuleTitle()));
      if(d){
        const dt=compactText(d.innerText||d.textContent||'',12000);
        if(dt) parts.push('MODULE TEXT: '+dt);
        const values=$$('input, textarea, select', d).slice(0,120).map(el=>{
          const name=(el.getAttribute('aria-label')||el.name||el.id||el.placeholder||'field').trim();
          let val='';
          if(el.tagName==='SELECT') val=el.options[el.selectedIndex]?.text||el.value||'';
          else val=el.value||el.getAttribute('value')||'';
          return val ? (name+': '+val) : '';
        }).filter(Boolean);
        if(values.length) parts.push('CURRENT FIELD VALUES: '+values.join(' | '));
      }
    }catch(e){}
    return compactText(parts.join('\n'),14000);
  }
  function extractOpenAIText(data){
    if(data?.output_text) return String(data.output_text).trim();
    try{
      const out=[];
      (data.output||[]).forEach(item=>(item.content||[]).forEach(c=>{ if(c.text) out.push(c.text); if(c.type==='output_text'&&c.text) out.push(c.text); }));
      return out.join('\n').trim();
    }catch(e){ return ''; }
  }
  function aiLangName(){
    const l=getAgentLang();
    if(l==='nl-NL') return 'Dutch / Nederlands';
    if(l==='en-US') return 'English';
    return 'Polish / Polski';
  }
  function moduleRouteProfile(title, doc){
    const t=normText(title||'');
    const moduleText=normText(doc?.body?.innerText || doc?.innerText || doc?.textContent || '').slice(0,12000);
    const base=[];
    let key='general';
    if(t.includes('rekruter')||t.includes('cv')||moduleText.includes('ocena dopasowania cv')||moduleText.includes('cv match')){
      key='recruiter';
      base.push('cv','resume','kandydat','kandydatka','candidate','sollicitant','język','jezyk','language','taal','talen','oferta','job','functie','vacature','opis stanowiska','job description','dopasowanie','match','skill','kompetencje','kilometr','kilometry','km','dojazd','afstand','commute','boxmeer','msd','adres','lokalizacja','analiza','analyse','analyze','ocena','oceń','ocen','przeanalizuj','sprawdź języki','sprawdz jezyki','sprawdź kilometry','sprawdz kilometry');
    } else if(t.includes('bill')||t.includes('rate')||t.includes('rekentool')||moduleText.includes('new bill rate')){
      key='billrate';
      base.push('bill','rate','pay','cao','salary','salaris','stawka','skala','scale','markup','multiplier','general staffing','professional staffing','gs','ps','2.45','2,45','2.55','2,55','shift','overtime','deferred','consignatie','weekend','merit','increase','podwyżka','podwyzka','overname','przejęcie','przejecie','agency','supplier');
    } else if(t.includes('budget')||moduleText.includes('contract budget')){
      key='budget';
      base.push('budget','contract','umowa','koszt','cost','hours','godziny','stawka','rate','pay','bill','duration','duur','start','end','fte','scenario','scenariusz');
    } else if(t.includes('intake')||moduleText.includes('intake call')){
      key='intake';
      base.push('intake','call','rozmowa','manager','hiring','vacancy','vacature','wakat','job','candidate','kandydat','questions','pytania','notatki');
    } else if(t.includes('duplicate')||t.includes('duplikat')||moduleText.includes('duplicate files')){
      key='duplicate';
      base.push('duplicate','duplikat','plik','file','folder','scan','skanuj','clean','delete','usuń','usun','archive','archiwum');
    } else if(t.includes('meeting')||t.includes('spotkan')||moduleText.includes('meeting notes')){
      key='meeting';
      base.push('meeting','spotkanie','notatki','notes','manager','mail','email','follow-up','rapport','raport','export','excel','today','dzisiaj','week','month');
    }
    const visibleWords=(moduleText.match(/[a-ząćęłńóśźż0-9]{4,}/gi)||[]).slice(0,250);
    return {key, terms:Array.from(new Set(base.concat(visibleWords)))};
  }

  function isModuleRelatedQuery(raw, doc, title){
    if(!doc) return false;
    const n=normText(raw);
    if(!n) return false;
    const profile=moduleRouteProfile(title,doc);
    const strongExternal=['internet','online','web','google','wyszukaj w internecie','sprawdź w internecie','sprawdz w internecie','zoek online','search online','aktualna cena','aktualne ceny','pogoda','weather','kurs walut','news','wiadomości','wiadomosci'];
    if(hasAny(n,strongExternal)) return false;
    const moduleMeta=['ten moduł','ten modul','w tym module','this module','dit module','co robi ten','jak działa ten','jak dziala ten','opis modułu','opis modulu','pokaż opcje','pokaz opcje','jakie komendy','co mogę tutaj','co moge tutaj'];
    if(hasAny(n,moduleMeta)) return true;
    const universalModuleActions=['oblicz','policz','calculate','bereken','wpisz','uzupełnij','uzupelnij','fill','vul','zapisz','save','export','eksport','usuń','usun','delete','open','otwórz','otworz','kliknij','click','pokaż','pokaz','show','analizuj','przeanalizuj','analyseer','analyze','oceń','ocen','beoordeel','sprawdź','sprawdz','check'];
    const hasModuleTerm=profile.terms.some(term=>term && term.length>2 && n.includes(normText(term)));
    if(hasModuleTerm) return true;
    if(profile.key!=='general' && hasAny(n,universalModuleActions)) return true;
    return false;
  }

  function answerLooksUnresolved(answer, lang){
    const ui=UI[lang]||UI['pl-PL'];
    const a=normText(answer||'');
    if(!a) return true;
    return a===normText(ui.unknown)||a===normText(ui.noModule)||a.includes('nie ma jeszcze przypisanej akcji')||a.includes('no assigned action')||a.includes('geen toegewezen actie')||a.includes('rozumiem polecenie')||a.includes('i understand the command')||a.includes('ik begrijp de opdracht');
  }

  function moduleContextFallback(raw, lang, doc, title){
    const profile=moduleRouteProfile(title,doc);
    const rn=normText(raw);
    if(profile.key==='recruiter'){
      if(hasAny(rn,['język','jezyk','language','taal','talen'])) return lang==='nl-NL'?'Ik controleer de talen uit het CV tegenover de vacature-eisen en toon match/mismatch in deze module.':lang==='en-US'?'I check the CV languages against the job requirements and show match/mismatch inside this module.':'Sprawdzam języki z CV względem wymagań z oferty i pokazuję match / brak match w tym module.';
      if(hasAny(rn,['kilometr','km','dojazd','afstand','commute'])) return lang==='nl-NL'?'Ik haal de woonplaats uit het CV en vergelijk de afstand met MSD Boxmeer, voor zover de CV-tekst dit bevat.':lang==='en-US'?'I extract the candidate location from the CV and compare the distance to MSD Boxmeer when the CV text contains that information.':'Pobieram lokalizację kandydata z CV i porównuję dojazd do MSD Boxmeer, jeżeli CV zawiera takie dane.';
      return lang==='nl-NL'?'Ik gebruik eerst de gegevens uit Agent Rekruter AI: CV, functieomschrijving, talen, locatie en matchscore. Plaats CV en vacaturetekst en gebruik daarna Analyseer match.':lang==='en-US'?'I use Agent Recruiter AI first: CV, job description, languages, location and match score. Add the CV and job description, then run Analyze match.':'Najpierw używam danych z modułu Agent Rekruter AI: CV, opisu funkcji, języków, lokalizacji i wyniku dopasowania. Wklej CV oraz opis funkcji, a potem uruchom analizę dopasowania.';
    }
    if(profile.key==='billrate') return lang==='nl-NL'?'Ik antwoord op basis van de huidige New Bill Rate-module: CAO, pay rate, markup, Bill Rate, toeslagen, merit increase en overname fee.':lang==='en-US'?'I answer from the current New Bill Rate module: CAO, pay rate, markup, bill rate, allowances, merit increase and takeover fee.':'Odpowiadam na podstawie aktualnego modułu New Bill Rate: CAO, pay rate, markup, Bill Rate, dodatki, merit increase i overname fee.';
    if(profile.key==='budget') return lang==='nl-NL'?'Ik gebruik eerst de velden uit Contract Budget Calculator en bereken scenario’s op basis van contractduur, uren, tarief en kosten.':lang==='en-US'?'I use the Contract Budget Calculator fields first and calculate scenarios from duration, hours, rate and cost.':'Najpierw używam pól z Contract Budget Calculator i liczę scenariusze na podstawie czasu trwania, godzin, stawki oraz kosztów.';
    if(profile.key==='intake') return lang==='nl-NL'?'Ik gebruik eerst de gegevens uit Intake Call: vacature, manager, kandidaatprofiel, vragen en notities.':lang==='en-US'?'I use the Intake Call data first: vacancy, manager, candidate profile, questions and notes.':'Najpierw używam danych z Intake Call: wakatu, managera, profilu kandydata, pytań i notatek.';
    if(profile.key==='duplicate') return lang==='nl-NL'?'Ik gebruik eerst Duplicate Files Cleaner: map kiezen, scannen, duplicaten tonen en opruimen.':lang==='en-US'?'I use Duplicate Files Cleaner first: choose folder, scan, show duplicates and clean them.':'Najpierw używam Duplicate Files Cleaner: wybór folderu, skanowanie, pokazanie duplikatów i czyszczenie.';
    if(profile.key==='meeting') return lang==='nl-NL'?'Ik gebruik eerst Meeting Notes: notities, e-mails, opvolging en export naar rapport/Excel.':lang==='en-US'?'I use Meeting Notes first: notes, emails, follow-up and export to report/Excel.':'Najpierw używam Meeting Notes: notatek, maili, follow-up i eksportu do raportu/Excela.';
    return (UI[lang]||UI['pl-PL']).unknown;
  }

  function useInternetAIFor(raw, localAnswer, doc, title, lang){
    const n=normText(raw);
    if(!n) return false;
    if(isModuleRelatedQuery(raw,doc,title)) return false;
    if(answerLooksUnresolved(localAnswer,lang)) return true;
    const externalTriggers=['internet','online','web','aktualn','najnowsz','news','wiadomości','wiadomosci','pogoda','weather','kurs','cena','price','google','wyszukaj','search','zoek'];
    return hasAny(n,externalTriggers);
  }

  function buildAIPrompt(raw){
    const lang=getAgentLang();
    const moduleTitle=getModuleTitle();
    const context=collectModuleContext();
    const currentDateTime=formatAgentDateTime(new Date(),lang);
    const userMemory=userFactsForPrompt(lang);
    const brainMemory=brainForPrompt(lang,moduleTitle);
    const moduleLang=detectActiveModuleLangStrict();
    const langMode=moduleLang ? 'active module language has absolute priority' : 'no active module language; use the user question language';
    return `You are the AI assistant inside Rafal Wilk Digital Workshop ©. Always answer in ${aiLangName()}.

LANGUAGE CONTROLLER:
1. Current output language: ${aiLangName()}.
2. Language mode: ${langMode}.
3. If an active module has a selected language, that module language overrides the language of the user question, the browser and any previous answer.
4. In a Polish module answer only in Polish. In an English module answer only in English. In a Dutch module answer only in Dutch.
5. Do not read raw UI labels in the wrong language. If the visible module context contains labels in another language, translate or explain them in the current output language instead of quoting them literally.
6. For voice output, keep the answer clean and speakable in one language.

ROUTING RULES:
1. The active module is the first and most important source of truth.
2. If the user's question or command is related to the active module, answer from the active module context and do not use generic knowledge.
3. Only when the question is clearly unrelated to the active module, answer from general/internet knowledge.
4. Never invent data that is not present in the module context. If a value is missing, say exactly what is missing.
5. For CV/recruitment questions, extract CV data, required languages, candidate languages, city/location and commute logic from the supplied text when available.
6. Answer short, concrete and practical.
7. Return plain text only. Do not use Markdown, emojis, icons, stars, bullets, numbered lists, code fences, tables, headings or decorative symbols. Write normal sentences only.
8. Use the current local date and time below. Never guess the date from training data.
9. Use saved user facts when the user asks about himself.
10. Use AGENT BRAIN MEMORY below as persistent learning memory. Corrections override older answers.
11. If the brain says a previous answer or behavior was wrong, do not repeat it.
12. The voice must remain unchanged; only reasoning and memory may improve.

Current local date and time: ${currentDateTime}
Saved user facts:
${userMemory}

${brainMemory}

Current module: ${moduleTitle}
Visible module context:
${context}

User question:
${raw}`;
  }

  async function askOpenAIWithWeb(raw){
    const key=aiKey();
    const lang=getAgentLang();
    const ui=UI[lang]||UI['pl-PL'];
    if(!key) return ui.noApiForInternet || ui.apiMissing;
    const user=`User command: ${raw}\n\nCurrent module: ${getModuleTitle()}\n\nVisible module context:\n${collectModuleContext()}`;
    try{
      const body={model:'gpt-4o-mini',tools:[{type:'web_search_preview'}],input:[{role:'system',content:buildAIPrompt(raw)},{role:'user',content:user}],max_output_tokens:900};
      let r=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify(body)});
      if(!r.ok && r.status!==401){
        const errTxt=await r.text().catch(()=>'' );
        if(r.status===400 && /web_search|tool|unsupported/i.test(errTxt)){
          delete body.tools;
          r=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify(body)});
        }else return (ui.apiError||'API error: ')+('OpenAI HTTP '+r.status+' '+errTxt.slice(0,140));
      }
      const data=await r.json().catch(()=>({}));
      if(!r.ok) return (ui.apiError||'API error: ')+(data?.error?.message||('OpenAI HTTP '+r.status));
      return extractOpenAIText(data) || (ui.noAiText||'No AI answer received.');
    }catch(e){ return (ui.apiConnectionError||'OpenAI API connection error: ')+(e?.message||e); }
  }
  async function askAnthropicWithWeb(raw){
    const key=aiKey();
    const lang=getAgentLang();
    const ui=UI[lang]||UI['pl-PL'];
    if(!key) return ui.noApiForInternet || ui.apiMissing;
    const user=`User command: ${raw}\n\nCurrent module: ${getModuleTitle()}\n\nVisible module context:\n${collectModuleContext()}`;
    try{
      const baseBody={model:'claude-haiku-4-5',max_tokens:900,system:buildAIPrompt(raw),messages:[{role:'user',content:user}]};
      let body=Object.assign({},baseBody,{tools:[{type:'web_search_20250305',name:'web_search',max_uses:3}]});
      let r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify(body)});
      if(!r.ok && r.status!==401){
        const errTxt=await r.text().catch(()=>'' );
        if(r.status===400 && /web_search|tool|unsupported/i.test(errTxt)){
          r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify(baseBody)});
        }else return (ui.apiError||'API error: ')+('Anthropic HTTP '+r.status+' '+errTxt.slice(0,140));
      }
      const data=await r.json().catch(()=>({}));
      if(!r.ok) return (ui.apiError||'API error: ')+(data?.error?.message||('Anthropic HTTP '+r.status));
      return (Array.isArray(data.content)?data.content.map(x=>x.text||'').join(' ').trim():'') || (ui.noAiText||'No AI answer received.');
    }catch(e){ return (ui.apiConnectionError||'AI API connection error: ')+(e?.message||e); }
  }
  async function askAIWithWeb(raw){
    return apiProvider()==='anthropic' ? askAnthropicWithWeb(raw) : askOpenAIWithWeb(raw);
  }

  
  const SKILLS_KEY='rwVoiceAgentLearnedSkillsV1';
  function moduleKey(title){ return normText(title||'global-module').slice(0,90) || 'global'; }
  function readSkills(){
    try{ return JSON.parse(localStorage.getItem(SKILLS_KEY)||'[]'); }catch(e){ return []; }
  }
  function writeSkills(list){ localStorage.setItem(SKILLS_KEY, JSON.stringify(list.slice(-350))); }
  function skillAnswerSaved(lang,title){ return ''; }
  function parseLearningCommand(text, title, lang){
    const original=String(text||'').trim();
    const n=normText(original);
    const starters=['naucz sie','naucz się','zapamietaj','zapamiętaj','dodaj umiejetnosc','dodaj umiejętność','learn that','remember that','add skill','onthoud','leer dat','voeg vaardigheid toe'];
    const hit=starters.find(x=>n.startsWith(normText(x)) || n.includes(normText(x)+':'));
    if(!hit) return null;
    let body=original.replace(new RegExp('^\\s*(naucz\\s+si[eę]|zapami[eę]taj|dodaj\\s+umiej[eę]tno[sś][cć]|learn\\s+that|remember\\s+that|add\\s+skill|onthoud|leer\\s+dat|voeg\\s+vaardigheid\\s+toe)\\s*:?\\s*','i'),'').trim();
    let trigger='', response='', note=body;
    let m=body.match(/["„“']([^"”']{3,160})["”']\s*(?:=>|->|=)\s*["„“']?(.{3,700})["”']?$/i);
    if(m){ trigger=m[1].trim(); response=m[2].trim(); }
    if(!trigger){
      m=body.match(/(?:je[sś]li|jesli|kiedy|gdy|als|when|if).{0,80}?["„“']([^"”']{3,160})["”'].{0,80}?(?:odpowiedz|powiedz|antwoord|zeg|answer|say).{0,20}?["„“']([^"”']{3,700})["”']/i);
      if(m){ trigger=m[1].trim(); response=m[2].trim(); }
    }
    if(!trigger && body.includes('=>')){
      const parts=body.split('=>'); trigger=parts[0].trim(); response=parts.slice(1).join('=>').trim();
    }
    if(trigger && response) note=`When user asks: ${trigger} | Answer/action: ${response}`;
    return {module:moduleKey(title), moduleTitle:title||'', lang, trigger, response, note, createdAt:new Date().toISOString()};
  }
  function saveLearnedSkill(skill){
    const item={...skill,ts:new Date().toISOString()};
    const list=readSkills();
    list.push(item);
    writeSkills(list);
    const memory=loadAgentMemory();
    memory.learned=Array.isArray(memory.learned)?memory.learned:[];
    const label=item.trigger ? `${item.trigger} -> ${item.response||item.note||''}` : (item.note||'');
    if(label && !memory.learned.some(x=>normText(x.value)===normText(label))){
      memory.learned.unshift(memoryFact(label,item.lang||getAgentLang(),item.source||'manual',0.9));
      memory.learned=memory.learned.slice(0,300);
      addMemoryTimeline(memory,'skill','skill',label,item.lang||getAgentLang(),item.source||'manual');
      saveAgentMemory(memory);
    }
    return item;
  }
  function significantWords(s){ return normText(s).split(/\s+/).filter(w=>w.length>3 && !['jaki','jakie','jestem','module','modul','pytam','powiedz','odpowiedz','please','what','when','tell','about','deze','voor','jij','het'].includes(w)); }
  function skillMatchesQuestion(trigger, question){
    const t=normText(trigger), q=normText(question);
    if(!t || !q) return false;
    if(q.includes(t) || t.includes(q)) return true;
    const w=significantWords(t); if(!w.length) return false;
    const hits=w.filter(x=>q.includes(x)).length;
    return hits/Math.max(w.length,1)>=0.72;
  }
  function findLearnedAnswer(question, title){
    const scope=moduleKey(title); const list=readSkills().slice().reverse();
    for(const sk of list){
      if(sk.response && (sk.module===scope || sk.module==='global') && skillMatchesQuestion(sk.trigger,question)) return sk.response;
    }
    return null;
  }
  function learnedSkillsForPrompt(title){
    const scope=moduleKey(title); const list=readSkills().filter(sk=>sk.module===scope || sk.module==='global').slice(-60);
    if(!list.length) return 'No learned custom skills yet.';
    return list.map((sk,i)=>`${i+1}. Module: ${sk.moduleTitle||sk.module}; Trigger: ${sk.trigger||'-'}; Skill: ${sk.note||sk.response||''}`).join('\n');
  }
  function moduleProfile(){
    const d=getActiveDoc(); const title=getModuleTitle();
    if(!d) return `Active module: none`;
    const heads=$$('h1,h2,h3,h4,.title,.section-title,.card-title,.module-title,.label',d).map(x=>compactText(x.textContent,90)).filter(Boolean).slice(0,35);
    const fields=$$('input,textarea,select',d).map(el=>compactText(el.getAttribute('aria-label')||el.name||el.id||el.placeholder||el.closest('label')?.textContent||'field',70)).filter(Boolean).slice(0,70);
    const buttons=$$('button,.btn,[role="button"]',d).map(b=>compactText(b.textContent||b.getAttribute('aria-label')||'',70)).filter(Boolean).slice(0,45);
    return [`Active module: ${title||'unknown'}`, heads.length?'Visible sections: '+heads.join(' | '):'', fields.length?'Inputs/selectors: '+fields.join(' | '):'', buttons.length?'Actions/buttons: '+buttons.join(' | '):''].filter(Boolean).join('\n');
  }
  function describeActiveModule(lang){
    const title=getModuleTitle(); const d=getActiveDoc();
    if(!d) return UI[lang].noModule;
    const prof=moduleProfile();
    const skills=readSkills().filter(sk=>sk.module===moduleKey(title)||sk.module==='global').length;
    if(lang==='nl-NL') return `Je bent in module: ${title}. Ik zie deze structuur: ${prof}. Ik heb ${skills} aangeleerde vaardigheid/vaardigheden voor deze context opgeslagen.`;
    if(lang==='en-US') return `You are in module: ${title}. I can see this structure: ${prof}. I have ${skills} learned skill(s) stored for this context.`;
    return `Jesteś w module: ${title}. Widzę strukturę tego modułu: ${prof}. Dla tego kontekstu mam zapisanych umiejętności: ${skills}.`;
  }


  /* ══════════════════════════════════════
     VOICE AGENT BRAIN — local learning layer
     Cel: agent pamięta fakty, zasady, korekty, błędy i wnioski.
     Głos nie jest zmieniany. Brain wpływa tylko na rozumowanie i pamięć.
  ══════════════════════════════════════ */
  const BRAIN_KEY='rwVoiceAgentBrainV2';
  const BRAIN_MAX={rules:160,knowledge:260,corrections:180,mistakes:180,reflections:220,interactions:160,modules:80};

  function emptyAgentBrain(){
    return {
      version:2,
      identity:'Rafal Wilk Digital Workshop © voice agent brain',
      createdAt:new Date().toISOString(),
      updatedAt:new Date().toISOString(),
      goals:[
        'Answer briefly and concretely.',
        'Use the active module first.',
        'Remember user-confirmed facts and preferences.',
        'Learn from corrections and avoid repeating known mistakes.',
        'Keep the existing voice unchanged in PL, NL and EN.'
      ],
      rules:[],
      knowledge:[],
      corrections:[],
      mistakes:[],
      reflections:[],
      interactions:[],
      modules:{},
      counters:{commands:0,remembered:0,corrections:0,mistakes:0,successful:0,unresolved:0}
    };
  }

  function normalizeBrainShape(brain){
    const base=emptyAgentBrain();
    const b=(brain&&typeof brain==='object')?brain:{};
    const out=Object.assign(base,b);
    out.goals=Array.isArray(out.goals)?out.goals:base.goals;
    ['rules','knowledge','corrections','mistakes','reflections','interactions'].forEach(k=>{ out[k]=Array.isArray(out[k])?out[k]:[]; });
    out.modules=(out.modules&&typeof out.modules==='object')?out.modules:{};
    out.counters=(out.counters&&typeof out.counters==='object')?Object.assign(base.counters,out.counters):base.counters;
    out.version=2;
    out.updatedAt=out.updatedAt||new Date().toISOString();
    return out;
  }

  function loadAgentBrain(){
    try{ return normalizeBrainShape(JSON.parse(localStorage.getItem(BRAIN_KEY)||'null')); }
    catch(e){ return emptyAgentBrain(); }
  }

  function trimBrain(brain){
    Object.entries(BRAIN_MAX).forEach(([k,max])=>{
      if(Array.isArray(brain[k])) brain[k]=brain[k].slice(0,max);
    });
    const moduleKeys=Object.keys(brain.modules||{});
    if(moduleKeys.length>BRAIN_MAX.modules){
      moduleKeys.sort((a,b)=>String(brain.modules[b]?.updatedAt||'').localeCompare(String(brain.modules[a]?.updatedAt||'')));
      moduleKeys.slice(BRAIN_MAX.modules).forEach(k=>delete brain.modules[k]);
    }
    return brain;
  }

  function saveAgentBrain(brain){
    const b=trimBrain(normalizeBrainShape(brain));
    b.updatedAt=new Date().toISOString();
    localStorage.setItem(BRAIN_KEY,JSON.stringify(b));
    return b;
  }

  function brainId(){
    try{ return crypto.randomUUID(); }catch(e){ return 'brain_'+Date.now()+'_'+Math.random().toString(16).slice(2); }
  }

  function brainText(value){ return String(value||'').replace(/\s+/g,' ').trim(); }

  function brainItem(value,lang,source,module,extra){
    return Object.assign({
      id:brainId(),
      value:brainText(value),
      lang:lang||getAgentLang(),
      source:source||'manual',
      module:module||getModuleTitle()||'global',
      createdAt:new Date().toISOString(),
      confidence:0.92
    },extra||{});
  }

  function brainModuleBucket(brain,moduleTitle){
    const key=moduleKey(moduleTitle||getModuleTitle()||'global');
    if(!brain.modules[key]) brain.modules[key]={title:moduleTitle||getModuleTitle()||'global',rules:[],mistakes:[],learned:[],updatedAt:new Date().toISOString()};
    return brain.modules[key];
  }

  function addUniqueBrainItem(list,item){
    if(!item.value) return false;
    const nv=normText(item.value);
    const exists=list.some(x=>normText(x.value)===nv || (x.trigger&&item.trigger&&normText(x.trigger)===normText(item.trigger)));
    if(exists) return false;
    list.unshift(item);
    return true;
  }

  function rememberBrain(type,value,lang,source,module,extra){
    const brain=loadAgentBrain();
    const item=brainItem(value,lang,source,module,extra);
    if(type==='rule') addUniqueBrainItem(brain.rules,item);
    else if(type==='correction'){
      if(addUniqueBrainItem(brain.corrections,item)) brain.counters.corrections=(brain.counters.corrections||0)+1;
      const mb=brainModuleBucket(brain,module); addUniqueBrainItem(mb.rules,item); mb.updatedAt=new Date().toISOString();
    }else if(type==='mistake'){
      if(addUniqueBrainItem(brain.mistakes,item)) brain.counters.mistakes=(brain.counters.mistakes||0)+1;
      const mb=brainModuleBucket(brain,module); addUniqueBrainItem(mb.mistakes,item); mb.updatedAt=new Date().toISOString();
    }else if(type==='reflection') addUniqueBrainItem(brain.reflections,item);
    else addUniqueBrainItem(brain.knowledge,item);
    brain.counters.remembered=(brain.counters.remembered||0)+1;
    saveAgentBrain(brain);
    return item;
  }

  function latestSavedAnswer(){
    try{ const list=JSON.parse(localStorage.getItem('rw_ai_answer_memory')||'[]'); return Array.isArray(list)?list[0]:null; }
    catch(e){ return null; }
  }

  function extractBrainLearningBody(text){
    let body=String(text||'').trim();
    body=body.replace(/^\s*(brain|mózg|mozg|pamięć|pamiec)\s*[:,-]?\s*/i,'');
    body=body.replace(/^\s*(naucz\s+si[eę]|zapami[eę]taj|zapisz|dodaj\s+do\s+m[oó]zgu|dodaj\s+zasad[eę]|od\s+teraz|nast[eę]pnym\s+razem|remember|learn|store|save|onthoud|leer)\s*(to|that|że|ze)?\s*:?\s*/i,'');
    return brainText(body);
  }

  function isBrainStatusQuestion(text){
    const n=normText(text);
    return hasAny(n,['pokaż mózg','pokaz mozg','pokaż mozg','pokaz mózg','co masz w mózgu','co masz w mozgu','czego się nauczyłeś','czego sie nauczyles','czego sie nauczyłeś','jakie błędy','jakie bledy','co pamiętasz jako agent','co pamietasz jako agent','brain status','show brain','what have you learned','mistakes you made','wat heb je geleerd','toon brein']);
  }

  function isCorrectionInput(text){
    const n=normText(text);
    return hasAny(n,['źle','zle','błąd','blad','błędnie','blednie','nie tak','to nie działa','to nie dziala','nie działa','nie dziala','poprawka','popraw to','następnym razem','nastepnym razem','od teraz rób','od teraz rob','nie odpowiadaj tak','nie mow tak','nie mów tak','wrong','mistake','incorrect','does not work','fix it','next time','from now on','fout','verkeerd','werkt niet','volgende keer']);
  }

  function isExplicitBrainLearning(text){
    const n=normText(text);
    return hasAny(n,['naucz się','naucz sie','zapamiętaj','zapamietaj','zapisz że','zapisz ze','dodaj do mózgu','dodaj do mozgu','dodaj zasadę','dodaj zasade','od teraz','remember that','learn that','store this','save this','onthoud dat','leer dat']);
  }

  function brainSavedAnswer(lang){
    if(lang==='nl-NL') return 'Ik onthoud het.';
    if(lang==='en-US') return 'I will remember.';
    return 'Zapamiętam.';
  }

  function answerBrainStatus(lang){
    const brain=loadAgentBrain();
    const lastRules=brain.rules.slice(0,4).map(x=>x.value).filter(Boolean).join(' | ');
    const lastCorrections=brain.corrections.slice(0,4).map(x=>x.value).filter(Boolean).join(' | ');
    const lastMistakes=brain.mistakes.slice(0,4).map(x=>x.value).filter(Boolean).join(' | ');
    const c=brain.counters||{};
    if(lang==='nl-NL') return `Brain actief. Opgeslagen: ${c.remembered||0}. Correcties: ${c.corrections||0}. Fouten: ${c.mistakes||0}. Belangrijkste regels: ${lastRules||'nog geen'}. Laatste correcties: ${lastCorrections||'nog geen'}. Laatste fouten: ${lastMistakes||'nog geen'}.`;
    if(lang==='en-US') return `Brain active. Stored items: ${c.remembered||0}. Corrections: ${c.corrections||0}. Mistakes: ${c.mistakes||0}. Key rules: ${lastRules||'none yet'}. Recent corrections: ${lastCorrections||'none yet'}. Recent mistakes: ${lastMistakes||'none yet'}.`;
    return `Mózg jest aktywny. Zapisane elementy: ${c.remembered||0}. Korekty: ${c.corrections||0}. Błędy: ${c.mistakes||0}. Najważniejsze zasady: ${lastRules||'brak'}. Ostatnie korekty: ${lastCorrections||'brak'}. Ostatnie błędy: ${lastMistakes||'brak'}.`;
  }

  function handleBrainCommand(text,lang,moduleTitle,source){
    if(isBrainStatusQuestion(text)) return answerBrainStatus(lang);
    if(isCorrectionInput(text)){
      const previous=latestSavedAnswer();
      const body=extractBrainLearningBody(text) || text;
      const value=previous ? `User correction: ${body}. Previous answer to avoid repeating: ${previous.answer||''}. Previous command: ${previous.command||''}.` : `User correction: ${body}.`;
      rememberBrain('correction',value,lang,source,moduleTitle,{previousAnswer:previous?.answer||'',previousCommand:previous?.command||''});
      rememberBrain('mistake',`Potential mistake reported by user in module ${moduleTitle||'global'}: ${body}`,lang,source,moduleTitle);
      return brainSavedAnswer(lang);
    }
    if(isExplicitBrainLearning(text)){
      const body=extractBrainLearningBody(text);
      if(body && body.length>2){
        const type=hasAny(normText(text),['zasad','rule','reguła','regula','od teraz','from now on','next time','następnym razem','nastepnym razem'])?'rule':'knowledge';
        rememberBrain(type,body,lang,source,moduleTitle);
        return brainSavedAnswer(lang);
      }
    }
    return null;
  }

  function brainRememberUserFact(fact,lang,source,moduleTitle){
    if(!fact) return;
    const val=brainText(fact.value||fact);
    if(!val) return;
    rememberBrain('knowledge',`User fact/preference: ${val}`,lang,source||'manual',moduleTitle||getModuleTitle(),{category:fact.category||'user_fact',confidence:fact.confidence||0.93});
  }

  function brainRememberSkill(skill,moduleTitle){
    if(!skill) return;
    const val=skill.trigger&&skill.response ? `Learned skill. If user says: ${skill.trigger}, answer/action: ${skill.response}` : (skill.note||'');
    if(val) rememberBrain('rule',val,skill.lang||getAgentLang(),skill.source||'manual',moduleTitle||skill.moduleTitle||getModuleTitle(),{trigger:skill.trigger||'',response:skill.response||''});
  }

  function summarizeBrainList(list,max){
    return (list||[]).slice(0,max).map((x,i)=>`${i+1}. ${x.value}`).join('\n') || 'None.';
  }

  function brainForPrompt(lang,moduleTitle){
    const brain=loadAgentBrain();
    const key=moduleKey(moduleTitle||getModuleTitle()||'global');
    const moduleBrain=brain.modules?.[key];
    return `AGENT BRAIN MEMORY. Use this as persistent local memory. Corrections have higher priority than older rules. Do not repeat mistakes listed here.
Goals:
${(brain.goals||[]).map((x,i)=>`${i+1}. ${x}`).join('\n')}

Global rules:
${summarizeBrainList(brain.rules,14)}

Confirmed knowledge:
${summarizeBrainList(brain.knowledge,18)}

User corrections:
${summarizeBrainList(brain.corrections,16)}

Known mistakes to avoid:
${summarizeBrainList(brain.mistakes,14)}

Recent reflections:
${summarizeBrainList(brain.reflections,10)}

Module-specific memory for ${moduleTitle||'current module'}:
${moduleBrain ? [summarizeBrainList(moduleBrain.rules,8),summarizeBrainList(moduleBrain.mistakes,6),summarizeBrainList(moduleBrain.learned,6)].join('\n') : 'None.'}`;
  }

  function brainObserveInteraction(raw,answer,lang,source,related,unresolved,moduleTitle){
    const brain=loadAgentBrain();
    brain.counters.commands=(brain.counters.commands||0)+1;
    if(unresolved) brain.counters.unresolved=(brain.counters.unresolved||0)+1; else brain.counters.successful=(brain.counters.successful||0)+1;
    const item=brainItem(`User: ${raw} | Agent: ${String(answer||'').slice(0,700)}`,lang,source,moduleTitle,{related:!!related,unresolved:!!unresolved});
    brain.interactions.unshift(item);
    if(unresolved){
      const mistake=brainItem(`Unresolved command. Module: ${moduleTitle||'global'}. User said: ${raw}. Agent answer: ${answer||''}`,lang,source,moduleTitle,{kind:'unresolved'});
      addUniqueBrainItem(brain.mistakes,mistake);
      const mb=brainModuleBucket(brain,moduleTitle); addUniqueBrainItem(mb.mistakes,mistake); mb.updatedAt=new Date().toISOString();
    }
    const n=normText(raw);
    if(hasAny(n,['dlaczego','why','waarom','jak','how','co zrobić','co zrobic']) && !unresolved){
      addUniqueBrainItem(brain.reflections,brainItem(`Successful answer pattern in ${moduleTitle||'global'}: for question "${raw}" agent answered shortly and practically.`,lang,source,moduleTitle));
    }
    saveAgentBrain(brain);
  }

  function saveAnswerToMemory(raw, answer, lang, source){
    if(!raw || !answer) return;
    const item={command:raw, answer:answer, lang:lang, source:source, module:getModuleTitle(), ts:new Date().toISOString()};
    const key='rw_ai_answer_memory';
    let list=[];
    try{ list=JSON.parse(localStorage.getItem(key)||'[]'); }catch(e){ list=[]; }
    list.unshift(item);
    localStorage.setItem(key, JSON.stringify(list.slice(0,300)));
  }

  async function executeCommand(raw, source='manual'){
    const text=String(raw||'').trim(); if(!text) return;
    const lang = resolveAgentLanguageForCommand(text, source);
    const label=UI[lang] || UI[getAgentLang()] || UI['pl-PL'];
    const title=getModuleTitle();
    if(source==='manual') { saveManualCommand(text,title,lang,'manual'); }
    log(label.you,text);

    if(rememberSilentPreferenceFromText(text,lang)){
      state(label.ready, title?`${label.module}: ${title}`:label.hint);
      return;
    }

    const rememberedFact=rememberUserFactFromText(text,lang,source);
    if(rememberedFact && !isQuestionLike(text)){
      brainRememberUserFact(rememberedFact,lang,source,title);
      if(rememberedFact.__isNew) memorySavedFeedback();
      state(label.ready, title?`${label.module}: ${title}`:label.hint);
      return;
    }

    const brainCommand=handleBrainCommand(text,lang,title,source);
    if(brainCommand){
      const clean=cleanTextForChat(brainCommand);
      log(label.agent, clean);
      await speak(clean, lang);
      state(label.ready, title?`${label.module}: ${title}`:label.hint);
      return;
    }

    const learnedCommand=parseLearningCommand(text,title,lang);
    if(learnedCommand){
      saveLearnedSkill(learnedCommand);
      brainRememberSkill(learnedCommand,title);
      memorySavedFeedback();
      state(label.ready, title?`${label.module}: ${title}`:label.hint);
      return;
    }

    state(label.thinking, title?`${label.module}: ${title}`:'', 'thinking');
    const n=normText(text);
    let answer=null;

    const memoryAnswer=answerUserMemoryQuestion(text,lang);
    if(memoryAnswer) answer=memoryAnswer;
    const brainMemoryAnswer=isBrainStatusQuestion(text) ? answerBrainStatus(lang) : null;
    if(!answer && brainMemoryAnswer) answer=brainMemoryAnswer;
    const dateAnswer=answerDateQuestion(text,lang);
    if(!answer && dateAnswer) answer=dateAnswer;

    const learnedDirect=findLearnedAnswer(text,title);
    if(!answer && learnedDirect) answer=learnedDirect;

    if(!answer && hasAny(n,['gdzie jestem','jaki modul','jaki moduł','co robi ten modul','co robi ten moduł','co ten modul robi','co ten moduł robi','where am i','what module','what does this module do','welke module','waar ben ik','wat doet deze module'])) answer=describeActiveModule(lang);
    if(!answer && hasAny(n,['test glosu','test głosu','voice test','stemtest'])) answer=label.voiceTest;
    if(!answer && hasAny(n,['pomoc','help','commando','komendy','polecenia'])) answer=commandHelp(lang,title);
    if(!answer && hasAny(n,['zamknij asystenta','close assistant','sluit agent','zamknij panel'])){ ($('#rwAgentOverlay')||$('#rwVoicePanel'))?.classList.remove('open'); answer=lang==='nl-NL'?'Ik sluit het spraakpaneel.':lang==='en-US'?'I am closing the voice panel.':'Zamykam panel głosowy.'; }
    if(!answer) answer=openModuleByCommand(text,lang);

    const d=getActiveDoc();
    const related=d ? isModuleRelatedQuery(text,d,title) : false;

    // Priorytet 1: aktywny moduł i jego własna logika.
    if(!answer && d && related){
      const mt=normText(title + ' ' + (d.title||'') + ' ' + (d.body?.innerText||''));
      if(mt.includes('rekruter')||mt.includes('cv')) answer=runRecruiterCommand(text,lang,d);
      else if(mt.includes('bill')||mt.includes('rekentool')||mt.includes('rafal')||mt.includes('rafał')) answer=runBillRateCommand(text,lang,d);
      else if(mt.includes('budget')||mt.includes('contract')) answer=runBudgetCommand(text,lang,d);
      else if(mt.includes('intake')) answer=runIntakeCommand(text,lang,d);
      else if(mt.includes('duplicate')||mt.includes('duplikat')) answer=runDuplicateCommand(text,lang,d);
      else if(mt.includes('meeting')||mt.includes('spotkan')) answer=runMeetingCommand(text,lang,d);
      else answer=runBillRateCommand(text,lang,d) || runRecruiterCommand(text,lang,d) || runBudgetCommand(text,lang,d) || runIntakeCommand(text,lang,d) || runDuplicateCommand(text,lang,d) || runMeetingCommand(text,lang,d);

      if(answerLooksUnresolved(answer,lang)) answer=moduleContextFallback(text,lang,d,title);
    }

    // Priorytet 2: dopiero jeśli to NIE jest pytanie do aktywnego modułu, użyj internetu/API.
    if(!answer){
      if(!d || !related){
        answer=label.unknown;
        if(useInternetAIFor(text,answer,d,title,lang)){
          state(label.thinking, title?`${label.module}: ${title}`:'', 'thinking');
          const aiAnswer=await askAIWithWeb(text);
          if(aiAnswer) answer=aiAnswer;
        }
      }else{
        answer=moduleContextFallback(text,lang,d,title);
      }
    }

    answer=answer || label.unknown;
    answer = cleanTextForChat(answer);
    log(label.agent, answer);
    await speak(answer, lang);
    const unresolved=answerLooksUnresolved(answer,lang);
    brainObserveInteraction(text,answer,lang,source,related,unresolved,title);
    saveAnswerToMemory(text,answer,lang,related?'module':'internet');
    state(label.ready, title?`${label.module}: ${title}`:label.hint);
  }

  function bestBrowserVoice(lang){
    const voices=window.speechSynthesis?.getVoices?.()||[];
    const l=lang.toLowerCase().slice(0,2);
    const pool=voices.filter(v=>(v.lang||'').toLowerCase().startsWith(l));
    const prefer={
      'pl-PL':['marek online','zofia online','paulina online','adam online','natural','online','marek','zofia','paulina','microsoft'],
      'nl-NL':['colette online','fenna online','maarten online','natural','online','microsoft','google'],
      'en-US':['guy online','aria online','jenny online','natural','online','microsoft','google','samantha']
    }[lang] || [];
    const scored=pool.map(v=>{ const name=(v.name+' '+v.voiceURI+' '+v.lang).toLowerCase(); let score=0; prefer.forEach((p,i)=>{ if(name.includes(p)) score+=100-i; }); if(name.includes('compact')) score-=100; if(name.includes('legacy')) score-=100; return {v,score}; }).sort((a,b)=>b.score-a.score);
    return (scored[0]?.v) || pool[0] || voices[0] || null;
  }
  function speechParams(lang){
    if(lang==='pl-PL') return {rate:0.93,pitch:0.86,volume:1};
    if(lang==='nl-NL') return {rate:0.96,pitch:0.92,volume:1};
    return {rate:0.98,pitch:0.94,volume:1};
  }
  function ttsInstructions(lang){
    if(lang==='pl-PL') return 'Mów po polsku jak naturalny, ciepły, dorosły męski lektor. Głos niski, płynny i bardzo wyraźny. Bez robotycznego rytmu, bez sylabizowania, bez przesadnych pauz. Naturalna polska intonacja i akcent zdaniowy.';
    if(lang==='nl-NL') return 'Spreek natuurlijk Nederlands met een warme, duidelijke volwassen stem. Vloeiend, rustig en zonder robotisch ritme.';
    return 'Speak natural English with a warm, clear adult voice. Fluent, calm and non-robotic.';
  }

  function cleanAgentOutputText(text, mode){
    const forSpeech = mode === 'speech';
    let t = String(text || '');

    // Odpowiedź agenta ma być normalnym tekstem: bez markdownu, emoji, ikon i technicznych znaków.
    t = t.replace(/```[\s\S]*?```/g, ' ');                 // bloki kodu
    t = t.replace(/`([^`]*)`/g, '$1');                       // inline code
    t = t.replace(/<[^>]+>/g, ' ');                          // HTML
    t = t.replace(/https?:\/\/\S+|www\.\S+/gi, ' ');       // linki
    t = t.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ');          // obrazy markdown
    t = t.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');        // link markdown -> sam tekst

    // Usuń emoji i piktogramy, żeby w czacie i głosie nie było „kciuk do góry”, „gwiazdka”, itp.
    t = t.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ' ');

    // Usuń formatowanie Markdown. Zostaw treść zdań.
    t = t.replace(/^\s{0,3}#{1,6}\s+/gm, '');              // nagłówki
    t = t.replace(/^\s*[-*•▪▫–—]+\s+/gm, '');             // listy punktowane
    t = t.replace(/^\s*\d+[.)]\s+/gm, '');                // listy numerowane
    t = t.replace(/[>*_~#|\[\]{}]/g, ' ');                 // symbole formatowania

    // Zamień dekoracyjne znaki na zwykłą składnię tekstową.
    t = t.replace(/\s*[→⇒➜]\s*/g, ', ');
    t = t.replace(/\s*&\s*/g, ' i ');
    t = t.replace(/\s*=\s*/g, forSpeech ? ' równa się ' : ' = ');
    t = t.replace(/\s*\+\s*/g, forSpeech ? ' plus ' : ' + ');

    // Linie list zamień na normalne zdania, nie zostawiaj technicznego układu.
    t = t.replace(/-{3,}/g, '. ');
    t = t.replace(/\n{2,}/g, '. ');
    t = t.replace(/\n/g, '. ');

    // Końcowe czyszczenie spacji i interpunkcji.
    t = t.replace(/\s+/g, ' ');
    t = t.replace(/\s+([,.!?;:])/g, '$1');
    t = t.replace(/([,.!?]){2,}/g, '$1');
    t = t.replace(/:\s*\./g, ': ');
    t = t.replace(/\s+\)/g, ')');
    t = t.replace(/\(\s+/g, '(');
    t = t.replace(/\s+\./g, '.');
    t = t.replace(/\.\s*\./g, '.');
    t = t.trim();
    t = applyMemoryPreferencesToText(t);

    // Bezpiecznik dla głosu: głos ma czytać odpowiedź, nie długi raport.
    if (forSpeech && t.length > 900) {
      const cut = t.slice(0, 900);
      const last = Math.max(cut.lastIndexOf('.'), cut.lastIndexOf('!'), cut.lastIndexOf('?'));
      t = (last > 350 ? cut.slice(0, last + 1) : cut).trim();
    }

    // Bezpiecznik dla czatu: zachowaj pełniejszą odpowiedź, ale bez bardzo długiego śmietnika technicznego.
    if (!forSpeech && t.length > 4500) {
      t = t.slice(0, 4500).trim() + '...';
    }

    return t || (forSpeech ? 'Nie mam treści do odczytania.' : '');
  }

  function cleanTextForChat(text){
    return cleanAgentOutputText(text, 'chat');
  }

  function cleanTextForSpeech(text){
    return cleanAgentOutputText(text, 'speech');
  }
  async function premiumSpeak(text, lang){
    const key=(localStorage.getItem(KEY_NAME)||'').trim(); if(!key) return false;
    try{
      if(currentAudio){ currentAudio.pause(); currentAudio=null; }
      const voice=lang==='pl-PL'?'onyx':(lang==='nl-NL'?'ash':'verse');
      const res=await fetch('https://api.openai.com/v1/audio/speech',{
        method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},
        body:JSON.stringify({model:'gpt-4o-mini-tts',voice,input:cleanTextForSpeech(text).slice(0,3500),format:'mp3',instructions:ttsInstructions(lang)})
      });
      if(!res.ok) throw new Error(await res.text());
      const blob=await res.blob(); const url=URL.createObjectURL(blob);
      currentAudio=new Audio(url); state(tr('speaking',lang),'Premium TTS','speaking');
      await currentAudio.play();
      currentAudio.onended=()=>{URL.revokeObjectURL(url); currentAudio=null;};
      return true;
    }catch(e){
      console.warn('Premium TTS failed, fallback to browser voice',e);
      return false;
    }
  }
  async function speak(text, lang=getAgentLang()){
    lang=normalizeLang(lang)||getAgentLang();
    if(await premiumSpeak(text,lang)) return;
    return new Promise(resolve=>{
      try{
        const ss=window.speechSynthesis; if(!ss){resolve();return;}
        ss.cancel(); const speechText=cleanTextForSpeech(text); const u=new SpeechSynthesisUtterance(speechText); u.lang=lang;
        const v=bestBrowserVoice(lang); if(v) u.voice=v;
        Object.assign(u,speechParams(lang));
        u.onstart=()=>state(tr('speaking',lang),v?`${v.name}`:'Browser TTS','speaking');
        u.onend=()=>resolve(); u.onerror=()=>{log(tr('system',lang),tr('blocked',lang)); resolve();};
        ss.speak(u);
      }catch(e){resolve();}
    });
  }

  function setupRecognition(){
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){ log(tr('system'), 'SpeechRecognition is not available in this browser.'); return; }
    recog=new SR(); recog.continuous=false; recog.interimResults=false; recog.maxAlternatives=1;
    recog.onresult=e=>{ const txt=e.results?.[0]?.[0]?.transcript||''; executeCommand(txt,'voice'); };
    recog.onerror=e=>{ log(tr('system'), e.error||'Recognition error'); stopListening(false); };
    recog.onend=()=>stopListening(false);
  }
  function startListening(){
    syncLangFromPlatform(true); const lang=getAgentLang(); const u=UI[lang];
    if(!recog) setupRecognition(); if(!recog) return;
    try{ recog.lang=lang; recog.start(); listening=true; $('#rwListenBtn').textContent=u.stop; state(u.listening,u.hint,'listening'); }catch(e){ listening=false; }
  }
  function stopListening(abort=true){
    if(recog && abort){ try{recog.abort();}catch(e){} }
    listening=false; const lang=getAgentLang(); $('#rwListenBtn') && ($('#rwListenBtn').textContent=UI[lang].listen); state(UI[lang].ready,UI[lang].hint);
  }
  function stopSpeaking(){
    try{ if(currentAudio){ currentAudio.pause(); currentAudio.currentTime=0; currentAudio=null; } }catch(e){}
    try{ if(window.speechSynthesis) window.speechSynthesis.cancel(); }catch(e){}
    const lang=getAgentLang();
    state(UI[lang].ready,UI[lang].hint);
  }

  function updateApiBox(){
    const key=(localStorage.getItem(KEY_NAME)||'').trim(); const box=$('#rwApiBox'), badge=$('#rwKeyOk');
    if(box){ box.hidden=true; box.style.display='none'; }
    if(badge){ badge.style.display='none'; }
  }
  function saveKey(){
    const key=$('#rwApiKey')?.value.trim()||''; const lang=getAgentLang();
    if(!key){ log(UI[lang].system,UI[lang].apiMissing); return; }
    localStorage.setItem(KEY_NAME,key); $('#rwApiKey').value=''; updateApiBox(); log(UI[lang].system,UI[lang].apiActive);
  }

  let rwUiBound=false;
  function bindUI(){
    if(rwUiBound) return; rwUiBound=true;
    const open=$('#rwVoiceLauncher')||$('#rwVoiceOpen'), panel=$('#rwAgentOverlay')||$('#rwVoicePanel'), close=$('#rwAgentClose')||$('#rwVoiceClose');
    if(open) open.onclick=()=>{ panel?.classList.add('open'); syncLangFromPlatform(true); buildMemoryList(); };
    if(close) close.onclick=()=>{ stopSpeaking(); stopListening(false); panel?.classList.remove('open'); panel?.classList.remove('rw-mini'); };
    $('#rwListenBtn')?.addEventListener('click',()=>listening?stopListening():startListening());
    $('#rwTestVoiceBtn')?.addEventListener('click',()=>{ syncLangFromPlatform(true); const lang=getAgentLang(); const cleanTest=cleanTextForChat(UI[lang].voiceTest); log(UI[lang].agent,cleanTest); speak(cleanTest,lang); });
    $('#rwSendBtn')?.addEventListener('click',()=>{ const input=$('#rwCommandInput'); const value=input?.value||''; executeCommand(value,'manual'); if(input) input.value=''; });
    $('#rwCommandInput')?.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); executeCommand(e.currentTarget.value,'manual'); e.currentTarget.value=''; } });
    $('#rwRefreshBtn')?.addEventListener('click',()=>{ syncLangFromPlatform(true); log(UI[getAgentLang()].system,(getModuleTitle()?`${UI[getAgentLang()].module}: ${getModuleTitle()}`:UI[getAgentLang()].noModule)); });
    $('#rwLang')?.addEventListener('change',e=>setAgentLang(e.target.value,{propagate:true}));
    $('#rwStopSpeakBtn')?.addEventListener('click',stopSpeaking);
    $('#rwSaveKey')?.addEventListener('click',saveKey);

    // Synchronizacja po kliknięciach języka na platformie i w modułach.
    document.addEventListener('click',()=>setTimeout(()=>syncLangFromPlatform(),120),true);
    document.addEventListener('change',()=>setTimeout(()=>syncLangFromPlatform(),120),true);
    setInterval(()=>syncLangFromPlatform(),900);

    // drag panel by header
    const head=$('.rw-head');
    if(head && panel){
      head.addEventListener('mousedown',e=>{ if(e.target.closest('button')) return; dragging=true; const r=panel.getBoundingClientRect(); dx=e.clientX-r.left; dy=e.clientY-r.top; panel.style.right='auto'; panel.style.bottom='auto'; panel.style.left=r.left+'px'; panel.style.top=r.top+'px'; });
      document.addEventListener('mousemove',e=>{ if(!dragging) return; panel.style.left=Math.max(8,Math.min(innerWidth-80,e.clientX-dx))+'px'; panel.style.top=Math.max(8,Math.min(innerHeight-80,e.clientY-dy))+'px'; });
      document.addEventListener('mouseup',()=>dragging=false);
    }
  }

  if(window.speechSynthesis) window.speechSynthesis.onvoiceschanged=()=>{ if(getAgentLang()==='pl-PL') updateApiBox(); };
  window.RWAgentMemory={
    read:()=>loadAgentMemory(),
    clear:()=>{ localStorage.removeItem('rwVoiceAgentPermanentMemoryV2'); localStorage.removeItem('rwVoiceAgentUserFactsV1'); return true; },
    export:()=>JSON.stringify(loadAgentMemory(),null,2),
    import:(json)=>{ const data=typeof json==='string'?JSON.parse(json):json; saveAgentMemory(normalizeMemoryShape(data)); return true; }
  };
  try{ if(navigator.storage && navigator.storage.persist) navigator.storage.persist(); }catch(e){}

  document.addEventListener('DOMContentLoaded',()=>{ bindUI(); setAgentLang(detectPlatformLang()); buildMemoryList(); setupRecognition(); updateApiBox(); });
  if(document.readyState!=='loading'){ bindUI(); setAgentLang(detectPlatformLang()); buildMemoryList(); setupRecognition(); updateApiBox(); }
})();
