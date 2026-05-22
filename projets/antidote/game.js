/* ══════════════════════════════════════════════════════════
   ANTIDOTE interface messagerie avec Naomi
══════════════════════════════════════════════════════════ */

/* ── State ── */
let scores         = {};
let playedPhases   = [];
let playedActions  = [];
let gameHistory    = [];
let _usedMerciLabels  = [];
let _activeMerciLabel = null;
let phaseOrder     = [];
let eventOrder     = [];
let eventCount     = 0;
let _unlockedShown     = [];
let pendingAction      = null;
let pendingOption      = null;
let pendingCounterData = null;
let pendingEarlyEnd         = null;
let pendingFinalResult      = false;
let _resourcesWentNegative  = false;
let pendingInputText   = null;   // texte complet destiné au message joueur
let currentStep        = 'pick';
let typingRowEl        = null;
let pushTimer          = null;
let counterTimer       = null;

// Référence d'affichage des barres : valeur initiale × 2 = 50 % au départ
const BAR_REF = { public: 80, political: 120, resources: 200 };
const PHASE_ICONS = ['🤝','🏛️','🔬','📺','🌾','📣','📱','⚖️'];

/* ── Sons ── */
let _soundEnabled = false;

function playSound(filename) {
  if (!_soundEnabled) return;
  try {
    const audio = new Audio('sfx/' + filename);
    audio.volume = 0.5;
    audio.play().catch(function() {});
  } catch (e) {}
}

/* ── Options de la page d'accueil + modale paramètres ── */
document.addEventListener('DOMContentLoaded', function() {

  /* --- Page d'accueil --- */
  const optSound = document.getElementById('opt-sound');
  const optFullscreen = document.getElementById('opt-fullscreen');

  if (optSound) {
    _soundEnabled = optSound.checked;
    optSound.addEventListener('change', function() {
      _soundEnabled = optSound.checked;
      if (_soundEnabled) playSound('545495__ienba__notification.mp3');
    });
  }

  if (optFullscreen) {
    optFullscreen.addEventListener('change', function() {
      if (optFullscreen.checked) {
        document.documentElement.requestFullscreen().catch(function() {});
      } else if (document.fullscreenElement) {
        document.exitFullscreen().catch(function() {});
      }
    });
  }

  /* --- Modale paramètres --- */

  // Plein écran
  const setFs = document.getElementById('set-fullscreen');
  if (setFs) {
    setFs.addEventListener('change', function() {
      if (setFs.checked) {
        document.documentElement.requestFullscreen().catch(function() {});
      } else if (document.fullscreenElement) {
        document.exitFullscreen().catch(function() {});
      }
    });
  }

  // Effets sonores
  const setSound = document.getElementById('set-sound');
  if (setSound) {
    setSound.addEventListener('change', function() {
      _soundEnabled = setSound.checked;
      if (optSound) optSound.checked = _soundEnabled;
      if (_soundEnabled) playSound('545495__ienba__notification.mp3');
    });
  }

  // Synchroniser les cases fullscreen (accueil + modale) avec l'état réel
  document.addEventListener('fullscreenchange', function() {
    const isFs = !!document.fullscreenElement;
    if (optFullscreen) optFullscreen.checked = isFs;
    // La modale est synchro à l'ouverture via openSettings()
  });

  // Taille des textes
  document.querySelectorAll('input[name="zoom"]').forEach(function(r) {
    r.addEventListener('change', function() {
      if (r.checked) {
        document.documentElement.style.zoom = (parseInt(r.value, 10) / 100).toString();
      }
    });
  });
});

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
  const optSound = document.getElementById('opt-sound');
  _soundEnabled = optSound ? optSound.checked : false;

  const optFullscreen = document.getElementById('opt-fullscreen');
  if (optFullscreen && optFullscreen.checked && !document.fullscreenElement
      && document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(function() {});
  }

  scores             = { ...GAME_DATA.initialScores };
  playedPhases       = [];
  playedActions      = [];
  gameHistory        = [];
  _usedMerciLabels   = [];
  _activeMerciLabel  = null;
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
  flashToScreen('screen-game', function() {
    showDormantInput();
    showTyping();
  });

  setTimeout(function() {
    hideTyping();
    addColleagueMessage(
      `Bienvenue dans l'équipe\u00a0🙂<br>Je suis <b>Naomi</b>, directrice d'Antidote.<br>Ravie de t'accueillir, même si, le timing est, disons… serré.`
    );
    showMerciInput(function() {
      showTyping();
      setTimeout(function() {
        hideTyping();
        addColleagueMessage('On entre directement dans le vif du sujet.<br>Tu veux d\'abord quelques explications, ou on y va ?');
        showMerciInput(function() { showExplanations(); }, [
          { label: 'Explique-moi', text: 'Explique-moi', cb: function() { showExplanations(); } },
          { label: 'Passer...', text: 'On y va directement !', cb: function() { askAction(); } },
        ]);
      }, 800);
    }, [{ label: 'Merci\u00a0!', text: 'Salut Naomi, merci\u00a0!' }]);
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

function flashToScreen(id, cb) {
  const overlay = document.getElementById('flash-overlay');
  if (!overlay) { showScreen(id); if (cb) cb(); return; }
  overlay.classList.add('visible');
  setTimeout(function() {
    showScreen(id);
    if (cb) cb();
    requestAnimationFrame(function() {
      overlay.style.transition = 'opacity 250ms ease';
      overlay.classList.remove('visible');
      overlay.addEventListener('transitionend', function reset() {
        overlay.style.transition = '';
        overlay.removeEventListener('transitionend', reset);
      });
    });
  }, 150);
}

/* ════════════════════════════════════════════
   SCOREBOARD
════════════════════════════════════════════ */
const SCORE_LABELS = { public: 'Soutien du public', political: 'Influence politique', resources: 'Ressources' };

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
    let status = '';
    if (val <= ref * 0.10)      { elB.classList.add('danger');  pill.classList.add('danger');  status = ' - niveau critique'; }
    else if (val <= ref * 0.20) { elB.classList.add('warning'); pill.classList.add('warning'); status = ' - niveau faible'; }

    // Mettre à jour l'aria-label du pill pour refléter valeur et état (RGAA 3.1)
    if (pill) pill.setAttribute('aria-label', SCORE_LABELS[key] + '\u00a0: ' + val + status);

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
  if (name)  name.textContent = phase && phase.tourLabel ? phase.tourLabel : '-';
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
  setTimeout(function() {
    const okBtn = document.querySelector('.cal-overlay .cal-ok-btn');
    if (okBtn) okBtn.focus();
  }, 50);
}

function closeCalendar() {
  document.getElementById('cal-overlay').classList.remove('open');
  // Retour du focus sur l'élément déclencheur (RGAA 7.1)
  const trigger = document.getElementById('chp-label');
  if (trigger) trigger.focus();
  if (_calOnClose) {
    const cb = _calOnClose;
    _calOnClose = null;
    setTimeout(cb, 300);
  }
}

function onCalOverlayClick(e) {
  if (e.target === document.getElementById('cal-overlay')) closeCalendar();
}

/* ════════════════════════════════════════════
   PARAMÈTRES
════════════════════════════════════════════ */
function openSettings() {
  const setFs = document.getElementById('set-fullscreen');
  if (setFs) setFs.checked = !!document.fullscreenElement;

  const setSound = document.getElementById('set-sound');
  if (setSound) setSound.checked = _soundEnabled;

  const currentZoom = Math.round(parseFloat(document.documentElement.style.zoom || '1') * 100) || 100;
  document.querySelectorAll('input[name="zoom"]').forEach(function(r) {
    r.checked = parseInt(r.value, 10) === currentZoom;
  });

  document.getElementById('settings-overlay').classList.add('open');
  document.getElementById('settings-btn').setAttribute('aria-expanded', 'true');
}

function closeSettings() {
  document.getElementById('settings-overlay').classList.remove('open');
  document.getElementById('settings-btn').setAttribute('aria-expanded', 'false');
  document.getElementById('settings-btn').focus();
}

function onSettingsOverlayClick(e) {
  if (e.target === document.getElementById('settings-overlay')) closeSettings();
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
    + '<button class="cal-nav-btn" onclick="calNav(-1)" aria-label="Mois précédent">‹</button>'
    + '<span class="cal-month-title" aria-live="polite">' + CAL_MONTH_NAMES[_calMonth] + ' ' + _calYear + '</span>'
    + '<button class="cal-nav-btn" onclick="calNav(1)" aria-label="Mois suivant">›</button>'
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
  const newRes = scores.resources + (effects.resources || 0);
  if (newRes < 0) _resourcesWentNegative = true;
  scores.resources = Math.max(0, newRes);
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
    el.style.top  = (rect.top + rect.height / 2) + 'px';
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
  const isLastTurn = playedPhases.length >= GAME_DATA.phases.length;
  if (scores.resources <= 0 && (!isLastTurn || _resourcesWentNegative)) return 'resources';
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
    behavior: 'instant'
  });
}

