// ai_dynamics.js - Interactive labs for modern AI and physics-inspired architectures

console.log("AI dynamics module loaded 🧠");

const aiDynState = {
    transformer: {
        canvas: null,
        ctx: null,
        tokens: ["Le", "chat", "regarde", "la", "lumiere", "dans", "la", "nuit"],
        baseMatrix: [],
        selected: 3,
        temp: 1.0
    },
    backprop: {
        canvas: null,
        ctx: null,
        x: 1,
        target: 1,
        w1: 0.5,
        w2: 0.7,
        lr: 0.1
    },
    ml: {
        canvas: null,
        ctx: null,
        points: [],
        noise: 0.2,
        model: 'linear'
    },
    pde: {
        canvas: null,
        ctx: null,
        offscreen: null,
        offctx: null,
        gw: 120,
        gh: 70,
        u: null,
        v: null,
        running: true,
        anim: null,
        D: 0.16,
        R: 0.08
    },
    freeEnergy: {
        canvas: null,
        ctx: null,
        predicted: 0.5,
        observed: 0.6,
        complexity: 0.6,
        precision: 0.7,
        history: [],
        anim: null
    },
    actionFlow: {
        canvas: null,
        ctx: null,
        rough: 0.4,
        best: 'A'
    },
    equivariance: {
        canvas: null,
        ctx: null,
        angle: 0,
        auto: false,
        anim: null
    },
    attractor: {
        canvas: null,
        ctx: null,
        anim: null,
        delta: 0.002,
        a: { x: 0.1, y: 0, z: 0 },
        b: { x: 0.102, y: 0, z: 0 },
        pathA: [],
        pathB: []
    },
    hyper: {
        canvas: null,
        ctx: null,
        nodes: [],
        edges: [],
        auto: false,
        timer: null
    },
    stack: {
        canvas: null,
        ctx: null,
        scenario: 'robot',
        uncertainty: 0.45
    }
};

function aiClamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

function aiLerp(a, b, t) {
    return a + (b - a) * t;
}

function aiRand(min, max) {
    return min + Math.random() * (max - min);
}

// ===============================
// 1) TRANSFORMER EXPLORER
// ===============================
function generateAttentionMatrix(n) {
    const mat = [];
    for (let i = 0; i < n; i++) {
        let row = [];
        for (let j = 0; j < n; j++) {
            const distBias = Math.exp(-Math.abs(i - j) * 0.45);
            row.push(0.2 + Math.random() * 0.6 + distBias * 0.8);
        }
        const sum = row.reduce((a, b) => a + b, 0);
        row = row.map(v => v / sum);
        mat.push(row);
    }
    return mat;
}

function temperatureAdjust(row, temp) {
    const logits = row.map(v => Math.log(Math.max(v, 1e-8)) / temp);
    const m = Math.max(...logits);
    const exps = logits.map(v => Math.exp(v - m));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(v => v / sum);
}

function drawTransformerExplorer() {
    const s = aiDynState.transformer;
    if (!s.ctx || !s.canvas) return;

    const ctx = s.ctx;
    const w = s.canvas.width;
    const h = s.canvas.height;
    const n = s.tokens.length;

    ctx.clearRect(0, 0, w, h);

    const marginLeft = 120;
    const marginTop = 52;
    const gridW = w - marginLeft - 20;
    const gridH = h - marginTop - 20;
    const cw = gridW / n;
    const ch = gridH / n;

    const disp = s.baseMatrix.map((row, i) => (i === s.selected ? temperatureAdjust(row, s.temp) : row.slice()));

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const v = disp[i][j];
            const hue = 220 - Math.round(v * 120);
            const sat = 80;
            const light = 25 + v * 55;
            ctx.fillStyle = `hsl(${hue}, ${sat}%, ${light}%)`;
            ctx.fillRect(marginLeft + j * cw, marginTop + i * ch, cw - 1, ch - 1);
        }
    }

    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.strokeRect(marginLeft, marginTop + s.selected * ch, gridW, ch);

    ctx.font = '12px Arial';
    ctx.fillStyle = '#e5e7eb';
    for (let i = 0; i < n; i++) {
        const x = marginLeft + i * cw + cw * 0.5;
        ctx.save();
        ctx.translate(x, 18);
        ctx.rotate(-0.35);
        ctx.fillText(s.tokens[i], -20, 0);
        ctx.restore();

        const y = marginTop + i * ch + ch * 0.65;
        ctx.fillText(s.tokens[i], 10, y);
    }

    ctx.fillStyle = '#9ca3af';
    ctx.fillText('faible attention', marginLeft, h - 6);
    ctx.fillText('forte attention', marginLeft + 150, h - 6);

    const selectedRow = disp[s.selected];
    const entropy = -selectedRow.reduce((acc, p) => acc + p * Math.log(Math.max(p, 1e-8)), 0);
    const entropyNorm = entropy / Math.log(n);

    const entEl = document.getElementById('transEntropyVal');
    if (entEl) entEl.innerText = entropyNorm.toFixed(3);
}

window.shuffleTransformerAttention = function () {
    const s = aiDynState.transformer;
    s.baseMatrix = generateAttentionMatrix(s.tokens.length);
    drawTransformerExplorer();
};

