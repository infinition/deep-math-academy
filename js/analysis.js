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

// ==========================================
// LOGIC: NEURON SIMULATOR (INTRO)
// ==========================================
window.updateNeuroSim = function () {
    const slider = document.getElementById('weightSlider');
    if (!slider) return;

    const w = parseFloat(slider.value);
    const x = 2.0;
    const target = 4.0;
    const y = x * w;
    const loss = Math.pow(target - y, 2);

    // Update Text
    const wVal = document.getElementById('weightValue');
    if (wVal) wVal.innerText = w.toFixed(2);
    const cW = document.getElementById('calcW');
    if (cW) cW.innerText = w.toFixed(2);
    const oVal = document.getElementById('outputVal');
    if (oVal) oVal.innerText = y.toFixed(2);
    const lVal = document.getElementById('lossVal');
    if (lVal) lVal.innerText = loss.toFixed(2);

    // Update Bar
    const maxVal = 8.0;
    const pct = Math.min(100, Math.max(0, (y / maxVal) * 100));
    const bar = document.getElementById('barFill');
    const label = document.getElementById('barLabel');

    if (bar && label) {
        bar.style.height = `${pct}%`;
        label.innerText = y.toFixed(1);

        // Color change based on error
        if (loss < 0.1) {
            bar.classList.remove('bg-indigo-500', 'bg-red-500');
            bar.classList.add('bg-green-500');
        } else if (y > target) {
            bar.classList.remove('bg-indigo-500', 'bg-green-500');
            bar.classList.add('bg-red-500'); // Overshoot
        } else {
            bar.classList.remove('bg-red-500', 'bg-green-500');
            bar.classList.add('bg-indigo-500');
        }
    }

    // Success Message
    const successMsg = document.getElementById('successMsg');
    if (successMsg) {
        if (loss < 0.01) {
            successMsg.classList.remove('hidden');
        } else {
            successMsg.classList.add('hidden');
        }
    }
}


// ==========================================
// LOGIC: DERIVATIVES (TANGENT)
// ==========================================
let derivCanvas = null;
let derivCtx = null;
let derivX = 1.0;
let derivAnimId = null;

window.initDerivativeCanvas = function () {
    derivCanvas = document.getElementById('derivativeCanvas');
    if (!derivCanvas) return;
    derivCtx = derivCanvas.getContext('2d');

    // Listeners
    const slider = document.getElementById('derivX');
    if (slider) {
        slider.addEventListener('input', (e) => {
            derivX = parseFloat(e.target.value);
            stopDerivAnim();
            drawDerivative();
        });
    }

    const btn = document.getElementById('toggleAnimBtn');
    if (btn) {
        btn.onclick = toggleDerivAnim;
    }

    drawDerivative();
}
// Alias for config compatibility
window.initDerivativeGraph = window.initDerivativeCanvas;

