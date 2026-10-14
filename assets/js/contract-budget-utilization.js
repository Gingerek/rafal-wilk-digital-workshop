/* Contract Budget — capped 0–100% visualization with uncapped actual usage.
   This enhances the existing budget module without changing any financial formulas. */
(function () {
  'use strict';
  if (window.__rwBudgetUtilizationLoaded) return;
  window.__rwBudgetUtilizationLoaded = true;

  var frameId = 'appframe';
  var currentDoc = null;
  var lastSignature = '';

  var copy = {
    en: {
      heading: 'Budget utilization',
      actual: 'Actual usage',
      within: 'Within budget',
      full: 'Budget fully allocated',
      over: 'Over budget',
      remaining: 'Remaining',
      excess: 'Amount over budget',
      exceeded: 'Exceeded by',
      pctBudget: 'of available budget',
      empty: 'Enter the available budget and contract details',
      noBudget: 'No available budget',
      percent: 'of budget used'
    },
    nl: {
      heading: 'Budgetbenutting',
      actual: 'Werkelijk gebruikt',
      within: 'Binnen budget',
      full: 'Budget volledig benut',
      over: 'Budget overschreden',
      remaining: 'Resterend',
      excess: 'Budgetoverschrijding',
      exceeded: 'Overschrijding',
      pctBudget: 'van het beschikbare budget',
      empty: 'Vul het beschikbare budget en de contractgegevens in',
      noBudget: 'Geen beschikbaar budget',
      percent: 'van budget benut'
    },
    pl: {
      heading: 'Wykorzystanie budżetu',
      actual: 'Rzeczywiste wykorzystanie',
      within: 'W granicach budżetu',
      full: 'Budżet w pełni wykorzystany',
      over: 'Przekroczony budżet',
      remaining: 'Pozostało',
      excess: 'Przekroczenie kwotowe',
      exceeded: 'Przekroczenie',
      pctBudget: 'dostępnego budżetu',
      empty: 'Wprowadź dostępny budżet i dane kontraktu',
      noBudget: 'Brak dostępnego budżetu',
      percent: 'wykorzystanego budżetu'
    }
  };

  function readNumber(raw) {
    var s = String(raw == null ? '' : raw)
      .replace(/\u2212/g, '-')
      .replace(/[\s\u00a0\u202f]/g, '')
      .replace(/[^\d.,\-]/g, '');
    if (!s || s === '-' || !/\d/.test(s)) return null;
    var comma = s.lastIndexOf(',');
    var period = s.lastIndexOf('.');
    if (comma >= 0 && period >= 0) {
      var decimal = comma > period ? ',' : '.';
      s = s.replace(decimal === ',' ? /\./g : /,/g, '');
      if (decimal === ',') s = s.replace(',', '.');
    } else if (comma >= 0 || period >= 0) {
      var sep = comma >= 0 ? ',' : '.';
      var idx = s.lastIndexOf(sep);
      var count = s.length - idx - 1;
      // One separator with exactly three trailing digits is ordinarily grouping.
      if (count === 3 && s.indexOf(sep) === idx) s = s.replace(sep, '');
      else if (sep === ',') s = s.replace(/,/g, '.');
      if (s.split('.').length > 2) {
        var index = s.lastIndexOf('.');
        s = s.slice(0, index).replace(/\./g, '') + s.slice(index);
      }
    }
    var value = Number(s);
    return Number.isFinite(value) ? value : null;
  }

  function locale(lang) {
    return lang === 'nl' ? 'nl-NL' : lang === 'pl' ? 'pl-PL' : 'en-GB';
  }

  function percent(value, lang) {
    if (!Number.isFinite(value)) return '—';
    var decimals = Math.abs(value - Math.round(value)) < 0.05 ? 0 : (value >= 100 && value < 101 ? 2 : 1);
    return new Intl.NumberFormat(locale(lang), {
      maximumFractionDigits: decimals
    }).format(value) + '%';
  }

  function money(value, lang) {
    return new Intl.NumberFormat(locale(lang), {
      style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2
    }).format(value);
  }

  function install(doc) {
    if (!doc?.documentElement?.classList.contains('rw-budget-pro')) return false;
    var tile = doc.querySelector('#resultCard .rw-tile-usage');
    var legend = tile?.querySelector('.legend');
    if (!tile || !legend || !doc.getElementById('percentText')) return false;

    if (!doc.getElementById('rwBudgetUtilizationStyles')) {
      var style = doc.createElement('style');
      style.id = 'rwBudgetUtilizationStyles';
      style.textContent = [
        'html.rw-budget-pro .rw-tile-usage{background:#f6faff!important;border-color:#dfeaf6!important}',
        'html.rw-budget-pro .rw-tile-usage .legend>div:not(.rw-budget-use-summary){display:none!important}',
        'html.rw-budget-pro .rw-tile-usage .donut svg #percentText{fill:#173653!important;font-size:18px!important;font-weight:900!important}',
        'html.rw-budget-pro .rw-tile-usage.rw-budget-over{background:#fff4f3!important;border-color:#efc1c0!important}',
        'html.rw-budget-pro .rw-tile-usage.rw-budget-over .donut svg #ring{stroke:#d84e4e!important}',
        'html.rw-budget-pro .rw-tile-usage.rw-budget-over .donut svg #percentText{fill:#b52f35!important}',
        'html.rw-budget-pro .rw-budget-use-summary{display:flex!important;flex-direction:column!important;gap:4px!important;align-items:flex-start!important;min-width:0!important}',
        'html.rw-budget-pro .rw-budget-use-heading{font-size:11px!important;font-weight:750!important;color:#64748b!important}',
        'html.rw-budget-pro .rw-budget-use-actual{font-size:clamp(19px,1.8vw,26px)!important;font-weight:900!important;line-height:1.08!important;letter-spacing:-.5px!important;color:#122b48!important;font-variant-numeric:tabular-nums!important}',
        'html.rw-budget-pro .rw-budget-use-state{font-size:11px!important;font-weight:850!important;color:#167651!important}',
        'html.rw-budget-pro .rw-budget-use-detail{font-size:10px!important;line-height:1.3!important;color:#67798d!important;overflow-wrap:anywhere!important}',
        'html.rw-budget-pro .rw-budget-over .rw-budget-use-actual,html.rw-budget-pro .rw-budget-over .rw-budget-use-state{color:#b8343c!important}',
        'html.rw-budget-pro .rw-tile-usage .donut-wrap{gap:12px!important}',
        '@media(min-width:1100px) and (max-height:735px){',
        'html.rw-budget-pro .rw-budget-use-summary{gap:2px!important}',
        'html.rw-budget-pro .rw-budget-use-actual{font-size:20px!important}',
        'html.rw-budget-pro .rw-budget-use-heading,html.rw-budget-pro .rw-budget-use-state{font-size:10px!important}',
        'html.rw-budget-pro .rw-budget-use-detail{font-size:9px!important;line-height:1.25!important}',
        '}'
      ].join('\n');
      doc.head.appendChild(style);
    }

    if (!doc.getElementById('rwBudgetUseSummary')) {
      var summary = doc.createElement('div');
      summary.id = 'rwBudgetUseSummary';
      summary.className = 'rw-budget-use-summary';
      summary.setAttribute('role', 'status');
      summary.setAttribute('aria-live', 'polite');
      summary.innerHTML = '<span class="rw-budget-use-heading" id="rwBudgetUseHeading"></span>' +
        '<strong class="rw-budget-use-actual" id="rwBudgetUseActual"></strong>' +
        '<span class="rw-budget-use-state" id="rwBudgetUseState"></span>' +
        '<span class="rw-budget-use-detail" id="rwBudgetUseDetail"></span>';
      legend.appendChild(summary);
    }
    if (currentDoc !== doc) {
      currentDoc = doc;
      lastSignature = '';
      var observer = new MutationObserver(function() { render(doc); });
      ['planned','utilValue'].forEach(function(id) {
        var node=doc.getElementById(id);
        if(node)observer.observe(node,{childList:true,characterData:true,subtree:true});
      });
      doc.addEventListener('input', function(){setTimeout(function(){render(doc)},30)},true);
      doc.addEventListener('change', function(){setTimeout(function(){render(doc)},30)},true);
    }
    return true;
  }

  function render(doc) {
    var tile = doc.querySelector('#resultCard .rw-tile-usage');
    if (!tile) return;
    var lang = doc.getElementById('langSelect')?.value || 'en';
    if (!copy[lang]) lang = 'en';
    var t = copy[lang];
    var budgetInput = doc.getElementById('budget')?.value || '';
    var plannedText = doc.getElementById('planned')?.textContent || '';
    var budget = readNumber(budgetInput);
    var planned = readNumber(plannedText);
    var sig=[budgetInput,plannedText,lang].join('|');
    if(sig===lastSignature) return;
    lastSignature=sig;

    var used = 0, cap=0, over=false, actual='—', state='', detail='', invalid = false;
    if (budget === null || planned === null || budget < 0 || planned < 0) {
      invalid=true;
      state=t.empty;
    } else if (budget === 0 && planned > 0) {
      over=true;
      cap=100;
      actual='—';
      state=t.noBudget;
      detail=t.excess+': '+money(planned,lang);
    } else if (budget === 0) {
      invalid=true;
      state=t.noBudget;
    } else {
      used = planned / budget * 100;
      cap = Math.max(0,Math.min(100,used));
      over = used > 100 + 1e-8;
      actual = percent(used,lang);
      if (over) {
        state=t.over;
        detail=t.excess+': '+money(planned-budget,lang)+' · '+t.exceeded+': '+percent(used-100,lang)+' '+t.pctBudget;
      } else if (used >= 100 - 1e-8) {
        state=t.full;
        detail=t.remaining+': '+money(0,lang);
      } else {
        state=t.within;
        detail=t.remaining+': '+money(budget-planned,lang);
      }
    }

    var heading=doc.getElementById('rwBudgetUseHeading');
    var actualNode=doc.getElementById('rwBudgetUseActual');
    var stateNode=doc.getElementById('rwBudgetUseState');
    var detailNode=doc.getElementById('rwBudgetUseDetail');
    var center=doc.getElementById('percentText');
    var ring=doc.getElementById('ring');
    if(!heading||!actualNode||!stateNode||!detailNode||!center||!ring)return;

    heading.textContent=t.actual;
    actualNode.textContent=actual;
    stateNode.textContent=state;
    detailNode.textContent=detail;
    tile.classList.toggle('rw-budget-over',over);
    tile.classList.toggle('rw-budget-no-input',invalid);

    // Only the graphical fraction is capped; financial values remain unchanged.
    center.textContent=invalid?'—':percent(Math.min(100,cap),lang);
    ring.setAttribute('stroke-dashoffset',String((314*(1-cap/100)).toFixed(1)));
  }

  function tick(){
    var frame=document.getElementById(frameId);
    if(!frame?.classList.contains('show'))return;
    try{
      var doc=frame.contentDocument;
      if(install(doc)){
        // Legacy calculation can also repaint #percentText without changing inputs.
        // Reapply the capped 0–100% display after it repaints.
        lastSignature='';
        render(doc);
      }
    }catch(e){if(console?.warn)console.warn('Budget visualization unavailable:',e)}
  }

  function init(){
    var f=document.getElementById(frameId);
    if(f)f.addEventListener('load',function(){currentDoc=null;lastSignature='';setTimeout(tick,100)});
    tick();setInterval(tick,350);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();