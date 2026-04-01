/* ══════════════════════════════════════════════════════════
   ANTIDOTE interface messagerie avec Naomi
══════════════════════════════════════════════════════════ */

/* ── State ── */
let scores         = {};
let playedPhases   = [];
let playedActions  = [];
let phaseOrder     = [];
let eventOrder     = [];
let eventCount     = 0;
let _unlockedShown     = [];
let pendingAction      = null;
let pendingOption      = null;
let pendingCounterData = null;
let pendingInputText   = null;   // texte complet destiné au message joueur
let currentStep        = 'pick';
let typingRowEl        = null;
let pushTimer          = null;
let counterTimer       = null;

// Référence d'affichage des barres : valeur initiale × 2 = 50 % au départ
const BAR_REF = { public: 80, political: 120, resources: 200 };
const PHASE_ICONS = ['🤝','🏛️','🔬','📺','🌾','📣','📱','✊','📋','⚖️'];

/* ── Sons ── */
let _soundEnabled = true;

function playSound(filename) {
  if (!_soundEnabled) return;
  try {
    const audio = new Audio('sfx/' + filename);
    audio.volume = 0.5;
    audio.play().catch(function() {});
  } catch (e) {}
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function isLocked(i) {
  const lu = GAME_DATA.phases[i].lockedUntil;
  return !!(lu && playedPhases.length < lu);
}

function getTime() {
  const d = new Date();
  return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
}

function bindBtn(row, selector, handler) {
  const btn = row.querySelector(selector);
  if (!btn) return;
  btn.addEventListener('click', function once() {
    btn.removeEventListener('click', once);
    btn.disabled = true;
    btn.style.opacity = '.5';
    handler(btn);
  });
}

/* ════════════════════════════════════════════
   INIT
════════════════════════════════════════════ */
function startGame() {
  _soundEnabled = document.getElementById('opt-sound')
    ? document.getElementById('opt-sound').checked
    : true;

  const wantFullscreen = document.getElementById('opt-fullscreen')
    && document.getElementById('opt-fullscreen').checked;
  if (wantFullscreen && document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(function() {});
  }

  scores             = { ...GAME_DATA.initialScores };
  playedPhases       = [];
  playedActions      = [];
  phaseOrder         = shuffle(GAME_DATA.phases.map((_, i) => i));
  eventOrder         = shuffle(GAME_DATA.events.map((_, i) => i));
  eventCount         = 0;
  _unlockedShown     = [];
  _pendingSend       = null;
  _pendingUnlocks    = [];
  pendingAction      = null;
  pendingOption      = null;
  pendingCounterData = null;
  pendingInputText   = null;
  currentStep        = 'pick';
  typingRowEl        = null;
  if (counterTimer) { clearTimeout(counterTimer); counterTimer = null; }
  if (pushTimer)    { clearTimeout(pushTimer); pushTimer = null; }

  document.getElementById('chat-messages').innerHTML = '';
  _lastDateSep = null;
  addDateSeparator("Aujourd'hui");
  closeStrategyPanel();
  closeActionsPanel();
  updateScoreboard();
  updateProgress();
  showScreen('screen-game');
  showDormantInput();
  showTyping();

  setTimeout(function() {
    hideTyping();
    addColleagueMessage(
      `Bienvenue dans l'équipe\u00a0🙂<br>Je suis <strong>Naomi</strong>, la directrice de l'association Antidote. Ravie de t'accueillir, même si, tu vas voir, le timing est… particulier.`
    );
    showMerciInput(function() {
      showTyping();
      setTimeout(function() {
        hideTyping();
        addColleagueMessage('Es-tu prêt·e\u00a0?');
        showMerciInput(function() { showExplanations(); }, [
          { label: 'Voir les explications', text: 'Oui', cb: function() { showExplanations(); } },
          { label: 'Passer les explications', text: 'On y va\u00a0!', cb: function() { askAction(); } },
        ]);
      }, 800);
    }, [{ label: 'Merci\u00a0!', text: 'Merci\u00a0!' }]);
  }, 500);
}

function restartGame() { startGame(); }

/* ════════════════════════════════════════════
   SCREENS
════════════════════════════════════════════ */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  setTimeout(() => scrollToTop(), 60);
}

/* ════════════════════════════════════════════
   SCOREBOARD
════════════════════════════════════════════ */
function updateScoreboard(animateKeys) {
  ['public','political','resources'].forEach(key => {
    const val = scores[key];
    const ref = BAR_REF[key];
    const elV  = document.getElementById('score-' + key);
    const elB  = document.getElementById('bar-'   + key);
    const pill = document.getElementById('pill-'  + key);

    elV.textContent = val;
    const pct = Math.max(0, Math.min(100, (val / ref) * 100));
    elB.style.width = pct + '%';

    elB.classList.remove('danger','warning');
    pill.classList.remove('danger','warning');
    if (val <= ref * 0.10)      { elB.classList.add('danger');  pill.classList.add('danger'); }
    else if (val <= ref * 0.20) { elB.classList.add('warning'); pill.classList.add('warning'); }

    if (animateKeys && animateKeys.includes(key)) {
      elV.style.color = '#f5c842';
      setTimeout(() => { elV.style.color = ''; }, 700);
    }
  });
}

/* ════════════════════════════════════════════
   PROGRESS (barre dans le header)
════════════════════════════════════════════ */
function updateProgress() {
  const total  = GAME_DATA.phases.length;
  const played = playedPhases.length;
  const pct    = (played / total) * 100;

  const bar   = document.getElementById('chp-bar');
  const num   = document.getElementById('chp-tour-num');
  const name  = document.getElementById('chp-tour-name');
  const label = document.getElementById('chp-label');

  if (bar) bar.style.width = pct + '%';

  const currentPhaseIdx = Math.min(played, total - 1);
  const phase = GAME_DATA.phases[currentPhaseIdx];

  if (label) label.dataset.phaseIdx = currentPhaseIdx;
  if (num)   num.textContent  = 'Tour\u00a0' + (currentPhaseIdx + 1) + '\u00a0/\u00a0' + total;
  if (name)  name.textContent = phase && phase.tourLabel ? phase.tourLabel : '—';
}