window.initTransformerExplorer = function () {
    const s = aiDynState.transformer;
    s.canvas = document.getElementById('transformerCanvas');
    if (!s.canvas) return;
    s.ctx = s.canvas.getContext('2d');

    s.baseMatrix = generateAttentionMatrix(s.tokens.length);

    const tokenSlider = document.getElementById('transTokenSlider');
    const tempSlider = document.getElementById('transTempSlider');

    if (tokenSlider) {
        tokenSlider.max = String(s.tokens.length - 1);
        tokenSlider.value = String(s.selected);
        tokenSlider.oninput = (e) => {
            s.selected = parseInt(e.target.value, 10);
            const l = document.getElementById('transTokenLabel');
            if (l) l.innerText = String(s.selected);
            drawTransformerExplorer();
        };
    }

    if (tempSlider) {
        tempSlider.value = String(s.temp);
        tempSlider.oninput = (e) => {
            s.temp = parseFloat(e.target.value);
            const l = document.getElementById('transTempLabel');
            if (l) l.innerText = s.temp.toFixed(1);
            drawTransformerExplorer();
        };
    }

    const tl = document.getElementById('transTokenLabel');
    if (tl) tl.innerText = String(s.selected);
    const tml = document.getElementById('transTempLabel');
    if (tml) tml.innerText = s.temp.toFixed(1);

    drawTransformerExplorer();
};

// ===============================
// 2) BACKPROP PLAYGROUND
// ===============================
function backpropForward() {
    const s = aiDynState.backprop;
    const h = Math.tanh(s.w1 * s.x);
    const yhat = s.w2 * h;
    const loss = 0.5 * Math.pow(yhat - s.target, 2);
    return { h, yhat, loss };
}

function backpropGrads() {
    const s = aiDynState.backprop;
    const f = backpropForward();

    const dL_dyhat = f.yhat - s.target;
    const dL_dw2 = dL_dyhat * f.h;
    const dh_dw1 = (1 - f.h * f.h) * s.x;
    const dL_dw1 = dL_dyhat * s.w2 * dh_dw1;

    return { ...f, dL_dw1, dL_dw2 };
}

function syncBackpropUI(values) {
    const s = aiDynState.backprop;

    const map = [
        ['bpW1Label', s.w1.toFixed(2)],
        ['bpW2Label', s.w2.toFixed(2)],
        ['bpLrLabel', s.lr.toFixed(2)],
        ['bpPred', values.yhat.toFixed(3)],
        ['bpLoss', values.loss.toFixed(4)],
        ['bpDw1', values.dL_dw1.toFixed(4)],
        ['bpDw2', values.dL_dw2.toFixed(4)],
        ['bpInputVal', s.x.toFixed(1)],
        ['bpTargetVal', s.target.toFixed(1)]
    ];

    map.forEach(([id, v]) => {
        const el = document.getElementById(id);
        if (el) el.innerText = v;
    });
}

