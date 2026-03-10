/* ── State ── */
let scores = {};
let currentPhaseIndex = -1;
let actionChosen = false;
let selectedActionIndex = null;
let playedPhases   = []; // tableau ordonné des index de phases jouées
let playedActions  = []; // tableau ordonné des actions jouées { phase, action }
let phaseOrder     = []; // ordre d'affichage aléatoire des phases dans le picker
let eventOrder     = []; // ordre aléatoire des événements
let eventCount     = 0;  // nombre d'événements déjà affichés
let juridiqueLocked = true; // débloqué manuellement via la notification au tour 5
const MAX_SCORE = 10;

/* ── Fisher-Yates shuffle ── */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ── Retourne vrai si une phase est verrouillée ── */
function isLocked(phaseIndex) {
  const phase = GAME_DATA.phases[phaseIndex];
  if (!phase.locked) return false;
  // Pour les phases avec locked:true, on utilise le flag explicite
  return juridiqueLocked;
}

/* ── Init ── */
function startGame() {
  scores = { ...GAME_DATA.initialScores };
  currentPhaseIndex = -1;
  actionChosen = false;
  selectedActionIndex = null;
  playedPhases  = [];
  playedActions = [];
  phaseOrder    = shuffle(GAME_DATA.phases.map((_, i) => i));
  eventOrder   = shuffle(GAME_DATA.events.map((_, i) => i));
  eventCount   = 0;
  juridiqueLocked = true;
  hideEventCard();
  document.getElementById('unlock-card-section').style.display = 'none';
  restoreGameContent(); // s'assure que tous les éléments sont visibles (reset après game over sur événement)
  showScreen('screen-game');
  renderPhasePicker();
  renderProgress();
  showPhasePlaceholder();
}

function restartGame() {
  startGame();
}

/* ── Screen management ── */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/* ── Score update ── */
function updateScoreboard(animateIds) {
  const keys = ['public', 'political', 'resources'];
  keys.forEach(key => {
    const val = scores[key];
    const el  = document.getElementById('score-' + key);
    const bar = document.getElementById('bar-' + key);

    el.textContent = val;
    const pct = Math.max(0, Math.min(100, (val / MAX_SCORE) * 100));
    bar.style.width = pct + '%';

    bar.classList.remove('danger', 'warning');
    if (val <= 1) bar.classList.add('danger');
    else if (val <= 2) bar.classList.add('warning');

    if (animateIds && animateIds.includes(key)) {
      el.style.transition = 'none';
      el.style.color = '#f5c842';
      setTimeout(() => { el.style.color = ''; el.style.transition = 'color .5s'; }, 600);
    }
  });
}

/* ── Phase picker ── */
function renderPhasePicker() {
  const picker = document.getElementById('phase-picker');
  picker.innerHTML = '';

  // Unplayed phases dans l'ordre aléatoire, mais "Bataille juridique" (index 8) toujours en dernier
  const JURIDIQUE_INDEX = 8;
  const unplayed = phaseOrder.filter(i => !playedPhases.includes(i) && i !== JURIDIQUE_INDEX);
  const juridiqueUnplayed = !playedPhases.includes(JURIDIQUE_INDEX) ? [JURIDIQUE_INDEX] : [];
  const displayOrder = [...playedPhases, ...unplayed, ...juridiqueUnplayed];

  displayOrder.forEach(i => {
    const phase     = GAME_DATA.phases[i];
    const isPlayed  = playedPhases.includes(i);
    const isActive  = i === currentPhaseIndex;
    const locked    = !isPlayed && isLocked(i);
    const playOrder = isPlayed ? playedPhases.indexOf(i) + 1 : null;

    const btn = document.createElement('button');
    btn.className = 'phase-pick-btn' +
      (isActive  ? ' active'  : '') +
      (isPlayed  ? ' played'  : '') +
      (locked    ? ' locked'  : '');
    btn.disabled = isPlayed || locked;

    const numContent = isPlayed ? playOrder : (locked ? '🔒' : '');
    const lockLabel  = locked ? `<span class="ppb-lock-msg">${phase.lockedMessage || 'Verrouillé'}</span>` : '';

    btn.innerHTML = `
      <span class="ppb-num">${numContent}</span>
      <span class="ppb-title">${phase.title}</span>
      ${lockLabel}
    `;
    btn.title = locked ? (phase.lockedMessage || 'Verrouillé') : phase.title;

    if (!isPlayed && !locked) {
      btn.onclick = () => goToPhase(i);
    }
    picker.appendChild(btn);
  });
}

