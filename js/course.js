// ==========================================
// COURSE SPECIFIC INTERACTIVE LOGIC
// ==========================================

// Global variables for interactives
let vennCanvasEl = null;
let vCtx = null;
let gradX = -2.5;
let numbersData = [10, 12, 14, 8, 16];
let normalChartInstance = null;

// ==========================================
// AJOUT INTERACTIF VENN (GLOBAL)
// ==========================================
function initVennCanvas() {
    vennCanvasEl = document.getElementById('vennCanvas');
    if (!vennCanvasEl) return;
    vCtx = vennCanvasEl.getContext('2d');
    vCtx.font = "14px Arial";
    drawVenn('UNION');
}
// ==========================================
// LOGIC: NEURO SIM (INTRO ANALYSE)
// ==========================================
function updateNeuroSim() {
    const slider = document.getElementById('weightSlider');
    if (!slider) return;

    const w = parseFloat(slider.value);
    const x = 2.0; // Input fixe
    const target = 4.0; // Target fixe
    const output = w * x;
    const error = Math.pow(target - output, 2); // Mean Squared Error simplified

    // Update Text values
    document.getElementById('weightValue').innerText = w.toFixed(2);
    document.getElementById('calcW').innerText = w.toFixed(2);
    document.getElementById('outputVal').innerText = output.toFixed(2);
    document.getElementById('barLabel').innerText = output.toFixed(2);
    document.getElementById('lossVal').innerText = error.toFixed(2);

    // Visual Updates
    const barFill = document.getElementById('barFill');
    const errorBox = document.getElementById('errorBox');
    const successMsg = document.getElementById('successMsg');

    // Max height reference (let's say target * 1.5 is full height)
    const maxHeight = target * 1.5;
    let pct = (output / maxHeight) * 100;
    // Clamp pct between 0 and 100 for CSS
    if (pct < 0) pct = 0;
    if (pct > 100) pct = 100;

    barFill.style.height = `${pct}%`;

    // Color Logic based on error
    if (error < 0.1) {
        barFill.className = "w-full bg-green-500 rounded-t transition-all duration-100 ease-out relative group shadow-[0_0_15px_rgba(34,197,94,0.6)]";
        errorBox.className = "absolute top-1/2 right-4 bg-green-600 text-white p-3 rounded-lg shadow-xl text-center transition-all transform scale-110";
        successMsg.classList.remove('hidden');
    } else {
        successMsg.classList.add('hidden');
        if (output > target) {
            // Too high (Orange/Red)
            barFill.className = "w-full bg-orange-500 rounded-t transition-all duration-100 ease-out relative group";
            errorBox.className = "absolute top-1/2 right-4 bg-orange-600/90 text-white p-3 rounded-lg shadow-lg text-center transition-all";
        } else {
            // Too low (Indigo/Blue)
            barFill.className = "w-full bg-indigo-500 rounded-t transition-all duration-100 ease-out relative group";
            errorBox.className = "absolute top-1/2 right-4 bg-red-500/90 text-white p-3 rounded-lg shadow-lg text-center transition-all";
        }
    }
}

// js/modules/interactions.js

function initDerivativeGraph() {
    console.log("Initialisation du Labo Dérivées");

    const canvas = document.getElementById('derivativeCanvas');
    const slider = document.getElementById('derivX');
    const btnAnim = document.getElementById('toggleAnimBtn');

    // Elements d'affichage
    const xDisplay = document.getElementById('xValDisplay');
    const yDisplay = document.getElementById('yValDisplay');
    const slopeDisplay = document.getElementById('slopeVal');

    if (!canvas || !slider) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;

    // État de l'animation
    let isAnimating = false;
    let animationId = null;
    let animationDirection = 1; // 1 pour droite, -1 pour gauche

    // Configuration du graphique
    const scaleX = 60; // 60px pour 1 unité
    const scaleY = 60;
    const originX = width / 2;
    const originY = height - 50; // Un peu plus bas pour voir la parabole

    function f(x) { return x * x; }       // La fonction f(x) = x^2
    function df(x) { return 2 * x; }      // La dérivée f'(x) = 2x

    function draw() {
        const xVal = parseFloat(slider.value);
        const yVal = f(xVal);
        const slope = df(xVal);

        // 1. Nettoyage
        ctx.clearRect(0, 0, width, height);

        // 2. Grille & Axes
        ctx.beginPath();
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        // Grille verticale
        for (let i = 0; i < width; i += scaleX / 2) { ctx.moveTo(i, 0); ctx.lineTo(i, height); }
        // Grille horizontale
        for (let i = 0; i < height; i += scaleY / 2) { ctx.moveTo(0, i); ctx.lineTo(width, i); }
        ctx.stroke();

        // Axes principaux
        ctx.beginPath();
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 2;
        ctx.moveTo(0, originY); ctx.lineTo(width, originY); // Axe X
        ctx.moveTo(originX, 0); ctx.lineTo(originX, height); // Axe Y
        ctx.stroke();

        // 3. Dessiner la courbe f(x) = x^2
        ctx.beginPath();
        ctx.strokeStyle = '#2563eb'; // Bleu Tailwind
        ctx.lineWidth = 3;
        ctx.moveTo(0, originY - f((0 - originX) / scaleX) * scaleY);

        for (let px = 0; px <= width; px += 2) {
            const worldX = (px - originX) / scaleX;
            const worldY = f(worldX);
            const py = originY - worldY * scaleY;
            ctx.lineTo(px, py);
        }
        ctx.stroke();

        // 4. Dessiner le point actuel
        const px = originX + xVal * scaleX;
        const py = originY - yVal * scaleY;

        ctx.beginPath();
        ctx.fillStyle = '#dc2626'; // Rouge
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();

        // 5. Dessiner la Tangente
        // Équation tangente : y - yVal = slope * (x - xVal) => y = slope*(x - xVal) + yVal
        ctx.beginPath();
        ctx.strokeStyle = '#dc2626'; // Rouge
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]); // Pointillés

        // On dessine une ligne longue autour du point (longueur arbitraire dx=1.5)
        const dxLine = 1.5;
        const x1 = xVal - dxLine;
        const y1 = slope * (x1 - xVal) + yVal;
        const x2 = xVal + dxLine;
        const y2 = slope * (x2 - xVal) + yVal;

        ctx.moveTo(originX + x1 * scaleX, originY - y1 * scaleY);
        ctx.lineTo(originX + x2 * scaleX, originY - y2 * scaleY);
        ctx.stroke();
        ctx.setLineDash([]); // Reset

        // 6. Mise à jour des textes HTML
        xDisplay.innerText = xVal.toFixed(1);
        yDisplay.innerText = yVal.toFixed(2);
        slopeDisplay.innerText = slope.toFixed(2);
    }

    // Gestion Animation Auto
    function animate() {
        if (!isAnimating) return;

        let val = parseFloat(slider.value);
        val += 0.02 * animationDirection;

        // Rebondir aux bords
        if (val >= 2.5 || val <= -2.5) {
            animationDirection *= -1;
        }

        slider.value = val;
        draw();
        animationId = requestAnimationFrame(animate);
    }

    // Event Listeners
    slider.addEventListener('input', () => {
        // Si l'utilisateur touche, on arrête l'animation
        if (isAnimating) {
            isAnimating = false;
            cancelAnimationFrame(animationId);
            btnAnim.innerHTML = "<span>▶️</span> Animation Auto";
            btnAnim.classList.remove('bg-red-500', 'hover:bg-red-600');
            btnAnim.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
        }
        draw();
    });

    btnAnim.addEventListener('click', () => {
        isAnimating = !isAnimating;
        if (isAnimating) {
            btnAnim.innerHTML = "<span>⏸️</span> Stop";
            btnAnim.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
            btnAnim.classList.add('bg-red-500', 'hover:bg-red-600');
            animate();
        } else {
            btnAnim.innerHTML = "<span>▶️</span> Animation Auto";
            btnAnim.classList.remove('bg-red-500', 'hover:bg-red-600');
            btnAnim.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
            cancelAnimationFrame(animationId);
        }
    });

    // Premier dessin
    draw();
}
function drawVenn(mode) {
    if (!vCtx || !vennCanvasEl) return;

    const desc = document.getElementById('venn-desc');
    const w = vennCanvasEl.width;
    const h = vennCanvasEl.height;

    vCtx.clearRect(0, 0, w, h);

    // Centers
    const cA = { x: w / 2 - 60, y: h / 2, r: 80 };
    const cB = { x: w / 2 + 60, y: h / 2, r: 80 };

    // Draw Base Circles (Outlines)
    function drawCircle(c, color, label) {
        vCtx.beginPath();
        vCtx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        vCtx.strokeStyle = color;
        vCtx.lineWidth = 3;
        vCtx.stroke();

        vCtx.fillStyle = color;
        vCtx.font = "bold 16px Arial";
        vCtx.textAlign = "center";
        vCtx.fillText(label, c.x, c.y - c.r - 10);
    }

    drawCircle(cA, '#3b82f6', "Ensemble A"); // Blue
    drawCircle(cB, '#10b981', "Ensemble B"); // Green

    // Fill Logic
    vCtx.fillStyle = 'rgba(99, 102, 241, 0.5)'; // Indigo-500 transparent

    if (mode === 'A') {
        vCtx.beginPath();
        vCtx.arc(cA.x, cA.y, cA.r, 0, Math.PI * 2);
        vCtx.fill();
        if (desc) desc.innerHTML = "Tout ce qui est dans <span class='text-blue-600'>A</span> (y compris l'intersection).";
    }
    else if (mode === 'B') {
        vCtx.fillStyle = 'rgba(16, 185, 129, 0.5)'; // Emerald
        vCtx.beginPath();
        vCtx.arc(cB.x, cB.y, cB.r, 0, Math.PI * 2);
        vCtx.fill();
        if (desc) desc.innerHTML = "Tout ce qui est dans <span class='text-green-600'>B</span> (y compris l'intersection).";
    }
    else if (mode === 'UNION') {
        vCtx.fillStyle = 'rgba(245, 158, 11, 0.4)'; // Amber
        // Draw A
        vCtx.beginPath(); vCtx.arc(cA.x, cA.y, cA.r, 0, Math.PI * 2); vCtx.fill();
        // Draw B
        vCtx.beginPath(); vCtx.arc(cB.x, cB.y, cB.r, 0, Math.PI * 2); vCtx.fill();

        if (desc) desc.innerHTML = "<span class='text-amber-600'>Union (A ∪ B)</span> : Tout le monde est invité.";
    }
    else if (mode === 'INTER') {
        vCtx.save();
        vCtx.beginPath();
        vCtx.arc(cA.x, cA.y, cA.r, 0, Math.PI * 2);
        vCtx.clip();

        vCtx.beginPath();
        vCtx.arc(cB.x, cB.y, cB.r, 0, Math.PI * 2);
        vCtx.fillStyle = 'rgba(225, 29, 72, 0.6)'; // Rose-600
        vCtx.fill();
        vCtx.restore();

        if (desc) desc.innerHTML = "<span class='text-rose-600'>Intersection (A ∩ B)</span> : Seulement la zone commune.";
    }
}

// ==========================================
// AJOUT INTERACTIF ADDITION VECTEURS SOURIS
// ==========================================
function initVectorAdditionCanvas() {
    const c = document.getElementById('vectorAddCanvas');
    if (!c) return;
    const ctx = c.getContext('2d');

    let mouseX = 300;
    let mouseY = 120;

    function drawGrid() {
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        for (let i = 0; i < c.width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, c.height);
            ctx.stroke();
        }
        for (let i = 0; i < c.height; i += 20) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(c.width, i);
            ctx.stroke();
        }
    }

    function drawVectors() {
        ctx.clearRect(0, 0, c.width, c.height);

        drawGrid();

        const originX = 70;
        const originY = 250;

        // Vector 1 fixed (blue)
        const v1x = 110;
        const v1y = -60;
        // drawArrow is defined in global.js
        if (typeof drawArrow === 'function') {
            drawArrow(ctx, originX, originY, originX + v1x, originY + v1y, '#3b82f6', 'v1');

            // Vector 2 mouse controlled (red) from tip of v1
            const tip1X = originX + v1x;
            const tip1Y = originY + v1y;
            drawArrow(ctx, tip1X, tip1Y, mouseX, mouseY, '#ef4444', 'v2');

            // Resultant (green) from origin to mouse
            drawArrow(ctx, originX, originY, mouseX, mouseY, '#10b981', 'v1+v2');
        }
    }

    function onMove(e) {
        const rect = c.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        requestAnimationFrame(drawVectors);
    }

    c.addEventListener('mousemove', onMove);
    drawVectors();
}