function addColleagueMessage(htmlContent) {
  playSound('400697__daphne_in_wonderland__messenger-notification-sound-imitation.mp3');
  const chat = getChatEl();
  const row  = document.createElement('div');
  row.className = 'msg-row naomi';
  row.innerHTML =
    '<div class="msg-avatar" aria-hidden="true">👩🏽‍💼</div>' +
    '<div class="msg-bubble">' +
      '<div class="msg-sender" aria-hidden="true">Naomi</div>' +
      '<div class="msg-body">' + htmlContent + '</div>' +
      '<span class="msg-time" aria-hidden="true">' + getTime() + '</span>' +
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
      '<span class="msg-time" aria-hidden="true">' + getTime() + ' ✓</span>' +
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
  row.setAttribute('aria-label', 'Naomi est en train d\'écrire…');
  row.innerHTML =
    '<div class="msg-avatar" aria-hidden="true">👩🏽‍💼</div>' +
    '<div class="typing-bubble" aria-hidden="true">' +
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

/* ── Saisie progressive dans le champ (typewriter) ── */
let _inputTypingTimer = null;
let _inputFullText    = '';

function animateInputText(text) {
  const inputEl = document.getElementById('chat-input-text');
  if (_inputTypingTimer) { clearTimeout(_inputTypingTimer); _inputTypingTimer = null; }
  _inputFullText = text || '';
  inputEl.textContent     = '';
  inputEl.contentEditable = 'false';
  if (!text) return;
  const SPEED = 24; // ms par caractère
  let i = 0;
  function type() {
    i++;
    inputEl.textContent = text.slice(0, i);
    if (i < text.length) {
      _inputTypingTimer = setTimeout(type, SPEED);
    } else {
      _inputTypingTimer = null;
    }
  }
  type();
}

/* Termine l'animation instantanément (appelé avant d'envoyer) */
function finishInputAnimation() {
  if (_inputTypingTimer) {
    clearTimeout(_inputTypingTimer);
    _inputTypingTimer = null;
    document.getElementById('chat-input-text').textContent = _inputFullText;
  }
}

/* Annule l'animation sans appliquer le texte final (reset du champ) */
function cancelInputAnimation() {
  if (_inputTypingTimer) { clearTimeout(_inputTypingTimer); _inputTypingTimer = null; }
  _inputFullText = '';
}

/* ── Active la zone de saisie et anime le texte dans le champ ── */
function typewriterInput(text, cb) {
  showInputArea();
  animateInputText(text);
  enableSendBtn();
  scrollToBottom();
  if (cb) cb();
}

/* ── Mode dormant : barre toujours visible mais inactive ── */
function showDormantInput() {
  cancelInputAnimation();
  const area = document.getElementById('chat-input-area');
  area.style.display = 'flex';
  area.classList.add('dormant');
  document.getElementById('chat-actions-btn').style.display = 'none';
  const inputEl = document.getElementById('chat-input-text');
  inputEl.style.display = 'block';
  inputEl.innerHTML     = '';
  const sendBtn = document.getElementById('chat-send-btn');
  sendBtn.style.display = 'flex';
  disableSendBtn();
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
  actBtn.focus();
  actBtn.addEventListener('mouseenter', function stopPulse() {
    actBtn.classList.remove('pulse');
    actBtn.removeEventListener('mouseenter', stopPulse);
  }, { once: true });
  inputEl.style.display = 'block';
  inputEl.innerHTML     = '<span style="color:var(--text-muted);opacity:.5;">Message…</span>';
  sendBtn.style.display = 'flex';
  disableSendBtn();
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

function disableSendBtn() {
  const btn = document.getElementById('chat-send-btn');
  btn.disabled = true;
  btn.classList.remove('pulse');
}

function enableSendBtn() {
  const btn = document.getElementById('chat-send-btn');
  btn.disabled = false;
  btn.classList.remove('pulse');
  void btn.offsetWidth;
  btn.classList.add('pulse');
  btn.focus();
  btn.addEventListener('mouseenter', function stop() {
    btn.classList.remove('pulse');
    btn.removeEventListener('mouseenter', stop);
  }, { once: true });
}

function hideInputArea() {
  cancelInputAnimation();
  closeStrategyPanel();
  closeActionsPanel();
  document.getElementById('quick-replies').style.display   = 'none';
  document.getElementById('chat-input-area').style.display = 'none';
  document.getElementById('chat-input-area').classList.remove('dormant');
  document.getElementById('chat-input-text').innerHTML     = '';
  disableSendBtn();
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
    let ariaLabel = phase.title;
    if (isPlayed) {
      badge = '<span class="ao-card-played-badge" aria-hidden="true">✓ Tour ' + (playedPhases.indexOf(i) + 1) + '</span>';
      ariaLabel = phase.title + ' - joué au tour ' + (playedPhases.indexOf(i) + 1);
    } else if (locked) {
      badge = '<span class="ao-card-locked-badge" aria-hidden="true">🔒</span>';
      ariaLabel = phase.title + ' - verrouillé';
    }
    card.setAttribute('aria-label', ariaLabel);

    card.innerHTML = badge +
      '<div class="ao-card-icon-wrap" aria-hidden="true">' + icon + '</div>' +
      '<div class="ao-card-title">' + phase.title + '</div>';

    if (!isPlayed && !locked) {
      (function(phaseIndex) {
        card.addEventListener('click', function() { selectPhaseFromOverlay(phaseIndex); });
      })(i);
    }
    grid.appendChild(card);
  });

  document.getElementById('actions-panel').classList.add('open');
  const actBtn = document.getElementById('chat-actions-btn');
  actBtn.classList.add('active');
  actBtn.setAttribute('aria-expanded', 'true');
}

