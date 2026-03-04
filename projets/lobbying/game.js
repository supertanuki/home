/* ── State ── */
let scores = {};
let currentPhaseIndex = 0;
let actionChosen = false;
let selectedActionIndex = null;
const MAX_SCORE = 10;

/* ── Init ── */
function startGame() {
  scores = { ...GAME_DATA.initialScores };
  currentPhaseIndex = 0;
  actionChosen = false;
  selectedActionIndex = null;
  showScreen('screen-game');
  renderPhase();
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

/* ── Progress bar ── */
function renderProgress() {
  const steps = document.getElementById('progress-steps');
  const label = document.getElementById('progress-label');
  steps.innerHTML = '';
  GAME_DATA.phases.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'step-dot' +
      (i < currentPhaseIndex ? ' done' : i === currentPhaseIndex ? ' current' : '');
    steps.appendChild(dot);
  });
  label.textContent = `Phase ${currentPhaseIndex + 1} sur ${GAME_DATA.phases.length}`;
}

/* ── Render current phase ── */
function renderPhase() {
  actionChosen = false;
  selectedActionIndex = null;
  const phase = GAME_DATA.phases[currentPhaseIndex];

  renderProgress();

  document.getElementById('phase-badge').textContent = `Phase ${phase.id} / ${GAME_DATA.phases.length}`;
  document.getElementById('phase-title').textContent = phase.title;
  document.getElementById('phase-desc').textContent = phase.description;

  const list = document.getElementById('actions-list');
  list.innerHTML = '';

  phase.actions.forEach((action, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'action-wrapper';

    const btn = document.createElement('button');
    btn.className = 'action-btn';
    btn.dataset.index = i;
    btn.innerHTML = `
      <span class="action-num">${i + 1}</span>
      <span class="action-label-text">${action.label}</span>
    `;
    btn.onclick = () => selectAction(i);

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

  // Hide result card
  const rc = document.getElementById('result-card');
  rc.classList.remove('visible');
  rc.style.display = 'none';

  updateScoreboard();
}

/* ── Select an action (no execution yet) ── */
function selectAction(actionIndex) {
  if (actionChosen) return;
  selectedActionIndex = actionIndex;

  // Update button visual states
  document.querySelectorAll('.action-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i === actionIndex);
  });

  // Show description only for selected
  document.querySelectorAll('.action-description').forEach((desc, i) => {
    desc.classList.toggle('open', i === actionIndex);
  });

  // Enable validate button
  const validateBtn = document.getElementById('btn-validate');
  if (validateBtn) validateBtn.disabled = false;
}

/* ── Confirm and execute chosen action ── */
function confirmAction() {
  if (selectedActionIndex === null || actionChosen) return;
  actionChosen = true;

  // Lock all buttons
  document.querySelectorAll('.action-btn').forEach(b => b.disabled = true);
  const validateBtn = document.getElementById('btn-validate');
  if (validateBtn) validateBtn.disabled = true;

  const phase  = GAME_DATA.phases[currentPhaseIndex];
  const action = phase.actions[selectedActionIndex];

  // Apply effects
  applyEffects(action.effects);
  const effectKeys = changedKeys(action.effects);
  updateScoreboard(effectKeys);

  // Show result card
  const rc = document.getElementById('result-card');
  rc.style.display = 'block';
  rc.classList.add('visible');

  // Scroll to result
  setTimeout(() => rc.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);

  document.getElementById('result-scenario').textContent = action.scenario;
  document.getElementById('delta-effects').innerHTML = buildDeltaChips(action.effects);

  const banner   = document.getElementById('counter-banner');
  const nextWrap = document.getElementById('next-wrap');
  banner.classList.remove('visible');
  nextWrap.classList.remove('visible');

  setTimeout(() => {
    document.getElementById('counter-text').textContent = action.counterAttack;
    document.getElementById('delta-counter').innerHTML  = buildDeltaChips(action.counterEffects);
    banner.classList.add('visible');

    applyEffects(action.counterEffects);
    const counterKeys = changedKeys(action.counterEffects);
    updateScoreboard(counterKeys);

    const zeroKey = checkZero();
    if (zeroKey !== null) {
      setTimeout(() => showEarlyEnd(zeroKey), 900);
      return;
    }

    setTimeout(() => {
      nextWrap.classList.add('visible');
      const isLast = currentPhaseIndex === GAME_DATA.phases.length - 1;
      document.getElementById('btn-next').textContent = isLast ? '🗳️ Voir le résultat final' : 'Phase suivante →';
    }, 600);

  }, 2000);
}

/* ── Apply effects to scores ── */
function applyEffects(effects) {
  scores.public    = Math.max(0, scores.public    + (effects.public    || 0));
  scores.political = Math.max(0, scores.political + (effects.political || 0));
  scores.resources = Math.max(0, scores.resources + (effects.resources || 0));
}

/* ── Get keys that changed ── */
function changedKeys(effects) {
  return Object.keys(effects).filter(k => effects[k] !== 0);
}

/* ── Build delta chips HTML ── */
function buildDeltaChips(effects) {
  const labels = { public: '🌍 Soutien', political: '🏛️ Influence', resources: '💰 Ressources' };
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
  currentPhaseIndex++;
  if (currentPhaseIndex >= GAME_DATA.phases.length) {
    showFinalResult();
  } else {
    renderPhase();
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  }
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

  window.scrollTo({ top: 0 });
  setTimeout(() => showScreen('screen-end'), 50);
}

/* ── Final result screen ── */
function showFinalResult() {
  let result;

  if (scores.public >= 3 && scores.political >= 3 && scores.resources >= 3) {
    result = GAME_DATA.finalResults.find(r => r.id === 'partial');
  } else if (scores.public >= 2 && scores.political >= 2 && scores.resources >= 2) {
    result = GAME_DATA.finalResults.find(r => r.id === 'national');
  } else if (scores.public >= 1 && scores.political >= 1 && scores.resources >= 1) {
    result = GAME_DATA.finalResults.find(r => r.id === 'symbolic');
  } else {
    result = GAME_DATA.finalResults.find(r => r.id === 'failure');
  }

  const icons = { failure: '❌', symbolic: '🥈', national: '🏅', partial: '🏆' };
  const badgeClasses = {
    failure:  'badge-failure',
    symbolic: 'badge-symbolic',
    national: 'badge-national',
    partial:  'badge-partial'
  };

  document.getElementById('result-icon').textContent        = icons[result.id];
  document.getElementById('result-badge-span').textContent  = result.title;
  document.getElementById('result-badge-span').className    = badgeClasses[result.id];
  document.getElementById('result-title').textContent       = result.title;
  document.getElementById('result-description').textContent = result.description;
  document.getElementById('result-conclusion').textContent  = result.conclusion;
  document.getElementById('result-cta').textContent         = result.cta;
  document.getElementById('result-scores').innerHTML        = buildScoresSummary();

  window.scrollTo({ top: 0 });
  setTimeout(() => showScreen('screen-result'), 50);
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

/* ── Toast notification ── */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