// --- INTERACTIVE: ALGEBRA (SLIDERS VECTEUR) ---
function initVectorCanvas() {
    const c = document.getElementById('vectorCanvas'); if (!c) return;
    const ctx = c.getContext('2d');
    const inputs = [document.getElementById('vecX'), document.getElementById('vecY')];

    function draw() {
        const w = c.width, h = c.height;
        const vx = parseInt(inputs[0].value);
        const vy = parseInt(inputs[1].value);

        ctx.clearRect(0, 0, w, h);

        // Grid
        ctx.strokeStyle = '#f0f0f0';
        ctx.lineWidth = 1;
        for (let i = 0; i <= w; i += 20) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
        }
        for (let i = 0; i <= h; i += 20) {
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
        }

        // Axes
        ctx.strokeStyle = '#cbd5e0';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();

        // Vector
        const ex = w / 2 + vx * 20;
        const ey = h / 2 - vy * 20;
        ctx.strokeStyle = '#4f46e5';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(w / 2, h / 2);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        // Point
        ctx.fillStyle = '#4f46e5';
        ctx.beginPath();
        ctx.arc(ex, ey, 6, 0, Math.PI * 2);
        ctx.fill();

        document.getElementById('dispX').innerText = vx;
        document.getElementById('dispY').innerText = vy;
        document.getElementById('vecNorm').innerText = Math.sqrt(vx * vx + vy * vy).toFixed(2);
    }

    inputs.forEach(i => i.addEventListener('input', draw));
    draw();
}

function calcDet() {
    const g = (id) => parseFloat(document.getElementById(id).value) || 0;
    const res = (g('detA') * g('detD')) - (g('detB') * g('detC'));
    const el = document.getElementById('detResult');
    const vis = document.getElementById('detVisual');

    if (!el || !vis) return;

    el.innerText = res.toFixed(1);

    const scale = Math.min(Math.max(Math.abs(res) / 4, 0.2), 1.5);
    vis.style.transform = `scale(${scale})`;

    const comment = document.getElementById('detComment');
    if (Math.abs(res) < 0.001) {
        el.className = "text-4xl font-bold text-red-600";
        if (comment) comment.innerText = "⚠️ Matrice Singulière (Écrasement)";
        vis.style.backgroundColor = "#feb2b2";
        vis.style.borderColor = "#9b2c2c";
    } else {
        el.className = "text-4xl font-bold text-indigo-600";
        if (comment) comment.innerText = `L'aire est multipliée par ${Math.abs(res.toFixed(1))}`;
        vis.style.backgroundColor = "#ebf4ff";
        vis.style.borderColor = "#4c51bf";
    }
}

// --- INTERACTIVE: ANALYSIS ---
function initDerivativeCanvas() {
    const c = document.getElementById('derivativeCanvas'); if (!c) return;
    const ctx = c.getContext('2d');
    const inp = document.getElementById('derivX');

    function draw() {
        const w = c.width, h = c.height, x0 = parseFloat(inp.value);
        document.getElementById('xValDisplay').innerText = x0.toFixed(1);
        ctx.clearRect(0, 0, w, h);

        // Axes
        ctx.strokeStyle = '#eee';
        ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, h - 20); ctx.lineTo(w, h - 20); ctx.stroke();

        // f(x) = x^2
        ctx.beginPath();
        ctx.strokeStyle = '#4f46e5';
        ctx.lineWidth = 3;
        const scaleX = 40; const scaleY = 20;
        for (let px = 0; px < w; px++) {
            const x = (px - w / 2) / scaleX;
            const y = h - 20 - (x * x) * scaleY;
            if (px === 0) ctx.moveTo(px, y); else ctx.lineTo(px, y);
        }
        ctx.stroke();

        // Point
        const px0 = x0 * scaleX + w / 2;
        const py0 = h - 20 - (x0 * x0) * scaleY;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(px0, py0, 6, 0, Math.PI * 2); ctx.fill();

        // Tangent
        const slope = 2 * x0;
        document.getElementById('slopeVal').innerText = slope.toFixed(2);

        ctx.beginPath();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        const dx = 2;
        const pt1x = x0 - dx; const pt1y = (x0 * x0) + slope * (pt1x - x0);
        const pt2x = x0 + dx; const pt2y = (x0 * x0) + slope * (pt2x - x0);

        ctx.moveTo(pt1x * scaleX + w / 2, h - 20 - pt1y * scaleY);
        ctx.lineTo(pt2x * scaleX + w / 2, h - 20 - pt2y * scaleY);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    inp.addEventListener('input', draw);
    draw();
}

function drawGradient() {
    const c = document.getElementById('gradientCanvas'); if (!c) return;
    const ctx = c.getContext('2d');
    const w = c.width, h = c.height;
    ctx.clearRect(0, 0, w, h);

    // Curve
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 2;
    for (let px = 0; px < w; px++) {
        const x = (px - w / 2) / 40;
        const y = h - 20 - (x * x) * 20;
        if (px === 0) ctx.moveTo(px, y); else ctx.lineTo(px, y);
    }
    ctx.stroke();

    // Ball
    const bx = gradX * 40 + w / 2;
    const by = h - 20 - (gradX * gradX) * 20;

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath(); ctx.ellipse(bx, by + 10, 8, 3, 0, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#4ade80';
    ctx.beginPath(); ctx.arc(bx, by, 8, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(bx - 2, by - 2, 3, 0, Math.PI * 2); ctx.fill();
}

function stepGradient() {
    gradX = gradX - 0.2 * (2 * gradX);
    drawGradient();
}

function resetGradient() { gradX = -2.5; drawGradient(); }

// --- INTERACTIVE: STATS ---
function addNumber() {
    const val = parseFloat(document.getElementById('newNumber').value);
    if (!isNaN(val) && val >= 0) {
        numbersData.push(val);
        updateStatsUI();
        document.getElementById('newNumber').value = '';
    }
}

function resetNumbers() { numbersData = [10, 12, 14, 8, 16]; updateStatsUI(); }

function updateStatsUI() {
    const container = document.getElementById('numbers-container'); if (!container) return;
    container.innerHTML = numbersData.map(n => `<span class="bg-gray-100 px-3 py-1 rounded-full text-sm font-bold text-gray-700 shadow-sm border animate-pulse">${n}</span>`).join('');
    const sum = numbersData.reduce((a, b) => a + b, 0);
    const sorted = [...numbersData].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const med = sorted.length % 2 !== 0 ? sorted[mid] : ((sorted[mid - 1] + sorted[mid]) / 2);
    document.getElementById('meanVal').innerText = (sum / numbersData.length).toFixed(1);
    document.getElementById('medianVal').innerText = med.toFixed(1);
}

function initNormalChart() {
    const c = document.getElementById('normalChart'); if (!c) return;
    const ctx = c.getContext('2d');
    if (normalChartInstance) normalChartInstance.destroy();

    if (typeof Chart === 'undefined') {
        console.error("Chart.js not loaded");
        return;
    }

    normalChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Densité de Probabilité',
                data: [],
                borderColor: '#4f46e5',
                borderWidth: 3,
                pointRadius: 0,
                fill: true,
                backgroundColor: 'rgba(79, 70, 229, 0.2)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { x: { type: 'linear', min: -5, max: 5 }, y: { display: false } },
            plugins: { legend: { display: false } },
            animation: { duration: 0 }
        }
    });
    updateNormalChart();
}

function updateNormalChart() {
    if (!normalChartInstance) return;
    const muInput = document.getElementById('muRange');
    const sigmaInput = document.getElementById('sigmaRange');

    if (!muInput || !sigmaInput) return;

    const mu = parseFloat(muInput.value);
    const sigma = parseFloat(sigmaInput.value);
    const pts = [];
    for (let x = -5; x <= 5; x += 0.1) {
        const y = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
        pts.push({ x: x, y: y });
    }
    normalChartInstance.data.datasets[0].data = pts;
    normalChartInstance.update();
}

// ==========================================
// LOGIC: DISTANCES INTERACTIVE
// ==========================================
let distCanvas = null;
let distCtx = null;
let distPoints = {
    A: { x: 150, y: 250, color: '#2563eb' }, // Blue
    B: { x: 450, y: 150, color: '#dc2626' }  // Red
};
let isDraggingDist = null;

function initDistancesCanvas() {
    distCanvas = document.getElementById('distancesCanvas');
    if (!distCanvas) return;
    distCtx = distCanvas.getContext('2d');

    // Helper to get correct coordinates
    function getMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (evt.clientX - rect.left) * scaleX,
            y: (evt.clientY - rect.top) * scaleY
        };
    }

    // Mouse Down
    distCanvas.addEventListener('mousedown', (e) => {
        const pos = getMousePos(distCanvas, e);

        // Check collision with A or B (radius 20 for easier grabbing)
        if (Math.hypot(pos.x - distPoints.A.x, pos.y - distPoints.A.y) < 20) isDraggingDist = 'A';
        else if (Math.hypot(pos.x - distPoints.B.x, pos.y - distPoints.B.y) < 20) isDraggingDist = 'B';
    });

    // Mouse Move (Window for smooth dragging)
    window.addEventListener('mousemove', (e) => {
        if (!isDraggingDist || !distCanvas) return;
        e.preventDefault(); // Prevent selection
        const pos = getMousePos(distCanvas, e);

        // Clamp to canvas bounds
        distPoints[isDraggingDist].x = Math.max(10, Math.min(distCanvas.width - 10, pos.x));
        distPoints[isDraggingDist].y = Math.max(10, Math.min(distCanvas.height - 10, pos.y));

        drawDistances();
    });

    window.addEventListener('mouseup', () => {
        isDraggingDist = null;
    });

    // Touch Support
    distCanvas.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const pos = getMousePos(distCanvas, touch);
        if (Math.hypot(pos.x - distPoints.A.x, pos.y - distPoints.A.y) < 20) isDraggingDist = 'A';
        else if (Math.hypot(pos.x - distPoints.B.x, pos.y - distPoints.B.y) < 20) isDraggingDist = 'B';
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
        if (!isDraggingDist || !distCanvas) return;
        e.preventDefault();
        const touch = e.touches[0];
        const pos = getMousePos(distCanvas, touch);

        distPoints[isDraggingDist].x = Math.max(10, Math.min(distCanvas.width - 10, pos.x));
        distPoints[isDraggingDist].y = Math.max(10, Math.min(distCanvas.height - 10, pos.y));

        drawDistances();
    }, { passive: false });

    window.addEventListener('touchend', () => {
        isDraggingDist = null;
    });

    drawDistances();
}

function drawDistances() {
    if (!distCtx || !distCanvas) return;
    const w = distCanvas.width;
    const h = distCanvas.height;
    const ctx = distCtx;

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    for (let i = 0; i <= w; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
    for (let i = 0; i <= h; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

    // Axes (Center)
    // We treat top-left as 0,0 for canvas, but let's visualize axes relative to screen
    // Actually, simple grid is enough. Let's draw lines between points.

    const A = distPoints.A;
    const B = distPoints.B;

    const showL2 = document.getElementById('showL2')?.checked;
    const showL1 = document.getElementById('showL1')?.checked;
    const showCos = document.getElementById('showCos')?.checked;

    // L1 (Manhattan) - Green Step
    if (showL1) {
        ctx.strokeStyle = '#22c55e'; // Green-500
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, A.y); // Horizontal leg
        ctx.lineTo(B.x, B.y); // Vertical leg
        ctx.stroke();
        ctx.setLineDash([]);

        // Corner point
        ctx.fillStyle = '#22c55e';
        ctx.beginPath(); ctx.arc(B.x, A.y, 4, 0, Math.PI * 2); ctx.fill();
    }

    // L2 (Euclidean) - Blue Line
    if (showL2) {
        ctx.strokeStyle = '#2563eb'; // Blue-600
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.stroke();
    }

    // Cosine (Vectors from Origin) - Purple
    // Let's assume Origin is (50, 350) to make it look like a graph
    const origin = { x: 50, y: 350 };

    if (showCos) {
        // Draw Origin Axes
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(origin.x, origin.y); ctx.lineTo(origin.x + 300, origin.y); // X
        ctx.moveTo(origin.x, origin.y); ctx.lineTo(origin.x, origin.y - 300); // Y
        ctx.stroke();

        // Vector A (relative to origin, scaled down if needed)
        // We map canvas coords to vector coords roughly
        // Let's just draw vectors to the points A and B directly for simplicity, 
        // treating the canvas top-left as 0,0 is confusing. 
        // Let's treat the dragged points as the tips of vectors from the visual origin.

        // Draw Vector to A
        drawArrow(ctx, origin.x, origin.y, A.x, A.y, '#9333ea', 'A'); // Purple
        // Draw Vector to B
        drawArrow(ctx, origin.x, origin.y, B.x, B.y, '#db2777', 'B'); // Pink

        // Angle Arc
        const angleA = Math.atan2(A.y - origin.y, A.x - origin.x);
        const angleB = Math.atan2(B.y - origin.y, B.x - origin.x);

        ctx.beginPath();
        ctx.strokeStyle = '#9333ea';
        ctx.lineWidth = 2;
        ctx.arc(origin.x, origin.y, 40, Math.min(angleA, angleB), Math.max(angleA, angleB));
        ctx.stroke();
    }

    // Draw Points
    drawPoint(ctx, A.x, A.y, 'A', '#2563eb');
    drawPoint(ctx, B.x, B.y, 'B', '#dc2626');

    updateDistanceMetrics(origin);
}

function drawPoint(ctx, x, y, label, color) {
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 10;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y);
}