/* ════════════════════════════════════════════
   CALENDRIER
════════════════════════════════════════════ */
const CAL_MONTH_NAMES = ['', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const CAL_DAY_NAMES   = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

let _calMonth = 4;
let _calYear  = 2025;
let _calSelectedPhaseIdx = 0;
let _calOnClose   = null;
let _pendingSend    = null; // callback déclenché au clic Envoyer (mode merci)
let _pendingUnlocks = [];  // phases débloquées à annoncer au début du prochain tour

function openCalendar() {
  const label = document.getElementById('chp-label');
  const phaseIdx = parseInt(label.dataset.phaseIdx || '0', 10);
  const phase = GAME_DATA.phases[phaseIdx];
  _calSelectedPhaseIdx = phaseIdx;
  _calMonth = phase && phase.tourDate ? phase.tourDate.month : 4;
  _calYear  = phase && phase.tourDate ? phase.tourDate.year  : 2025;
  renderCalendar();
  document.getElementById('cal-overlay').classList.add('open');
}

function closeCalendar() {
  document.getElementById('cal-overlay').classList.remove('open');
  if (_calOnClose) {
    const cb = _calOnClose;
    _calOnClose = null;
    setTimeout(cb, 300);
  }
}

function onCalOverlayClick(e) {
  if (e.target === document.getElementById('cal-overlay')) closeCalendar();
}

function calNav(dir) {
  _calMonth += dir;
  if (_calMonth > 12) { _calMonth = 1;  _calYear++; }
  if (_calMonth < 1)  { _calMonth = 12; _calYear--; }
  renderCalendar();
}

function calSelectDay(phaseIdx) {
  _calSelectedPhaseIdx = phaseIdx;
  renderCalendar();
}

function renderCalendar() {
  const phases = GAME_DATA.phases;
  const firstDay    = new Date(_calYear, _calMonth - 1, 1);
  const daysInMonth = new Date(_calYear, _calMonth, 0).getDate();
  let startDow = firstDay.getDay();
  startDow = (startDow === 0) ? 6 : startDow - 1; // lundi = 0

  // Index des tours dans ce mois
  const toursByDay = {};
  phases.forEach(function(p, i) {
    if (p.tourDate && p.tourDate.month === _calMonth && p.tourDate.year === _calYear) {
      toursByDay[p.tourDate.day] = i;
    }
  });

  // En-tête du mois + navigation
  let html = '<div class="cal-month-header">'
    + '<button class="cal-nav-btn" onclick="calNav(-1)">‹</button>'
    + '<span class="cal-month-title">' + CAL_MONTH_NAMES[_calMonth] + ' ' + _calYear + '</span>'
    + '<button class="cal-nav-btn" onclick="calNav(1)">›</button>'
    + '</div>';

  // Grille jours
  html += '<div class="cal-grid">';
  CAL_DAY_NAMES.forEach(function(d) {
    html += '<div class="cal-day-head">' + d + '</div>';
  });

  for (let i = 0; i < startDow; i++) {
    html += '<div class="cal-cell"></div>';
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const phaseIdx = toursByDay[d];
    const hasTour  = phaseIdx !== undefined;
    const isSel    = hasTour && phaseIdx === _calSelectedPhaseIdx;
    let cls = 'cal-cell';
    if (hasTour) cls += ' has-tour';
    if (isSel)   cls += ' selected';
    const click = hasTour ? ' onclick="calSelectDay(' + phaseIdx + ')"' : '';
    html += '<div class="' + cls + '"' + click + '>'
      + d
      + (hasTour ? '<span class="cal-dot"></span>' : '')
      + '</div>';
  }
  html += '</div>'; // cal-grid

  // Description du tour sélectionné
  const sel = phases[_calSelectedPhaseIdx];
  if (sel && sel.tourDate) {
    const dayStr = sel.tourDate.day + '\u00a0' + CAL_MONTH_NAMES[sel.tourDate.month].toLowerCase();
    html += '<div class="cal-desc-panel">'
      + '<div class="cal-desc-label">Tour\u00a0' + sel.id + '\u00a0\u2014\u00a0' + sel.tourLabel + '</div>'
      + '<div class="cal-desc-date">' + dayStr + '</div>'
      + '<div class="cal-desc-text">' + sel.tourDescription + '</div>'
      + '</div>';
  } else {
    html += '<div class="cal-desc-panel cal-desc-empty">Aucun tour ce mois-ci.</div>';
  }

  document.getElementById('cal-inner').innerHTML = html;
}

/* ════════════════════════════════════════════
   EFFETS
════════════════════════════════════════════ */
function getTourBand() {
  const t = playedPhases.length;
  if (t <= 3) return 0; // tours 1-4
  if (t <= 6) return 1; // tours 5-7
  return 2;             // tours 8-10
}

function applyEffects(effects) {
  scores.public    = Math.max(0, scores.public    + (effects.public    || 0));
  scores.political = Math.max(0, scores.political + (effects.political || 0));
  scores.resources = Math.max(0, scores.resources + (effects.resources || 0));
  scores.score     = (scores.score || 0) + (effects.score || 0);
}

function changedKeys(effects) {
  return Object.keys(effects).filter(k => effects[k] !== 0 && k !== 'score');
}

/* ── Animation flottante +/- sur les pills de score ── */
function showScoreDelta(effects) {
  Object.entries(effects).forEach(function(entry) {
    var key   = entry[0];
    var delta = entry[1];
    if (!delta) return;
    var pill = document.getElementById('pill-' + key);
    if (!pill) return;
    var rect = pill.getBoundingClientRect();
    var el   = document.createElement('div');
    el.className  = 'score-delta-float ' + (delta > 0 ? 'pos' : 'neg');
    el.textContent = (delta > 0 ? '+' : '') + delta;
    el.style.left = (rect.left + rect.width / 2) + 'px';
    el.style.top  = rect.bottom + 'px';
    document.body.appendChild(el);
    setTimeout(function() { if (el.parentNode) el.remove(); }, 2200);
  });
}

function buildDeltaChips(effects) {
  const labels = { public: '👥 Public', political: '🏛️ Politique', resources: '💶 Ressources' };
  const chips = Object.entries(effects)
    .filter(([k, v]) => v !== 0 && labels[k])
    .map(([k, v]) => '<span class="delta-chip ' + (v > 0 ? 'pos' : 'neg') + '">' + labels[k] + ' ' + (v > 0 ? '+' : '') + v + '</span>');
  return chips.length ? chips.join('') : '<span class="delta-chip zero">Aucun effet</span>';
}

function checkZero() {
  if (scores.public    <= 0) return 'public';
  if (scores.political <= 0) return 'political';
  if (scores.resources <= 0) return 'resources';
  return null;
}

/* ════════════════════════════════════════════
   CHAT HELPERS
════════════════════════════════════════════ */
function getChatEl() { return document.getElementById('chat-messages'); }

function setNaomiOffline(offline) {
  const dot = document.querySelector('.chat-online-dot');
  if (dot) dot.classList.toggle('offline', offline);
  if (!offline) {
    getChatEl().querySelectorAll('.chat-date-sep').forEach(function(sep) {
      if (sep.textContent === 'Naomi est hors ligne') sep.remove();
    });
  }
}

const MONTH_NAMES = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];

