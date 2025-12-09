
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
let slitMode = 'particles'; // 'particles' or 'waves'

function initDualSlit() {
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
            // Particle Simulation
            if (Math.random() < 0.1) {
                particles.push({ x: 0, y: height / 2 + (Math.random() - 0.5) * 50, vx: 2, vy: (Math.random() - 0.5) * 0.5 });
            }

            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;

                // Hit wall?
                if (p.x > width / 2 - 5 && p.x < width / 2 + 5) {
                    if (!((p.y > height / 3 - 10 && p.y < height / 3 + 10) || (p.y > 2 * height / 3 - 10 && p.y < 2 * height / 3 + 10))) {
                        p.vx = 0; // Stop at wall
                    }
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = '#fff';
                ctx.fill();

                if (p.x > width) particles.splice(i, 1);
            });

            // Screen accumulation (fake)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(width - 10, height / 3 - 20, 5, 40);
            ctx.fillRect(width - 10, 2 * height / 3 - 20, 5, 40);

        } else {
            // Wave Simulation (Interference Pattern)
            const imgData = ctx.createImageData(width, height);
            const data = imgData.data;

            for (let x = width / 2; x < width; x += 2) {
                for (let y = 0; y < height; y += 2) {
                    // Distance from slits
                    const d1 = Math.sqrt((x - width / 2) ** 2 + (y - height / 3) ** 2);
                    const d2 = Math.sqrt((x - width / 2) ** 2 + (y - 2 * height / 3) ** 2);

                    const phase = (d1 - d2) * 0.5; // Interference term
                    const intensity = (1 + Math.cos(phase - t * 0.2)) * 100;

                    const idx = (y * width + x) * 4;
                    // Fill 2x2
                    for (let dy = 0; dy < 2; dy++) {
                        for (let dx = 0; dx < 2; dx++) {
                            if (x + dx < width && y + dy < height) {
                                const i = ((y + dy) * width + (x + dx)) * 4;
                                data[i] = 79; data[i + 1] = 70; data[i + 2] = 229; // Indigo
                                data[i + 3] = intensity;
                            }
                        }
                    }
                }
            }
            ctx.putImageData(imgData, 0, 0);

            // Source waves
            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            for (let r = 0; r < width / 2; r += 20) {
                ctx.beginPath();
                ctx.arc(0, height / 2, (r + t * 2) % width / 2, -0.5, 0.5);
                ctx.stroke();
            }

            t++;
        }

        requestAnimationFrame(draw);
    }
    draw();
}