function updateDistanceMetrics(origin) {
    const A = distPoints.A;
    const B = distPoints.B;

    // Pixel distances
    const dx = Math.abs(A.x - B.x);
    const dy = Math.abs(A.y - B.y);

    // L2
    const l2 = Math.sqrt(dx * dx + dy * dy);
    document.getElementById('valL2').innerText = (l2 / 10).toFixed(2); // Scale down

    // L1
    const l1 = dx + dy;
    document.getElementById('valL1').innerText = (l1 / 10).toFixed(2);

    // Cosine
    // Vectors relative to origin
    const vA = { x: A.x - origin.x, y: -(A.y - origin.y) }; // Invert Y for math coords
    const vB = { x: B.x - origin.x, y: -(B.y - origin.y) };

    const dotProduct = vA.x * vB.x + vA.y * vB.y;
    const magA = Math.sqrt(vA.x * vA.x + vA.y * vA.y);
    const magB = Math.sqrt(vB.x * vB.x + vB.y * vB.y);

    let cosSim = 0;
    if (magA > 0 && magB > 0) {
        cosSim = dotProduct / (magA * magB);
    }

    // Clamp for float errors
    cosSim = Math.max(-1, Math.min(1, cosSim));

    document.getElementById('valCos').innerText = cosSim.toFixed(3);
}

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
// LOGIC: ALGEBRA INTRO (NEURAL NET)
// ==========================================
let introAlgCanvas = null;
let introAlgCtx = null;

function initIntroAlgCanvas() {
    introAlgCanvas = document.getElementById('introAlgCanvas');
    if (!introAlgCanvas) return;
    introAlgCtx = introAlgCanvas.getContext('2d');
    drawIntroAlg();
}

function drawIntroAlg() {
    if (!introAlgCtx || !introAlgCanvas) return;
    const ctx = introAlgCtx;
    const w = introAlgCanvas.width;
    const h = introAlgCanvas.height;

    const x1 = parseFloat(document.getElementById('inpX1').value);
    const w1 = parseFloat(document.getElementById('inpW1').value);

    // Fixed inputs for demo
    const x2 = 1.0;
    const w2 = 0.5;
    const b = 0.2;

    const z = (x1 * w1) + (x2 * w2) + b;
    const output = 1 / (1 + Math.exp(-z)); // Sigmoid

    ctx.clearRect(0, 0, w, h);

    // Nodes positions
    const pIn1 = { x: 100, y: 100 };
    const pIn2 = { x: 100, y: 250 };
    const pOut = { x: 400, y: 175 };
    const pFinal = { x: 550, y: 175 };

    // Draw Connections (Weights)
    function drawConnection(p1, p2, weight, val) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineWidth = Math.abs(weight) * 5 + 1;
        ctx.strokeStyle = weight > 0 ? '#4f46e5' : '#ef4444'; // Blue pos, Red neg
        ctx.stroke();

        // Flow animation (dots)
        const time = Date.now() / 1000;
        const offset = (time * Math.abs(val)) % 1;
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;

        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(p1.x + dx * offset, p1.y + dy * offset, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    drawConnection(pIn1, pOut, w1, x1);
    drawConnection(pIn2, pOut, w2, x2);

    // Draw Nodes
    function drawNode(p, label, val, color = '#e0e7ff') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 30, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#3730a3';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#1e1b4b';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(label, p.x, p.y - 5);
        ctx.font = '12px Arial';
        ctx.fillText(val.toFixed(2), p.x, p.y + 15);
    }

    drawNode(pIn1, "x1", x1);
    drawNode(pIn2, "x2", x2);
    drawNode(pOut, "Σ + σ", output, output > 0.5 ? '#a7f3d0' : '#fecaca');

    // Output Arrow
    ctx.beginPath();
    ctx.moveTo(pOut.x + 30, pOut.y);
    ctx.lineTo(pFinal.x, pFinal.y);
    ctx.strokeStyle = '#3730a3';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#3730a3';
    ctx.font = 'bold 16px Arial';
    ctx.fillText("Output", pFinal.x, pFinal.y - 10);
    ctx.fillText(output.toFixed(3), pFinal.x, pFinal.y + 20);
}

// ==========================================
// LOGIC: DETERMINANT (2D TRANSFORM)
// ==========================================
let detCanvas = null;
let detCtx = null;
let detVecs = { i: { x: 1, y: 0 }, j: { x: 0, y: 1 } };
let isDraggingDet = null;

function initDetCanvas() {
    detCanvas = document.getElementById('detCanvas');
    if (!detCanvas) return;
    detCtx = detCanvas.getContext('2d');

    // Reset vectors
    detVecs = { i: { x: 1, y: 0 }, j: { x: 0, y: 1 } };
    updateDetUI();

    // Mouse Events
    function getMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (evt.clientX - rect.left) * scaleX,
            y: (evt.clientY - rect.top) * scaleY
        };
    }

    function toGrid(px, py) {
        const w = detCanvas.width;
        const h = detCanvas.height;
        const scale = 50;
        return { x: (px - w / 2) / scale, y: -(py - h / 2) / scale };
    }

    detCanvas.addEventListener('mousedown', (e) => {
        const pos = getMousePos(detCanvas, e);
        const gridPos = toGrid(pos.x, pos.y);

        // Check collision (radius 0.5 in grid units)
        if (Math.hypot(gridPos.x - detVecs.i.x, gridPos.y - detVecs.i.y) < 0.5) isDraggingDet = 'i';
        else if (Math.hypot(gridPos.x - detVecs.j.x, gridPos.y - detVecs.j.y) < 0.5) isDraggingDet = 'j';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDraggingDet || !detCanvas) return;
        e.preventDefault();
        const pos = getMousePos(detCanvas, e);
        const gridPos = toGrid(pos.x, pos.y);

        // Snap to 0.1
        detVecs[isDraggingDet].x = Math.round(gridPos.x * 10) / 10;
        detVecs[isDraggingDet].y = Math.round(gridPos.y * 10) / 10;

        updateDetUI();
        drawDetCanvas();
    });

    window.addEventListener('mouseup', () => isDraggingDet = null);

    drawDetCanvas();
}

function updateDetUI() {
    document.getElementById('valA').innerText = detVecs.i.x.toFixed(1);
    document.getElementById('valC').innerText = detVecs.i.y.toFixed(1);
    document.getElementById('valB').innerText = detVecs.j.x.toFixed(1);
    document.getElementById('valD').innerText = detVecs.j.y.toFixed(1);

    const det = (detVecs.i.x * detVecs.j.y) - (detVecs.j.x * detVecs.i.y);
    document.getElementById('detValueDisplay').innerText = det.toFixed(2);

    const status = document.getElementById('detStatus');
    if (Math.abs(det) < 0.01) {
        status.innerText = "Singulière (Écrasée) ⚠️";
        status.className = "text-xs font-bold text-red-600 mt-1";
    } else {
        status.innerText = "Inversible ✅";
        status.className = "text-xs font-bold text-green-600 mt-1";
    }
}

function drawDetCanvas() {
    if (!detCtx || !detCanvas) return;
    const ctx = detCtx;
    const w = detCanvas.width;
    const h = detCanvas.height;
    const scale = 50;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i++) {
        // Transformed Grid Lines
        // Vertical lines (x constant, y varies)
        ctx.beginPath();
        const startV = transform(i, -10);
        const endV = transform(i, 10);
        ctx.moveTo(cx + startV.x * scale, cy - startV.y * scale);
        ctx.lineTo(cx + endV.x * scale, cy - endV.y * scale);
        ctx.stroke();

        // Horizontal lines (y constant, x varies)
        ctx.beginPath();
        const startH = transform(-10, i);
        const endH = transform(10, i);
        ctx.moveTo(cx + startH.x * scale, cy - startH.y * scale);
        ctx.lineTo(cx + endH.x * scale, cy - endH.y * scale);
        ctx.stroke();
    }

    // Unit Square Area
    ctx.fillStyle = 'rgba(99, 102, 241, 0.2)'; // Indigo-500 low alpha
    ctx.beginPath();
    const p0 = { x: 0, y: 0 };
    const p1 = detVecs.i;
    const p2 = { x: detVecs.i.x + detVecs.j.x, y: detVecs.i.y + detVecs.j.y };
    const p3 = detVecs.j;

    ctx.moveTo(cx + p0.x * scale, cy - p0.y * scale);
    ctx.lineTo(cx + p1.x * scale, cy - p1.y * scale);
    ctx.lineTo(cx + p2.x * scale, cy - p2.y * scale);
    ctx.lineTo(cx + p3.x * scale, cy - p3.y * scale);
    ctx.closePath();
    ctx.fill();

    // Axes
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();

    // Vectors
    drawArrow(ctx, cx, cy, cx + detVecs.i.x * scale, cy - detVecs.i.y * scale, '#ef4444', 'i');
    drawArrow(ctx, cx, cy, cx + detVecs.j.x * scale, cy - detVecs.j.y * scale, '#22c55e', 'j');

    function transform(x, y) {
        return {
            x: x * detVecs.i.x + y * detVecs.j.x,
            y: x * detVecs.i.y + y * detVecs.j.y
        };
    }
}

// ==========================================
// LOGIC: EIGENVECTORS
// ==========================================
let eigenCanvas = null;
let eigenCtx = null;
let eigenMatrix = { a: 1, b: 0, c: 0, d: 1 }; // Identity

function initEigenCanvas() {
    eigenCanvas = document.getElementById('eigenCanvas');
    if (!eigenCanvas) return;
    eigenCtx = eigenCanvas.getContext('2d');
    drawEigen();
}

function setEigenMatrix(type) {
    if (type === 1) eigenMatrix = { a: 2, b: 0, c: 0, d: 1 }; // Stretch X
    if (type === 2) eigenMatrix = { a: 1, b: 1, c: 0, d: 1 }; // Shear
    if (type === 3) eigenMatrix = { a: 0, b: -1, c: 1, d: 0 }; // Rotation 90
    drawEigen();
}

function drawEigen() {
    if (!eigenCtx || !eigenCanvas) return;
    const ctx = eigenCtx;
    const w = eigenCanvas.width;
    const h = eigenCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const scale = 80;

    ctx.clearRect(0, 0, w, h);

    // Axes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();

    // Draw many vectors
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 16) {
        const x = Math.cos(angle);
        const y = Math.sin(angle);

        // Transform
        const tx = eigenMatrix.a * x + eigenMatrix.b * y;
        const ty = eigenMatrix.c * x + eigenMatrix.d * y;

        // Check if Eigenvector (collinear)
        // Cross product should be near 0
        const cross = x * ty - y * tx;
        const isEigen = Math.abs(cross) < 0.1 && (tx * tx + ty * ty) > 0.01;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + tx * scale, cy - ty * scale);

        if (isEigen) {
            ctx.strokeStyle = '#fbbf24'; // Amber-400
            ctx.lineWidth = 3;
        } else {
            ctx.strokeStyle = 'rgba(209, 213, 219, 0.5)'; // Gray-300
            ctx.lineWidth = 1;
        }
        ctx.stroke();

        if (isEigen) {
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.arc(cx + tx * scale, cy - ty * scale, 4, 0, Math.PI * 2); ctx.fill();
        }
    }
}

// ==========================================
// LOGIC: LINEAR MAP (KERNEL/IMAGE)
// ==========================================
let lmCanvas = null;
let lmCtx = null;

function initLinearMapCanvas() {
    lmCanvas = document.getElementById('linearMapCanvas');
    if (!lmCanvas) return;
    lmCtx = lmCanvas.getContext('2d');
    drawLinearMap();
}