function drawBackprop() {
    const s = aiDynState.backprop;
    if (!s.ctx || !s.canvas) return;
    const ctx = s.ctx;
    const w = s.canvas.width;
    const h = s.canvas.height;
    const vals = backpropGrads();

    ctx.clearRect(0, 0, w, h);

    const inN = { x: 120, y: h / 2 };
    const hiddenN = { x: w / 2, y: h / 2 };
    const outN = { x: w - 120, y: h / 2 };

    const g1 = Math.min(1, Math.abs(vals.dL_dw1) / 2);
    const g2 = Math.min(1, Math.abs(vals.dL_dw2) / 2);

    ctx.lineWidth = 6;
    ctx.strokeStyle = `rgba(244, 63, 94, ${0.3 + g1 * 0.7})`;
    ctx.beginPath(); ctx.moveTo(inN.x, inN.y); ctx.lineTo(hiddenN.x, hiddenN.y); ctx.stroke();

    ctx.strokeStyle = `rgba(6, 182, 212, ${0.3 + g2 * 0.7})`;
    ctx.beginPath(); ctx.moveTo(hiddenN.x, hiddenN.y); ctx.lineTo(outN.x, outN.y); ctx.stroke();

    function node(n, label, color) {
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(n.x, n.y, 28, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 13px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(label, n.x, n.y + 4);
    }

    node(inN, 'x', '#7c3aed');
    node(hiddenN, 'h', '#f43f5e');
    node(outN, 'yhat', '#06b6d4');

    ctx.fillStyle = '#e5e7eb';
    ctx.font = '12px Arial';
    ctx.fillText(`w1=${s.w1.toFixed(2)}`, (inN.x + hiddenN.x) / 2, inN.y - 22);
    ctx.fillText(`w2=${s.w2.toFixed(2)}`, (hiddenN.x + outN.x) / 2, inN.y - 22);

    const barX = w / 2 - 160;
    const barY = 30;
    const barW = 320;
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(barX, barY, barW, 14);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(barX, barY, aiClamp((1 - Math.min(vals.loss, 1)) * barW, 0, barW), 14);
    ctx.fillStyle = '#d1d5db';
    ctx.fillText(`Loss: ${vals.loss.toFixed(4)}`, w / 2, 24);

    syncBackpropUI(vals);
}

window.stepBackprop = function () {
    const s = aiDynState.backprop;
    const vals = backpropGrads();
    s.w1 -= s.lr * vals.dL_dw1;
    s.w2 -= s.lr * vals.dL_dw2;

    const w1 = document.getElementById('bpW1');
    const w2 = document.getElementById('bpW2');
    if (w1) w1.value = String(s.w1);
    if (w2) w2.value = String(s.w2);

    drawBackprop();
};

window.resetBackprop = function () {
    const s = aiDynState.backprop;
    s.w1 = 0.5;
    s.w2 = 0.7;
    s.lr = 0.1;

    const w1 = document.getElementById('bpW1');
    const w2 = document.getElementById('bpW2');
    const lr = document.getElementById('bpLr');
    if (w1) w1.value = '0.5';
    if (w2) w2.value = '0.7';
    if (lr) lr.value = '0.1';

    drawBackprop();
};

window.initBackpropPlayground = function () {
    const s = aiDynState.backprop;
    s.canvas = document.getElementById('backpropCanvas');
    if (!s.canvas) return;
    s.ctx = s.canvas.getContext('2d');

    const w1 = document.getElementById('bpW1');
    const w2 = document.getElementById('bpW2');
    const lr = document.getElementById('bpLr');

    if (w1) {
        w1.oninput = (e) => {
            s.w1 = parseFloat(e.target.value);
            drawBackprop();
        };
    }
    if (w2) {
        w2.oninput = (e) => {
            s.w2 = parseFloat(e.target.value);
            drawBackprop();
        };
    }
    if (lr) {
        lr.oninput = (e) => {
            s.lr = parseFloat(e.target.value);
            drawBackprop();
        };
    }

    drawBackprop();
};

// ===============================
// 3) ML SANDBOX
// ===============================
function generateMLData(noise) {
    const pts = [];
    for (let i = 0; i < 120; i++) {
        pts.push({ x: aiRand(-0.95, -0.15) + aiRand(-noise, noise), y: aiRand(-0.8, 0.8) + aiRand(-noise, noise), c: 0 });
        pts.push({ x: aiRand(0.15, 0.95) + aiRand(-noise, noise), y: aiRand(-0.8, 0.8) + aiRand(-noise, noise), c: 1 });
    }
    return pts;
}

function toMLCanvas(x, y, w, h) {
    return {
        x: (x + 1) * 0.5 * w,
        y: (1 - (y + 1) * 0.5) * h
    };
}

function centroid(points, cls) {
    const arr = points.filter(p => p.c === cls);
    const n = Math.max(1, arr.length);
    const sx = arr.reduce((a, p) => a + p.x, 0) / n;
    const sy = arr.reduce((a, p) => a + p.y, 0) / n;
    return { x: sx, y: sy };
}

function predictLinear(p, c0, c1) {
    const wx = c1.x - c0.x;
    const wy = c1.y - c0.y;
    const mx = (c0.x + c1.x) * 0.5;
    const my = (c0.y + c1.y) * 0.5;
    const score = (p.x - mx) * wx + (p.y - my) * wy;
    return score >= 0 ? 1 : 0;
}

function predictKNN(p, points, k) {
    const sorted = points
        .map(q => ({ d: (q.x - p.x) ** 2 + (q.y - p.y) ** 2, c: q.c }))
        .sort((a, b) => a.d - b.d)
        .slice(0, k);
    const votes = sorted.reduce((acc, q) => acc + (q.c === 1 ? 1 : -1), 0);
    return votes >= 0 ? 1 : 0;
}

function drawMLSandbox() {
    const s = aiDynState.ml;
    if (!s.ctx || !s.canvas) return;
    const ctx = s.ctx;
    const w = s.canvas.width;
    const h = s.canvas.height;

    ctx.clearRect(0, 0, w, h);

    const c0 = centroid(s.points, 0);
    const c1 = centroid(s.points, 1);

    const step = 10;
    for (let py = 0; py < h; py += step) {
        for (let px = 0; px < w; px += step) {
            const x = (px / w) * 2 - 1;
            const y = -((py / h) * 2 - 1);
            const pred = s.model === 'linear'
                ? predictLinear({ x, y }, c0, c1)
                : predictKNN({ x, y }, s.points, 5);
            ctx.fillStyle = pred === 0 ? 'rgba(59,130,246,0.17)' : 'rgba(244,63,94,0.17)';
            ctx.fillRect(px, py, step, step);
        }
    }

    s.points.forEach(p => {
        const pos = toMLCanvas(p.x, p.y, w, h);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = p.c === 0 ? '#3b82f6' : '#f43f5e';
        ctx.fill();
    });

    let correct = 0;
    s.points.forEach(p => {
        const pred = s.model === 'linear'
            ? predictLinear(p, c0, c1)
            : predictKNN(p, s.points, 5);
        if (pred === p.c) correct++;
    });
    const acc = (correct / Math.max(1, s.points.length)) * 100;
    const accEl = document.getElementById('mlAcc');
    if (accEl) accEl.innerText = `${acc.toFixed(1)}%`;
}

window.regenMLData = function () {
    const s = aiDynState.ml;
    s.points = generateMLData(s.noise);
    drawMLSandbox();
};

window.trainMLModel = function () {
    drawMLSandbox();
};

window.initMLSandbox = function () {
    const s = aiDynState.ml;
    s.canvas = document.getElementById('mlCanvas');
    if (!s.canvas) return;
    s.ctx = s.canvas.getContext('2d');

    const model = document.getElementById('mlModel');
    const noise = document.getElementById('mlNoise');

    if (model) {
        model.value = s.model;
        model.onchange = (e) => {
            s.model = e.target.value;
            drawMLSandbox();
        };
    }

    if (noise) {
        noise.value = String(s.noise);
        noise.oninput = (e) => {
            s.noise = parseFloat(e.target.value);
            const nl = document.getElementById('mlNoiseLabel');
            if (nl) nl.innerText = s.noise.toFixed(2);
            s.points = generateMLData(s.noise);
            drawMLSandbox();
        };
    }

    const nl = document.getElementById('mlNoiseLabel');
    if (nl) nl.innerText = s.noise.toFixed(2);

    s.points = generateMLData(s.noise);
    drawMLSandbox();
};

// ===============================
// 4) NEURAL PDE LAB
// ===============================
function resetPDEFields() {
    const s = aiDynState.pde;
    const n = s.gw * s.gh;
    s.u = new Float32Array(n);
    s.v = new Float32Array(n);

    for (let i = 0; i < n; i++) {
        s.u[i] = 1;
        s.v[i] = 0;
    }

    for (let y = s.gh / 2 - 8; y < s.gh / 2 + 8; y++) {
        for (let x = s.gw / 2 - 8; x < s.gw / 2 + 8; x++) {
            const idx = y * s.gw + x;
            s.v[idx] = 1;
            s.u[idx] = 0;
        }
    }
}

function pdeStep() {
    const s = aiDynState.pde;
    const du = new Float32Array(s.u.length);
    const dv = new Float32Array(s.v.length);

    const F = 0.03 + s.R * 0.25;
    const k = 0.055 + s.R * 0.1;
    const Du = s.D;
    const Dv = s.D * 0.5;

    for (let y = 1; y < s.gh - 1; y++) {
        for (let x = 1; x < s.gw - 1; x++) {
            const i = y * s.gw + x;
            const lapU = s.u[i - 1] + s.u[i + 1] + s.u[i - s.gw] + s.u[i + s.gw] - 4 * s.u[i];
            const lapV = s.v[i - 1] + s.v[i + 1] + s.v[i - s.gw] + s.v[i + s.gw] - 4 * s.v[i];

            const uvv = s.u[i] * s.v[i] * s.v[i];
            du[i] = Du * lapU - uvv + F * (1 - s.u[i]);
            dv[i] = Dv * lapV + uvv - (F + k) * s.v[i];
        }
    }

    for (let i = 0; i < s.u.length; i++) {
        s.u[i] = aiClamp(s.u[i] + du[i], 0, 1);
        s.v[i] = aiClamp(s.v[i] + dv[i], 0, 1);
    }
}

function drawNeuralPDE() {
    const s = aiDynState.pde;
    if (!s.canvas || !s.ctx || !s.offscreen || !s.offctx) return;

    const img = s.offctx.createImageData(s.gw, s.gh);
    const data = img.data;

    let mean = 0;
    for (let i = 0; i < s.v.length; i++) mean += s.v[i];
    mean /= s.v.length;

    let variance = 0;
    for (let i = 0; i < s.v.length; i++) {
        variance += (s.v[i] - mean) ** 2;
    }
    variance /= s.v.length;

    for (let y = 0; y < s.gh; y++) {
        for (let x = 0; x < s.gw; x++) {
            const i = y * s.gw + x;
            const g = aiClamp(Math.floor((s.u[i] - s.v[i]) * 255), 0, 255);
            const r = aiClamp(Math.floor(80 + s.v[i] * 220), 0, 255);
            const b = aiClamp(Math.floor(255 - s.u[i] * 180), 0, 255);
            const idx = i * 4;
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
            data[idx + 3] = 255;
        }
    }

    s.offctx.putImageData(img, 0, 0);
    s.ctx.imageSmoothingEnabled = false;
    s.ctx.clearRect(0, 0, s.canvas.width, s.canvas.height);
    s.ctx.drawImage(s.offscreen, 0, 0, s.canvas.width, s.canvas.height);

    const varEl = document.getElementById('pdeVar');
    if (varEl) varEl.innerText = variance.toFixed(4);
}

function pdeLoop() {
    const s = aiDynState.pde;
    if (!document.getElementById('neuralPDECanvas')) {
        s.anim = null;
        return;
    }

    if (s.running) {
        for (let i = 0; i < 3; i++) pdeStep();
    }
    drawNeuralPDE();
    s.anim = requestAnimationFrame(pdeLoop);
}

window.toggleNeuralPDE = function () {
    const s = aiDynState.pde;
    s.running = !s.running;
    const btn = document.getElementById('pdeToggleBtn');
    if (btn) btn.innerText = s.running ? 'Pause' : 'Play';
};

window.resetNeuralPDE = function () {
    resetPDEFields();
};

window.initNeuralPDELab = function () {
    const s = aiDynState.pde;
    s.canvas = document.getElementById('neuralPDECanvas');
    if (!s.canvas) return;
    s.ctx = s.canvas.getContext('2d');

    if (!s.offscreen) {
        s.offscreen = document.createElement('canvas');
        s.offscreen.width = s.gw;
        s.offscreen.height = s.gh;
        s.offctx = s.offscreen.getContext('2d');
    }

    const d = document.getElementById('pdeD');
    const r = document.getElementById('pdeR');

    if (d) {
        d.value = String(s.D);
        d.oninput = (e) => {
            s.D = parseFloat(e.target.value);
            const l = document.getElementById('pdeDLabel');
            if (l) l.innerText = s.D.toFixed(2);
        };
    }

    if (r) {
        r.value = String(s.R);
        r.oninput = (e) => {
            s.R = parseFloat(e.target.value);
            const l = document.getElementById('pdeRLabel');
            if (l) l.innerText = s.R.toFixed(2);
        };
    }

    const dl = document.getElementById('pdeDLabel');
    if (dl) dl.innerText = s.D.toFixed(2);
    const rl = document.getElementById('pdeRLabel');
    if (rl) rl.innerText = s.R.toFixed(2);

    s.running = true;
    const btn = document.getElementById('pdeToggleBtn');
    if (btn) btn.innerText = 'Pause';

    resetPDEFields();
    if (s.anim) cancelAnimationFrame(s.anim);
    pdeLoop();
};

// ===============================
// 5) FREE ENERGY LAB
// ===============================
function computeFreeEnergy() {
    const s = aiDynState.freeEnergy;
    // Variational Free Energy F = Surprise + Complexity
    // Where Surprise = -log p(observation | prediction) ≈ prediction error
    // Complexity = KL divergence ≈ how far the model deviates from prior
    const surprise = Math.abs(s.observed - s.predicted);
    const free = surprise + s.complexity * 0.5;
    // Active inference: prediction is updated to minimize free energy
    return { surprise, free };
}

function drawFreeEnergy() {
    const s = aiDynState.freeEnergy;
    if (!s.canvas || !s.ctx) return;

    const ctx = s.ctx;
    const w = s.canvas.width;
    const h = s.canvas.height;

    s.observed = aiClamp(s.observed + aiRand(-0.01, 0.01), 0, 1);

    const vals = computeFreeEnergy();
    s.history.push(vals.free);
    if (s.history.length > 120) s.history.shift();

    ctx.clearRect(0, 0, w, h);

    const bx = 120;
    const by = 240;
    const barH = 170;

    ctx.fillStyle = '#374151';
    ctx.fillRect(bx, by - barH, 60, barH);
    ctx.fillRect(bx + 120, by - barH, 60, barH);

    ctx.fillStyle = '#22d3ee';
    ctx.fillRect(bx, by - s.predicted * barH, 60, s.predicted * barH);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(bx + 120, by - s.observed * barH, 60, s.observed * barH);

    ctx.fillStyle = '#e5e7eb';
    ctx.font = '12px Arial';
    ctx.fillText('Predit', bx + 8, by + 16);
    ctx.fillText('Observe', bx + 123, by + 16);

    ctx.strokeStyle = '#a78bfa';
    ctx.lineWidth = 2;
    ctx.beginPath();
    s.history.forEach((v, i) => {
        const x = 280 + i * 3;
        const y = 220 - aiClamp(v, -1, 1) * 80;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.fillStyle = '#d1d5db';
    ctx.fillText('Courbe energie libre', 280, 26);

    const sEl = document.getElementById('feSurprise');
    if (sEl) sEl.innerText = vals.surprise.toFixed(3);
    const fEl = document.getElementById('feValue');
    if (fEl) fEl.innerText = vals.free.toFixed(3);
}

function freeEnergyLoop() {
    const s = aiDynState.freeEnergy;
    if (!document.getElementById('freeEnergyCanvas')) {
        s.anim = null;
        return;
    }
    drawFreeEnergy();
    s.anim = requestAnimationFrame(freeEnergyLoop);
}

window.applyActiveInference = function () {
    const s = aiDynState.freeEnergy;
    s.predicted = aiLerp(s.predicted, s.observed, 0.35);
    s.complexity = aiClamp(s.complexity * 0.97, 0, 1);

    const c = document.getElementById('feComplex');
    if (c) c.value = String(s.complexity);
    const cl = document.getElementById('feComplexLabel');
    if (cl) cl.innerText = s.complexity.toFixed(2);
};

window.initFreeEnergyLab = function () {
    const s = aiDynState.freeEnergy;
    s.canvas = document.getElementById('freeEnergyCanvas');
    if (!s.canvas) return;
    s.ctx = s.canvas.getContext('2d');

    const c = document.getElementById('feComplex');
    const p = document.getElementById('fePrec');

    if (c) {
        c.value = String(s.complexity);
        c.oninput = (e) => {
            s.complexity = parseFloat(e.target.value);
            const cl = document.getElementById('feComplexLabel');
            if (cl) cl.innerText = s.complexity.toFixed(2);
        };
    }
    if (p) {
        p.value = String(s.precision);
        p.oninput = (e) => {
            s.precision = parseFloat(e.target.value);
            const pl = document.getElementById('fePrecLabel');
            if (pl) pl.innerText = s.precision.toFixed(2);
        };
    }

    const cl = document.getElementById('feComplexLabel');
    if (cl) cl.innerText = s.complexity.toFixed(2);
    const pl = document.getElementById('fePrecLabel');
    if (pl) pl.innerText = s.precision.toFixed(2);

    s.history = [];
    if (s.anim) cancelAnimationFrame(s.anim);
    freeEnergyLoop();
};

// ===============================
// 6) ACTION FLOW LAB
// ===============================
function buildPath(yOffset, rough, w, h) {
    const pts = [];
    const start = { x: 60, y: h / 2 };
    const end = { x: w - 60, y: h / 2 };

    for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const x = aiLerp(start.x, end.x, t);
        const base = h / 2 + yOffset * Math.sin(Math.PI * t);
        const y = base + rough * 25 * Math.sin(8 * Math.PI * t);
        pts.push({ x, y });
    }
    return pts;
}

function computeAction(path, rough, obstacle) {
    let action = 0;
    for (let i = 1; i < path.length; i++) {
        const dx = path[i].x - path[i - 1].x;
        const dy = path[i].y - path[i - 1].y;
        action += dx * dx + dy * dy;

        const ox = path[i].x - obstacle.x;
        const oy = path[i].y - obstacle.y;
        const d = Math.sqrt(ox * ox + oy * oy);
        if (d < obstacle.r + 18) {
            action += (obstacle.r + 18 - d) * 300 * (0.5 + rough);
        }
    }
    return action / 1000;
}

function drawActionFlow() {
    const s = aiDynState.actionFlow;
    if (!s.canvas || !s.ctx) return;

    const ctx = s.ctx;
    const w = s.canvas.width;
    const h = s.canvas.height;

    const obstacle = { x: w / 2, y: h / 2, r: 42 };
    const pathA = buildPath(-95, s.rough, w, h);
    const pathB = buildPath(95, s.rough, w, h);

    const actA = computeAction(pathA, s.rough, obstacle);
    const actB = computeAction(pathB, s.rough, obstacle);
    s.best = actA <= actB ? 'A' : 'B';

    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(239,68,68,0.65)';
    ctx.beginPath(); ctx.arc(obstacle.x, obstacle.y, obstacle.r, 0, Math.PI * 2); ctx.fill();

    function strokePath(path, color, width) {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        path.forEach((p, i) => {
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
    }

    strokePath(pathA, s.best === 'A' ? '#22c55e' : '#38bdf8', s.best === 'A' ? 4 : 2.5);
    strokePath(pathB, s.best === 'B' ? '#22c55e' : '#f472b6', s.best === 'B' ? 4 : 2.5);

    ctx.fillStyle = '#f3f4f6';
    ctx.font = '12px Arial';
    ctx.fillText('Depart', 32, h / 2 - 12);
    ctx.fillText('Objectif', w - 88, h / 2 - 12);

    const aEl = document.getElementById('afActionA');
    if (aEl) aEl.innerText = actA.toFixed(3);
    const bEl = document.getElementById('afActionB');
    if (bEl) bEl.innerText = actB.toFixed(3);
    const bestEl = document.getElementById('afBest');
    if (bestEl) bestEl.innerText = s.best;
}

window.recomputeActionPaths = function () {
    drawActionFlow();
};

window.initActionFlowLab = function () {
    const s = aiDynState.actionFlow;
    s.canvas = document.getElementById('actionFlowCanvas');
    if (!s.canvas) return;
    s.ctx = s.canvas.getContext('2d');

    const rough = document.getElementById('afRough');
    if (rough) {
        rough.value = String(s.rough);
        rough.oninput = (e) => {
            s.rough = parseFloat(e.target.value);
            const l = document.getElementById('afRoughLabel');
            if (l) l.innerText = s.rough.toFixed(2);
            drawActionFlow();
        };
    }

    const l = document.getElementById('afRoughLabel');
    if (l) l.innerText = s.rough.toFixed(2);

    drawActionFlow();
};

// ===============================
// 7) EQUIVARIANCE LAB
// ===============================
function drawCupShape(ctx, cx, cy, angleDeg, scale, color) {
    const a = angleDeg * Math.PI / 180;
    const pts = [
        [-22, -16], [18, -16], [22, 14], [-26, 14]
    ];

    function rot(x, y) {
        return {
            x: cx + scale * (x * Math.cos(a) - y * Math.sin(a)),
            y: cy + scale * (x * Math.sin(a) + y * Math.cos(a))
        };
    }

    ctx.beginPath();
    pts.forEach((p, i) => {
        const q = rot(p[0], p[1]);
        if (i === 0) ctx.moveTo(q.x, q.y); else ctx.lineTo(q.x, q.y);
    });
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    const h1 = rot(22, -8);
    const h2 = rot(34, -2);
    const h3 = rot(34, 10);
    const h4 = rot(22, 8);
    ctx.beginPath();
    ctx.moveTo(h1.x, h1.y);
    ctx.bezierCurveTo(h2.x, h2.y, h3.x, h3.y, h4.x, h4.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 6 * scale / 1.2;
    ctx.stroke();
}

function drawEquivariance() {
    const s = aiDynState.equivariance;
    if (!s.canvas || !s.ctx) return;

    const ctx = s.ctx;
    const w = s.canvas.width;
    const h = s.canvas.height;

    ctx.clearRect(0, 0, w, h);

    const leftX = w * 0.27;
    const rightX = w * 0.73;
    const cy = h * 0.5;

    drawCupShape(ctx, leftX, cy, s.angle, 1.5, '#fb7185');
    drawCupShape(ctx, rightX, cy, s.angle, 1.5, '#22c55e');

    const rad = s.angle * Math.PI / 180;
    const rawScore = Math.max(0, 0.9 * Math.exp(-Math.abs(rad) * 1.2));
    const invariantScore = 0.93;

    ctx.fillStyle = '#f3f4f6';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Modele naif', leftX, 34);
    ctx.fillText('Modele equivariant', rightX, 34);

    ctx.font = '12px Arial';
    ctx.fillText(`score=${rawScore.toFixed(2)}`, leftX, h - 22);
    ctx.fillText(`score=${invariantScore.toFixed(2)}`, rightX, h - 22);

    const rawEl = document.getElementById('eqRawScore');
    if (rawEl) rawEl.innerText = rawScore.toFixed(2);
    const invEl = document.getElementById('eqInvariantScore');
    if (invEl) invEl.innerText = invariantScore.toFixed(2);

    const l = document.getElementById('eqAngleLabel');
    if (l) l.innerText = `${Math.round(s.angle)} deg`;
}

function equivarianceLoop() {
    const s = aiDynState.equivariance;
    if (!document.getElementById('equivarianceCanvas') || !s.auto) {
        s.anim = null;
        return;
    }
    s.angle = (s.angle + 1.2) % 360;
    const slider = document.getElementById('eqAngle');
    if (slider) slider.value = String(s.angle);
    drawEquivariance();
    s.anim = requestAnimationFrame(equivarianceLoop);
}

window.spinEquivariance = function () {
    const s = aiDynState.equivariance;
    s.auto = !s.auto;
    if (s.auto && !s.anim) {
        s.anim = requestAnimationFrame(equivarianceLoop);
    }
};

window.initEquivarianceLab = function () {
    const s = aiDynState.equivariance;
    s.canvas = document.getElementById('equivarianceCanvas');
    if (!s.canvas) return;
    s.ctx = s.canvas.getContext('2d');
    s.auto = false;
    if (s.anim) cancelAnimationFrame(s.anim);
    s.anim = null;

    const slider = document.getElementById('eqAngle');
    if (slider) {
        slider.value = String(s.angle);
        slider.oninput = (e) => {
            s.angle = parseFloat(e.target.value);
            drawEquivariance();
        };
    }

    drawEquivariance();
};

// ===============================
// 8) ATTRACTOR LAB
// ===============================
function lorenzStep(state, dt) {
    const sigma = 10;
    const rho = 28;
    const beta = 8 / 3;

    const dx = sigma * (state.y - state.x);
    const dy = state.x * (rho - state.z) - state.y;
    const dz = state.x * state.y - beta * state.z;

    state.x += dx * dt;
    state.y += dy * dt;
    state.z += dz * dt;
}

function drawAttractor() {
    const s = aiDynState.attractor;
    if (!s.canvas || !s.ctx) return;

    const ctx = s.ctx;
    const w = s.canvas.width;
    const h = s.canvas.height;

    for (let i = 0; i < 4; i++) {
        lorenzStep(s.a, 0.008);
        lorenzStep(s.b, 0.008);

        s.pathA.push({ x: s.a.x, z: s.a.z });
        s.pathB.push({ x: s.b.x, z: s.b.z });
        if (s.pathA.length > 1600) s.pathA.shift();
        if (s.pathB.length > 1600) s.pathB.shift();
    }

    ctx.clearRect(0, 0, w, h);

    function proj(p) {
        return { x: w / 2 + p.x * 7.0, y: h / 2 - p.z * 5.5 };
    }

    ctx.strokeStyle = 'rgba(56,189,248,0.9)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    s.pathA.forEach((p, i) => {
        const q = proj(p);
        if (i === 0) ctx.moveTo(q.x, q.y); else ctx.lineTo(q.x, q.y);
    });
    ctx.stroke();

    ctx.strokeStyle = 'rgba(244,63,94,0.9)';
    ctx.beginPath();
    s.pathB.forEach((p, i) => {
        const q = proj(p);
        if (i === 0) ctx.moveTo(q.x, q.y); else ctx.lineTo(q.x, q.y);
    });
    ctx.stroke();

    const dist = Math.sqrt((s.a.x - s.b.x) ** 2 + (s.a.y - s.b.y) ** 2 + (s.a.z - s.b.z) ** 2);
    const dEl = document.getElementById('attDist');
    if (dEl) dEl.innerText = dist.toFixed(4);
}

function attractorLoop() {
    const s = aiDynState.attractor;
    if (!document.getElementById('attractorCanvas')) {
        s.anim = null;
        return;
    }
    drawAttractor();
    s.anim = requestAnimationFrame(attractorLoop);
}

window.resetAttractor = function () {
    const s = aiDynState.attractor;
    const d = parseFloat(document.getElementById('attDelta')?.value || '0.002');
    s.delta = d;
    s.a = { x: 0.1, y: 0, z: 0 };
    s.b = { x: 0.1 + d, y: 0, z: 0 };
    s.pathA = [];
    s.pathB = [];

    const l = document.getElementById('attDeltaLabel');
    if (l) l.innerText = d.toFixed(4);
};

window.initAttractorLab = function () {
    const s = aiDynState.attractor;
    s.canvas = document.getElementById('attractorCanvas');
    if (!s.canvas) return;
    s.ctx = s.canvas.getContext('2d');

    const slider = document.getElementById('attDelta');
    if (slider) {
        slider.value = String(s.delta);
        slider.oninput = (e) => {
            s.delta = parseFloat(e.target.value);
            const l = document.getElementById('attDeltaLabel');
            if (l) l.innerText = s.delta.toFixed(4);
        };
    }

    resetAttractor();
    if (s.anim) cancelAnimationFrame(s.anim);
    attractorLoop();
};

// ===============================
// 9) HYPERGRAPH LAB
// ===============================
function updateHyperLabels() {
    const s = aiDynState.hyper;
    const n = s.nodes.length;
    const e = s.edges.length;
    // Normalized density: edges per possible pair of nodes
    const maxEdges = n > 1 ? (n * (n - 1)) / 2 : 1;
    const density = Math.min(1, e / maxEdges);

    const nEl = document.getElementById('hyperNodes');
    if (nEl) nEl.innerText = String(n);
    const eEl = document.getElementById('hyperEdges');
    if (eEl) eEl.innerText = String(e);
    const dEl = document.getElementById('hyperDensity');
    if (dEl) dEl.innerText = density.toFixed(3);
}

function drawHypergraph() {
    const s = aiDynState.hyper;
    if (!s.canvas || !s.ctx) return;
    const ctx = s.ctx;
    const w = s.canvas.width;
    const h = s.canvas.height;

    ctx.clearRect(0, 0, w, h);

    s.nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 20 || n.x > w - 20) n.vx *= -1;
        if (n.y < 20 || n.y > h - 20) n.vy *= -1;
    });

    s.edges.forEach(edge => {
        for (let i = 0; i < edge.length; i++) {
            for (let j = i + 1; j < edge.length; j++) {
                const a = s.nodes[edge[i]];
                const b = s.nodes[edge[j]];
                if (!a || !b) continue;
                ctx.strokeStyle = 'rgba(56,189,248,0.3)';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }
    });

    s.nodes.forEach((n, i) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#84cc16';
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(String(i), n.x, n.y + 3);
    });

    updateHyperLabels();
}

