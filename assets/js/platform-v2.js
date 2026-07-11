(function(){
  if (window.__rwPlatformV2) return;
  window.__rwPlatformV2 = true;

  const LS_LANG = 'rw_lang';
  const CONTACT_ENDPOINT = String(window.RW_CONTACT_ENDPOINT || '').trim();
  const modules = [
    { match:'Contract Budget Calculator', icon:'calculator', category:'finance',
      title:{pl:'Kalkulator budżetu kontraktu', en:'Contract Budget Calculator', nl:'Contractbudget calculator'},
      desc:{pl:'Szybka estymacja budżetu i kosztów kontraktu.', en:'Fast contract budget and cost estimation.', nl:'Snelle raming van contractbudget en kosten.'}},
    { match:'New Bill Rate', icon:'rate', category:'finance',
      title:{pl:'Nowa stawka Bill Rate', en:'New Bill Rate', nl:'Nieuw bill rate'},
      desc:{pl:'Kalkulacja marży, kosztu i stawki sprzedażowej.', en:'Calculate margin, cost, and client billing rate.', nl:'Bereken marge, kostprijs en klanttarief.'}},
    { match:['Urządzenie kalkulacyjne', 'Calculation Tool', 'Calculation device', 'Calculatietool', 'Rekeninstrument', 'Rekentool'], icon:'tool', category:'finance',
      title:{pl:'Rekentool', en:'Rekentool', nl:'Rekentool'},
      desc:{pl:'Pomocniczy moduł kalkulacyjny do codziennej pracy.', en:'Utility calculator for everyday operations.', nl:'Hulprekenmodule voor dagelijks werk.'}},
    { match:'Intake Call', icon:'call', category:'recruitment',
      title:{pl:'Intake Call', en:'Intake Call', nl:'Intakegesprek'},
      desc:{pl:'Strukturyzuje rozmowę intake i wymagania roli.', en:'Structure intake calls and role requirements.', nl:'Structureer intakegesprekken en functie-eisen.'}},
    { match:'Ocena dopasowania CV', icon:'cv', category:'recruitment',
      title:{pl:'Ocena dopasowania CV', en:'CV Match Review', nl:'CV-match beoordeling'},
      desc:{pl:'Porównanie CV z opisem stanowiska i wymaganiami.', en:'Compare a CV against role requirements.', nl:'Vergelijk een CV met functie-eisen.'}},
    { match:['MSD CAO', 'Merit increase'], icon:'document', category:'documents',
      title:{pl:'Merit increase 2026', en:'Merit increase 2026', nl:'Merit increase 2026'},
      desc:{pl:'Kalkulator merit increase z wyraźnym wyborem roku.', en:'Merit increase calculator with clear year selection.', nl:'Merit increase calculator met duidelijke jaarkeuze.'}},
    { match:'Merit Excel 350', icon:'document', category:'documents',
      title:{pl:'Merit Excel 350', en:'Merit Excel 350', nl:'Merit Excel 350'},
      desc:{pl:'Excel workbook for 350 merit rows with automatic GS/PS markup.', en:'Excel workbook for 350 merit rows with automatic GS/PS markup.', nl:'Excel workbook for 350 merit rows with automatic GS/PS markup.'}},
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
  const commandHotspots = [
    { id:'revenue', label:'Total revenue panel' },
    { id:'analytics', label:'Analytics panel' },
    { id:'kpi', label:'KPI panel' },
    { id:'table', label:'Monthly revenue panel' },
    { id:'calculations', label:'Calculations panel' },
    { id:'activity', label:'Global activity panel' },
    { id:'footer', label:'Footer links panel' }
  ];
  const legacyVisualStyleIds = [
    'rw-header-style',
    'platform-autumn-skin',
    'force-clean-ui',
    'remove-orange-frame-keep-layout',
    'remove-viewport-border',
    'force-no-border',
    'sticky-privacy-footer',
    'privacy-hide-helper',
    'rw-home-btn-transparent-orange-v5',
    'rw-home-button-style',
    'rw-home-override-orange',
    'rw-home-safe-area',
    'rw-fix-header-overlay',
    'rw-lang-style',
    'rw-brand-modern-final',
    'rw-ownership-mark-final',
    'rw-subtle-brand-final',
    'rw-futuristic-home-v16',
    'rw-futuristic-clean-v17',
    'rw-v18-active-visual',
    'rw-professional-final-v2',
    'rw-v20-molecular-visual',
    'rw-v21-fit-home-no-overlap',
    'rw-v22-composed-home',
    'rw-v24-single-card-accent',
    'rw-correct-platform-name',
    'rw-fullscreen-keyboard-bg-style',
    'rw-agent-hide-header-text',
    'rw-agent-buttons-relayout-fix',
    'rw-hide-auto-lang-text',
    'rw-futuristic-dock-style',
    'rw-professional-platform-v1',
    'rw-voice-agent-style'
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
    intro:{pl:'Prywatne centrum operacyjne.',
      en:'Private operations center.',
      nl:'Prive operationeel centrum.'},
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
    apiOff:{pl:'AI nieaktywne', en:'AI inactive', nl:'AI inactief'},
    contactTitle:{pl:'Kontakt', en:'Contact', nl:'Contact'},
    contactIntro:{pl:'W razie pytań lub zgłoszeń do platformy wyślij krótką wiadomość.', en:'For platform questions or requests, send a short message.', nl:'Stuur een kort bericht voor vragen of verzoeken over het platform.'},
    contactName:{pl:'Imię', en:'Name', nl:'Naam'},
    contactEmail:{pl:'Twój email', en:'Your email', nl:'Je e-mail'},
    contactMessage:{pl:'Wiadomość', en:'Message', nl:'Bericht'},
    contactSend:{pl:'Wyślij wiadomość', en:'Send message', nl:'Bericht verzenden'},
    contactSending:{pl:'Wysyłanie...', en:'Sending...', nl:'Verzenden...'},
    contactSent:{pl:'Twój mail został wysłany. Naciśnij OK, aby wrócić do startu.', en:'Your email has been sent. Press OK to return to start.', nl:'Je e-mail is verzonden. Druk op OK om terug te keren naar start.'},
    contactError:{pl:'Nie udało się wysłać wiadomości. Spróbuj ponownie za chwilę.', en:'The message could not be sent. Try again in a moment.', nl:'Het bericht kon niet worden verzonden. Probeer het later opnieuw.'},
    contactFallback:{pl:'Formularz serwerowy nie jest jeszcze aktywny. Otwieram gotową wiadomość email.', en:'The server contact form is not active yet. Opening a prepared email message.', nl:'Het serverformulier is nog niet actief. Ik open een voorbereide e-mail.'}
  };

  const iconSvg = (body) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  const icons = {
    calculator:iconSvg('<rect x="6" y="3.5" width="12" height="17" rx="2.4"/><path d="M8.8 7.3h6.4M9 11h.1M12 11h.1M15 11h.1M9 14.5h.1M12 14.5h.1M15 14.5h.1M9 18h6"/>'),
    rate:iconSvg('<path d="M4.5 19.5V5.2"/><path d="M4.5 19.5h15"/><path d="m7.2 15.5 3.8-4 3.1 2.6 4.7-7.2"/><path d="M16.2 6.9h2.6v2.7"/>'),
    tool:iconSvg('<path d="M14.8 6.2a4.2 4.2 0 0 0-5.1 5.1L4.4 16.6v3h3l5.3-5.3a4.2 4.2 0 0 0 5.1-5.1l-2.9 2.9-2-2 2.9-2.9Z"/><path d="M6.2 18.1h.1"/>'),
    call:iconSvg('<path d="M20.7 16.7v2.6a1.9 1.9 0 0 1-2.1 1.9 18 18 0 0 1-7.7-2.8 17.6 17.6 0 0 1-5.4-5.4 18 18 0 0 1-2.8-7.8 1.9 1.9 0 0 1 1.9-2h2.7a1.8 1.8 0 0 1 1.8 1.5c.1.8.3 1.5.5 2.2a1.9 1.9 0 0 1-.4 2L8 10a14.3 14.3 0 0 0 6 6l1.1-1.1a1.9 1.9 0 0 1 2-.4c.7.2 1.5.4 2.3.5a1.8 1.8 0 0 1 1.3 1.7Z"/>'),
    cv:iconSvg('<path d="M7 3.2h7.3L19 7.9v12.9H7a2 2 0 0 1-2-2V5.2a2 2 0 0 1 2-2Z"/><path d="M14 3.5V8h4.5"/><path d="M8.5 12.5h7M8.5 16h5.2"/>'),
    scan:iconSvg('<path d="M4.5 8V5.6a1.1 1.1 0 0 1 1.1-1.1H8M16 4.5h2.4a1.1 1.1 0 0 1 1.1 1.1V8M19.5 16v2.4a1.1 1.1 0 0 1-1.1 1.1H16M8 19.5H5.6a1.1 1.1 0 0 1-1.1-1.1V16"/><path d="M7.5 12h9"/>'),
    document:iconSvg('<path d="M7 3.2h7.4L19 7.8v13H7a2 2 0 0 1-2-2V5.2a2 2 0 0 1 2-2Z"/><path d="M14 3.5V8h4.5"/><path d="M8.5 12.7h6.8M8.5 16.2h6.8"/>'),
    agency:iconSvg('<path d="M3.5 20.5h17"/><path d="M5.5 20.5V8l6.5-4.2L18.5 8v12.5"/><path d="M9 20.5v-6h6v6"/><path d="M8.6 9.6h.1M15.3 9.6h.1"/>'),
    meeting:iconSvg('<rect x="4" y="4.6" width="16" height="15.4" rx="2.2"/><path d="M8.2 3v4M15.8 3v4M4 9.4h16"/><path d="M8 13.4h4.5M8 16.8h7"/>'),
    home:iconSvg('<path d="m3.8 11.2 8.2-7.3 8.2 7.3"/><path d="M6 10.5v9.2h12v-9.2"/><path d="M9.2 19.7v-5.6h5.6v5.6"/>'),
    project:iconSvg('<path d="M3.8 7.2h6.7l1.9 2h7.8v9.6a2 2 0 0 1-2 2H5.8a2 2 0 0 1-2-2Z"/><path d="M3.8 7.2V5.4a2 2 0 0 1 2-2h3.7l1.9 1.9h3.5"/>')
  };

  let activeFilter = 'all';
  let activeModuleTitle = '';
  let activeLangOverride = null;

  function lang(){
    let stored = '';
    try { stored = localStorage.getItem(LS_LANG) || ''; } catch(_e) {}
    const raw = String(activeLangOverride || stored || document.documentElement.lang || 'pl').toLowerCase();
    if (raw.startsWith('en')) return 'en';
    if (raw.startsWith('nl')) return 'nl';
    return 'pl';
  }
  function setPlatformLang(nextLang){
    activeLangOverride = String(nextLang || 'pl').toLowerCase().slice(0, 2);
    if (!['pl', 'en', 'nl'].includes(activeLangOverride)) activeLangOverride = 'pl';
    try {
      localStorage.setItem(LS_LANG, activeLangOverride);
      localStorage.setItem('doc_lang', activeLangOverride);
      localStorage.setItem('supplier_lang', activeLangOverride);
    } catch(_e) {}
    document.documentElement.lang = activeLangOverride;
    syncLegacyLangButtons(activeLangOverride);
    pushLanguageToModules(activeLangOverride);
    try { window.dispatchEvent(new CustomEvent('rwLanguageChanged', { detail:{ lang:activeLangOverride } })); } catch(_e) {}
    scheduleLanguagePush(activeLangOverride);
  }
  function t(key){ return copy[key]?.[lang()] || copy[key]?.pl || key; }
  function uiText(key){
    const texts = {
      command:{pl:'Szukaj', en:'Command', nl:'Zoeken'},
      commandTitle:{pl:'Command Center', en:'Command Center', nl:'Command Center'},
      commandHint:{pl:'Wpisz nazwe modulu', en:'Type a module name', nl:'Typ een modulenaam'},
      commandEmpty:{pl:'Brak wynikow', en:'No results', nl:'Geen resultaten'},
      systemOnline:{pl:'System online', en:'System online', nl:'Systeem online'},
      quickAccess:{pl:'Szybki dostep', en:'Quick access', nl:'Snelle toegang'}
    };
    return texts[key]?.[lang()] || texts[key]?.pl || key;
  }
  function moduleTitle(meta){
    return meta?.title?.[lang()] || meta?.title?.pl || '';
  }
  function syncHomeLang(){
    document.querySelectorAll('[data-rw-home-lang]').forEach((btn) => {
      btn.setAttribute('aria-pressed', btn.dataset.rwHomeLang === lang() ? 'true' : 'false');
    });
  }
  function syncLegacyLangButtons(nextLang){
    const current = normalizePlatformLang(nextLang || lang());
    document.querySelectorAll('.rw-lang-btn').forEach((btn) => {
      const active = normalizePlatformLang(btn.dataset.lang || '') === current;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      btn.classList.toggle('active', active);
    });
  }
  function normalizePlatformLang(value){
    const raw = String(value || '').toLowerCase().slice(0, 2);
    return ['pl', 'en', 'nl'].includes(raw) ? raw : 'pl';
  }
  function pushLanguageToModules(nextLang){
    const requestedLang = normalizePlatformLang(nextLang || lang());
    if (typeof window.__rwPushLang === 'function') {
      window.__rwPushLang(requestedLang);
      return;
    }
    document.querySelectorAll('iframe').forEach((frame) => {
      try {
        frame.contentWindow?.postMessage({ type:'rw:setLang', lang:requestedLang }, '*');
      } catch(_e) {}
    });
  }
  function scheduleLanguagePush(nextLang){
    const requestedLang = normalizePlatformLang(nextLang || lang());
    [0, 80, 360, 900].forEach((delay) => {
      setTimeout(() => pushLanguageToModules(requestedLang), delay);
    });
  }
  function findMeta(card){
    const storedIndex = Number(card?.dataset?.rwModuleIndex);
    if (Number.isInteger(storedIndex) && modules[storedIndex]) return modules[storedIndex];
    const title = card.querySelector('.title');
    const key = title?.dataset.titleKey || title?.textContent || '';
    const foundIndex = modules.findIndex((m) => {
      const matches = Array.isArray(m.match) ? m.match : [m.match];
      return matches.some((match) => key.includes(match) || String(title?.textContent || '').includes(match));
    });
    const nextIndex = foundIndex >= 0 ? foundIndex : 0;
    if (card) card.dataset.rwModuleIndex = String(nextIndex);
    return modules[nextIndex];
  }
  function syncBrand(){
    document.querySelectorAll('.rw-brand-main').forEach((el) => {
      el.textContent = 'Rafal Wilk Digital Workshop';
    });
    document.querySelectorAll('.rw-title').forEach((el) => {
      el.setAttribute('aria-label', 'Rafal Wilk Digital Workshop');
    });
    document.title = 'Rafal Wilk Digital Workshop';
  }
  function retireLegacyVisualLayers(){
    legacyVisualStyleIds.forEach((id) => {
      const style = document.getElementById(id);
      if (!style || style.dataset.rwRetired === 'true') return;
      style.dataset.rwRetired = 'true';
      style.setAttribute('media', 'not all');
      style.disabled = true;
    });
  }
  function ensureShell(){
    const main = document.querySelector('main.wrap');
    const grid = main?.querySelector('.grid');
    if (!main || !grid) return;
    let shell = main.querySelector('.rw-v2-shell');
    if (!shell) {
      shell = document.createElement('div');
      shell.className = 'rw-v2-shell';
      const hero = document.createElement('section');
      hero.className = 'rw-v2-hero';
      const toolbar = document.createElement('section');
      toolbar.className = 'rw-v2-toolbar';
      main.insertBefore(shell, grid);
      shell.append(hero, toolbar, grid);
    }
    if (!shell.querySelector('.rw-v2-contact')) {
      const contact = document.createElement('section');
      contact.className = 'rw-v2-contact';
      shell.appendChild(contact);
    }
    if (!shell.querySelector('.rw-v2-hotspots')) {
      const hotspots = document.createElement('div');
      hotspots.className = 'rw-v2-hotspots';
      hotspots.setAttribute('aria-hidden', 'true');
      hotspots.innerHTML = commandHotspots.map((item) =>
        `<button type="button" class="rw-v2-hotspot rw-v2-hotspot-${item.id}" data-rw-hotspot="${item.id}" title="${item.label}"></button>`
      ).join('');
      shell.appendChild(hotspots);
    }
    if (!shell.querySelector('.rw-v2-floating-lang')) {
      const langControls = document.createElement('div');
      langControls.className = 'rw-v2-floating-lang';
      langControls.setAttribute('role', 'group');
      langControls.setAttribute('aria-label', 'Language');
      langControls.innerHTML = '<button type="button" data-rw-home-lang="pl">PL</button><button type="button" data-rw-home-lang="en">EN</button><button type="button" data-rw-home-lang="nl">NL</button>';
      shell.appendChild(langControls);
    }
    if (!shell.querySelector('.rw-v2-depth-field')) {
      const depth = document.createElement('div');
      depth.className = 'rw-v2-depth-field';
      depth.setAttribute('aria-hidden', 'true');
      depth.innerHTML = '<span></span><span></span><span></span><span></span><span></span>';
      shell.appendChild(depth);
    }
    if (!shell.querySelector('.rw-v2-wall-clock')) {
      const clock = document.createElement('div');
      clock.className = 'rw-v2-wall-clock';
      clock.setAttribute('aria-hidden', 'true');
      clock.innerHTML = '<span class="rw-v2-wall-clock-time"></span><span class="rw-v2-wall-clock-date"></span>';
      shell.appendChild(clock);
    }
    if (!shell.querySelector('.rw-v2-command-trigger')) {
      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'rw-v2-command-trigger';
      trigger.setAttribute('data-rw-command-open', 'true');
      shell.appendChild(trigger);
    }
    if (!shell.querySelector('.rw-v2-system-strip')) {
      const strip = document.createElement('div');
      strip.className = 'rw-v2-system-strip';
      strip.setAttribute('aria-hidden', 'true');
      shell.appendChild(strip);
    }
    if (!shell.querySelector('.rw-v2-command-palette')) {
      const palette = document.createElement('div');
      palette.className = 'rw-v2-command-palette';
      palette.setAttribute('hidden', '');
      palette.innerHTML = `<div class="rw-v2-command-dialog" role="dialog" aria-modal="true">
        <div class="rw-v2-command-head">
          <strong></strong>
          <button type="button" data-rw-command-close="true" aria-label="Close">x</button>
        </div>
        <input class="rw-v2-command-input" type="search" autocomplete="off">
        <div class="rw-v2-command-list" role="listbox"></div>
      </div>`;
      shell.appendChild(palette);
    }
  }
  function renderHero(){
    const hero = document.querySelector('.rw-v2-hero');
    if (!hero) return;
    hero.innerHTML = `<div class="rw-v2-hero-poster">
      <h2 class="rw-v2-brand-lockup">
        <span>Rafal Wilk Digital Workshop</span>
        <span class="rw-v2-copy-mark" title="Copyright" aria-label="Copyright">&copy;</span>
      </h2>
      <div class="rw-v2-home-lang" role="group" aria-label="Language">
        <button type="button" data-rw-home-lang="pl">PL</button>
        <button type="button" data-rw-home-lang="en">EN</button>
        <button type="button" data-rw-home-lang="nl">NL</button>
      </div>
    </div>`;
    syncHomeLang();
    updateWallClock();
    renderCommandUi();
  }
  function renderToolbar(){
    const toolbar = document.querySelector('.rw-v2-toolbar');
    if (!toolbar) return;
    activeFilter = 'all';
    toolbar.hidden = true;
    toolbar.innerHTML = '';
    renderCommandUi();
  }
  function moduleCards(){
    return Array.from(document.querySelectorAll('main.wrap .grid .card'));
  }
  function renderSystemStrip(){
    const strip = document.querySelector('.rw-v2-system-strip');
    if (!strip) return;
    const count = moduleCards().filter(card => !card.hidden).length;
    strip.innerHTML = `<span>${uiText('systemOnline')}</span><strong>${count}</strong><span>${uiText('quickAccess')}</span>`;
  }
  function commandRows(query = ''){
    const q = query.trim().toLowerCase();
    return moduleCards().map((card) => {
      const meta = findMeta(card);
      const title = meta.title[lang()] || meta.title.pl;
      const haystack = `${title} ${meta.category}`.toLowerCase();
      return { card, meta, title, visible:!card.hidden && (!q || haystack.includes(q)) };
    }).filter(item => item.visible);
  }
  function renderCommandList(query = ''){
    const list = document.querySelector('.rw-v2-command-list');
    if (!list) return;
    const rows = commandRows(query);
    list.innerHTML = rows.length ? rows.map((item, index) => `
      <button type="button" class="rw-v2-command-item" data-rw-command-index="${index}">
        <span class="rw-v2-command-icon">${icons[item.meta.icon] || icons.project}</span>
        <span>${item.title}</span>
        <small>${item.meta.category}</small>
      </button>`).join('') : `<div class="rw-v2-command-empty">${uiText('commandEmpty')}</div>`;
    list.querySelectorAll('[data-rw-command-index]').forEach((button, index) => {
      button.addEventListener('click', () => {
        const item = rows[index];
        closeCommandPalette();
        item?.card?.querySelector('.btn')?.click();
      });
    });
  }
  function renderCommandUi(){
    const trigger = document.querySelector('.rw-v2-command-trigger');
    if (trigger) trigger.innerHTML = `<span>${uiText('command')}</span><kbd>Ctrl K</kbd>`;
    const palette = document.querySelector('.rw-v2-command-palette');
    const title = palette?.querySelector('.rw-v2-command-head strong');
    const input = palette?.querySelector('.rw-v2-command-input');
    if (title) title.textContent = uiText('commandTitle');
    if (input) input.placeholder = uiText('commandHint');
    renderSystemStrip();
  }
  function updateWallClock(){
    const clock = document.querySelector('.rw-v2-wall-clock');
    if (!clock) return;
    const now = new Date();
    const locale = lang() === 'nl' ? 'nl-NL' : lang() === 'en' ? 'en-GB' : 'pl-PL';
    const time = new Intl.DateTimeFormat(locale, { hour:'2-digit', minute:'2-digit' }).format(now);
    const date = new Intl.DateTimeFormat(locale, { weekday:'short', day:'2-digit', month:'short', year:'numeric' }).format(now);
    clock.querySelector('.rw-v2-wall-clock-time').textContent = time;
    clock.querySelector('.rw-v2-wall-clock-date').textContent = date.replace(/\.$/, '');
  }
  function openCommandPalette(){
    const palette = document.querySelector('.rw-v2-command-palette');
    const input = palette?.querySelector('.rw-v2-command-input');
    if (!palette || !input || document.body.classList.contains('app-open')) return;
    palette.hidden = false;
    palette.classList.add('is-open');
    renderCommandUi();
    renderCommandList('');
    input.value = '';
    setTimeout(() => input.focus(), 30);
  }
  function closeCommandPalette(){
    const palette = document.querySelector('.rw-v2-command-palette');
    if (!palette) return;
    palette.classList.remove('is-open');
    palette.hidden = true;
  }
  function renderContact(){
    const contact = document.querySelector('.rw-v2-contact');
    if (!contact) return;
    contact.innerHTML = `<div class="rw-v2-contact-copy">
      <span>${t('contactTitle')}</span>
      <a href="mailto:rafalw898@gmail.com">rafalw898@gmail.com</a>
      <p>${t('contactIntro')}</p>
    </div>
    <form class="rw-v2-contact-form" action="${CONTACT_ENDPOINT || '#'}" method="POST">
      <label><span>${t('contactName')}</span><input name="name" autocomplete="name" required></label>
      <label><span>${t('contactEmail')}</span><input type="email" name="email" autocomplete="email" required></label>
      <label class="rw-v2-contact-message"><span>${t('contactMessage')}</span><textarea name="message" rows="4" required></textarea></label>
      <label class="rw-v2-contact-honeypot"><span>Website</span><input name="website" autocomplete="off" tabindex="-1"></label>
      <button type="submit">${t('contactSend')}</button>
    </form>`;
  }
  function getContactEndpoint(){
    return String(window.RW_CONTACT_ENDPOINT || CONTACT_ENDPOINT || '').trim();
  }
  function contactMailto(form){
    const data = new FormData(form);
    const subject = encodeURIComponent('Rafal Wilk Digital Workshop - contact request');
    const body = encodeURIComponent(`Imie: ${data.get('name') || ''}\nEmail: ${data.get('email') || ''}\n\n${data.get('message') || ''}`);
    window.location.href = `mailto:rafalw898@gmail.com?subject=${subject}&body=${body}`;
  }
  async function submitContactForm(form){
    const data = new FormData(form);
    if (data.get('website')) return;
    const endpoint = getContactEndpoint();
    if (!endpoint) {
      window.alert(t('contactFallback'));
      contactMailto(form);
      return;
    }
    const button = form.querySelector('button[type="submit"]');
    const original = button?.textContent || t('contactSend');
    if (button) {
      button.disabled = true;
      button.textContent = t('contactSending');
    }
    try {
      const response = await fetch(endpoint, {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Accept:'application/json' },
        body:JSON.stringify({
          name:String(data.get('name') || '').trim(),
          email:String(data.get('email') || '').trim(),
          message:String(data.get('message') || '').trim(),
          lang:lang(),
          page:window.location.href
        })
      });
      if (!response.ok) throw new Error('contact-send-failed');
      form.reset();
      window.alert(t('contactSent'));
      window.scrollTo({ top:0, behavior:'smooth' });
    } catch(_error) {
      window.alert(t('contactError'));
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = original;
      }
    }
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
      let dots = card.querySelector('.rw-v2-window-dots');
      if (!dots) {
        dots = document.createElement('div');
        dots.className = 'rw-v2-window-dots';
        dots.innerHTML = '<span></span><span></span><span></span><span></span>';
        card.insertBefore(dots, icon);
      }
      icon.innerHTML = icons[meta.icon] || icons.project;
      card.querySelector('.rw-v2-card-meta')?.remove();
      card.querySelector('.rw-v2-card-desc')?.remove();
      const title = card.querySelector('.title');
      const titleText = moduleTitle(meta);
      if (title) title.textContent = titleText;
      card.classList.add('rw-v2-card-clickable');
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${t('open')} ${titleText}`);
      const btn = card.querySelector('.btn');
      if (btn) {
        const label = `${t('open')} ${titleText}`;
        btn.classList.add('rw-v2-card-open');
        btn.setAttribute('aria-label', label);
        btn.setAttribute('title', label);
        btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7"/><path d="M9 7h8v8"/></svg>';
      }
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
    const gate = document.getElementById('mc_gate');
    const module = String(activeModuleTitle || gate?.dataset.rwModuleTitle || '').trim();
    const pinText = {
      pl: module ? `Wpisz PIN, aby otworzyć: ${module}` : 'Wpisz PIN, aby otworzyć wybrany moduł.',
      en: module ? `Enter PIN to open: ${module}` : 'Enter PIN to open this module.',
      nl: module ? `Voer de pincode in voor: ${module}` : 'Voer de pincode in om deze module te openen.'
    };
    const desiredTitle = t('pinTitle');
    const desiredText = pinText[lang()] || pinText.pl;
    const desiredCancel = t('cancel');
    const desiredOk = t('unlock');
    if (title && title.textContent !== desiredTitle) title.textContent = desiredTitle;
    if (text && text.textContent !== desiredText) text.textContent = desiredText;
    if (cancel && cancel.textContent !== desiredCancel) cancel.textContent = desiredCancel;
    if (ok && ok.textContent !== desiredOk) ok.textContent = desiredOk;
  }
  function patchPinGateHooks(){
    if (window.__rwV2PinHooks) return;
    window.__rwV2PinHooks = true;
    const originalRequest = window.__rwRequestModulePin;
    if (typeof originalRequest === 'function') {
      window.__rwRequestModulePin = function(callback, moduleTitle){
        activeModuleTitle = moduleTitle || '';
        const gate = document.getElementById('mc_gate');
        if (gate) gate.dataset.rwModuleTitle = activeModuleTitle;
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
    const pinTextObserver = new MutationObserver(() => {
      if (!gate || getComputedStyle(gate).display === 'none') return;
      setTimeout(patchPinTexts, 0);
    });
    gate && pinTextObserver.observe(gate, { childList:true, characterData:true, subtree:true, attributes:true, attributeFilter:['style', 'class'] });
    setInterval(() => {
      if (gate && getComputedStyle(gate).display !== 'none') patchPinTexts();
    }, 900);
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
    bar.querySelector('.rw-v2-back').addEventListener('click', () => {
      markHomeReturn();
      document.getElementById('rw_home_btn')?.click();
    });
    bar.querySelectorAll('[data-lang]').forEach(btn => btn.addEventListener('click', () => {
      const nextLang = normalizePlatformLang(btn.dataset.lang || 'pl');
      setPlatformLang(nextLang);
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
  function markModuleLaunch(card){
    document.body.classList.add('rw-v2-opening-module');
    card?.classList.add('rw-v2-launching');
    window.setTimeout(() => {
      document.body.classList.remove('rw-v2-opening-module');
      card?.classList.remove('rw-v2-launching');
    }, 900);
  }
  function markHomeReturn(){
    document.body.classList.add('rw-v2-returning-home');
    window.setTimeout(() => document.body.classList.remove('rw-v2-returning-home'), 700);
  }
  function applyLanguage(){
    renderHero();
    renderToolbar();
    renderContact();
    enhanceCards();
    patchPinTexts();
    updateModuleBar();
    syncHomeLang();
    updateWallClock();
  }
  function bindEvents(){
    window.addEventListener('message', (event) => {
      if (!event || !event.data || event.data.type !== 'rw:setLang') return;
      const nextLang = normalizePlatformLang(event.data.lang || 'pl');
      if (nextLang === lang()) {
        syncLegacyLangButtons(nextLang);
        updateModuleBar();
        return;
      }
      setPlatformLang(nextLang);
      applyLanguage();
    });
    document.addEventListener('click', (event) => {
      const homeLang = event.target.closest('[data-rw-home-lang]');
      if (homeLang) {
        event.preventDefault();
        const nextLang = homeLang.dataset.rwHomeLang || 'pl';
        setPlatformLang(nextLang);
        applyLanguage();
        setTimeout(applyLanguage, 120);
        setTimeout(applyLanguage, 700);
        setTimeout(applyLanguage, 1700);
        return;
      }
      if (event.target.closest('[data-rw-command-open]')) {
        event.preventDefault();
        openCommandPalette();
        return;
      }
      if (event.target.closest('[data-rw-command-close]') || event.target.classList?.contains('rw-v2-command-palette')) {
        event.preventDefault();
        closeCommandPalette();
        return;
      }
      const hotspot = event.target.closest('.rw-v2-hotspot');
      if (hotspot) {
        event.preventDefault();
        hotspot.classList.add('rw-v2-hotspot-pulse');
        setTimeout(() => hotspot.classList.remove('rw-v2-hotspot-pulse'), 520);
        return;
      }
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
      const wholeCard = event.target.closest('main.wrap .grid .card');
      if (wholeCard && !event.target.closest('a, button, input, select, textarea, label, [contenteditable="true"]')) {
        const btn = wholeCard.querySelector('.btn');
        if (btn) {
          event.preventDefault();
          btn.click();
          return;
        }
      }
      const moduleButton = event.target.closest('main.wrap .grid .btn');
      if (moduleButton) {
        const card = moduleButton.closest('.card');
        const meta = card && findMeta(card);
        activeModuleTitle = meta ? (meta.title[lang()] || meta.title.pl) : '';
        markModuleLaunch(card);
        scheduleLanguagePush(lang());
      }
      const globalLangBtn = event.target.closest('.rw-lang-btn');
      if (globalLangBtn) {
        if (globalLangBtn.dataset.lang) {
          setPlatformLang(globalLangBtn.dataset.lang);
        }
        setTimeout(applyLanguage, 40);
      }
    }, true);
    document.addEventListener('submit', (event) => {
      const form = event.target.closest?.('.rw-v2-contact-form');
      if (!form) return;
      event.preventDefault();
      submitContactForm(form);
    });
    window.addEventListener('storage', applyLanguage);
    window.addEventListener('rwLanguageChanged', applyLanguage);
    setInterval(() => {
      if (!document.body.classList.contains('app-open')) {
        syncHomeLang();
        enhanceCards();
      } else {
        updateModuleBar();
      }
    }, 3600);
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const card = event.target.closest?.('main.wrap .grid .card');
      if (!card || event.target.closest('a, button, input, select, textarea, label, [contenteditable="true"]')) return;
      const btn = card.querySelector('.btn');
      if (!btn) return;
      event.preventDefault();
      btn.click();
    });
    document.addEventListener('input', (event) => {
      if (!event.target.matches?.('.rw-v2-command-input')) return;
      renderCommandList(event.target.value || '');
    });
    document.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openCommandPalette();
        return;
      }
      if (event.key === 'Escape') closeCommandPalette();
    });
    const bodyObserver = new MutationObserver(updateModuleBar);
    bodyObserver.observe(document.body, { attributes:true, attributeFilter:['class'] });
    setInterval(updateModuleBar, 3000);
  }
  let premiumPointerBound = false;
  function bindPremiumPointer(){
    if (premiumPointerBound) return;
    premiumPointerBound = true;
    let raf = 0;
    let nextX = 55;
    let nextY = 38;
    const update = () => {
      raf = 0;
      document.documentElement.style.setProperty('--rw-pointer-x', `${nextX}%`);
      document.documentElement.style.setProperty('--rw-pointer-y', `${nextY}%`);
    };
    window.addEventListener('pointermove', (event) => {
      if (document.body.classList.contains('app-open')) return;
      nextX = Math.max(0, Math.min(100, (event.clientX / Math.max(1, window.innerWidth)) * 100));
      nextY = Math.max(0, Math.min(100, (event.clientY / Math.max(1, window.innerHeight)) * 100));
      if (!raf) raf = window.requestAnimationFrame(update);
    }, { passive:true });
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
      html.rw-premium-module-root body{
        animation:rwPremiumModuleIn .34s cubic-bezier(.2,.8,.2,1) both;
        min-height:100vh!important;
      }
      html.rw-premium-module-root body::after{
        content:"";
        position:fixed;
        inset:auto 8% 0 8%;
        height:38vh;
        pointer-events:none;
        z-index:-1;
        background:
          radial-gradient(circle at 18% 30%, rgba(14,165,233,.18), transparent 34%),
          radial-gradient(circle at 78% 54%, rgba(139,92,246,.13), transparent 35%);
        filter:blur(24px);
        opacity:.72;
      }
      .topbar,.toolbar,.header,.hero,.page-header{
        background:linear-gradient(135deg, rgba(255,255,255,.80), rgba(226,242,255,.52))!important;
        border:1px solid rgba(87,143,196,.16)!important;
        border-radius:8px!important;
        box-shadow:0 16px 42px rgba(13,42,74,.07)!important;
        backdrop-filter:blur(18px)!important;
      }
      .card,.panel,.panel-inner,.doc,.stamp,.note,.info-box,.summary-card,.result-card,.tile,.month-row,.meeting-card,.saved-item,.totals .box,.stat-card,.metric,.empty,.history-list,.pro-receipt,
      button,.btn,.icon-btn,.small-btn,.lang-btn,input,select,textarea{
        transition:transform .22s ease, box-shadow .22s ease, border-color .22s ease, background .22s ease, color .18s ease!important;
      }
      .card:hover,.panel:hover,.tile:hover,.summary-card:hover,.result-card:hover,.meeting-card:hover,.saved-item:hover,.metric:hover{
        transform:translateY(-2px)!important;
        border-color:rgba(14,165,233,.30)!important;
        box-shadow:0 22px 60px rgba(31,79,125,.13), 0 0 34px rgba(14,165,233,.07)!important;
      }
      button:hover,.btn:hover,.icon-btn:hover,.small-btn:hover,.lang-btn:hover{
        transform:translateY(-1px)!important;
        border-color:rgba(14,165,233,.38)!important;
        box-shadow:0 14px 34px rgba(14,165,233,.15), inset 0 1px 0 rgba(255,255,255,.90)!important;
      }
      button:active,.btn:active,.icon-btn:active,.small-btn:active,.lang-btn:active{
        transform:translateY(0) scale(.99)!important;
      }
      th{
        background:linear-gradient(180deg, rgba(8,35,61,.94), rgba(12,55,88,.90))!important;
        color:#f7fbff!important;
        border-color:rgba(125,211,252,.18)!important;
      }
      td{
        background:rgba(255,255,255,.52)!important;
      }
      tr:nth-child(even) td{
        background:rgba(238,247,255,.68)!important;
      }
      html.rw-premium-module-root .topbar,
      html.rw-premium-module-root .toolbar,
      html.rw-premium-module-root .header,
      html.rw-premium-module-root .page-header{
        position:relative!important;
        overflow:hidden!important;
      }
      html.rw-premium-module-root .topbar::after,
      html.rw-premium-module-root .toolbar::after,
      html.rw-premium-module-root .header::after,
      html.rw-premium-module-root .page-header::after{
        content:"";
        position:absolute;
        inset:0;
        pointer-events:none;
        background:linear-gradient(110deg, transparent 0 42%, rgba(14,165,233,.10) 48%, transparent 56% 100%);
      }
      html.rw-premium-module-root h1,
      html.rw-premium-module-root h2,
      html.rw-premium-module-root h3{
        font-weight:760!important;
        letter-spacing:-.018em!important;
      }
      html.rw-premium-module-root .card,
      html.rw-premium-module-root .panel,
      html.rw-premium-module-root .summary-card,
      html.rw-premium-module-root .result-card,
      html.rw-premium-module-root .metric,
      html.rw-premium-module-root .tile{
        position:relative!important;
        overflow:hidden!important;
      }
      html.rw-premium-module-root .card::before,
      html.rw-premium-module-root .panel::before,
      html.rw-premium-module-root .summary-card::before,
      html.rw-premium-module-root .result-card::before,
      html.rw-premium-module-root .metric::before,
      html.rw-premium-module-root .tile::before{
        content:"";
        position:absolute;
        inset:0;
        pointer-events:none;
        background:
          linear-gradient(135deg, rgba(255,255,255,.34), transparent 32%),
          radial-gradient(circle at 100% 0, rgba(14,165,233,.10), transparent 30%);
        opacity:.54;
      }
      html.rw-premium-module-root input,
      html.rw-premium-module-root select,
      html.rw-premium-module-root textarea{
        min-height:38px!important;
      }
      html.rw-premium-module-root table{
        box-shadow:0 18px 46px rgba(36,76,128,.08)!important;
        border-radius:8px!important;
      }
      html.rw-premium-module-root .btn.primary,
      html.rw-premium-module-root button.primary,
      html.rw-premium-module-root .btn:not(.secondary):not(.soft):not(.danger){
        background:linear-gradient(180deg,#ffffff 0%,#d9f1ff 42%,#7dd3fc 100%)!important;
      }
      @keyframes rwPremiumModuleIn{
        from{opacity:.72; transform:translateY(8px) scale(.996);}
        to{opacity:1; transform:translateY(0) scale(1);}
      }
    }
    @media (prefers-reduced-motion:reduce){
      html.rw-premium-module-root body,
      .card,.panel,.panel-inner,.doc,.stamp,.note,.info-box,.summary-card,.result-card,.tile,.month-row,.meeting-card,.saved-item,.totals .box,.stat-card,.metric,.empty,.history-list,.pro-receipt,
      button,.btn,.icon-btn,.small-btn,.lang-btn,input,select,textarea{
        animation:none!important;
        transition:none!important;
      }
    }
    @media print{
      body{background:#fff!important;color:#111!important;}
      .doc,.pro-receipt{background:#fff!important;color:#111!important;box-shadow:none!important;}
    }`;
  function rekentoolMeritHtml(){
    let html = String(window.__rwMeritModuleHtml || '');
    if (!html) return '';
    const colors = {
      '#1a73e8':'#fb8c00',
      '#0b57d0':'#c56a00',
      '#4285f4':'#fb8c00',
      '#0d47a1':'#9a3412',
      '#174ea6':'#9a3412',
      '#e8f0fe':'#fff3e0',
      '#d4e3fb':'#fed7aa'
    };
    Object.entries(colors).forEach(([from, to]) => {
      html = html.replace(new RegExp(from, 'gi'), to);
    });
    const theme = `<style id="rw-rekentool-merit-theme">
      html,body{background:#f5f6f8!important;color:#111827!important;font-family:Inter,Arial,Helvetica,sans-serif!important;}
      body{min-height:0!important;overflow-x:hidden!important;}
      .topbar{display:none!important;}
      .hero{
        padding:28px 24px 50px!important;
        background:linear-gradient(135deg,#111827 0%,#273449 72%,#9a3412 100%)!important;
        border-bottom:3px solid #fb8c00!important;
      }
      .hero h1{font-family:Inter,Arial,Helvetica,sans-serif!important;font-weight:800!important;letter-spacing:0!important;}
      main{max-width:none!important;margin:-28px auto 0!important;padding:0 18px 24px!important;}
      .card{
        border:1px solid rgba(17,24,39,.10)!important;
        border-radius:16px!important;
        box-shadow:0 8px 24px rgba(15,23,42,.08)!important;
      }
      .card-header{font-family:Inter,Arial,Helvetica,sans-serif!important;}
      .step-chip{
        color:#9a3412!important;
        background:#fff3e0!important;
        border:1px solid #fed7aa!important;
      }
      button,.md-select,input,select{font-family:Inter,Arial,Helvetica,sans-serif!important;}
      button:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid rgba(251,140,0,.24)!important;outline-offset:2px!important;}
      @media(max-width:720px){
        .hero{padding:24px 16px 44px!important;}
        main{padding-left:10px!important;padding-right:10px!important;}
      }
    </style>`;
    return html.replace('</head>', `${theme}</head>`);
  }

  function integrateRekentoolMerit(frame){
    try {
      const outerDoc = frame?.contentDocument;
      const innerFrame = outerDoc?.getElementById('toolFrame');
      if (!innerFrame || !window.__rwMeritModuleHtml) return;

      const install = () => {
        try {
          const doc = innerFrame.contentDocument;
          const oldPanel = doc?.querySelector('section.merit-panel');
          if (!doc || !oldPanel || doc.getElementById('rwMerit2026Replacement')) return;

          let bridgeStyle = doc.getElementById('rw-merit-replacement-style');
          if (!bridgeStyle) {
            bridgeStyle = doc.createElement('style');
            bridgeStyle.id = 'rw-merit-replacement-style';
            bridgeStyle.textContent = `
              section.merit-panel[data-rw-merit-replaced="true"]{display:none!important;}
              .rw-merit-2026-panel{
                display:block!important;
                margin-top:0!important;
                padding:0!important;
                overflow:hidden!important;
                background:#f5f6f8!important;
                border:1px solid rgba(17,24,39,.10)!important;
                border-radius:18px!important;
                box-shadow:0 12px 30px rgba(15,23,42,.09)!important;
              }
              .rw-merit-2026-frame{
                display:block!important;
                width:100%!important;
                min-height:1180px!important;
                margin:0!important;
                padding:0!important;
                border:0!important;
                background:#f5f6f8!important;
              }`;
            doc.head?.appendChild(bridgeStyle);
          }

          oldPanel.setAttribute('data-rw-merit-replaced', 'true');
          const section = doc.createElement('section');
          section.id = 'rwMerit2026Replacement';
          section.className = 'panel rw-merit-2026-panel';
          section.setAttribute('aria-label', 'Merit increase 2026');

          const meritFrame = doc.createElement('iframe');
          meritFrame.className = 'rw-merit-2026-frame';
          meritFrame.title = 'Merit increase 2026';
          meritFrame.srcdoc = rekentoolMeritHtml();
          section.appendChild(meritFrame);
          oldPanel.insertAdjacentElement('afterend', section);

          meritFrame.addEventListener('load', () => {
            const childDoc = meritFrame.contentDocument;
            const childWin = meritFrame.contentWindow;
            if (!childDoc || !childWin) return;

            const resize = () => {
              const height = Math.max(
                childDoc.documentElement?.scrollHeight || 0,
                childDoc.body?.scrollHeight || 0,
                1180
              );
              meritFrame.style.height = `${height}px`;
            };
            resize();
            [80, 300, 900].forEach(delay => setTimeout(resize, delay));
            if (childWin.ResizeObserver) {
              const observer = new childWin.ResizeObserver(resize);
              observer.observe(childDoc.documentElement);
            }

            const currentLang = lang();
            try { childWin.postMessage({type:'rw:setLang', lang:currentLang}, '*'); } catch (_e) {}
            try {
              if (typeof childWin.__rwApplyModuleLang === 'function') childWin.__rwApplyModuleLang(currentLang);
            } catch (_e) {}
          });
        } catch (_e) {}
      };

      install();
      if (!innerFrame.__rwMeritReplacementBound) {
        innerFrame.__rwMeritReplacementBound = true;
        innerFrame.addEventListener('load', () => {
          [40, 180, 600].forEach(delay => setTimeout(install, delay));
        });
      }
    } catch (_e) {}
  }

  function applyPremiumModuleTheme(frame){
    try {
      const doc = frame?.contentDocument;
      if (!doc || !doc.documentElement) return;
      doc.documentElement.classList.add('rw-premium-module-root');
      doc.documentElement.classList.add('rw-platform-embedded');
      if (doc.body) doc.body.classList.add('rw-premium-module');
      let dedupeStyle = doc.getElementById('rw-platform-language-dedup');
      if (!dedupeStyle) {
        dedupeStyle = doc.createElement('style');
        dedupeStyle.id = 'rw-platform-language-dedup';
        dedupeStyle.textContent = `
          html.rw-platform-embedded .language-switcher,
          html.rw-platform-embedded .lang-switch,
          html.rw-platform-embedded .language-controls,
          html.rw-platform-embedded .lang-controls,
          html.rw-platform-embedded .language-selector,
          html.rw-platform-embedded .lang-selector,
          html.rw-platform-embedded [data-rw-embedded-lang-control="true"],
          html.rw-platform-embedded [data-rw-embedded-lang-button="true"]{
            display:none!important;
            visibility:hidden!important;
          }`;
        doc.head?.appendChild(dedupeStyle);
      }
      const hideEmbeddedLanguageControls = () => {
        const candidates = Array.from(doc.querySelectorAll('button,a,[role="button"]'));
        const languageButtons = candidates.filter(element =>
          /^(PL|EN|NL)$/.test((element.textContent || '').trim().toUpperCase())
        );

        languageButtons.forEach(button => {
          let group = button.parentElement;
          let matchedGroup = null;
          for (let depth = 0; group && depth < 5; depth += 1, group = group.parentElement) {
            const labels = Array.from(group.querySelectorAll('button,a,[role="button"]'))
              .map(element => (element.textContent || '').trim().toUpperCase())
              .filter(label => /^(PL|EN|NL)$/.test(label));
            if (new Set(labels).size === 3) {
              matchedGroup = group;
              break;
            }
          }
          if (matchedGroup) {
            matchedGroup.setAttribute('data-rw-embedded-lang-control', 'true');
          } else {
            button.setAttribute('data-rw-embedded-lang-button', 'true');
          }
        });

        doc.querySelectorAll('select').forEach(select => {
          const marker = `${select.id || ''} ${select.name || ''} ${select.className || ''} ${select.getAttribute('aria-label') || ''}`.toLowerCase();
          if (/(lang|language|taal|jezyk|język)/.test(marker)) {
            (select.closest('.field,.form-field,.control,.input-group') || select.parentElement || select)
              .setAttribute('data-rw-embedded-lang-control', 'true');
          }
        });
      };
      hideEmbeddedLanguageControls();
      if (!doc.__rwLanguageDedupeObserver && doc.body) {
        doc.__rwLanguageDedupeObserver = new MutationObserver(hideEmbeddedLanguageControls);
        doc.__rwLanguageDedupeObserver.observe(doc.body, { childList:true, subtree:true });
      }
      integrateRekentoolMerit(frame);
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
  let skinFrameRaf = 0;
  function scheduleSkinModuleFrames(){
    if (skinFrameRaf) return;
    skinFrameRaf = window.requestAnimationFrame(() => {
      skinFrameRaf = 0;
      skinModuleFrames();
    });
  }
  function refreshHomeView(){
    document.body.classList.add('rw-v2-ready');
    retireLegacyVisualLayers();
    ensureShell();
    renderHero();
    renderToolbar();
    renderContact();
    enhanceCards();
    patchPinTexts();
    updateModuleBar();
    syncHomeLang();
    hideStageWidgets();
  }
  function init(){
    document.body.classList.add('rw-v2-ready');
    window.__rwPlatformV2RefreshHome = refreshHomeView;
    retireLegacyVisualLayers();
    syncBrand();
    ensureShell();
    bindPremiumPointer();
    updateWallClock();
    setInterval(updateWallClock, 15000);
    enhancePin();
    patchPinGateHooks();
    ensureModuleBar();
    bindEvents();
    hideStageWidgets();
    new MutationObserver(() => window.requestAnimationFrame(hideStageWidgets)).observe(document.body, { childList:true, subtree:true });
    setInterval(hideStageWidgets, 4000);
    skinModuleFrames();
    document.querySelectorAll('iframe').forEach(frame => frame.addEventListener('load', () => {
      applyPremiumModuleTheme(frame);
      scheduleLanguagePush(lang());
    }));
    new MutationObserver(scheduleSkinModuleFrames).observe(document.body, { childList:true, subtree:true });
    setInterval(skinModuleFrames, 5000);
    applyLanguage();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