function formatTourDate(tourDate) {
  return tourDate.day + '\u00a0' + MONTH_NAMES[tourDate.month - 1] + '\u00a0' + tourDate.year;
}

function addDaysToTourDate(tourDate, n) {
  const d = new Date(tourDate.year, tourDate.month - 1, tourDate.day + n);
  return { day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() };
}

let _lastDateSep = null;

function addDateSeparator(label) {
  const chat = getChatEl();
  const sep  = document.createElement('div');
  sep.className   = 'chat-date-sep';
  sep.textContent = label;
  chat.appendChild(sep);
  _lastDateSep = sep;
}

function scrollToBottom() {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  });
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function addColleagueMessage(htmlContent) {
  playSound('400697__daphne_in_wonderland__messenger-notification-sound-imitation.mp3');
  const chat = getChatEl();
  const row  = document.createElement('div');
  row.className = 'msg-row naomi';
  row.innerHTML =
    '<div class="msg-avatar">👩🏽‍💼</div>' +
    '<div class="msg-bubble">' +
      '<div class="msg-sender">Naomi</div>' +
      '<div class="msg-body">' + htmlContent + '</div>' +
      '<span class="msg-time">' + getTime() + '</span>' +
    '</div>';
  chat.appendChild(row);
  scrollToBottom();
  return row;
}

function addPlayerMessage(text) {
  const chat = getChatEl();
  const row  = document.createElement('div');
  row.className = 'msg-row player';
  row.innerHTML =
    '<div class="msg-bubble">' +
      '<div class="msg-body">' + text + '</div>' +
      '<span class="msg-time">' + getTime() + ' ✓</span>' +
    '</div>';
  chat.appendChild(row);
  scrollToBottom();
  return row;
}

function showTyping() {
  if (typingRowEl) return typingRowEl;
  const chat = getChatEl();
  const row  = document.createElement('div');
  row.className = 'msg-row naomi typing-row';
  row.innerHTML =
    '<div class="msg-avatar">👩🏽‍💼</div>' +
    '<div class="typing-bubble">' +
      '<div class="typing-dot"></div>' +
      '<div class="typing-dot"></div>' +
      '<div class="typing-dot"></div>' +
    '</div>';
  chat.appendChild(row);
  typingRowEl = row;
  scrollToBottom();
  return row;
}

function hideTyping() {
  if (typingRowEl) { typingRowEl.remove(); typingRowEl = null; }
}

/* ── Figer toutes les option-cards (supprimer leurs event listeners) ── */
function freezeOptionCards() {
  getChatEl().querySelectorAll('.option-card:not(.done)').forEach(function(c) {
    c.classList.add('done');
    var clone = c.cloneNode(true);
    c.parentNode.replaceChild(clone, c);
  });
  // Figer aussi le bouton "Changer d'action"
  getChatEl().querySelectorAll('.change-action-btn:not(.done)').forEach(function(btn) {
    btn.classList.add('done');
  });
}

/* ── Typewriter dans la zone de saisie ── */
function typewriterInput(text, cb) {
  const inputEl = document.getElementById('chat-input-text');
  showInputArea();
  inputEl.innerHTML = '';
  enableSendBtn();

  let i = 0;
  const SPEED = 14;

  (function type() {
    if (i < text.length) {
      inputEl.textContent += text[i++];
      setTimeout(type, SPEED);
    } else {
      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      inputEl.appendChild(cursor);
      scrollToBottom();
      if (cb) cb();
    }
  })();

  scrollToBottom();
}

/* ── Mode dormant : barre toujours visible mais inactive ── */
function showDormantInput() {
  const area = document.getElementById('chat-input-area');
  area.style.display = 'flex';
  area.classList.add('dormant');
  document.getElementById('chat-actions-btn').style.display = 'none';
  const inputEl = document.getElementById('chat-input-text');
  inputEl.style.display = 'block';
  inputEl.innerHTML     = '';
  const sendBtn = document.getElementById('chat-send-btn');
  sendBtn.style.display = 'flex';
  sendBtn.disabled      = true;
  scrollToBottom();
}

/* ── Mode picker : bouton Actions + champ + envoyer (désactivés) ── */
function showPickerBtn() {
  const area    = document.getElementById('chat-input-area');
  const inputEl = document.getElementById('chat-input-text');
  const sendBtn = document.getElementById('chat-send-btn');
  const actBtn  = document.getElementById('chat-actions-btn');
  area.style.display    = 'flex';
  area.classList.remove('dormant');
  actBtn.style.display  = 'flex';
  actBtn.classList.remove('pulse');
  void actBtn.offsetWidth; // force reflow pour relancer l'animation
  actBtn.classList.add('pulse');
  actBtn.addEventListener('mouseenter', function stopPulse() {
    actBtn.classList.remove('pulse');
    actBtn.removeEventListener('mouseenter', stopPulse);
  }, { once: true });
  inputEl.style.display = 'block';
  inputEl.innerHTML     = '<span style="color:var(--text-muted);opacity:.5;">Message…</span>';
  sendBtn.style.display = 'flex';
  sendBtn.disabled      = true;
  scrollToBottom();
}

