// ml_expert.js - Q-learning interactive lab

console.log('ML expert module loaded');

// =============================================
// Q-learning interactive lab
// =============================================
const qLearningState = {
    canvas: null,
    ctx: null,
    gridW: 6,
    gridH: 4,
    start: 18,
    goal: 5,
    blocks: new Set([8, 9, 15]),
    q: [],
    alpha: 0.2,
    gamma: 0.95,
    epsilon: 0.2,
    agent: 18,
    running: false,
    timer: null,
    episodeReward: 0,
    episodeLength: 0,
    episodes: 0,
    bestQ: 0,
    lastTd: 0
};

function qIndexToXY(index, w) {
    return { x: index % w, y: Math.floor(index / w) };
}

function qXYToIndex(x, y, w) {
    return y * w + x;
}

function initQTable() {
    const n = qLearningState.gridW * qLearningState.gridH;
    qLearningState.q = Array.from({ length: n }, () => [0, 0, 0, 0]);
    qLearningState.agent = qLearningState.start;
    qLearningState.episodeReward = 0;
    qLearningState.episodeLength = 0;
    qLearningState.lastTd = 0;
}

function qActionDelta(action) {
    if (action === 0) return { dx: 0, dy: -1 }; // up
    if (action === 1) return { dx: 1, dy: 0 };  // right
    if (action === 2) return { dx: 0, dy: 1 };  // down
    return { dx: -1, dy: 0 };                   // left
}

function qBestAction(stateIndex) {
    const row = qLearningState.q[stateIndex];
    let best = 0;
    for (let i = 1; i < row.length; i += 1) {
        if (row[i] > row[best]) best = i;
    }
    return best;
}

function qMax(row) {
    return Math.max(row[0], row[1], row[2], row[3]);
}

function qChooseAction(stateIndex) {
    if (Math.random() < qLearningState.epsilon) {
        return Math.floor(Math.random() * 4);
    }
    return qBestAction(stateIndex);
}

function qTransition(stateIndex, action) {
    const { x, y } = qIndexToXY(stateIndex, qLearningState.gridW);
    const { dx, dy } = qActionDelta(action);

    const nx = x + dx;
    const ny = y + dy;

    if (nx < 0 || ny < 0 || nx >= qLearningState.gridW || ny >= qLearningState.gridH) {
        return { next: stateIndex, reward: -0.35, terminal: false };
    }

    const nextIndex = qXYToIndex(nx, ny, qLearningState.gridW);

    if (qLearningState.blocks.has(nextIndex)) {
        return { next: stateIndex, reward: -0.65, terminal: false };
    }

    if (nextIndex === qLearningState.goal) {
        return { next: nextIndex, reward: 1, terminal: true };
    }

    return { next: nextIndex, reward: -0.04, terminal: false };
}

function qStepUpdate() {
    const s = qLearningState;
    const state = s.agent;
    const action = qChooseAction(state);
    const trans = qTransition(state, action);

    const oldQ = s.q[state][action];
    const target = trans.reward + s.gamma * qMax(s.q[trans.next]) * (trans.terminal ? 0 : 1);
    const td = target - oldQ;

    s.q[state][action] = oldQ + s.alpha * td;
    s.lastTd = td;
    s.bestQ = Math.max(s.bestQ, s.q[state][action]);
    s.agent = trans.next;
    s.episodeReward += trans.reward;
    s.episodeLength += 1;

    if (trans.terminal || s.episodeLength > 80) {
        s.episodes += 1;
        s.agent = s.start;
        s.episodeReward = 0;
        s.episodeLength = 0;
    }
}

function qCellColor(index) {
    if (index === qLearningState.goal) return '#16a34a';
    if (index === qLearningState.start) return '#1d4ed8';
    if (qLearningState.blocks.has(index)) return '#0f172a';

    const qv = qMax(qLearningState.q[index]);
    const clamped = Math.max(-1, Math.min(1, qv));
    if (clamped >= 0) {
        const g = Math.floor(200 + 40 * clamped);
        return `rgb(16, ${g}, 129)`;
    }
    const r = Math.floor(180 + 70 * Math.abs(clamped));
    return `rgb(${r}, 110, 120)`;
}

function drawPolicyArrow(ctx, centerX, centerY, size, action, color) {
    const d = size * 0.27;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;

    const dir = qActionDelta(action);
    const tx = centerX + dir.dx * d;
    const ty = centerY + dir.dy * d;

    ctx.beginPath();
    ctx.moveTo(centerX - dir.dx * d * 0.4, centerY - dir.dy * d * 0.4);
    ctx.lineTo(tx, ty);
    ctx.stroke();

    const angle = Math.atan2(dir.dy, dir.dx);
    const h = 5;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx - h * Math.cos(angle - Math.PI / 6), ty - h * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(tx - h * Math.cos(angle + Math.PI / 6), ty - h * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
}

function drawQLearning() {
    const s = qLearningState;
    if (!s.canvas || !s.ctx) return;

    const ctx = s.ctx;
    const w = s.canvas.width;
    const h = s.canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const margin = 16;
    const cell = Math.min((w - margin * 2) / s.gridW, (h - margin * 2) / s.gridH);
    const ox = (w - cell * s.gridW) / 2;
    const oy = (h - cell * s.gridH) / 2;

    for (let y = 0; y < s.gridH; y += 1) {
        for (let x = 0; x < s.gridW; x += 1) {
            const idx = qXYToIndex(x, y, s.gridW);
            const px = ox + x * cell;
            const py = oy + y * cell;

            ctx.fillStyle = qCellColor(idx);
            ctx.fillRect(px + 1, py + 1, cell - 2, cell - 2);

            ctx.strokeStyle = 'rgba(148,163,184,0.35)';
            ctx.lineWidth = 1;
            ctx.strokeRect(px + 1, py + 1, cell - 2, cell - 2);

            if (!s.blocks.has(idx) && idx !== s.goal) {
                const action = qBestAction(idx);
                drawPolicyArrow(ctx, px + cell / 2, py + cell / 2, cell, action, 'rgba(226,232,240,0.9)');
            }

            if (idx === s.start) {
                ctx.fillStyle = '#bfdbfe';
                ctx.font = 'bold 11px Arial';
                ctx.fillText('S', px + 6, py + 14);
            }

            if (idx === s.goal) {
                ctx.fillStyle = '#dcfce7';
                ctx.font = 'bold 11px Arial';
                ctx.fillText('G', px + 6, py + 14);
            }
        }
    }

    const agentXY = qIndexToXY(s.agent, s.gridW);
    const ax = ox + agentXY.x * cell + cell / 2;
    const ay = oy + agentXY.y * cell + cell / 2;

    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(ax, ay, Math.max(6, cell * 0.16), 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 2;
    ctx.stroke();

    const episodeEl = document.getElementById('qlEpisode');
    const tdEl = document.getElementById('qlTd');
    const bestQEl = document.getElementById('qlBestQ');

    if (episodeEl) episodeEl.innerText = String(s.episodes);
    if (tdEl) tdEl.innerText = s.lastTd.toFixed(3);
    if (bestQEl) bestQEl.innerText = s.bestQ.toFixed(3);
}

function bindQLearningControls() {
    const alpha = document.getElementById('qlAlpha');
    const gamma = document.getElementById('qlGamma');
    const epsilon = document.getElementById('qlEpsilon');

    const alphaVal = document.getElementById('qlAlphaVal');
    const gammaVal = document.getElementById('qlGammaVal');
    const epsilonVal = document.getElementById('qlEpsilonVal');

    if (alpha) {
        alpha.value = String(qLearningState.alpha);
        alpha.oninput = (event) => {
            qLearningState.alpha = parseFloat(event.target.value);
            if (alphaVal) alphaVal.innerText = qLearningState.alpha.toFixed(2);
        };
        if (alphaVal) alphaVal.innerText = qLearningState.alpha.toFixed(2);
    }

    if (gamma) {
        gamma.value = String(qLearningState.gamma);
        gamma.oninput = (event) => {
            qLearningState.gamma = parseFloat(event.target.value);
            if (gammaVal) gammaVal.innerText = qLearningState.gamma.toFixed(2);
        };
        if (gammaVal) gammaVal.innerText = qLearningState.gamma.toFixed(2);
    }

    if (epsilon) {
        epsilon.value = String(qLearningState.epsilon);
        epsilon.oninput = (event) => {
            qLearningState.epsilon = parseFloat(event.target.value);
            if (epsilonVal) epsilonVal.innerText = qLearningState.epsilon.toFixed(2);
        };
        if (epsilonVal) epsilonVal.innerText = qLearningState.epsilon.toFixed(2);
    }
}

window.qLearningStep = function () {
    qStepUpdate();
    drawQLearning();
};

window.qLearningStart = function () {
    if (qLearningState.running) return;
    qLearningState.running = true;

    qLearningState.timer = setInterval(() => {
        const canvas = qLearningState.canvas;
        if (!canvas || !canvas.isConnected) {
            window.qLearningPause();
            return;
        }

        for (let i = 0; i < 5; i += 1) {
            qStepUpdate();
        }
        drawQLearning();
    }, 60);
};

window.qLearningPause = function () {
    qLearningState.running = false;
    if (qLearningState.timer) {
        clearInterval(qLearningState.timer);
        qLearningState.timer = null;
    }
};

window.qLearningReset = function () {
    window.qLearningPause();
    initQTable();
    qLearningState.episodes = 0;
    qLearningState.bestQ = 0;
    drawQLearning();
};

window.initQLearningLab = function () {
    window.qLearningPause();

    qLearningState.canvas = document.getElementById('qLearningCanvas');
    if (!qLearningState.canvas) return;

    qLearningState.ctx = qLearningState.canvas.getContext('2d');
    bindQLearningControls();
    initQTable();
    drawQLearning();
};

// =============================================
// Coverage global hub (search + filters)
// =============================================
window.initCoverageGlobalHub = function () {
    const root = document.querySelector('[data-coverage-hub="1"]');
    if (!root) return;

    const searchInput = root.querySelector('#coverageSearch');
    const visibleCounter = root.querySelector('#coverageVisibleCount');
    const topics = Array.from(root.querySelectorAll('.coverage-topic'));
    const scopeButtons = Array.from(root.querySelectorAll('.coverage-scope-btn'));
    if (!topics.length) return;

    const normalize = (value) => String(value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    let activeScope = 'all';

    const setActiveScopeButton = (scope) => {
        scopeButtons.forEach((button) => {
            const selected = (button.getAttribute('data-coverage-scope') || 'all') === scope;
            button.classList.toggle('bg-indigo-600', selected);
            button.classList.toggle('text-white', selected);
            button.classList.toggle('border-indigo-500', selected);
            button.classList.toggle('bg-white', !selected);
            button.classList.toggle('dark:bg-slate-900', !selected);
            button.classList.toggle('text-slate-800', !selected);
            button.classList.toggle('dark:text-slate-200', !selected);
        });
    };

    const applyFilters = () => {
        const query = normalize(searchInput ? searchInput.value : '');
        let visible = 0;

        topics.forEach((topic) => {
            const scope = topic.getAttribute('data-scope') || '';
            const keywords = topic.getAttribute('data-keywords') || '';
            const text = normalize(topic.textContent);
            const searchable = `${text} ${normalize(keywords)}`;

            const scopeMatch = activeScope === 'all' || scope === activeScope;
            const queryMatch = !query || searchable.includes(query);
            const isVisible = scopeMatch && queryMatch;

            topic.classList.toggle('hidden', !isVisible);
            if (query && isVisible) {
                topic.open = true;
            }
            if (isVisible) visible += 1;
        });

        if (visibleCounter) visibleCounter.innerText = String(visible);
    };

    if (root.dataset.coverageBound === '1') {
        setActiveScopeButton(activeScope);
        applyFilters();
        return;
    }
    root.dataset.coverageBound = '1';

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    scopeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            activeScope = button.getAttribute('data-coverage-scope') || 'all';
            setActiveScopeButton(activeScope);
            applyFilters();
        });
    });

    setActiveScopeButton(activeScope);
    applyFilters();
};

// =============================================
// Chapter 1 - Math foundations lab
// =============================================
const mfState = {
    ux: 2,
    uy: 1.5,
    vx: 3,
    vy: 0.8,
    gradX0: 1.8,
    gradX: 1.8,
    lr: 0.12,
    iter: 0,
    timer: null,
    projCanvas: null,
    gradCanvas: null
};

function mfDot(ax, ay, bx, by) {
    return ax * bx + ay * by;
}

function mfNorm(ax, ay) {
    return Math.sqrt(ax * ax + ay * ay);
}

function mfDrawVector(ctx, ox, oy, scale, x, y, color, label) {
    const tx = ox + x * scale;
    const ty = oy - y * scale;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(tx, ty);
    ctx.stroke();

    const ang = Math.atan2(ty - oy, tx - ox);
    const h = 8;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx - h * Math.cos(ang - Math.PI / 6), ty - h * Math.sin(ang - Math.PI / 6));
    ctx.lineTo(tx - h * Math.cos(ang + Math.PI / 6), ty - h * Math.sin(ang + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    ctx.font = '12px Arial';
    ctx.fillText(label, tx + 6, ty - 6);
}

function mfDrawProjection() {
    if (!mfState.projCanvas) return;
    const ctx = mfState.projCanvas.getContext('2d');
    const w = mfState.projCanvas.width;
    const h = mfState.projCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const ox = w * 0.5;
    const oy = h * 0.5;
    const scale = 40;

    ctx.strokeStyle = 'rgba(148,163,184,0.25)';
    ctx.lineWidth = 1;
    for (let i = -6; i <= 6; i += 1) {
        ctx.beginPath();
        ctx.moveTo(ox + i * scale, 0);
        ctx.lineTo(ox + i * scale, h);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, oy + i * scale);
        ctx.lineTo(w, oy + i * scale);
        ctx.stroke();
    }

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, oy);
    ctx.lineTo(w, oy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ox, 0);
    ctx.lineTo(ox, h);
    ctx.stroke();

    const uNorm = mfNorm(mfState.ux, mfState.uy);
    const vNorm = mfNorm(mfState.vx, mfState.vy);
    const dot = mfDot(mfState.ux, mfState.uy, mfState.vx, mfState.vy);
    const denom = Math.max(1e-8, uNorm * uNorm);
    const scalarProj = dot / Math.max(1e-8, uNorm);
    const projFactor = dot / denom;
    const px = projFactor * mfState.ux;
    const py = projFactor * mfState.uy;
    const cos = dot / Math.max(1e-8, uNorm * vNorm);

    mfDrawVector(ctx, ox, oy, scale, mfState.ux, mfState.uy, '#22d3ee', 'u');
    mfDrawVector(ctx, ox, oy, scale, mfState.vx, mfState.vy, '#a78bfa', 'v');
    mfDrawVector(ctx, ox, oy, scale, px, py, '#f59e0b', 'proj_u(v)');

    const dotEl = document.getElementById('mfDot');
    const cosEl = document.getElementById('mfCos');
    const projEl = document.getElementById('mfProj');
    if (dotEl) dotEl.innerText = dot.toFixed(3);
    if (cosEl) cosEl.innerText = cos.toFixed(3);
    if (projEl) projEl.innerText = scalarProj.toFixed(3);
}

function mfF(x) {
    return 0.25 * x * x * x * x - x * x;
}

function mfGradF(x) {
    return x * x * x - 2 * x;
}

function mfDrawGradient() {
    if (!mfState.gradCanvas) return;
    const ctx = mfState.gradCanvas.getContext('2d');
    const w = mfState.gradCanvas.width;
    const h = mfState.gradCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const xMin = -2.5;
    const xMax = 2.5;
    const yMin = -1.2;
    const yMax = 2.5;

    const tx = x => ((x - xMin) / (xMax - xMin)) * w;
    const ty = y => h - ((y - yMin) / (yMax - yMin)) * h;

    ctx.strokeStyle = 'rgba(148,163,184,0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, ty(0));
    ctx.lineTo(w, ty(0));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(tx(0), 0);
    ctx.lineTo(tx(0), h);
    ctx.stroke();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= 280; i += 1) {
        const x = xMin + (xMax - xMin) * (i / 280);
        const y = mfF(x);
        if (i === 0) ctx.moveTo(tx(x), ty(y));
        else ctx.lineTo(tx(x), ty(y));
    }
    ctx.stroke();

    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(tx(mfState.gradX), ty(mfF(mfState.gradX)), 6, 0, Math.PI * 2);
    ctx.fill();

    const iterEl = document.getElementById('mfIter');
    const xEl = document.getElementById('mfX');
    const fxEl = document.getElementById('mfFx');
    if (iterEl) iterEl.innerText = String(mfState.iter);
    if (xEl) xEl.innerText = mfState.gradX.toFixed(3);
    if (fxEl) fxEl.innerText = mfF(mfState.gradX).toFixed(3);
}

function mfStepGradient() {
    const g = mfGradF(mfState.gradX);
    mfState.gradX -= mfState.lr * g;
    mfState.iter += 1;
    mfDrawGradient();
}

function mfPauseGradient() {
    if (mfState.timer) {
        clearInterval(mfState.timer);
        mfState.timer = null;
    }
}

function mfResetGradient() {
    mfPauseGradient();
    mfState.gradX = mfState.gradX0;
    mfState.iter = 0;
    mfDrawGradient();
}

window.initMathFondamentalesLab = function () {
    mfPauseGradient();

    mfState.projCanvas = document.getElementById('mathFoundProjCanvas');
    mfState.gradCanvas = document.getElementById('mathFoundGradCanvas');

    if (!mfState.projCanvas || !mfState.gradCanvas) return;

    const bindRange = (id, key, valueId, decimals) => {
        const input = document.getElementById(id);
        const value = document.getElementById(valueId);
        if (!input) return;
        input.value = String(mfState[key]);
        if (value) value.innerText = mfState[key].toFixed(decimals);
        input.oninput = ev => {
            mfState[key] = parseFloat(ev.target.value);
            if (value) value.innerText = mfState[key].toFixed(decimals);
            if (key === 'gradX0') {
                mfState.gradX = mfState.gradX0;
                mfState.iter = 0;
            }
            mfDrawProjection();
            mfDrawGradient();
        };
    };

    bindRange('mfUx', 'ux', 'mfUxVal', 1);
    bindRange('mfUy', 'uy', 'mfUyVal', 1);
    bindRange('mfVx', 'vx', 'mfVxVal', 1);
    bindRange('mfVy', 'vy', 'mfVyVal', 1);
    bindRange('mfLr', 'lr', 'mfLrVal', 2);
    bindRange('mfX0', 'gradX0', 'mfX0Val', 2);

    const stepBtn = document.getElementById('mfGradStep');
    const runBtn = document.getElementById('mfGradRun');
    const pauseBtn = document.getElementById('mfGradPause');
    const resetBtn = document.getElementById('mfGradReset');

    if (stepBtn) stepBtn.onclick = () => mfStepGradient();
    if (runBtn) {
        runBtn.onclick = () => {
            if (mfState.timer) return;
            mfState.timer = setInterval(() => {
                if (!mfState.gradCanvas || !mfState.gradCanvas.isConnected) {
                    mfPauseGradient();
                    return;
                }
                mfStepGradient();
            }, 120);
        };
    }
    if (pauseBtn) pauseBtn.onclick = () => mfPauseGradient();
    if (resetBtn) resetBtn.onclick = () => mfResetGradient();

    mfState.gradX = mfState.gradX0;
    mfState.iter = 0;
    mfDrawProjection();
    mfDrawGradient();
};

