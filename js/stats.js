// ==========================================
// STATS SPECIFIC INTERACTIVE LOGIC
// ==========================================

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
    const sampledIndices = new Set();
    while (sampledIndices.size < Math.min(n, population.length)) {
        const idx = Math.floor(Math.random() * population.length);
        if (!sampledIndices.has(idx)) {
            sampledIndices.add(idx);
            population[idx].sampled = true;
            if (population[idx].isRed) redCount++;
        }
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
let numbersData = []; // Global for stats

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
    ctx.strokeStyle = canvasColors().axis;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Ticks
    ctx.fillStyle = canvasColors().textMuted;
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
    ctx.strokeStyle = canvasColors().grid;
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
    const posterior = pPos > 0 ? (sens * prior) / pPos : 0;

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
        vx: 0,
        vy: 0,
        row: -1,
        binPos: 0,
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
            // Smooth falling animation
            b.vy += 0.3;
            b.y += b.vy;

            // Check if ball reached next peg row
            const currentRow = Math.floor((b.y - startY + 5) / rowH);

            if (currentRow > b.row && currentRow < GALTON_ROWS) {
                b.row = currentRow;
                // Discrete 50/50 choice at each peg
                const dir = Math.random() < 0.5 ? -1 : 1;
                b.binPos += dir; // Track cumulative position
                // Snap x to correct position for this row
                const pegsInRow = currentRow + 1;
                const rowWidth = (pegsInRow - 1) * pegSpacing;
                const rowStartX = (w - rowWidth) / 2;
                // Target x between pegs
                b.x = (w / 2) + (b.binPos * pegSpacing / 2);
                b.vy = 0.5; // Reset vertical speed after bounce
            }

            // Bottom reached
            if (b.y > startY + GALTON_ROWS * rowH + 10) {
                b.finished = true;
                // binPos ranges from -GALTON_ROWS to +GALTON_ROWS in steps of 2
                // Map to bin index: (binPos + GALTON_ROWS) / 2
                let binIdx = Math.round((b.binPos + GALTON_ROWS) / 2);
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

    // Draw Bins (Histogram) - aligned with peg positions
    const maxCount = Math.max(...galtonBins, 1);
    const maxBinH = 100;
    const bottomY = h - 10;

    for (let i = 0; i <= GALTON_ROWS; i++) {
        const count = galtonBins[i];
        const barH = (count / maxCount) * maxBinH;
        // Center bins under the peg structure
        const binCenterX = (w / 2) + (i - GALTON_ROWS / 2) * pegSpacing;
        const barW = pegSpacing * 0.8;

        ctx.fillStyle = '#6366f1';
        ctx.fillRect(binCenterX - barW / 2, bottomY - barH, barW, barH);

        if (count > 0) {
            ctx.fillStyle = canvasColors().text;
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(count, binCenterX, bottomY - barH - 5);
        }
    }

    requestAnimationFrame(loopGalton);
}


// ==========================================
// LOGIC: NORMAL CHART (CONTINUOUS LAWS)
// ==========================================
let normalChartInstance = null;

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
                y: { min: 0, beginAtZero: true }
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
    if (sigma <= 0) return;

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