function drawLinearMap() {
    if (!lmCtx || !lmCanvas) return;
    const ctx = lmCtx;
    const w = lmCanvas.width;
    const h = lmCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const scale = 60;

    ctx.clearRect(0, 0, w, h);

    // Matrix A = [[1, 1], [0, 0]] (Projection onto x-axis)
    // Ker: x + y = 0 => y = -x
    // Im: y = 0 (x-axis)

    // Draw Kernel Line (Green Dashed)
    ctx.beginPath();
    ctx.strokeStyle = '#22c55e';
    ctx.setLineDash([5, 5]);
    ctx.moveTo(0, 0); // y = -x relative to center
    // y = -x means if x=10, y=-10. Screen Y is inverted.
    // Screen coords: X = cx + x*scale, Y = cy - y*scale
    // Line y = -x goes from top-left to bottom-right
    ctx.moveTo(cx - 5 * scale, cy - 5 * scale);
    ctx.lineTo(cx + 5 * scale, cy + 5 * scale);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Image Line (Red)
    ctx.beginPath();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 4;
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();

    // Animate Vectors collapsing
    const time = Date.now() / 2000;
    const t = (Math.sin(time) + 1) / 2; // 0 to 1

    // Draw a grid of points transforming
    for (let x = -2; x <= 2; x += 0.5) {
        for (let y = -2; y <= 2; y += 0.5) {
            // Original
            const ox = x;
            const oy = y;

            // Target (Projected)
            // A = [[1, 1], [0, 0]]
            // tx = x + y
            // ty = 0
            const tx = x + y;
            const ty = 0;

            // Interpolate
            const curX = ox + (tx - ox) * t;
            const curY = oy + (ty - oy) * t;

            ctx.fillStyle = '#6366f1';
            ctx.beginPath();
            ctx.arc(cx + curX * scale, cy - curY * scale, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// ==========================================
// LOGIC: MATRIX MULTIPLICATION
// ==========================================
function updateMatrixProd() {
    const getVal = (id) => parseFloat(document.getElementById(id).value) || 0;

    const a00 = getVal('ma00'), a01 = getVal('ma01'), a10 = getVal('ma10'), a11 = getVal('ma11');
    const b00 = getVal('mb00'), b01 = getVal('mb01'), b10 = getVal('mb10'), b11 = getVal('mb11');

    const c00 = a00 * b00 + a01 * b10;
    const c01 = a00 * b01 + a01 * b11;
    const c10 = a10 * b00 + a11 * b10;
    const c11 = a10 * b01 + a11 * b11;

    document.getElementById('mc00').innerText = c00;
    document.getElementById('mc01').innerText = c01;
    document.getElementById('mc10').innerText = c10;
    document.getElementById('mc11').innerText = c11;

    // Add hover listeners for explanation
    setupMatrixHover('mc00', `(${a00} × ${b00}) + (${a01} × ${b10}) = ${c00}`);
    setupMatrixHover('mc01', `(${a00} × ${b01}) + (${a01} × ${b11}) = ${c01}`);
    setupMatrixHover('mc10', `(${a10} × ${b00}) + (${a11} × ${b10}) = ${c10}`);
    setupMatrixHover('mc11', `(${a10} × ${b01}) + (${a11} × ${b11}) = ${c11}`);
}

function setupMatrixHover(id, text) {
    const el = document.getElementById(id);
    if (el) {
        el.onmouseenter = () => document.getElementById('matrixCalcDetail').innerText = text;
        el.onmouseleave = () => document.getElementById('matrixCalcDetail').innerText = "Survolez une case du résultat pour voir le calcul.";
    }
}

// ==========================================
// LOGIC: SPACES (BASIS)
// ==========================================
let spacesCanvas = null;
let spacesCtx = null;
let basisI = { x: 1, y: 0 };
let basisJ = { x: 0, y: 1 };

function initSpacesCanvas() {
    spacesCanvas = document.getElementById('spacesCanvas');
    if (!spacesCanvas) return;
    spacesCtx = spacesCanvas.getContext('2d');
    drawSpaces();
}

function setBasis(type) {
    if (type === 'standard') { basisI = { x: 1, y: 0 }; basisJ = { x: 0, y: 1 }; }
    if (type === 'rotated') { basisI = { x: 0.8, y: 0.6 }; basisJ = { x: -0.6, y: 0.8 }; }
    if (type === 'collapsed') { basisI = { x: 1, y: 0.5 }; basisJ = { x: 2, y: 1 }; } // Collinear
    drawSpaces();
}

function drawSpaces() {
    if (!spacesCtx || !spacesCanvas) return;
    const ctx = spacesCtx;
    const w = spacesCanvas.width;
    const h = spacesCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const scale = 50;

    ctx.clearRect(0, 0, w, h);

    // Grid based on basis
    ctx.strokeStyle = 'rgba(20, 184, 166, 0.3)'; // Teal-500 low alpha
    ctx.lineWidth = 1;

    for (let i = -10; i <= 10; i++) {
        // Lines parallel to J (varying I)
        ctx.beginPath();
        const startV = { x: i * basisI.x - 10 * basisJ.x, y: i * basisI.y - 10 * basisJ.y };
        const endV = { x: i * basisI.x + 10 * basisJ.x, y: i * basisI.y + 10 * basisJ.y };
        ctx.moveTo(cx + startV.x * scale, cy - startV.y * scale);
        ctx.lineTo(cx + endV.x * scale, cy - endV.y * scale);
        ctx.stroke();

        // Lines parallel to I (varying J)
        ctx.beginPath();
        const startH = { x: -10 * basisI.x + i * basisJ.x, y: -10 * basisI.y + i * basisJ.y };
        const endH = { x: 10 * basisI.x + i * basisJ.x, y: 10 * basisI.y + i * basisJ.y };
        ctx.moveTo(cx + startH.x * scale, cy - startH.y * scale);
        ctx.lineTo(cx + endH.x * scale, cy - endH.y * scale);
        ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + basisI.x * scale, cy - basisI.y * scale); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + basisJ.x * scale, cy - basisJ.y * scale); ctx.stroke();

    // Labels
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.fillText("i", cx + basisI.x * scale + 5, cy - basisI.y * scale - 5);
    ctx.fillText("j", cx + basisJ.x * scale + 5, cy - basisJ.y * scale - 5);
}

// ==========================================
// LOGIC: SVD
// ==========================================
let svdCanvas = null;
let svdCtx = null;
let svdStep = 0;

function initSVDCanvas() {
    svdCanvas = document.getElementById('svdCanvas');
    if (!svdCanvas) return;
    svdCtx = svdCanvas.getContext('2d');
    drawSVD();
}

function setSVDStep(step) {
    svdStep = step;

    // Update Buttons
    for (let i = 0; i <= 3; i++) {
        const btn = document.getElementById(`btnSVD${i}`);
        if (i === step) btn.classList.add('bg-gray-800', 'text-white');
        else btn.classList.remove('bg-gray-800', 'text-white');
    }

    const desc = document.getElementById('svdDesc');
    if (step === 0) desc.innerText = "Le cercle unitaire original.";
    if (step === 1) desc.innerText = "1. Rotation (V^T) : On tourne le cercle.";
    if (step === 2) desc.innerText = "2. Étirement (Sigma) : On étire selon les axes (devient une ellipse).";
    if (step === 3) desc.innerText = "3. Rotation (U) : On tourne l'ellipse finale.";

    drawSVD();
}

function drawSVD() {
    if (!svdCtx || !svdCanvas) return;
    const ctx = svdCtx;
    const w = svdCanvas.width;
    const h = svdCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const scale = 80;

    ctx.clearRect(0, 0, w, h);

    // Axes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();

    // Transform Logic
    // V^T (Rotation -45deg)
    const ang1 = -Math.PI / 4;
    // Sigma (Scale x=1.5, y=0.5)
    const sx = 1.5, sy = 0.5;
    // U (Rotation 30deg)
    const ang2 = Math.PI / 6;

    ctx.beginPath();
    ctx.strokeStyle = '#db2777'; // Pink-600
    ctx.lineWidth = 3;

    for (let t = 0; t <= Math.PI * 2; t += 0.05) {
        let x = Math.cos(t);
        let y = Math.sin(t);

        if (svdStep >= 1) {
            // Rotate 1
            const x1 = x * Math.cos(ang1) - y * Math.sin(ang1);
            const y1 = x * Math.sin(ang1) + y * Math.cos(ang1);
            x = x1; y = y1;
        }
        if (svdStep >= 2) {
            // Scale
            x = x * sx;
            y = y * sy;
        }
        if (svdStep >= 3) {
            // Rotate 2
            const x2 = x * Math.cos(ang2) - y * Math.sin(ang2);
            const y2 = x * Math.sin(ang2) + y * Math.cos(ang2);
            x = x2; y = y2;
        }

        const px = cx + x * scale;
        const py = cy - y * scale;
        if (t === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
}

// ==========================================
// LOGIC: VECTORS (DOT PRODUCT)
// ==========================================
let vecCanvas = null;
let vecCtx = null;
let vecU = { x: 100, y: -50 };
let vecV = { x: 50, y: 80 };
let isDraggingVec = null;

function initVectorCanvas() {
    vecCanvas = document.getElementById('vectorCanvas');
    if (!vecCanvas) return;
    vecCtx = vecCanvas.getContext('2d');

    // Reset
    vecU = { x: 100, y: -50 };
    vecV = { x: 50, y: 80 };

    // Helper to get correct coordinates
    function getMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (evt.clientX - rect.left) * scaleX,
            y: (evt.clientY - rect.top) * scaleY
        };
    }

    vecCanvas.addEventListener('mousedown', (e) => {
        const pos = getMousePos(vecCanvas, e);
        const cx = vecCanvas.width / 2;
        const cy = vecCanvas.height / 2;

        // Check tips of vectors
        if (Math.hypot(pos.x - (cx + vecU.x), pos.y - (cy + vecU.y)) < 20) isDraggingVec = 'u';
        else if (Math.hypot(pos.x - (cx + vecV.x), pos.y - (cy + vecV.y)) < 20) isDraggingVec = 'v';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDraggingVec || !vecCanvas) return;
        e.preventDefault();
        const pos = getMousePos(vecCanvas, e);
        const cx = vecCanvas.width / 2;
        const cy = vecCanvas.height / 2;

        if (isDraggingVec === 'u') {
            vecU.x = pos.x - cx;
            vecU.y = pos.y - cy;
        } else {
            vecV.x = pos.x - cx;
            vecV.y = pos.y - cy;
        }
        drawVectorCanvas();
    });

    window.addEventListener('mouseup', () => isDraggingVec = null);

    drawVectorCanvas();
}

function drawVectorCanvas() {
    if (!vecCtx || !vecCanvas) return;
    const ctx = vecCtx;
    const w = vecCanvas.width;
    const h = vecCanvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Axes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();

    // Draw U (Blue)
    drawArrow(ctx, cx, cy, cx + vecU.x, cy + vecU.y, '#3b82f6', 'u');
    // Draw V (Red)
    drawArrow(ctx, cx, cy, cx + vecV.x, cy + vecV.y, '#ef4444', 'v');

    // Draw Sum (Purple)
    const sumX = vecU.x + vecV.x;
    const sumY = vecU.y + vecV.y;
    // Dashed lines
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#cbd5e1';
    ctx.beginPath(); ctx.moveTo(cx + vecU.x, cy + vecU.y); ctx.lineTo(cx + sumX, cy + sumY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + vecV.x, cy + vecV.y); ctx.lineTo(cx + sumX, cy + sumY); ctx.stroke();
    ctx.setLineDash([]);

    drawArrow(ctx, cx, cy, cx + sumX, cy + sumY, '#9333ea', 'u+v');

    // Update UI
    // Note: Y is inverted in canvas, so we negate it for math display
    const mathUy = -vecU.y;
    const mathVy = -vecV.y;

    document.getElementById('vecSumVal').innerText = `(${sumX.toFixed(0)}, ${(-sumY).toFixed(0)})`;

    const dot = vecU.x * vecV.x + mathUy * mathVy;
    // Normalize for display (scale down)
    const displayDot = dot / 1000;
    document.getElementById('vecDotVal').innerText = displayDot.toFixed(2);
}

// ==========================================
// LOGIC: STAT INTRO (SAMPLING SIMULATOR)
// ==========================================
let samplingCanvas = null;
let samplingCtx = null;
let population = [];
let trueProp = 0;

function initSamplingCanvas() {
    samplingCanvas = document.getElementById('samplingCanvas');
    if (!samplingCanvas) return;
    samplingCtx = samplingCanvas.getContext('2d');

    // Generate Population (2000 dots)
    population = [];
    trueProp = 0.3 + Math.random() * 0.4; // Random prop between 30% and 70%

    for (let i = 0; i < 2000; i++) {
        population.push({
            x: Math.random() * samplingCanvas.width,
            y: Math.random() * samplingCanvas.height,
            isRed: Math.random() < trueProp,
            sampled: false
        });
    }

    drawSampling();
}

function drawSampling() {
    if (!samplingCtx || !samplingCanvas) return;
    const ctx = samplingCtx;
    const w = samplingCanvas.width;
    const h = samplingCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw Population
    population.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.sampled ? 4 : 2, 0, Math.PI * 2);
        if (p.sampled) {
            ctx.fillStyle = p.isRed ? '#ef4444' : '#3b82f6';
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.stroke();
        } else {
            ctx.fillStyle = '#9ca3af'; // Gray for unknown
        }
        ctx.fill();
    });
}