// =============================================
// Chapter 2 - Data science classic labs
// =============================================
const dsState = {
    preCanvas: null,
    kmCanvas: null,
    rawPoints: [],
    kmeansPoints: [],
    assignments: [],
    centroids: [],
    k: 3,
    noise: 0.35,
    iter: 0,
    autoTimer: null
};

function dsRandn() {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function dsGenerateRawPoints(outliers) {
    const pts = [];
    for (let i = 0; i < 70; i += 1) {
        pts.push({ x: dsRandn() * 1.2 + 0.3, y: dsRandn() * 0.8 + 0.1, outlier: false });
    }
    for (let j = 0; j < outliers; j += 1) {
        pts.push({ x: (Math.random() - 0.5) * 14, y: (Math.random() - 0.5) * 8, outlier: true });
    }
    return pts;
}

function dsStats(values) {
    const n = Math.max(1, values.length);
    const mu = values.reduce((a, b) => a + b, 0) / n;
    const variance = values.reduce((a, b) => a + (b - mu) * (b - mu), 0) / n;
    return { mu, std: Math.sqrt(Math.max(1e-8, variance)) };
}

function dsScalePoints(points, mode) {
    if (!points.length) return [];
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);

    const xStats = dsStats(xs);
    const yStats = dsStats(ys);
    const xMin = Math.min(...xs);
    const xMax = Math.max(...xs);
    const yMin = Math.min(...ys);
    const yMax = Math.max(...ys);

    return points.map(p => {
        if (mode === 'standard') {
            return {
                x: (p.x - xStats.mu) / xStats.std,
                y: (p.y - yStats.mu) / yStats.std,
                outlier: p.outlier
            };
        }
        if (mode === 'minmax') {
            return {
                x: (p.x - xMin) / Math.max(1e-8, xMax - xMin),
                y: (p.y - yMin) / Math.max(1e-8, yMax - yMin),
                outlier: p.outlier
            };
        }
        return { ...p };
    });
}

function dsDrawScatter(ctx, pts, x0, y0, width, height, title, colorMain, colorOutlier) {
    if (!pts.length) return;

    const xs = pts.map(p => p.x);
    const ys = pts.map(p => p.y);
    const xMin = Math.min(...xs);
    const xMax = Math.max(...xs);
    const yMin = Math.min(...ys);
    const yMax = Math.max(...ys);

    const tx = x => x0 + ((x - xMin) / Math.max(1e-8, xMax - xMin)) * width;
    const ty = y => y0 + height - ((y - yMin) / Math.max(1e-8, yMax - yMin)) * height;

    ctx.strokeStyle = 'rgba(148,163,184,0.4)';
    ctx.strokeRect(x0, y0, width, height);

    pts.forEach(p => {
        ctx.fillStyle = p.outlier ? colorOutlier : colorMain;
        ctx.beginPath();
        ctx.arc(tx(p.x), ty(p.y), 3.3, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Arial';
    ctx.fillText(title, x0 + 8, y0 + 16);
}

function dsDrawPreprocess() {
    if (!dsState.preCanvas) return;
    const ctx = dsState.preCanvas.getContext('2d');
    const w = dsState.preCanvas.width;
    const h = dsState.preCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const scaling = document.getElementById('dsScaling');
    const mode = scaling ? scaling.value : 'standard';
    const scaled = dsScalePoints(dsState.rawPoints, mode);

    dsDrawScatter(ctx, dsState.rawPoints, 24, 28, w * 0.44, h - 56, 'Raw data', '#22d3ee', '#f97316');
    dsDrawScatter(ctx, scaled, w * 0.52, 28, w * 0.44, h - 56, `Scaled: ${mode}`, '#a78bfa', '#facc15');

    const rawXStats = dsStats(dsState.rawPoints.map(p => p.x));
    const scaledXStats = dsStats(scaled.map(p => p.x));

    const muRaw = document.getElementById('dsMuRaw');
    const stdRaw = document.getElementById('dsStdRaw');
    const muScaled = document.getElementById('dsMuScaled');
    const stdScaled = document.getElementById('dsStdScaled');
    if (muRaw) muRaw.innerText = rawXStats.mu.toFixed(3);
    if (stdRaw) stdRaw.innerText = rawXStats.std.toFixed(3);
    if (muScaled) muScaled.innerText = scaledXStats.mu.toFixed(3);
    if (stdScaled) stdScaled.innerText = scaledXStats.std.toFixed(3);
}

function dsGenerateKmeansPoints(noise) {
    const centers = [
        { x: -2.8, y: -1.8 },
        { x: 0.5, y: 2.4 },
        { x: 2.7, y: -0.4 }
    ];
    const pts = [];
    centers.forEach(c => {
        for (let i = 0; i < 45; i += 1) {
            pts.push({
                x: c.x + dsRandn() * noise,
                y: c.y + dsRandn() * noise
            });
        }
    });
    return pts;
}

function dsRandomCentroids(k) {
    const picks = [];
    const used = new Set();
    while (picks.length < k && picks.length < dsState.kmeansPoints.length) {
        const idx = Math.floor(Math.random() * dsState.kmeansPoints.length);
        if (used.has(idx)) continue;
        used.add(idx);
        const p = dsState.kmeansPoints[idx];
        picks.push({ x: p.x, y: p.y });
    }
    return picks;
}

function dsKmeansOneIter() {
    const pts = dsState.kmeansPoints;
    const cents = dsState.centroids;
    if (!pts.length || !cents.length) return;

    dsState.assignments = pts.map(p => {
        let best = 0;
        let bestDist = Infinity;
        for (let k = 0; k < cents.length; k += 1) {
            const dx = p.x - cents[k].x;
            const dy = p.y - cents[k].y;
            const d2 = dx * dx + dy * dy;
            if (d2 < bestDist) {
                bestDist = d2;
                best = k;
            }
        }
        return best;
    });

    const sums = Array.from({ length: cents.length }, () => ({ x: 0, y: 0, c: 0 }));
    pts.forEach((p, i) => {
        const a = dsState.assignments[i];
        sums[a].x += p.x;
        sums[a].y += p.y;
        sums[a].c += 1;
    });

    for (let k = 0; k < cents.length; k += 1) {
        if (sums[k].c > 0) {
            cents[k].x = sums[k].x / sums[k].c;
            cents[k].y = sums[k].y / sums[k].c;
        }
    }

    dsState.iter += 1;
    dsDrawKmeans();
}

function dsKmeansInertia() {
    if (!dsState.kmeansPoints.length || !dsState.centroids.length || !dsState.assignments.length) return 0;
    let total = 0;
    for (let i = 0; i < dsState.kmeansPoints.length; i += 1) {
        const p = dsState.kmeansPoints[i];
        const c = dsState.centroids[dsState.assignments[i]];
        const dx = p.x - c.x;
        const dy = p.y - c.y;
        total += dx * dx + dy * dy;
    }
    return total;
}

function dsDrawKmeans() {
    if (!dsState.kmCanvas) return;
    const ctx = dsState.kmCanvas.getContext('2d');
    const w = dsState.kmCanvas.width;
    const h = dsState.kmCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const pts = dsState.kmeansPoints;
    if (!pts.length) return;

    const xs = pts.map(p => p.x);
    const ys = pts.map(p => p.y);
    const xMin = Math.min(...xs) - 0.5;
    const xMax = Math.max(...xs) + 0.5;
    const yMin = Math.min(...ys) - 0.5;
    const yMax = Math.max(...ys) + 0.5;

    const tx = x => 24 + ((x - xMin) / Math.max(1e-8, xMax - xMin)) * (w - 48);
    const ty = y => h - 24 - ((y - yMin) / Math.max(1e-8, yMax - yMin)) * (h - 48);

    const palette = ['#38bdf8', '#a78bfa', '#34d399', '#f97316', '#facc15', '#fb7185'];

    pts.forEach((p, i) => {
        const a = dsState.assignments[i] ?? 0;
        ctx.fillStyle = palette[a % palette.length];
        ctx.beginPath();
        ctx.arc(tx(p.x), ty(p.y), 3.2, 0, Math.PI * 2);
        ctx.fill();
    });

    dsState.centroids.forEach((c, k) => {
        const cx = tx(c.x);
        const cy = ty(c.y);
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - 8, cy);
        ctx.lineTo(cx + 8, cy);
        ctx.moveTo(cx, cy - 8);
        ctx.lineTo(cx, cy + 8);
        ctx.stroke();

        ctx.fillStyle = palette[k % palette.length];
        ctx.font = 'bold 12px Arial';
        ctx.fillText(`C${k + 1}`, cx + 9, cy - 9);
    });

    const iterEl = document.getElementById('dsIter');
    const inertiaEl = document.getElementById('dsInertia');
    if (iterEl) iterEl.innerText = String(dsState.iter);
    if (inertiaEl) inertiaEl.innerText = dsKmeansInertia().toFixed(3);
}

function dsPauseAuto() {
    if (dsState.autoTimer) {
        clearInterval(dsState.autoTimer);
        dsState.autoTimer = null;
    }
}

function dsResetKmeans() {
    dsPauseAuto();
    dsState.kmeansPoints = dsGenerateKmeansPoints(dsState.noise);
    dsState.centroids = dsRandomCentroids(dsState.k);
    dsState.assignments = Array.from({ length: dsState.kmeansPoints.length }, () => 0);
    dsState.iter = 0;
    dsKmeansOneIter();
}

window.initDataScienceClassiqueLab = function () {
    dsPauseAuto();

    dsState.preCanvas = document.getElementById('dsPreprocessCanvas');
    dsState.kmCanvas = document.getElementById('dsKmeansCanvas');
    if (!dsState.preCanvas || !dsState.kmCanvas) return;

    const outliersInput = document.getElementById('dsOutliers');
    const outliersVal = document.getElementById('dsOutliersVal');
    const scaling = document.getElementById('dsScaling');
    const regen = document.getElementById('dsRegenerate');

    const refreshPre = () => {
        const count = outliersInput ? parseInt(outliersInput.value, 10) : 4;
        dsState.rawPoints = dsGenerateRawPoints(count);
        if (outliersVal) outliersVal.innerText = String(count);
        dsDrawPreprocess();
    };

    if (outliersInput) {
        outliersInput.oninput = () => {
            if (outliersVal) outliersVal.innerText = outliersInput.value;
            dsState.rawPoints = dsGenerateRawPoints(parseInt(outliersInput.value, 10));
            dsDrawPreprocess();
        };
    }
    if (scaling) scaling.onchange = () => dsDrawPreprocess();
    if (regen) regen.onclick = () => refreshPre();

    const kInput = document.getElementById('dsK');
    const kVal = document.getElementById('dsKVal');
    const noiseInput = document.getElementById('dsNoise');
    const noiseVal = document.getElementById('dsNoiseVal');

    if (kInput) {
        kInput.oninput = ev => {
            dsState.k = parseInt(ev.target.value, 10);
            if (kVal) kVal.innerText = String(dsState.k);
            dsResetKmeans();
        };
        if (kVal) kVal.innerText = kInput.value;
    }

    if (noiseInput) {
        noiseInput.oninput = ev => {
            dsState.noise = parseFloat(ev.target.value);
            if (noiseVal) noiseVal.innerText = dsState.noise.toFixed(2);
            dsResetKmeans();
        };
        if (noiseVal) noiseVal.innerText = parseFloat(noiseInput.value).toFixed(2);
        dsState.noise = parseFloat(noiseInput.value);
    }

    const stepBtn = document.getElementById('dsKmeansStep');
    const autoBtn = document.getElementById('dsKmeansAuto');
    const pauseBtn = document.getElementById('dsKmeansPause');
    const resetBtn = document.getElementById('dsKmeansReset');

    if (stepBtn) stepBtn.onclick = () => dsKmeansOneIter();
    if (autoBtn) {
        autoBtn.onclick = () => {
            if (dsState.autoTimer) return;
            dsState.autoTimer = setInterval(() => {
                if (!dsState.kmCanvas || !dsState.kmCanvas.isConnected) {
                    dsPauseAuto();
                    return;
                }
                dsKmeansOneIter();
            }, 180);
        };
    }
    if (pauseBtn) pauseBtn.onclick = () => dsPauseAuto();
    if (resetBtn) resetBtn.onclick = () => dsResetKmeans();

    refreshPre();
    dsResetKmeans();
};

// =============================================
// Chapter 3 - Deep learning base labs
// =============================================
const dlState = {
    actCanvas: null,
    trainCanvas: null,
    w: 1,
    b: 0,
    actType: 'relu',
    p: -2,
    lr: 0.02,
    clip: 1,
    step: 0,
    history: [],
    trainTimer: null,
    lastGrad: 0
};

function dlActivation(z) {
    if (dlState.actType === 'relu') return Math.max(0, z);
    if (dlState.actType === 'gelu') {
        const c = Math.sqrt(2 / Math.PI);
        return 0.5 * z * (1 + Math.tanh(c * (z + 0.044715 * z * z * z)));
    }
    if (dlState.actType === 'silu') return z / (1 + Math.exp(-z));
    if (dlState.actType === 'tanh') return Math.tanh(z);
    return 1 / (1 + Math.exp(-z));
}

function dlActivationPrime(z) {
    if (dlState.actType === 'relu') return z > 0 ? 1 : 0;
    if (dlState.actType === 'gelu') {
        const eps = 1e-3;
        return (dlActivation(z + eps) - dlActivation(z - eps)) / (2 * eps);
    }
    if (dlState.actType === 'silu') {
        const s = 1 / (1 + Math.exp(-z));
        return s + z * s * (1 - s);
    }
    if (dlState.actType === 'tanh') {
        const t = Math.tanh(z);
        return 1 - t * t;
    }
    const s = 1 / (1 + Math.exp(-z));
    return s * (1 - s);
}

function dlDrawActivation() {
    if (!dlState.actCanvas) return;
    const ctx = dlState.actCanvas.getContext('2d');
    const w = dlState.actCanvas.width;
    const h = dlState.actCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const xMin = -4;
    const xMax = 4;
    const yMin = -2;
    const yMax = 4;
    const tx = x => ((x - xMin) / (xMax - xMin)) * w;
    const ty = y => h - ((y - yMin) / (yMax - yMin)) * h;

    ctx.strokeStyle = 'rgba(148,163,184,0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, ty(0));
    ctx.lineTo(w, ty(0));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(tx(0), 0);
    ctx.lineTo(tx(0), h);
    ctx.stroke();

    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= 260; i += 1) {
        const x = xMin + (xMax - xMin) * (i / 260);
        const z = dlState.w * x + dlState.b;
        const y = dlActivation(z);
        if (i === 0) ctx.moveTo(tx(x), ty(y));
        else ctx.lineTo(tx(x), ty(y));
    }
    ctx.stroke();

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let i = 0; i <= 260; i += 1) {
        const x = xMin + (xMax - xMin) * (i / 260);
        const z = dlState.w * x + dlState.b;
        const y = dlActivationPrime(z) * dlState.w;
        if (i === 0) ctx.moveTo(tx(x), ty(y));
        else ctx.lineTo(tx(x), ty(y));
    }
    ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Arial';
    ctx.fillText('cyan: activation | orange: pente locale', 12, 20);

    const y0El = document.getElementById('dlY0');
    const slopeEl = document.getElementById('dlSlope0');
    const z0 = dlState.b;
    const y0 = dlActivation(z0);
    const s0 = dlActivationPrime(z0) * dlState.w;
    if (y0El) y0El.innerText = y0.toFixed(3);
    if (slopeEl) slopeEl.innerText = s0.toFixed(3);
}

function dlLoss(p) {
    return 0.5 * (p - 1) * (p - 1);
}

function dlTrainStep() {
    let grad = dlState.p - 1 + (Math.random() - 0.5) * 0.25;
    const clipped = Math.max(-dlState.clip, Math.min(dlState.clip, grad));
    dlState.lastGrad = clipped;
    dlState.p -= dlState.lr * clipped;
    dlState.step += 1;

    const loss = dlLoss(dlState.p);
    dlState.history.push(loss);
    if (dlState.history.length > 180) dlState.history.shift();

    dlDrawTraining();
}

function dlDrawTraining() {
    if (!dlState.trainCanvas) return;
    const ctx = dlState.trainCanvas.getContext('2d');
    const w = dlState.trainCanvas.width;
    const h = dlState.trainCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const history = dlState.history.length ? dlState.history : [dlLoss(dlState.p)];
    const maxY = Math.max(0.2, ...history);

    const tx = i => (i / Math.max(1, history.length - 1)) * w;
    const ty = y => h - (y / maxY) * (h - 20) - 10;

    ctx.strokeStyle = 'rgba(148,163,184,0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h - 10);
    ctx.lineTo(w, h - 10);
    ctx.stroke();

    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    history.forEach((v, i) => {
        if (i === 0) ctx.moveTo(tx(i), ty(v));
        else ctx.lineTo(tx(i), ty(v));
    });
    ctx.stroke();

    const stepEl = document.getElementById('dlStep');
    const lossEl = document.getElementById('dlLossVal');
    const gradEl = document.getElementById('dlGradVal');
    if (stepEl) stepEl.innerText = String(dlState.step);
    if (lossEl) lossEl.innerText = history[history.length - 1].toFixed(4);
    if (gradEl) gradEl.innerText = Math.abs(dlState.lastGrad).toFixed(4);
}

function dlPauseTraining() {
    if (dlState.trainTimer) {
        clearInterval(dlState.trainTimer);
        dlState.trainTimer = null;
    }
}

function dlResetTraining() {
    dlPauseTraining();
    dlState.p = -2;
    dlState.step = 0;
    dlState.lastGrad = 0;
    dlState.history = [dlLoss(dlState.p)];
    dlDrawTraining();
}