window.hyperStep = function () {
    const s = aiDynState.hyper;
    if (!s.nodes.length) return;

    const addNode = Math.random() < 0.6;
    if (addNode) {
        const newIdx = s.nodes.length;
        s.nodes.push({
            x: aiRand(60, s.canvas.width - 60),
            y: aiRand(60, s.canvas.height - 60),
            vx: aiRand(-0.7, 0.7),
            vy: aiRand(-0.7, 0.7)
        });

        const a = Math.floor(Math.random() * newIdx);
        const b = Math.floor(Math.random() * newIdx);
        s.edges.push([a, b, newIdx]);
    } else {
        const a = Math.floor(Math.random() * s.nodes.length);
        const b = Math.floor(Math.random() * s.nodes.length);
        const c = Math.floor(Math.random() * s.nodes.length);
        const unique = [...new Set([a, b, c])];
        if (unique.length >= 2) s.edges.push(unique);
    }

    if (s.edges.length > 160) s.edges.shift();
    drawHypergraph();
};

window.toggleHyperAuto = function () {
    const s = aiDynState.hyper;
    s.auto = !s.auto;

    const btn = document.getElementById('hyperAutoBtn');
    if (btn) btn.innerText = s.auto ? 'Stop' : 'Auto';

    if (s.auto) {
        s.timer = setInterval(() => {
            if (!document.getElementById('hypergraphCanvas')) {
                clearInterval(s.timer);
                s.timer = null;
                s.auto = false;
                return;
            }
            window.hyperStep();
        }, 280);
    } else if (s.timer) {
        clearInterval(s.timer);
        s.timer = null;
    }
};