/* ── Mode saisie : bulle texte + bouton Envoyer ── */
function showInputArea() {
  const area = document.getElementById('chat-input-area');
  area.style.display = 'flex';
  area.classList.remove('dormant');
  closeActionsPanel();
  document.getElementById('chat-actions-btn').style.display = 'none';
  document.getElementById('chat-input-text').style.display  = 'block';
  document.getElementById('chat-send-btn').style.display    = 'flex';
  scrollToBottom();
}

function enableSendBtn() {
  const btn = document.getElementById('chat-send-btn');
  btn.disabled = false;
  btn.classList.remove('pulse');
  void btn.offsetWidth;
  btn.classList.add('pulse');
  btn.addEventListener('mouseenter', function stop() {
    btn.classList.remove('pulse');
    btn.removeEventListener('mouseenter', stop);
  }, { once: true });
}

function hideInputArea() {
  closeStrategyPanel();
  closeActionsPanel();
  document.getElementById('quick-replies').style.display   = 'none';
  document.getElementById('chat-input-area').style.display = 'none';
  document.getElementById('chat-input-area').classList.remove('dormant');
  document.getElementById('chat-input-text').innerHTML     = '';
  document.getElementById('chat-send-btn').disabled        = true;
  document.getElementById('chat-actions-btn').style.display = 'none';
}

/* ════════════════════════════════════════════
   PANEL GRILLE D'ACTIONS
════════════════════════════════════════════ */
function openActionsPanel() {
  const grid = document.getElementById('ao-grid');
  grid.innerHTML = '';

  const unplayed  = phaseOrder.filter(function(i) { return !playedPhases.includes(i) && !isLocked(i); });
  const lockedArr = GAME_DATA.phases
    .map(function(_, i) { return i; })
    .filter(function(i) { return !playedPhases.includes(i) && isLocked(i); })
    .sort(function(a, b) { return (GAME_DATA.phases[a].lockedUntil || 99) - (GAME_DATA.phases[b].lockedUntil || 99); });
  const displayOrder = playedPhases.concat(unplayed).concat(lockedArr);

  displayOrder.forEach(function(i) {
    const phase    = GAME_DATA.phases[i];
    const isPlayed = playedPhases.includes(i);
    const locked   = !isPlayed && isLocked(i);
    const icon     = PHASE_ICONS[i] || '🌿';

    const card = document.createElement('button');
    card.className = 'ao-card' + (isPlayed ? ' played' : '') + (locked ? ' locked' : '');
    card.disabled  = isPlayed || locked;

    let badge = '';
    if (isPlayed)    badge = '<span class="ao-card-played-badge">✓ Tour ' + (playedPhases.indexOf(i) + 1) + '</span>';
    else if (locked) badge = '<span class="ao-card-locked-badge">🔒</span>';

    card.innerHTML = badge +
      '<div class="ao-card-icon-wrap">' + icon + '</div>' +
      '<div class="ao-card-title">' + phase.title + '</div>';

    if (!isPlayed && !locked) {
      (function(phaseIndex) {
        card.addEventListener('click', function() { selectPhaseFromOverlay(phaseIndex); });
      })(i);
    }
    grid.appendChild(card);
  });

  document.getElementById('actions-panel').classList.add('open');
  document.getElementById('chat-actions-btn').classList.add('active');
}

function closeActionsPanel() {
  document.getElementById('actions-panel').classList.remove('open');
  const btn = document.getElementById('chat-actions-btn');
  if (btn) btn.classList.remove('active');
}

function toggleActionsPanel() {
  const panel = document.getElementById('actions-panel');
  if (panel.classList.contains('open')) {
    closeStrategyPanel();
    closeActionsPanel();
  } else {
    openActionsPanel();
  }
}

function selectPhaseFromOverlay(phaseIndex) {
  pendingAction = { phaseIndex: phaseIndex };
  pendingOption = null;

  // Mode panel (tous sauf tours 1, 4, 7 ; le tour 10 va toujours au panel)
  if (playedPhases.length % 3 !== 0 || playedPhases.length === 9) {
    openStrategyPanel(phaseIndex);
    return;
  }

  // Mode chat (tours 1, 4, 7) : demander à Naomi
  closeActionsPanel();
  currentStep = 'option';
  typewriterInput('Que me recommandes-tu comme stratégies pour\u00a0: ' + GAME_DATA.phases[phaseIndex].title + '\u00a0?', null);
}

/* ════════════════════════════════════════════
   PANEL STRATÉGIES
════════════════════════════════════════════ */
function openStrategyPanel(phaseIndex) {
  const phase   = GAME_DATA.phases[phaseIndex];
  const panel   = document.getElementById('strategy-panel');
  const list    = document.getElementById('sp-list');
  const title   = document.getElementById('sp-title');

  title.textContent = 'Stratégies disponibles pour\u00a0: ' + phase.title;
  list.innerHTML    = '';

  const actionOrder = shuffle(phase.actions.map(function(_, i) { return i; }));
  pendingAction._actionOrder = actionOrder;
  const band = getTourBand();

  actionOrder.forEach(function(origIdx, visIdx) {
    const a = phase.actions[origIdx];
    const fx = a.effectsByTour ? a.effectsByTour[band] : (a.effects || {});
    const resCost = fx.resources || 0;
    const resChip = resCost !== 0
      ? '<div class="option-res-chip ' + (resCost < 0 ? 'neg' : 'pos') + '">' +
          '💶\u00a0Ressources\u00a0' + (resCost > 0 ? '+' : '') + resCost +
        '</div>'
      : '';

    const card = document.createElement('div');
    card.className = 'option-card';
    card.dataset.orig = origIdx;
    card.innerHTML =
      '<div class="option-label">' +
        '<span class="option-num">' + (visIdx + 1) + '</span>' +
        a.label +
      '</div>' +
      '<div class="option-desc">' + a.description + '</div>' +
      resChip;

    card.addEventListener('click', function() { selectOptionFromPanel(card, origIdx, phaseIndex); });
    list.appendChild(card);
  });

  panel.classList.add('open');

  // Préparer la barre : champ vide désactivé + Send désactivé
  const area    = document.getElementById('chat-input-area');
  const inputEl = document.getElementById('chat-input-text');
  const sendBtn = document.getElementById('chat-send-btn');
  area.style.display    = 'flex';
  area.classList.remove('dormant');
  document.getElementById('chat-actions-btn').style.display = 'flex';
  inputEl.style.display = 'block';
  inputEl.innerHTML     = '<span style="color:var(--text-muted);opacity:.5;">Choisir une stratégie…</span>';
  sendBtn.style.display = 'flex';
  sendBtn.disabled      = true;
  currentStep = 'action';
  scrollToBottom();
}