window.initDeepLearningBaseLab = function () {
    dlPauseTraining();

    dlState.actCanvas = document.getElementById('dlActivationCanvas');
    dlState.trainCanvas = document.getElementById('dlTrainCanvas');
    if (!dlState.actCanvas || !dlState.trainCanvas) return;

    const actType = document.getElementById('dlActType');
    const wInput = document.getElementById('dlW');
    const bInput = document.getElementById('dlB');
    const wVal = document.getElementById('dlWVal');
    const bVal = document.getElementById('dlBVal');

    if (actType) {
        actType.value = dlState.actType;
        actType.onchange = ev => {
            dlState.actType = ev.target.value;
            dlDrawActivation();
        };
    }

    if (wInput) {
        wInput.value = String(dlState.w);
        wInput.oninput = ev => {
            dlState.w = parseFloat(ev.target.value);
            if (wVal) wVal.innerText = dlState.w.toFixed(2);
            dlDrawActivation();
        };
        if (wVal) wVal.innerText = dlState.w.toFixed(2);
    }

    if (bInput) {
        bInput.value = String(dlState.b);
        bInput.oninput = ev => {
            dlState.b = parseFloat(ev.target.value);
            if (bVal) bVal.innerText = dlState.b.toFixed(2);
            dlDrawActivation();
        };
        if (bVal) bVal.innerText = dlState.b.toFixed(2);
    }

    const lrInput = document.getElementById('dlLr');
    const clipInput = document.getElementById('dlClip');
    const lrVal = document.getElementById('dlLrVal');
    const clipVal = document.getElementById('dlClipVal');

    if (lrInput) {
        lrInput.value = String(dlState.lr);
        lrInput.oninput = ev => {
            dlState.lr = parseFloat(ev.target.value);
            if (lrVal) lrVal.innerText = dlState.lr.toFixed(3);
        };
        if (lrVal) lrVal.innerText = dlState.lr.toFixed(3);
    }

    if (clipInput) {
        clipInput.value = String(dlState.clip);
        clipInput.oninput = ev => {
            dlState.clip = parseFloat(ev.target.value);
            if (clipVal) clipVal.innerText = dlState.clip.toFixed(2);
        };
        if (clipVal) clipVal.innerText = dlState.clip.toFixed(2);
    }

    const startBtn = document.getElementById('dlTrainStart');
    const pauseBtn = document.getElementById('dlTrainPause');
    const stepBtn = document.getElementById('dlTrainStep');
    const resetBtn = document.getElementById('dlTrainReset');

    if (startBtn) {
        startBtn.onclick = () => {
            if (dlState.trainTimer) return;
            dlState.trainTimer = setInterval(() => {
                if (!dlState.trainCanvas || !dlState.trainCanvas.isConnected) {
                    dlPauseTraining();
                    return;
                }
                dlTrainStep();
            }, 120);
        };
    }
    if (pauseBtn) pauseBtn.onclick = () => dlPauseTraining();
    if (stepBtn) stepBtn.onclick = () => dlTrainStep();
    if (resetBtn) resetBtn.onclick = () => dlResetTraining();

    dlDrawActivation();
    dlResetTraining();
};

// =============================================
// Chapter 4 - Computer vision labs
// =============================================
const visState = {
    convCanvas: null,
    iouCanvas: null,
    size: 56,
    base: [],
    filtered: [],
    contrast: 1,
    predBox: { x: 0.35, y: 0.30, w: 0.30, h: 0.34 },
    gtBox: { x: 0.25, y: 0.22, w: 0.38, h: 0.42 }
};

function visClamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
}

function visGenerateBase(size, contrast) {
    const img = Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
    const cx = size * 0.45;
    const cy = size * 0.5;
    const r = size * 0.22;

    for (let y = 0; y < size; y += 1) {
        for (let x = 0; x < size; x += 1) {
            let v = 0.12 + 0.08 * Math.sin(x * 0.26) + 0.08 * Math.cos(y * 0.21);

            const dx = x - cx;
            const dy = y - cy;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < r) v += 0.45;
            if (x > size * 0.62 && x < size * 0.85 && y > size * 0.18 && y < size * 0.46) v += 0.28;

            img[y][x] = visClamp(v * contrast, 0, 1);
        }
    }
    return img;
}

function visKernelByName(name) {
    if (name === 'blur') return [[1 / 9, 1 / 9, 1 / 9], [1 / 9, 1 / 9, 1 / 9], [1 / 9, 1 / 9, 1 / 9]];
    if (name === 'sharpen') return [[0, -1, 0], [-1, 5, -1], [0, -1, 0]];
    if (name === 'edge') return [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]];
    return [[0, 0, 0], [0, 1, 0], [0, 0, 0]];
}

function visApplyConv(img, kernel) {
    const h = img.length;
    const w = img[0].length;
    const out = Array.from({ length: h }, () => Array.from({ length: w }, () => 0));

    for (let y = 1; y < h - 1; y += 1) {
        for (let x = 1; x < w - 1; x += 1) {
            let acc = 0;
            for (let ky = -1; ky <= 1; ky += 1) {
                for (let kx = -1; kx <= 1; kx += 1) {
                    acc += img[y + ky][x + kx] * kernel[ky + 1][kx + 1];
                }
            }
            out[y][x] = visClamp(acc, 0, 1);
        }
    }
    return out;
}

function visDrawImageMatrix(ctx, img, ox, oy, scale, title) {
    const h = img.length;
    const w = img[0].length;
    for (let y = 0; y < h; y += 1) {
        for (let x = 0; x < w; x += 1) {
            const g = Math.floor(img[y][x] * 255);
            ctx.fillStyle = `rgb(${g},${g},${g})`;
            ctx.fillRect(ox + x * scale, oy + y * scale, scale, scale);
        }
    }
    ctx.strokeStyle = 'rgba(148,163,184,0.6)';
    ctx.strokeRect(ox, oy, w * scale, h * scale);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Arial';
    ctx.fillText(title, ox + 4, oy - 8);
}

function visDrawConvolution() {
    if (!visState.convCanvas) return;
    const ctx = visState.convCanvas.getContext('2d');
    const w = visState.convCanvas.width;
    const h = visState.convCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const scale = 4;
    visDrawImageMatrix(ctx, visState.base, 26, 38, scale, 'Input');
    visDrawImageMatrix(ctx, visState.filtered, 366, 38, scale, 'After kernel');

    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px Arial';
    ctx.fillText('Convolution = filtre local qui detecte ou lisse des motifs', 180, 22);
}

function visIoU(a, b) {
    const xA = Math.max(a.x, b.x);
    const yA = Math.max(a.y, b.y);
    const xB = Math.min(a.x + a.w, b.x + b.w);
    const yB = Math.min(a.y + a.h, b.y + b.h);

    const interW = Math.max(0, xB - xA);
    const interH = Math.max(0, yB - yA);
    const inter = interW * interH;
    const union = a.w * a.h + b.w * b.h - inter;
    return union <= 0 ? 0 : inter / union;
}

function visDrawIou() {
    if (!visState.iouCanvas) return;
    const ctx = visState.iouCanvas.getContext('2d');
    const w = visState.iouCanvas.width;
    const h = visState.iouCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const pad = 28;
    const boxW = w - pad * 2;
    const boxH = h - pad * 2;

    ctx.strokeStyle = 'rgba(148,163,184,0.4)';
    ctx.strokeRect(pad, pad, boxW, boxH);

    const drawBox = (b, fill, stroke) => {
        const x = pad + b.x * boxW;
        const y = pad + b.y * boxH;
        const bw = b.w * boxW;
        const bh = b.h * boxH;
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 2;
        ctx.fillRect(x, y, bw, bh);
        ctx.strokeRect(x, y, bw, bh);
    };

    drawBox(visState.gtBox, 'rgba(34,197,94,0.25)', '#22c55e');
    drawBox(visState.predBox, 'rgba(249,115,22,0.25)', '#f97316');

    const iou = visIoU(visState.gtBox, visState.predBox);
    const iouEl = document.getElementById('visIouVal');
    if (iouEl) iouEl.innerText = iou.toFixed(3);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Arial';
    ctx.fillText('GT (vert) vs Prediction (orange)', 12, 18);
    ctx.fillText(`IoU = ${iou.toFixed(3)}`, 12, h - 10);
}

function visRefreshConvolution() {
    const kernelSel = document.getElementById('visKernel');
    const kernel = visKernelByName(kernelSel ? kernelSel.value : 'identity');
    visState.base = visGenerateBase(visState.size, visState.contrast);
    visState.filtered = visApplyConv(visState.base, kernel);
    visDrawConvolution();
}

window.initVisionParOrdinateurLab = function () {
    visState.convCanvas = document.getElementById('visConvCanvas');
    visState.iouCanvas = document.getElementById('visIouCanvas');
    if (!visState.convCanvas || !visState.iouCanvas) return;

    const kernelSel = document.getElementById('visKernel');
    const contrast = document.getElementById('visContrast');
    const contrastVal = document.getElementById('visContrastVal');
    const refreshBtn = document.getElementById('visConvRefresh');

    if (kernelSel) kernelSel.onchange = () => visRefreshConvolution();
    if (contrast) {
        contrast.value = String(visState.contrast);
        contrast.oninput = ev => {
            visState.contrast = parseFloat(ev.target.value);
            if (contrastVal) contrastVal.innerText = visState.contrast.toFixed(2);
            visRefreshConvolution();
        };
        if (contrastVal) contrastVal.innerText = visState.contrast.toFixed(2);
    }
    if (refreshBtn) refreshBtn.onclick = () => visRefreshConvolution();

    const bindIou = (id, key, valId) => {
        const input = document.getElementById(id);
        const out = document.getElementById(valId);
        if (!input) return;
        input.value = String(visState.predBox[key]);
        if (out) out.innerText = visState.predBox[key].toFixed(2);
        input.oninput = ev => {
            visState.predBox[key] = parseFloat(ev.target.value);
            if (out) out.innerText = visState.predBox[key].toFixed(2);
            visDrawIou();
        };
    };

    bindIou('visBx', 'x', 'visBxVal');
    bindIou('visBy', 'y', 'visByVal');
    bindIou('visBw', 'w', 'visBwVal');
    bindIou('visBh', 'h', 'visBhVal');

    visRefreshConvolution();
    visDrawIou();
};

// =============================================
// Chapter 5 - NLP labs
// =============================================
const nlpState = {
    attCanvas: null,
    decCanvas: null,
    tokens: ['Le', 'modele', 'comprend', 'le', 'contexte', '.'],
    query: 2,
    temp: 1,
    decTemp: 1,
    topK: 5,
    logits: [2.8, 2.1, 1.5, 0.9, 0.6, 0.1, -0.4, -1.0],
    vocab: ['modele', 'reseau', 'contexte', 'token', 'attention', 'gradient', 'loss', 'bruit']
};

function nlpSoftmax(values, temperature) {
    const t = Math.max(0.05, temperature);
    const scaled = values.map(v => v / t);
    const maxV = Math.max(...scaled);
    const exps = scaled.map(v => Math.exp(v - maxV));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(v => v / Math.max(1e-9, sum));
}

function nlpAttentionWeights() {
    const q = nlpState.query;
    const base = nlpState.tokens.map((_, i) => {
        const dist = Math.abs(i - q);
        const positional = -0.7 * dist;
        const semanticBoost = i === q ? 1.0 : (i === q - 1 || i === q + 1 ? 0.45 : 0.1);
        const punctPenalty = nlpState.tokens[i] === '.' ? -0.4 : 0;
        return positional + semanticBoost + punctPenalty;
    });
    return nlpSoftmax(base, nlpState.temp);
}

function nlpDrawAttention() {
    if (!nlpState.attCanvas) return;
    const ctx = nlpState.attCanvas.getContext('2d');
    const w = nlpState.attCanvas.width;
    const h = nlpState.attCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const weights = nlpAttentionWeights();
    const n = weights.length;
    const cellW = (w - 80) / n;
    const y = 72;

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Arial';
    ctx.fillText(`Query token: ${nlpState.tokens[nlpState.query]}`, 12, 20);
    ctx.fillText('Heatmap: requete -> cles', 12, 38);

    for (let i = 0; i < n; i += 1) {
        const x = 40 + i * cellW;
        const p = weights[i];
        const alpha = 0.15 + p * 0.85;
        ctx.fillStyle = `rgba(34,211,238,${alpha})`;
        ctx.fillRect(x, y, cellW - 4, 130);

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(p.toFixed(2), x + 6, y + 20);

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '11px Arial';
        ctx.fillText(nlpState.tokens[i], x + 6, y + 116);
    }
}

function nlpDecodeDistribution() {
    const probs = nlpSoftmax(nlpState.logits, nlpState.decTemp);
    const indices = probs.map((p, i) => ({ i, p })).sort((a, b) => b.p - a.p);
    const keep = new Set(indices.slice(0, nlpState.topK).map(x => x.i));
    const masked = probs.map((p, i) => (keep.has(i) ? p : 0));
    const sum = masked.reduce((a, b) => a + b, 0);
    return masked.map(p => p / Math.max(1e-9, sum));
}

function nlpDrawDecode() {
    if (!nlpState.decCanvas) return;
    const ctx = nlpState.decCanvas.getContext('2d');
    const w = nlpState.decCanvas.width;
    const h = nlpState.decCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const probs = nlpDecodeDistribution();
    const n = probs.length;
    const barW = (w - 70) / n;
    let bestIdx = 0;
    for (let i = 1; i < n; i += 1) {
        if (probs[i] > probs[bestIdx]) bestIdx = i;
    }

    for (let i = 0; i < n; i += 1) {
        const x = 35 + i * barW;
        const bh = probs[i] * (h - 90);
        const y = h - 28 - bh;
        ctx.fillStyle = probs[i] > 0 ? '#818cf8' : 'rgba(100,116,139,0.4)';
        ctx.fillRect(x, y, barW - 8, bh);

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '11px Arial';
        ctx.fillText(nlpState.vocab[i], x, h - 10);
    }

    const bestToken = document.getElementById('nlpBestToken');
    if (bestToken) bestToken.innerText = `${nlpState.vocab[bestIdx]} (${probs[bestIdx].toFixed(3)})`;

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Arial';
    ctx.fillText('Distribution apres temperature + top-k', 12, 20);
}

window.initNlpLangageLab = function () {
    nlpState.attCanvas = document.getElementById('nlpAttentionCanvas');
    nlpState.decCanvas = document.getElementById('nlpDecodeCanvas');
    if (!nlpState.attCanvas || !nlpState.decCanvas) return;

    const query = document.getElementById('nlpQuery');
    const queryVal = document.getElementById('nlpQueryVal');
    const temp = document.getElementById('nlpTemp');
    const tempVal = document.getElementById('nlpTempVal');

    if (query) {
        query.value = String(nlpState.query);
        query.oninput = ev => {
            nlpState.query = parseInt(ev.target.value, 10);
            if (queryVal) queryVal.innerText = String(nlpState.query);
            nlpDrawAttention();
        };
        if (queryVal) queryVal.innerText = query.value;
    }

    if (temp) {
        temp.value = String(nlpState.temp);
        temp.oninput = ev => {
            nlpState.temp = parseFloat(ev.target.value);
            if (tempVal) tempVal.innerText = nlpState.temp.toFixed(2);
            nlpDrawAttention();
        };
        if (tempVal) tempVal.innerText = nlpState.temp.toFixed(2);
    }

    const decTemp = document.getElementById('nlpDecTemp');
    const decTempVal = document.getElementById('nlpDecTempVal');
    const topK = document.getElementById('nlpTopK');
    const topKVal = document.getElementById('nlpTopKVal');

    if (decTemp) {
        decTemp.value = String(nlpState.decTemp);
        decTemp.oninput = ev => {
            nlpState.decTemp = parseFloat(ev.target.value);
            if (decTempVal) decTempVal.innerText = nlpState.decTemp.toFixed(2);
            nlpDrawDecode();
        };
        if (decTempVal) decTempVal.innerText = nlpState.decTemp.toFixed(2);
    }

    if (topK) {
        topK.value = String(nlpState.topK);
        topK.oninput = ev => {
            nlpState.topK = parseInt(ev.target.value, 10);
            if (topKVal) topKVal.innerText = String(nlpState.topK);
            nlpDrawDecode();
        };
        if (topKVal) topKVal.innerText = String(nlpState.topK);
    }

    nlpDrawAttention();
    nlpDrawDecode();
};

// =============================================
// Chapter 6 - Generative model labs
// =============================================
const genState = {
    latentCanvas: null,
    diffCanvas: null,
    zA: { x: -1.2, y: 0.8 },
    zB: { x: 1.4, y: -0.6 },
    t: 0.5,
    target: [],
    noisy: [],
    current: [],
    noise: 0.55,
    stepsPerTick: 1,
    timer: null
};

function genLatentPoint() {
    return {
        x: genState.zA.x * (1 - genState.t) + genState.zB.x * genState.t,
        y: genState.zA.y * (1 - genState.t) + genState.zB.y * genState.t
    };
}

function genDrawLatent() {
    if (!genState.latentCanvas) return;
    const ctx = genState.latentCanvas.getContext('2d');
    const w = genState.latentCanvas.width;
    const h = genState.latentCanvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const z = genLatentPoint();

    const cx = w * 0.35;
    const cy = h * 0.55;
    const base = 70;

    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i <= 220; i += 1) {
        const a = (i / 220) * Math.PI * 2;
        const r = base * (1 + 0.22 * Math.sin(3 * a + z.x) + 0.16 * Math.cos(5 * a + z.y));
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a) * 0.72;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();

    const mapX0 = w * 0.64;
    const mapY0 = 46;
    const mapW = w * 0.30;
    const mapH = h * 0.70;

    ctx.strokeStyle = 'rgba(148,163,184,0.5)';
    ctx.strokeRect(mapX0, mapY0, mapW, mapH);

    const toMap = p => ({
        x: mapX0 + ((p.x + 2) / 4) * mapW,
        y: mapY0 + (1 - (p.y + 2) / 4) * mapH
    });

    const A = toMap(genState.zA);
    const B = toMap(genState.zB);
    const C = toMap(z);

    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.stroke();

    const drawPt = (p, color, label) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '11px Arial';
        ctx.fillText(label, p.x + 7, p.y - 7);
    };

    drawPt(A, '#22d3ee', 'A');
    drawPt(B, '#a78bfa', 'B');
    drawPt(C, '#34d399', `t=${genState.t.toFixed(2)}`);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Arial';
    ctx.fillText('Decode(z) : forme generee', 14, 20);
    ctx.fillText('Espace latent', mapX0 + 8, mapY0 - 10);
}

function genBuildTargetSignal(n) {
    const arr = [];
    for (let i = 0; i < n; i += 1) {
        const t = i / (n - 1);
        arr.push(0.55 * Math.sin(2 * Math.PI * 2.2 * t) + 0.25 * Math.cos(2 * Math.PI * 5.2 * t));
    }
    return arr;
}

function genResetDiffusion() {
    genPauseDiffusion();
    const n = 140;
    genState.target = genBuildTargetSignal(n);
    genState.noisy = genState.target.map(v => v + (Math.random() - 0.5) * 2 * genState.noise);
    genState.current = genState.noisy.slice();
    genDrawDiffusion();
}