function goToPhase(i) {
  if (playedPhases.includes(i) || isLocked(i)) return;
  currentPhaseIndex = i;
  renderPhase();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Phase placeholder ── */
function showPhasePlaceholder() {
  document.getElementById('phase-badge').textContent = '';
  document.getElementById('phase-title').textContent = 'Choisissez votre premier champ d\'action';
  document.getElementById('phase-desc').textContent  = 'Sélectionnez un champ d\'action ci-dessus pour lancer la campagne d\'ANTIDOTE.';
  document.getElementById('actions-list').innerHTML  = '';
  const rc = document.getElementById('result-card');
  rc.classList.remove('visible');
  rc.style.display = 'none';
  updateScoreboard();
}

/* ── Progress bar ── */
function renderProgress() {
  const steps = document.getElementById('progress-steps');
  const label = document.getElementById('progress-label');
  const total  = GAME_DATA.phases.length;
  const played = playedPhases.length;
  const hasActive = currentPhaseIndex >= 0;

  steps.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    if (i < played) {
      dot.className = 'step-dot done';
    } else if (i === played && hasActive) {
      dot.className = 'step-dot current';
    } else {
      dot.className = 'step-dot';
    }
    steps.appendChild(dot);
  }

  const phaseLabels = [
    'Dépôt de la loi', 'Dépôt de la loi',
    'Débat public', 'Débat public',
    'Commission parlementaire', 'Commission parlementaire',
    'Débat parlementaire', 'Débat parlementaire',
    'Vote final', 'Vote final'
  ];
  const currentStep = Math.min(played, total - 1);
  const stepName = phaseLabels[currentStep] || '';
  label.textContent = `Tour ${played} / ${total} - ${stepName}`;
}

/* ── Render current phase ── */
function renderPhase() {
  actionChosen = false;
  selectedActionIndex = null;
  const phase = GAME_DATA.phases[currentPhaseIndex];

  renderProgress();
  renderPhasePicker();

  const currentRank = playedPhases.length + 1;
  document.getElementById('phase-badge').textContent = `Tour ${currentRank} / ${GAME_DATA.phases.length}`;
  document.getElementById('phase-title').textContent = phase.title;
  document.getElementById('phase-desc').textContent  = phase.description;

  const list = document.getElementById('actions-list');
  list.innerHTML = '';

  const actionOrder = shuffle(phase.actions.map((_, i) => i));

  actionOrder.forEach((originalIdx, visualIdx) => {
    const action = phase.actions[originalIdx];
    const wrapper = document.createElement('div');
    wrapper.className = 'action-wrapper';

    const btn = document.createElement('button');
    btn.className = 'action-btn';
    btn.dataset.index = originalIdx;
    btn.innerHTML = `
      <span class="action-num">${visualIdx + 1}</span>
      <span class="action-label-text">${action.label}</span>
    `;
    btn.onclick = () => selectAction(visualIdx, originalIdx);

    const desc = document.createElement('div');
    desc.className = 'action-description';
    desc.textContent = action.description || '';

    wrapper.appendChild(btn);
    wrapper.appendChild(desc);
    list.appendChild(wrapper);
  });

  // Validate button
  const validateWrap = document.createElement('div');
  validateWrap.className = 'validate-wrap';

  const validateBtn = document.createElement('button');
  validateBtn.className = 'btn btn-validate';
  validateBtn.id = 'btn-validate';
  validateBtn.disabled = true;
  validateBtn.textContent = 'Valider l\'action choisie';
  validateBtn.onclick = confirmAction;

  validateWrap.appendChild(validateBtn);
  list.appendChild(validateWrap);

  const rc = document.getElementById('result-card');
  rc.classList.remove('visible');
  rc.style.display = 'none';

  updateScoreboard();
}

/* ── Select an action ── */
function selectAction(visualIdx, originalIdx) {
  if (actionChosen) return;
  selectedActionIndex = originalIdx;

  document.querySelectorAll('.action-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i === visualIdx);
  });

  document.querySelectorAll('.action-description').forEach((desc, i) => {
    desc.classList.toggle('open', i === visualIdx);
  });

  const validateBtn = document.getElementById('btn-validate');
  if (validateBtn) validateBtn.disabled = false;
}