function closeStrategyPanel() {
  document.getElementById('strategy-panel').classList.remove('open');
  document.getElementById('sp-list').innerHTML = '';
}

function selectOptionFromPanel(cardEl, origIdx, phaseIndex) {
  // Désélectionner les autres
  document.querySelectorAll('#sp-list .option-card').forEach(function(c) { c.classList.remove('selected'); });
  cardEl.classList.add('selected');

  pendingOption = origIdx;
  const label = GAME_DATA.phases[phaseIndex].actions[origIdx].label;
  const prefixes = ['Je propose l\u2019option\u00a0: ', 'Je sugg\u00e8re l\u2019option\u00a0: '];
  pendingInputText = prefixes[Math.floor(Math.random() * prefixes.length)] + label;

  // Afficher dans le champ
  const inputEl = document.getElementById('chat-input-text');
  inputEl.textContent     = pendingInputText;
  inputEl.contentEditable = 'false';
  enableSendBtn();
  scrollToBottom();
}

/* ════════════════════════════════════════════
   BOUTON "ENVOYER À NAOMI"
════════════════════════════════════════════ */
function sendMessage() {
  if (currentStep === 'merci') {
    sendMerci();
  } else if (currentStep === 'option') {
    sendPhaseChoice();
  } else if (currentStep === 'action') {
    sendActionChoice();
  }
}

function sendMerci() {
  const inputEl = document.getElementById('chat-input-text');
  const text = (inputEl.textContent || '').trim() || 'Merci Naomi\u00a0!';
  document.getElementById('quick-replies').style.display = 'none';
  currentStep = 'waiting';
  showDormantInput();
  playSound('760370__froey__message-sent.mp3');
  addPlayerMessage(text);
  scrollToBottom();
  if (_pendingSend) {
    const cb = _pendingSend;
    _pendingSend = null;
    cb();
  }
}

function sendPhaseChoice() {
  const phaseIndex = pendingAction.phaseIndex;
  showDormantInput();
  playSound('760370__froey__message-sent.mp3');
  addPlayerMessage('Que me recommandes-tu comme stratégies pour\u00a0' + PHASE_ICONS[phaseIndex] + ' ' + GAME_DATA.phases[phaseIndex].title + '\u00a0?');

  setTimeout(function() {
    showTyping();
    setTimeout(function() { hideTyping(); showOptions(phaseIndex); }, 1400);
  }, 300);
}

function showOptions(phaseIndex) {
  const phase       = GAME_DATA.phases[phaseIndex];
  const actionOrder = shuffle(phase.actions.map(function(_, i) { return i; }));
  pendingAction._actionOrder = actionOrder;
  const band = getTourBand();

  let optionsHTML = '';
  actionOrder.forEach(function(origIdx, visIdx) {
    const a = phase.actions[origIdx];
    const fx = a.effectsByTour ? a.effectsByTour[band] : (a.effects || {});
    const resCost = fx.resources || 0;
    const resChip = resCost !== 0
      ? '<div class="option-res-chip' + (resCost < 0 ? ' neg' : ' pos') + '">' +
          '💶\u00a0Ressources\u00a0' + (resCost > 0 ? '+' : '') + resCost +
        '</div>'
      : '';
    optionsHTML +=
      '<div class="option-card" data-orig="' + origIdx + '">' +
        '<div class="option-label">' +
          '<span class="option-num">' + (visIdx + 1) + '</span>' +
          a.label +
        '</div>' +
        '<div class="option-desc">' + a.description + '</div>' +
        resChip +
      '</div>';
  });

  const row = addColleagueMessage(
    'Voici les stratégies disponibles pour <strong>' + phase.title + '</strong>.' +
    ' Dis moi quel est ton choix.' +
    '<div class="options-list">' + optionsHTML + '</div>' +
    '<button class="change-action-btn" id="change-action-btn">🔄 Changer d\'action</button>'
  );

  row.querySelectorAll('.option-card').forEach(function(card) {
    card.addEventListener('click', function() {
      if (!card.classList.contains('done') && currentStep === 'action') {
        selectOption(card);
      }
    });
  });

  var changeBtn = row.querySelector('#change-action-btn');
  if (changeBtn) {
    changeBtn.addEventListener('click', function() {
      if (changeBtn.classList.contains('done')) return;
      changeBtn.classList.add('done');
      // Figer les option-cards de ce message
      row.querySelectorAll('.option-card').forEach(function(c) {
        c.classList.add('done');
        var clone = c.cloneNode(true);
        c.parentNode.replaceChild(clone, c);
      });
      hideInputArea();
      pendingAction = null;
      pendingOption = null;
      pendingInputText = null;
      currentStep = 'pick';
      openActionsPanel();
    });
  }

  currentStep   = 'action';
  pendingOption = null;
  scrollToBottom();
}

function selectOption(cardEl) {
  const list = cardEl.closest('.options-list');
  if (list) list.querySelectorAll('.option-card').forEach(function(c) { c.classList.remove('selected'); });
  cardEl.classList.add('selected');
  pendingOption = parseInt(cardEl.dataset.orig, 10);

  const phaseIndex = pendingAction.phaseIndex;
  const label = GAME_DATA.phases[phaseIndex].actions[pendingOption].label;

  // Préfixe aléatoire
  const prefixes = ['Je propose l\u2019option\u00a0: ', 'Je sugg\u00e8re l\u2019option\u00a0: '];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  pendingInputText = prefix + label;

  typewriterInput(pendingInputText, null);
}