function genSmoothOnce(values) {
    const out = values.slice();
    for (let i = 1; i < values.length - 1; i += 1) {
        out[i] = 0.2 * values[i - 1] + 0.6 * values[i] + 0.2 * values[i + 1];
    }
    return out;
}

function genStepDiffusion() {
    for (let s = 0; s < genState.stepsPerTick; s += 1) {
        genState.current = genSmoothOnce(genState.current);
    }
    genDrawDiffusion();
}

function genDiffError() {
    if (!genState.current.length) return 0;
    let e = 0;
    for (let i = 0; i < genState.current.length; i += 1) {
        e += Math.abs(genState.current[i] - genState.target[i]);
    }
    return e / genState.current.length;
}

function genDrawSignal(ctx, arr, color, w, h, yMin, yMax) {
    if (!arr.length) return;
    const tx = i => (i / (arr.length - 1)) * (w - 20) + 10;
    const ty = y => h - 10 - ((y - yMin) / Math.max(1e-8, yMax - yMin)) * (h - 20);

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    arr.forEach((v, i) => {
        if (i === 0) ctx.moveTo(tx(i), ty(v));
        else ctx.lineTo(tx(i), ty(v));
    });
    ctx.stroke();
}

function genDrawDiffusion() {
    if (!genState.diffCanvas) return;
    const ctx = genState.diffCanvas.getContext('2d');
    const w = genState.diffCanvas.width;
    const h = genState.diffCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const all = [...genState.target, ...genState.noisy, ...genState.current];
    const yMin = Math.min(...all) - 0.3;
    const yMax = Math.max(...all) + 0.3;

    genDrawSignal(ctx, genState.target, '#22c55e', w, h, yMin, yMax);
    genDrawSignal(ctx, genState.noisy, 'rgba(249,115,22,0.55)', w, h, yMin, yMax);
    genDrawSignal(ctx, genState.current, '#60a5fa', w, h, yMin, yMax);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Arial';
    ctx.fillText('vert: cible | orange: bruit initial | bleu: etat courant', 12, 20);

    const errEl = document.getElementById('genErrVal');
    if (errEl) errEl.innerText = genDiffError().toFixed(4);
}

function genPauseDiffusion() {
    if (genState.timer) {
        clearInterval(genState.timer);
        genState.timer = null;
    }
}

window.initModelesGeneratifsLab = function () {
    genPauseDiffusion();

    genState.latentCanvas = document.getElementById('genLatentCanvas');
    genState.diffCanvas = document.getElementById('genDiffCanvas');
    if (!genState.latentCanvas || !genState.diffCanvas) return;

    const bindLat = (id, objKey, axisKey, valId) => {
        const input = document.getElementById(id);
        const out = document.getElementById(valId);
        if (!input) return;
        input.value = String(genState[objKey][axisKey]);
        if (out) out.innerText = genState[objKey][axisKey].toFixed(2);
        input.oninput = ev => {
            genState[objKey][axisKey] = parseFloat(ev.target.value);
            if (out) out.innerText = genState[objKey][axisKey].toFixed(2);
            genDrawLatent();
        };
    };

    bindLat('genZAx', 'zA', 'x', 'genZAxVal');
    bindLat('genZAy', 'zA', 'y', 'genZAyVal');
    bindLat('genZBx', 'zB', 'x', 'genZBxVal');
    bindLat('genZBy', 'zB', 'y', 'genZByVal');

    const tInput = document.getElementById('genT');
    const tVal = document.getElementById('genTVal');
    if (tInput) {
        tInput.value = String(genState.t);
        tInput.oninput = ev => {
            genState.t = parseFloat(ev.target.value);
            if (tVal) tVal.innerText = genState.t.toFixed(2);
            genDrawLatent();
        };
        if (tVal) tVal.innerText = genState.t.toFixed(2);
    }

    const noiseInput = document.getElementById('genNoise');
    const noiseVal = document.getElementById('genNoiseVal');
    const stepsInput = document.getElementById('genSteps');
    const stepsVal = document.getElementById('genStepsVal');

    if (noiseInput) {
        noiseInput.value = String(genState.noise);
        noiseInput.oninput = ev => {
            genState.noise = parseFloat(ev.target.value);
            if (noiseVal) noiseVal.innerText = genState.noise.toFixed(2);
            genResetDiffusion();
        };
        if (noiseVal) noiseVal.innerText = genState.noise.toFixed(2);
    }

    if (stepsInput) {
        stepsInput.value = String(genState.stepsPerTick);
        stepsInput.oninput = ev => {
            genState.stepsPerTick = parseInt(ev.target.value, 10);
            if (stepsVal) stepsVal.innerText = String(genState.stepsPerTick);
        };
        if (stepsVal) stepsVal.innerText = String(genState.stepsPerTick);
    }

    const startBtn = document.getElementById('genDiffStart');
    const pauseBtn = document.getElementById('genDiffPause');
    const stepBtn = document.getElementById('genDiffStep');
    const resetBtn = document.getElementById('genDiffReset');

    if (startBtn) {
        startBtn.onclick = () => {
            if (genState.timer) return;
            genState.timer = setInterval(() => {
                if (!genState.diffCanvas || !genState.diffCanvas.isConnected) {
                    genPauseDiffusion();
                    return;
                }
                genStepDiffusion();
            }, 120);
        };
    }
    if (pauseBtn) pauseBtn.onclick = () => genPauseDiffusion();
    if (stepBtn) stepBtn.onclick = () => genStepDiffusion();
    if (resetBtn) resetBtn.onclick = () => genResetDiffusion();

    genDrawLatent();
    genResetDiffusion();
};

// =============================================
// Chapter 7 - Hot architectures labs
// =============================================
const hotState = {
    ragCanvas: null,
    peftCanvas: null,
    chunk: 350,
    topK: 6,
    rerank: 0.6,
    modelB: 7,
    rank: 16,
    budget: 0.5
};

function hotClamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
}

function hotComputeRag() {
    const coverage = hotClamp(1 - Math.abs(hotState.chunk - 420) / 920 + 0.015 * hotState.topK, 0, 1);
    const precision = hotClamp(0.55 + 0.35 * hotState.rerank + 0.02 * Math.sqrt(hotState.topK) - 0.00035 * hotState.chunk, 0, 1);
    const latency = hotClamp(0.15 + (hotState.chunk / 1200) * 0.35 + (hotState.topK / 20) * 0.3 + hotState.rerank * 0.2, 0, 1);
    const global = hotClamp(0.2 + 0.45 * precision + 0.35 * coverage - 0.25 * latency, 0, 1);
    return { coverage, precision, latency, global };
}

function hotDrawBar(ctx, x, y, w, h, value, color, label) {
    ctx.fillStyle = 'rgba(100,116,139,0.3)';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = color;
    ctx.fillRect(x, y + h * (1 - value), w, h * value);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Arial';
    ctx.fillText(label, x, y - 8);
    ctx.fillText(value.toFixed(2), x + 4, y + h + 14);
}

function hotDrawRag() {
    if (!hotState.ragCanvas) return;
    const ctx = hotState.ragCanvas.getContext('2d');
    const w = hotState.ragCanvas.width;
    const h = hotState.ragCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const scores = hotComputeRag();

    const baseX = 70;
    const barW = 95;
    const gap = 40;
    const barH = 170;
    const y = 64;

    hotDrawBar(ctx, baseX + 0 * (barW + gap), y, barW, barH, scores.coverage, '#22d3ee', 'Coverage');
    hotDrawBar(ctx, baseX + 1 * (barW + gap), y, barW, barH, scores.precision, '#818cf8', 'Precision');
    hotDrawBar(ctx, baseX + 2 * (barW + gap), y, barW, barH, 1 - scores.latency, '#34d399', '1-Latency');
    hotDrawBar(ctx, baseX + 3 * (barW + gap), y, barW, barH, scores.global, '#f59e0b', 'Global');

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '12px Arial';
    ctx.fillText('RAG tradeoff simulator: quality vs speed', 12, 20);

    const coverageEl = document.getElementById('hotCoverage');
    const precisionEl = document.getElementById('hotPrecision');
    const latencyEl = document.getElementById('hotLatency');
    const globalEl = document.getElementById('hotGlobal');
    if (coverageEl) coverageEl.innerText = scores.coverage.toFixed(3);
    if (precisionEl) precisionEl.innerText = scores.precision.toFixed(3);
    if (latencyEl) latencyEl.innerText = scores.latency.toFixed(3);
    if (globalEl) globalEl.innerText = scores.global.toFixed(3);
}

function hotComputePeft() {
    const m = hotState.modelB;
    const rank = hotState.rank;
    const budget = hotState.budget;

    const fullVram = 2.6 * m;
    const peftVram = 0.35 * m + 0.02 * rank;
    const availVram = 80 * budget;

    const fullTime = 3.2 * m;
    const peftTime = 0.45 * m + 0.08 * rank;

    const fullQuality = hotClamp(0.86 + Math.min(0.08, 0.002 * m), 0, 1);
    const peftQuality = hotClamp(fullQuality - Math.max(0, 0.08 - 0.0006 * rank * Math.sqrt(m)), 0, 1);

    return {
        fullVram,
        peftVram,
        availVram,
        fullTime,
        peftTime,
        fullQuality,
        peftQuality
    };
}

function hotDrawMetricBars(ctx, x, y, label, fullVal, peftVal, maxVal) {
    const w = 180;
    const h = 18;

    const fullW = (fullVal / Math.max(1e-9, maxVal)) * w;
    const peftW = (peftVal / Math.max(1e-9, maxVal)) * w;

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Arial';
    ctx.fillText(label, x, y - 6);

    ctx.fillStyle = 'rgba(129,140,248,0.25)';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#818cf8';
    ctx.fillRect(x, y, fullW, h);

    ctx.fillStyle = 'rgba(34,197,94,0.25)';
    ctx.fillRect(x, y + 24, w, h);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(x, y + 24, peftW, h);

    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(`full ${fullVal.toFixed(2)}`, x + w + 8, y + 13);
    ctx.fillText(`peft ${peftVal.toFixed(2)}`, x + w + 8, y + 37);
}

function hotDrawPeft() {
    if (!hotState.peftCanvas) return;
    const ctx = hotState.peftCanvas.getContext('2d');
    const w = hotState.peftCanvas.width;
    const h = hotState.peftCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const m = hotComputePeft();

    hotDrawMetricBars(ctx, 26, 52, 'VRAM', m.fullVram, m.peftVram, Math.max(m.fullVram, m.peftVram, m.availVram));
    hotDrawMetricBars(ctx, 26, 132, 'Time', m.fullTime, m.peftTime, Math.max(m.fullTime, m.peftTime));
    hotDrawMetricBars(ctx, 26, 212, 'Quality', m.fullQuality, m.peftQuality, 1);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    const vramX = 26 + (m.availVram / Math.max(m.fullVram, m.peftVram, m.availVram)) * 180;
    ctx.beginPath();
    ctx.moveTo(vramX, 52);
    ctx.lineTo(vramX, 70);
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.font = '11px Arial';
    ctx.fillText(`budget ${m.availVram.toFixed(1)} GB`, vramX + 4, 49);

    const fullFits = m.fullVram <= m.availVram;
    const peftFits = m.peftVram <= m.availVram;

    let reco = 'Use PEFT';
    if (fullFits && m.fullQuality - m.peftQuality > 0.03) reco = 'Full FT possible';
    if (!peftFits) reco = 'Model too large for budget';

    const recoEl = document.getElementById('hotReco');
    if (recoEl) recoEl.innerText = reco;

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '12px Arial';
    ctx.fillText('indigo: full fine-tuning | green: PEFT', 320, 20);
}

window.initArchitecturesRechercheChaudeLab = function () {
    hotState.ragCanvas = document.getElementById('hotRagCanvas');
    hotState.peftCanvas = document.getElementById('hotPeftCanvas');
    if (!hotState.ragCanvas || !hotState.peftCanvas) return;

    const bindRange = (id, key, outId, decimals, drawFn) => {
        const input = document.getElementById(id);
        const out = document.getElementById(outId);
        if (!input) return;
        input.value = String(hotState[key]);
        if (out) out.innerText = hotState[key].toFixed(decimals);
        input.oninput = ev => {
            hotState[key] = parseFloat(ev.target.value);
            if (out) out.innerText = hotState[key].toFixed(decimals);
            drawFn();
        };
    };

    bindRange('hotChunk', 'chunk', 'hotChunkVal', 0, hotDrawRag);
    bindRange('hotTopK', 'topK', 'hotTopKVal', 0, hotDrawRag);
    bindRange('hotRerank', 'rerank', 'hotRerankVal', 2, hotDrawRag);

    bindRange('hotModel', 'modelB', 'hotModelVal', 0, hotDrawPeft);
    bindRange('hotRank', 'rank', 'hotRankVal', 0, hotDrawPeft);
    bindRange('hotBudget', 'budget', 'hotBudgetVal', 2, hotDrawPeft);

    hotDrawRag();
    hotDrawPeft();
};

// =============================================
// Chapter 8 - RL robotics control labs
// =============================================
const rlxState = {
    bellmanCanvas: null,
    policyCanvas: null,
    gamma: 0.9,
    rewardTerminal: 1.0,
    values: [0, 0, 0, 0],
    iter: 0,
    bellmanTimer: null,
    theta: 0,
    lr: 0.08,
    expl: 0.05,
    avgReward: 0,
    steps: 0,
    rewardHist: [],
    pgTimer: null
};

function rlxSigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function rlxValueIterStep() {
    const v = rlxState.values;
    const vn = v.slice();

    for (let s = 0; s < 3; s += 1) {
        const nextForward = Math.min(3, s + 1);
        const nextBackward = Math.max(0, s - 1);

        const rF = nextForward === 3 ? rlxState.rewardTerminal : -0.02;
        const rB = nextBackward === 3 ? rlxState.rewardTerminal : -0.02;

        const qF = rF + rlxState.gamma * v[nextForward];
        const qB = rB + rlxState.gamma * v[nextBackward];

        vn[s] = Math.max(qF, qB);
    }
    vn[3] = 0;

    rlxState.values = vn;
    rlxState.iter += 1;
    rlxDrawBellman();
}

function rlxDrawBellman() {
    if (!rlxState.bellmanCanvas) return;
    const ctx = rlxState.bellmanCanvas.getContext('2d');
    const w = rlxState.bellmanCanvas.width;
    const h = rlxState.bellmanCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const xs = [90, 250, 410, 570];
    const y = 155;

    for (let i = 0; i < 3; i += 1) {
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xs[i] + 34, y);
        ctx.lineTo(xs[i + 1] - 34, y);
        ctx.stroke();
    }

    for (let s = 0; s < 4; s += 1) {
        const isTerminal = s === 3;
        ctx.fillStyle = isTerminal ? 'rgba(34,197,94,0.28)' : 'rgba(129,140,248,0.26)';
        ctx.strokeStyle = isTerminal ? '#22c55e' : '#818cf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(xs[s], y, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(`S${s}`, xs[s] - 10, y - 36);
        ctx.fillText(rlxState.values[s].toFixed(3), xs[s] - 22, y + 5);
    }

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '12px Arial';
    ctx.fillText('Value iteration in tiny chain MDP', 12, 20);

    const iterEl = document.getElementById('rlIterVal');
    if (iterEl) iterEl.innerText = String(rlxState.iter);
}

function rlxResetBellman() {
    if (rlxState.bellmanTimer) {
        clearInterval(rlxState.bellmanTimer);
        rlxState.bellmanTimer = null;
    }
    rlxState.values = [0, 0, 0, 0];
    rlxState.iter = 0;
    rlxDrawBellman();
}