/* ── Confirm and execute chosen action ── */
function confirmAction() {
  if (selectedActionIndex === null || actionChosen) return;
  actionChosen = true;

  document.querySelectorAll('.action-btn').forEach(b => b.disabled = true);
  const validateBtn = document.getElementById('btn-validate');
  if (validateBtn) validateBtn.disabled = true;

  const phase  = GAME_DATA.phases[currentPhaseIndex];
  const action = phase.actions[selectedActionIndex];

  // Enregistrer l'action jouée
  playedActions.push({ phase: phase.title, action: action.label });

  applyEffects(action.effects);
  const effectKeys = changedKeys(action.effects);
  updateScoreboard(effectKeys);

  const rc = document.getElementById('result-card');
  rc.style.display = 'block';
  rc.classList.add('visible');

  setTimeout(() => rc.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);

  document.getElementById('result-scenario').textContent = action.scenario;
  document.getElementById('delta-effects').innerHTML = buildDeltaChips(action.effects);

  const banner   = document.getElementById('counter-banner');
  const nextWrap = document.getElementById('next-wrap');
  banner.classList.remove('visible');
  nextWrap.classList.remove('visible');

  setTimeout(() => {
    const counterText = document.getElementById('counter-text');
    counterText.textContent = action.counterAttack;
    document.getElementById('delta-counter').innerHTML = buildDeltaChips(action.counterEffects);
    banner.classList.add('visible');

    applyEffects(action.counterEffects);
    const counterKeys = changedKeys(action.counterEffects);
    updateScoreboard(counterKeys);

    // Mark phase as played
    playedPhases.push(currentPhaseIndex);
    renderPhasePicker();
    renderProgress();

    const zeroKey = checkZero();

    counterText.scrollIntoView({ behavior: 'smooth', block: 'start' });

    setTimeout(() => {
      nextWrap.classList.add('visible');
      const btnNext = document.getElementById('btn-next');
      // Un événement se déclenche tous les 2 tours (tours 2, 4, 6, 8)
      const shouldEvent = playedPhases.length % 2 === 0 && playedPhases.length < GAME_DATA.phases.length;
      if (zeroKey !== null) {
        btnNext.textContent = 'Voir le résultat';
        btnNext.onclick = () => showEarlyEnd(zeroKey);
      } else if (playedPhases.length >= GAME_DATA.phases.length) {
        btnNext.textContent = 'Voir le résultat final →';
        btnNext.onclick = nextPhase;
      } else if (shouldEvent) {
        btnNext.textContent = 'Suivant →';
        btnNext.onclick = triggerEvent;
      } else {
        btnNext.textContent = 'Choisir le prochain champ d\'action →';
        btnNext.onclick = nextPhase;
      }
    }, 1000);

  }, 2000);
}

/* ── Apply effects to scores ── */
function applyEffects(effects) {
  scores.public    = Math.max(0, Math.min(MAX_SCORE, scores.public    + (effects.public    || 0)));
  scores.political = Math.max(0, Math.min(MAX_SCORE, scores.political + (effects.political || 0)));
  scores.resources = Math.max(0, Math.min(MAX_SCORE, scores.resources + (effects.resources || 0)));
}

/* ── Get keys that changed ── */
function changedKeys(effects) {
  return Object.keys(effects).filter(k => effects[k] !== 0);
}

/* ── Build delta chips HTML ── */
function buildDeltaChips(effects) {
  const labels = {
    public:    '🌍 Soutien public',
    political: '🏛️ Influence politique',
    resources: '💰 Ressources'
  };
  return Object.entries(effects).filter(([, v]) => v !== 0).map(([k, v]) => {
    const cls  = v > 0 ? 'pos' : 'neg';
    const sign = v > 0 ? '+' : '';
    return `<span class="delta-chip ${cls}">${labels[k]} ${sign}${v}</span>`;
  }).join('') || '<span class="delta-chip zero">Aucun effet chiffré</span>';
}

/* ── Check if any score = 0 ── */
function checkZero() {
  if (scores.public    <= 0) return 'public';
  if (scores.political <= 0) return 'political';
  if (scores.resources <= 0) return 'resources';
  return null;
}

/* ── Next phase or final result ── */
function nextPhase() {
  if (playedPhases.length >= GAME_DATA.phases.length) {
    showFinalResult();
    return;
  }
  // Après 5 tours joués (= début du tour 6) → afficher le déblocage de la Bataille juridique
  if (playedPhases.length === 5 && juridiqueLocked) {
    hideGameContent();
    showUnlockCard();
    return;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const rc = document.getElementById('result-card');
  rc.classList.remove('visible');
  rc.style.display = 'none';
  currentPhaseIndex = -1;
  document.getElementById('phase-badge').textContent = '';
  document.getElementById('phase-title').textContent = 'Choisissez votre prochain champ d\'action';
  document.getElementById('phase-desc').textContent  = 'Sélectionnez un champ d\'action ci-dessus pour continuer la campagne.';
  document.getElementById('actions-list').innerHTML  = '';
  renderPhasePicker();
  renderProgress();
}

/* ── Early end screen ── */
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

  window.scrollTo({ top: 0 });
  setTimeout(() => showScreen('screen-end'), 50);
}