function sendActionChoice() {
  if (pendingOption === null) return;

  const phaseIndex = pendingAction.phaseIndex;
  const phase  = GAME_DATA.phases[phaseIndex];
  const action = phase.actions[pendingOption];

  // Utiliser le texte complet stocké (même si le typewriter n'est pas terminé)
  const inputText = (pendingInputText && pendingInputText.trim()) ? pendingInputText : action.label;
  pendingInputText = null;

  // Capturer le band AVANT la mise à jour de playedPhases
  const band = getTourBand();
  const effects        = action.effectsByTour        ? action.effectsByTour[band]        : (action.effects        || {});
  const counterEffects = action.counterEffectsByTour ? action.counterEffectsByTour[band] : (action.counterEffects || {});

  closeStrategyPanel();
  closeActionsPanel();
  freezeOptionCards();
  showDormantInput();
  playSound('760370__froey__message-sent.mp3');
  addPlayerMessage(inputText);

  playedActions.push({ phase: phase.title, action: action.label });
  playedPhases.push(phaseIndex);

  pendingCounterData = {
    counterAttack:  action.counterAttack,
    counterEffects: counterEffects
  };

  currentStep = 'result';

  const goMsgs = [
    'C\'est parti\u00a0! A+',
    'Bien joué\u00a0! Je reviens vers toi pour les résultats. A+',
    'J\'espère que cette stratégie sera payante. Je te tiens au courant. A+'
  ];

  setTimeout(function() {
    showTyping();
    setTimeout(function() {
      hideTyping();
      addColleagueMessage(goMsgs[Math.floor(Math.random() * goMsgs.length)]);

      // Naomi passe hors ligne
      setTimeout(function() {
        setNaomiOffline(true);
        addDateSeparator('Naomi est hors ligne');

        setTimeout(function() {
          // Mettre à jour le séparateur "tour start" avec la date du tour
          const ph = GAME_DATA.phases[playedPhases[playedPhases.length - 1]];
          if (ph && ph.tourDate) {
            // le séparateur "Naomi est hors ligne" reste tel quel ;
            // le séparateur précédent (début de tour) prend la date du tour
            const seps = getChatEl().querySelectorAll('.chat-date-sep');
            if (seps.length >= 2) seps[seps.length - 2].textContent = formatTourDate(ph.tourDate);
          }

          setNaomiOffline(false);
          addDateSeparator("Aujourd'hui");
          showTyping();
          setTimeout(function() { hideTyping(); showResult(action, effects); }, 1200);
        }, 3000);
      }, 2000);
    }, 1000);
  }, 400);
}

/* ── Résultat - contre-attaque auto après 4s ── */
function showResult(action, effects) {
  effects = effects || action.effects || {};
  // Appliquer les effets au moment où le message de Naomi apparaît
  applyEffects(effects);
  updateScoreboard(changedKeys(effects));
  showScoreDelta(effects);

  addColleagueMessage(
    '<div class="result-scenario-text">Coucou ! Voici les résultats de l\'action lancée !<br>' + action.scenario + ' 👍🏾</div>' +
    '<div class="delta-row">' + buildDeltaChips(effects) + '</div>'
  );
  scrollToBottom();

  if (counterTimer) clearTimeout(counterTimer);
  counterTimer = setTimeout(function() {
    counterTimer = null;
    triggerCounterAttack();
  }, 4000);
}

/* ════════════════════════════════════════════
   CONTRE-ATTAQUE → message de Naomi (pas de bouton, suite auto)
════════════════════════════════════════════ */
function triggerCounterAttack() {
  if (!pendingCounterData) return;
  const counterAttack  = pendingCounterData.counterAttack;
  const counterEffects = pendingCounterData.counterEffects;

  showTyping();
  setTimeout(function() {
    hideTyping();

    // Appliquer les effets au moment où le message de Naomi apparaît
    applyEffects(counterEffects);
    updateScoreboard(changedKeys(counterEffects));
    showScoreDelta(counterEffects);

    const zeroKey = checkZero();

    addColleagueMessage(
      '<div class="result-scenario-text">😡 ' + counterAttack + '</div>' +
      '<div class="delta-row">' + buildDeltaChips(counterEffects) + '</div>'
    );

    scrollToBottom();

    // Quelques secondes plus tard, suite automatique
    if (zeroKey !== null) {
      setTimeout(function() { showEarlyEnd(zeroKey); }, 5000);
    } else {
      setTimeout(function() { afterCounterAttack(); }, 4000);
    }
  }, 1400);
}

function closePushNotif() {
  if (pushTimer) clearTimeout(pushTimer);
  const notif = document.getElementById('push-notification');
  notif.classList.remove('show');
  if (notif._onClose) {
    const cb      = notif._onClose;
    notif._onClose = null;
    setTimeout(cb, 450);
  }
}

function afterCounterAttack() {
  currentStep = 'pick';

  if (playedPhases.length >= GAME_DATA.phases.length) {
    setTimeout(function() { showFinalResult(); }, 3000);
    return;
  }

  const newlyUnlocked = GAME_DATA.phases.filter(function(p, i) {
    return p.lockedUntil === playedPhases.length && !_unlockedShown.includes(i);
  });
  if (newlyUnlocked.length > 0) {
    newlyUnlocked.forEach(function(p) { _unlockedShown.push(GAME_DATA.phases.indexOf(p)); });
    _pendingUnlocks = newlyUnlocked; // annoncé au début du prochain tour
  }

  if (playedPhases.length % 2 === 0) {
    setTimeout(function() { triggerEvent(); }, 600);
    return;
  }

  setTimeout(function() { askAction(); }, 600);
}