function rlxRandn() {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function rlxPolicyStep() {
    const pi1 = rlxSigmoid(rlxState.theta);
    const action = Math.random() < pi1 ? 1 : 0;
    const mean = action === 1 ? 0.72 : 0.35;
    const reward = hotClamp(mean + 0.15 * rlxRandn(), 0, 1);

    rlxState.avgReward = 0.97 * rlxState.avgReward + 0.03 * reward;
    const advantage = reward - rlxState.avgReward;

    const gradLog = action === 1 ? (1 - pi1) : -pi1;
    const entropyPush = rlxState.expl * (0.5 - pi1);

    rlxState.theta += rlxState.lr * (advantage * gradLog + entropyPush);

    rlxState.steps += 1;
    rlxState.rewardHist.push(reward);
    if (rlxState.rewardHist.length > 180) rlxState.rewardHist.shift();

    rlxDrawPolicy();
}

function rlxDrawPolicy() {
    if (!rlxState.policyCanvas) return;
    const ctx = rlxState.policyCanvas.getContext('2d');
    const w = rlxState.policyCanvas.width;
    const h = rlxState.policyCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const pi1 = rlxSigmoid(rlxState.theta);
    const pi0 = 1 - pi1;

    ctx.fillStyle = '#818cf8';
    ctx.fillRect(28, 56, 170 * pi0, 20);
    ctx.fillStyle = '#22d3ee';
    ctx.fillRect(28, 88, 170 * pi1, 20);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Arial';
    ctx.fillText('pi(a0)', 206, 71);
    ctx.fillText('pi(a1)', 206, 103);

    const hist = rlxState.rewardHist.length ? rlxState.rewardHist : [0];
    const maxY = 1;
    const tx = i => 280 + (i / Math.max(1, hist.length - 1)) * (w - 300);
    const ty = y => h - 20 - (y / maxY) * 130;

    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2;
    ctx.beginPath();
    hist.forEach((v, i) => {
        if (i === 0) ctx.moveTo(tx(i), ty(v));
        else ctx.lineTo(tx(i), ty(v));
    });
    ctx.stroke();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '12px Arial';
    ctx.fillText('reward history', 280, 42);

    const pi0El = document.getElementById('rlPi0');
    const pi1El = document.getElementById('rlPi1');
    const avgEl = document.getElementById('rlAvgR');
    if (pi0El) pi0El.innerText = pi0.toFixed(3);
    if (pi1El) pi1El.innerText = pi1.toFixed(3);
    if (avgEl) avgEl.innerText = rlxState.avgReward.toFixed(3);
}

function rlxResetPolicy() {
    if (rlxState.pgTimer) {
        clearInterval(rlxState.pgTimer);
        rlxState.pgTimer = null;
    }
    rlxState.theta = 0;
    rlxState.avgReward = 0;
    rlxState.steps = 0;
    rlxState.rewardHist = [];
    rlxDrawPolicy();
}

window.initRlRobotiqueControleLab = function () {
    if (rlxState.bellmanTimer) {
        clearInterval(rlxState.bellmanTimer);
        rlxState.bellmanTimer = null;
    }
    if (rlxState.pgTimer) {
        clearInterval(rlxState.pgTimer);
        rlxState.pgTimer = null;
    }

    rlxState.bellmanCanvas = document.getElementById('rlBellmanCanvas');
    rlxState.policyCanvas = document.getElementById('rlPolicyCanvas');
    if (!rlxState.bellmanCanvas || !rlxState.policyCanvas) return;

    const gamma = document.getElementById('rlGamma');
    const gammaVal = document.getElementById('rlGammaVal');
    const rew = document.getElementById('rlReward');
    const rewVal = document.getElementById('rlRewardVal');

    if (gamma) {
        gamma.value = String(rlxState.gamma);
        gamma.oninput = ev => {
            rlxState.gamma = parseFloat(ev.target.value);
            if (gammaVal) gammaVal.innerText = rlxState.gamma.toFixed(2);
            rlxDrawBellman();
        };
        if (gammaVal) gammaVal.innerText = rlxState.gamma.toFixed(2);
    }

    if (rew) {
        rew.value = String(rlxState.rewardTerminal);
        rew.oninput = ev => {
            rlxState.rewardTerminal = parseFloat(ev.target.value);
            if (rewVal) rewVal.innerText = rlxState.rewardTerminal.toFixed(2);
            rlxDrawBellman();
        };
        if (rewVal) rewVal.innerText = rlxState.rewardTerminal.toFixed(2);
    }

    const bStep = document.getElementById('rlBellmanStep');
    const bAuto = document.getElementById('rlBellmanAuto');
    const bPause = document.getElementById('rlBellmanPause');
    const bReset = document.getElementById('rlBellmanReset');

    if (bStep) bStep.onclick = () => rlxValueIterStep();
    if (bAuto) {
        bAuto.onclick = () => {
            if (rlxState.bellmanTimer) return;
            rlxState.bellmanTimer = setInterval(() => {
                if (!rlxState.bellmanCanvas || !rlxState.bellmanCanvas.isConnected) {
                    clearInterval(rlxState.bellmanTimer);
                    rlxState.bellmanTimer = null;
                    return;
                }
                rlxValueIterStep();
            }, 180);
        };
    }
    if (bPause) bPause.onclick = () => {
        if (rlxState.bellmanTimer) {
            clearInterval(rlxState.bellmanTimer);
            rlxState.bellmanTimer = null;
        }
    };
    if (bReset) bReset.onclick = () => rlxResetBellman();

    const pgLr = document.getElementById('rlPgLr');
    const pgLrVal = document.getElementById('rlPgLrVal');
    const expl = document.getElementById('rlExpl');
    const explVal = document.getElementById('rlExplVal');

    if (pgLr) {
        pgLr.value = String(rlxState.lr);
        pgLr.oninput = ev => {
            rlxState.lr = parseFloat(ev.target.value);
            if (pgLrVal) pgLrVal.innerText = rlxState.lr.toFixed(3);
        };
        if (pgLrVal) pgLrVal.innerText = rlxState.lr.toFixed(3);
    }

    if (expl) {
        expl.value = String(rlxState.expl);
        expl.oninput = ev => {
            rlxState.expl = parseFloat(ev.target.value);
            if (explVal) explVal.innerText = rlxState.expl.toFixed(2);
        };
        if (explVal) explVal.innerText = rlxState.expl.toFixed(2);
    }

    const pStep = document.getElementById('rlPgStep');
    const pAuto = document.getElementById('rlPgAuto');
    const pPause = document.getElementById('rlPgPause');
    const pReset = document.getElementById('rlPgReset');

    if (pStep) pStep.onclick = () => rlxPolicyStep();
    if (pAuto) {
        pAuto.onclick = () => {
            if (rlxState.pgTimer) return;
            rlxState.pgTimer = setInterval(() => {
                if (!rlxState.policyCanvas || !rlxState.policyCanvas.isConnected) {
                    clearInterval(rlxState.pgTimer);
                    rlxState.pgTimer = null;
                    return;
                }
                rlxPolicyStep();
            }, 120);
        };
    }
    if (pPause) pPause.onclick = () => {
        if (rlxState.pgTimer) {
            clearInterval(rlxState.pgTimer);
            rlxState.pgTimer = null;
        }
    };
    if (pReset) pReset.onclick = () => rlxResetPolicy();

    rlxResetBellman();
    rlxResetPolicy();
};

// =============================================
// Chapter 9 - Graph labs
// =============================================
const graphState = {
    propCanvas: null,
    linkCanvas: null,
    nodes: [
        { x: 120, y: 90 },
        { x: 250, y: 60 },
        { x: 390, y: 85 },
        { x: 540, y: 70 },
        { x: 170, y: 220 },
        { x: 320, y: 210 },
        { x: 470, y: 230 },
        { x: 610, y: 210 }
    ],
    edges: [
        [0, 1], [1, 2], [2, 3], [0, 4], [1, 5], [2, 5], [2, 6], [3, 6], [4, 5], [5, 6], [6, 7]
    ],
    src: 0,
    steps: 2,
    a: 1,
    b: 6
};

function graphNeighbors(n) {
    const map = Array.from({ length: n }, () => []);
    graphState.edges.forEach(([u, v]) => {
        map[u].push(v);
        map[v].push(u);
    });
    return map;
}

function graphPropagate() {
    const n = graphState.nodes.length;
    const neigh = graphNeighbors(n);
    let h = Array.from({ length: n }, (_, i) => (i === graphState.src ? 1 : 0));

    for (let step = 0; step < graphState.steps; step += 1) {
        const next = new Array(n).fill(0);
        for (let i = 0; i < n; i += 1) {
            const ns = neigh[i];
            const mean = ns.length ? ns.reduce((acc, j) => acc + h[j], 0) / ns.length : h[i];
            next[i] = 0.25 * h[i] + 0.75 * mean;
        }
        h = next;
    }

    const max = Math.max(...h, 1e-9);
    return h.map(v => v / max);
}

function graphDrawBase(ctx, canvas, title) {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '12px Arial';
    ctx.fillText(title, 12, 20);

    ctx.strokeStyle = 'rgba(148,163,184,0.45)';
    ctx.lineWidth = 1.8;
    graphState.edges.forEach(([u, v]) => {
        ctx.beginPath();
        ctx.moveTo(graphState.nodes[u].x, graphState.nodes[u].y);
        ctx.lineTo(graphState.nodes[v].x, graphState.nodes[v].y);
        ctx.stroke();
    });
}

function graphDrawPropagation() {
    if (!graphState.propCanvas) return;
    const ctx = graphState.propCanvas.getContext('2d');
    graphDrawBase(ctx, graphState.propCanvas, 'Message passing intensity');

    const intens = graphPropagate();
    for (let i = 0; i < graphState.nodes.length; i += 1) {
        const p = graphState.nodes[i];
        const v = intens[i];
        const r = Math.floor(40 + 30 * v);
        const g = Math.floor(120 + 120 * v);
        const b = Math.floor(180 + 60 * v);

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.strokeStyle = i === graphState.src ? '#f59e0b' : '#e2e8f0';
        ctx.lineWidth = i === graphState.src ? 3 : 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(String(i), p.x - 4, p.y + 4);
    }
}

function graphJaccardScore(a, b) {
    const neigh = graphNeighbors(graphState.nodes.length);
    const na = new Set(neigh[a]);
    const nb = new Set(neigh[b]);
    const common = [...na].filter(x => nb.has(x));
    const union = new Set([...na, ...nb]);
    const score = union.size ? common.length / union.size : 0;
    return { score, common: common.length, commonSet: new Set(common) };
}

function graphDrawLink() {
    if (!graphState.linkCanvas) return;
    const ctx = graphState.linkCanvas.getContext('2d');
    graphDrawBase(ctx, graphState.linkCanvas, 'Link prediction (neighbors overlap)');

    const { score, common, commonSet } = graphJaccardScore(graphState.a, graphState.b);

    for (let i = 0; i < graphState.nodes.length; i += 1) {
        const p = graphState.nodes[i];
        let fill = 'rgba(129,140,248,0.65)';
        let stroke = '#e2e8f0';
        let lw = 1.6;

        if (i === graphState.a || i === graphState.b) {
            fill = 'rgba(249,115,22,0.75)';
            stroke = '#f59e0b';
            lw = 3;
        } else if (commonSet.has(i)) {
            fill = 'rgba(34,197,94,0.75)';
            stroke = '#22c55e';
            lw = 2.2;
        }

        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lw;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 21, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(String(i), p.x - 4, p.y + 4);
    }

    ctx.strokeStyle = 'rgba(249,115,22,0.8)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(graphState.nodes[graphState.a].x, graphState.nodes[graphState.a].y);
    ctx.lineTo(graphState.nodes[graphState.b].x, graphState.nodes[graphState.b].y);
    ctx.stroke();
    ctx.setLineDash([]);

    const scoreEl = document.getElementById('graphLinkScore');
    const commonEl = document.getElementById('graphCommon');
    if (scoreEl) scoreEl.innerText = score.toFixed(3);
    if (commonEl) commonEl.innerText = String(common);
}

window.initGraphesLab = function () {
    graphState.propCanvas = document.getElementById('graphPropCanvas');
    graphState.linkCanvas = document.getElementById('graphLinkCanvas');
    if (!graphState.propCanvas || !graphState.linkCanvas) return;

    const src = document.getElementById('graphSrc');
    const srcVal = document.getElementById('graphSrcVal');
    const steps = document.getElementById('graphSteps');
    const stepsVal = document.getElementById('graphStepsVal');
    const refresh = document.getElementById('graphPropRefresh');

    if (src) {
        src.value = String(graphState.src);
        src.oninput = ev => {
            graphState.src = parseInt(ev.target.value, 10);
            if (srcVal) srcVal.innerText = String(graphState.src);
            graphDrawPropagation();
        };
        if (srcVal) srcVal.innerText = String(graphState.src);
    }

    if (steps) {
        steps.value = String(graphState.steps);
        steps.oninput = ev => {
            graphState.steps = parseInt(ev.target.value, 10);
            if (stepsVal) stepsVal.innerText = String(graphState.steps);
            graphDrawPropagation();
        };
        if (stepsVal) stepsVal.innerText = String(graphState.steps);
    }

    if (refresh) refresh.onclick = () => graphDrawPropagation();

    const a = document.getElementById('graphA');
    const aVal = document.getElementById('graphAVal');
    const b = document.getElementById('graphB');
    const bVal = document.getElementById('graphBVal');

    if (a) {
        a.value = String(graphState.a);
        a.oninput = ev => {
            graphState.a = parseInt(ev.target.value, 10);
            if (aVal) aVal.innerText = String(graphState.a);
            graphDrawLink();
        };
        if (aVal) aVal.innerText = String(graphState.a);
    }

    if (b) {
        b.value = String(graphState.b);
        b.oninput = ev => {
            graphState.b = parseInt(ev.target.value, 10);
            if (bVal) bVal.innerText = String(graphState.b);
            graphDrawLink();
        };
        if (bVal) bVal.innerText = String(graphState.b);
    }

    graphDrawPropagation();
    graphDrawLink();
};

// =============================================
// Chapter 10 - Self-supervised labs
// =============================================
const sslState = {
    contrastCanvas: null,
    maskCanvas: null,
    tau: 0.4,
    noise: 0.25,
    pairs: [],
    signal: [],
    masked: [],
    recon: [],
    maskRatio: 0.3,
    smooth: 0.35
};

function sslRandn() {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function sslGeneratePairs() {
    const pairs = [];
    for (let i = 0; i < 16; i += 1) {
        const bx = (Math.random() - 0.5) * 2.2;
        const by = (Math.random() - 0.5) * 2.2;
        const ax = bx + sslState.noise * sslRandn();
        const ay = by + sslState.noise * sslRandn();
        pairs.push({ a: { x: ax, y: ay }, b: { x: bx, y: by } });
    }
    sslState.pairs = pairs;
}

function sslCosSim(u, v) {
    const dot = u.x * v.x + u.y * v.y;
    const nu = Math.sqrt(u.x * u.x + u.y * u.y);
    const nv = Math.sqrt(v.x * v.x + v.y * v.y);
    return dot / Math.max(1e-8, nu * nv);
}

function sslLossProxy() {
    if (!sslState.pairs.length) return 0;
    const vals = sslState.pairs.map(p => {
        const pos = Math.exp(sslCosSim(p.a, p.b) / Math.max(0.05, sslState.tau));
        const neg = 4 + Math.exp((-sslCosSim(p.a, { x: -p.b.x, y: -p.b.y })) / Math.max(0.05, sslState.tau));
        return -Math.log(pos / (pos + neg));
    });
    return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function sslDrawContrast() {
    if (!sslState.contrastCanvas) return;
    const ctx = sslState.contrastCanvas.getContext('2d');
    const w = sslState.contrastCanvas.width;
    const h = sslState.contrastCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const toX = x => w * 0.5 + x * 120;
    const toY = y => h * 0.52 - y * 95;

    ctx.strokeStyle = 'rgba(148,163,184,0.35)';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.52);
    ctx.lineTo(w, h * 0.52);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w * 0.5, 0);
    ctx.lineTo(w * 0.5, h);
    ctx.stroke();

    sslState.pairs.forEach(p => {
        ctx.strokeStyle = 'rgba(34,197,94,0.5)';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(toX(p.a.x), toY(p.a.y));
        ctx.lineTo(toX(p.b.x), toY(p.b.y));
        ctx.stroke();

        ctx.fillStyle = '#22d3ee';
        ctx.beginPath();
        ctx.arc(toX(p.a.x), toY(p.a.y), 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#a78bfa';
        ctx.beginPath();
        ctx.arc(toX(p.b.x), toY(p.b.y), 4, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Arial';
    ctx.fillText('cyan/viollet = augmentations positives', 12, 20);

    const lossEl = document.getElementById('sslLoss');
    if (lossEl) lossEl.innerText = sslLossProxy().toFixed(4);
}

function sslBuildSignal() {
    const n = 160;
    sslState.signal = [];
    for (let i = 0; i < n; i += 1) {
        const t = i / (n - 1);
        sslState.signal.push(0.6 * Math.sin(2 * Math.PI * 1.7 * t) + 0.25 * Math.cos(2 * Math.PI * 5.1 * t));
    }

    sslState.masked = sslState.signal.slice();
    for (let i = 0; i < n; i += 1) {
        if (Math.random() < sslState.maskRatio) sslState.masked[i] = NaN;
    }

    sslState.recon = sslState.masked.slice();
    for (let i = 0; i < n; i += 1) {
        if (Number.isNaN(sslState.recon[i])) sslState.recon[i] = 0;
    }

    const smoothIters = Math.max(1, Math.round(4 + sslState.smooth * 14));
    for (let it = 0; it < smoothIters; it += 1) {
        const next = sslState.recon.slice();
        for (let i = 1; i < n - 1; i += 1) {
            if (Number.isNaN(sslState.masked[i])) {
                next[i] = 0.2 * sslState.recon[i - 1] + 0.6 * sslState.recon[i] + 0.2 * sslState.recon[i + 1];
            } else {
                next[i] = sslState.signal[i];
            }
        }
        sslState.recon = next;
    }
}

function sslReconstructionError() {
    let s = 0;
    let c = 0;
    for (let i = 0; i < sslState.signal.length; i += 1) {
        if (Number.isNaN(sslState.masked[i])) {
            s += Math.abs(sslState.signal[i] - sslState.recon[i]);
            c += 1;
        }
    }
    return c ? s / c : 0;
}

function sslDrawLine(ctx, arr, color, w, h, yMin, yMax) {
    const tx = i => 12 + (i / (arr.length - 1)) * (w - 24);
    const ty = y => h - 12 - ((y - yMin) / Math.max(1e-8, yMax - yMin)) * (h - 24);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    arr.forEach((v, i) => {
        if (i === 0) ctx.moveTo(tx(i), ty(v));
        else ctx.lineTo(tx(i), ty(v));
    });
    ctx.stroke();
}

function sslDrawMask() {
    if (!sslState.maskCanvas) return;
    const ctx = sslState.maskCanvas.getContext('2d');
    const w = sslState.maskCanvas.width;
    const h = sslState.maskCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const all = [...sslState.signal, ...sslState.recon];
    const yMin = Math.min(...all) - 0.2;
    const yMax = Math.max(...all) + 0.2;

    sslDrawLine(ctx, sslState.signal, '#22c55e', w, h, yMin, yMax);
    sslDrawLine(ctx, sslState.recon, '#60a5fa', w, h, yMin, yMax);

    const n = sslState.signal.length;
    const tx = i => 12 + (i / (n - 1)) * (w - 24);
    ctx.strokeStyle = 'rgba(249,115,22,0.6)';
    for (let i = 0; i < n; i += 1) {
        if (Number.isNaN(sslState.masked[i])) {
            const x = tx(i);
            ctx.beginPath();
            ctx.moveTo(x, 24);
            ctx.lineTo(x, h - 24);
            ctx.stroke();
        }
    }

    const errEl = document.getElementById('sslRecErr');
    if (errEl) errEl.innerText = sslReconstructionError().toFixed(4);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Arial';
    ctx.fillText('vert: signal original | bleu: reconstruction | orange: zones masquees', 12, 20);
}

window.initAutoSuperviseRepresentationLab = function () {
    sslState.contrastCanvas = document.getElementById('sslContrastCanvas');
    sslState.maskCanvas = document.getElementById('sslMaskCanvas');
    if (!sslState.contrastCanvas || !sslState.maskCanvas) return;

    const tau = document.getElementById('sslTau');
    const tauVal = document.getElementById('sslTauVal');
    const noise = document.getElementById('sslNoise');
    const noiseVal = document.getElementById('sslNoiseVal');
    const refresh = document.getElementById('sslRefresh');

    if (tau) {
        tau.value = String(sslState.tau);
        tau.oninput = ev => {
            sslState.tau = parseFloat(ev.target.value);
            if (tauVal) tauVal.innerText = sslState.tau.toFixed(2);
            sslDrawContrast();
        };
        if (tauVal) tauVal.innerText = sslState.tau.toFixed(2);
    }

    if (noise) {
        noise.value = String(sslState.noise);
        noise.oninput = ev => {
            sslState.noise = parseFloat(ev.target.value);
            if (noiseVal) noiseVal.innerText = sslState.noise.toFixed(2);
            sslGeneratePairs();
            sslDrawContrast();
        };
        if (noiseVal) noiseVal.innerText = sslState.noise.toFixed(2);
    }

    if (refresh) {
        refresh.onclick = () => {
            sslGeneratePairs();
            sslDrawContrast();
        };
    }

    const maskRatio = document.getElementById('sslMaskRatio');
    const maskRatioVal = document.getElementById('sslMaskRatioVal');
    const smooth = document.getElementById('sslSmooth');
    const smoothVal = document.getElementById('sslSmoothVal');
    const regen = document.getElementById('sslMaskRegen');

    if (maskRatio) {
        maskRatio.value = String(sslState.maskRatio);
        maskRatio.oninput = ev => {
            sslState.maskRatio = parseFloat(ev.target.value);
            if (maskRatioVal) maskRatioVal.innerText = sslState.maskRatio.toFixed(2);
            sslBuildSignal();
            sslDrawMask();
        };
        if (maskRatioVal) maskRatioVal.innerText = sslState.maskRatio.toFixed(2);
    }

    if (smooth) {
        smooth.value = String(sslState.smooth);
        smooth.oninput = ev => {
            sslState.smooth = parseFloat(ev.target.value);
            if (smoothVal) smoothVal.innerText = sslState.smooth.toFixed(2);
            sslBuildSignal();
            sslDrawMask();
        };
        if (smoothVal) smoothVal.innerText = sslState.smooth.toFixed(2);
    }

    if (regen) {
        regen.onclick = () => {
            sslBuildSignal();
            sslDrawMask();
        };
    }

    sslGeneratePairs();
    sslDrawContrast();
    sslBuildSignal();
    sslDrawMask();
};

// =============================================
// Chapter 11 - Probabilistic inference labs
// =============================================
const probState = {
    bayesCanvas: null,
    mcmcCanvas: null,
    alpha: 2,
    beta: 2,
    succ: 12,
    fail: 8,
    sigma: 0.8,
    iterTick: 5,
    x: 0,
    accepted: 0,
    total: 0,
    samples: [],
    mcmcTimer: null
};

function probBetaPdf(x, a, b) {
    const xx = Math.max(1e-6, Math.min(1 - 1e-6, x));
    return Math.pow(xx, a - 1) * Math.pow(1 - xx, b - 1);
}

function probDrawBayes() {
    if (!probState.bayesCanvas) return;
    const ctx = probState.bayesCanvas.getContext('2d');
    const w = probState.bayesCanvas.width;
    const h = probState.bayesCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const aPost = probState.alpha + probState.succ;
    const bPost = probState.beta + probState.fail;

    const n = 180;
    const xs = Array.from({ length: n }, (_, i) => i / (n - 1));
    const prior = xs.map(x => probBetaPdf(x, probState.alpha, probState.beta));
    const post = xs.map(x => probBetaPdf(x, aPost, bPost));

    const maxY = Math.max(...prior, ...post);
    const tx = x => 20 + x * (w - 40);
    const ty = y => h - 20 - (y / Math.max(1e-9, maxY)) * (h - 50);

    const drawCurve = (arr, color) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        arr.forEach((v, i) => {
            const x = tx(xs[i]);
            const y = ty(v);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
    };

    drawCurve(prior, '#94a3b8');
    drawCurve(post, '#22d3ee');

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Arial';
    ctx.fillText('gris: prior | cyan: posterior', 12, 20);

    const postMean = aPost / (aPost + bPost);
    const postEl = document.getElementById('probPostMean');
    if (postEl) postEl.innerText = postMean.toFixed(4);
}

function probTargetDensity(x) {
    const g1 = Math.exp(-0.5 * Math.pow((x + 2.1) / 0.9, 2));
    const g2 = 0.8 * Math.exp(-0.5 * Math.pow((x - 1.6) / 0.65, 2));
    return g1 + g2;
}

function probMcmcStepOne() {
    const proposal = probState.x + probState.sigma * sslRandn();
    const pOld = probTargetDensity(probState.x);
    const pNew = probTargetDensity(proposal);
    const acc = Math.min(1, pNew / Math.max(1e-9, pOld));

    if (Math.random() < acc) {
        probState.x = proposal;
        probState.accepted += 1;
    }
    probState.total += 1;

    probState.samples.push(probState.x);
    if (probState.samples.length > 650) probState.samples.shift();
}

function probMcmcTick() {
    for (let i = 0; i < probState.iterTick; i += 1) probMcmcStepOne();
    probDrawMcmc();
}

function probDrawMcmc() {
    if (!probState.mcmcCanvas) return;
    const ctx = probState.mcmcCanvas.getContext('2d');
    const w = probState.mcmcCanvas.width;
    const h = probState.mcmcCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const xMin = -5;
    const xMax = 5;
    const tx = x => 20 + ((x - xMin) / (xMax - xMin)) * (w - 40);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, h - 22);
    ctx.lineTo(w - 20, h - 22);
    ctx.stroke();

    const bins = 28;
    const hist = Array.from({ length: bins }, () => 0);
    probState.samples.forEach(s => {
        const idx = Math.floor(((s - xMin) / (xMax - xMin)) * bins);
        if (idx >= 0 && idx < bins) hist[idx] += 1;
    });
    const maxC = Math.max(1, ...hist);

    for (let i = 0; i < bins; i += 1) {
        const x0 = 20 + (i / bins) * (w - 40);
        const bw = (w - 40) / bins - 2;
        const hh = (hist[i] / maxC) * (h - 70);
        ctx.fillStyle = 'rgba(129,140,248,0.75)';
        ctx.fillRect(x0, h - 22 - hh, bw, hh);
    }

    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 220; i += 1) {
        const x = xMin + (xMax - xMin) * (i / 220);
        const y = probTargetDensity(x);
        const yy = h - 22 - (y / 1.2) * (h - 70);
        if (i === 0) ctx.moveTo(tx(x), yy);
        else ctx.lineTo(tx(x), yy);
    }
    ctx.stroke();

    const accRate = probState.total ? probState.accepted / probState.total : 0;
    const accEl = document.getElementById('probAccRate');
    if (accEl) accEl.innerText = accRate.toFixed(3);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Arial';
    ctx.fillText('violet histogram: samples | cyan curve: target density', 12, 20);
}

function probResetMcmc() {
    if (probState.mcmcTimer) {
        clearInterval(probState.mcmcTimer);
        probState.mcmcTimer = null;
    }
    probState.x = 0;
    probState.accepted = 0;
    probState.total = 0;
    probState.samples = [];
    probDrawMcmc();
}

window.initInferenceProbabilisteStructuresLab = function () {
    if (probState.mcmcTimer) {
        clearInterval(probState.mcmcTimer);
        probState.mcmcTimer = null;
    }

    probState.bayesCanvas = document.getElementById('probBayesCanvas');
    probState.mcmcCanvas = document.getElementById('probMcmcCanvas');
    if (!probState.bayesCanvas || !probState.mcmcCanvas) return;

    const bindBayes = (id, key, outId) => {
        const input = document.getElementById(id);
        const out = document.getElementById(outId);
        if (!input) return;
        input.value = String(probState[key]);
        if (out) out.innerText = String(probState[key]);
        input.oninput = ev => {
            probState[key] = parseInt(ev.target.value, 10);
            if (out) out.innerText = String(probState[key]);
            probDrawBayes();
        };
    };

    bindBayes('probAlpha', 'alpha', 'probAlphaVal');
    bindBayes('probBeta', 'beta', 'probBetaVal');
    bindBayes('probSucc', 'succ', 'probSuccVal');
    bindBayes('probFail', 'fail', 'probFailVal');

    const sigma = document.getElementById('probSigma');
    const sigmaVal = document.getElementById('probSigmaVal');
    const iterTick = document.getElementById('probIterTick');
    const iterTickVal = document.getElementById('probIterTickVal');

    if (sigma) {
        sigma.value = String(probState.sigma);
        sigma.oninput = ev => {
            probState.sigma = parseFloat(ev.target.value);
            if (sigmaVal) sigmaVal.innerText = probState.sigma.toFixed(2);
        };
        if (sigmaVal) sigmaVal.innerText = probState.sigma.toFixed(2);
    }

    if (iterTick) {
        iterTick.value = String(probState.iterTick);
        iterTick.oninput = ev => {
            probState.iterTick = parseInt(ev.target.value, 10);
            if (iterTickVal) iterTickVal.innerText = String(probState.iterTick);
        };
        if (iterTickVal) iterTickVal.innerText = String(probState.iterTick);
    }

    const start = document.getElementById('probMcmcStart');
    const pause = document.getElementById('probMcmcPause');
    const step = document.getElementById('probMcmcStep');
    const reset = document.getElementById('probMcmcReset');

    if (start) {
        start.onclick = () => {
            if (probState.mcmcTimer) return;
            probState.mcmcTimer = setInterval(() => {
                if (!probState.mcmcCanvas || !probState.mcmcCanvas.isConnected) {
                    clearInterval(probState.mcmcTimer);
                    probState.mcmcTimer = null;
                    return;
                }
                probMcmcTick();
            }, 130);
        };
    }
    if (pause) pause.onclick = () => {
        if (probState.mcmcTimer) {
            clearInterval(probState.mcmcTimer);
            probState.mcmcTimer = null;
        }
    };
    if (step) step.onclick = () => probMcmcTick();
    if (reset) reset.onclick = () => probResetMcmc();

    probDrawBayes();
    probResetMcmc();
};

// =============================================
// Chapter 12 - Theorems and equations labs
// =============================================
const thmState = {
    biasCanvas: null,
    attnCanvas: null,
    comp: 0.5,
    noise: 0.18,
    s1: 1.2,
    s2: 0.4,
    dk: 64
};

function thmBiasVar(comp, noise) {
    const bias2 = Math.pow(1 - comp, 2) * 0.9;
    const variance = Math.pow(comp, 2) * 0.9;
    const err = bias2 + variance + noise;
    return { bias2, variance, err };
}

function thmDrawBiasVar() {
    if (!thmState.biasCanvas) return;
    const ctx = thmState.biasCanvas.getContext('2d');
    const w = thmState.biasCanvas.width;
    const h = thmState.biasCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const m = thmBiasVar(thmState.comp, thmState.noise);
    const maxV = Math.max(0.2, m.err);

    const drawB = (x, v, color, label) => {
        const bw = 130;
        const bh = (v / maxV) * 170;
        ctx.fillStyle = color;
        ctx.fillRect(x, 230 - bh, bw, bh);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '12px Arial';
        ctx.fillText(label, x, 246);
        ctx.fillText(v.toFixed(3), x + 2, 230 - bh - 8);
    };

    drawB(80, m.bias2, '#22d3ee', 'Bias^2');
    drawB(270, m.variance, '#818cf8', 'Variance');
    drawB(460, m.err, '#f59e0b', 'Total error');

    const biasEl = document.getElementById('thmBiasVal');
    const varEl = document.getElementById('thmVarVal');
    const errEl = document.getElementById('thmErrVal');
    if (biasEl) biasEl.innerText = m.bias2.toFixed(3);
    if (varEl) varEl.innerText = m.variance.toFixed(3);
    if (errEl) errEl.innerText = m.err.toFixed(3);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '12px Arial';
    ctx.fillText('Tradeoff: plus de complexite -> moins de biais mais plus de variance', 12, 20);
}

function thmSoftmax2(s1, s2, dk) {
    const scale = Math.sqrt(Math.max(1, dk));
    const a = s1 / scale;
    const b = s2 / scale;
    const ea = Math.exp(a - Math.max(a, b));
    const eb = Math.exp(b - Math.max(a, b));
    const z = ea + eb;
    return { p1: ea / z, p2: eb / z };
}

function thmDrawAttention() {
    if (!thmState.attnCanvas) return;
    const ctx = thmState.attnCanvas.getContext('2d');
    const w = thmState.attnCanvas.width;
    const h = thmState.attnCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const probs = thmSoftmax2(thmState.s1, thmState.s2, thmState.dk);

    const draw = (x, label, val, color) => {
        const bw = 170;
        const bh = 180;
        ctx.fillStyle = 'rgba(100,116,139,0.3)';
        ctx.fillRect(x, 52, bw, bh);
        ctx.fillStyle = color;
        ctx.fillRect(x, 52 + bh * (1 - val), bw, bh * val);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '12px Arial';
        ctx.fillText(label, x, 42);
        ctx.fillText(val.toFixed(3), x + 2, 250);
    };

    draw(120, 'softmax(s1)', probs.p1, '#22d3ee');
    draw(420, 'softmax(s2)', probs.p2, '#818cf8');

    const p1El = document.getElementById('thmP1');
    const p2El = document.getElementById('thmP2');
    if (p1El) p1El.innerText = probs.p1.toFixed(4);
    if (p2El) p2El.innerText = probs.p2.toFixed(4);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '12px Arial';
    ctx.fillText('Baisse de temperature implicite quand d_k diminue', 12, 20);
}

window.initTheoremesEquationsLab = function () {
    thmState.biasCanvas = document.getElementById('thmBiasVarCanvas');
    thmState.attnCanvas = document.getElementById('thmAttnCanvas');
    if (!thmState.biasCanvas || !thmState.attnCanvas) return;

    const comp = document.getElementById('thmComp');
    const compVal = document.getElementById('thmCompVal');
    const noise = document.getElementById('thmNoise');
    const noiseVal = document.getElementById('thmNoiseVal');

    if (comp) {
        comp.value = String(thmState.comp);
        comp.oninput = ev => {
            thmState.comp = parseFloat(ev.target.value);
            if (compVal) compVal.innerText = thmState.comp.toFixed(2);
            thmDrawBiasVar();
        };
        if (compVal) compVal.innerText = thmState.comp.toFixed(2);
    }

    if (noise) {
        noise.value = String(thmState.noise);
        noise.oninput = ev => {
            thmState.noise = parseFloat(ev.target.value);
            if (noiseVal) noiseVal.innerText = thmState.noise.toFixed(2);
            thmDrawBiasVar();
        };
        if (noiseVal) noiseVal.innerText = thmState.noise.toFixed(2);
    }

    const bindAtt = (id, key, outId, decimals) => {
        const input = document.getElementById(id);
        const out = document.getElementById(outId);
        if (!input) return;
        input.value = String(thmState[key]);
        if (out) out.innerText = thmState[key].toFixed(decimals);
        input.oninput = ev => {
            thmState[key] = parseFloat(ev.target.value);
            if (out) out.innerText = thmState[key].toFixed(decimals);
            thmDrawAttention();
        };
    };

    bindAtt('thmS1', 's1', 'thmS1Val', 2);
    bindAtt('thmS2', 's2', 'thmS2Val', 2);
    bindAtt('thmDk', 'dk', 'thmDkVal', 0);

    thmDrawBiasVar();
    thmDrawAttention();
};

// =============================================
// Chapter 13 - Losses, metrics, objectives labs
// =============================================
const lmoState = {
    lossCanvas: null,
    metricCanvas: null,
    err: 0.6,
    delta: 1.0,
    thr: 0.5,
    labels: [],
    probs: []
};

function lmoHuber(e, delta) {
    const a = Math.abs(e);
    if (a <= delta) return 0.5 * e * e;
    return delta * (a - 0.5 * delta);
}

function lmoDrawLosses() {
    if (!lmoState.lossCanvas) return;
    const ctx = lmoState.lossCanvas.getContext('2d');
    const w = lmoState.lossCanvas.width;
    const h = lmoState.lossCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const xMin = -2;
    const xMax = 2;
    const yMax = 3;
    const tx = x => 30 + ((x - xMin) / (xMax - xMin)) * (w - 60);
    const ty = y => h - 24 - (y / yMax) * (h - 50);

    ctx.strokeStyle = 'rgba(148,163,184,0.35)';
    ctx.beginPath();
    ctx.moveTo(30, ty(0));
    ctx.lineTo(w - 30, ty(0));
    ctx.stroke();

    const drawCurve = (fn, color) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 240; i += 1) {
            const x = xMin + (xMax - xMin) * (i / 240);
            const y = Math.min(yMax, fn(x));
            if (i === 0) ctx.moveTo(tx(x), ty(y));
            else ctx.lineTo(tx(x), ty(y));
        }
        ctx.stroke();
    };

    drawCurve(e => 0.5 * e * e, '#22d3ee');
    drawCurve(e => Math.abs(e), '#a78bfa');
    drawCurve(e => lmoHuber(e, lmoState.delta), '#f59e0b');

    const x = lmoState.err;
    const mse = 0.5 * x * x;
    const mae = Math.abs(x);
    const huber = lmoHuber(x, lmoState.delta);

    const drawMarker = (y, color) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(tx(x), ty(Math.min(y, yMax)), 4, 0, Math.PI * 2);
        ctx.fill();
    };

    drawMarker(mse, '#22d3ee');
    drawMarker(mae, '#a78bfa');
    drawMarker(huber, '#f59e0b');

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Arial';
    ctx.fillText('cyan MSE | violet MAE | orange Huber', 12, 20);

    const mseEl = document.getElementById('lossMseVal');
    const maeEl = document.getElementById('lossMaeVal');
    const hubEl = document.getElementById('lossHuberVal');
    if (mseEl) mseEl.innerText = mse.toFixed(4);
    if (maeEl) maeEl.innerText = mae.toFixed(4);
    if (hubEl) hubEl.innerText = huber.toFixed(4);
}

function lmoGenerateMetricData() {
    const n = 120;
    lmoState.labels = [];
    lmoState.probs = [];
    for (let i = 0; i < n; i += 1) {
        const x = i / (n - 1);
        const base = 1 / (1 + Math.exp(-(x * 9 - 4.3)));
        const noisy = Math.max(0, Math.min(1, base + 0.18 * sslRandn()));
        const y = (base + 0.08 * sslRandn()) > 0.5 ? 1 : 0;
        lmoState.probs.push(noisy);
        lmoState.labels.push(y);
    }
}

function lmoComputeMetrics(thr) {
    let tp = 0;
    let fp = 0;
    let fn = 0;
    let tn = 0;
    for (let i = 0; i < lmoState.probs.length; i += 1) {
        const pred = lmoState.probs[i] >= thr ? 1 : 0;
        const y = lmoState.labels[i];
        if (pred === 1 && y === 1) tp += 1;
        else if (pred === 1 && y === 0) fp += 1;
        else if (pred === 0 && y === 1) fn += 1;
        else tn += 1;
    }
    const p = tp / Math.max(1, tp + fp);
    const r = tp / Math.max(1, tp + fn);
    const f1 = (2 * p * r) / Math.max(1e-9, p + r);
    return { tp, fp, fn, tn, p, r, f1 };
}

function lmoDrawMetrics() {
    if (!lmoState.metricCanvas) return;
    const ctx = lmoState.metricCanvas.getContext('2d');
    const w = lmoState.metricCanvas.width;
    const h = lmoState.metricCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const m = lmoComputeMetrics(lmoState.thr);

    const drawB = (x, val, label, color) => {
        const bw = 130;
        const bh = val * 180;
        ctx.fillStyle = 'rgba(100,116,139,0.25)';
        ctx.fillRect(x, 56, bw, 180);
        ctx.fillStyle = color;
        ctx.fillRect(x, 236 - bh, bw, bh);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '12px Arial';
        ctx.fillText(label, x + 4, 250);
        ctx.fillText(val.toFixed(3), x + 6, 236 - bh - 8);
    };

    drawB(70, m.p, 'Precision', '#22d3ee');
    drawB(280, m.r, 'Recall', '#818cf8');
    drawB(490, m.f1, 'F1', '#34d399');

    const pEl = document.getElementById('metricP');
    const rEl = document.getElementById('metricR');
    const f1El = document.getElementById('metricF1');
    const confEl = document.getElementById('metricConf');
    if (pEl) pEl.innerText = m.p.toFixed(4);
    if (rEl) rEl.innerText = m.r.toFixed(4);
    if (f1El) f1El.innerText = m.f1.toFixed(4);
    if (confEl) confEl.innerText = `${m.tp}/${m.fp}/${m.fn}/${m.tn}`;

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '12px Arial';
    ctx.fillText(`threshold = ${lmoState.thr.toFixed(2)}`, 12, 20);
}

window.initPertesMetriquesObjectifsLab = function () {
    lmoState.lossCanvas = document.getElementById('lossCompareCanvas');
    lmoState.metricCanvas = document.getElementById('metricThreshCanvas');
    if (!lmoState.lossCanvas || !lmoState.metricCanvas) return;

    const err = document.getElementById('lossErr');
    const errVal = document.getElementById('lossErrVal');
    const delta = document.getElementById('lossDelta');
    const deltaVal = document.getElementById('lossDeltaVal');

    if (err) {
        err.value = String(lmoState.err);
        err.oninput = ev => {
            lmoState.err = parseFloat(ev.target.value);
            if (errVal) errVal.innerText = lmoState.err.toFixed(2);
            lmoDrawLosses();
        };
        if (errVal) errVal.innerText = lmoState.err.toFixed(2);
    }

    if (delta) {
        delta.value = String(lmoState.delta);
        delta.oninput = ev => {
            lmoState.delta = parseFloat(ev.target.value);
            if (deltaVal) deltaVal.innerText = lmoState.delta.toFixed(2);
            lmoDrawLosses();
        };
        if (deltaVal) deltaVal.innerText = lmoState.delta.toFixed(2);
    }

    const thr = document.getElementById('metricThr');
    const thrVal = document.getElementById('metricThrVal');
    if (thr) {
        thr.value = String(lmoState.thr);
        thr.oninput = ev => {
            lmoState.thr = parseFloat(ev.target.value);
            if (thrVal) thrVal.innerText = lmoState.thr.toFixed(2);
            lmoDrawMetrics();
        };
        if (thrVal) thrVal.innerText = lmoState.thr.toFixed(2);
    }

    lmoGenerateMetricData();
    lmoDrawLosses();
    lmoDrawMetrics();
};

// =============================================
// Chapter 14 - Training large models labs
// =============================================
const trnState = {
    scaleCanvas: null,
    compCanvas: null,
    paramsB: 13,
    tokensT: 2.0,
    bits: 8,
    sparsity: 0.3
};

function trnComputeScaling() {
    const compute = trnState.paramsB * trnState.tokensT;
    const quality = Math.min(0.98, 0.45 + 0.45 * (1 - Math.exp(-compute / 65)));
    return { compute, quality };
}

function trnDrawScaling() {
    if (!trnState.scaleCanvas) return;
    const ctx = trnState.scaleCanvas.getContext('2d');
    const w = trnState.scaleCanvas.width;
    const h = trnState.scaleCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const cMax = 220;
    const tx = c => 30 + (c / cMax) * (w - 60);
    const ty = q => h - 24 - q * (h - 50);

    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i <= 220; i += 1) {
        const c = i;
        const q = Math.min(0.98, 0.45 + 0.45 * (1 - Math.exp(-c / 65)));
        if (i === 0) ctx.moveTo(tx(c), ty(q));
        else ctx.lineTo(tx(c), ty(q));
    }
    ctx.stroke();

    const m = trnComputeScaling();
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(tx(m.compute), ty(m.quality), 5, 0, Math.PI * 2);
    ctx.fill();

    const compEl = document.getElementById('trainComputeVal');
    const qualEl = document.getElementById('trainQualityVal');
    if (compEl) compEl.innerText = m.compute.toFixed(2);
    if (qualEl) qualEl.innerText = m.quality.toFixed(3);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '12px Arial';
    ctx.fillText('Scaling law proxy (rendements decroissants)', 12, 20);
}

