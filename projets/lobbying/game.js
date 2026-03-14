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
let juridiqueLocked    = true;
let pendingAction      = null;
let pendingOption      = null;
let pendingCounterData = null;
let pendingInputText   = null;   // texte complet destiné au message joueur
let currentStep        = 'pick';
let typingRowEl        = null;
let pushTimer          = null;
let counterTimer       = null;

const MAX_SCORE   = 100;
const PHASE_ICONS = ['🤝','🏛️','🔬','📺','📣','📱','✊','🌾','⚖️','🇪🇺'];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function isLocked(i) {
  return !!(GAME_DATA.phases[i].locked && juridiqueLocked);
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
  scores             = { ...GAME_DATA.initialScores };
  playedPhases       = [];
  playedActions      = [];
  phaseOrder         = shuffle(GAME_DATA.phases.map((_, i) => i));
  eventOrder         = shuffle(GAME_DATA.events.map((_, i) => i));
  eventCount         = 0;
  juridiqueLocked    = true;
  pendingAction      = null;
  pendingOption      = null;
  pendingCounterData = null;
  pendingInputText   = null;
  currentStep        = 'pick';
  typingRowEl        = null;
  if (counterTimer) { clearTimeout(counterTimer); counterTimer = null; }
  if (pushTimer)    { clearTimeout(pushTimer); pushTimer = null; }

  document.getElementById('chat-messages').innerHTML = '';
  closeActionsOverlay();
  updateScoreboard();
  updateProgress();
  showScreen('screen-game');
  showDormantInput();
  showTyping();

  setTimeout(() => {
    hideTyping();
    addColleagueMessage(
      `Salut collègue\u00a0! Bienvenu chez ANTIDOTE\u00a0! ✊<br>Je suis <strong>Naomi</strong>, lobbyiste environnemental.`
    );
    setTimeout(() => {
      addPlayerMessage('Salut Naomi, merci !');
      showTyping();
      setTimeout(() => {
        addColleagueMessage(
          `Une proposition de loi vient d'être déposée pour <strong>réautoriser plusieurs pesticides dangereux</strong>.<br>
          Nous avons la possibilité de lancer <strong>10&nbsp;actions</strong> avant le vote final à l'Assemblée Nationale qui aura lieu dans quelques semaines.<br>
          Le lobby des pesticides est déjà à l'œuvre. On doit agir vite.`
        );
        hideTyping();
      }, 1200);
      setTimeout(() => askAction(), 2000);
    }, 1000);
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
    const val  = scores[key];
    const elV  = document.getElementById('score-' + key);
    const elB  = document.getElementById('bar-'   + key);
    const pill = document.getElementById('pill-'  + key);

    elV.textContent = val;
    const pct = Math.max(0, Math.min(100, (val / MAX_SCORE) * 100));
    elB.style.width = pct + '%';

    elB.classList.remove('danger','warning');
    pill.classList.remove('danger','warning');
    if (val <= 1)      { elB.classList.add('danger');  pill.classList.add('danger'); }
    else if (val <= 2) { elB.classList.add('warning'); pill.classList.add('warning'); }

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
  const label = document.getElementById('chp-label');
  if (bar)   bar.style.width = pct + '%';
  if (label) label.textContent = 'Action ' + played + ' / ' + total;
}

/* ════════════════════════════════════════════
   EFFETS
════════════════════════════════════════════ */
function applyEffects(effects) {
  scores.public    = Math.max(0, Math.min(MAX_SCORE, scores.public    + (effects.public    || 0)));
  scores.political = Math.max(0, Math.min(MAX_SCORE, scores.political + (effects.political || 0)));
  scores.resources = Math.max(0, Math.min(MAX_SCORE, scores.resources + (effects.resources || 0)));
}

function changedKeys(effects) {
  return Object.keys(effects).filter(k => effects[k] !== 0);
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
    el.style.top  = rect.top + 'px';
    document.body.appendChild(el);
    setTimeout(function() { if (el.parentNode) el.remove(); }, 1400);
  });
}

function buildDeltaChips(effects) {
  const labels = { public: '👥 Public', political: '🏛️ Politique', resources: '💶 Ressources' };
  const chips = Object.entries(effects)
    .filter(([, v]) => v !== 0)
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
  const sendBtn = document.getElementById('chat-send-btn');
  sendBtn.disabled = true;
  showInputArea();
  inputEl.innerHTML = '';

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
      sendBtn.disabled = false;
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
  document.getElementById('chat-pick-btn').style.display   = 'none';
  const inputEl = document.getElementById('chat-input-text');
  inputEl.style.display = 'block';
  inputEl.innerHTML     = '';
  const sendBtn = document.getElementById('chat-send-btn');
  sendBtn.style.display = 'flex';
  sendBtn.disabled      = true;
  scrollToBottom();
}

