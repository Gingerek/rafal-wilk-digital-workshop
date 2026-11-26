/* Contract Budget Calculator UI v2: restricted to its embedded iframe. */
(function(){
 'use strict';
 if(window.__rwContractBudgetLayoutInstalled) return;
 window.__rwContractBudgetLayoutInstalled=true;
 var frameId='appframe', installedDoc=null, lastSignature='', INTERVAL=450, DAY_MS=86400000;
 var strings={
  en:{brand:'CONTRACT FINANCE',contract:'Contract details',contractDesc:'Rate, weekly schedule and contract period.',settings:'Budget settings',settingsDesc:'Budget limit and optional calculation overrides.',clear:'Reset inputs',duration:'Contract duration',budget:'Financial summary',status:'Budget health',days:'Working days',assumptions:'Duration is calculated Monday–Friday, including start and end dates. Public holidays are not deducted. The planned budget uses the module’s selected week-rounding rule.',manual:'Manual weeks override is active. It affects the existing budget estimate, not total contract hours.',automatic:'Leave manual weeks empty to calculate the budget from contract dates.'},
  nl:{brand:'CONTRACTFINANCIËN',contract:'Contractgegevens',contractDesc:'Tarief, werkuren en contractperiode.',settings:'Budgetinstellingen',settingsDesc:'Beschikbaar budget en optionele berekeningskeuzes.',clear:'Invoer wissen',duration:'Contractduur',budget:'Budgetoverzicht',status:'Budgetstatus',days:'Werkdagen',assumptions:'Contractduur: maandag t/m vrijdag, inclusief begin- en einddatum. Feestdagen worden niet afgetrokken. Het geplande budget volgt de gekozen afronding van weken.',manual:'Handmatig aantal weken actief. Dit beïnvloedt de bestaande budgetraming, niet de contracturen.',automatic:'Laat handmatige weken leeg om op basis van de contractdatums te berekenen.'},
  pl:{brand:'BUDŻET KONTRAKTU',contract:'Dane kontraktu',contractDesc:'Stawka, wymiar czasu pracy i okres kontraktu.',settings:'Ustawienia budżetu',settingsDesc:'Dostępny budżet i opcjonalne ustawienia wyliczeń.',clear:'Wyczyść pola',duration:'Czas trwania kontraktu',budget:'Podsumowanie finansowe',status:'Status budżetu',days:'Dni robocze',assumptions:'Godziny liczone są od poniedziałku do piątku, z uwzględnieniem obu dat. Święta nie są odejmowane. Planowany budżet uwzględnia dotychczasowy sposób zaokrąglania tygodni.',manual:'Aktywne ręczne nadpisanie tygodni. Wpływa na budżet, ale nie na liczbę godzin kontraktu.',automatic:'Zostaw ręczne tygodnie puste, aby obliczyć budżet na podstawie dat.'}
 };
 function getLang(doc){
  var raw=String(doc.getElementById('langSelect')?.value||'en').toLowerCase();
  return Object.prototype.hasOwnProperty.call(strings,raw)?raw:'en';
 }
 function readDate(value){
  var m=String(value||'').trim().match(/^(\d{1,2})[-./](\d{1,2})[-./](\d{4})$/);
  var y,mo,d;
  if(m){d=Number(m[1]);mo=Number(m[2]);y=Number(m[3]);}
  else{m=String(value||'').trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!m)return null;y=Number(m[1]);mo=Number(m[2]);d=Number(m[3]);}
  if(y<1900||y>2200) return null;
  var time=Date.UTC(y,mo-1,d),dt=new Date(time);
  return dt.getUTCFullYear()===y&&dt.getUTCMonth()===mo-1&&dt.getUTCDate()===d?time:null;
 }
 function workDays(a,b){
  if(a===null||b===null||b<a)return null;
  var n=Math.round((b-a)/DAY_MS)+1,full=Math.floor(n/7),sum=full*5,day=new Date(a).getUTCDay();
  for(var i=0;i<n%7;i++){var w=(day+i)%7;if(w!==0&&w!==6)sum++;}
  return sum;
 }
 function element(doc,tag,cls,text){
  var el=doc.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;
 }
 function section(doc,type,ids){
  var sec=element(doc,'section','rw-budget-section rw-budget-section-'+type);
  var head=element(doc,'div','rw-budget-section-head');
  var labels=element(doc,'div','rw-section-heading');
  labels.append(element(doc,'span','rw-section-kicker',type==='contract'?'01 / CONTRACT':'02 / BUDGET'));
  var title=element(doc,'h2','rw-section-title');title.setAttribute('data-rw-ui',type+'Title');labels.append(title);
  var desc=element(doc,'div','rw-section-desc');desc.setAttribute('data-rw-ui',type+'Desc');labels.append(desc);
  head.append(labels);
  if(type==='settings'){
   var clear=doc.getElementById('clearFieldsBtn')?.closest('.btn-row');
   if(clear){clear.classList.add('rw-budget-clear');head.append(clear);}
  }
  sec.append(head);
  var grid=element(doc,'div','rw-budget-input-grid');
  ids.forEach(function(id){var row=doc.getElementById(id)?.closest('.row');if(row)grid.append(row);});
  sec.append(grid);
  if(type==='settings'){
    var checkbox=doc.getElementById('ceil')?.closest('.switch');
    if(checkbox){checkbox.classList.add('rw-budget-override');sec.append(checkbox);}
    var hint=element(doc,'div','rw-override-note');hint.setAttribute('data-rw-ui','override');sec.append(hint);
  }
  return sec;
 }
 function heading(doc,type){
  var h=element(doc,'div','rw-budget-group rw-budget-group-'+type);
  h.setAttribute('data-rw-ui',type+'Group');return h;
 }
 function getTile(doc,id){return doc.getElementById(id)?.closest('.tile')||null;}
 function initDocument(doc){
  if(!doc?.body || !doc.getElementById('uren') || !doc.querySelector('#resultCard .kpi'))return;
  if(doc.documentElement.classList.contains('rw-budget-pro')){installedDoc=doc;return;}
  var head=doc.head || doc.documentElement;
  doc.documentElement.classList.add('rw-budget-pro');
  var pageTitle=doc.querySelector('.viewport > header h1');
  if(pageTitle&&!doc.getElementById('rwBudgetEyebrow')){
   var eyebrow=element(doc,'span','rw-budget-eyebrow');eyebrow.id='rwBudgetEyebrow';eyebrow.setAttribute('data-rw-ui','brand');pageTitle.parentNode.insertBefore(eyebrow,pageTitle);
  }
  var leftBody=doc.querySelector('.layout > .card:first-child > .body');
  if(leftBody){
    var first=section(doc,'contract',['tarief','uren','start','eind']);
    var second=section(doc,'settings',['budget','wekenMan']);
    leftBody.append(first,second);
  }
  var kpi=doc.querySelector('#resultCard .kpi');
  var weeks=getTile(doc,'weeksUsed');
  var hours=doc.getElementById('rwContractHoursTile');
  var planned=getTile(doc,'planned'),remaining=getTile(doc,'suma');
  var status=getTile(doc,'status'),usage=getTile(doc,'percentText');
  var days=element(doc,'div','tile rw-tile-workingdays');
  days.id='rwWorkingDaysTile';
  var dh=element(doc,'h3');dh.setAttribute('data-rw-ui','daysTitle');days.append(dh);
  var dv=element(doc,'div','big');
  var num=element(doc,'span');num.id='rwWorkingDaysValue';num.setAttribute('aria-live','polite');num.textContent='—';dv.append(num);days.append(dv);
  if(weeks)weeks.classList.add('rw-tile-weeks');
  if(hours)hours.classList.add('rw-tile-hours');
  if(planned)planned.classList.add('rw-tile-planned');
  if(remaining)remaining.classList.add('rw-tile-remaining');
  if(status)status.classList.add('rw-tile-status');
  if(usage)usage.classList.add('rw-tile-usage');
  var sections=[
   heading(doc,'duration'),weeks,days,hours,
   heading(doc,'budget'),planned,remaining,
   heading(doc,'status'),status,usage
  ];
  sections.forEach(function(part){if(part)kpi.append(part);});
  var note=element(doc,'div','rw-calc-note');note.setAttribute('data-rw-ui','assumptions');
  kpi.insertAdjacentElement('afterend',note);
  installedDoc=doc;lastSignature='';
 }
 function syncLegacyDates(doc){
   // Original budget calculator uses hidden ISO fields; typing visible dates
   // alone did not update those fields, producing 0 weeks and 0 planned budget.
   var changed=false;
   [['start','startISO'],['eind','eindISO']].forEach(function(pair){
    var source=doc.getElementById(pair[0]),hidden=doc.getElementById(pair[1]);
    if(!source||!hidden)return;
    var time=readDate(source.value);
    var iso=time===null?'':new Date(time).toISOString().slice(0,10);
    // Do not overwrite selected dates; only synchronize valid visible input.
    if(time===null && String(source.value||'').trim())return;
    if(hidden.value!==iso){hidden.value=iso;changed=true;}
   });
   if(changed){
     var input=doc.getElementById('eind');
     if(input)input.dispatchEvent(new Event('change',{bubbles:true}));
   }
 }
 function refresh(doc){
   if(!doc.documentElement.classList.contains('rw-budget-pro'))return;
   var lang=getLang(doc),t=strings[lang];
   var names={brand:'brand',contractTitle:'contract',contractDesc:'contractDesc',settingsTitle:'settings',settingsDesc:'settingsDesc',durationGroup:'duration',budgetGroup:'budget',statusGroup:'status',daysTitle:'days',assumptions:'assumptions'};
   Object.keys(names).forEach(function(key){
     var n=doc.querySelector('[data-rw-ui="'+key+'"]');
     if(n&&n.textContent!==t[names[key]])n.textContent=t[names[key]];
   });
   var hint=doc.querySelector('[data-rw-ui="override"]');
   if(hint)hint.textContent=doc.getElementById('wekenMan')?.value.trim()?t.manual:t.automatic;
   var a=readDate(doc.getElementById('start')?.value),b=readDate(doc.getElementById('eind')?.value);
   var days=workDays(a,b),number=doc.getElementById('rwWorkingDaysValue');
   if(number)number.textContent=days===null?'—':new Intl.NumberFormat(lang==='en'?'en-GB':lang==='pl'?'pl-PL':'nl-NL').format(days);
 }
 function tick(){
  var frame=document.getElementById(frameId);
  if(!frame || !frame.classList.contains('show'))return;
  try{
   var doc=frame.contentDocument;
   if(!doc||!doc.getElementById('uren')||!doc.getElementById('eind'))return;
   initDocument(doc);
   syncLegacyDates(doc);
   refresh(doc);
  }catch(e){if(window.console&&console.warn)console.warn('Budget layout skipped:',e);}
 }
 function init(){
   var f=document.getElementById(frameId);
   if(f)f.addEventListener('load',function(){installedDoc=null;lastSignature='';setTimeout(tick,70);setTimeout(tick,500);});
   tick();setInterval(tick,INTERVAL);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
 else init();
})();