function takeSample(n) {
    // Reset previous sample
    population.forEach(p => p.sampled = false);

    // Pick n random indices
    let redCount = 0;
    for (let i = 0; i < n; i++) {
        const idx = Math.floor(Math.random() * population.length);
        population[idx].sampled = true;
        if (population[idx].isRed) redCount++;
    }

    drawSampling();

    // Update UI
    const estProp = redCount / n;
    const resDiv = document.getElementById('sampleResult');
    const estDisplay = document.getElementById('estPropDisplay');

    resDiv.classList.remove('hidden');
    estDisplay.innerText = (estProp * 100).toFixed(1) + "%";
}

function revealPopulation() {
    if (!samplingCtx || !samplingCanvas) return;
    const ctx = samplingCtx;

    // Draw all true colors
    ctx.clearRect(0, 0, samplingCanvas.width, samplingCanvas.height);
    population.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = p.isRed ? '#ef4444' : '#3b82f6';
        ctx.fill();
    });

    document.getElementById('truePropDisplay').innerText = (trueProp * 100).toFixed(1) + "%";
}

function resetSampling() {
    initSamplingCanvas();
    document.getElementById('sampleResult').classList.add('hidden');
    document.getElementById('truePropDisplay').innerText = "???";
}


// ==========================================
// LOGIC: DESCRIPTIVE STATS (DOT PLOT)
// ==========================================
let descripCanvas = null;
let descripCtx = null;
// numbersData is already global at top of file

function initDescripCanvas() {
    descripCanvas = document.getElementById('descripCanvas');
    if (!descripCanvas) return;
    descripCtx = descripCanvas.getContext('2d');

    // Initial draw
    updateStatsUI();
}

function addNumber() {
    const input = document.getElementById('newNumber');
    const val = parseFloat(input.value);
    if (!isNaN(val)) {
        numbersData.push(val);
        input.value = '';
        updateStatsUI();
    }
}

function addRandomStats() {
    for (let i = 0; i < 5; i++) {
        numbersData.push(Math.floor(Math.random() * 20));
    }
    updateStatsUI();
}

function resetNumbers() {
    numbersData = [];
    updateStatsUI();
}

function updateStatsUI() {
    // Calc Stats
    const n = numbersData.length;
    let mean = 0, median = 0, std = 0;

    if (n > 0) {
        const sum = numbersData.reduce((a, b) => a + b, 0);
        mean = sum / n;

        const sorted = [...numbersData].sort((a, b) => a - b);
        const mid = Math.floor(n / 2);
        median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

        const variance = numbersData.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
        std = Math.sqrt(variance);
    }

    // Update Text
    const meanEl = document.getElementById('meanVal');
    if (meanEl) meanEl.innerText = mean.toFixed(1);
    const medEl = document.getElementById('medianVal');
    if (medEl) medEl.innerText = median.toFixed(1);
    const stdEl = document.getElementById('stdVal');
    if (stdEl) stdEl.innerText = std.toFixed(1);

    // Draw Dot Plot
    drawDescripCanvas(mean, median);
}

function drawDescripCanvas(mean, median) {
    if (!descripCtx || !descripCanvas) return;
    const ctx = descripCtx;
    const w = descripCanvas.width;
    const h = descripCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Axis (0 to 20)
    const padding = 40;
    const plotW = w - 2 * padding;
    const scaleX = plotW / 20;
    const axisY = h - 50;

    ctx.beginPath();
    ctx.moveTo(padding, axisY);
    ctx.lineTo(w - padding, axisY);
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Ticks
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 20; i += 2) {
        const x = padding + i * scaleX;
        ctx.beginPath(); ctx.moveTo(x, axisY); ctx.lineTo(x, axisY + 5); ctx.stroke();
        ctx.fillText(i, x, axisY + 20);
    }

    // Dots (Stacking)
    const counts = {};
    numbersData.forEach(val => {
        // Clamp to 0-20 for display
        const v = Math.max(0, Math.min(20, val));
        // Binning to nearest integer for stacking
        const bin = Math.round(v);
        counts[bin] = (counts[bin] || 0) + 1;

        const x = padding + v * scaleX;
        const y = axisY - counts[bin] * 15 - 10; // Stack up

        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#6366f1'; // Indigo
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.stroke();
    });

    // Draw Mean Line
    if (numbersData.length > 0) {
        const meanX = padding + mean * scaleX;
        ctx.beginPath();
        ctx.moveTo(meanX, 20);
        ctx.lineTo(meanX, axisY);
        ctx.strokeStyle = '#4f46e5'; // Indigo-600
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#4f46e5';
        ctx.fillText("Moyenne", meanX, 15);

        // Draw Median Line
        const medianX = padding + median * scaleX;
        // Offset slightly if close to mean
        const labelY = Math.abs(meanX - medianX) < 20 ? 30 : 15;

        ctx.beginPath();
        ctx.moveTo(medianX, 40);
        ctx.lineTo(medianX, axisY);
        ctx.strokeStyle = '#9333ea'; // Purple-600
        ctx.lineWidth = 2;
        ctx.setLineDash([2, 2]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#9333ea';
        ctx.fillText("Médiane", medianX, labelY === 30 ? 30 : 15);
    }
}


// ==========================================
// LOGIC: CORRELATION (SCATTER PLOT)
// ==========================================
let corrCanvas = null;
let corrCtx = null;
let corrPoints = [];

function initCorrelationCanvas() {
    corrCanvas = document.getElementById('corrCanvas');
    if (!corrCanvas) return;
    corrCtx = corrCanvas.getContext('2d');

    // Default data
    setCorrelationData(0.8);

    // Click to add point
    corrCanvas.addEventListener('mousedown', (e) => {
        const rect = corrCanvas.getBoundingClientRect();
        const scaleX = corrCanvas.width / rect.width;
        const scaleY = corrCanvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        // Normalize to -1 to 1 for math
        const nx = (x / corrCanvas.width) * 2 - 1;
        const ny = -((y / corrCanvas.height) * 2 - 1); // Invert Y

        corrPoints.push({ x: nx, y: ny });
        updateCorrelation();
    });
}

function setCorrelationData(targetR) {
    corrPoints = [];
    for (let i = 0; i < 30; i++) {
        const x = Math.random() * 2 - 1; // -1 to 1
        // y = r*x + noise
        const noise = (Math.random() * 2 - 1) * (1 - Math.abs(targetR));
        let y = targetR * x + noise;
        // Clamp
        y = Math.max(-1, Math.min(1, y));
        corrPoints.push({ x, y });
    }
    updateCorrelation();
}

function resetCorrelation() {
    corrPoints = [];
    updateCorrelation();
}

function updateCorrelation() {
    // Calc Pearson r
    let r = 0;
    const n = corrPoints.length;
    if (n > 1) {
        const sumX = corrPoints.reduce((a, p) => a + p.x, 0);
        const sumY = corrPoints.reduce((a, p) => a + p.y, 0);
        const sumXY = corrPoints.reduce((a, p) => a + p.x * p.y, 0);
        const sumX2 = corrPoints.reduce((a, p) => a + p.x * p.x, 0);
        const sumY2 = corrPoints.reduce((a, p) => a + p.y * p.y, 0);

        const num = n * sumXY - sumX * sumY;
        const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

        if (den !== 0) r = num / den;
    }

    const corrEl = document.getElementById('corrValDisplay');
    if (corrEl) corrEl.innerText = r.toFixed(2);
    drawCorrelation();
}

function drawCorrelation() {
    if (!corrCtx || !corrCanvas) return;
    const ctx = corrCtx;
    const w = corrCanvas.width;
    const h = corrCanvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Axes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();

    // Points
    corrPoints.forEach(p => {
        const px = cx + p.x * (w / 2 - 20);
        const py = cy - p.y * (h / 2 - 20);

        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#db2777'; // Pink-600
        ctx.fill();
    });
}


// ==========================================
// LOGIC: BAYES (PROBA FOND)
// ==========================================
function updateBayes() {
    const priorEl = document.getElementById('priorRange');
    const sensEl = document.getElementById('sensRange');
    const specEl = document.getElementById('specRange');

    if (!priorEl || !sensEl || !specEl) return;

    const prior = parseFloat(priorEl.value) / 100;
    const sens = parseFloat(sensEl.value) / 100;
    const spec = parseFloat(specEl.value) / 100;

    // P(Pos | Sick) = Sensitivity
    // P(Pos | Healthy) = 1 - Specificity
    // P(Sick) = Prior
    // P(Healthy) = 1 - Prior

    // P(Pos) = P(Pos|Sick)*P(Sick) + P(Pos|Healthy)*P(Healthy)
    const pPos = sens * prior + (1 - spec) * (1 - prior);

    // P(Sick | Pos) = (P(Pos|Sick) * P(Sick)) / P(Pos)
    const posterior = (sens * prior) / pPos;

    // Update UI
    document.getElementById('priorVal').innerText = (prior * 100).toFixed(1) + "%";
    document.getElementById('sensVal').innerText = (sens * 100).toFixed(1) + "%";
    document.getElementById('specVal').innerText = (spec * 100).toFixed(1) + "%";
    document.getElementById('postVal').innerText = (posterior * 100).toFixed(1) + "%";
}


// ==========================================
// LOGIC: GALTON BOARD (DISCRETE LAWS)
// ==========================================
let galtonCanvas = null;
let galtonCtx = null;
let galtonBalls = [];
let galtonBins = []; // Counts
const GALTON_ROWS = 10;

function initGaltonCanvas() {
    galtonCanvas = document.getElementById('galtonCanvas');
    if (!galtonCanvas) return;
    galtonCtx = galtonCanvas.getContext('2d');

    // Init Bins (GALTON_ROWS + 1 bins)
    galtonBins = new Array(GALTON_ROWS + 1).fill(0);

    // Start loop
    requestAnimationFrame(loopGalton);
}

function dropGaltonBall() {
    galtonBalls.push({
        x: galtonCanvas.width / 2,
        y: 20,
        vx: (Math.random() - 0.5) * 2, // Jitter
        vy: 0,
        row: 0,
        finished: false
    });
}

function dropGaltonBallBatch() {
    for (let i = 0; i < 50; i++) {
        setTimeout(dropGaltonBall, i * 20);
    }
}

function resetGalton() {
    galtonBalls = [];
    galtonBins = new Array(GALTON_ROWS + 1).fill(0);
}