window.resetHypergraph = function () {
    const s = aiDynState.hyper;
    s.nodes = [];
    s.edges = [];

    for (let i = 0; i < 6; i++) {
        s.nodes.push({
            x: 80 + i * 100,
            y: 170 + 60 * Math.sin(i * 0.9),
            vx: aiRand(-0.5, 0.5),
            vy: aiRand(-0.5, 0.5)
        });
    }

    s.edges.push([0, 1, 2]);
    s.edges.push([2, 3]);
    s.edges.push([3, 4, 5]);
    s.edges.push([1, 4]);

    drawHypergraph();
};

window.initHypergraphLab = function () {
    const s = aiDynState.hyper;
    s.canvas = document.getElementById('hypergraphCanvas');
    if (!s.canvas) return;
    s.ctx = s.canvas.getContext('2d');

    s.auto = false;
    if (s.timer) clearInterval(s.timer);
    s.timer = null;

    const btn = document.getElementById('hyperAutoBtn');
    if (btn) btn.innerText = 'Auto';

    resetHypergraph();
};

// ===============================
// 10) UNIFIED STACK LAB
// ===============================
function scenarioBaseVector(scenario) {
    if (scenario === 'video') return [0.72, 0.84, 0.90, 0.76, 0.88];
    if (scenario === 'science') return [0.80, 0.86, 0.92, 0.90, 0.78];
    return [0.75, 0.88, 0.82, 0.80, 0.90];
}