/* ── Final result screen ── */
function showFinalResult() {
  const total = scores.public + scores.political + scores.resources;
  let result;

  if (total >= 21) {
    result = GAME_DATA.finalResults.find(r => r.id === 'complete_win');
  } else if (total >= 15) {
    result = GAME_DATA.finalResults.find(r => r.id === 'partial_win');
  } else if (total >= 9) {
    result = GAME_DATA.finalResults.find(r => r.id === 'statu_quo');
  } else {
    result = GAME_DATA.finalResults.find(r => r.id === 'lobby_win');
  }

  document.getElementById('result-icon').textContent        = result.icon;
  document.getElementById('result-badge-span').textContent  = result.title;
  document.getElementById('result-badge-span').className    = result.badgeClass;
  document.getElementById('result-title').textContent       = result.title;
  document.getElementById('result-description').textContent = result.description;
  document.getElementById('result-conclusion').textContent  = result.conclusion;
  document.getElementById('result-cta').textContent         = result.cta;
  document.getElementById('result-scores').innerHTML        = buildScoresSummary();
  document.getElementById('result-actions').innerHTML       = buildActionsList();

  window.scrollTo({ top: 0 });
  setTimeout(() => showScreen('screen-result'), 50);
}

/* ── Build played actions list HTML ── */
function buildActionsList() {
  if (!playedActions.length) return '<p style="opacity:.7;font-size:.85rem;">Aucune action jouée.</p>';
  return '<ol class="actions-recap-list">' +
    playedActions.map((a, i) =>
      `<li><span class="ar-phase">${a.phase}</span> — ${a.action}</li>`
    ).join('') +
    '</ol>';
}

/* ── Build scores summary HTML ── */
function buildScoresSummary() {
  return `
    <div class="summary-item">
      <div class="si-icon">🌍</div>
      <div class="si-label">Soutien du Public</div>
      <div class="si-val">${scores.public}</div>
    </div>
    <div class="summary-item">
      <div class="si-icon">🏛️</div>
      <div class="si-label">Influence Politique</div>
      <div class="si-val">${scores.political}</div>
    </div>
    <div class="summary-item">
      <div class="si-icon">💰</div>
      <div class="si-label">Ressources</div>
      <div class="si-val">${scores.resources}</div>
    </div>
  `;
}

/* ── Masquer / restaurer le contenu de jeu autour de l'événement ── */
function hideGameContent() {
  document.getElementById('phase-picker').style.display  = 'none';
  document.getElementById('progress-steps').style.display = 'none';
  document.getElementById('progress-label').style.display = 'none';
  document.getElementById('phase-card').style.display    = 'none';
  const rc = document.getElementById('result-card');
  rc.classList.remove('visible');
  rc.style.display = 'none';
}

function restoreGameContent() {
  document.getElementById('phase-picker').style.display  = '';
  document.getElementById('progress-steps').style.display = '';
  document.getElementById('progress-label').style.display = '';
  document.getElementById('phase-card').style.display    = '';
}

function hideEventCard() {
  const ec = document.getElementById('event-card-section');
  if (ec) ec.style.display = 'none';
}

/* ── Déclencher un événement ── */
function triggerEvent() {
  // Masquer tout le contenu de jeu
  hideGameContent();

  // Sélectionner l'événement suivant dans l'ordre aléatoire
  const idx   = eventOrder[eventCount % eventOrder.length];
  const event = GAME_DATA.events[idx];
  eventCount++;

  // Appliquer les effets
  applyEffects(event.effects);
  updateScoreboard(changedKeys(event.effects));

  // Remplir la carte événement
  document.getElementById('event-icon-big').textContent    = event.icon;
  document.getElementById('event-title').textContent       = event.title;
  document.getElementById('event-description').textContent = event.description;
  document.getElementById('event-outcome').textContent     = event.outcome;
  document.getElementById('event-effects-row').innerHTML   = buildDeltaChips(event.effects);

  // Afficher la carte événement
  const ec = document.getElementById('event-card-section');
  ec.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Vérifier si un score est tombé à 0 après l'événement
  const zeroKey = checkZero();
  const btn = ec.querySelector('button');
  if (zeroKey !== null && btn) {
    btn.textContent = 'Voir le résultat';
    btn.onclick = () => showEarlyEnd(zeroKey);
  } else if (btn) {
    btn.textContent = 'Choisir le prochain champ d\'action →';
    btn.onclick = continueAfterEvent;
  }
}

/* ── Continuer après un événement ── */
function continueAfterEvent() {
  hideEventCard();
  restoreGameContent();
  nextPhase();
}

/* ── Afficher la carte de déblocage ── */
function showUnlockCard() {
  document.getElementById('unlock-card-section').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Continuer après le déblocage ── */
function continueAfterUnlock() {
  document.getElementById('unlock-card-section').style.display = 'none';
  juridiqueLocked = false; // débloquer la Bataille juridique dans le picker
  restoreGameContent();
  nextPhase();
}

/* ── Toast notification ── */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
