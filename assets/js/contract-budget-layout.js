/* Contract Budget Calculator UI v2: restricted to its embedded iframe. */
(function(){
 'use strict';
 if(window.__rwContractBudgetLayoutInstalled) return;
 window.__rwContractBudgetLayoutInstalled=true;
 var frameId='appframe', installedDoc=null, lastSignature='', INTERVAL=450, DAY_MS=86400000;
 var STYLE_CSS = "\n/* Contract Budget 2026 — isolated UI layer, loaded only in original calculator iframe. */\nhtml.rw-budget-pro body{background:#f4f7fc!important;color:#14233b!important;font-family:Inter,Poppins,system-ui,-apple-system,Segoe UI,sans-serif!important}\nhtml.rw-budget-pro .fit-wrap{min-height:100vh!important;max-width:none!important;overflow:visible!important}\nhtml.rw-budget-pro .viewport{display:block!important;max-width:1580px!important;margin:0 auto!important;padding:30px 28px 44px!important;min-height:0!important;box-sizing:border-box}\nhtml.rw-budget-pro .viewport > header{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:20px!important;padding:0 4px 22px!important;margin-bottom:24px!important;border-bottom:1px solid #dfe7f1!important;background:transparent!important}\nhtml.rw-budget-pro .viewport > header h1{font-size:clamp(27px,2.4vw,36px)!important;font-weight:800!important;letter-spacing:-1.05px!important;line-height:1.13!important;color:#142c49!important}\nhtml.rw-budget-pro .rw-budget-eyebrow{display:block;font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#3986b9;margin-bottom:6px}\nhtml.rw-budget-pro .lang-switch{background:#fff!important;border:1px solid #e0e8f3!important;border-radius:12px!important;box-shadow:0 6px 14px #182a4210!important;padding:11px 12px!important}\nhtml.rw-budget-pro .layout{display:grid!important;grid-template-columns:minmax(0,.91fr) minmax(0,1.09fr)!important;align-items:start!important;gap:24px!important;min-height:0!important}\nhtml.rw-budget-pro .layout > .card{background:#fff!important;border:1px solid #e1e9f3!important;border-radius:20px!important;box-shadow:0 12px 36px #18304a0c!important;min-width:0!important;min-height:0!important;height:auto!important;overflow:visible!important;backdrop-filter:none!important}\nhtml.rw-budget-pro .layout > .card > .body{display:block!important;overflow:visible!important;padding:24px 25px 28px!important}\nhtml.rw-budget-pro .rw-budget-section{min-width:0}\nhtml.rw-budget-pro .rw-budget-section + .rw-budget-section{border-top:1px solid #e8edf4;margin-top:26px;padding-top:25px}\nhtml.rw-budget-pro .rw-budget-section-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:20px}\nhtml.rw-budget-pro .rw-section-kicker{display:block;color:#5993b9;font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;margin-bottom:5px}\nhtml.rw-budget-pro .rw-section-title{font-size:19px;line-height:1.25;font-weight:800;letter-spacing:-.45px;margin:0;color:#172d48}\nhtml.rw-budget-pro .rw-section-desc{font-size:12px;color:#78879a;margin-top:6px;line-height:1.55;max-width:410px}\nhtml.rw-budget-pro .rw-budget-input-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:17px 16px!important}\nhtml.rw-budget-pro .rw-budget-input-grid > .row{min-width:0!important;display:block!important;margin:0!important}\nhtml.rw-budget-pro .rw-budget-input-grid .field{min-width:0!important}\nhtml.rw-budget-pro .rw-budget-input-grid label{display:block!important;margin-bottom:8px!important;color:#33485f!important;font-size:12px!important;line-height:1.35!important;font-weight:700!important}\nhtml.rw-budget-pro .rw-budget-input-grid input[type=\"text\"]{width:100%!important;min-width:0!important;max-width:none!important;height:48px!important;padding:10px 44px 10px 13px!important;font-size:15px!important;font-weight:650!important;color:#1b2c44!important;background:#fbfcff!important;border:1px solid #dbe4ef!important;border-radius:10px!important;box-shadow:none!important;box-sizing:border-box!important}\nhtml.rw-budget-pro .rw-budget-input-grid input[type=\"text\"]:focus{background:#fff!important;border-color:#39a5df!important;box-shadow:0 0 0 3px #0ea5e926!important}\nhtml.rw-budget-pro .rw-budget-input-grid .icon-btn{top:auto!important;bottom:6px!important;right:6px!important;transform:none!important;position:absolute!important;width:35px!important;height:35px!important;border-radius:8px!important;background:#eef6fc!important;border:1px solid #ddeaf4!important}\nhtml.rw-budget-pro .rw-budget-clear{margin:0!important;justify-content:flex-end!important}\nhtml.rw-budget-pro .rw-budget-clear button{border:1px solid #dce7f0!important;background:#f4f8fb!important;color:#53718c!important;padding:9px 12px!important;font-size:12px!important;border-radius:9px!important;min-height:35px!important;box-shadow:none!important;white-space:nowrap}\nhtml.rw-budget-pro .rw-budget-clear button:hover{background:#e5f2fd!important;color:#215880!important}\nhtml.rw-budget-pro .rw-budget-override{background:#f4f8fc!important;border:1px solid #e2eaf3!important;border-radius:12px!important;padding:13px 14px!important;display:flex!important;align-items:center!important;gap:9px!important;margin-top:18px!important}\nhtml.rw-budget-pro .rw-budget-override input{width:16px!important;height:16px!important;flex:none!important;accent-color:#1593d0}\nhtml.rw-budget-pro .rw-budget-override span{color:#516985!important;font-size:12px!important;font-weight:650!important}\nhtml.rw-budget-pro .rw-override-note{font-size:11px!important;color:#71839a!important;line-height:1.45!important;margin-top:9px!important}\nhtml.rw-budget-pro #resultCard .head{padding:22px 25px 17px!important;color:#193651!important;border-bottom:1px solid #e6edf5!important;background:transparent!important;font-size:19px!important;letter-spacing:-.4px!important}\nhtml.rw-budget-pro #resultCard .head span{background:none!important;color:#193651!important;font-weight:800!important}\nhtml.rw-budget-pro #resultCard > .body{padding-top:12px!important}\nhtml.rw-budget-pro #resultCard .kpi{display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:12px!important;align-items:stretch!important;align-content:start!important}\nhtml.rw-budget-pro .rw-budget-group{grid-column:1/-1!important;display:flex!important;align-items:center!important;justify-content:space-between!important;font-size:11px!important;color:#75879a!important;font-weight:800!important;letter-spacing:.12em!important;text-transform:uppercase!important;margin:8px 0 1px!important;padding-top:5px!important}\nhtml.rw-budget-pro .rw-budget-group:not(:first-child){border-top:1px solid #e9eef4!important;margin-top:12px!important;padding-top:19px!important}\nhtml.rw-budget-pro #resultCard .tile{box-sizing:border-box!important;min-width:0!important;min-height:116px!important;border:1px solid #e4ebf4!important;border-radius:14px!important;background:#fbfcfe!important;padding:17px 16px!important;box-shadow:none!important;overflow:hidden!important}\nhtml.rw-budget-pro #resultCard .tile.accent{background:#f0f8fe!important;border-color:#d9eafa!important}\nhtml.rw-budget-pro #resultCard .tile.sum{background:#f8fbff!important;border-color:#e1eaf6!important}\nhtml.rw-budget-pro #resultCard .tile h3{font-size:12px!important;line-height:1.4!important;color:#526782!important;letter-spacing:0!important;font-weight:700!important;margin:0 0 9px!important}\nhtml.rw-budget-pro #resultCard .tile .big{font-size:clamp(24px,2.25vw,34px)!important;line-height:1.12!important;letter-spacing:-.8px!important;font-weight:850!important;color:#122b48!important;margin:0 0 8px!important}\nhtml.rw-budget-pro #resultCard .tile .muted,html.rw-budget-pro #resultCard .tile .eq{font-size:11px!important;color:#708198!important;line-height:1.5!important;overflow-wrap:anywhere}\nhtml.rw-budget-pro #resultCard .tile .badge{font-size:10px!important;border-radius:7px!important;white-space:normal!important;display:inline-block!important;margin-left:3px!important}\nhtml.rw-budget-pro #resultCard .rw-tile-weeks,html.rw-budget-pro #resultCard .rw-tile-workingdays,html.rw-budget-pro #resultCard #rwContractHoursTile{grid-column:span 2!important}\nhtml.rw-budget-pro #resultCard .rw-tile-planned,html.rw-budget-pro #resultCard .rw-tile-remaining,html.rw-budget-pro #resultCard .rw-tile-status,html.rw-budget-pro #resultCard .rw-tile-usage{grid-column:span 3!important}\nhtml.rw-budget-pro #resultCard #rwContractHoursTile{background:linear-gradient(135deg,#e6f7ff,#eef6ff)!important;border-color:#b8e6fa!important}\nhtml.rw-budget-pro #resultCard .rw-tile-workingdays{background:#f2f7ff!important}\nhtml.rw-budget-pro #resultCard .rw-tile-workingdays .big{color:#247cb2!important}\nhtml.rw-budget-pro #resultCard .rw-tile-status .big:has(.status-ok){color:#137b58!important}\nhtml.rw-budget-pro #resultCard .rw-tile-status .big:has(.status-bad){color:#be4d44!important}\nhtml.rw-budget-pro #resultCard .rw-tile-usage .donut-wrap{display:flex!important;align-items:center!important;gap:15px!important;justify-content:space-between!important}\nhtml.rw-budget-pro #resultCard .rw-tile-usage .donut{width:96px!important;height:96px!important;flex:none!important}\nhtml.rw-budget-pro #resultCard .rw-tile-usage .donut svg{width:96px!important;height:96px!important}\nhtml.rw-budget-pro #resultCard .rw-tile-usage .legend{flex:1!important;min-width:0!important;font-size:11px!important;line-height:1.7!important}\nhtml.rw-budget-pro .rw-calc-note{background:#f4f8fc;border:1px solid #e6edf4;border-radius:11px;padding:12px 14px;font-size:11px;line-height:1.65;color:#6b8097;margin-top:15px}\nhtml.rw-budget-pro #resultCard.calculating{transform:none!important}\n@media(max-width:1150px){\n html.rw-budget-pro .layout{grid-template-columns:minmax(0,1fr)!important}\n html.rw-budget-pro .viewport{max-width:960px!important}\n html.rw-budget-pro #resultCard .tile .big{font-size:29px!important}\n}\n@media(max-width:700px){\n html.rw-budget-pro .viewport{padding:16px 11px 28px!important}\n html.rw-budget-pro .viewport > header{align-items:flex-start!important;gap:12px!important;flex-wrap:wrap!important;margin-bottom:14px!important}\n html.rw-budget-pro .viewport > header h1{font-size:25px!important}\n html.rw-budget-pro .layout{gap:13px!important}\n html.rw-budget-pro .layout > .card{border-radius:15px!important}\n html.rw-budget-pro .layout > .card > .body{padding:18px 16px 20px!important}\n html.rw-budget-pro .rw-budget-input-grid{grid-template-columns:minmax(0,1fr)!important;gap:13px!important}\n html.rw-budget-pro .rw-budget-section + .rw-budget-section{margin-top:18px;padding-top:19px}\n html.rw-budget-pro .rw-budget-section-head{margin-bottom:16px}\n html.rw-budget-pro .rw-section-title{font-size:17px}\n html.rw-budget-pro #resultCard .head{padding:18px 17px 12px!important}\n html.rw-budget-pro #resultCard .kpi{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}\n html.rw-budget-pro #resultCard .rw-tile-weeks,html.rw-budget-pro #resultCard .rw-tile-workingdays{grid-column:span 1!important}\n html.rw-budget-pro #resultCard #rwContractHoursTile,html.rw-budget-pro #resultCard .rw-tile-planned,html.rw-budget-pro #resultCard .rw-tile-remaining,html.rw-budget-pro #resultCard .rw-tile-status,html.rw-budget-pro #resultCard .rw-tile-usage{grid-column:span 2!important}\n html.rw-budget-pro #resultCard .tile{min-height:100px!important;padding:13px!important}\n html.rw-budget-pro #resultCard .tile .big{font-size:27px!important}\n}\n\n\n/* Contract Budget compact desktop screen fit — keep all KPIs above the fold. */\n@media (min-width: 1100px) and (max-height: 1000px) {\n html.rw-budget-pro .viewport{max-width:1580px!important; padding:11px 18px 12px!important}\n html.rw-budget-pro .viewport > header{padding:0 2px 9px!important;margin-bottom:9px!important;min-height:0!important;gap:12px!important}\n html.rw-budget-pro .viewport > header h1{font-size:clamp(23px,2vw,29px)!important;line-height:1.08!important}\n html.rw-budget-pro .rw-budget-eyebrow{font-size:9px!important;letter-spacing:.11em!important;margin-bottom:2px!important}\n html.rw-budget-pro .lang-switch{padding:7px 9px!important;box-shadow:none!important;border-radius:9px!important}\n html.rw-budget-pro .layout{grid-template-columns:minmax(0,.90fr) minmax(0,1.1fr)!important;gap:13px!important}\n html.rw-budget-pro .layout > .card{border-radius:14px!important;box-shadow:0 4px 18px #18304a0a!important}\n html.rw-budget-pro .layout > .card > .body{padding:13px 14px 14px!important}\n html.rw-budget-pro .rw-budget-section + .rw-budget-section{margin-top:13px!important;padding-top:12px!important}\n html.rw-budget-pro .rw-budget-section-head{margin-bottom:10px!important;align-items:center!important;gap:6px!important}\n html.rw-budget-pro .rw-section-title{font-size:16px!important;line-height:1.18!important;letter-spacing:-.25px!important}\n html.rw-budget-pro .rw-section-kicker{font-size:9px!important;letter-spacing:.08em!important;margin-bottom:2px!important}\n html.rw-budget-pro .rw-section-desc{display:none!important}\n html.rw-budget-pro .rw-budget-input-grid{gap:9px 10px!important}\n html.rw-budget-pro .rw-budget-input-grid label{font-size:11px!important;line-height:1.23!important;margin-bottom:5px!important}\n html.rw-budget-pro .rw-budget-input-grid input[type=\"text\"]{height:38px!important;min-height:38px!important;font-size:14px!important;padding:6px 37px 6px 10px!important;border-radius:8px!important}\n html.rw-budget-pro .rw-budget-input-grid .icon-btn{height:29px!important;width:29px!important;bottom:4px!important;right:5px!important;border-radius:7px!important}\n html.rw-budget-pro .rw-budget-clear button{min-height:29px!important;padding:6px 9px!important;font-size:11px!important}\n html.rw-budget-pro .rw-budget-override{margin-top:10px!important;padding:8px 10px!important;border-radius:9px!important}\n html.rw-budget-pro .rw-budget-override span{font-size:11px!important}\n html.rw-budget-pro .rw-override-note{font-size:10px!important;line-height:1.33!important;margin-top:5px!important}\n html.rw-budget-pro #resultCard .head{font-size:16px!important;padding:12px 14px 10px!important}\n html.rw-budget-pro #resultCard > .body{padding:9px 12px 12px!important}\n html.rw-budget-pro #resultCard .kpi{gap:7px!important;align-items:stretch!important}\n html.rw-budget-pro .rw-budget-group{min-height:0!important;margin:0 0 1px!important;padding:1px 0 0!important;font-size:10px!important;line-height:1.2!important;border:0!important}\n html.rw-budget-pro .rw-budget-group:not(:first-child){border:0!important;margin:6px 0 0!important;padding:3px 0 0!important;border-top:1px solid #e9eef4!important}\n html.rw-budget-pro #resultCard .tile{min-height:0!important;padding:10px 11px!important;border-radius:10px!important}\n html.rw-budget-pro #resultCard .tile h3{font-size:11px!important;line-height:1.22!important;margin:0 0 5px!important;letter-spacing:0!important}\n html.rw-budget-pro #resultCard .tile .big{font-size:clamp(22px,1.8vw,27px)!important;line-height:1.07!important;letter-spacing:-.5px!important;margin:0 0 5px!important}\n html.rw-budget-pro #resultCard .tile .muted,html.rw-budget-pro #resultCard .tile .eq{font-size:10px!important;line-height:1.32!important}\n html.rw-budget-pro #resultCard .tile .badge{font-size:9px!important}\n html.rw-budget-pro #resultCard .rw-tile-usage .donut-wrap{gap:10px!important}\n html.rw-budget-pro #resultCard .rw-tile-usage .donut,html.rw-budget-pro #resultCard .rw-tile-usage .donut svg{width:71px!important;height:71px!important}\n html.rw-budget-pro #resultCard .rw-tile-usage .legend{font-size:10px!important;line-height:1.42!important}\n html.rw-budget-pro .rw-calc-note{margin-top:8px!important;padding:7px 10px!important;border-radius:8px!important;font-size:10px!important;line-height:1.35!important}\n}\n@media (min-width: 1100px) and (max-height: 735px) {\n html.rw-budget-pro .viewport{padding-top:7px!important;padding-bottom:7px!important}\n html.rw-budget-pro .viewport > header{padding-bottom:6px!important;margin-bottom:6px!important}\n html.rw-budget-pro .rw-budget-input-grid input[type=\"text\"]{height:34px!important;min-height:34px!important}\n html.rw-budget-pro .rw-budget-input-grid{gap:7px 9px!important}\n html.rw-budget-pro .rw-budget-section-head{margin-bottom:7px!important}\n html.rw-budget-pro .rw-budget-section + .rw-budget-section{margin-top:9px!important;padding-top:9px!important}\n html.rw-budget-pro #resultCard .tile{padding:8px 10px!important}\n html.rw-budget-pro #resultCard .tile .big{font-size:22px!important}\n html.rw-budget-pro #resultCard .kpi{gap:5px!important}\n html.rw-budget-pro #resultCard .head{padding-top:9px!important;padding-bottom:7px!important}\n html.rw-budget-pro #resultCard > .body{padding:6px 9px 9px!important}\n html.rw-budget-pro .rw-budget-group:not(:first-child){margin-top:3px!important;padding-top:1px!important}\n html.rw-budget-pro .rw-calc-note{font-size:9.5px!important;margin-top:6px!important;padding:6px 8px!important}\n}\n";
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
  var style=element(doc,'style');style.id='rw-contract-budget-professional-v2';style.textContent=STYLE_CSS;head.append(style);
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