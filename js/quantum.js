
// quantum.js - Logic for Quantum Physics & Computing Modules
// Handles interactive visualizations using HTML5 Canvas

console.log("Quantum module loaded ⚛️");

// Helper: Create a responsive canvas
function createQuantumCanvas(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    container.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth || 300;
    canvas.height = container.clientHeight || 200;
    container.appendChild(canvas);
    return { canvas, ctx: canvas.getContext('2d'), width: canvas.width, height: canvas.height };
}

// Helper: Draw Arrow
function drawArrow(ctx, fromX, fromY, toX, toY, color = '#4f46e5') {
    const headLen = 10;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
    ctx.fillStyle = color;
    ctx.fill();
}

// --- 1.1 Postulats & États ---
function initQuantumPostulates() {
    const setup = createQuantumCanvas('quantum-state-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;

    let t = 0;
    function animate() {
        if (!document.getElementById('quantum-state-viz')) return;
        ctx.clearRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;
        const r = Math.min(width, height) / 3;

        // Circle
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = '#e0e7ff';
        ctx.stroke();

        // Vector rotating
        const angle = t * 0.05;
        const vx = cx + r * Math.cos(angle);
        const vy = cy + r * Math.sin(angle);

        drawArrow(ctx, cx, cy, vx, vy, '#4f46e5');

        // Label
        ctx.fillStyle = '#1e1b4b';
        ctx.font = '14px monospace';
        ctx.fillText('|ψ⟩', vx + 10, vy);

        t++;
        requestAnimationFrame(animate);
    }
    animate();

    // --- Born Rule Viz (Postulat 3) ---
    const bornSetup = createQuantumCanvas('born-rule-viz');
    if (bornSetup) {
        const { ctx, width, height } = bornSetup;
        let prob0 = 0.7; // Example probability

        function drawBorn() {
            if (!document.getElementById('born-rule-viz')) return;
            ctx.clearRect(0, 0, width, height);

            // Bar for P(0)
            const h0 = prob0 * (height - 40);
            ctx.fillStyle = '#3b82f6'; // Blue
            ctx.fillRect(width / 4 - 30, height - 20 - h0, 60, h0);
            ctx.fillStyle = '#1e3a8a';
            ctx.textAlign = 'center';
            ctx.fillText(`P(0) = ${(prob0 * 100).toFixed(0)}%`, width / 4, height - 25 - h0);
            ctx.fillText('|0⟩', width / 4, height - 5);

            // Bar for P(1)
            const h1 = (1 - prob0) * (height - 40);
            ctx.fillStyle = '#ef4444'; // Red
            ctx.fillRect(3 * width / 4 - 30, height - 20 - h1, 60, h1);
            ctx.fillStyle = '#7f1d1d';
            ctx.fillText(`P(1) = ${((1 - prob0) * 100).toFixed(0)}%`, 3 * width / 4, height - 25 - h1);
            ctx.fillText('|1⟩', 3 * width / 4, height - 5);

            // Baseline
            ctx.beginPath();
            ctx.moveTo(20, height - 20);
            ctx.lineTo(width - 20, height - 20);
            ctx.strokeStyle = '#9ca3af';
            ctx.stroke();

            // Animate probability slightly
            prob0 = 0.5 + 0.3 * Math.sin(Date.now() * 0.002);
            requestAnimationFrame(drawBorn);
        }
        drawBorn();
    }
}

// --- 1.2 Espaces de Hilbert ---
function initHilbertSpace() {
    const setup = createQuantumCanvas('hilbert-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;

    function draw() {
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2;
        const cy = height / 2;

        // Basis vectors
        drawArrow(ctx, cx, cy, cx + 50, cy, '#94a3b8'); // |0>
        ctx.fillText('|0⟩', cx + 60, cy);
        drawArrow(ctx, cx, cy, cx, cy - 50, '#94a3b8'); // |1>
        ctx.fillText('|1⟩', cx, cy - 60);

        // Vector addition
        drawArrow(ctx, cx, cy, cx + 50, cy - 50, '#db2777');
        ctx.fillText('|ψ⟩ = |0⟩ + |1⟩', cx + 60, cy - 50);
    }
    draw();
}

// --- 1.3 Opérateurs ---
let currentOpState = { theta: 0, phi: 0 }; // Bloch sphere angles

function initOperators() {
    const setup = createQuantumCanvas('operator-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;

    // Reset state
    currentOpState = { theta: 0, phi: 0 }; // Start at |0>

    function draw() {
        if (!document.getElementById('operator-viz')) return;
        ctx.clearRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;
        const r = 80;

        // Draw Bloch Sphere Circle
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = '#374151';
        ctx.stroke();

        // Axes
        ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.strokeStyle = '#4b5563'; ctx.stroke(); // Z
        ctx.beginPath(); ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.strokeStyle = '#4b5563'; ctx.stroke(); // X

        // Calculate vector position from angles
        // Projection on 2D plane (simplified)
        // x = r * sin(theta) * cos(phi)
        // y = -r * cos(theta) (minus because y is down in canvas)

        // Let's use a simplified 2D projection where theta rotates around circle
        // and phi changes color or something, but for X/Z/H gates on single qubit:
        // |0> is up (theta=0), |1> is down (theta=PI)
        // |+> is right (theta=PI/2, phi=0), |-> is left (theta=PI/2, phi=PI)

        const vx = cx + r * Math.sin(currentOpState.theta) * Math.cos(currentOpState.phi);
        const vy = cy - r * Math.cos(currentOpState.theta);

        drawArrow(ctx, cx, cy, vx, vy, '#8b5cf6');

        ctx.fillStyle = '#fff';
        ctx.fillText('|0⟩', cx, cy - r - 10);
        ctx.fillText('|1⟩', cx, cy + r + 15);
        ctx.fillText('|+⟩', cx + r + 5, cy);

        requestAnimationFrame(draw);
    }
    draw();
}

function applyOperator(op) {
    if (!currentOpState) return;

    // Simple state transitions for visualization
    // Start |0> (theta=0)

    if (op === 'X') {
        // NOT: |0> -> |1>, |1> -> |0>
        // Inverts theta
        currentOpState.theta = Math.PI - currentOpState.theta;
    } else if (op === 'Z') {
        // Phase flip: |+> -> |->
        // Adds PI to phi
        currentOpState.phi += Math.PI;
    } else if (op === 'H') {
        // Hadamard: |0> <-> |+>, |1> <-> |->
        // If at |0> (0) -> |+> (PI/2)
        // If at |1> (PI) -> |-> (PI/2, PI)
        // If at |+> (PI/2) -> |0> (0)
        // If at |-> (PI/2, PI) -> |1> (PI)

        if (Math.abs(currentOpState.theta) < 0.1) { // |0>
            currentOpState.theta = Math.PI / 2;
            currentOpState.phi = 0;
        } else if (Math.abs(currentOpState.theta - Math.PI) < 0.1) { // |1>
            currentOpState.theta = Math.PI / 2;
            currentOpState.phi = Math.PI;
        } else if (Math.abs(currentOpState.theta - Math.PI / 2) < 0.1) {
            if (Math.abs(currentOpState.phi % (2 * Math.PI)) < 0.1) { // |+>
                currentOpState.theta = 0;
            } else { // |->
                currentOpState.theta = Math.PI;
            }
        }
    }
}



// --- 2.1 Algèbre Linéaire Complexe ---
function initComplexAlgebra() {
    // Placeholder: Complex plane rotation
    initQuantumPostulates(); // Reuse rotation for now
}

// --- 2.2 Théorie des Groupes ---
function initGroupTheory() {
    const setup = createQuantumCanvas('su2-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;

    let angle = 0;
    function animate() {
        if (!document.getElementById('su2-viz')) return;
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2;
        const cy = height / 2;

        // Draw Bloch Sphere wireframe
        ctx.beginPath();
        ctx.ellipse(cx, cy, 60, 60, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#ddd';
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(cx, cy, 60, 20, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Rotating vector
        const x = cx + 60 * Math.cos(angle);
        const y = cy + 20 * Math.sin(angle); // Projecting 3D rotation to 2D
        drawArrow(ctx, cx, cy, x, y, '#f97316');

        angle += 0.05;
        requestAnimationFrame(animate);
    }
    animate();
}

// --- 2.3 Analyse Fonctionnelle ---
function initFunctionalAnalysis() {
    const setup = createQuantumCanvas('spectrum-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;

    // Draw discrete levels
    ctx.fillStyle = '#0d9488';
    for (let i = 0; i < 5; i++) {
        const y = height - 20 - i * 30;
        ctx.fillRect(50, y, 20, 2);
    }
    ctx.fillText('Discret', 40, height - 5);

    // Draw continuous spectrum
    const grad = ctx.createLinearGradient(0, height - 20, 0, 20);
    grad.addColorStop(0, '#f97316');
    grad.addColorStop(1, 'rgba(249, 115, 22, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(150, 20, 40, height - 40);
    ctx.fillStyle = '#f97316';
    ctx.fillText('Continu', 150, height - 5);
}

// --- 2.4 Probabilités Quantiques ---
function initQuantumProbability() {
    const setup = createQuantumCanvas('density-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;

    const cx = width / 2;
    const cy = height / 2;
    const r = 80;

    // Draw Circle
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#fff';
    ctx.stroke();

    // Draw Mixed State (Point inside)
    ctx.beginPath();
    ctx.arc(cx + 30, cy - 20, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#eab308'; // Yellow
    ctx.fill();
    ctx.fillText('ρ (Mixte)', cx + 40, cy - 20);

    // Draw Pure State (Point on edge)
    ctx.beginPath();
    ctx.arc(cx + r, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#22c55e'; // Green
    ctx.fill();
    ctx.fillText('|ψ⟩ (Pur)', cx + r + 10, cy);
}

// --- 3.1 Qubits (Bloch Sphere) ---
let qubitState = { theta: 0, phi: 0 }; // 0 = |0> (North Pole)

function initQubits() {
    const setup = createQuantumCanvas('bloch-sphere-container');
    if (!setup) return;
    const { ctx, width, height } = setup;

    function animate() {
        if (!document.getElementById('bloch-sphere-container')) return;
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2;
        const cy = height / 2;
        const r = 80;

        // Sphere Outline
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = '#cbd5e1';
        ctx.stroke();

        // Equator
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r / 3, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#94a3b8';
        ctx.stroke();

        // Axes
        ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.stroke(); // Z
        ctx.fillText('|0⟩', cx - 10, cy - r - 5);
        ctx.fillText('|1⟩', cx - 10, cy + r + 15);

        // State Vector
        // Simple projection: x = r*sin(theta)*cos(phi), y = r*sin(theta)*sin(phi) (projected), z = r*cos(theta)
        // Canvas Y is inverted. Z is up (-y).

        // Let's approximate 3D projection
        const px = cx + r * Math.sin(qubitState.theta) * Math.cos(qubitState.phi);
        const py = cy - r * Math.cos(qubitState.theta) + (r / 3) * Math.sin(qubitState.theta) * Math.sin(qubitState.phi);

        drawArrow(ctx, cx, cy, px, py, '#4f46e5');

        requestAnimationFrame(animate);
    }
    animate();
}

window.setQubitState = function (state) {
    if (state === '0') { qubitState.theta = 0; qubitState.phi = 0; }
    if (state === '1') { qubitState.theta = Math.PI; qubitState.phi = 0; }
    if (state === '+') { qubitState.theta = Math.PI / 2; qubitState.phi = 0; }
    if (state === '-') { qubitState.theta = Math.PI / 2; qubitState.phi = Math.PI; }
}

// --- 3.2 Gates ---
function initQuantumGates() {
    const setup = createQuantumCanvas('gate-viz-container');
    if (!setup) return;
    const { ctx, width, height } = setup;

    // Reuse qubit state logic for visualization
    let currentTheta = 0;

    window.applyGate = function (gate) {
        if (gate === 'X') currentTheta = Math.PI;
        if (gate === 'H') currentTheta = Math.PI / 2;
        // Simple viz update
        draw();
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2;
        const cy = height / 2;

        // Draw circle
        ctx.beginPath();
        ctx.arc(cx, cy, 60, 0, Math.PI * 2);
        ctx.strokeStyle = '#ccc';
        ctx.stroke();

        // Vector
        const vx = cx + 60 * Math.sin(currentTheta);
        const vy = cy - 60 * Math.cos(currentTheta);
        drawArrow(ctx, cx, cy, vx, vy, '#2563eb');
    }
    draw();
}

// --- 3.3 Measurement ---
function initMeasurement() {
    const setup = createQuantumCanvas('measurement-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;

    let isCollapsed = false;
    let prob0 = 0.7; // |alpha|^2

    function draw() {
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2;
        const cy = height / 2;

        // Axis
        ctx.beginPath(); ctx.moveTo(cx, cy - 80); ctx.lineTo(cx, cy + 80); ctx.strokeStyle = '#555'; ctx.stroke();
        ctx.fillText('|0⟩', cx - 10, cy - 85);
        ctx.fillText('|1⟩', cx - 10, cy + 95);

        if (!isCollapsed) {
            // Superposition
            drawArrow(ctx, cx, cy, cx + 40, cy - 60, '#ef4444');
            ctx.fillStyle = '#ef4444';
            ctx.fillText('Superposition', cx + 50, cy - 60);
        } else {
            // Collapsed
            const outcome = Math.random() < prob0 ? -1 : 1; // -1 is up (|0>), 1 is down (|1>)
            drawArrow(ctx, cx, cy, cx, cy + outcome * 80, '#22c55e');
            ctx.fillStyle = '#22c55e';
            ctx.fillText(outcome === -1 ? 'Mesuré: |0⟩' : 'Mesuré: |1⟩', cx + 20, cy);
        }
    }
    draw();

    const btn = document.querySelector('#measurement-viz button');
    if (btn) {
        btn.onclick = () => {
            isCollapsed = true;
            draw();
            setTimeout(() => { isCollapsed = false; draw(); }, 2000); // Reset
        };
    }
}

// --- 3.4 Schrodinger ---
function initSchrodinger() {
    const setup = createQuantumCanvas('schrodinger-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;

    let t = 0;
    function animate() {
        if (!document.getElementById('schrodinger-viz')) return;
        ctx.clearRect(0, 0, width, height);

        // Draw Wave Packet
        ctx.beginPath();
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        for (let x = 0; x < width; x++) {
            const env = Math.exp(-Math.pow((x - width / 2 - Math.sin(t * 0.05) * 50) / 30, 2)); // Gaussian envelope moving
            const wave = Math.cos(x * 0.2 - t * 0.2);
            const y = height / 2 + env * wave * 50;
            if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();

        t++;
        requestAnimationFrame(animate);
    }
    animate();
}

// --- 4.1 Circuits ---
function initQuantumCircuits() {
    const container = document.getElementById('circuit-builder');
    if (!container) return;
    container.innerHTML = `
        <div class="flex flex-col gap-4">
            <div class="flex items-center gap-2 bg-gray-100 p-2 rounded">
                <span>q0</span>
                <div class="h-0.5 w-full bg-gray-400 relative flex items-center px-2 gap-2" id="q0-line">
                    <button class="w-8 h-8 bg-white border border-black hover:bg-blue-100">H</button>
                    <button class="w-8 h-8 bg-white border border-black hover:bg-blue-100">X</button>
                </div>
            </div>
            <div class="flex items-center gap-2 bg-gray-100 p-2 rounded">
                <span>q1</span>
                <div class="h-0.5 w-full bg-gray-400 relative flex items-center px-2 gap-2" id="q1-line">
                    <button class="w-8 h-8 bg-white border border-black hover:bg-blue-100">H</button>
                </div>
            </div>
        </div>
        <p class="text-xs text-gray-500 mt-2">Cliquez pour ajouter (Simulation UI)</p>
    `;
}

// --- 4.2 Algorithms (Grover) ---
function initQuantumAlgorithms() {
    const setup = createQuantumCanvas('grover-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;

    let amplitudes = [0.25, 0.25, 0.25, 0.25]; // 4 states
    const target = 2; // Index of target

    function draw() {
        ctx.clearRect(0, 0, width, height);
        const barWidth = width / 4;

        amplitudes.forEach((amp, i) => {
            const h = amp * height * 0.8;
            ctx.fillStyle = i === target ? '#22c55e' : '#3b82f6';
            ctx.fillRect(i * barWidth + 10, height / 2 - h, barWidth - 20, h); // Positive/Negative

            // Baseline
            ctx.beginPath(); ctx.moveTo(0, height / 2); ctx.lineTo(width, height / 2); ctx.strokeStyle = '#fff'; ctx.stroke();
        });
    }
    draw();

    window.stepGrover = function () {
        // Simple animation step: Invert target, then invert about mean
        amplitudes[target] = -amplitudes[target]; // Oracle
        draw();
        setTimeout(() => {
            const mean = amplitudes.reduce((a, b) => a + b, 0) / 4;
            amplitudes = amplitudes.map(a => 2 * mean - a); // Diffusion
            draw();
        }, 500);
    }
}

// --- 4.3 QML ---
function initQML() {
    const setup = createQuantumCanvas('qml-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;

    // Draw scatter plot
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const isClassA = (x - width / 2) ** 2 + (y - height / 2) ** 2 < 3000; // Circle boundary

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = isClassA ? '#ec4899' : '#3b82f6';
        ctx.fill();
    }

    // Draw boundary
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, Math.sqrt(3000), 0, Math.PI * 2);
    ctx.strokeStyle = '#fff';
    ctx.setLineDash([5, 5]);
    ctx.stroke();
}

// --- 4.4 Hybrid Models ---
function initHybridModels() {
    const setup = createQuantumCanvas('hybrid-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;

    // Draw simple landscape (parabola)
    ctx.beginPath();
    ctx.strokeStyle = '#a855f7';
    for (let x = 0; x < width; x++) {
        const y = height - (0.005 * (x - width / 2) ** 2 + 20);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Ball rolling down
    let bx = 0;
    function animate() {
        if (!document.getElementById('hybrid-viz')) return;
        // Redraw curve (lazy clear)
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(0, 0, width, height);

        // Draw curve again
        ctx.beginPath();
        ctx.strokeStyle = '#a855f7';
        for (let x = 0; x < width; x++) {
            const y = height - (0.005 * (x - width / 2) ** 2 + 20);
            if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw ball
        const by = height - (0.005 * (bx - width / 2) ** 2 + 20);
        ctx.beginPath();
        ctx.arc(bx, by, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();

        bx = (bx + 2) % width;
        requestAnimationFrame(animate);
    }
    animate();
}

// --- 5.1 QFT ---
function initQFT() {
    const setup = createQuantumCanvas('qft-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;

    // Harmonic Oscillator Levels
    for (let n = 0; n < 6; n++) {
        const y = height - 20 - n * 30;
        ctx.beginPath();
        ctx.moveTo(width / 2 - 50, y);
        ctx.lineTo(width / 2 + 50, y);
        ctx.strokeStyle = '#22c55e';
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.fillText(`n=${n}`, width / 2 + 60, y + 5);
    }
}

// --- 5.2 Stat Mech ---
function initStatMech() {
    const setup = createQuantumCanvas('stat-mech-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;

    // Draw Entropy Curve S(T) ~ log(T) or similar saturation
    ctx.beginPath();
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 2;
    for (let x = 0; x < width; x++) {
        const t = x / width * 10;
        const s = Math.min(height - 20, (height - 20) * (1 - Math.exp(-t))); // Saturation
        const y = height - s;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = '#f97316';
    ctx.fillText('Température (T)', width / 2, height - 5);
    ctx.fillText('Entropie (S)', 10, 20);
}

// --- 5.3 Spin SU(2) ---
function initSpinSU2() {
    const setup = createQuantumCanvas('spin-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;

    let angle = 0;
    function animate() {
        if (!document.getElementById('spin-viz')) return;
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2;
        const cy = height / 2;

        // Draw Cone
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx - 30, cy - 80);
        ctx.lineTo(cx + 30, cy - 80);
        ctx.closePath();
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
        ctx.stroke();

        // Precessing Vector
        const vx = cx + 30 * Math.cos(angle);
        const vy = cy - 80 + 10 * Math.sin(angle); // Ellipse top

        drawArrow(ctx, cx, cy, vx, vy, '#a855f7');

        angle += 0.1;
        requestAnimationFrame(animate);
    }
    animate();
}