window.setSlitMode = function (mode) {
    slitMode = mode;
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
// --- 2.1 Algèbre Linéaire Complexe ---
let complexAngle = 0;

function initComplexAlgebra() {
    const setup = createQuantumCanvas('complex-plane-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;

    function draw() {
        if (!document.getElementById('complex-plane-viz')) return;
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2;
        const cy = height / 2;
        const r = 80;

        // Grid
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, height); ctx.stroke(); // Im
        ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(width, cy); ctx.stroke(); // Re

        // Circle
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = '#444';
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Vector z
        const vx = cx + r * Math.cos(complexAngle * Math.PI / 180);
        const vy = cy - r * Math.sin(complexAngle * Math.PI / 180); // Y inverted

        drawArrow(ctx, cx, cy, vx, vy, '#facc15'); // Yellow

        // Projection lines
        ctx.strokeStyle = '#666';
        ctx.setLineDash([2, 2]);
        ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(vx, cy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(cx, vy); ctx.stroke();
        ctx.setLineDash([]);

        // Labels
        ctx.fillStyle = '#fff';
        ctx.fillText('Re', width - 20, cy + 15);
        ctx.fillText('Im', cx + 10, 20);
        ctx.fillStyle = '#facc15';
        ctx.fillText(`z = e^(i${complexAngle}°)`, vx + 10, vy);

        requestAnimationFrame(draw);
    }
    draw();
}

window.rotateComplex = function (deg) {
    complexAngle = (complexAngle + deg) % 360;
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
// --- 4.1 Circuits ---
let circuitState = [[], []]; // 2 qubits, list of gates

function initQuantumCircuits() {
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
        // Very simple simulation for display purposes
        // Assuming start at |00>
        let state = ["0", "0"];

        [0, 1].forEach(q => {
            circuitState[q].forEach(gate => {
                if (gate === 'X') {
                    state[q] = state[q] === '0' ? '1' : '0';
                } else if (gate === 'H') {
                    state[q] = '+'; // Simplified superposition
                } else if (gate === 'Z') {
                    if (state[q] === '+') state[q] = '-';
                }
            });
        });

        return `État Final : |${state[0]}${state[1]}⟩`;
    }

    renderCircuit();
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
// --- 4.3 QML ---
let qmlPoints = [];
let qmlEpoch = 0;
let isTraining = false;

function initQML() {
    const setup = createQuantumCanvas('qml-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;

    // Initialize points if empty
    if (qmlPoints.length === 0) {
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            // Ground truth: Circle in center
            const isClassA = (x - width / 2) ** 2 + (y - height / 2) ** 2 < (width / 4) ** 2;
            qmlPoints.push({ x, y, isClassA });
        }
    }

    function draw() {
        if (!document.getElementById('qml-viz')) return;
        ctx.clearRect(0, 0, width, height);

        // Draw Decision Boundary (Background)
        // Simulate a changing boundary based on epoch
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        // Simple decision function simulation
        // Epoch 0: Random line
        // Epoch 10: Circle

        const cx = width / 2;
        const cy = height / 2;
        const rTarget = width / 4;

        for (let x = 0; x < width; x += 4) { // Low res for perf
            for (let y = 0; y < height; y += 4) {
                let prediction = 0;

                if (qmlEpoch === 0) {
                    prediction = (x + y) / (width + height); // Linear gradient
                } else {
                    // Evolve towards circle
                    const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
                    const circleProp = Math.min(1, qmlEpoch / 20);
                    const linearProp = 1 - circleProp;

                    const linearPred = (x + y) / (width + height);
                    const circlePred = dist < rTarget ? 1 : 0; // 1 is Class A (Pink)

                    // Smooth transition
                    prediction = linearProp * linearPred + circleProp * (dist < rTarget ? 0.8 : 0.2);
                }

                // Colorize
                // 0 -> Blue, 1 -> Pink
                const i = (y * width + x) * 4;
                // Fill 4x4 block
                for (let dy = 0; dy < 4; dy++) {
                    for (let dx = 0; dx < 4; dx++) {
                        if (x + dx < width && y + dy < height) {
                            const idx = ((y + dy) * width + (x + dx)) * 4;
                            data[idx] = prediction > 0.5 ? 236 : 59; // R
                            data[idx + 1] = prediction > 0.5 ? 72 : 130; // G
                            data[idx + 2] = prediction > 0.5 ? 153 : 246; // B
                            data[idx + 3] = 50; // Alpha (faint)
                        }
                    }
                }
            }
        }
        ctx.putImageData(imageData, 0, 0);

        // Draw Points
        qmlPoints.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = p.isClassA ? '#ec4899' : '#3b82f6';
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.fill();
            ctx.stroke();
        });

        if (isTraining) {
            ctx.fillStyle = '#fff';
            ctx.fillText(`Epoch: ${qmlEpoch}/20`, 10, 20);
            ctx.fillText(`Loss: ${(1 / (qmlEpoch + 1)).toFixed(3)}`, 10, 35);
        }
    }
    draw();

    window.trainQML = function () {
        if (isTraining) return;
        isTraining = true;
        qmlEpoch = 0;

        function step() {
            if (qmlEpoch < 20) {
                qmlEpoch++;
                draw();
                setTimeout(step, 100);
            } else {
                isTraining = false;
            }
        }
        step();
    }
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