/* ── Mode picker : bouton "Voir les actions" dans la barre ── */
function showPickerBtn() {
  const area = document.getElementById('chat-input-area');
  area.style.display = 'flex';
  area.classList.remove('dormant');
  document.getElementById('chat-pick-btn').style.display   = 'flex';
  document.getElementById('chat-input-text').style.display = 'none';
  document.getElementById('chat-send-btn').style.display   = 'none';
  scrollToBottom();
}

/* ── Mode saisie : bulle texte + bouton Envoyer ── */
function showInputArea() {
  const area = document.getElementById('chat-input-area');
  area.style.display = 'flex';
  area.classList.remove('dormant');
  document.getElementById('chat-pick-btn').style.display   = 'none';
  document.getElementById('chat-input-text').style.display = 'block';
  document.getElementById('chat-send-btn').style.display   = 'flex';
  scrollToBottom();
}

function hideInputArea() {
  document.getElementById('chat-input-area').style.display = 'none';
  document.getElementById('chat-input-area').classList.remove('dormant');
  document.getElementById('chat-input-text').innerHTML     = '';
  document.getElementById('chat-send-btn').disabled        = true;
  document.getElementById('chat-pick-btn').style.display   = 'none';
}

/* ════════════════════════════════════════════
   OVERLAY GRILLE D'ACTIONS
════════════════════════════════════════════ */
function openActionsOverlay() {
  const overlay = document.getElementById('actions-overlay');
  const grid    = document.getElementById('ao-grid');
  document.getElementById('ao-title').textContent = 'Quelle action lances-tu ?';
  grid.innerHTML = '';

  const JURIDIQUE_INDEX = 8;
  const unplayed     = phaseOrder.filter(function(i) { return !playedPhases.includes(i) && i !== JURIDIQUE_INDEX; });
  const juridiqueArr = !playedPhases.includes(JURIDIQUE_INDEX) ? [JURIDIQUE_INDEX] : [];
  const displayOrder = playedPhases.concat(unplayed).concat(juridiqueArr);

  displayOrder.forEach(function(i) {
    const phase    = GAME_DATA.phases[i];
    const isPlayed = playedPhases.includes(i);
    const locked   = !isPlayed && isLocked(i);
    const icon     = PHASE_ICONS[i] || '🌿';

    const card = document.createElement('button');
    card.className = 'ao-card' + (isPlayed ? ' played' : '') + (locked ? ' locked' : '');
    card.disabled  = isPlayed || locked;

    let badge = '';
    if (isPlayed)    badge = '<span class="ao-card-played-badge">✓ Action ' + (playedPhases.indexOf(i) + 1) + '</span>';
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

  overlay.classList.add('open');
}

function closeActionsOverlay() {
  document.getElementById('actions-overlay').classList.remove('open');
}

function selectPhaseFromOverlay(phaseIndex) {
  closeActionsOverlay();
  pendingAction = { phaseIndex: phaseIndex };
  currentStep   = 'option';
  typewriterInput('Quelles sont les options pour : ' + GAME_DATA.phases[phaseIndex].title + ' ?', null);
}

/* ════════════════════════════════════════════
   BOUTON "ENVOYER À NAOMI"
════════════════════════════════════════════ */
function sendMessage() {
  if (currentStep === 'option') {
    sendPhaseChoice();
  } else if (currentStep === 'action') {
    sendActionChoice();
  }
}

function sendPhaseChoice() {
  const phaseIndex = pendingAction.phaseIndex;
  showDormantInput();
  addPlayerMessage('Quelles sont les options pour\u00a0' + PHASE_ICONS[phaseIndex] + ' ' + GAME_DATA.phases[phaseIndex].title + '\u00a0?');

  setTimeout(function() {
    showTyping();
    setTimeout(function() { hideTyping(); showOptions(phaseIndex); }, 1400);
  }, 300);
}

function showOptions(phaseIndex) {
  const phase       = GAME_DATA.phases[phaseIndex];
  const actionOrder = shuffle(phase.actions.map(function(_, i) { return i; }));
  pendingAction._actionOrder = actionOrder;

  let optionsHTML = '';
  actionOrder.forEach(function(origIdx, visIdx) {
    const a = phase.actions[origIdx];
    optionsHTML +=
      '<div class="option-card" data-orig="' + origIdx + '">' +
        '<div class="option-label">' +
          '<span class="option-num">' + (visIdx + 1) + '</span>' +
          a.label +
        '</div>' +
        '<div class="option-desc">' + a.description + '</div>' +
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
      openActionsOverlay();
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

  // Permettre l'envoi immédiatement sans attendre la fin de la frappe
  document.getElementById('chat-send-btn').disabled = false;
}

function sendActionChoice() {
  if (pendingOption === null) return;

  const phaseIndex = pendingAction.phaseIndex;
  const phase  = GAME_DATA.phases[phaseIndex];
  const action = phase.actions[pendingOption];

  // Utiliser le texte complet stocké (même si le typewriter n'est pas terminé)
  const inputText = (pendingInputText && pendingInputText.trim()) ? pendingInputText : action.label;
  pendingInputText = null;

  freezeOptionCards();
  showDormantInput();
  addPlayerMessage(inputText);

  playedActions.push({ phase: phase.title, action: action.label });
  playedPhases.push(phaseIndex);
  updateProgress();

  pendingCounterData = {
    counterAttack:  action.counterAttack,
    counterEffects: action.counterEffects
  };

  currentStep = 'result';

  setTimeout(function() {
    showTyping();
    setTimeout(function() { hideTyping(); showResult(action); }, 1600);
  }, 400);
}

/* ── Résultat - contre-attaque auto après 4s ── */
function showResult(action) {
  // Appliquer les effets au moment où le message de Naomi apparaît
  applyEffects(action.effects);
  updateScoreboard(changedKeys(action.effects));
  showScoreDelta(action.effects);

  addColleagueMessage(
    '<div class="result-scenario-text">Coucou ! Voici les résultats de l\'action lancée !<br>' + action.scenario + ' 👍🏾</div>' +
    '<div class="delta-row">' + buildDeltaChips(action.effects) + '</div>'
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

  if (playedPhases.length === 5 && juridiqueLocked) {
    setTimeout(function() { showUnlockMessage(); }, 600);
    return;
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
    'Quelle est ta <strong>prochaine action</strong>\u00a0? Il reste <strong>' + remaining + ' action' + s + '</strong> possible' + s + ' avant le vote final.',
    'Il nous reste <strong>' + remaining + ' action' + s + '</strong>. Quelle action lances-tu\u00a0?',
    'Ok, au suivant. <strong>' + remaining + ' action' + s + '</strong> restante' + s + '. Quelle est ta strat\u00e9gie\u00a0?',
  ];

  showTyping();
  setTimeout(() => {
    hideTyping();

    const text = (playedPhases.length === 0)
      ? 'Pour commencer, choisis ta <strong>première action</strong>.<br>Je te proposerai les options disponibles et tu décideras par où on attaque.'
      : msgs[Math.floor(Math.random() * msgs.length)];

    addColleagueMessage(text);
    showPickerBtn();
    scrollToBottom();
  }, 900);
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

  // Appliquer les effets au moment où la notification apparaît
  applyEffects(event.effects);
  updateScoreboard(changedKeys(event.effects));
  showScoreDelta(event.effects);

  const zeroKey = checkZero();

  notif.classList.add('show');

  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = null;

  notif._onClose = function() {
    document.body.classList.remove('notif-open');

    // Naomi commente l'outcome puis passe à la suite
    function afterOutcome() {
      if (zeroKey !== null) {
        setTimeout(function() { showEarlyEnd(zeroKey); }, 400);
      } else if (playedPhases.length === 5 && juridiqueLocked) {
        setTimeout(function() { showUnlockMessage(); }, 400);
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
   DÉBLOCAGE BATAILLE JURIDIQUE
════════════════════════════════════════════ */
function showUnlockMessage() {
  showTyping();
  setTimeout(function() {
    hideTyping();

    addColleagueMessage(
      '<strong>⚖️ La Bataille juridique est maintenant disponible\u00a0!</strong><br>' +
      'Le d\u00e9bat parlementaire commence, la voie judiciaire s\'ouvre 😉<br>' +
      'Tu peux d\u00e9sormais d\u00e9poser des recours, porter plainte et mobiliser des avocats pour faire pression par un autre canal.'
    );

    scrollToBottom();

    // Poursuite automatique après 5 secondes
    setTimeout(function() {
      juridiqueLocked = false;
      askAction();
    }, 5000);
  }, 900);
}

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
  const total = scores.public + scores.political + scores.resources;
  let result;
  if      (total >= 21) result = GAME_DATA.finalResults.find(function(r) { return r.id === 'complete_win'; });
  else if (total >= 15) result = GAME_DATA.finalResults.find(function(r) { return r.id === 'partial_win'; });
  else if (total >= 9)  result = GAME_DATA.finalResults.find(function(r) { return r.id === 'statu_quo'; });
  else                  result = GAME_DATA.finalResults.find(function(r) { return r.id === 'lobby_win'; });

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