function closeActionsPanel() {
  document.getElementById('actions-panel').classList.remove('open');
  const btn = document.getElementById('chat-actions-btn');
  if (btn) {
    btn.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
  }
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

  // Mode panel
  //if (playedPhases.length % 3 !== 0 || playedPhases.length === 9) {
    openStrategyPanel(phaseIndex);
    return;
  //}

  // Mode chat : demander à Naomi
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
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', 'Stratégie ' + (visIdx + 1) + ' : ' + a.label);
    card.innerHTML =
      '<div class="option-label">' +
        '<span class="option-num" aria-hidden="true">' + (visIdx + 1) + '</span>' +
        a.label +
      '</div>' +
      '<div class="option-desc">' + a.description + '</div>' +
      resChip;

    card.addEventListener('click', function() { selectOptionFromPanel(card, origIdx, phaseIndex); });
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectOptionFromPanel(card, origIdx, phaseIndex);
      }
    });
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
  disableSendBtn();
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

  animateInputText(pendingInputText);
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
  } else if (currentStep === 'sorry') {
    sendSorry();
  } else if (currentStep === 'jarrive') {
    sendJArrive();
  }
}

function sendMerci() {
  finishInputAnimation();
  const inputEl = document.getElementById('chat-input-text');
  const text = (inputEl.textContent || '').trim() || 'Merci Naomi\u00a0!';
  document.getElementById('quick-replies').style.display = 'none';
  if (_activeMerciLabel) { _usedMerciLabels.push(_activeMerciLabel); _activeMerciLabel = null; }
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
      '<div class="option-card" data-orig="' + origIdx + '" role="button" tabindex="0" aria-label="Stratégie ' + (visIdx + 1) + '\u00a0: ' + a.label + '">' +
        '<div class="option-label">' +
          '<span class="option-num" aria-hidden="true">' + (visIdx + 1) + '</span>' +
          a.label +
        '</div>' +
        '<div class="option-desc">' + a.description + '</div>' +
        resChip +
      '</div>';
  });

  const row = addColleagueMessage(
    'Voici les stratégies disponibles pour <b>' + phase.title + '</b>.' +
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
    card.addEventListener('keydown', function(e) {
      if ((e.key === 'Enter' || e.key === ' ') && !card.classList.contains('done') && currentStep === 'action') {
        e.preventDefault();
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
  finishInputAnimation();

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

  _resourcesWentNegative = false;
  playedActions.push({ phase: phase.title, action: action.label });
  gameHistory.push({
    type: 'action',
    turnNumber: playedPhases.length + 1,
    phase: phase.title,
    action: action.label,
    effects: effects,
    counterEffects: counterEffects,
  });
  playedPhases.push(phaseIndex);

  pendingCounterData = {
    naomiCounterMessages: action.naomiCounterMessages || [action.counterAttack || ''],
    counterEffects: counterEffects
  };

  currentStep = 'result';

  const firstMsg = (action.naomiMessages && action.naomiMessages[0]) || '';

  setTimeout(function() {
    showTyping();
    setTimeout(function() {
      hideTyping();
      addColleagueMessage('<div class="result-scenario-text">' + firstMsg + '</div>');

      // Naomi passe hors ligne
      setTimeout(function() {
        setNaomiOffline(true);
        addDateSeparator('Naomi est hors ligne');
        scrollToBottom();

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
          setTimeout(function() { hideTyping(); showResult(action, effects, 1); }, 1200);
        }, 3000);
      }, 2000);
    }, 1000);
  }, 400);
}

/* ── Vérifie si le scroll est en bas de page (±50px) ── */
function isNearBottom() {
  return (window.innerHeight + window.scrollY) >= document.body.scrollHeight - 50;
}

function waitForBottom(cb) {
  if (isNearBottom()) { cb(); return; }
  function onScroll() {
    if (isNearBottom()) {
      window.removeEventListener('scroll', onScroll);
      cb();
    }
  }
  window.addEventListener('scroll', onScroll);
}

/* ── Affiche plusieurs messages Naomi séquentiellement ── */
function showSequentialNaomiMessages(msgs, onComplete) {
  if (!msgs || msgs.length === 0) {
    if (onComplete) onComplete();
    return;
  }
  addColleagueMessage(msgs[0]);
  scrollToBottom();
  if (msgs.length === 1) {
    if (onComplete) onComplete();
    return;
  }
  var idx = 1;
  function showNext() {
    if (idx >= msgs.length) {
      if (onComplete) onComplete();
      return;
    }
    var msg = msgs[idx];
    idx++;
    var delay = msg.indexOf('chat-img') !== -1 ? 3000 : 1400;
    setTimeout(function() {
      waitForBottom(function() {
        showTyping();
        setTimeout(function() {
          hideTyping();
          addColleagueMessage(msg);
          scrollToBottom();
          showNext();
        }, 1000);
      });
    }, delay);
  }
  showNext();
}

/* ── Résultat - contre-attaque auto après délai ── */
function showResult(action, effects, fromIndex) {
  effects = effects || action.effects || {};
  applyEffects(effects);
  updateScoreboard(changedKeys(effects));
  showScoreDelta(effects);

  var allMsgs = action.naomiMessages || [action.scenario];
  var rawMsgs = allMsgs.slice(fromIndex || 0);

  var scheduleCounter = function() {
    if (counterTimer) clearTimeout(counterTimer);
    counterTimer = setTimeout(function() {
      counterTimer = null;
      triggerCounterAttack();
    }, 3000);
  };

  if (rawMsgs.length === 0) {
    scheduleCounter();
    return;
  }

  var imgIdx = rawMsgs.findIndex(function(m) { return m.indexOf('chat-img') !== -1; });
  var deltaIdx = imgIdx !== -1 ? imgIdx : rawMsgs.length - 1;
  var msgs = rawMsgs.map(function(m, i) {
    if (i === deltaIdx) {
      return '<div class="result-scenario-text">' + m + '</div>' +
             '<div class="delta-row">' + buildDeltaChips(effects) + '</div>';
    }
    return '<div class="result-scenario-text">' + m + '</div>';
  });

  showSequentialNaomiMessages(msgs, scheduleCounter);
}

/* ════════════════════════════════════════════
   CONTRE-ATTAQUE → message de Naomi (pas de bouton, suite auto)
════════════════════════════════════════════ */
function triggerCounterAttack() {
  if (!pendingCounterData) return;
  var naomiCounterMessages = pendingCounterData.naomiCounterMessages;
  var counterEffects = pendingCounterData.counterEffects;

  showTyping();
  setTimeout(function() {
    hideTyping();

    // Appliquer les effets au moment où le message de Naomi apparaît
    applyEffects(counterEffects);
    updateScoreboard(changedKeys(counterEffects));
    showScoreDelta(counterEffects);

    var zeroKey = checkZero();

    var imgIdx = naomiCounterMessages.findIndex(function(m) { return m.indexOf('chat-img') !== -1; });
    var deltaIdx = imgIdx !== -1 ? imgIdx : naomiCounterMessages.length - 1;
    var msgs = naomiCounterMessages.map(function(m, i) {
      if (i === deltaIdx) {
        return '<div class="result-scenario-text">' + m + '</div>' +
               '<div class="delta-row">' + buildDeltaChips(counterEffects) + '</div>';
      }
      return '<div class="result-scenario-text">' + m + '</div>';
    });

    showSequentialNaomiMessages(msgs, function() {
      // Suite automatique après les messages
      if (zeroKey !== null) {
        setTimeout(function() { showEarlyEnd(zeroKey); }, 3000);
      } else {
        setTimeout(function() { afterCounterAttack(); }, 3000);
      }
    });
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
    setTimeout(function() { waitForBottom(function() { triggerEvent(); }); }, 3000);
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
    'Coucou !<br>Il nous reste <b>' + remaining + ' action' + s + '</b> possible' + s + ' avant le vote final.(new_actions)<br>👉 <b>Quelle est ta prochaine action\u00a0?</b>',
    'Salut !<br>Nous avons encore <b>' + remaining + ' action' + s + '</b>.(new_actions)<br>👉 <b>Quelle action lances-tu\u00a0?</b>',
    'Bonjour !<br>Encore <b>' + remaining + ' action' + s + '</b> restante' + s + '.(new_actions)<br>👉 <b>Quelle est ta stratégie pour la suite\u00a0?</b>',
  ];

  if (playedPhases.length === 0) {
    // Premier tour : deux messages d'intro puis le picker
    showTyping();
    setTimeout(function() {
      hideTyping();
      addColleagueMessage(`Le texte vient d'être inscrit à l'ordre du jour.<br>Un rapporteur vient d'être désigné : c'est lui qui va organiser les auditions et structurer le débat.`);
      showTyping();
      setTimeout(function() {
        hideTyping();
        addColleagueMessage(`Si on arrive à peser dès maintenant, on part avec une longueur d'avance.<br>Quelle est ta première action ?`);
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

        let text = '';

        if (remaining === 1) {
          text = 'Hello !<br>Nous avons encore <b>une dernière action à lancer !</b>'
        } else {
          // Construire le message Naomi, avec les déblocages éventuels intégrés
          const base = msgs[Math.floor(Math.random() * msgs.length)];
          const unlocks = _pendingUnlocks;
          _pendingUnlocks = [];
          let unlockedActionsText = '';

          if (unlocks.length === 1) {
            unlockedActionsText += '<br>🔥 Une nouvelle action peut être lancée si tu penses que c\'est pertinent\u00a0: <b>' + unlocks[0].title + '</b>.';
          } else if (unlocks.length > 1) {
            unlockedActionsText += '<br>🔥 On peut lancer de nouvelles actions maintenant\u00a0:<br>'
              + unlocks.map(function(p) { return '- ' + p.title; }).join('<br>');
          }

          text = base.replace('(new_actions)', unlockedActionsText);
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
  { label: 'Merci', text: 'Merci, on continue...' },
  { label: 'Bien reçu', text: 'Bien reçu, merci.' },
  { label: 'On a encore du travail...', text: 'On a encore du travail...' },
  { label: 'Compris', text: 'Compris. A+' },
  { label: 'C\'est noté', text: 'C\'est noté' },
  { label: '👍', text: '👍' },
  { label: '😡', text: '😡' },
  { label: '😠', text: '😠' },
  { label: '🤔', text: '🤔' },
  { label: '😑', text: '😑' },
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
  const trackUsage = !customSuggestions;
  let suggestions;
  if (customSuggestions) {
    suggestions = customSuggestions;
  } else {
    const pool = shuffle(MERCI_SUGGESTIONS.filter(function(s) { return !_usedMerciLabels.includes(s.label); }));
    suggestions = (pool.length >= 2 ? pool : shuffle(MERCI_SUGGESTIONS)).slice(0, 2);
  }
  _activeMerciLabel = trackUsage ? suggestions[0].label : null;
  animateInputText(suggestions[0].text);
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
      animateInputText(s.text);
      qr.querySelectorAll('.qr-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      if (trackUsage) _activeMerciLabel = s.label;
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
    `Une proposition de loi vient d'être déposée au Sénat.<br>Officiellement, elle vise à "simplifier" les règles pour les agriculteurs.<br>Dans les faits : réintroduire des pesticides interdits.<br>L'AIPP (l'Association industrielle de protection des plantes), le lobby des pesticides, est déjà mobilisée pour la faire passer.`,
    `Tu disposes de 8 tours avant le vote final pour augmenter le soutien public ou l'influence politique.<br>À chaque tour, tu choisis une action : mobiliser des scientifiques, alerter les médias, convaincre des parlementaires…<br>C'est toi qui décide.`,
    `Chaque action a un coût et un effet sur trois indicateurs :<br>→ Soutien du public<br>→ Influence politique<br>→ Ressources<br>Si l'un des trois tombe à zéro, la campagne s'arrête.`,
    `Dernière chose : le lobby ne restera pas passif.<br>À chaque action qu'on lance, l'AIPP réagira.`,
    `On y va ?`,
  ], function() {
    showMerciInput(function() { askAction(); }, [
      { label: 'C\'est parti !', text: 'C\'est parti !' },
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
  setTimeout(function() {
    const closeBtn = notif.querySelector('.pn-close');
    if (closeBtn) closeBtn.focus();
  }, 50);

  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = null;

  notif._onClose = function() {
    document.body.classList.remove('notif-open');

    // Appliquer les effets et animer les indicateurs à la fermeture
    applyEffects(event.effects);
    updateScoreboard(changedKeys(event.effects));
    showScoreDelta(event.effects);
    gameHistory.push({
      type: 'event',
      icon: event.icon,
      title: event.title,
      description: event.description,
      effects: event.effects,
    });

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
  const naomiMsgs = {
    public:    'On a perdu tout le soutien du public.',
    political: 'On n\'a plus aucun soutien politique.',
    resources: 'On a consommé toutes nos ressources !'
  };

  pendingEarlyEnd = zeroKey;
  currentStep = 'sorry';

  hideInputArea();
  showTyping();
  setTimeout(function() {
    hideTyping();
    addColleagueMessage(naomiMsgs[zeroKey]);
    scrollToBottom();
    setTimeout(function() {
      typewriterInput('Désolé 😞', function() {
        enableSendBtn();
      });
    }, 800);
  }, 1000);
}

function _doShowEarlyEnd(zeroKey) {
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
  document.getElementById('end-graph').innerHTML         = buildScoreGraph();
  document.getElementById('end-actions').innerHTML       = buildActionsList();
  document.getElementById('end-hint').innerHTML          = buildHintAccordion();

  setTimeout(() => flashToScreen('screen-end'), 60);
}

function sendSorry() {
  finishInputAnimation();
  const inputEl = document.getElementById('chat-input-text');
  const text = (inputEl.textContent || '').trim() || 'Désolé';
  currentStep = 'waiting';
  showDormantInput();
  playSound('760370__froey__message-sent.mp3');
  addPlayerMessage(text);
  scrollToBottom();
  const zeroKey = pendingEarlyEnd;
  pendingEarlyEnd = null;
  setTimeout(function() { _doShowEarlyEnd(zeroKey); }, 1000);
}

/* ════════════════════════════════════════════
   RÉSULTAT FINAL
════════════════════════════════════════════ */
function showFinalResult() {
  pendingFinalResult = true;
  currentStep = 'jarrive';

  hideInputArea();
  showTyping();
  setTimeout(function() {
    hideTyping();
    addColleagueMessage('C\'est fini, on va voir ce que va donner le vote\u00a0!<br>Rejoins-moi au bar en face du bureau pour… fêter (ou pas) le résultat\u00a0!');
    scrollToBottom();
    setTimeout(function() {
      typewriterInput('J\'arrive\u00a0!', function() {
        enableSendBtn();
      });
    }, 800);
  }, 1000);
}

function _doShowFinalResult() {
  const s = scores.score || 0;
  let result;
  if      (s >= 40) result = GAME_DATA.finalResults.find(function(r) { return r.id === 'complete_win'; });
  else if (s >= 25) result = GAME_DATA.finalResults.find(function(r) { return r.id === 'partial_win'; });
  else if (s >= 15) result = GAME_DATA.finalResults.find(function(r) { return r.id === 'statu_quo'; });
  else              result = GAME_DATA.finalResults.find(function(r) { return r.id === 'lobby_win'; });

  document.getElementById('result-icon').textContent        = result.icon;
  document.getElementById('result-title').textContent       = result.title;
  document.getElementById('result-description').textContent = result.description;
  document.getElementById('result-conclusion').textContent  = result.conclusion;
  document.getElementById('result-cta').textContent         = result.cta;
  document.getElementById('result-scores').innerHTML        = buildScoresSummary();
  document.getElementById('result-graph').innerHTML         = buildScoreGraph();
  document.getElementById('result-actions').innerHTML       = buildActionsList();
  document.getElementById('result-hint').innerHTML          = result.id !== 'complete_win' ? buildHintAccordion() : '';

  setTimeout(() => flashToScreen('screen-result'), 60);
}

function sendJArrive() {
  finishInputAnimation();
  const inputEl = document.getElementById('chat-input-text');
  const text = (inputEl.textContent || '').trim() || 'J\'arrive\u00a0!';
  currentStep = 'waiting';
  pendingFinalResult = false;
  showDormantInput();
  playSound('760370__froey__message-sent.mp3');
  addPlayerMessage(text);
  scrollToBottom();
  setTimeout(function() { _doShowFinalResult(); }, 1000);
}

/* ════════════════════════════════════════════
   RÉCAP
════════════════════════════════════════════ */

/* ── Reconstruit la progression des scores depuis gameHistory ── */
function computeScoreTimeline() {
  var pub = GAME_DATA.initialScores.public;
  var pol = GAME_DATA.initialScores.political;
  var res = GAME_DATA.initialScores.resources;
  var timeline = [{ label: 'Départ', public: pub, political: pol, resources: res }];
  var evtCount = 0;

  gameHistory.forEach(function(entry) {
    if (entry.type === 'action') {
      pub = Math.max(0, pub + (entry.effects.public     || 0));
      pol = Math.max(0, pol + (entry.effects.political  || 0));
      res = Math.max(0, res + (entry.effects.resources  || 0));
      pub = Math.max(0, pub + (entry.counterEffects.public     || 0));
      pol = Math.max(0, pol + (entry.counterEffects.political  || 0));
      res = Math.max(0, res + (entry.counterEffects.resources  || 0));
      timeline.push({ label: 'T.' + entry.turnNumber, public: pub, political: pol, resources: res, tooltip: entry.action });
    } else if (entry.type === 'event') {
      evtCount++;
      pub = Math.max(0, pub + (entry.effects.public     || 0));
      pol = Math.max(0, pol + (entry.effects.political  || 0));
      res = Math.max(0, res + (entry.effects.resources  || 0));
      timeline.push({ label: 'E' + evtCount, public: pub, political: pol, resources: res, isEvent: true, tooltip: entry.title });
    }
  });

  return timeline;
}

/* ── Graphique SVG de progression ── */
function buildScoreGraph() {
  if (!gameHistory.length) return '';
  var timeline = computeScoreTimeline();
  if (timeline.length < 2) return '';

  var W = 560, H = 180;
  var ML = 34, MR = 10, MT = 12, MB = 34;
  var CW = W - ML - MR;
  var CH = H - MT - MB;
  var n  = timeline.length;

  // Échelle Y
  var yMax = 20;
  timeline.forEach(function(p) {
    yMax = Math.max(yMax, p.public, p.political, p.resources);
  });
  yMax = Math.max(Math.ceil((yMax + 10) / 25) * 25, 50);
  var yStep = yMax > 150 ? 50 : 25;

  function xp(i) { return ML + (n < 2 ? CW / 2 : (i / (n - 1)) * CW); }
  function yp(v) { return MT + CH * (1 - Math.min(v, yMax) / yMax); }

  var o = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;">';

  // Grille Y
  for (var yv = 0; yv <= yMax; yv += yStep) {
    var yy = yp(yv).toFixed(1);
    o += '<line x1="' + ML + '" y1="' + yy + '" x2="' + (W - MR) + '" y2="' + yy + '" stroke="#e4e1dc" stroke-width="0.8"/>';
    o += '<text x="' + (ML - 3) + '" y="' + (parseFloat(yy) + 3.5).toFixed(1) + '" text-anchor="end" font-size="9" font-family="Arial,sans-serif" fill="#666">' + yv + '</text>';
  }

  // Marqueurs verticaux événements
  timeline.forEach(function(p, i) {
    if (!p.isEvent) return;
    var xv = xp(i).toFixed(1);
    o += '<line x1="' + xv + '" y1="' + MT + '" x2="' + xv + '" y2="' + (MT + CH) + '" stroke="#d4a72c" stroke-width="1.2" stroke-dasharray="3 2" opacity="0.55"/>';
  });

  // 3 lignes (resources en dessous, public au-dessus)
  var COLS = { public: '#2d8a4e', political: '#1a5fb4', resources: '#e0882a' };
  ['resources', 'political', 'public'].forEach(function(key) {
    var pts = timeline.map(function(p, i) {
      return xp(i).toFixed(1) + ',' + yp(p[key]).toFixed(1);
    }).join(' ');
    o += '<polyline points="' + pts + '" fill="none" stroke="' + COLS[key] + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>';
    timeline.forEach(function(p, i) {
      var r = p.isEvent ? '2' : '2.8';
      o += '<circle cx="' + xp(i).toFixed(1) + '" cy="' + yp(p[key]).toFixed(1) + '" r="' + r + '" fill="' + COLS[key] + '"/>';
    });
  });

  // Labels axe X (avec tooltip au survol)
  timeline.forEach(function(p, i) {
    var fill = p.isEvent ? '#8B6914' : '#555';
    var xv = xp(i).toFixed(1);
    var ty = MT + CH + 14;
    if (p.tooltip) {
      var esc = p.tooltip.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      o += '<g style="cursor:help">'
        + '<title>' + esc + '</title>'
        + '<rect x="' + (xp(i) - 13).toFixed(1) + '" y="' + (MT + CH + 2) + '" width="26" height="14" fill="transparent"/>'
        + '<text x="' + xv + '" y="' + ty + '" text-anchor="middle" font-size="9" font-family="Arial,sans-serif" fill="' + fill + '">' + p.label + '</text>'
        + '</g>';
    } else {
      o += '<text x="' + xv + '" y="' + ty + '" text-anchor="middle" font-size="9" font-family="Arial,sans-serif" fill="' + fill + '">' + p.label + '</text>';
    }
  });

  o += '</svg>';

  // Légende HTML sous le SVG
  o += '<div class="graph-legend">'
    + '<span class="graph-legend-item"><span class="gl-line" style="background:#2d8a4e"></span>👥 Soutien public</span>'
    + '<span class="graph-legend-item"><span class="gl-line" style="background:#1a5fb4"></span>🏛️ Influence politique</span>'
    + '<span class="graph-legend-item"><span class="gl-line" style="background:#e0882a"></span>💶 Ressources</span>'
    + '<span class="graph-legend-item"><span class="gl-line gl-line-evt"></span>Événements</span>'
    + '</div>';

  return '<div class="score-graph-wrap">' + o + '</div>';
}

function buildActionsList() {
  if (!gameHistory.length) return '';

  var inner = '<div class="actions-recap">';
  gameHistory.forEach(function(entry) {
    if (entry.type === 'action') {
      inner += '<div class="recap-turn">';
      inner += '<div class="recap-turn-header">';
      inner += '<span class="recap-turn-num">Tour ' + entry.turnNumber + '</span>';
      inner += '<span class="recap-turn-phase">' + entry.phase + '</span>';
      inner += '</div>';
      inner += '<div class="recap-turn-action">' + entry.action + '</div>';
      inner += '<div class="recap-deltas">';
      inner += '<div class="recap-delta-row">';
      inner += '<span class="recap-delta-label">Votre action</span>';
      inner += '<span class="recap-delta-chips">' + buildDeltaChips(entry.effects) + '</span>';
      inner += '</div>';
      inner += '<div class="recap-delta-row">';
      inner += '<span class="recap-delta-label">Contre-offensive du lobby</span>';
      inner += '<span class="recap-delta-chips">' + buildDeltaChips(entry.counterEffects) + '</span>';
      inner += '</div>';
      inner += '</div>';
      inner += '</div>';
    } else if (entry.type === 'event') {
      inner += '<div class="recap-event">';
      inner += '<div class="recap-event-header">';
      inner += '<span class="recap-event-icon" aria-hidden="true">' + entry.icon + '</span>';
      inner += '<span class="recap-event-title">' + entry.title + '</span>';
      inner += '</div>';
      inner += '<div class="recap-delta-chips">' + buildDeltaChips(entry.effects) + '</div>';
      inner += '</div>';
    }
  });
  inner += '</div>';

  return '<button class="recap-accordion-btn" onclick="toggleRecapAccordion(this)" aria-expanded="false">'
    + '<span>Voir le détail tour par tour</span>'
    + '<span class="recap-accordion-arrow" aria-hidden="true">&#9660;</span>'
    + '</button>'
    + '<div class="recap-accordion-body" hidden>' + inner + '</div>';
}

function toggleRecapAccordion(btn) {
  var body = btn.nextElementSibling;
  var open = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', open ? 'false' : 'true');
  body.hidden = open;
  btn.querySelector('.recap-accordion-arrow').innerHTML = open ? '&#9660;' : '&#9650;';
}

function buildHintAccordion() {
  var body = '<div class="hint-accordion-body">'
    + '<p><strong>Les 3 premiers tours sont décisifs.</strong> Pour construire une stratégie solide, essayez les options suivantes :</p>'
    + '<ol class="hint-list">'
    + '<li><strong>Alliance avec des associations de santé :</strong> cela booste immédiatement le soutien public et crédibilise votre plaidoyer sur un terrain légitime.</li>'
    + '<li><strong>Audition en commission parlementaire :</strong> une audience directe avec les élus renforce votre influence politique au moment où le lobby n\'a pas encore contre-attaqué.</li>'
    + '<li><strong>Méta-analyse scientifique :</strong> un rapport indépendant consolide la crédibilité de vos arguments et rend les positions du lobby plus difficiles à défendre.</li>'
    + '</ol>'
    + '<p style="margin-bottom:0">Ces trois actions combinées établissent un avantage durable sur les deux indicateurs <strong>Soutien du public</strong> et <strong>Influence politique</strong> avant que le lobby des pesticides ne monte en puissance.</p>'
    + '</div>';
  return '<div class="hint-accordion-wrap">'
    + '<button class="hint-accordion-btn" onclick="toggleRecapAccordion(this)" aria-expanded="false">'
    + '<span>&#128161; Voir un indice avant de rejouer</span>'
    + '<span class="recap-accordion-arrow" aria-hidden="true">&#9660;</span>'
    + '</button>'
    + '<div class="recap-accordion-body hint-accordion-body" hidden>' + body + '</div>'
    + '</div>';
}

function buildScoresSummary() {
  return '<div class="summary-item"><div class="si-icon" aria-hidden="true">👥</div><div class="si-label">Soutien du public</div><div class="si-val">' + scores.public + '</div></div>' +
    '<div class="summary-item"><div class="si-icon" aria-hidden="true">🏛️</div><div class="si-label">Influence politique</div><div class="si-val">' + scores.political + '</div></div>' +
    '<div class="summary-item"><div class="si-icon" aria-hidden="true">💶</div><div class="si-label">Ressources</div><div class="si-val">' + scores.resources + '</div></div>';
}

/* ════════════════════════════════════════════
   ACCESSIBILITÉ : gestion clavier globale
════════════════════════════════════════════ */
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Escape') return;
  // Fermer le calendrier si ouvert
  const cal = document.getElementById('cal-overlay');
  if (cal && cal.classList.contains('open')) {
    closeCalendar();
    return;
  }
  // Fermer la push notification si visible
  const notif = document.getElementById('push-notification');
  if (notif && notif.classList.contains('show')) {
    closePushNotif();
    return;
  }
  // Fermer le panel actions si ouvert
  const panel = document.getElementById('actions-panel');
  if (panel && panel.classList.contains('open')) {
    closeStrategyPanel();
    closeActionsPanel();
  }
});

/* ════════════════════════════════════════════
   DEBUG : accès direct aux écrans de résultat
   ?lobby_win | ?partial_win | ?statu_quo | ?complete_win
   ?resourcesZero | ?publicZero | ?politicalZero
   ?result  → simule une partie complète aléatoire
════════════════════════════════════════════ */
(function() {
  var params = new URLSearchParams(window.location.search);
  var finalIds = ['lobby_win', 'partial_win', 'statu_quo', 'complete_win'];
  var endKeys  = { resourcesZero: 'resources', publicZero: 'public', politicalZero: 'political' };

  var finalId  = finalIds.find(function(id) { return params.has(id); });
  var endParam = Object.keys(endKeys).find(function(k) { return params.has(k); });

  /* ── Simulation aléatoire d'une partie complète ── */
  if (params.has('result')) {
    scores        = { ...GAME_DATA.initialScores };
    playedPhases  = [];
    playedActions = [];
    gameHistory   = [];

    var simEventOrder = shuffle(GAME_DATA.events.map(function(_, i) { return i; }));
    var simEventCount = 0;

    for (var turn = 0; turn < GAME_DATA.phases.length; turn++) {
      if (scores.public <= 0 || scores.political <= 0 || scores.resources <= 0) break;

      // Phases disponibles (hors déjà jouées et verrouillées)
      var available = GAME_DATA.phases
        .map(function(_, i) { return i; })
        .filter(function(i) {
          var lu = GAME_DATA.phases[i].lockedUntil;
          return !playedPhases.includes(i) && !(lu && playedPhases.length < lu);
        });
      if (!available.length) break;

      var phaseIndex = available[Math.floor(Math.random() * available.length)];
      var phase      = GAME_DATA.phases[phaseIndex];
      var band       = getTourBand(); // lu avant push dans playedPhases
      var actionIdx  = Math.floor(Math.random() * phase.actions.length);
      var action     = phase.actions[actionIdx];

      var effects        = action.effectsByTour        ? action.effectsByTour[band]        : (action.effects        || {});
      var counterEffects = action.counterEffectsByTour ? action.counterEffectsByTour[band] : (action.counterEffects || {});

      gameHistory.push({
        type: 'action',
        turnNumber: playedPhases.length + 1,
        phase: phase.title,
        action: action.label,
        effects: effects,
        counterEffects: counterEffects,
      });

      applyEffects(effects);
      applyEffects(counterEffects);
      playedPhases.push(phaseIndex);
      playedActions.push({ phase: phase.title, action: action.label });

      // Événement aléatoire tous les 2 tours (sauf après le dernier tour)
      if (playedPhases.length % 2 === 0 && playedPhases.length < GAME_DATA.phases.length) {
        var evtIdx = simEventOrder[simEventCount % simEventOrder.length];
        var evt    = GAME_DATA.events[evtIdx];
        simEventCount++;
        applyEffects(evt.effects);
        gameHistory.push({
          type: 'event',
          icon: evt.icon,
          title: evt.title,
          description: evt.description,
          effects: evt.effects,
        });
      }
    }

    _doShowFinalResult();
    return;
  }

  if (!finalId && !endParam) return;

  scores        = { ...GAME_DATA.initialScores, score: 0 };
  playedPhases  = [];
  playedActions = [];
  gameHistory   = [];

  if (finalId) {
    var scoreMap = { complete_win: 95, partial_win: 70, statu_quo: 35, lobby_win: 5 };
    scores.score = scoreMap[finalId];
    _doShowFinalResult();
  } else {
    _doShowEarlyEnd(endKeys[endParam]);
  }
})();