function trnComputeCompression() {
    const bitsFactor = trnState.bits / 16;
    const vram = bitsFactor * (1 - 0.7 * trnState.sparsity);
    const latency = (0.6 + 0.4 * bitsFactor) * (1 - 0.5 * trnState.sparsity);
    const quality = Math.max(0.4, 1 - (16 - trnState.bits) / 28 - 0.25 * Math.pow(trnState.sparsity, 1.2));
    return { vram, latency, quality };
}

function trnDrawCompression() {
    if (!trnState.compCanvas) return;
    const ctx = trnState.compCanvas.getContext('2d');
    const w = trnState.compCanvas.width;
    const h = trnState.compCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const m = trnComputeCompression();

    const draw = (x, v, label, color) => {
        const bw = 150;
        const bh = 180;
        ctx.fillStyle = 'rgba(100,116,139,0.25)';
        ctx.fillRect(x, 52, bw, bh);
        ctx.fillStyle = color;
        ctx.fillRect(x, 52 + bh * (1 - v), bw, bh * v);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '12px Arial';
        ctx.fillText(label, x + 6, 248);
        ctx.fillText(v.toFixed(3), x + 6, 52 + bh * (1 - v) - 8);
    };

    draw(70, m.vram, 'VRAM rel.', '#22d3ee');
    draw(285, m.latency, 'Latency rel.', '#818cf8');
    draw(500, m.quality, 'Quality rel.', '#34d399');

    const vramEl = document.getElementById('trainVram');
    const latEl = document.getElementById('trainLatency');
    const qEl = document.getElementById('trainQual2');
    if (vramEl) vramEl.innerText = m.vram.toFixed(3);
    if (latEl) latEl.innerText = m.latency.toFixed(3);
    if (qEl) qEl.innerText = m.quality.toFixed(3);
}