/* ════════════════════════════════════════════
   NAOMI DEMANDE LA PROCHAINE ACTION
════════════════════════════════════════════ */
function askAction() {
  const remaining = GAME_DATA.phases.length - playedPhases.length;
  const s         = remaining > 1 ? 's' : '';
  const msgs      = [
    'Coucou ! Quelle est ta <strong>prochaine action</strong>\u00a0? Il reste <strong>' + remaining + ' action' + s + '</strong> possible' + s + ' avant le vote final.',
    'Salut ! Il nous reste <strong>' + remaining + ' action' + s + '</strong>. Quelle action lances-tu\u00a0?',
    'Bonjour ! <strong>' + remaining + ' action' + s + '</strong> restante' + s + '. Quelle est ta strat\u00e9gie\u00a0?',
  ];

  if (playedPhases.length === 0) {
    // Premier tour : deux messages d'intro puis le picker
    showTyping();
    setTimeout(function() {
      hideTyping();
      addColleagueMessage(`On entre dans la première phase.<br>Le texte vient d'être inscrit à l'ordre du jour. Et un rapporteur vient d'être désigné.<br><br>C'est lui qui va organiser les auditions, structurer le débat… et orienter une bonne partie de la suite.`);
      showTyping();
      setTimeout(function() {
        hideTyping();
        addColleagueMessage(`Si on arrive à exister maintenant, on peut peser.<br>Sinon, on subira. On a plusieurs options pour démarrer.<br>Mais on ne pourra pas toutes les activer.<br><br>Qu'est-ce que tu proposes de lancer en premier\u00a0?`);
        showPickerBtn();
        scrollToBottom();
      }, 3500);
    }, 900);
    return;
  }

  // Tours suivants : d'abord "Merci Naomi" → calendrier → message Naomi
  const prevPhase = GAME_DATA.phases[playedPhases[playedPhases.length - 1]];
  const prevResultDateLabel = (prevPhase && prevPhase.tourDate)
    ? formatTourDate(addDaysToTourDate(prevPhase.tourDate, 2))
    : null;

  // Étape 1 : afficher "Merci Naomi" pré-rempli, attendre l'envoi
  showMerciInput(function() {
    // Étape 2 : 1 s après l'envoi → incrémenter tour + ouvrir calendrier
    setTimeout(function() {
      updateProgress();
      playSound('545495__ienba__notification.mp3');
      _calOnClose = function() {
        if (_lastDateSep && prevResultDateLabel) _lastDateSep.textContent = prevResultDateLabel;
        addDateSeparator("Aujourd'hui");

        // Construire le message Naomi, avec les déblocages éventuels intégrés
        const base = msgs[Math.floor(Math.random() * msgs.length)];
        const unlocks = _pendingUnlocks;
        _pendingUnlocks = [];
        let text = base;
        if (unlocks.length === 1) {
          text += '<br><br>Une nouvelle action peut être lancée si tu penses que c\'est pertinent\u00a0: <strong>' + unlocks[0].title + '</strong>.';
        } else if (unlocks.length > 1) {
          text += '<br><br>On peut lancer de nouvelles actions maintenant\u00a0:<br>'
            + unlocks.map(function(p) { return '- <strong>' + p.title + '</strong>'; }).join('<br>');
        }

        showTyping();
        setTimeout(function() {
          hideTyping();
          addColleagueMessage(text);
          showPickerBtn();
          scrollToBottom();
        }, 900);
      };
      openCalendar();
    }, 1000);
  });
}

/* ── Affiche "Merci Naomi" pré-rempli + Send actif ── */
const MERCI_SUGGESTIONS = [
  { label: 'Merci', text: 'Merci Naomi\u00a0! A+' },
  { label: 'Vu, on continue', text: 'Naomi, merci, vu, on continue... A+' },
  { label: 'On se laisse pas démonter', text: 'Allez on se laisse pas démonter, merci pour les infos\u00a0!' },
  { label: 'On va gagner', text: 'Tu m\'étonnes ! On va gagner, on peut y arriver ! A+' },
];

