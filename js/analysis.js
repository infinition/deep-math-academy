// ==========================================
// ANALYSIS SPECIFIC INTERACTIVE LOGIC
// ==========================================

// ==========================================
// LOGIC: GRADIENT DESCENT (ENRICHED)
// ==========================================
let gradCtx = null;
let gradCanvas = null;
let gradXVal = -2.5;
let learningRate = 0.1;
let gradAnimationId = null;

function initGradientCanvas() {
    gradCanvas = document.getElementById('gradientCanvas');
    if (!gradCanvas) return;
    gradCtx = gradCanvas.getContext('2d');

    // Listeners
    const lrSlider = document.getElementById('lrSlider');
    if (lrSlider) {
        lrSlider.addEventListener('input', (e) => {
            learningRate = parseFloat(e.target.value);
            document.getElementById('lrDisplay').innerText = learningRate.toFixed(2);
        });
    }

    drawGradient();
}

function drawGradient() {
    if (!gradCtx || !gradCanvas) return;
    const w = gradCanvas.width;
    const h = gradCanvas.height;
    const ctx = gradCtx;

    ctx.clearRect(0, 0, w, h);

    // Function f(x) = x^2 (scaled)
    // Scale: x from -3 to 3 maps to width
    // y from 0 to 9 maps to height
    const scaleX = w / 6; // 6 units total width
    const scaleY = (h - 40) / 9; // 9 units max height (with padding)
    const originX = w / 2;
    const originY = h - 20;

    // Draw Curve
    ctx.beginPath();
    ctx.strokeStyle = '#34d399'; // Emerald-400
    ctx.lineWidth = 3;
    for (let px = 0; px <= w; px++) {
        const x = (px - originX) / scaleX;
        const y = x * x;
        const py = originY - y * scaleY;
        if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Draw Ball
    const bx = originX + gradXVal * scaleX;
    const by = originY - (gradXVal * gradXVal) * scaleY;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(bx, by + 10, 10, 4, 0, 0, Math.PI * 2); ctx.fill();

    // Ball Body
    ctx.fillStyle = '#ef4444'; // Red-500
    ctx.beginPath(); ctx.arc(bx, by, 10, 0, Math.PI * 2); ctx.fill();

    // Highlight
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(bx - 3, by - 3, 3, 0, Math.PI * 2); ctx.fill();

    // Gradient Vector (Arrow)
    const slope = 2 * gradXVal;
    // Visualize slope direction
    const arrowLen = -slope * 20; // Scale for visibility
    // drawArrow(ctx, bx, by, bx + arrowLen, by, 'white', '');

    // Update Stats
    const loss = gradXVal * gradXVal;
    document.getElementById('gradXVal').innerText = gradXVal.toFixed(2);
    document.getElementById('gradSlopeVal').innerText = slope.toFixed(2);
    document.getElementById('gradLossVal').innerText = loss.toFixed(2);
}

function stepGradient() {
    const slope = 2 * gradXVal;
    gradXVal = gradXVal - learningRate * slope;
    drawGradient();
}

function resetGradient() {
    gradXVal = -2.5;
    if (gradAnimationId) {
        cancelAnimationFrame(gradAnimationId);
        gradAnimationId = null;
        const btn = document.getElementById('btnAutoGrad');
        if (btn) btn.innerHTML = "<span>▶️</span> Auto";
    }
    drawGradient();
}

function toggleAutoGradient() {
    if (gradAnimationId) {
        cancelAnimationFrame(gradAnimationId);
        gradAnimationId = null;
        document.getElementById('btnAutoGrad').innerHTML = "<span>▶️</span> Auto";
    } else {
        document.getElementById('btnAutoGrad').innerHTML = "<span>⏸️</span> Stop";
        loopGradient();
    }
}

function loopGradient() {
    stepGradient();
    if (Math.abs(gradXVal) > 0.01 && Math.abs(gradXVal) < 10) { // Stop if converged or exploded
        gradAnimationId = requestAnimationFrame(() => setTimeout(loopGradient, 100)); // Slow down animation
    } else {
        cancelAnimationFrame(gradAnimationId);
        gradAnimationId = null;
        document.getElementById('btnAutoGrad').innerHTML = "<span>▶️</span> Auto";
    }
}


// ==========================================
// LOGIC: INTEGRALS (RIEMANN)
// ==========================================
let intCanvas = null;
let intCtx = null;

function initIntegralCanvas() {
    intCanvas = document.getElementById('integralCanvas');
    if (!intCanvas) return;
    intCtx = intCanvas.getContext('2d');
    drawIntegral();
}

function drawIntegral() {
    if (!intCtx || !intCanvas) return;
    const ctx = intCtx;
    const w = intCanvas.width;
    const h = intCanvas.height;
    const n = parseInt(document.getElementById('rectSlider').value);
    document.getElementById('nbRectDisplay').innerText = n;

    ctx.clearRect(0, 0, w, h);

    // Function f(x) = 0.1 * x^2 + 1 (simple parabola)
    // Domain [0, 5]
    const xMin = 0, xMax = 5;
    const scaleX = w / (xMax + 1);
    const scaleY = h / 5;
    const originX = 40;
    const originY = h - 40;

    function f(x) { return 0.1 * x * x + 0.5; }

    // Draw Curve
    ctx.beginPath();
    ctx.strokeStyle = '#d97706'; // Amber-600
    ctx.lineWidth = 3;
    for (let px = 0; px <= (xMax * scaleX); px++) {
        const x = px / scaleX;
        const y = f(x);
        ctx.lineTo(originX + px, originY - y * scaleY);
    }
    ctx.stroke();

    // Draw Rectangles (Riemann Sum Left)
    const dx = (xMax - xMin) / n;
    let totalArea = 0;

    ctx.fillStyle = 'rgba(251, 191, 36, 0.4)'; // Amber-300
    ctx.strokeStyle = '#b45309'; // Amber-700
    ctx.lineWidth = 1;

    for (let i = 0; i < n; i++) {
        const x = xMin + i * dx;
        const y = f(x);
        const rectW = dx * scaleX;
        const rectH = y * scaleY;

        ctx.fillRect(originX + x * scaleX, originY - rectH, rectW, rectH);
        ctx.strokeRect(originX + x * scaleX, originY - rectH, rectW, rectH);

        totalArea += y * dx;
    }

    // Exact Area (Integral of 0.1x^2 + 0.5 from 0 to 5)
    // = [0.1/3 x^3 + 0.5x] from 0 to 5
    // = (0.1/3 * 125 + 2.5) - 0
    // = 4.166 + 2.5 = 6.66
    const exactArea = (0.1 / 3 * Math.pow(xMax, 3) + 0.5 * xMax) - (0.1 / 3 * Math.pow(xMin, 3) + 0.5 * xMin);

    document.getElementById('areaEst').innerText = totalArea.toFixed(3);
    document.getElementById('areaExact').innerText = exactArea.toFixed(3);
}


// ==========================================
// LOGIC: SEQUENCES (CONVERGENCE)
// ==========================================
let seqCanvas = null;
let seqCtx = null;
let seqData = [];
let seqEpoch = 0;

function initSequenceCanvas() {
    seqCanvas = document.getElementById('sequenceCanvas');
    if (!seqCanvas) return;
    seqCtx = seqCanvas.getContext('2d');
    resetSequence();
}

function resetSequence() {
    seqData = [];
    seqEpoch = 0;
    drawSequence();
}

function addSequencePoint() {
    seqEpoch++;
    // Simulate Loss: 1/x decay + noise
    const noise = (Math.random() - 0.5) * 0.5 / seqEpoch;
    const loss = 2 / Math.sqrt(seqEpoch) + noise;
    seqData.push({ x: seqEpoch, y: Math.max(0, loss) });
    drawSequence();
}

function drawSequence() {
    if (!seqCtx || !seqCanvas) return;
    const ctx = seqCtx;
    const w = seqCanvas.width;
    const h = seqCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Axes
    const padding = 40;
    const graphW = w - padding * 2;
    const graphH = h - padding * 2;

    ctx.strokeStyle = '#e5e7eb';
    ctx.beginPath();
    ctx.moveTo(padding, padding); ctx.lineTo(padding, h - padding); ctx.lineTo(w - padding, h - padding);
    ctx.stroke();

    if (seqData.length === 0) {
        ctx.fillStyle = '#9ca3af';
        ctx.font = '14px Arial';
        ctx.fillText("Appuyez sur 'Ajouter une Époque' pour commencer", w / 2 - 140, h / 2);
        return;
    }

    // Scales
    const maxEpoch = Math.max(10, seqData.length + 2);
    const maxLoss = 2.5; // Fixed for visual stability

    const scaleX = graphW / maxEpoch;
    const scaleY = graphH / maxLoss;

    // Draw Line
    ctx.beginPath();
    ctx.strokeStyle = '#e11d48'; // Rose-600
    ctx.lineWidth = 2;

    seqData.forEach((pt, i) => {
        const px = padding + pt.x * scaleX;
        const py = h - padding - pt.y * scaleY;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.stroke();

    // Draw Points
    ctx.fillStyle = '#be123c'; // Rose-700
    seqData.forEach(pt => {
        const px = padding + pt.x * scaleX;
        const py = h - padding - pt.y * scaleY;
        ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();
    });

    // Limit Line (y=0)
    ctx.strokeStyle = '#10b981'; // Emerald-500
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding, h - padding);
    ctx.lineTo(w - padding, h - padding);
    ctx.stroke();
    ctx.setLineDash([]);
}


// ==========================================
// LOGIC: FUNCTIONS (ACTIVATION)
// ==========================================
let funcCanvas = null;
let funcCtx = null;
let currentFunc = 'sigmoid';

function initFunctionCanvas() {
    funcCanvas = document.getElementById('functionCanvas');
    if (!funcCanvas) return;
    funcCtx = funcCanvas.getContext('2d');
    setActivationFunc('sigmoid');
}

function setActivationFunc(name) {
    currentFunc = name;

    // Update UI Buttons
    ['sigmoid', 'relu', 'tanh'].forEach(n => {
        const btn = document.getElementById(`btn${n.charAt(0).toUpperCase() + n.slice(1)}`);
        const desc = document.getElementById(`desc${n.charAt(0).toUpperCase() + n.slice(1)}`);

        if (n === name) {
            btn.classList.add('bg-violet-100', 'border-violet-500', 'text-violet-800');
            desc.classList.remove('hidden');
        } else {
            btn.classList.remove('bg-violet-100', 'border-violet-500', 'text-violet-800');
            desc.classList.add('hidden');
        }
    });

    drawActivation();
}

function drawActivation() {
    if (!funcCtx || !funcCanvas) return;
    const ctx = funcCtx;
    const w = funcCanvas.width;
    const h = funcCanvas.height;
    const inputVal = parseFloat(document.getElementById('inputSlider').value);
    document.getElementById('inputValDisplay').innerText = inputVal.toFixed(2);

    ctx.clearRect(0, 0, w, h);

    // Axes (Center)
    const cx = w / 2;
    const cy = h / 2;
    const scale = 40; // 40px = 1 unit

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    // Grid
    for (let i = 0; i < w; i += scale) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
    for (let i = 0; i < h; i += scale) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

    // Main Axes
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();

    // Function Logic
    let f = (x) => x;
    if (currentFunc === 'sigmoid') f = (x) => 1 / (1 + Math.exp(-x));
    if (currentFunc === 'relu') f = (x) => Math.max(0, x);
    if (currentFunc === 'tanh') f = (x) => Math.tanh(x);

    // Draw Curve
    ctx.beginPath();
    ctx.strokeStyle = '#7c3aed'; // Violet-600
    ctx.lineWidth = 3;

    for (let px = 0; px < w; px++) {
        const x = (px - cx) / scale;
        const y = f(x);
        const py = cy - y * scale;
        if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Draw Point
    const py = cy - f(inputVal) * scale;
    const px = cx + inputVal * scale;

    ctx.fillStyle = '#db2777'; // Pink-600
    ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();

    // Output Display
    document.getElementById('outputValDisplay').innerText = f(inputVal).toFixed(3);
}