window.initEntrainementGrosModelesLab = function () {
    trnState.scaleCanvas = document.getElementById('trainScaleCanvas');
    trnState.compCanvas = document.getElementById('trainCompressCanvas');
    if (!trnState.scaleCanvas || !trnState.compCanvas) return;

    const params = document.getElementById('trainParams');
    const paramsVal = document.getElementById('trainParamsVal');
    const tokens = document.getElementById('trainTokens');
    const tokensVal = document.getElementById('trainTokensVal');

    if (params) {
        params.value = String(trnState.paramsB);
        params.oninput = ev => {
            trnState.paramsB = parseFloat(ev.target.value);
            if (paramsVal) paramsVal.innerText = trnState.paramsB.toFixed(0);
            trnDrawScaling();
        };
        if (paramsVal) paramsVal.innerText = trnState.paramsB.toFixed(0);
    }

    if (tokens) {
        tokens.value = String(trnState.tokensT);
        tokens.oninput = ev => {
            trnState.tokensT = parseFloat(ev.target.value);
            if (tokensVal) tokensVal.innerText = trnState.tokensT.toFixed(1);
            trnDrawScaling();
        };
        if (tokensVal) tokensVal.innerText = trnState.tokensT.toFixed(1);
    }

    const bits = document.getElementById('trainBits');
    const bitsVal = document.getElementById('trainBitsVal');
    const sparse = document.getElementById('trainSparse');
    const sparseVal = document.getElementById('trainSparseVal');

    if (bits) {
        bits.value = String(trnState.bits);
        bits.oninput = ev => {
            trnState.bits = parseFloat(ev.target.value);
            if (bitsVal) bitsVal.innerText = trnState.bits.toFixed(0);
            trnDrawCompression();
        };
        if (bitsVal) bitsVal.innerText = trnState.bits.toFixed(0);
    }

    if (sparse) {
        sparse.value = String(trnState.sparsity);
        sparse.oninput = ev => {
            trnState.sparsity = parseFloat(ev.target.value);
            if (sparseVal) sparseVal.innerText = trnState.sparsity.toFixed(2);
            trnDrawCompression();
        };
        if (sparseVal) sparseVal.innerText = trnState.sparsity.toFixed(2);
    }

    trnDrawScaling();
    trnDrawCompression();
};

// =============================================
// Chapter 15 - Data systems MLOps labs
// =============================================
const opsState = {
    driftCanvas: null,
    monCanvas: null,
    shift: 0.6,
    std: 1.2,
    precThr: 0.75,
    latThr: 0.55,
    t: 0,
    precHist: [],
    latHist: [],
    alerts: 0,
    monTimer: null
};

function opsGaussian(x, mu, sigma) {
    const s = Math.max(1e-6, sigma);
    return Math.exp(-0.5 * Math.pow((x - mu) / s, 2)) / (s * Math.sqrt(2 * Math.PI));
}

function opsDriftScore() {
    return Math.min(1, 0.35 * Math.abs(opsState.shift) + 0.5 * Math.abs(opsState.std - 1));
}

function opsDrawDrift() {
    if (!opsState.driftCanvas) return;
    const ctx = opsState.driftCanvas.getContext('2d');
    const w = opsState.driftCanvas.width;
    const h = opsState.driftCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const xMin = -4;
    const xMax = 4;
    const tx = x => 30 + ((x - xMin) / (xMax - xMin)) * (w - 60);
    const ty = y => h - 24 - (y / 0.45) * (h - 50);

    const drawCurve = (mu, sig, color) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 260; i += 1) {
            const x = xMin + (xMax - xMin) * (i / 260);
            const y = opsGaussian(x, mu, sig);
            if (i === 0) ctx.moveTo(tx(x), ty(y));
            else ctx.lineTo(tx(x), ty(y));
        }
        ctx.stroke();
    };

    drawCurve(0, 1, '#94a3b8');
    drawCurve(opsState.shift, opsState.std, '#22d3ee');

    const driftEl = document.getElementById('opsDriftVal');
    if (driftEl) driftEl.innerText = opsDriftScore().toFixed(3);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Arial';
    ctx.fillText('gris: reference | cyan: production', 12, 20);
}

function opsDrawMonitor() {
    if (!opsState.monCanvas) return;
    const ctx = opsState.monCanvas.getContext('2d');
    const w = opsState.monCanvas.width;
    const h = opsState.monCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const n = opsState.precHist.length;
    if (!n) return;

    const tx = i => 20 + (i / Math.max(1, n - 1)) * (w - 40);
    const ty = y => h - 20 - y * (h - 40);

    const drawLine = (arr, color) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        arr.forEach((v, i) => {
            if (i === 0) ctx.moveTo(tx(i), ty(v));
            else ctx.lineTo(tx(i), ty(v));
        });
        ctx.stroke();
    };

    drawLine(opsState.precHist, '#22d3ee');
    drawLine(opsState.latHist, '#f59e0b');

    ctx.strokeStyle = 'rgba(34,211,238,0.5)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(20, ty(opsState.precThr));
    ctx.lineTo(w - 20, ty(opsState.precThr));
    ctx.stroke();

    ctx.strokeStyle = 'rgba(245,158,11,0.5)';
    ctx.beginPath();
    ctx.moveTo(20, ty(opsState.latThr));
    ctx.lineTo(w - 20, ty(opsState.latThr));
    ctx.stroke();
    ctx.setLineDash([]);

    const alertsEl = document.getElementById('opsAlerts');
    if (alertsEl) alertsEl.innerText = String(opsState.alerts);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Arial';
    ctx.fillText('cyan precision | orange latency', 12, 20);
}

function opsMonitorStep() {
    opsState.t += 1;
    const drift = 0.0018 * opsState.t;
    const precision = Math.max(0, Math.min(1, 0.9 - drift + 0.03 * sslRandn()));
    const latency = Math.max(0, Math.min(1, 0.35 + drift + 0.03 * sslRandn()));

    opsState.precHist.push(precision);
    opsState.latHist.push(latency);
    if (opsState.precHist.length > 180) opsState.precHist.shift();
    if (opsState.latHist.length > 180) opsState.latHist.shift();

    if (precision < opsState.precThr || latency > opsState.latThr) opsState.alerts += 1;
    opsDrawMonitor();
}

function opsResetMonitor() {
    if (opsState.monTimer) {
        clearInterval(opsState.monTimer);
        opsState.monTimer = null;
    }
    opsState.t = 0;
    opsState.alerts = 0;
    opsState.precHist = [];
    opsState.latHist = [];
    for (let i = 0; i < 60; i += 1) opsMonitorStep();
}

window.initDonneesSystemesMlopsLab = function () {
    if (opsState.monTimer) {
        clearInterval(opsState.monTimer);
        opsState.monTimer = null;
    }

    opsState.driftCanvas = document.getElementById('opsDriftCanvas');
    opsState.monCanvas = document.getElementById('opsMonitorCanvas');
    if (!opsState.driftCanvas || !opsState.monCanvas) return;

    const shift = document.getElementById('opsShift');
    const shiftVal = document.getElementById('opsShiftVal');
    const std = document.getElementById('opsStd');
    const stdVal = document.getElementById('opsStdVal');

    if (shift) {
        shift.value = String(opsState.shift);
        shift.oninput = ev => {
            opsState.shift = parseFloat(ev.target.value);
            if (shiftVal) shiftVal.innerText = opsState.shift.toFixed(2);
            opsDrawDrift();
        };
        if (shiftVal) shiftVal.innerText = opsState.shift.toFixed(2);
    }

    if (std) {
        std.value = String(opsState.std);
        std.oninput = ev => {
            opsState.std = parseFloat(ev.target.value);
            if (stdVal) stdVal.innerText = opsState.std.toFixed(2);
            opsDrawDrift();
        };
        if (stdVal) stdVal.innerText = opsState.std.toFixed(2);
    }

    const pthr = document.getElementById('opsPrecThr');
    const pthrVal = document.getElementById('opsPrecThrVal');
    const lthr = document.getElementById('opsLatThr');
    const lthrVal = document.getElementById('opsLatThrVal');

    if (pthr) {
        pthr.value = String(opsState.precThr);
        pthr.oninput = ev => {
            opsState.precThr = parseFloat(ev.target.value);
            if (pthrVal) pthrVal.innerText = opsState.precThr.toFixed(2);
            opsDrawMonitor();
        };
        if (pthrVal) pthrVal.innerText = opsState.precThr.toFixed(2);
    }

    if (lthr) {
        lthr.value = String(opsState.latThr);
        lthr.oninput = ev => {
            opsState.latThr = parseFloat(ev.target.value);
            if (lthrVal) lthrVal.innerText = opsState.latThr.toFixed(2);
            opsDrawMonitor();
        };
        if (lthrVal) lthrVal.innerText = opsState.latThr.toFixed(2);
    }

    const start = document.getElementById('opsMonStart');
    const pause = document.getElementById('opsMonPause');
    const step = document.getElementById('opsMonStep');
    const reset = document.getElementById('opsMonReset');

    if (start) {
        start.onclick = () => {
            if (opsState.monTimer) return;
            opsState.monTimer = setInterval(() => {
                if (!opsState.monCanvas || !opsState.monCanvas.isConnected) {
                    clearInterval(opsState.monTimer);
                    opsState.monTimer = null;
                    return;
                }
                opsMonitorStep();
            }, 130);
        };
    }
    if (pause) pause.onclick = () => {
        if (opsState.monTimer) {
            clearInterval(opsState.monTimer);
            opsState.monTimer = null;
        }
    };
    if (step) step.onclick = () => opsMonitorStep();
    if (reset) reset.onclick = () => opsResetMonitor();

    opsDrawDrift();
    opsResetMonitor();
};

// =============================================
// Chapter 16 - Multimodal labs
// =============================================
const mmState = {
    alignCanvas: null,
    groundCanvas: null,
    tau: 0.3,
    noise: 0.2,
    mat: [],
    boxes: [],
    thr: 0.55
};

function mmBuildMatrix() {
    const n = 6;
    const mat = Array.from({ length: n }, () => Array.from({ length: n }, () => 0));
    for (let i = 0; i < n; i += 1) {
        for (let j = 0; j < n; j += 1) {
            const base = i === j ? 1 : 0.35 - 0.08 * Math.abs(i - j);
            const noisy = base + mmState.noise * 0.35 * sslRandn();
            mat[i][j] = Math.max(-1.2, Math.min(1.2, noisy));
        }
    }
    mmState.mat = mat;
}

function mmSoftmaxRow(row) {
    const t = Math.max(0.05, mmState.tau);
    const scaled = row.map(v => v / t);
    const m = Math.max(...scaled);
    const exps = scaled.map(v => Math.exp(v - m));
    const z = exps.reduce((a, b) => a + b, 0);
    return exps.map(v => v / Math.max(1e-9, z));
}

function mmDrawAlign() {
    if (!mmState.alignCanvas) return;
    const ctx = mmState.alignCanvas.getContext('2d');
    const w = mmState.alignCanvas.width;
    const h = mmState.alignCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const n = mmState.mat.length;
    const x0 = 70;
    const y0 = 38;
    const cell = 36;

    let diag = 0;
    for (let i = 0; i < n; i += 1) {
        const probs = mmSoftmaxRow(mmState.mat[i]);
        for (let j = 0; j < n; j += 1) {
            const p = probs[j];
            if (i === j) diag += p;
            const c = Math.floor(40 + p * 180);
            ctx.fillStyle = `rgb(${30},${c},${c + 20})`;
            ctx.fillRect(x0 + j * cell, y0 + i * cell, cell - 2, cell - 2);
            ctx.fillStyle = '#0f172a';
            ctx.font = '10px Arial';
            ctx.fillText(p.toFixed(2), x0 + j * cell + 4, y0 + i * cell + 20);
        }
    }

    const diagScore = diag / Math.max(1, n);
    const diagEl = document.getElementById('mmDiagScore');
    if (diagEl) diagEl.innerText = diagScore.toFixed(3);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Arial';
    ctx.fillText('Text (rows) vs Image (cols) alignment probabilities', 12, 20);
}

function mmBuildBoxes() {
    mmState.boxes = [];
    for (let i = 0; i < 8; i += 1) {
        mmState.boxes.push({
            x: 0.08 + Math.random() * 0.72,
            y: 0.08 + Math.random() * 0.65,
            w: 0.12 + Math.random() * 0.25,
            h: 0.10 + Math.random() * 0.22,
            score: Math.max(0, Math.min(1, 0.55 + 0.25 * sslRandn()))
        });
    }
}

