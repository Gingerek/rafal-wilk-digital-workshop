(function(){
  if (window.__rwPlatformV2) return;
  window.__rwPlatformV2 = true;

  const LS_LANG = 'rw_lang';
  const modules = [
    { match:'Contract Budget Calculator', icon:'calculator', category:'finance',
      title:{pl:'Kalkulator budżetu kontraktu', en:'Contract Budget Calculator', nl:'Contractbudget calculator'},
      desc:{pl:'Szybka estymacja budżetu i kosztów kontraktu.', en:'Fast contract budget and cost estimation.', nl:'Snelle raming van contractbudget en kosten.'}},
    { match:'New Bill Rate', icon:'rate', category:'finance',
      title:{pl:'Nowa stawka Bill Rate', en:'New Bill Rate', nl:'Nieuw bill rate'},
      desc:{pl:'Kalkulacja marży, kosztu i stawki sprzedażowej.', en:'Calculate margin, cost, and client billing rate.', nl:'Bereken marge, kostprijs en klanttarief.'}},
    { match:'Urządzenie kalkulacyjne', icon:'tool', category:'finance',
      title:{pl:'Urządzenie kalkulacyjne', en:'Calculation Tool', nl:'Calculatietool'},
      desc:{pl:'Pomocniczy moduł kalkulacyjny do codziennej pracy.', en:'Utility calculator for everyday operations.', nl:'Hulprekenmodule voor dagelijks werk.'}},
    { match:'Intake Call', icon:'call', category:'recruitment',
      title:{pl:'Intake Call', en:'Intake Call', nl:'Intakegesprek'},
      desc:{pl:'Strukturyzuje rozmowę intake i wymagania roli.', en:'Structure intake calls and role requirements.', nl:'Structureer intakegesprekken en functie-eisen.'}},
    { match:'Ocena dopasowania CV', icon:'cv', category:'recruitment',
      title:{pl:'Ocena dopasowania CV', en:'CV Match Review', nl:'CV-match beoordeling'},
      desc:{pl:'Porównanie CV z opisem stanowiska i wymaganiami.', en:'Compare a CV against role requirements.', nl:'Vergelijk een CV met functie-eisen.'}},
    { match:'MSD CAO', icon:'document', category:'documents',
      title:{pl:'MSD CAO 2026-2027', en:'MSD CAO 2026-2027', nl:'MSD CAO 2026-2027'},
      desc:{pl:'Szybki dostęp do warunków i stawek CAO.', en:'Quick access to CAO terms and rates.', nl:'Snelle toegang tot CAO-voorwaarden en tarieven.'}},
    { match:'Przegląd agencji', icon:'agency', category:'documents',
      title:{pl:'Przegląd agencji', en:'Agency Review', nl:'Bureauoverzicht'},
      desc:{pl:'Porządkowanie informacji o agencjach i partnerach.', en:'Organize agency and partner information.', nl:'Orden informatie over bureaus en partners.'}},
    { match:'Rejestr spotkań', icon:'meeting', category:'tracking',
      title:{pl:'Rejestr spotkań z managerami', en:'Manager Meeting Tracker', nl:'Managergesprekken register'},
      desc:{pl:'Rejestruj spotkania, statusy i ustalenia.', en:'Track meetings, statuses, and follow-ups.', nl:'Registreer gesprekken, status en afspraken.'}},
    { match:'Home Office Tracker', icon:'home', category:'tracking',
      title:{pl:'Licznik pracy z domu', en:'Home Office Tracker', nl:'Thuiswerk tracker'},
      desc:{pl:'Liczenie dni pracy z domu, biura i nieobecności.', en:'Track home, office, and non-working days.', nl:'Tel thuiswerk-, kantoor- en vrije dagen.'}},
    { match:'My Projects', icon:'project', category:'projects',
      title:{pl:'Moje projekty', en:'My Projects', nl:'Mijn projecten'},
      desc:{pl:'Twoja przestrzeń na dokumenty, projekty i rozliczenia.', en:'Your workspace for projects, documents, and billing.', nl:'Je werkruimte voor projecten, documenten en facturatie.'}}
  ];

  const categories = [
    { id:'all', label:{pl:'Wszystkie', en:'All', nl:'Alles'} },
    { id:'recruitment', label:{pl:'Rekrutacja', en:'Recruitment', nl:'Recruitment'} },
    { id:'finance', label:{pl:'Finanse', en:'Finance', nl:'Finance'} },
    { id:'documents', label:{pl:'Dokumenty', en:'Documents', nl:'Documenten'} },
    { id:'tracking', label:{pl:'Trackery', en:'Tracking', nl:'Tracking'} },
    { id:'projects', label:{pl:'Projekty', en:'Projects', nl:'Projecten'} }
  ];

  const copy = {
    eyebrow:{pl:'Platforma modułów pracy', en:'Work modules platform', nl:'Platform voor werkmodules'},
    headline:{pl:'Private Command Center.', en:'Private Command Center.', nl:'Private Command Center.'},
    intro:{pl:'Prywatne centrum operacyjne Rafała Wilka.',
      en:'Rafal Wilk private operations center.',
      nl:'Prive operationeel centrum van Rafal Wilk.'},
    ownerNote:{pl:'Dostęp do modułów ma wyłącznie właściciel.',
      en:'Module access is reserved for the owner.',
      nl:'Moduletoegang is alleen voor de eigenaar.'},
    openFirst:{pl:'Otwórz pierwszy moduł', en:'Open first module', nl:'Open eerste module'},
    viewAll:{pl:'Pokaż wszystkie', en:'View all', nl:'Toon alles'},
    library:{pl:'Biblioteka modułów', en:'Module library', nl:'Modulebibliotheek'},
    librarySub:{pl:'Wybierz moduł lub kategorię.', en:'Choose a module or category.', nl:'Kies een module of categorie.'},
    protected:{pl:'Chronione moduły', en:'Protected modules', nl:'Beveiligde modules'},
    categories:{pl:'Kategorie', en:'Categories', nl:'Categorieën'},
    languages:{pl:'Języki', en:'Languages', nl:'Talen'},
    open:{pl:'Otwórz', en:'Open', nl:'Openen'},
    openPlatform:{pl:'Otwórz w platformie', en:'Open in platform', nl:'Openen in platform'},
    pinTitle:{pl:'Dostęp do modułu', en:'Protected module access', nl:'Beveiligde moduletoegang'},
    pinText:{pl:'Wpisz 4-cyfrowy PIN, aby otworzyć wybrany moduł.', en:'Enter the 4-digit PIN to open this module.', nl:'Voer de 4-cijferige pincode in om deze module te openen.'},
    cancel:{pl:'Anuluj', en:'Cancel', nl:'Annuleren'},
    unlock:{pl:'Odblokuj', en:'Unlock', nl:'Ontgrendelen'},
    wrongPin:{pl:'Nieprawidłowy PIN. Spróbuj ponownie.', en:'Incorrect PIN. Try again.', nl:'Onjuiste pincode. Probeer opnieuw.'},
    back:{pl:'Powrót', en:'Back', nl:'Terug'},
    saved:{pl:'Autosave aktywny', en:'Autosave active', nl:'Autosave actief'},
    apiOn:{pl:'AI aktywne', en:'AI active', nl:'AI actief'},
    apiOff:{pl:'AI nieaktywne', en:'AI inactive', nl:'AI inactief'}
  };

  const icons = {
    calculator:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M16 15h0"/></svg>',
    rate:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 19V5"/><path d="M4 19h16"/><path d="m7 15 4-4 3 3 5-7"/></svg>',
    tool:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14.7 6.3a4 4 0 0 0-5 5L4 17v3h3l5.7-5.7a4 4 0 0 0 5-5l-2.8 2.8-2-2 2.8-2.8Z"/></svg>',
    call:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2.1L8 9.5a16 16 0 0 0 6.5 6.5l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.6.5 2.5.6a2 2 0 0 1 1.7 2Z"/></svg>',
    cv:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/></svg>',
    scan:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2"/><path d="M7 12h10"/></svg>',
    document:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h6"/></svg>',
    agency:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-7h6v7"/><path d="M9 9h.01M15 9h.01"/></svg>',
    meeting:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/><path d="M8 14h4M8 18h7"/></svg>',
    home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>',
    project:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 7h7l2 2h9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M3 7V5a2 2 0 0 1 2-2h4l2 2h4"/></svg>'
  };

  let activeFilter = 'all';
  let activeModuleTitle = '';

  function lang(){
    const raw = String(localStorage.getItem(LS_LANG) || document.documentElement.lang || 'pl').toLowerCase();
    if (raw.startsWith('en')) return 'en';
    if (raw.startsWith('nl')) return 'nl';
    return 'pl';
  }
  function t(key){ return copy[key]?.[lang()] || copy[key]?.pl || key; }
  function findMeta(card){
    const title = card.querySelector('.title');
    const key = title?.dataset.titleKey || title?.textContent || '';
    return modules.find(m => key.includes(m.match) || String(title?.textContent || '').includes(m.match)) || modules[0];
  }
  function syncBrand(){
    document.querySelectorAll('.rw-brand-main').forEach((el) => {
      el.textContent = 'Rafal Wilk';
    });
    document.querySelectorAll('.rw-title').forEach((el) => {
      el.setAttribute('aria-label', 'Rafal Wilk Private Command Center');
    });
    if (document.title.includes('Rafal Wilk Digital Workshop')) {
      document.title = document.title.replace('Rafal Wilk Digital Workshop ©', 'Rafal Wilk Private Command Center');
    }
  }
  function ensureShell(){
    const main = document.querySelector('main.wrap');
    const grid = main?.querySelector('.grid');
    if (!main || !grid || main.querySelector('.rw-v2-shell')) return;
    const shell = document.createElement('div');
    shell.className = 'rw-v2-shell';
    const hero = document.createElement('section');
    hero.className = 'rw-v2-hero';
    const toolbar = document.createElement('section');
    toolbar.className = 'rw-v2-toolbar';
    main.insertBefore(shell, grid);
    shell.append(hero, toolbar, grid);
  }
  function renderHero(){
    const hero = document.querySelector('.rw-v2-hero');
    if (!hero) return;
    hero.innerHTML = `<div class="rw-v2-hero-inner">
      <div class="rw-v2-hero-copy">
        <div class="rw-v2-eyebrow">${t('eyebrow')}</div>
        <h2>${t('headline')}</h2>
        <p>${t('intro')}</p>
        <div class="rw-v2-owner-note">${t('ownerNote')}</div>
        <div class="rw-v2-hero-actions">
          <button class="rw-v2-primary" type="button" data-rw-v2-open-first>${t('openFirst')}</button>
          <button class="rw-v2-secondary" type="button" data-rw-v2-view-all>${t('viewAll')}</button>
        </div>
        <div class="rw-v2-stats">
          <div class="rw-v2-stat"><strong>${modules.length}</strong><span>${t('protected')}</span></div>
          <div class="rw-v2-stat"><strong>${categories.length - 1}</strong><span>${t('categories')}</span></div>
          <div class="rw-v2-stat"><strong>PL/EN/NL</strong><span>${t('languages')}</span></div>
        </div>
      </div>
      <div class="rw-v2-visual" aria-hidden="true">
        <div class="rw-v2-light-beam"></div>
        <div class="rw-v2-orb rw-v2-orb-a"></div>
        <div class="rw-v2-orb rw-v2-orb-b"></div>
        <div class="rw-v2-command-ui">
          <div class="rw-v2-command-top">
            <span></span><span></span><span></span>
            <strong>RW OS</strong>
          </div>
          <div class="rw-v2-command-body">
            <aside>
              <i></i><i></i><i></i><i></i>
            </aside>
            <section>
              <div class="rw-v2-scan-line"></div>
              <div class="rw-v2-ui-kicker">private intelligence layer</div>
              <div class="rw-v2-ui-title">Module control</div>
              <div class="rw-v2-ui-row wide"></div>
              <div class="rw-v2-ui-row"></div>
              <div class="rw-v2-ui-grid">
                <b></b><b></b><b></b>
              </div>
            </section>
          </div>
        </div>
        <div class="rw-v2-side-card">
          <span></span>
          <strong>4685</strong>
          <small>secured access</small>
        </div>
        <div class="rw-v2-energy-card">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>`;
  }
  function renderToolbar(){
    const toolbar = document.querySelector('.rw-v2-toolbar');
    if (!toolbar) return;
    toolbar.innerHTML = `<div class="rw-v2-toolbar-title"><strong>${t('library')}</strong><span>${t('librarySub')}</span></div>
      <div class="rw-v2-filters" role="group" aria-label="Module categories">
        ${categories.map(c => `<button class="rw-v2-filter" type="button" data-filter="${c.id}" aria-pressed="${activeFilter === c.id}">${c.label[lang()]}</button>`).join('')}
      </div>`;
  }
  function enhanceCards(){
    document.querySelectorAll('main.wrap .grid .card').forEach((card) => {
      const meta = findMeta(card);
      card.dataset.category = meta.category;
      card.dataset.moduleMatch = meta.match;
      let icon = card.querySelector('.rw-v2-icon');
      if (!icon) {
        icon = document.createElement('div');
        icon.className = 'rw-v2-icon';
        card.insertBefore(icon, card.firstChild);
      }
      icon.innerHTML = icons[meta.icon] || icons.project;
      let chip = card.querySelector('.rw-v2-card-meta');
      if (!chip) {
        chip = document.createElement('div');
        chip.className = 'rw-v2-card-meta';
        card.insertBefore(chip, card.querySelector('.btn'));
      }
      chip.textContent = 'PIN';
      let desc = card.querySelector('.rw-v2-card-desc');
      if (!desc) {
        desc = document.createElement('div');
        desc.className = 'rw-v2-card-desc';
        const title = card.querySelector('.title');
        title && title.insertAdjacentElement('afterend', desc);
      }
      const title = card.querySelector('.title');
      if (title) title.textContent = meta.title[lang()] || meta.title.pl;
      desc.textContent = meta.desc[lang()] || meta.desc.pl;
      const btn = card.querySelector('.btn');
      if (btn) btn.textContent = btn.dataset.idx ? t('openPlatform') : t('open');
      card.hidden = activeFilter !== 'all' && meta.category !== activeFilter;
    });
  }
  function enhancePin(){
    const gate = document.getElementById('mc_gate');
    const panel = gate?.querySelector('.panel');
    const input = document.getElementById('mc_pin');
    if (!gate || !panel || !input) return;
    gate.classList.add('rw-v2-pin-gate');
    if (!panel.querySelector('.rw-v2-pin-head')) {
      const head = document.createElement('div');
      head.className = 'rw-v2-pin-head';
      head.innerHTML = `<div class="rw-v2-pin-icon">${icons.project}</div>`;
      panel.insertBefore(head, panel.firstChild);
    }
    if (!panel.querySelector('.rw-v2-pin-digits')) {
      const digits = document.createElement('div');
      digits.className = 'rw-v2-pin-digits';
      digits.innerHTML = '<span class="rw-v2-pin-digit"></span><span class="rw-v2-pin-digit"></span><span class="rw-v2-pin-digit"></span><span class="rw-v2-pin-digit"></span>';
      input.insertAdjacentElement('afterend', digits);
    }
    input.addEventListener('input', updatePinDigits);
    input.addEventListener('focus', updatePinDigits);
    gate.addEventListener('click', (event) => {
      if (!event.target.closest('button')) input.focus();
    });
    updatePinDigits();
  }
  function updatePinDigits(){
    const input = document.getElementById('mc_pin');
    const digits = document.querySelectorAll('.rw-v2-pin-digit');
    const value = String(input?.value || '').slice(0, 4);
    digits.forEach((el, i) => { el.textContent = value[i] ? '*' : ''; });
  }
  function patchPinTexts(){
    const title = document.getElementById('mc_title');
    const text = document.querySelector('#mc_gate p');
    const cancel = document.getElementById('mc_cancel');
    const ok = document.getElementById('mc_ok');
    if (title) title.textContent = t('pinTitle');
    if (text) text.textContent = activeModuleTitle ? `${t('pinText')} ${activeModuleTitle}` : t('pinText');
    if (cancel) cancel.textContent = t('cancel');
    if (ok) ok.textContent = t('unlock');
  }
  function patchPinGateHooks(){
    if (window.__rwV2PinHooks) return;
    window.__rwV2PinHooks = true;
    const originalRequest = window.__rwRequestModulePin;
    if (typeof originalRequest === 'function') {
      window.__rwRequestModulePin = function(callback, moduleTitle){
        activeModuleTitle = moduleTitle || '';
        originalRequest(callback, moduleTitle);
        setTimeout(() => {
          patchPinTexts();
          updatePinDigits();
          document.getElementById('mc_pin')?.focus();
        }, 20);
      };
    }
    const input = document.getElementById('mc_pin');
    const err = document.getElementById('mc_err');
    const gate = document.getElementById('mc_gate');
    const mo = new MutationObserver(() => {
      if (err && err.textContent) {
        err.textContent = t('wrongPin');
        gate?.classList.add('rw-v2-pin-error');
        setTimeout(() => gate?.classList.remove('rw-v2-pin-error'), 500);
      }
    });
    err && mo.observe(err, { childList:true, characterData:true, subtree:true });
    input?.addEventListener('input', updatePinDigits);
  }
  function ensureModuleBar(){
    if (document.querySelector('.rw-v2-modulebar')) return;
    const bar = document.createElement('div');
    bar.className = 'rw-v2-modulebar';
    bar.innerHTML = `<div class="rw-v2-module-left">
      <button class="rw-v2-back" type="button"></button>
      <div class="rw-v2-module-title"></div>
    </div>
    <div class="rw-v2-module-right">
      <span class="rw-v2-save"></span>
      <div class="rw-v2-module-lang">
        <button type="button" data-lang="pl">PL</button>
        <button type="button" data-lang="en">EN</button>
        <button type="button" data-lang="nl">NL</button>
      </div>
    </div>`;
    document.body.appendChild(bar);
    bar.querySelector('.rw-v2-back').addEventListener('click', () => document.getElementById('rw_home_btn')?.click());
    bar.querySelectorAll('[data-lang]').forEach(btn => btn.addEventListener('click', () => {
      localStorage.setItem(LS_LANG, btn.dataset.lang);
      document.querySelector(`.rw-lang-btn[data-lang="${btn.dataset.lang}"]`)?.click();
      applyLanguage();
    }));
  }
  function updateModuleBar(){
    const title = document.querySelector('.rw-v2-module-title');
    const back = document.querySelector('.rw-v2-back');
    const save = document.querySelector('.rw-v2-save');
    if (!title || !back || !save) return;
    const docTitle = document.title.split(/\s[-\u2013\u2014]\s/).pop()?.trim();
    title.textContent = docTitle && !docTitle.includes('Rafal') ? docTitle : activeModuleTitle || 'Module';
    back.textContent = t('back');
    save.textContent = t('saved');
    document.querySelectorAll('.rw-v2-module-lang [data-lang]').forEach(btn => {
      btn.setAttribute('aria-pressed', btn.dataset.lang === lang() ? 'true' : 'false');
    });
  }
  function applyLanguage(){
    renderHero();
    renderToolbar();
    enhanceCards();
    patchPinTexts();
    updateModuleBar();
  }
  function bindEvents(){
    document.addEventListener('click', (event) => {
      const filter = event.target.closest('.rw-v2-filter');
      if (filter) {
        activeFilter = filter.dataset.filter || 'all';
        applyLanguage();
      }
      if (event.target.closest('[data-rw-v2-open-first]')) {
        document.querySelector('main.wrap .grid .card:not([hidden]) .btn')?.click();
      }
      if (event.target.closest('[data-rw-v2-view-all]')) {
        activeFilter = 'all';
        applyLanguage();
        document.querySelector('.rw-v2-toolbar')?.scrollIntoView({ behavior:'smooth', block:'start' });
      }
      const moduleButton = event.target.closest('main.wrap .grid .btn');
      if (moduleButton) {
        const card = moduleButton.closest('.card');
        const meta = card && findMeta(card);
        activeModuleTitle = meta ? (meta.title[lang()] || meta.title.pl) : '';
      }
      if (event.target.closest('.rw-lang-btn')) {
        setTimeout(applyLanguage, 40);
      }
    }, true);
    window.addEventListener('storage', applyLanguage);
    window.addEventListener('rwLanguageChanged', applyLanguage);
    const bodyObserver = new MutationObserver(updateModuleBar);
    bodyObserver.observe(document.body, { attributes:true, attributeFilter:['class'] });
    setInterval(updateModuleBar, 1200);
  }
  function hideStageWidgets(){
    ['rwPlatformApiStatus', 'rwVoiceLauncher', 'rwLauncherDock'].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.setAttribute('hidden', '');
      el.style.setProperty('display', 'none', 'important');
      el.style.setProperty('visibility', 'hidden', 'important');
      el.style.setProperty('opacity', '0', 'important');
      el.style.setProperty('pointer-events', 'none', 'important');
    });
    document.querySelectorAll('.privacy-footer').forEach((el) => {
      el.setAttribute('hidden', '');
      el.style.setProperty('display', 'none', 'important');
    });
  }
  const premiumModuleTheme = `
    :root{
      --rw-bg:#f8fbff; --rw-panel:rgba(255,255,255,.74); --rw-panel-2:rgba(245,250,255,.82);
      --rw-line:rgba(52,104,160,.14); --rw-line-strong:rgba(14,165,233,.24);
      --rw-text:#10233f; --rw-muted:#64748b; --rw-blue:#0ea5e9; --rw-violet:#8b5cf6;
      --rw-cyan:#14b8a6; --rw-danger:#e11d48; --rw-ok:#059669;
      --rw-shadow:0 18px 52px rgba(36,76,128,.10), 0 0 26px rgba(14,165,233,.045);
      color-scheme:light;
    }
    @media screen{
      html{background:#f8fbff!important;}
      body{
        color:var(--rw-text)!important;
        background:
          linear-gradient(115deg, transparent 0 38%, rgba(14,165,233,.055) 43%, transparent 50% 100%),
          linear-gradient(75deg, transparent 0 68%, rgba(139,92,246,.040) 74%, transparent 82% 100%),
          linear-gradient(135deg,#f8fbff 0%,#eef7ff 52%,#e6f0fb 100%)!important;
      }
      body::before{
        content:""; position:fixed; inset:0; pointer-events:none; z-index:-1;
        background:
          linear-gradient(rgba(32,88,142,.055) 1px, transparent 1px),
          linear-gradient(90deg, rgba(32,88,142,.042) 1px, transparent 1px);
        background-size:54px 54px; opacity:.62; mask-image:linear-gradient(to bottom, #000, transparent 82%);
      }
      .app,.shell,.page{max-width:1380px!important;}
      .topbar,.toolbar,.brand,.top-actions{color:var(--rw-text)!important;}
      .logo{
        background:linear-gradient(180deg, #ffffff, #cffafe 36%, #38bdf8 72%, #1d4ed8 100%)!important;
        border:1px solid rgba(14,165,233,.34)!important;
        box-shadow:0 0 32px rgba(14,165,233,.22)!important;
      }
      h1,h2,h3,.card-title,.brand h1,.title{color:var(--rw-text)!important; letter-spacing:-.02em!important;}
      p,.subtitle,.card-description,.section-note,.small,.help,.muted,.meta,.footer{color:var(--rw-muted)!important;}
      .card,.panel,.panel-inner,.doc,.stamp,.note,.info-box,.summary-card,.result-card,.tile,.month-row,.meeting-card,.saved-item,.totals .box,.stat-card,.metric,.empty,.history-list,.pro-receipt{
        background:linear-gradient(145deg, rgba(255,255,255,.82), rgba(247,251,255,.58))!important;
        border:1px solid var(--rw-line)!important;
        border-radius:8px!important;
        box-shadow:var(--rw-shadow)!important;
        backdrop-filter:blur(18px)!important;
      }
      .hero,.layout,.grid-2,.grid-3,.field-grid,.form-grid,.info-strip{gap:18px!important;}
      input,select,textarea{
        background:rgba(255,255,255,.88)!important;
        border:1px solid rgba(52,104,160,.18)!important;
        color:var(--rw-text)!important;
        border-radius:8px!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.78)!important;
      }
      input:focus,select:focus,textarea:focus{
        outline:none!important; border-color:rgba(14,165,233,.58)!important;
        box-shadow:0 0 0 4px rgba(14,165,233,.14), 0 0 28px rgba(14,165,233,.10)!important;
      }
      label,th{color:#173553!important;}
      button,.btn,.icon-btn,.small-btn,.lang-btn{
        border:1px solid rgba(52,104,160,.18)!important;
        border-radius:8px!important;
        background:linear-gradient(180deg,#ffffff,#dbeafe 52%,#7dd3fc)!important;
        color:#08243d!important;
        box-shadow:0 10px 26px rgba(14,165,233,.10), inset 0 1px 0 rgba(255,255,255,.86)!important;
      }
      .btn.secondary,.btn.soft,.small-btn,.icon-btn{
        background:rgba(255,255,255,.72)!important;
      }
      .btn.danger,.small-btn.delete{background:linear-gradient(180deg,#fb7185,#e11d48)!important;color:#fff!important;}
      .language-switcher,.lang-switch,.rw-tool-lang-ui{
        background:rgba(255,255,255,.74)!important;
        border:1px solid var(--rw-line)!important;
        box-shadow:0 14px 38px rgba(36,76,128,.08)!important;
      }
      .language-switcher button.active,.lang-btn.active,.lang-btn[aria-pressed="true"]{
        background:linear-gradient(180deg,#ffffff,#bfdbfe 54%,#38bdf8)!important;
        color:#06213b!important;
      }
      table{border-collapse:separate!important; border-spacing:0!important; overflow:hidden!important;}
      th,td{border-color:rgba(52,104,160,.14)!important; color:var(--rw-text)!important;}
      th{background:rgba(14,165,233,.08)!important;}
      .progress,.progress-fill{box-shadow:0 0 16px rgba(14,165,233,.08)!important;}
      .progress-fill{background:linear-gradient(90deg,var(--rw-cyan),var(--rw-blue))!important;}
      .chip,.badge{
        border:1px solid rgba(14,165,233,.18)!important;
        background:rgba(14,165,233,.08)!important;
        color:#075985!important;
      }
      .empty,.history-list .empty,.saved-empty{
        background:rgba(255,255,255,.64)!important;
        border:1px solid rgba(52,104,160,.16)!important;
        color:var(--rw-text)!important;
      }
      .tile *,.empty *,.history-list .empty *,.saved-empty *{
        color:var(--rw-text)!important;
      }
      .toast{background:#ffffff!important;color:#10233f!important;border:1px solid var(--rw-line-strong)!important;}
    }
    @media print{
      body{background:#fff!important;color:#111!important;}
      .doc,.pro-receipt{background:#fff!important;color:#111!important;box-shadow:none!important;}
    }`;
  function applyPremiumModuleTheme(frame){
    try {
      const doc = frame?.contentDocument;
      if (!doc || !doc.documentElement) return;
      doc.documentElement.classList.add('rw-premium-module-root');
      if (doc.body) doc.body.classList.add('rw-premium-module');
      if (doc.getElementById('rw-premium-module-theme')) return;
      const style = doc.createElement('style');
      style.id = 'rw-premium-module-theme';
      style.textContent = premiumModuleTheme;
      doc.head?.appendChild(style);
    } catch (e) {}
  }
  function skinModuleFrames(){
    document.querySelectorAll('iframe').forEach(applyPremiumModuleTheme);
  }
  function init(){
    document.body.classList.add('rw-v2-ready');
    syncBrand();
    ensureShell();
    enhancePin();
    patchPinGateHooks();
    ensureModuleBar();
    bindEvents();
    hideStageWidgets();
    new MutationObserver(hideStageWidgets).observe(document.body, { childList:true, subtree:true });
    setInterval(hideStageWidgets, 1200);
    skinModuleFrames();
    document.querySelectorAll('iframe').forEach(frame => frame.addEventListener('load', () => applyPremiumModuleTheme(frame)));
    new MutationObserver(skinModuleFrames).observe(document.body, { childList:true, subtree:true });
    setInterval(skinModuleFrames, 1200);
    applyLanguage();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
