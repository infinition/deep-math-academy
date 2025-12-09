
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

// --- 1.0 Dualité Onde-Corpuscule ---
let slitMode = 'particles';
window.initDualSlit = function () {
    const setup = createQuantumCanvas('dual-slit-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;

    let particles = [];
    let t = 0;

    function draw() {
        if (!document.getElementById('dual-slit-viz')) return;
        ctx.clearRect(0, 0, width, height);

        // Draw Slits
        ctx.fillStyle = '#333';
        ctx.fillRect(width / 2 - 5, 0, 10, height); // Wall
        ctx.clearRect(width / 2 - 5, height / 3 - 10, 10, 20); // Slit 1
        ctx.clearRect(width / 2 - 5, 2 * height / 3 - 10, 10, 20); // Slit 2

        if (slitMode === 'particles') {
            if (Math.random() < 0.1) {
                particles.push({ x: 0, y: height / 2 + (Math.random() - 0.5) * 50, vx: 2, vy: (Math.random() - 0.5) * 0.5 });
            }
            particles.forEach((p, i) => {
                p.x += p.vx; p.y += p.vy;
                if (p.x > width / 2 - 5 && p.x < width / 2 + 5) {
                    if (!((p.y > height / 3 - 10 && p.y < height / 3 + 10) || (p.y > 2 * height / 3 - 10 && p.y < 2 * height / 3 + 10))) {
                        p.vx = 0;
                    }
                }
                ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
                if (p.x > width) particles.splice(i, 1);
            });
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(width - 10, height / 3 - 20, 5, 40);
            ctx.fillRect(width - 10, 2 * height / 3 - 20, 5, 40);
        } else {
            const imgData = ctx.createImageData(width, height);
            const data = imgData.data;
            for (let x = width / 2; x < width; x += 2) {
                for (let y = 0; y < height; y += 2) {
                    const d1 = Math.sqrt((x - width / 2) ** 2 + (y - height / 3) ** 2);
                    const d2 = Math.sqrt((x - width / 2) ** 2 + (y - 2 * height / 3) ** 2);
                    const phase = (d1 - d2) * 0.5;
                    const intensity = (1 + Math.cos(phase - t * 0.2)) * 100;
                    const idx = (y * width + x) * 4;
                    for (let dy = 0; dy < 2; dy++) {
                        for (let dx = 0; dx < 2; dx++) {
                            if (x + dx < width && y + dy < height) {
                                const i = ((y + dy) * width + (x + dx)) * 4;
                                data[i] = 79; data[i + 1] = 70; data[i + 2] = 229; data[i + 3] = intensity;
                            }
                        }
                    }
                }
            }
            ctx.putImageData(imgData, 0, 0);
            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            for (let r = 0; r < width / 2; r += 20) {
                ctx.beginPath(); ctx.arc(0, height / 2, (r + t * 2) % width / 2, -0.5, 0.5); ctx.stroke();
            }
            t++;
        }
        requestAnimationFrame(draw);
    }
    draw();
}
window.setSlitMode = function (mode) { slitMode = mode; }

// --- 1.1 Postulats & États ---
window.initQuantumPostulates = function () {
    const setup = createQuantumCanvas('quantum-state-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    let t = 0;
    function animate() {
        if (!document.getElementById('quantum-state-viz')) return;
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2; const cy = height / 2; const r = Math.min(width, height) / 3;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.strokeStyle = '#e0e7ff'; ctx.stroke();
        const angle = t * 0.05;
        const vx = cx + r * Math.cos(angle); const vy = cy + r * Math.sin(angle);
        drawArrow(ctx, cx, cy, vx, vy, '#4f46e5');
        ctx.fillStyle = '#1e1b4b'; ctx.font = '14px monospace'; ctx.fillText('|ψ⟩', vx + 10, vy);
        t++;
        requestAnimationFrame(animate);
    }
    animate();

    const bornSetup = createQuantumCanvas('born-rule-viz');
    if (bornSetup) {
        const { ctx, width, height } = bornSetup;
        let prob0 = 0.7;
        function drawBorn() {
            if (!document.getElementById('born-rule-viz')) return;
            ctx.clearRect(0, 0, width, height);
            const h0 = prob0 * (height - 40);
            ctx.fillStyle = '#3b82f6'; ctx.fillRect(width / 4 - 30, height - 20 - h0, 60, h0);
            ctx.fillStyle = '#1e3a8a'; ctx.textAlign = 'center'; ctx.fillText(`P(0) = ${(prob0 * 100).toFixed(0)}%`, width / 4, height - 25 - h0); ctx.fillText('|0⟩', width / 4, height - 5);
            const h1 = (1 - prob0) * (height - 40);
            ctx.fillStyle = '#ef4444'; ctx.fillRect(3 * width / 4 - 30, height - 20 - h1, 60, h1);
            ctx.fillStyle = '#7f1d1d'; ctx.fillText(`P(1) = ${((1 - prob0) * 100).toFixed(0)}%`, 3 * width / 4, height - 25 - h1); ctx.fillText('|1⟩', 3 * width / 4, height - 5);
            ctx.beginPath(); ctx.moveTo(20, height - 20); ctx.lineTo(width - 20, height - 20); ctx.strokeStyle = '#9ca3af'; ctx.stroke();
            prob0 = 0.5 + 0.3 * Math.sin(Date.now() * 0.002);
            requestAnimationFrame(drawBorn);
        }
        drawBorn();
    }
}

// --- 1.2 Espaces de Hilbert ---
window.initHilbertSpace = function () {
    const setup = createQuantumCanvas('hilbert-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    function draw() {
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2; const cy = height / 2;
        drawArrow(ctx, cx, cy, cx + 50, cy, '#94a3b8'); ctx.fillText('|0⟩', cx + 60, cy);
        drawArrow(ctx, cx, cy, cx, cy - 50, '#94a3b8'); ctx.fillText('|1⟩', cx, cy - 60);
        drawArrow(ctx, cx, cy, cx + 50, cy - 50, '#db2777'); ctx.fillText('|ψ⟩ = |0⟩ + |1⟩', cx + 60, cy - 50);
    }
    draw();
}

// --- 1.3 Opérateurs ---
let currentOpState = { theta: 0, phi: 0 };
window.initOperators = function () {
    const setup = createQuantumCanvas('operator-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    currentOpState = { theta: 0, phi: 0 };
    function draw() {
        if (!document.getElementById('operator-viz')) return;
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2; const cy = height / 2; const r = 80;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.strokeStyle = '#374151'; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.strokeStyle = '#4b5563'; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.strokeStyle = '#4b5563'; ctx.stroke();
        const vx = cx + r * Math.sin(currentOpState.theta) * Math.cos(currentOpState.phi);
        const vy = cy - r * Math.cos(currentOpState.theta);
        drawArrow(ctx, cx, cy, vx, vy, '#8b5cf6');
        ctx.fillStyle = '#fff'; ctx.fillText('|0⟩', cx, cy - r - 10); ctx.fillText('|1⟩', cx, cy + r + 15); ctx.fillText('|+⟩', cx + r + 5, cy);
        requestAnimationFrame(draw);
    }
    draw();
}
window.applyOperator = function (op) {
    if (!currentOpState) return;
    if (op === 'X') { currentOpState.theta = Math.PI - currentOpState.theta; }
    else if (op === 'Z') { currentOpState.phi += Math.PI; }
    else if (op === 'H') {
        if (Math.abs(currentOpState.theta) < 0.1) { currentOpState.theta = Math.PI / 2; currentOpState.phi = 0; }
        else if (Math.abs(currentOpState.theta - Math.PI) < 0.1) { currentOpState.theta = Math.PI / 2; currentOpState.phi = Math.PI; }
        else if (Math.abs(currentOpState.theta - Math.PI / 2) < 0.1) {
            if (Math.abs(currentOpState.phi % (2 * Math.PI)) < 0.1) { currentOpState.theta = 0; }
            else { currentOpState.theta = Math.PI; }
        }
    }
}

// --- 2.1 Algèbre Linéaire Complexe ---
let complexAngle = 0;
window.initComplexAlgebra = function () {
    const setup = createQuantumCanvas('complex-plane-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    function draw() {
        if (!document.getElementById('complex-plane-viz')) return;
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2; const cy = height / 2; const r = 80;
        ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(width, cy); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.strokeStyle = '#444'; ctx.setLineDash([5, 5]); ctx.stroke(); ctx.setLineDash([]);
        const vx = cx + r * Math.cos(complexAngle * Math.PI / 180);
        const vy = cy - r * Math.sin(complexAngle * Math.PI / 180);
        drawArrow(ctx, cx, cy, vx, vy, '#facc15');
        ctx.strokeStyle = '#666'; ctx.setLineDash([2, 2]);
        ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(vx, cy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(cx, vy); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = '#fff'; ctx.fillText('Re', width - 20, cy + 15); ctx.fillText('Im', cx + 10, 20);
        ctx.fillStyle = '#facc15'; ctx.fillText(`z = e^(i${complexAngle}°)`, vx + 10, vy);
        requestAnimationFrame(draw);
    }
    draw();
}
window.rotateComplex = function (deg) { complexAngle = (complexAngle + deg) % 360; }

// --- 2.2 Théorie des Groupes ---
window.initGroupTheory = function () {
    const setup = createQuantumCanvas('su2-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    let angle = 0;
    function animate() {
        if (!document.getElementById('su2-viz')) return;
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2; const cy = height / 2;
        ctx.beginPath(); ctx.ellipse(cx, cy, 60, 60, 0, 0, Math.PI * 2); ctx.strokeStyle = '#ddd'; ctx.stroke();
        ctx.beginPath(); ctx.ellipse(cx, cy, 60, 20, 0, 0, Math.PI * 2); ctx.stroke();
        const x = cx + 60 * Math.cos(angle); const y = cy + 20 * Math.sin(angle);
        drawArrow(ctx, cx, cy, x, y, '#f97316');
        angle += 0.05;
        requestAnimationFrame(animate);
    }
    animate();
}

// --- 2.3 Analyse Fonctionnelle ---
window.initFunctionalAnalysis = function () {
    const setup = createQuantumCanvas('spectrum-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    ctx.fillStyle = '#0d9488';
    for (let i = 0; i < 5; i++) { const y = height - 20 - i * 30; ctx.fillRect(50, y, 20, 2); }
    ctx.fillText('Discret', 40, height - 5);
    const grad = ctx.createLinearGradient(0, height - 20, 0, 20);
    grad.addColorStop(0, '#f97316'); grad.addColorStop(1, 'rgba(249, 115, 22, 0)');
    ctx.fillStyle = grad; ctx.fillRect(150, 20, 40, height - 40);
    ctx.fillStyle = '#f97316'; ctx.fillText('Continu', 150, height - 5);
}

// --- 2.4 Probabilités Quantiques ---
window.initQuantumProbability = function () {
    const setup = createQuantumCanvas('density-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    const cx = width / 2; const cy = height / 2; const r = 80;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.strokeStyle = '#fff'; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx + 30, cy - 20, 5, 0, Math.PI * 2); ctx.fillStyle = '#eab308'; ctx.fill(); ctx.fillText('ρ (Mixte)', cx + 40, cy - 20);
    ctx.beginPath(); ctx.arc(cx + r, cy, 5, 0, Math.PI * 2); ctx.fillStyle = '#22c55e'; ctx.fill(); ctx.fillText('|ψ⟩ (Pur)', cx + r + 10, cy);
}

// --- 3.1 Qubits (Bloch Sphere) ---
let qubitState = { theta: 0, phi: 0 };
window.initQubits = function () {
    const setup = createQuantumCanvas('bloch-sphere-container');
    if (!setup) return;
    const { ctx, width, height } = setup;
    function animate() {
        if (!document.getElementById('bloch-sphere-container')) return;
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2; const cy = height / 2; const r = 80;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.strokeStyle = '#cbd5e1'; ctx.stroke();
        ctx.beginPath(); ctx.ellipse(cx, cy, r, r / 3, 0, 0, Math.PI * 2); ctx.strokeStyle = '#94a3b8'; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.stroke();
        ctx.fillText('|0⟩', cx - 10, cy - r - 5); ctx.fillText('|1⟩', cx - 10, cy + r + 15);
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
window.initQuantumGates = function () {
    const setup = createQuantumCanvas('gate-viz-container');
    if (!setup) return;
    const { ctx, width, height } = setup;
    let currentTheta = 0;
    window.applyGate = function (gate) {
        if (gate === 'X') currentTheta = Math.PI;
        if (gate === 'H') currentTheta = Math.PI / 2;
        draw();
    }
    function draw() {
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2; const cy = height / 2;
        ctx.beginPath(); ctx.arc(cx, cy, 60, 0, Math.PI * 2); ctx.strokeStyle = '#ccc'; ctx.stroke();
        const vx = cx + 60 * Math.sin(currentTheta); const vy = cy - 60 * Math.cos(currentTheta);
        drawArrow(ctx, cx, cy, vx, vy, '#2563eb');
    }
    draw();
}

// --- 3.3 Measurement ---
window.initMeasurement = function () {
    const setup = createQuantumCanvas('measurement-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    let isCollapsed = false; let prob0 = 0.7;
    function draw() {
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2; const cy = height / 2;
        ctx.beginPath(); ctx.moveTo(cx, cy - 80); ctx.lineTo(cx, cy + 80); ctx.strokeStyle = '#555'; ctx.stroke();
        ctx.fillText('|0⟩', cx - 10, cy - 85); ctx.fillText('|1⟩', cx - 10, cy + 95);
        if (!isCollapsed) {
            drawArrow(ctx, cx, cy, cx + 40, cy - 60, '#ef4444'); ctx.fillStyle = '#ef4444'; ctx.fillText('Superposition', cx + 50, cy - 60);
        } else {
            const outcome = Math.random() < prob0 ? -1 : 1;
            drawArrow(ctx, cx, cy, cx, cy + outcome * 80, '#22c55e'); ctx.fillStyle = '#22c55e'; ctx.fillText(outcome === -1 ? 'Mesuré: |0⟩' : 'Mesuré: |1⟩', cx + 20, cy);
        }
    }
    draw();
    const btn = document.querySelector('#measurement-viz button');
    if (btn) { btn.onclick = () => { isCollapsed = true; draw(); setTimeout(() => { isCollapsed = false; draw(); }, 2000); }; }
}

// --- 3.4 Schrodinger ---
window.initSchrodinger = function () {
    const setup = createQuantumCanvas('schrodinger-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    let t = 0;
    function animate() {
        if (!document.getElementById('schrodinger-viz')) return;
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath(); ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2;
        for (let x = 0; x < width; x++) {
            const env = Math.exp(-Math.pow((x - width / 2 - Math.sin(t * 0.05) * 50) / 30, 2));
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
let circuitState = [[], []]; // 2 qubits, list of gates
window.initQuantumCircuits = function () {
    const container = document.getElementById('circuit-builder');
    if (!container) return;

    function renderCircuit() {
        container.innerHTML = `
            <div class="bg-white p-4 rounded shadow border border-gray-200">
                <div class="flex flex-col gap-6">
                    ${[0, 1].map(q => `
                        <div class="flex items-center gap-4">
                            <span class="font-mono font-bold text-gray-600">q${q} |0⟩</span>
                            <div class="flex-1 h-0.5 bg-gray-300 relative flex items-center px-2 gap-1 overflow-x-auto min-h-[40px]">
                                ${circuitState[q].map((gate, i) => `
                                    <div class="w-10 h-10 flex items-center justify-center bg-indigo-100 border border-indigo-300 text-indigo-800 font-bold rounded cursor-pointer hover:bg-red-100 hover:text-red-600 transition"
                                         onclick="removeGate(${q}, ${i})" title="Cliquez pour supprimer">
                                        ${gate}
                                    </div>
                                `).join('')}
                                <div class="w-full h-full absolute top-0 left-0 -z-10"></div>
                            </div>
                            <div class="flex gap-1">
                                <button onclick="addGate(${q}, 'H')" class="w-8 h-8 bg-gray-100 hover:bg-indigo-100 border border-gray-300 rounded text-xs font-bold">H</button>
                                <button onclick="addGate(${q}, 'X')" class="w-8 h-8 bg-gray-100 hover:bg-indigo-100 border border-gray-300 rounded text-xs font-bold">X</button>
                                <button onclick="addGate(${q}, 'Z')" class="w-8 h-8 bg-gray-100 hover:bg-indigo-100 border border-gray-300 rounded text-xs font-bold">Z</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="mt-6 pt-4 border-t border-gray-100">
                    <h4 class="font-bold text-gray-700 mb-2">Résultat (Simulation) :</h4>
                    <div class="bg-gray-900 text-green-400 font-mono p-3 rounded text-sm">
                        ${simulateCircuit()}
                    </div>
                </div>
            </div>
        `;
    }

    window.addGate = function (q, gate) {
        if (circuitState[q].length < 8) {
            circuitState[q].push(gate);
            renderCircuit();
        }
    };

    window.removeGate = function (q, index) {
        circuitState[q].splice(index, 1);
        renderCircuit();
    };

    function simulateCircuit() {
        let state = ["0", "0"];
        [0, 1].forEach(q => {
            circuitState[q].forEach(gate => {
                if (gate === 'X') { state[q] = state[q] === '0' ? '1' : '0'; }
                else if (gate === 'H') { state[q] = '+'; }
                else if (gate === 'Z') { if (state[q] === '+') state[q] = '-'; }
            });
        });
        return `État Final : |${state[0]}${state[1]}⟩`;
    }

    renderCircuit();
}

// --- 4.2 Algorithms (Grover) ---
window.initQuantumAlgorithms = function () {
    const setup = createQuantumCanvas('grover-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    let amplitudes = [0.25, 0.25, 0.25, 0.25]; const target = 2;
    function draw() {
        ctx.clearRect(0, 0, width, height);
        const barWidth = width / 4;
        amplitudes.forEach((amp, i) => {
            const h = amp * height * 0.8;
            ctx.fillStyle = i === target ? '#22c55e' : '#3b82f6';
            ctx.fillRect(i * barWidth + 10, height / 2 - h, barWidth - 20, h);
            ctx.beginPath(); ctx.moveTo(0, height / 2); ctx.lineTo(width, height / 2); ctx.strokeStyle = '#fff'; ctx.stroke();
        });
    }
    draw();
    window.stepGrover = function () {
        amplitudes[target] = -amplitudes[target];
        draw();
        setTimeout(() => {
            const mean = amplitudes.reduce((a, b) => a + b, 0) / 4;
            amplitudes = amplitudes.map(a => 2 * mean - a);
            draw();
        }, 500);
    }
}

// --- 4.3 QML ---
let qmlPoints = [];
let qmlEpoch = 0;
let isTraining = false;
window.initQML = function () {
    const setup = createQuantumCanvas('qml-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    if (qmlPoints.length === 0) {
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * width; const y = Math.random() * height;
            const isClassA = (x - width / 2) ** 2 + (y - height / 2) ** 2 < (width / 4) ** 2;
            qmlPoints.push({ x, y, isClassA });
        }
    }
    function draw() {
        if (!document.getElementById('qml-viz')) return;
        ctx.clearRect(0, 0, width, height);
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;
        const cx = width / 2; const cy = height / 2; const rTarget = width / 4;
        for (let x = 0; x < width; x += 4) {
            for (let y = 0; y < height; y += 4) {
                let prediction = 0;
                if (qmlEpoch === 0) { prediction = (x + y) / (width + height); }
                else {
                    const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
                    const circleProp = Math.min(1, qmlEpoch / 20);
                    const linearProp = 1 - circleProp;
                    const linearPred = (x + y) / (width + height);
                    prediction = linearProp * linearPred + circleProp * (dist < rTarget ? 0.8 : 0.2);
                }
                const i = (y * width + x) * 4;
                for (let dy = 0; dy < 4; dy++) {
                    for (let dx = 0; dx < 4; dx++) {
                        if (x + dx < width && y + dy < height) {
                            const idx = ((y + dy) * width + (x + dx)) * 4;
                            data[idx] = prediction > 0.5 ? 236 : 59; data[idx + 1] = prediction > 0.5 ? 72 : 130; data[idx + 2] = prediction > 0.5 ? 153 : 246; data[idx + 3] = 50;
                        }
                    }
                }
            }
        }
        ctx.putImageData(imageData, 0, 0);
        qmlPoints.forEach(p => {
            ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fillStyle = p.isClassA ? '#ec4899' : '#3b82f6'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.fill(); ctx.stroke();
        });
        if (isTraining) {
            ctx.fillStyle = '#fff'; ctx.fillText(`Epoch: ${qmlEpoch}/20`, 10, 20); ctx.fillText(`Loss: ${(1 / (qmlEpoch + 1)).toFixed(3)}`, 10, 35);
        }
    }
    draw();
    window.trainQML = function () {
        if (isTraining) return;
        isTraining = true; qmlEpoch = 0;
        function step() {
            if (qmlEpoch < 20) { qmlEpoch++; draw(); setTimeout(step, 100); } else { isTraining = false; }
        }
        step();
    }
}

// --- 4.4 Hybrid Models ---
window.initHybridModels = function () {
    const setup = createQuantumCanvas('hybrid-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    ctx.beginPath(); ctx.strokeStyle = '#a855f7';
    for (let x = 0; x < width; x++) {
        const y = height - (0.005 * (x - width / 2) ** 2 + 20);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    let bx = 0;
    function animate() {
        if (!document.getElementById('hybrid-viz')) return;
        ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.fillRect(0, 0, width, height);
        ctx.beginPath(); ctx.strokeStyle = '#a855f7';
        for (let x = 0; x < width; x++) {
            const y = height - (0.005 * (x - width / 2) ** 2 + 20);
            if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
        const by = height - (0.005 * (bx - width / 2) ** 2 + 20);
        ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
        bx = (bx + 2) % width;
        requestAnimationFrame(animate);
    }
    animate();
}

// --- 5.1 QFT ---
window.initQFT = function () {
    const setup = createQuantumCanvas('qft-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    for (let n = 0; n < 6; n++) {
        const y = height - 20 - n * 30;
        ctx.beginPath(); ctx.moveTo(width / 2 - 50, y); ctx.lineTo(width / 2 + 50, y);
        ctx.strokeStyle = '#22c55e'; ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.fillText(`n=${n}`, width / 2 + 60, y + 5);
    }
}

// --- 5.2 Stat Mech ---
window.initStatMech = function () {
    const setup = createQuantumCanvas('stat-mech-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    ctx.beginPath(); ctx.strokeStyle = '#f97316'; ctx.lineWidth = 2;
    for (let x = 0; x < width; x++) {
        const t = x / width * 10;
        const s = Math.min(height - 20, (height - 20) * (1 - Math.exp(-t)));
        const y = height - s;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = '#f97316'; ctx.fillText('Température (T)', width / 2, height - 5); ctx.fillText('Entropie (S)', 10, 20);
}

// --- 5.3 Spin SU(2) ---
window.initSpinSU2 = function () {
    const setup = createQuantumCanvas('spin-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    let angle = 0;
    function animate() {
        if (!document.getElementById('spin-viz')) return;
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2; const cy = height / 2;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - 30, cy - 80); ctx.lineTo(cx + 30, cy - 80); ctx.closePath();
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)'; ctx.stroke();
        const vx = cx + 30 * Math.cos(angle);
        const vy = cy - 80 + 10 * Math.sin(angle);
        drawArrow(ctx, cx, cy, vx, vy, '#a855f7');
        angle += 0.1;
        requestAnimationFrame(animate);
    }
    animate();
}

// --- 6.1 Entropy ---
window.initQuantumEntropy = function () {
    const setup = createQuantumCanvas('entropy-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    let particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: width / 2 + (Math.random() - 0.5) * 20,
            y: height / 2 + (Math.random() - 0.5) * 20,
            color: i < 25 ? '#3b82f6' : '#ef4444',
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
        });
    }
    function draw() {
        if (!document.getElementById('entropy-viz')) return;
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
            ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    draw();
}

// --- 6.2 Channels ---
let channelNoise = 'none';
window.initQuantumChannels = function () {
    const setup = createQuantumCanvas('channels-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    let radius = height / 3;
    function draw() {
        if (!document.getElementById('channels-viz')) return;
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath(); ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2); ctx.strokeStyle = '#333'; ctx.stroke();
        let endX = width / 2 + radius * 0.7; let endY = height / 2 - radius * 0.7;
        if (channelNoise === 'amplitude') { endY += (height / 2 - radius - endY) * 0.05; radius *= 0.99; }
        else if (channelNoise === 'phase') { endX += (width / 2 - endX) * 0.05; }
        ctx.beginPath(); ctx.moveTo(width / 2, height / 2); ctx.lineTo(endX, endY); ctx.strokeStyle = '#ec4899'; ctx.lineWidth = 3; ctx.stroke();
        requestAnimationFrame(draw);
    }
    draw();
}
window.applyNoise = function (type) { channelNoise = type; }

// --- 6.3 Theorems ---
window.initQuantumTheorems = function () {
    const setup = createQuantumCanvas('theorems-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    function draw() {
        if (!document.getElementById('theorems-viz')) return;
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#3b82f6'; ctx.beginPath(); ctx.arc(width / 3, height / 2, 20, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillText("|ψ⟩", width / 3 - 5, height / 2 + 5);
        ctx.fillStyle = '#333'; ctx.beginPath(); ctx.arc(2 * width / 3, height / 2, 20, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillText("|0⟩", 2 * width / 3 - 5, height / 2 + 5);
        ctx.strokeStyle = '#fff'; ctx.beginPath(); ctx.moveTo(width / 3 + 30, height / 2); ctx.lineTo(2 * width / 3 - 30, height / 2); ctx.stroke();
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(width / 2 - 10, height / 2 - 10); ctx.lineTo(width / 2 + 10, height / 2 + 10); ctx.moveTo(width / 2 + 10, height / 2 - 10); ctx.lineTo(width / 2 - 10, height / 2 + 10); ctx.stroke();
    }
    draw();
}

// --- 6.4 QEC ---
window.initQEC = function () {
    const setup = createQuantumCanvas('qec-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    function draw() {
        if (!document.getElementById('qec-viz')) return;
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < 3; i++) {
            ctx.beginPath(); ctx.arc(width / 2 + (i - 1) * 60, height / 2, 15, 0, Math.PI * 2);
            ctx.fillStyle = (i === 1) ? '#ef4444' : '#3b82f6'; ctx.fill();
            ctx.fillStyle = '#fff'; ctx.fillText(i === 1 ? "ERR" : "OK", width / 2 + (i - 1) * 60 - 10, height / 2 + 5);
        }
        ctx.fillStyle = '#fff'; ctx.fillText("Majority Vote -> Correction", width / 2 - 60, height / 2 + 50);
    }
    draw();
}

// --- 6.5 Networks ---
window.initQuantumNetworks = function () {
    const setup = createQuantumCanvas('networks-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    let signalX = 0;
    function draw() {
        if (!document.getElementById('networks-viz')) return;
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#3b82f6'; ctx.fillRect(20, height / 2 - 10, 20, 20); ctx.fillRect(width - 40, height / 2 - 10, 20, 20);
        ctx.fillStyle = '#8b5cf6'; ctx.fillRect(width / 2 - 10, height / 2 - 10, 20, 20);
        signalX = (signalX + 2) % width;
        ctx.beginPath(); ctx.arc(signalX, height / 2, 5, 0, Math.PI * 2); ctx.fillStyle = '#ec4899'; ctx.fill();
        requestAnimationFrame(draw);
    }
    draw();
}

// --- 7.1 QKD (BB84) ---
let qkdQubit = null;
let eveActive = false;
window.initQKD = function () {
    const setup = createQuantumCanvas('qkd-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    function draw() {
        if (!document.getElementById('qkd-viz')) return;
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#eab308'; ctx.fillRect(20, height / 2 - 20, 40, 40); ctx.fillStyle = '#fff'; ctx.fillText("Alice", 25, height / 2 + 5);
        ctx.fillStyle = '#eab308'; ctx.fillRect(width - 60, height / 2 - 20, 40, 40); ctx.fillStyle = '#fff'; ctx.fillText("Bob", width - 50, height / 2 + 5);
        if (eveActive) {
            ctx.fillStyle = '#ef4444'; ctx.fillRect(width / 2 - 20, height / 2 + 20, 40, 40); ctx.fillStyle = '#fff'; ctx.fillText("Eve", width / 2 - 10, height / 2 + 45);
            ctx.strokeStyle = '#ef4444'; ctx.beginPath(); ctx.moveTo(width / 2, height / 2); ctx.lineTo(width / 2, height / 2 + 20); ctx.stroke();
        }
        if (qkdQubit) {
            qkdQubit.x += 2;
            ctx.beginPath(); ctx.arc(qkdQubit.x, height / 2, 5, 0, Math.PI * 2); ctx.fillStyle = qkdQubit.color; ctx.fill();
            if (eveActive && Math.abs(qkdQubit.x - width / 2) < 5) {
                ctx.fillStyle = '#ef4444'; ctx.fillText("DETECTED!", width / 2 - 20, height / 2 - 30); qkdQubit.color = '#ef4444';
            }
            if (qkdQubit.x > width - 60) qkdQubit = null;
        }
        requestAnimationFrame(draw);
    }
    draw();
}
window.sendQubit = function () { qkdQubit = { x: 60, color: '#fff' }; }
window.toggleEve = function () { eveActive = !eveActive; }

// --- 7.2 Coin Flipping ---
window.initCoinFlipping = function () {
    const setup = createQuantumCanvas('coin-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    let angle = 0;
    function draw() {
        if (!document.getElementById('coin-viz')) return;
        ctx.clearRect(0, 0, width, height);
        angle += 0.1;
        ctx.beginPath(); ctx.arc(width / 2, height / 2, 50, 0, Math.PI * 2); ctx.strokeStyle = '#f97316'; ctx.stroke();
        let x = width / 2 + Math.cos(angle) * 50; let y = height / 2 + Math.sin(angle) * 20;
        ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
        ctx.fillStyle = '#fff'; ctx.fillText("Commitment...", width / 2 - 30, height / 2 + 80);
        requestAnimationFrame(draw);
    }
    draw();
}

// --- 7.3 QRNG ---
window.initQRNG = function () {
    const setup = createQuantumCanvas('qrng-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    let numbers = [];
    function draw() {
        if (!document.getElementById('qrng-viz')) return;
        ctx.clearRect(0, 0, width, height);
        if (Math.random() < 0.1) numbers.push({ val: Math.random() > 0.5 ? 1 : 0, x: width, y: height / 2 });
        numbers.forEach((n, i) => {
            n.x -= 2; ctx.fillStyle = n.val ? '#14b8a6' : '#333'; ctx.font = '20px monospace'; ctx.fillText(n.val, n.x, n.y);
            if (n.x < 0) numbers.splice(i, 1);
        });
        requestAnimationFrame(draw);
    }
    draw();
}

// --- 7.4 Security ---
window.initSecurityAttacks = function () {
    const setup = createQuantumCanvas('security-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    let leak = 0;
    function draw() {
        if (!document.getElementById('security-viz')) return;
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath(); ctx.moveTo(0, height / 2); ctx.lineTo(width, height / 2); ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2; ctx.stroke();
        leak = (leak + 1) % width;
        ctx.beginPath(); ctx.arc(leak, height / 2, 10 + Math.sin(leak * 0.1) * 5, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'; ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.fillText("Power Analysis...", 10, 20);
        requestAnimationFrame(draw);
    }
    draw();
}

// --- 8.1 Open Systems ---
window.initOpenSystems = function () {
    const setup = createQuantumCanvas('open-systems-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    let particles = [];
    function draw() {
        if (!document.getElementById('open-systems-viz')) return;
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath(); ctx.arc(width / 2, height / 2, 30, 0, Math.PI * 2); ctx.fillStyle = '#3b82f6'; ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillText("System", width / 2 - 20, height / 2 + 5);
        if (Math.random() < 0.2) particles.push({ x: Math.random() < 0.5 ? 0 : width, y: Math.random() * height, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4 });
        particles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy;
            ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fillStyle = '#9ca3af'; ctx.fill();
            let d = Math.sqrt((p.x - width / 2) ** 2 + (p.y - height / 2) ** 2);
            if (d < 32) { ctx.strokeStyle = '#ef4444'; ctx.beginPath(); ctx.arc(width / 2, height / 2, 32, 0, Math.PI * 2); ctx.stroke(); particles.splice(i, 1); }
            if (p.x < -10 || p.x > width + 10) particles.splice(i, 1);
        });
        requestAnimationFrame(draw);
    }
    draw();
}

// --- 8.2 Decoherence ---
window.initDecoherence = function () {
    const setup = createQuantumCanvas('decoherence-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    let path = []; let x = 0; let y = height / 2;
    function draw() {
        if (!document.getElementById('decoherence-viz')) return;
        ctx.clearRect(0, 0, width, height);
        x += 1; y += (Math.random() - 0.5) * 5; y = height / 2 + (y - height / 2) * 0.99;
        path.push({ x, y }); if (path.length > width) path.shift();
        ctx.beginPath(); ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x - (x - width), path[i].y);
        ctx.strokeStyle = '#ec4899'; ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.fillText("Coherence Loss...", 10, 20);
        requestAnimationFrame(draw);
    }
    draw();
}

// --- 9.1 Superconducting ---
window.initSuperconducting = function () {
    const setup = createQuantumCanvas('superconducting-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    function draw() {
        if (!document.getElementById('superconducting-viz')) return;
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#1e293b'; ctx.fillRect(width / 4, height / 4, width / 2, height / 2);
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(width / 3, height / 3); ctx.lineTo(width / 3 + 20, height / 3); ctx.moveTo(width / 3 + 10, height / 3 - 10); ctx.lineTo(width / 3 + 10, height / 3 + 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(2 * width / 3, 2 * height / 3); ctx.lineTo(2 * width / 3 + 20, 2 * height / 3); ctx.moveTo(2 * width / 3 + 10, 2 * height / 3 - 10); ctx.lineTo(2 * width / 3 + 10, 2 * height / 3 + 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(width / 3 + 20, height / 3); for (let i = 0; i < 10; i++) ctx.lineTo(width / 3 + 20 + i * 10, height / 3 + (i % 2 == 0 ? 10 : -10)); ctx.lineTo(2 * width / 3, 2 * height / 3); ctx.strokeStyle = '#94a3b8'; ctx.stroke();
    }
    draw();
}

// --- 9.2 Trapped Ions ---
window.initTrappedIons = function () {
    const setup = createQuantumCanvas('trapped-ions-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    let t = 0;
    function draw() {
        if (!document.getElementById('trapped-ions-viz')) return;
        ctx.clearRect(0, 0, width, height);
        t += 0.1;
        ctx.fillStyle = '#333'; ctx.fillRect(0, height / 3, width, 10); ctx.fillRect(0, 2 * height / 3, width, 10);
        for (let i = 0; i < 5; i++) {
            let x = width / 2 + (i - 2) * 50 + Math.sin(t + i) * 5;
            ctx.beginPath(); ctx.arc(x, height / 2, 8, 0, Math.PI * 2); ctx.fillStyle = '#a855f7'; ctx.fill();
            if (Math.floor(t / 10) % 5 === i) { ctx.strokeStyle = '#ef4444'; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height / 2); ctx.stroke(); }
        }
        requestAnimationFrame(draw);
    }
    draw();
}

// --- 9.3 Photonic ---
window.initPhotonic = function () {
    const setup = createQuantumCanvas('photonic-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    let photons = [];
    function draw() {
        if (!document.getElementById('photonic-viz')) return;
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, height / 3); ctx.lineTo(width, height / 3); ctx.moveTo(0, 2 * height / 3); ctx.lineTo(width, 2 * height / 3); ctx.moveTo(width / 2, height / 3); ctx.lineTo(width / 2, 2 * height / 3); ctx.stroke();
        if (Math.random() < 0.05) photons.push({ x: 0, y: height / 3, vx: 3 });
        photons.forEach((p, i) => {
            p.x += p.vx;
            if (Math.abs(p.x - width / 2) < 2) { if (Math.random() < 0.5) p.y = 2 * height / 3; }
            ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fillStyle = '#fbbf24'; ctx.fill();
            if (p.x > width) photons.splice(i, 1);
        });
        requestAnimationFrame(draw);
    }
    draw();
}