function mmDrawGround() {
    if (!mmState.groundCanvas) return;
    const ctx = mmState.groundCanvas.getContext('2d');
    const w = mmState.groundCanvas.width;
    const h = mmState.groundCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(20, 30, w - 40, h - 60);

    let accepted = 0;
    mmState.boxes.forEach((b, i) => {
        const x = 20 + b.x * (w - 40);
        const y = 30 + b.y * (h - 60);
        const bw = b.w * (w - 40);
        const bh = b.h * (h - 60);
        const ok = b.score >= mmState.thr;
        if (ok) accepted += 1;

        ctx.strokeStyle = ok ? '#22c55e' : '#64748b';
        ctx.lineWidth = ok ? 2.5 : 1.2;
        ctx.strokeRect(x, y, bw, bh);

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '10px Arial';
        ctx.fillText(`${i}:${b.score.toFixed(2)}`, x + 2, y + 12);
    });

    const accEl = document.getElementById('mmAccepted');
    if (accEl) accEl.innerText = String(accepted);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Arial';
    ctx.fillText('Candidates for phrase grounding', 12, 20);
}

window.initMultimodalLab = function () {
    mmState.alignCanvas = document.getElementById('mmAlignCanvas');
    mmState.groundCanvas = document.getElementById('mmGroundCanvas');
    if (!mmState.alignCanvas || !mmState.groundCanvas) return;

    const tau = document.getElementById('mmTau');
    const tauVal = document.getElementById('mmTauVal');
    const noise = document.getElementById('mmNoise');
    const noiseVal = document.getElementById('mmNoiseVal');

    if (tau) {
        tau.value = String(mmState.tau);
        tau.oninput = ev => {
            mmState.tau = parseFloat(ev.target.value);
            if (tauVal) tauVal.innerText = mmState.tau.toFixed(2);
            mmDrawAlign();
        };
        if (tauVal) tauVal.innerText = mmState.tau.toFixed(2);
    }

    if (noise) {
        noise.value = String(mmState.noise);
        noise.oninput = ev => {
            mmState.noise = parseFloat(ev.target.value);
            if (noiseVal) noiseVal.innerText = mmState.noise.toFixed(2);
            mmBuildMatrix();
            mmDrawAlign();
        };
        if (noiseVal) noiseVal.innerText = mmState.noise.toFixed(2);
    }

    const thr = document.getElementById('mmThr');
    const thrVal = document.getElementById('mmThrVal');
    const resample = document.getElementById('mmGroundResample');

    if (thr) {
        thr.value = String(mmState.thr);
        thr.oninput = ev => {
            mmState.thr = parseFloat(ev.target.value);
            if (thrVal) thrVal.innerText = mmState.thr.toFixed(2);
            mmDrawGround();
        };
        if (thrVal) thrVal.innerText = mmState.thr.toFixed(2);
    }

    if (resample) resample.onclick = () => {
        mmBuildBoxes();
        mmDrawGround();
    };

    mmBuildMatrix();
    mmBuildBoxes();
    mmDrawAlign();
    mmDrawGround();
};

// =============================================
// Chapter 17 - Buzzwords labs
// =============================================
const buzzState = {
    mapCanvas: null,
    stackCanvas: null,
    category: 'all',
    hype: 0.5,
    data: [
        { term: 'RAG', cat: 'rag', maturity: 0.82, impact: 0.78, hype: 0.62 },
        { term: 'Agents', cat: 'rag', maturity: 0.56, impact: 0.83, hype: 0.87 },
        { term: 'Diffusion', cat: 'gen', maturity: 0.76, impact: 0.8, hype: 0.65 },
        { term: 'FlowMatch', cat: 'gen', maturity: 0.42, impact: 0.72, hype: 0.7 },
        { term: 'LoRA', cat: 'eff', maturity: 0.9, impact: 0.74, hype: 0.52 },
        { term: 'QLoRA', cat: 'eff', maturity: 0.78, impact: 0.69, hype: 0.58 },
        { term: 'VLM', cat: 'multi', maturity: 0.61, impact: 0.81, hype: 0.79 },
        { term: 'SSM', cat: 'eff', maturity: 0.37, impact: 0.66, hype: 0.82 }
    ]
};

function buzzFiltered() {
    return buzzState.data.filter(x => buzzState.category === 'all' || x.cat === buzzState.category);
}

function buzzDrawMap() {
    if (!buzzState.mapCanvas) return;
    const ctx = buzzState.mapCanvas.getContext('2d');
    const w = buzzState.mapCanvas.width;
    const h = buzzState.mapCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const x0 = 40;
    const y0 = 24;
    const ww = w - 70;
    const hh = h - 54;

    ctx.strokeStyle = '#64748b';
    ctx.strokeRect(x0, y0, ww, hh);

    const list = buzzFiltered();
    list.forEach(item => {
        const x = x0 + item.maturity * ww;
        const y = y0 + (1 - item.impact) * hh;
        const r = 6 + (item.hype * (0.5 + buzzState.hype)) * 11;

        ctx.fillStyle = 'rgba(34,211,238,0.6)';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '11px Arial';
        ctx.fillText(item.term, x + r + 3, y + 3);
    });

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '12px Arial';
    ctx.fillText('x: maturite production | y: impact potentiel', 12, 18);
}

function buzzScoreStack(selected) {
    const base = selected.length ? 0.4 + 0.07 * selected.length : 0;
    let synergy = 0;
    const has = k => selected.includes(k);
    if (has('rag') && has('agent')) synergy += 0.18;
    if (has('lora') && has('rag')) synergy += 0.1;
    if (has('vlm') && has('rag')) synergy += 0.14;
    if (has('diff') && has('agent')) synergy -= 0.04;
    if (has('ssm') && has('lora')) synergy += 0.06;
    if (has('rlhf') && has('agent')) synergy += 0.08;
    return Math.max(0, Math.min(1, base + synergy));
}

function buzzDrawStack(selected, score) {
    if (!buzzState.stackCanvas) return;
    const ctx = buzzState.stackCanvas.getContext('2d');
    const w = buzzState.stackCanvas.width;
    const h = buzzState.stackCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const y = 90;
    const bw = 500;
    ctx.fillStyle = 'rgba(100,116,139,0.3)';
    ctx.fillRect(70, y, bw, 30);
    ctx.fillStyle = '#818cf8';
    ctx.fillRect(70, y, bw * score, 30);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Arial';
    ctx.fillText(`coherence score = ${score.toFixed(3)}`, 70, y - 10);
    ctx.fillText(`selected: ${selected.join(', ') || 'none'}`, 70, y + 55);
}

window.initBuzzwordsIaLab = function () {
    buzzState.mapCanvas = document.getElementById('buzzMapCanvas');
    buzzState.stackCanvas = document.getElementById('buzzStackCanvas');
    if (!buzzState.mapCanvas || !buzzState.stackCanvas) return;

    const cat = document.getElementById('buzzCategory');
    const hype = document.getElementById('buzzHype');
    const hypeVal = document.getElementById('buzzHypeVal');

    if (cat) {
        cat.value = buzzState.category;
        cat.onchange = ev => {
            buzzState.category = ev.target.value;
            buzzDrawMap();
        };
    }

    if (hype) {
        hype.value = String(buzzState.hype);
        hype.oninput = ev => {
            buzzState.hype = parseFloat(ev.target.value);
            if (hypeVal) hypeVal.innerText = buzzState.hype.toFixed(2);
            buzzDrawMap();
        };
        if (hypeVal) hypeVal.innerText = buzzState.hype.toFixed(2);
    }

    const stack = document.getElementById('buzzStack');
    const evalBtn = document.getElementById('buzzEval');
    const scoreEl = document.getElementById('buzzScore');

    const evalStack = () => {
        if (!stack) return;
        const selected = Array.from(stack.selectedOptions).map(o => o.value);
        const score = buzzScoreStack(selected);
        if (scoreEl) scoreEl.innerText = score.toFixed(3);
        buzzDrawStack(selected, score);
    };

    if (evalBtn) evalBtn.onclick = () => evalStack();

    buzzDrawMap();
    evalStack();
};

// =============================================
// Chapter 18 - Ultra short foundation labs
// =============================================
const socleState = {
    planCanvas: null,
    graphCanvas: null,
    hours: 8,
    focus: 0.55,
    blocks: [
        { id: 'math', name: 'Maths', need: 6, w: 1.3 },
        { id: 'ml', name: 'ML cls', need: 4, w: 1.1 },
        { id: 'dl', name: 'DL base', need: 6, w: 1.4 },
        { id: 'trans', name: 'Transformer', need: 5, w: 1.3 },
        { id: 'gen', name: 'Generatif', need: 5, w: 1.2 },
        { id: 'rl', name: 'RL', need: 4, w: 1.0 },
        { id: 'rag', name: 'RAG/PEFT', need: 4, w: 1.1 },
        { id: 'sys', name: 'MLOps', need: 4, w: 1.2 }
    ],
    done: 0
};

function socleAllocations() {
    const h = socleState.hours;
    const f = socleState.focus;
    const theo = h * f;
    const pract = h * (1 - f);

    return socleState.blocks.map((b, i) => {
        const share = b.w / socleState.blocks.reduce((a, x) => a + x.w, 0);
        const alloc = (theo * (i < 4 ? 1.2 : 0.8) + pract * (i >= 2 ? 1.1 : 0.9)) * share;
        return { ...b, alloc };
    });
}

function socleCoverageScore() {
    const allocs = socleAllocations();
    const weighted = allocs.reduce((acc, b) => acc + Math.min(1, b.alloc / b.need) * b.w, 0);
    const totalW = allocs.reduce((acc, b) => acc + b.w, 0);
    return weighted / Math.max(1e-9, totalW);
}

function socleDrawPlan() {
    if (!socleState.planCanvas) return;
    const ctx = socleState.planCanvas.getContext('2d');
    const w = socleState.planCanvas.width;
    const h = socleState.planCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const allocs = socleAllocations();
    const x0 = 20;
    const y0 = 34;
    const rowH = 30;

    allocs.forEach((b, i) => {
        const y = y0 + i * rowH;
        const needW = b.need * 18;
        const allocW = b.alloc * 18;

        ctx.fillStyle = 'rgba(100,116,139,0.35)';
        ctx.fillRect(x0 + 110, y, needW, 16);
        ctx.fillStyle = '#22d3ee';
        ctx.fillRect(x0 + 110, y, allocW, 16);

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '11px Arial';
        ctx.fillText(b.name, x0, y + 12);
    });

    const coverage = socleCoverageScore();
    const covEl = document.getElementById('socleCoverage');
    if (covEl) covEl.innerText = coverage.toFixed(3);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '12px Arial';
    ctx.fillText('cyan allocation hebdo vs gris besoin moyen', 12, 20);
}

function socleDrawGraph() {
    if (!socleState.graphCanvas) return;
    const ctx = socleState.graphCanvas.getContext('2d');
    const w = socleState.graphCanvas.width;
    const h = socleState.graphCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const pts = [
        [80, 90], [200, 80], [320, 80], [440, 90],
        [120, 210], [260, 210], [400, 210], [560, 150]
    ];
    const edges = [[0,1],[1,2],[2,3],[0,4],[2,5],[3,6],[4,7],[5,7],[6,7]];

    ctx.strokeStyle = 'rgba(148,163,184,0.5)';
    edges.forEach(([a,b]) => {
        ctx.beginPath();
        ctx.moveTo(pts[a][0], pts[a][1]);
        ctx.lineTo(pts[b][0], pts[b][1]);
        ctx.stroke();
    });

    for (let i = 0; i < pts.length; i += 1) {
        const done = i < socleState.done;
        ctx.fillStyle = done ? 'rgba(34,197,94,0.75)' : 'rgba(129,140,248,0.65)';
        ctx.beginPath();
        ctx.arc(pts[i][0], pts[i][1], 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 11px Arial';
        ctx.fillText(String(i + 1), pts[i][0] - 4, pts[i][1] + 4);
    }

    const doneEl = document.getElementById('socleDone');
    if (doneEl) doneEl.innerText = String(socleState.done);
}

window.initSocleUltraCourtLab = function () {
    socleState.planCanvas = document.getElementById('soclePlanCanvas');
    socleState.graphCanvas = document.getElementById('socleGraphCanvas');
    if (!socleState.planCanvas || !socleState.graphCanvas) return;

    const hours = document.getElementById('socleHours');
    const hoursVal = document.getElementById('socleHoursVal');
    const focus = document.getElementById('socleFocus');
    const focusVal = document.getElementById('socleFocusVal');

    if (hours) {
        hours.value = String(socleState.hours);
        hours.oninput = ev => {
            socleState.hours = parseFloat(ev.target.value);
            if (hoursVal) hoursVal.innerText = socleState.hours.toFixed(0);
            socleDrawPlan();
        };
        if (hoursVal) hoursVal.innerText = socleState.hours.toFixed(0);
    }

    if (focus) {
        focus.value = String(socleState.focus);
        focus.oninput = ev => {
            socleState.focus = parseFloat(ev.target.value);
            if (focusVal) focusVal.innerText = socleState.focus.toFixed(2);
            socleDrawPlan();
        };
        if (focusVal) focusVal.innerText = socleState.focus.toFixed(2);
    }

    const unlock = document.getElementById('socleUnlock');
    const reset = document.getElementById('socleReset');

    if (unlock) unlock.onclick = () => {
        socleState.done = Math.min(8, socleState.done + 1);
        socleDrawGraph();
    };

    if (reset) reset.onclick = () => {
        socleState.done = 0;
        socleDrawGraph();
    };

    socleDrawPlan();
    socleDrawGraph();
};

// =============================================
// Chapter 19 - Active research labs
// =============================================
const resState = {
    allocCanvas: null,
    trendCanvas: null,
    budget: 100,
    riskTol: 0.5,
    accel: 0.6,
    friction: 0.4,
    themes: [
        { name: 'SSM', impact: 0.7, risk: 0.62 },
        { name: 'Diffusion+', impact: 0.82, risk: 0.66 },
        { name: 'Agentic', impact: 0.86, risk: 0.74 },
        { name: 'WorldModel', impact: 0.9, risk: 0.78 },
        { name: 'GraphDyn', impact: 0.68, risk: 0.58 },
        { name: 'PEFT+', impact: 0.73, risk: 0.42 }
    ]
};

function resPortfolio() {
    const weights = resState.themes.map(t => {
        const score = t.impact - (1 - resState.riskTol) * t.risk;
        return Math.max(0.05, score);
    });
    const sum = weights.reduce((a, b) => a + b, 0);
    const alloc = weights.map(w => (w / sum) * resState.budget);

    let portScore = 0;
    for (let i = 0; i < resState.themes.length; i += 1) {
        const fr = alloc[i] / Math.max(1, resState.budget);
        const t = resState.themes[i];
        portScore += fr * (t.impact - (1 - resState.riskTol) * t.risk);
    }

    return { alloc, portScore };
}

function resDrawAlloc() {
    if (!resState.allocCanvas) return;
    const ctx = resState.allocCanvas.getContext('2d');
    const w = resState.allocCanvas.width;
    const h = resState.allocCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const p = resPortfolio();
    const n = resState.themes.length;
    const bw = 80;
    const gap = 28;
    const x0 = 30;

    for (let i = 0; i < n; i += 1) {
        const val = p.alloc[i] / Math.max(1, resState.budget);
        const bh = val * 180;
        const x = x0 + i * (bw + gap);
        ctx.fillStyle = '#22d3ee';
        ctx.fillRect(x, 230 - bh, bw, bh);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '11px Arial';
        ctx.fillText(resState.themes[i].name, x, 248);
        ctx.fillText(`${p.alloc[i].toFixed(1)}`, x + 8, 230 - bh - 8);
    }

    const sEl = document.getElementById('researchScore');
    if (sEl) sEl.innerText = p.portScore.toFixed(3);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '12px Arial';
    ctx.fillText('Budget allocation by expected upside vs risk', 12, 20);
}

function resDrawTrend() {
    if (!resState.trendCanvas) return;
    const ctx = resState.trendCanvas.getContext('2d');
    const w = resState.trendCanvas.width;
    const h = resState.trendCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const n = 120;
    const tx = i => 20 + (i / (n - 1)) * (w - 40);
    const ty = y => h - 22 - y * (h - 44);

    const research = [];
    const adoption = [];
    for (let i = 0; i < n; i += 1) {
        const t = i / (n - 1);
        const r = Math.max(0, Math.min(1, 0.2 + resState.accel * t + 0.08 * Math.sin(8 * t)));
        const a = Math.max(0, Math.min(1, 0.1 + (resState.accel - resState.friction) * t + 0.06 * Math.sin(5 * t + 0.8)));
        research.push(r);
        adoption.push(a);
    }

    const draw = (arr, color) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        arr.forEach((v, i) => {
            if (i === 0) ctx.moveTo(tx(i), ty(v));
            else ctx.lineTo(tx(i), ty(v));
        });
        ctx.stroke();
    };

    draw(research, '#22d3ee');
    draw(adoption, '#f59e0b');

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px Arial';
    ctx.fillText('cyan research signal | orange product adoption', 12, 20);
}

window.initRechercheActiveLab = function () {
    resState.allocCanvas = document.getElementById('researchAllocCanvas');
    resState.trendCanvas = document.getElementById('researchTrendCanvas');
    if (!resState.allocCanvas || !resState.trendCanvas) return;

    const budget = document.getElementById('researchBudget');
    const budgetVal = document.getElementById('researchBudgetVal');
    const risk = document.getElementById('researchRisk');
    const riskVal = document.getElementById('researchRiskVal');

    if (budget) {
        budget.value = String(resState.budget);
        budget.oninput = ev => {
            resState.budget = parseFloat(ev.target.value);
            if (budgetVal) budgetVal.innerText = resState.budget.toFixed(0);
            resDrawAlloc();
        };
        if (budgetVal) budgetVal.innerText = resState.budget.toFixed(0);
    }

    if (risk) {
        risk.value = String(resState.riskTol);
        risk.oninput = ev => {
            resState.riskTol = parseFloat(ev.target.value);
            if (riskVal) riskVal.innerText = resState.riskTol.toFixed(2);
            resDrawAlloc();
        };
        if (riskVal) riskVal.innerText = resState.riskTol.toFixed(2);
    }

    const accel = document.getElementById('researchAccel');
    const accelVal = document.getElementById('researchAccelVal');
    const fr = document.getElementById('researchFriction');
    const frVal = document.getElementById('researchFrictionVal');

    if (accel) {
        accel.value = String(resState.accel);
        accel.oninput = ev => {
            resState.accel = parseFloat(ev.target.value);
            if (accelVal) accelVal.innerText = resState.accel.toFixed(2);
            resDrawTrend();
        };
        if (accelVal) accelVal.innerText = resState.accel.toFixed(2);
    }

    if (fr) {
        fr.value = String(resState.friction);
        fr.oninput = ev => {
            resState.friction = parseFloat(ev.target.value);
            if (frVal) frVal.innerText = resState.friction.toFixed(2);
            resDrawTrend();
        };
        if (frVal) frVal.innerText = resState.friction.toFixed(2);
    }

    resDrawAlloc();
    resDrawTrend();
};
