/* Contract Budget Calculator: non-invasive total contract hours result.
   Existing dates/week hours are reused; no legacy financial formulas are changed. */
(function () {
  'use strict';
  if (window.__rwContractBudgetHoursInstalled) return;
  window.__rwContractBudgetHoursInstalled = true;

  var FRAME_ID = 'appframe';
  var TILE_ID = 'rwContractHoursTile';
  var DAY_MS = 86400000;
  var activeDocument = null;
  var previousSignature = '';

  var translations = {
    nl: {
      heading: 'Totaal aantal contracturen',
      empty: 'Vul de startdatum, einddatum en uren per week in.',
      invalid: 'Controleer de datums en uren per week.',
      reversed: 'De einddatum ligt vóór de startdatum.',
      day: 'werkdag', days: 'werkdagen',
      note: 'ma–vr; feestdagen niet afgetrokken'
    },
    en: {
      heading: 'Total Contract Hours',
      empty: 'Enter the start date, end date and hours per week.',
      invalid: 'Check the dates and weekly hours.',
      reversed: 'End date must not be before start date.',
      day: 'working day', days: 'working days',
      note: 'Mon–Fri; public holidays not deducted'
    },
    pl: {
      heading: 'Łączna liczba godzin kontraktu',
      empty: 'Podaj datę początku, końca i godziny tygodniowo.',
      invalid: 'Sprawdź daty oraz godziny tygodniowo.',
      reversed: 'Data zakończenia jest wcześniejsza niż rozpoczęcia.',
      day: 'dzień roboczy', days: 'dni roboczych',
      note: 'pon.–pt.; bez odejmowania świąt'
    }
  };

  function readDate(value) {
    var match = String(value || '').trim().match(/^(\d{1,2})[-./](\d{1,2})[-./](\d{4})$/);
    var year, month, day;
    if (match) {
      day = Number(match[1]); month = Number(match[2]); year = Number(match[3]);
    } else {
      match = String(value || '').trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (!match) return null;
      year = Number(match[1]); month = Number(match[2]); day = Number(match[3]);
    }
    if (year < 1900 || year > 2200) return null;
    var time = Date.UTC(year, month - 1, day);
    var date = new Date(time);
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
    return time;
  }

  function countWorkingDays(start, end) {
    var inclusiveDays = Math.round((end - start) / DAY_MS) + 1;
    var completeWeeks = Math.floor(inclusiveDays / 7);
    var weekdays = completeWeeks * 5;
    var startingWeekday = new Date(start).getUTCDay();
    for (var i = 0; i < inclusiveDays % 7; i++) {
      var weekday = (startingWeekday + i) % 7;
      if (weekday !== 0 && weekday !== 6) weekdays++;
    }
    return weekdays;
  }

  function localeFor(lang) {
    return lang === 'pl' ? 'pl-PL' : lang === 'en' ? 'en-GB' : 'nl-NL';
  }

  function showResult(doc) {
    var tile = doc.getElementById(TILE_ID);
    if (!tile) return;
    var weeklyRaw = (doc.getElementById('uren') || {}).value || '';
    var startRaw = (doc.getElementById('start') || {}).value || '';
    var endRaw = (doc.getElementById('eind') || {}).value || '';
    var selector = doc.getElementById('langSelect');
    var lang = String(selector && selector.value || 'nl').toLowerCase();
    if (!translations[lang]) lang = 'nl';
    var signature = [weeklyRaw, startRaw, endRaw, lang].join('|');
    if (activeDocument === doc && previousSignature === signature) return;
    previousSignature = signature;

    var text = translations[lang];
    var title = tile.querySelector('[data-rw-hours-title]');
    var value = tile.querySelector('[data-rw-hours-value]');
    var detail = tile.querySelector('[data-rw-hours-detail]');
    title.textContent = text.heading;
    tile.setAttribute('aria-label', text.heading);

    if (!weeklyRaw.trim() || !startRaw.trim() || !endRaw.trim()) {
      value.textContent = '—';
      detail.textContent = text.empty;
      return;
    }
    var weeklyNumberText = weeklyRaw.trim().replace(/\s/g, '').replace(',', '.');
    var weeklyHours = /^\d+(\.\d+)?$/.test(weeklyNumberText) ? Number(weeklyNumberText) : NaN;
    var start = readDate(startRaw);
    var end = readDate(endRaw);
    if (!start || !end || !Number.isFinite(weeklyHours) || weeklyHours <= 0 || weeklyHours > 168) {
      value.textContent = '—';
      detail.textContent = text.invalid;
      return;
    }
    if (end < start) {
      value.textContent = '—';
      detail.textContent = text.reversed;
      return;
    }

    var workdays = countWorkingDays(start, end);
    var hours = workdays * weeklyHours / 5;
    value.textContent = new Intl.NumberFormat(localeFor(lang), {
      maximumFractionDigits: 2
    }).format(hours);
    detail.textContent = String(workdays) + ' ' + (workdays === 1 ? text.day : text.days) + ' · ' + text.note;
  }

  function initializeInFrame(doc) {
    if (!doc || !doc.body || !doc.querySelector('#resultCard .kpi')) return;
    var weekly = doc.getElementById('uren');
    var start = doc.getElementById('start');
    var end = doc.getElementById('eind');
    var language = doc.getElementById('langSelect');
    if (!weekly || !start || !end || !language) return;

    var kpi = doc.querySelector('#resultCard .kpi');
    var tile = doc.getElementById(TILE_ID);
    if (!tile) {
      tile = doc.createElement('div');
      tile.id = TILE_ID;
      tile.className = 'tile accent';
      tile.setAttribute('role', 'group');
      tile.innerHTML = '<h3 data-rw-hours-title></h3>' +
                       '<div class="big"><span data-rw-hours-value aria-live="polite">—</span></div>' +
                       '<div class="muted" data-rw-hours-detail></div>';
      var weeksTile = kpi.querySelector('.tile');
      if (weeksTile) weeksTile.insertAdjacentElement('afterend', tile);
      else kpi.appendChild(tile);
    }
    if (activeDocument !== doc) {
      activeDocument = doc;
      previousSignature = '';
      [weekly, start, end, language].forEach(function(input) {
        input.addEventListener('input', function() { previousSignature = ''; showResult(doc); });
        input.addEventListener('change', function() { previousSignature = ''; showResult(doc); });
      });
      doc.getElementById('clearFieldsBtn')?.addEventListener('click', function() {
        setTimeout(function() { previousSignature = ''; showResult(doc); }, 30);
      });
      doc.addEventListener('click', function() {
        setTimeout(function() { showResult(doc); }, 50);
      });
    }
    showResult(doc);
  }

  function tick() {
    var frame = document.getElementById(FRAME_ID);
    if (!frame || !frame.classList.contains('show')) return;
    try { initializeInFrame(frame.contentDocument); } catch (err) { /* inaccessible frame */ }
  }

  function init() {
    var frame = document.getElementById(FRAME_ID);
    if (frame) frame.addEventListener('load', function() {
      activeDocument = null;
      previousSignature = '';
      setTimeout(tick, 0);
      setTimeout(tick, 150);
    });
    tick();
    // Calendar selection can update .value without dispatching an input event.
    setInterval(tick, 650);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();