function drawDerivative() {
    if (!derivCtx || !derivCanvas) return;
    const ctx = derivCtx;
    const w = derivCanvas.width;
    const h = derivCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Coordinate System
    // x: -3 to 3
    // y: -1 to 9
    const scaleX = w / 6;
    const scaleY = h / 10;

    const ox = w / 2;
    const oy = h - 50;

    // Draw Axes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.stroke(); // X axis
    ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke(); // Y axis

    // Function f(x) = x^2
    ctx.beginPath();
    ctx.strokeStyle = '#2563eb'; // Blue-600
    ctx.lineWidth = 3;
    for (let px = 0; px <= w; px++) {
        const x = (px - ox) / scaleX;
        const y = x * x;
        const py = oy - y * scaleY;
        if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Point P(x0, y0)
    const y0 = derivX * derivX;
    const px0 = ox + derivX * scaleX;
    const py0 = oy - y0 * scaleY;

    // Tangent Line: y - y0 = f'(x0)(x - x0)
    // y = 2*x0 * (x - x0) + y0
    const slope = 2 * derivX;

    // Draw Tangent (long line)
    ctx.beginPath();
    ctx.strokeStyle = '#dc2626'; // Red-600
    ctx.lineWidth = 2;
    // Calculate two points far away
    const xStart = -3;
    const yStart = slope * (xStart - derivX) + y0;
    const xEnd = 3;
    const yEnd = slope * (xEnd - derivX) + y0;

    ctx.moveTo(ox + xStart * scaleX, oy - yStart * scaleY);
    ctx.lineTo(ox + xEnd * scaleX, oy - yEnd * scaleY);
    ctx.stroke();

    // Draw Point
    ctx.fillStyle = '#2563eb';
    ctx.beginPath(); ctx.arc(px0, py0, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(px0, py0, 3, 0, Math.PI * 2); ctx.fill();

    // Draw Triangle for Slope
    if (Math.abs(slope) > 0.1) {
        ctx.fillStyle = 'rgba(220, 38, 38, 0.1)';
        ctx.beginPath();
        ctx.moveTo(px0, py0);
        ctx.lineTo(px0 + scaleX, py0); // Right 1 unit
        ctx.lineTo(px0 + scaleX, py0 - slope * scaleY); // Up/Down slope units
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#dc2626';
        ctx.setLineDash([2, 2]);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Update UI
    const xDisp = document.getElementById('xValDisplay');
    if (xDisp) xDisp.innerText = derivX.toFixed(2);
    const yDisp = document.getElementById('yValDisplay');
    if (yDisp) yDisp.innerText = y0.toFixed(2);
    const sDisp = document.getElementById('slopeVal');
    if (sDisp) sDisp.innerText = slope.toFixed(2);
}

function toggleDerivAnim() {
    if (derivAnimId) {
        stopDerivAnim();
    } else {
        loopDerivAnim();
        const btn = document.getElementById('toggleAnimBtn');
        if (btn) btn.innerHTML = "<span>⏸️</span> Stop";
    }
}

function stopDerivAnim() {
    if (derivAnimId) cancelAnimationFrame(derivAnimId);
    derivAnimId = null;
    const btn = document.getElementById('toggleAnimBtn');
    if (btn) btn.innerHTML = "<span>▶️</span> Animation Auto";
}

function loopDerivAnim() {
    derivX += 0.02;
    if (derivX > 2.5) derivX = -2.5;

    const slider = document.getElementById('derivX');
    if (slider) slider.value = derivX;

    drawDerivative();
    derivAnimId = requestAnimationFrame(loopDerivAnim);
}


// ==========================================
// LOGIC: DISTANCES
// ==========================================
let distCanvas = null;
let distCtx = null;
let distA = { x: -2, y: -1 };
let distB = { x: 2, y: 2 };
let isDraggingA = false;
let isDraggingB = false;

window.initDistancesCanvas = function () {
    distCanvas = document.getElementById('distancesCanvas');
    if (!distCanvas) return;
    distCtx = distCanvas.getContext('2d');

    // Mouse Events
    distCanvas.addEventListener('mousedown', handleDistMouseDown);
    distCanvas.addEventListener('mousemove', handleDistMouseMove);
    distCanvas.addEventListener('mouseup', () => { isDraggingA = false; isDraggingB = false; });
    distCanvas.addEventListener('mouseleave', () => { isDraggingA = false; isDraggingB = false; });

    // Touch Events
    distCanvas.addEventListener('touchstart', handleDistTouchStart, { passive: false });
    distCanvas.addEventListener('touchmove', handleDistTouchMove, { passive: false });
    distCanvas.addEventListener('touchend', () => { isDraggingA = false; isDraggingB = false; });

    drawDistances();
}

function getDistMousePos(evt) {
    const rect = distCanvas.getBoundingClientRect();
    const scaleX = distCanvas.width / rect.width;
    const scaleY = distCanvas.height / rect.height;

    const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;

    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

function toGraphCoords(px, py, w, h) {
    const scale = w / 10; // -5 to 5
    const cx = w / 2;
    const cy = h / 2;
    return {
        x: (px - cx) / scale,
        y: -(py - cy) / scale
    };
}

function toPixelCoords(gx, gy, w, h) {
    const scale = w / 10;
    const cx = w / 2;
    const cy = h / 2;
    return {
        x: cx + gx * scale,
        y: cy - gy * scale
    };
}

function handleDistMouseDown(e) {
    const pos = getDistMousePos(e);
    const w = distCanvas.width;
    const h = distCanvas.height;
    const pA = toPixelCoords(distA.x, distA.y, w, h);
    const pB = toPixelCoords(distB.x, distB.y, w, h);

    const dA = Math.hypot(pos.x - pA.x, pos.y - pA.y);
    const dB = Math.hypot(pos.x - pB.x, pos.y - pB.y);

    if (dA < 20) isDraggingA = true;
    else if (dB < 20) isDraggingB = true;
}

function handleDistMouseMove(e) {
    if (!isDraggingA && !isDraggingB) return;
    const pos = getDistMousePos(e);
    const w = distCanvas.width;
    const h = distCanvas.height;
    const gPos = toGraphCoords(pos.x, pos.y, w, h);

    if (isDraggingA) distA = gPos;
    if (isDraggingB) distB = gPos;

    drawDistances();
}

function handleDistTouchStart(e) {
    e.preventDefault();
    handleDistMouseDown(e);
}

function handleDistTouchMove(e) {
    e.preventDefault();
    handleDistMouseMove(e);
}

window.drawDistances = function () {
    if (!distCtx || !distCanvas) return;
    const ctx = distCtx;
    const w = distCanvas.width;
    const h = distCanvas.height;

    const chkL2 = document.getElementById('showL2');
    const showL2 = chkL2 ? chkL2.checked : true;
    const chkL1 = document.getElementById('showL1');
    const showL1 = chkL1 ? chkL1.checked : true;
    const chkCos = document.getElementById('showCos');
    const showCos = chkCos ? chkCos.checked : true;

    ctx.clearRect(0, 0, w, h);

    // Grid & Axes
    const scale = w / 10;
    const cx = w / 2;
    const cy = h / 2;

    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    for (let i = 0; i <= w; i += scale) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
    for (let i = 0; i <= h; i += scale) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();

    const pA = toPixelCoords(distA.x, distA.y, w, h);
    const pB = toPixelCoords(distB.x, distB.y, w, h);

    // L1 (Manhattan)
    if (showL1) {
        ctx.strokeStyle = '#22c55e'; // Green
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pA.y); // Horizontal leg
        ctx.lineTo(pB.x, pB.y); // Vertical leg
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // L2 (Euclidean)
    if (showL2) {
        ctx.strokeStyle = '#2563eb'; // Blue
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);
        ctx.stroke();
    }

    // Cosine (Vectors from Origin)
    if (showCos) {
        // Draw vectors from origin
        if (typeof drawArrow === 'function') {
            drawArrow(ctx, cx, cy, pA.x, pA.y, 'rgba(147, 51, 234, 0.3)', '');
            drawArrow(ctx, cx, cy, pB.x, pB.y, 'rgba(147, 51, 234, 0.3)', '');
        } else {
            // Fallback if drawArrow not available
            ctx.strokeStyle = 'rgba(147, 51, 234, 0.3)';
            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(pA.x, pA.y); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(pB.x, pB.y); ctx.stroke();
        }

        // Angle Arc
        const angA = Math.atan2(-distA.y, distA.x); // Graph coords y is inverted
        const angB = Math.atan2(-distB.y, distB.x);

        ctx.beginPath();
        ctx.strokeStyle = '#9333ea';
        ctx.lineWidth = 2;
        ctx.arc(cx, cy, 40, Math.min(angA, angB), Math.max(angA, angB)); // Simplified arc
        ctx.stroke();
    }

    // Points
    ctx.fillStyle = '#2563eb';
    ctx.beginPath(); ctx.arc(pA.x, pA.y, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'white'; ctx.fillText("A", pA.x - 4, pA.y + 4);

    ctx.fillStyle = '#dc2626';
    ctx.beginPath(); ctx.arc(pB.x, pB.y, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'white'; ctx.fillText("B", pB.x - 4, pB.y + 4);

    // Calculations
    const dx = distB.x - distA.x;
    const dy = distB.y - distA.y;

    const l2 = Math.sqrt(dx * dx + dy * dy);
    const l1 = Math.abs(dx) + Math.abs(dy);

    // Cosine Similarity
    const dot = distA.x * distB.x + distA.y * distB.y;
    const magA = Math.sqrt(distA.x * distA.x + distA.y * distA.y);
    const magB = Math.sqrt(distB.x * distB.x + distB.y * distB.y);
    const cosSim = (magA * magB) === 0 ? 0 : dot / (magA * magB);

    const vL2 = document.getElementById('valL2');
    if (vL2) vL2.innerText = l2.toFixed(2);
    const vL1 = document.getElementById('valL1');
    if (vL1) vL1.innerText = l1.toFixed(2);
    const vCos = document.getElementById('valCos');
    if (vCos) vCos.innerText = cosSim.toFixed(3);
}