function showMerciInput(cb, customSuggestions) {
  const inputEl = document.getElementById('chat-input-text');
  const area    = document.getElementById('chat-input-area');
  area.style.display    = 'flex';
  area.classList.remove('dormant');
  document.getElementById('chat-actions-btn').style.display = 'none';
  const sendBtn = document.getElementById('chat-send-btn');
  sendBtn.style.display = 'flex';
  inputEl.style.display = 'block';
  const suggestions = customSuggestions || shuffle(MERCI_SUGGESTIONS).slice(0, 2);
  inputEl.textContent   = suggestions[0].text;
  inputEl.contentEditable = 'false';
  enableSendBtn();
  _pendingSend = cb;
  currentStep  = 'merci';

  // Boutons de suggestion
  const qr = document.getElementById('quick-replies');
  qr.innerHTML = '';
  suggestions.forEach(function(s) {
    const btn = document.createElement('button');
    btn.className   = 'qr-btn';
    btn.textContent = s.label;
    btn.addEventListener('click', function() {
      inputEl.textContent = s.text;
      qr.querySelectorAll('.qr-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      if (s.cb) { _pendingSend = s.cb; }
    });
    qr.appendChild(btn);
  });
  // Marquer le premier comme actif par défaut
  qr.querySelector('.qr-btn').classList.add('active');
  qr.style.display = 'flex';

  scrollToBottom();
}

/* ════════════════════════════════════════════
   SÉQUENCE D'EXPLICATIONS INTRO
════════════════════════════════════════════ */
function showSequentialMessages(messages, onComplete) {
  if (messages.length === 0) { onComplete(); return; }
  showTyping();
  setTimeout(function() {
    hideTyping();
    addColleagueMessage(messages[0]);
    setTimeout(function() {
      showSequentialMessages(messages.slice(1), onComplete);
    }, 3500);
  }, 900);
}

function showExplanations() {
  showSequentialMessages([
    `Tu arrives au moment où on entre dans une bataille assez tendue.<br><br>Une proposition de loi, qui a été adoptée au Sénat, arrive à l'Assemblée nationale.<br>Officiellement, elle vise à "simplifier" les règles pour les agriculteurs.<br>Dans les faits, elle permettrait de réintroduire plusieurs pesticides qui avaient été interdits.<br><br>Et sans surprise, le lobby des pesticides est déjà très mobilisé pour la faire passer.`,
    `De notre côté, on va devoir construire une campagne rapidement. On ne doit pas se laisser faire\u00a0!<br>Tu vas piloter ça avec moi.`,
    `Avant de démarrer, il faut que tu saches que le timing est serré.<br><br>La proposition de loi va suivre son parcours classique\u00a0: commission, débats, séance… puis vote.<br>On a donc une fenêtre très limitée pour agir.`,
    `Concrètement, tu disposes de <strong>10 tours</strong> avant le vote final.<br>Chaque tour correspond à une étape d'avancée du texte.`,
    `À chaque tour, tu vas devoir choisir une action à lancer.<br>Sensibilisation des médias, mobilisation militante, sollicitation de scientifiques…<br>C'est toi qui décide de la stratégie.<br><br>Mais tu ne pourras pas tout faire. Nous sommes une petite association avec des ressources limitées.<br>Et chaque action aura un impact soit\u00a0:<br>→ sur nos ressources économiques<br>→ sur notre crédibilité<br>→ sur le soutien du public`,
    `Et surtout fais attention à ça, car chaque action compte. Si on épuise complètement nos ressources, nous perdons la campagne et le lobby des pesticides aura le champ libre, sans mauvais jeu de mot.<br><br>Et évidemment, le lobby ne va pas rester passif. À chaque fois qu'on fera quelque chose, il réagit. Et ça peut nous fragiliser.<br><br>On y va\u00a0?`,
  ], function() {
    showMerciInput(function() { askAction(); }, [
      { label: 'On y va\u00a0!', text: 'On y va\u00a0!' },
    ]);
  });
}

/* ════════════════════════════════════════════
   ÉVÉNEMENTS → notification push
════════════════════════════════════════════ */
function triggerEvent() {
  const idx   = eventOrder[eventCount % eventOrder.length];
  const event = GAME_DATA.events[idx];
  eventCount++;

  // Titre et contenu de la notification
  const titleEl = document.getElementById('pn-title-text');
  if (titleEl) titleEl.textContent = event.icon + '\u00a0' + event.title;

  // Notification : description uniquement (sans outcome)
  document.getElementById('pn-text').textContent = event.description;
  document.getElementById('pn-deltas').innerHTML = buildDeltaChips(event.effects);

  const notif = document.getElementById('push-notification');

  playSound('545495__ienba__notification.mp3');
  notif.classList.add('show');

  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = null;

  notif._onClose = function() {
    document.body.classList.remove('notif-open');

    // Appliquer les effets et animer les indicateurs à la fermeture
    applyEffects(event.effects);
    updateScoreboard(changedKeys(event.effects));
    showScoreDelta(event.effects);

    const zeroKey = checkZero();

    // Naomi commente l'outcome puis passe à la suite
    function afterOutcome() {
      if (zeroKey !== null) {
        setTimeout(function() { showEarlyEnd(zeroKey); }, 400);
      } else {
        setTimeout(function() { askAction(); }, 400);
      }
    }

    if (event.outcome) {
      showTyping();
      setTimeout(function() {
        hideTyping();
        addColleagueMessage('🔥 Tu as vu la nouvelle\u00a0?<br>' + event.outcome);
        scrollToBottom();
        setTimeout(afterOutcome, 2500);
      }, 1000);
    } else {
      afterOutcome();
    }
  };
  document.body.classList.add('notif-open');
}

/* ════════════════════════════════════════════
   DÉBLOCAGE DE NOUVELLES ACTIONS
════════════════════════════════════════════ */

/* ════════════════════════════════════════════
   FIN PRÉMATURÉE
════════════════════════════════════════════ */
function showEarlyEnd(zeroKey) {
  const map = {
    public:    GAME_DATA.endConditions.publicZero,
    political: GAME_DATA.endConditions.politicalZero,
    resources: GAME_DATA.endConditions.resourcesZero
  };
  const data = map[zeroKey];

  document.getElementById('end-icon').textContent        = '❌';
  document.getElementById('end-title').textContent       = data.title;
  document.getElementById('end-subtitle').textContent    = data.subtitle;
  document.getElementById('end-description').textContent = data.description;
  document.getElementById('end-conclusion').textContent  = data.conclusion;
  document.getElementById('end-cta').textContent         = data.cta;
  document.getElementById('end-scores').innerHTML        = buildScoresSummary();
  document.getElementById('end-actions').innerHTML       = buildActionsList();

  setTimeout(() => showScreen('screen-end'), 60);
}

/* ════════════════════════════════════════════
   RÉSULTAT FINAL
════════════════════════════════════════════ */
function showFinalResult() {
  const s = scores.score || 0;
  let result;
  if      (s >= 90) result = GAME_DATA.finalResults.find(function(r) { return r.id === 'complete_win'; });
  else if (s >= 50) result = GAME_DATA.finalResults.find(function(r) { return r.id === 'partial_win'; });
  else if (s >= 20) result = GAME_DATA.finalResults.find(function(r) { return r.id === 'statu_quo'; });
  else              result = GAME_DATA.finalResults.find(function(r) { return r.id === 'lobby_win'; });

  document.getElementById('result-icon').textContent        = result.icon;
  document.getElementById('result-badge-span').textContent  = result.title;
  document.getElementById('result-badge-span').className    = result.badgeClass;
  document.getElementById('result-title').textContent       = result.title;
  document.getElementById('result-description').textContent = result.description;
  document.getElementById('result-conclusion').textContent  = result.conclusion;
  document.getElementById('result-cta').textContent         = result.cta;
  document.getElementById('result-scores').innerHTML        = buildScoresSummary();
  document.getElementById('result-actions').innerHTML       = buildActionsList();

  setTimeout(() => showScreen('screen-result'), 60);
}

/* ════════════════════════════════════════════
   RÉCAP
════════════════════════════════════════════ */
function buildActionsList() {
  if (!playedActions.length) return '<p style="opacity:.7;font-size:.85rem;">Aucune action jouée.</p>';
  return '<ol class="actions-recap-list">' +
    playedActions.map(function(a) {
      return '<li><span class="ar-phase">' + a.phase + '</span> - ' + a.action + '</li>';
    }).join('') +
    '</ol>';
}

function buildScoresSummary() {
  return '<div class="summary-item"><div class="si-icon">👥</div><div class="si-label">Soutien du Public</div><div class="si-val">' + scores.public + '</div></div>' +
    '<div class="summary-item"><div class="si-icon">🏛️</div><div class="si-label">Influence Politique</div><div class="si-val">' + scores.political + '</div></div>' +
    '<div class="summary-item"><div class="si-icon">💶</div><div class="si-label">Ressources</div><div class="si-val">' + scores.resources + '</div></div>';
}