function drawUnifiedRadar(values) {
    const s = aiDynState.stack;
    const ctx = s.ctx;
    const w = s.canvas.width;
    const h = s.canvas.height;

    ctx.clearRect(0, 0, w, h);

    const cx = w * 0.5;
    const cy = h * 0.53;
    const r = Math.min(w, h) * 0.33;
    const labels = ['Substrat', 'Perception', 'Dynamiques', 'Inference', 'Action'];

    for (let ring = 1; ring <= 4; ring++) {
        const rr = r * ring / 4;
        ctx.strokeStyle = 'rgba(148,163,184,0.25)';
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const a = -Math.PI / 2 + i * 2 * Math.PI / 5;
            const x = cx + rr * Math.cos(a);
            const y = cy + rr * Math.sin(a);
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
    }

    for (let i = 0; i < 5; i++) {
        const a = -Math.PI / 2 + i * 2 * Math.PI / 5;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);

        ctx.strokeStyle = 'rgba(148,163,184,0.35)';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.fillStyle = '#e5e7eb';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(labels[i], cx + (r + 22) * Math.cos(a), cy + (r + 22) * Math.sin(a));
    }

    ctx.fillStyle = 'rgba(34,197,94,0.22)';
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const a = -Math.PI / 2 + i * 2 * Math.PI / 5;
        const rr = r * values[i];
        const x = cx + rr * Math.cos(a);
        const y = cy + rr * Math.sin(a);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