function loopGalton() {
    if (!galtonCtx || !galtonCanvas) return;
    const ctx = galtonCtx;
    const w = galtonCanvas.width;
    const h = galtonCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw Pegs
    const startY = 50;
    const rowH = 25;
    const pegSpacing = 30;

    ctx.fillStyle = '#fbbf24'; // Amber
    for (let r = 0; r < GALTON_ROWS; r++) {
        const pegsInRow = r + 1;
        const rowW = (pegsInRow - 1) * pegSpacing;
        const startX = (w - rowW) / 2;

        for (let c = 0; c < pegsInRow; c++) {
            ctx.beginPath();
            ctx.arc(startX + c * pegSpacing, startY + r * rowH, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Update & Draw Balls
    for (let i = galtonBalls.length - 1; i >= 0; i--) {
        let b = galtonBalls[i];

        if (!b.finished) {
            b.vy += 0.2; // Gravity
            b.y += b.vy;
            b.x += b.vx;

            // Collision with pegs logic (simplified)
            const currentRow = Math.floor((b.y - startY + 10) / rowH);

            if (currentRow > b.row && currentRow < GALTON_ROWS) {
                b.row = currentRow;
                // Hit peg -> bounce left or right
                // 50/50 chance
                const dir = Math.random() < 0.5 ? -1 : 1;
                b.vx = dir * 1.5 + (Math.random() - 0.5); // Add randomness
                b.vy *= 0.6; // Lose energy
            }

            // Bottom reached
            if (b.y > startY + GALTON_ROWS * rowH) {
                b.finished = true;
                // Calculate bin based on x position
                // Map x to bin index 0 to GALTON_ROWS
                // Center is w/2. Total width at bottom approx GALTON_ROWS * pegSpacing
                const bottomW = GALTON_ROWS * pegSpacing;
                const relativeX = b.x - (w / 2 - bottomW / 2);
                let binIdx = Math.floor(relativeX / pegSpacing);
                binIdx = Math.max(0, Math.min(GALTON_ROWS, binIdx));

                galtonBins[binIdx]++;
            }

            ctx.beginPath();
            ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#ef4444';
            ctx.fill();
        }
    }

    // Remove finished balls from array to save memory (optional, but good for long runs)
    galtonBalls = galtonBalls.filter(b => !b.finished);

    // Draw Bins (Histogram)
    const binW = 20;
    const maxBinH = 100;
    const maxCount = Math.max(...galtonBins, 10); // Scale

    const bottomY = h - 10;
    const binsTotalW = (GALTON_ROWS + 1) * binW;
    const binsStartX = (w - binsTotalW) / 2;

    for (let i = 0; i <= GALTON_ROWS; i++) {
        const count = galtonBins[i];
        const barH = (count / maxCount) * maxBinH;

        ctx.fillStyle = '#6366f1';
        ctx.fillRect(binsStartX + i * binW + 2, bottomY - barH, binW - 4, barH);

        // Count label
        if (count > 0) {
            ctx.fillStyle = '#374151';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(count, binsStartX + i * binW + binW / 2, bottomY - barH - 5);
        }
    }

    requestAnimationFrame(loopGalton);
}


// ==========================================
// LOGIC: NORMAL CHART (CONTINUOUS LAWS)
// ==========================================
// normalChartInstance is already global

function initNormalChart() {
    const ctx = document.getElementById('normalChart');
    if (!ctx) return;

    // Destroy old if exists
    if (normalChartInstance) {
        normalChartInstance.destroy();
    }

    // Create Chart using Chart.js
    normalChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Generated in update
            datasets: [{
                label: 'Densité de Probabilité',
                data: [],
                borderColor: 'rgb(79, 70, 229)', // Indigo-600
                backgroundColor: 'rgba(79, 70, 229, 0.2)',
                borderWidth: 2,
                fill: true,
                pointRadius: 0,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { min: -5, max: 5 },
                y: { min: 0, max: 1 } // Normalized pdf max is ~0.4 but we leave room
            },
            plugins: {
                legend: { display: false }
            }
        }
    });

    updateNormalChart();
}

function updateNormalChart() {
    if (!normalChartInstance) return;

    const muEl = document.getElementById('muRange');
    const sigmaEl = document.getElementById('sigmaRange');
    if (!muEl || !sigmaEl) return;

    const mu = parseFloat(muEl.value);
    const sigma = parseFloat(sigmaEl.value);

    document.getElementById('muVal').innerText = mu;
    document.getElementById('sigmaVal').innerText = sigma;

    // Generate data points
    const data = [];
    const labels = [];

    // Range from -5 to 5
    for (let x = -5; x <= 5; x += 0.1) {
        labels.push(x.toFixed(1));
        // PDF Formula: (1 / (sigma * sqrt(2pi))) * exp( -0.5 * ((x-mu)/sigma)^2 )
        const num = Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
        const den = sigma * Math.sqrt(2 * Math.PI);
        data.push(num / den);
    }

    normalChartInstance.data.labels = labels;
    normalChartInstance.data.datasets[0].data = data;
    normalChartInstance.update();
}





// ==========================================
// LOGIC: NORMAL CHART (CONTINUOUS LAWS)
// ==========================================
// normalChartInstance is already global

function initNormalChart() {
    const ctx = document.getElementById('normalChart');
    if (!ctx) return;

    // Destroy old if exists
    if (normalChartInstance) {
        normalChartInstance.destroy();
    }

    // Create Chart using Chart.js
    normalChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Generated in update
            datasets: [{
                label: 'Densité de Probabilité',
                data: [],
                borderColor: 'rgb(79, 70, 229)', // Indigo-600
                backgroundColor: 'rgba(79, 70, 229, 0.2)',
                borderWidth: 2,
                fill: true,
                pointRadius: 0,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { min: -5, max: 5 },
                y: { min: 0, max: 1 } // Normalized pdf max is ~0.4 but we leave room
            },
            plugins: {
                legend: { display: false }
            }
        }
    });

    updateNormalChart();
}

function updateNormalChart() {
    if (!normalChartInstance) return;

    const muEl = document.getElementById('muRange');
    const sigmaEl = document.getElementById('sigmaRange');
    if (!muEl || !sigmaEl) return;

    const mu = parseFloat(muEl.value);
    const sigma = parseFloat(sigmaEl.value);

    document.getElementById('muVal').innerText = mu;
    document.getElementById('sigmaVal').innerText = sigma;

    // Generate data points
    const data = [];
    const labels = [];

    // Range from -5 to 5
    for (let x = -5; x <= 5; x += 0.1) {
        labels.push(x.toFixed(1));
        // PDF Formula: (1 / (sigma * sqrt(2pi))) * exp( -0.5 * ((x-mu)/sigma)^2 )
        const num = Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
        const den = sigma * Math.sqrt(2 * Math.PI);
        data.push(num / den);
    }

    normalChartInstance.data.labels = labels;
    normalChartInstance.data.datasets[0].data = data;
    normalChartInstance.update();
}


// ==========================================
// LOGIC: MATH SYMBOLS EXPLORER
// ==========================================
let symbolCanvas = null;
let symbolCtx = null;
let currentSymbolAnim = null;

const SYMBOL_DATA = {
    'sum': {
        title: "Sigma (Somme)",
        pronounce: "Sig-ma",
        display: "$\\sum$",
        meaning: "C'est une boucle <strong>FOR</strong> qui additionne tout. <br> $\\sum_{i=1}^{n} x_i$ veut dire $x_1 + x_2 + ... + x_n$.",
        code: "total = 0\nfor x in list:\n    total += x",
        anim: 'sum'
    },
    'prod': {
        title: "Pi (Produit)",
        pronounce: "Pi (Majuscule)",
        display: "$\\prod$",
        meaning: "Comme Sigma, mais pour multiplier. <br> $\\prod_{i=1}^{n} x_i$ veut dire $x_1 \\times x_2 \\times ... \\times x_n$.",
        code: "total = 1\nfor x in list:\n    total *= x",
        anim: 'prod'
    },
    'int': {
        title: "Intégrale",
        pronounce: "Somme (S étiré)",
        display: "$\\int$",
        meaning: "Une somme continue. C'est l'aire sous la courbe. <br> Imaginez additionner une infinité de rectangles infiniment fins.",
        code: "area = 0\ndx = 0.001\nfor x in range(a, b, dx):\n    area += f(x) * dx",
        anim: 'int'
    },
    'partial': {
        title: "Dérivée Partielle",
        pronounce: "D rond",
        display: "$\\partial$",
        meaning: "La vitesse de changement par rapport à UNE seule variable, en gardant les autres constantes. <br> $\\frac{\\partial f}{\\partial x}$ : Comment $f$ change quand $x$ bouge un peu.",
        code: "# Gradient Descent\ngrad_x = (f(x+h, y) - f(x, y)) / h",
        anim: 'partial'
    },
    'nabla': {
        title: "Nabla (Gradient)",
        pronounce: "Nab-la",
        display: "$\\nabla$",
        meaning: "Le vecteur qui contient toutes les dérivées partielles. <br> Il pointe vers la direction de la pente la plus raide.",
        code: "gradient = [df_dx, df_dy, df_dz]",
        anim: 'nabla'
    },
    'in': {
        title: "Appartient à",
        pronounce: "Appartient à",
        display: "$\\in$",
        meaning: "Indique qu'un élément fait partie d'un groupe (ensemble). <br> $x \\in \\mathbb{R}$ : $x$ est un nombre réel.",
        code: "if x in my_list:\n    print('Found!')",
        anim: 'in'
    },
    'forall': {
        title: "Pour Tout",
        pronounce: "Pour tout",
        display: "$\\forall$",
        meaning: "Universel. La règle s'applique à TOUS les éléments sans exception.",
        code: "all(condition(x) for x in items)",
        anim: 'forall'
    },
    'exists': {
        title: "Il Existe",
        pronounce: "Il existe",
        display: "$\\exists$",
        meaning: "Il y en a au moins un. Pas forcément tous, mais au moins un.",
        code: "any(condition(x) for x in items)",
        anim: 'exists'
    },
    'R': {
        title: "Les Réels",
        pronounce: "R (double barre)",
        display: "$\\mathbb{R}$",
        meaning: "L'ensemble de tous les nombres possibles sur une ligne continue (-infini à +infini). <br> $\\mathbb{R}^n$ : Un vecteur de $n$ nombres.",
        code: "x = 3.14159 # Float",
        anim: 'R'
    },
    'norm': {
        title: "Norme (Longueur)",
        pronounce: "Norme de v",
        display: "$||v||$",
        meaning: "La longueur (ou taille) d'un vecteur. <br> En 2D (Pythagore) : $\\sqrt{x^2 + y^2}$.",
        code: "length = sqrt(x**2 + y**2)",
        anim: 'norm'
    },
    'hat': {
        title: "Chapeau (Estimation)",
        pronounce: "y chapeau (y hat)",
        display: "$\\hat{y}$",
        meaning: "Indique une estimation ou une prédiction, par opposition à la vraie valeur $y$. <br> L'erreur est $y - \\hat{y}$.",
        code: "y_pred = model.predict(x)",
        anim: 'hat'
    },
    'theta': {
        title: "Thêta (Paramètre)",
        pronounce: "Thê-ta",
        display: "$\\theta$",
        meaning: "Souvent utilisé pour désigner les paramètres inconnus (poids) d'un modèle que l'on cherche à apprendre.",
        code: "weights = [w1, w2, b]",
        anim: 'theta'
    },
    'matrix': {
        title: "Matrice (Tableau)",
        pronounce: "A i j",
        display: "$A_{ij}$",
        meaning: "Un tableau de nombres. $i$ est la ligne, $j$ est la colonne. <br> Utilisé pour stocker des données ou transformer des vecteurs.",
        code: "matrix = [\n  [1, 2],\n  [3, 4]\n]",
        anim: 'matrix'
    },
    'transpose': {
        title: "Transposée",
        pronounce: "A transposée",
        display: "$A^T$",
        meaning: "On échange les lignes et les colonnes. <br> Ce qui était horizontal devient vertical.",
        code: "A_T = A.T",
        anim: 'transpose'
    },
    'log': {
        title: "Logarithme Naturel",
        pronounce: "Log de x",
        display: "$\\ln(x)$",
        meaning: "L'inverse de l'exponentielle. Transforme les multiplications en additions. <br> Très utile pour gérer les très petits nombres (probabilités).",
        code: "y = np.log(x)",
        anim: 'log'
    },
    'exp': {
        title: "Exponentielle",
        pronounce: "Exponentielle de x",
        display: "$e^x$",
        meaning: "Une croissance explosive. <br> Utilisé dans la fonction Softmax pour transformer des scores en probabilités.",
        code: "y = np.exp(x)",
        anim: 'exp'
    },
    'inf': {
        title: "Infini",
        pronounce: "Infini",
        display: "$\\infty$",
        meaning: "Pas un nombre, mais un concept. <br> Une limite qu'on ne peut jamais atteindre.",
        code: "x = float('inf')",
        anim: 'inf'
    },
    'approx': {
        title: "Approximativement",
        pronounce: "Environ égal",
        display: "$\\approx$",
        meaning: "Ce n'est pas exact, mais c'est assez proche pour qu'on s'en fiche de la différence.",
        code: "if abs(a - b) < 1e-6:\n    pass",
        anim: 'approx'
    },
    'prop': {
        title: "Proportionnel à",
        pronounce: "Proportionnel à",
        display: "$\\propto$",
        meaning: "Si A double, B double aussi. <br> Ils sont liés par une constante multiplicative.",
        code: "y = k * x",
        anim: 'prop'
    },
    'vec': {
        title: "Vecteur",
        pronounce: "Vecteur v",
        display: "$\\vec{v}$",
        meaning: "Une flèche qui a une direction et une longueur. <br> En code, c'est juste une liste de nombres.",
        code: "v = [1.5, 2.0, -0.5]",
        anim: 'vec'
    },
    'ket': {
        title: "Ket (Vecteur État)",
        pronounce: "Ket Psi",
        display: "$| \\psi \\rangle$",
        meaning: "Un vecteur colonne qui décrit l'état quantique d'un système. <br> C'est la brique de base du calcul quantique.",
        code: "psi = np.array([[1], [0]]) # |0>",
        anim: 'ket'
    },
    'bra': {
        title: "Bra (Vecteur Dual)",
        pronounce: "Bra Psi",
        display: "$\\langle \\psi |$",
        meaning: "L'inverse du Ket (transposé et conjugué). <br> Utilisé pour calculer des probabilités (produit scalaire).",
        code: "bra = psi.conj().T",
        anim: 'bra'
    },
    'hbar': {
        title: "Constante de Planck Réduite",
        pronounce: "H barre",
        display: "$\\hbar$",
        meaning: "La constante fondamentale de la mécanique quantique. <br> Elle définit l'échelle à laquelle les effets quantiques apparaissent.",
        code: "hbar = 1.054e-34",
        anim: 'hbar'
    },
    'tensor': {
        title: "Produit Tensoriel",
        pronounce: "Tensoriel",
        display: "$\\otimes$",
        meaning: "Permet de combiner deux systèmes quantiques. <br> Si on a 2 qubits, leur état total est le produit tensoriel des deux.",
        code: "state = np.kron(q1, q2)",
        anim: 'tensor'
    },
    'dagger': {
        title: "Dague (Adjoint)",
        pronounce: "A dague",
        display: "$A^\\dagger$",
        meaning: "Transposée + Conjuguée complexe. <br> Crucial pour garantir que les probabilités restent réelles et positives.",
        code: "adj = matrix.conj().T",
        anim: 'dagger'
    },
    'psi': {
        title: "Psi (Fonction d'Onde)",
        pronounce: "Psi",
        display: "$\\psi$",
        meaning: "La lettre grecque standard pour représenter un état quantique. <br> Elle contient toute l'information sur le système.",
        code: "def psi(x): return ...",
        anim: 'psi'
    }
};

function initSymbolExplorer() {
    symbolCanvas = document.getElementById('symbolCanvas');
    if (!symbolCanvas) return;
    symbolCtx = symbolCanvas.getContext('2d');

    // Select first by default
    selectSymbol('sum');

    document.getElementById('anim-trigger').addEventListener('click', () => {
        if (currentSymbolAnim) playSymbolAnim(currentSymbolAnim);
    });
}

function selectSymbol(id) {
    const data = SYMBOL_DATA[id];
    if (!data) return;

    // UI Update
    document.getElementById('symbol-placeholder').classList.add('hidden');
    document.getElementById('symbol-detail').classList.remove('hidden');

    document.getElementById('sym-title').innerText = data.title;
    document.getElementById('sym-pronounce').innerText = "Prononciation : " + data.pronounce;
    document.getElementById('sym-display').innerHTML = data.display;
    document.getElementById('sym-meaning').innerHTML = data.meaning;
    document.getElementById('sym-code').innerText = data.code;

    // Highlight button
    document.querySelectorAll('.symbol-btn').forEach(b => {
        if (b.dataset.id === id) b.classList.add('bg-indigo-100', 'text-indigo-700', 'border-indigo-300');
        else b.classList.remove('bg-indigo-100', 'text-indigo-700', 'border-indigo-300');
    });

    // Retrigger MathJax
    if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetClear(); // Clear previous
        MathJax.typesetPromise([document.getElementById('sym-display'), document.getElementById('sym-meaning')]);
    }

    // Play Animation
    currentSymbolAnim = data.anim;
    playSymbolAnim(data.anim);
}