window.updateUnifiedStack = function () {
    const s = aiDynState.stack;
    if (!s.canvas || !s.ctx) return;

    const scenario = document.getElementById('stackScenario')?.value || 'robot';
    const uncertainty = parseFloat(document.getElementById('stackUnc')?.value || '0.45');

    s.scenario = scenario;
    s.uncertainty = uncertainty;

    const base = scenarioBaseVector(scenario);
    const values = [
        aiClamp(base[0] - 0.2 * uncertainty, 0, 1),
        aiClamp(base[1] - 0.1 * uncertainty, 0, 1),
        aiClamp(base[2] - 0.05 * uncertainty, 0, 1),
        aiClamp(base[3] + 0.15 * uncertainty, 0, 1),
        aiClamp(base[4] - 0.1 * uncertainty, 0, 1)
    ];

    drawUnifiedRadar(values);

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const compute = Math.round(42 + 35 * mean * (1 - uncertainty));
    const futures = Math.max(2, Math.round(2 + 7 * uncertainty + values[3] * 2));
    const phys = Math.round(58 + 38 * values[2]);

    const ul = document.getElementById('stackUncLabel');
    if (ul) ul.innerText = uncertainty.toFixed(2);
    const cEl = document.getElementById('stackCompute');
    if (cEl) cEl.innerText = `${compute}%`;
    const fEl = document.getElementById('stackFutures');
    if (fEl) fEl.innerText = String(futures);
    const pEl = document.getElementById('stackPhys');
    if (pEl) pEl.innerText = `${phys}%`;
};

window.initUnifiedArchitectureLab = function () {
    const s = aiDynState.stack;
    s.canvas = document.getElementById('unifiedStackCanvas');
    if (!s.canvas) return;
    s.ctx = s.canvas.getContext('2d');

    const scenario = document.getElementById('stackScenario');
    const unc = document.getElementById('stackUnc');

    if (scenario) {
        scenario.value = s.scenario;
        scenario.onchange = () => updateUnifiedStack();
    }

    if (unc) {
        unc.value = String(s.uncertainty);
        unc.oninput = (e) => {
            s.uncertainty = parseFloat(e.target.value);
            updateUnifiedStack();
        };
    }

    updateUnifiedStack();
};