function playSymbolAnim(type) {
    if (!symbolCtx || !symbolCanvas) return;
    const ctx = symbolCtx;
    const w = symbolCanvas.width;
    const h = symbolCanvas.height;

    // Reset
    ctx.clearRect(0, 0, w, h);

    // Animation Logic
    let frame = 0;

    function animate() {
        if (currentSymbolAnim !== type) return; // Stop if switched

        ctx.clearRect(0, 0, w, h);
        frame++;

        // Common styles
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (type === 'sum') {
            // Visualize Sum: Numbers flying into a Sigma funnel
            ctx.font = "40px serif";
            ctx.fillStyle = "#4f46e5";
            ctx.fillText("∑", w / 2 - 15, h / 2 + 15);

            // Inputs
            const inputs = [1, 2, 3, 4];
            inputs.forEach((val, i) => {
                const progress = (frame - i * 30) / 100;
                if (progress > 0 && progress < 1) {
                    const x = 50 + progress * (w / 2 - 80);
                    const y = h / 2;
                    ctx.font = "20px Arial";
                    ctx.fillStyle = "#6b7280";
                    ctx.fillText(val, x, y);
                }
            });

            // Output
            if (frame > 150) {
                ctx.font = "30px Arial";
                ctx.fillStyle = "#10b981";
                ctx.fillText("= 10", w / 2 + 40, h / 2 + 10);
            }
        }
        else if (type === 'prod') {
            ctx.font = "40px serif";
            ctx.fillStyle = "#4f46e5";
            ctx.fillText("∏", w / 2 - 15, h / 2 + 15);

            const inputs = [2, 3, 4];
            inputs.forEach((val, i) => {
                const progress = (frame - i * 30) / 100;
                if (progress > 0 && progress < 1) {
                    const x = 50 + progress * (w / 2 - 80);
                    const y = h / 2;
                    ctx.font = "20px Arial";
                    ctx.fillStyle = "#6b7280";
                    ctx.fillText(val, x, y);
                }
            });

            if (frame > 150) {
                ctx.font = "30px Arial";
                ctx.fillStyle = "#10b981";
                ctx.fillText("= 24", w / 2 + 40, h / 2 + 10);
            }
        }
        else if (type === 'int') {
            // Draw curve and fill area
            ctx.beginPath();
            ctx.moveTo(50, h - 50);
            for (let x = 50; x < 300; x++) {
                const y = h - 50 - Math.sin((x - 50) * 0.02) * 50;
                ctx.lineTo(x, y);
            }
            ctx.strokeStyle = "#4f46e5";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Fill rectangles
            const rectW = 10;
            const maxRects = Math.floor(250 / rectW);
            const rectsToShow = Math.min(maxRects, Math.floor(frame / 5));

            ctx.fillStyle = "rgba(99, 102, 241, 0.5)";
            for (let i = 0; i < rectsToShow; i++) {
                const x = 50 + i * rectW;
                const curveY = h - 50 - Math.sin((x - 50) * 0.02) * 50;
                const height = (h - 50) - curveY;
                ctx.fillRect(x, curveY, rectW - 1, height);
            }
        }
        else if (type === 'nabla') {
            // Draw a hill and an arrow pointing down
            // Hill contours
            for (let r = 10; r < 100; r += 20) {
                ctx.beginPath();
                ctx.ellipse(w / 2, h / 2, r, r * 0.6, 0, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(0,0,0,${0.1 + (100 - r) / 500})`;
                ctx.stroke();
            }

            // Ball
            const t = (frame % 200) / 200;
            const bx = w / 2 + Math.cos(t * Math.PI * 2) * 50;
            const by = h / 2 + Math.sin(t * Math.PI * 2) * 30;

            ctx.beginPath();
            ctx.arc(bx, by, 8, 0, Math.PI * 2);
            ctx.fillStyle = "#ef4444";
            ctx.fill();

            // Arrow (Gradient) - pointing to center (steepest descent)
            const dx = w / 2 - bx;
            const dy = h / 2 - by;
            drawArrow(ctx, bx, by, bx + dx * 0.5, by + dy * 0.5, "#4f46e5", "∇f");
        }
        else if (type === 'partial') {
            // Visualize slope on a curve (tangent)
            const cx = w / 2, cy = h / 2 + 20;
            ctx.beginPath();
            for (let x = -100; x < 100; x++) {
                const y = -Math.pow(x / 40, 2) * 20;
                ctx.lineTo(cx + x, cy + y);
            }
            ctx.strokeStyle = "#374151";
            ctx.stroke();

            // Moving point
            const t = (frame % 200) / 200;
            const x = (t - 0.5) * 160;
            const y = -Math.pow(x / 40, 2) * 20;

            ctx.beginPath(); ctx.arc(cx + x, cy + y, 5, 0, Math.PI * 2); ctx.fillStyle = "#ef4444"; ctx.fill();

            // Tangent line
            const slope = -2 * (x / 40) * (1 / 40) * 20; // dy/dx
            const tx = 40;
            const ty = slope * tx;
            ctx.beginPath();
            ctx.moveTo(cx + x - tx, cy + y + ty);
            ctx.lineTo(cx + x + tx, cy + y - ty); // y is inverted in canvas
            ctx.strokeStyle = "#4f46e5";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = "#4f46e5";
            ctx.fillText("∂f/∂x", cx + x, cy + y - 40);
        }
        else if (type === 'in') {
            // Element jumping into set
            ctx.beginPath();
            ctx.arc(w / 2 + 50, h / 2, 60, 0, Math.PI * 2);
            ctx.strokeStyle = "#4f46e5";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = "rgba(79, 70, 229, 0.1)";
            ctx.fill();
            ctx.fillStyle = "#4f46e5";
            ctx.fillText("Ensemble A", w / 2 + 50, h / 2 - 80);

            const t = Math.min(1, frame / 100);
            const x = (w / 2 - 100) * (1 - t) + (w / 2 + 50) * t;
            const y = h / 2 - Math.sin(t * Math.PI) * 50; // Jump arc

            ctx.font = "20px Arial";
            ctx.fillStyle = "#ef4444";
            ctx.fillText("x", x, y);
        }
        else if (type === 'forall') {
            // Scanning items
            const items = ['x₁', 'x₂', 'x₃', 'x₄'];
            const spacing = 60;
            const startX = w / 2 - (items.length - 1) * spacing / 2;

            items.forEach((item, i) => {
                const x = startX + i * spacing;
                ctx.font = "20px Arial";
                ctx.fillStyle = "#374151";
                ctx.fillText(item, x, h / 2);

                // Checkmark appearing
                if (frame > i * 30) {
                    ctx.font = "20px Arial";
                    ctx.fillStyle = "#10b981";
                    ctx.fillText("✓", x, h / 2 - 30);
                }
            });
        }
        else if (type === 'exists') {
            // Scanning and finding one
            const items = ['x₁', 'x₂', 'x₃', 'x₄'];
            const spacing = 60;
            const startX = w / 2 - (items.length - 1) * spacing / 2;
            const targetIdx = 2;

            items.forEach((item, i) => {
                const x = startX + i * spacing;
                ctx.font = "20px Arial";
                ctx.fillStyle = i === targetIdx && frame > i * 30 ? "#ef4444" : "#374151";
                ctx.fillText(item, x, h / 2);

                if (frame > i * 30) {
                    if (i === targetIdx) {
                        ctx.font = "20px Arial";
                        ctx.fillStyle = "#ef4444";
                        ctx.fillText("!", x, h / 2 - 30);
                    } else {
                        ctx.font = "15px Arial";
                        ctx.fillStyle = "#9ca3af";
                        ctx.fillText("x", x, h / 2 - 30);
                    }
                }
            });
        }
        else if (type === 'R') {
            // Number line zooming
            const zoom = 1 + frame * 0.01;
            ctx.beginPath();
            ctx.moveTo(0, h / 2);
            ctx.lineTo(w, h / 2);
            ctx.strokeStyle = "#374151";
            ctx.stroke();

            for (let i = -10; i <= 10; i++) {
                const x = w / 2 + i * 40 * zoom;
                if (x > 0 && x < w) {
                    ctx.beginPath(); ctx.moveTo(x, h / 2 - 5); ctx.lineTo(x, h / 2 + 5); ctx.stroke();
                    ctx.font = "12px Arial";
                    ctx.fillStyle = "#6b7280";
                    ctx.fillText(i, x, h / 2 + 20);
                }
            }
        }
        else if (type === 'norm') {
            // Vector growing
            const maxLen = 100;
            const len = Math.min(maxLen, frame);
            const angle = -Math.PI / 4;

            const cx = w / 2 - 50;
            const cy = h / 2 + 50;
            const ex = cx + Math.cos(angle) * len;
            const ey = cy + Math.sin(angle) * len;

            drawArrow(ctx, cx, cy, ex, ey, "#4f46e5", "v");

            // Components
            if (len > 20) {
                ctx.setLineDash([5, 5]);
                ctx.strokeStyle = "#9ca3af";
                ctx.beginPath(); ctx.moveTo(ex, cy); ctx.lineTo(ex, ey); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx, ey); ctx.lineTo(ex, ey); ctx.stroke();
                ctx.setLineDash([]);
            }

            if (len === maxLen) {
                ctx.fillStyle = "#4f46e5";
                ctx.fillText("||v||", cx + 60, cy - 60);
            }
        }
        else if (type === 'hat') {
            // Target vs Prediction
            const cx = w / 2;
            const cy = h / 2;

            // True value
            ctx.font = "30px Arial";
            ctx.fillStyle = "#374151";
            ctx.fillText("y", cx - 50, cy);

            // Prediction appearing
            const alpha = Math.min(1, frame / 50);
            ctx.fillStyle = `rgba(79, 70, 229, ${alpha})`;
            ctx.fillText("y", cx + 50, cy);

            // Hat dropping
            const hatY = cy - 20 - Math.max(0, (100 - frame) * 2);
            if (frame > 50) {
                ctx.font = "20px Arial";
                ctx.fillText("^", cx + 50, hatY);
            }
        }
        else if (type === 'theta') {
            // Turning knob
            const angle = (frame * 0.05) % (Math.PI * 2);
            const cx = w / 2;
            const cy = h / 2;
            const r = 40;

            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = "#4f46e5";
            ctx.lineWidth = 4;
            ctx.stroke();

            // Knob indicator
            const ix = cx + Math.cos(angle) * r;
            const iy = cy + Math.sin(angle) * r;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(ix, iy);
            ctx.strokeStyle = "#ef4444";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = "#374151";
            ctx.fillText("Paramètre θ", cx, cy + 60);
        }
        else if (type === 'matrix') {
            // Grid appearing
            const rows = 3, cols = 3;
            const cellW = 40, cellH = 40;
            const startX = w / 2 - (cols * cellW) / 2;
            const startY = h / 2 - (rows * cellH) / 2;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const delay = (r * cols + c) * 10;
                    if (frame > delay) {
                        ctx.fillStyle = "#e0e7ff";
                        ctx.fillRect(startX + c * cellW + 2, startY + r * cellH + 2, cellW - 4, cellH - 4);
                        ctx.fillStyle = "#4f46e5";
                        ctx.font = "12px Arial";
                        ctx.fillText(`${r},${c}`, startX + c * cellW + cellW / 2, startY + r * cellH + cellH / 2);
                    }
                }
            }
        }
        else if (type === 'transpose') {
            // Matrix flipping
            const t = Math.min(1, (frame % 200) / 100);
            const angle = t * Math.PI / 2; // 0 to 90 deg

            // Simplified: rotating a rectangle
            ctx.save();
            ctx.translate(w / 2, h / 2);
            // Skew/Rotate effect
            // Actually just swapping 2 dots

            // Dot 1 (Top Right)
            const x1 = 30 * Math.cos(angle);
            const y1 = -30 * Math.sin(angle); // Moves down

            // Dot 2 (Bottom Left)
            const x2 = -30 * Math.sin(angle); // Moves right
            const y2 = 30 * Math.cos(angle);

            // Fixed Diagonal
            ctx.beginPath(); ctx.arc(-30, -30, 5, 0, Math.PI * 2); ctx.fillStyle = "#9ca3af"; ctx.fill();
            ctx.beginPath(); ctx.arc(30, 30, 5, 0, Math.PI * 2); ctx.fillStyle = "#9ca3af"; ctx.fill();

            // Moving
            ctx.beginPath(); ctx.arc(30 - x2 - 30, -30 + y2 + 30, 5, 0, Math.PI * 2); ctx.fillStyle = "#ef4444"; ctx.fill(); // Fake anim

            // Better visual: Text Aij -> Aji
            ctx.restore();

            ctx.font = "30px Arial";
            if (frame % 200 < 100) {
                ctx.fillStyle = "#4f46e5";
                ctx.fillText("A_ij", w / 2, h / 2);
            } else {
                ctx.fillStyle = "#ef4444";
                ctx.fillText("A_ji", w / 2, h / 2);
            }
        }
        else if (type === 'log') {
            // Log curve
            ctx.beginPath();
            const scaleX = 50;
            const scaleY = 30;
            const cx = 50;
            const cy = h / 2 + 50;

            // Axis
            ctx.moveTo(cx, cy); ctx.lineTo(w, cy); ctx.stroke();
            ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();

            ctx.beginPath();
            for (let x = 0.1; x < 8; x += 0.1) {
                const px = cx + x * scaleX;
                const py = cy - Math.log(x) * scaleY;
                if (x === 0.1) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.strokeStyle = "#4f46e5";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Moving dot
            const t = (frame % 200) / 20;
            if (t > 0.1) {
                const px = cx + t * scaleX;
                const py = cy - Math.log(t) * scaleY;
                ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fillStyle = "#ef4444"; ctx.fill();
            }
        }
        else if (type === 'exp') {
            // Exp curve
            ctx.beginPath();
            const scaleX = 30;
            const scaleY = 10;
            const cx = w / 2;
            const cy = h - 20;

            // Axis
            ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
            ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();

            ctx.beginPath();
            for (let x = -3; x < 3; x += 0.1) {
                const px = cx + x * scaleX;
                const py = cy - Math.exp(x) * scaleY;
                if (x === -3) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.strokeStyle = "#4f46e5";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Rocket
            const t = (frame % 100) / 20 - 2; // -2 to 3
            const px = cx + t * scaleX;
            const py = cy - Math.exp(t) * scaleY;
            ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fillStyle = "#ef4444"; ctx.fill();
        }
        else if (type === 'inf') {
            // Infinity loop
            const t = frame * 0.05;
            const scale = 40;
            const x = w / 2 + scale * Math.cos(t);
            const y = h / 2 + scale * Math.sin(t) * Math.cos(t); // Lemniscate

            // Trail
            ctx.beginPath();
            for (let i = 0; i < 100; i++) {
                const ti = (frame - i) * 0.05;
                const xi = w / 2 + scale * Math.cos(ti);
                const yi = h / 2 + scale * Math.sin(ti) * Math.cos(ti);
                if (i === 0) ctx.moveTo(xi, yi);
                else ctx.lineTo(xi, yi);
            }
            ctx.strokeStyle = "#4f46e5";
            ctx.stroke();

            ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fillStyle = "#ef4444"; ctx.fill();
        }
        else if (type === 'approx') {
            // Wavy equals
            const cx = w / 2;
            const cy = h / 2;

            ctx.beginPath();
            for (let x = -30; x <= 30; x++) {
                const y = Math.sin((x + frame * 5) * 0.2) * 3;
                ctx.lineTo(cx + x, cy - 10 + y);
            }
            ctx.strokeStyle = "#4f46e5";
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            for (let x = -30; x <= 30; x++) {
                const y = Math.sin((x + frame * 5) * 0.2) * 3;
                ctx.lineTo(cx + x, cy + 10 + y);
            }
            ctx.stroke();
        }
        else if (type === 'prop') {
            // Scales balancing or graph y=kx
            const k = 1 + Math.sin(frame * 0.05) * 0.5; // k varies

            // Graph
            const cx = 50, cy = h - 50;
            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + 100, cy - 100 * k);
            ctx.strokeStyle = "#4f46e5"; ctx.lineWidth = 2; ctx.stroke();

            ctx.fillStyle = "#374151";
            ctx.fillText(`y = ${k.toFixed(1)} x`, w / 2 + 50, h / 2);
        }
        else if (type === 'vec') {
            // Arrow pointing
            const angle = frame * 0.02;
            const cx = w / 2;
            const cy = h / 2;
            const len = 60;

            const ex = cx + Math.cos(angle) * len;
            const ey = cy + Math.sin(angle) * len;

            drawArrow(ctx, cx, cy, ex, ey, "#4f46e5", "v");
        }
        else if (type === 'ket') {
            // Column Vector Visualization
            ctx.font = "30px serif";
            ctx.fillStyle = "#4f46e5";
            ctx.fillText("| ψ ⟩", w / 2 - 40, h / 2);

            // Draw vector brackets
            const bx = w / 2 + 20;
            const by = h / 2 - 40;
            ctx.beginPath();
            ctx.moveTo(bx, by); ctx.lineTo(bx - 10, by); ctx.lineTo(bx - 10, by + 80); ctx.lineTo(bx, by + 80);
            ctx.moveTo(bx + 40, by); ctx.lineTo(bx + 50, by); ctx.lineTo(bx + 50, by + 80); ctx.lineTo(bx + 40, by + 80);
            ctx.strokeStyle = "#374151";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Values
            const alpha = Math.cos(frame * 0.05).toFixed(2);
            const beta = Math.sin(frame * 0.05).toFixed(2);
            ctx.font = "16px monospace";
            ctx.fillStyle = "#111827";
            ctx.fillText(alpha, bx + 20, by + 25);
            ctx.fillText(beta, bx + 20, by + 55);
        }
        else if (type === 'bra') {
            // Row Vector Visualization
            ctx.font = "30px serif";
            ctx.fillStyle = "#4f46e5";
            ctx.fillText("⟨ ψ |", w / 2 - 60, h / 2);

            // Draw vector brackets
            const bx = w / 2;
            const by = h / 2 - 15;
            ctx.beginPath();
            ctx.moveTo(bx, by); ctx.lineTo(bx, by - 10); ctx.lineTo(bx + 100, by - 10); ctx.lineTo(bx + 100, by);
            ctx.moveTo(bx, by + 30); ctx.lineTo(bx, by + 40); ctx.lineTo(bx + 100, by + 40); ctx.lineTo(bx + 100, by + 30);
            ctx.strokeStyle = "#374151";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Values
            const alpha = Math.cos(frame * 0.05).toFixed(2);
            const beta = Math.sin(frame * 0.05).toFixed(2);
            ctx.font = "16px monospace";
            ctx.fillStyle = "#111827";
            ctx.fillText(alpha, bx + 25, by + 15);
            ctx.fillText(beta, bx + 75, by + 15);
        }
        else if (type === 'hbar') {
            // Atom model with hbar
            const cx = w / 2;
            const cy = h / 2;

            // Nucleus
            ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2); ctx.fillStyle = "#ef4444"; ctx.fill();

            // Electron Orbit
            const r = 60;
            ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.strokeStyle = "#e5e7eb"; ctx.stroke();

            // Electron
            const angle = frame * 0.1;
            const ex = cx + Math.cos(angle) * r;
            const ey = cy + Math.sin(angle) * r;
            ctx.beginPath(); ctx.arc(ex, ey, 5, 0, Math.PI * 2); ctx.fillStyle = "#4f46e5"; ctx.fill();

            // H-bar text
            ctx.font = "40px serif";
            ctx.fillStyle = "rgba(79, 70, 229, 0.2)";
            ctx.fillText("ℏ", cx, cy);
        }
        else if (type === 'tensor') {
            // Two squares merging
            const t = (frame % 200) / 100;
            const cx = w / 2;
            const cy = h / 2;

            if (t < 1) {
                // Separate
                ctx.fillStyle = "#93c5fd";
                ctx.fillRect(cx - 60 + t * 20, cy - 20, 40, 40);
                ctx.fillStyle = "#fca5a5";
                ctx.fillRect(cx + 20 - t * 20, cy - 20, 40, 40);

                ctx.fillStyle = "#111827";
                ctx.font = "20px Arial";
                ctx.fillText("⊗", cx, cy);
            } else {
                // Merged
                ctx.fillStyle = "#c084fc";
                ctx.fillRect(cx - 40, cy - 40, 80, 80);
                ctx.fillStyle = "white";
                ctx.fillText("Combined", cx, cy);
            }
        }
        else if (type === 'dagger') {
            // Matrix A -> A dagger
            const cx = w / 2;
            const cy = h / 2;

            ctx.font = "40px serif";
            if (frame % 200 < 100) {
                ctx.fillStyle = "#4f46e5";
                ctx.fillText("A", cx, cy);
                ctx.font = "14px Arial";
                ctx.fillStyle = "#6b7280";
                ctx.fillText("Original", cx, cy + 30);
            } else {
                ctx.fillStyle = "#db2777";
                ctx.fillText("A†", cx, cy);
                ctx.font = "14px Arial";
                ctx.fillStyle = "#6b7280";
                ctx.fillText("Adjoint", cx, cy + 30);
            }
        }
        else if (type === 'psi') {
            // Wave function
            ctx.beginPath();
            const cy = h / 2;
            for (let x = 0; x < w; x++) {
                const y = cy - Math.sin((x + frame * 5) * 0.05) * 40 * Math.exp(-Math.pow((x - w / 2) / 100, 2));
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = "#4f46e5";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = "#4f46e5";
            ctx.font = "24px serif";
            ctx.fillText("ψ(x)", w / 2, h / 2 - 50);
        }
        else {
            // Generic Text Animation for others
            ctx.font = "20px Arial";
            ctx.fillStyle = "#374151";
            ctx.textAlign = "center";
            ctx.fillText("Animation générique...", w / 2, h / 2);
        }

        if (frame < 300) requestAnimationFrame(animate);
    }


    requestAnimationFrame(animate);
}

// ==========================================
// QUIZ LOGIC
// ==========================================
function startQuizSession(quizId) {
    console.log(`Starting quiz session for: ${quizId}`);

    // Check if we have a toast notification system
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');

    if (toast && toastMsg) {
        toastMsg.innerText = "Quiz functionality coming soon! 🚀";
        toast.classList.remove('translate-y-32');
        setTimeout(() => {
            toast.classList.add('translate-y-32');
        }, 3000);
    } else {
        alert("Quiz functionality coming soon! 🚀");
    }
}
