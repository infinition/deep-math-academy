
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

// --- 1.1 Postulats & États (Quantum Casino) ---
window.initQuantumPostulates = function () {
    const setup = createQuantumCanvas('quantum-casino-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;

    let angle = 0;
    let isSpinning = true;
    let result = null;
    const slider = document.getElementById('casino-slider');
    const resultDiv = document.getElementById('casino-result');

    function draw() {
        if (!document.getElementById('quantum-casino-viz')) return;
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2; const cy = height / 2; const r = 80;

        // Draw Wheel
        const probBlue = slider ? parseInt(slider.value) / 100 : 0.5;

        if (isSpinning) {
            // Blurring effect
            const grad = ctx.createConicGradient(angle, cx, cy);
            grad.addColorStop(0, '#3b82f6');
            grad.addColorStop(probBlue, '#3b82f6');
            grad.addColorStop(probBlue, '#ef4444');
            grad.addColorStop(1, '#ef4444');

            ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fillStyle = grad; ctx.fill();
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();

            angle += 0.5;
            resultDiv.classList.add('hidden');
        } else {
            // Collapsed state
            ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fillStyle = result === 'blue' ? '#3b82f6' : '#ef4444';
            ctx.fill();
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();

            resultDiv.innerText = result === 'blue' ? 'BLEU' : 'ROUGE';
            resultDiv.classList.remove('hidden');
        }

        requestAnimationFrame(draw);
    }
    draw();

    window.spinCasino = function () {
        if (isSpinning) {
            // Measure
            const probBlue = slider ? parseInt(slider.value) / 100 : 0.5;
            result = Math.random() < probBlue ? 'blue' : 'red';
            isSpinning = false;
            document.getElementById('casino-btn').innerText = "Relancer la Roue 🔄";
        } else {
            // Reset
            isSpinning = true;
            document.getElementById('casino-btn').innerText = "Mesurer l'État 🎲";
        }
    }
}

// --- 1.2 Espaces de Hilbert (Interactive Vector) ---
window.initHilbertSpace = function () {
    const setup = createQuantumCanvas('hilbert-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;

    let state = { x: 1, y: 0 }; // Normalized state
    let isDragging = false;

    const canvas = setup.canvas;

    function updateStateFromMouse(mouseX, mouseY) {
        const cx = width / 2; const cy = height / 2;
        let dx = mouseX - cx;
        let dy = mouseY - cy; // Invert Y for math
        const mag = Math.sqrt(dx * dx + dy * dy);
        if (mag > 0) {
            state.x = dx / mag;
            state.y = dy / mag;
        }
        updateUI();
    }

    canvas.onmousedown = (e) => { isDragging = true; updateStateFromMouse(e.offsetX, e.offsetY); };
    canvas.onmousemove = (e) => { if (isDragging) updateStateFromMouse(e.offsetX, e.offsetY); };
    canvas.onmouseup = () => { isDragging = false; };
    canvas.onmouseleave = () => { isDragging = false; };

    // Touch support
    canvas.addEventListener('touchstart', (e) => { isDragging = true; const rect = canvas.getBoundingClientRect(); updateStateFromMouse(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top); e.preventDefault(); }, { passive: false });
    canvas.addEventListener('touchmove', (e) => { if (isDragging) { const rect = canvas.getBoundingClientRect(); updateStateFromMouse(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top); } e.preventDefault(); }, { passive: false });
    canvas.addEventListener('touchend', () => { isDragging = false; });

    function updateUI() {
        const alpha = Math.abs(state.x); // Simplified real projection
        const beta = Math.abs(state.y);

        // Map to UI - Assuming real coefficients for simplicity in this viz
        // Actually, let's just map x to alpha and y to beta (normalized)
        // Note: In Hilbert space, coefficients are complex. Here we visualize a real slice (circle).

        document.getElementById('val-alpha').innerText = state.x.toFixed(2);
        document.getElementById('val-beta').innerText = (-state.y).toFixed(2); // Invert Y for display

        document.getElementById('prob-0').innerText = (state.x * state.x * 100).toFixed(0) + '%';
        document.getElementById('prob-1').innerText = (state.y * state.y * 100).toFixed(0) + '%';
    }

    function draw() {
        if (!document.getElementById('hilbert-viz')) return;
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2; const cy = height / 2; const r = 80;

        // Axes
        drawArrow(ctx, cx, cy, cx + r + 20, cy, '#4b5563'); ctx.fillStyle = '#9ca3af'; ctx.fillText('|0⟩', cx + r + 25, cy + 5);
        drawArrow(ctx, cx, cy, cx, cy - r - 20, '#4b5563'); ctx.fillStyle = '#9ca3af'; ctx.fillText('|1⟩', cx - 10, cy - r - 25);

        // Circle
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.strokeStyle = '#374151'; ctx.setLineDash([5, 5]); ctx.stroke(); ctx.setLineDash([]);

        // Vector
        const vx = cx + state.x * r;
        const vy = cy + state.y * r;
        drawArrow(ctx, cx, cy, vx, vy, '#ec4899');

        // Projections
        ctx.strokeStyle = '#10b981'; ctx.setLineDash([2, 2]);
        ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(vx, cy); ctx.stroke(); // Alpha projection (x)

        ctx.strokeStyle = '#eab308';
        ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(cx, vy); ctx.stroke(); // Beta projection (y)
        ctx.setLineDash([]);

        requestAnimationFrame(draw);
    }
    draw();
}

// --- 1.3 Opérateurs (Operator Machine) ---
let opState = { angle: 0 }; // Angle on the circle
window.initOperators = function () {
    const setup = createQuantumCanvas('operator-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;

    let targetAngle = 0;

    function draw() {
        if (!document.getElementById('operator-viz')) return;
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2; const cy = height / 2; const r = 80;

        // Smooth transition
        opState.angle += (targetAngle - opState.angle) * 0.1;

        // Circle
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.strokeStyle = '#4b5563'; ctx.lineWidth = 2; ctx.stroke();

        // Basis
        ctx.fillStyle = '#fff'; ctx.font = '12px monospace';
        ctx.fillText('|0⟩', cx + r + 10, cy + 5);
        ctx.fillText('|1⟩', cx - 10, cy - r - 10);
        ctx.fillText('|-⟩', cx - r - 25, cy + 5);
        ctx.fillText('|+⟩', cx - 10, cy + r + 20);

        // Vector
        const vx = cx + r * Math.cos(opState.angle);
        const vy = cy - r * Math.sin(opState.angle); // Canvas Y is inverted
        drawArrow(ctx, cx, cy, vx, vy, '#eab308');

        requestAnimationFrame(draw);
    }
    draw();

    window.applyOperator = function (op) {
        // Mapping simple ops to 2D circle angles (simplified)
        // |0> is 0 rad (Right). |1> is PI/2 (Up).
        // X: |0> -> |1>, |1> -> |0>. Reflection y=x? Or rotation?
        // Let's treat them as rotations for visual simplicity in this 2D real slice.

        // Current angle normalized 0-2PI
        let current = opState.angle % (2 * Math.PI);
        if (current < 0) current += 2 * Math.PI;

        if (op === 'X') {
            // NOT: 0 -> PI/2 (Up), PI/2 -> 0. 
            // Actually X swaps |0> and |1>. On Bloch sphere it's rotation around X.
            // On this 2D circle (Re/Im or 0/1 basis?), let's say it swaps X and Y axes.
            targetAngle = Math.PI / 2 - targetAngle;
        } else if (op === 'Z') {
            // Phase flip: |1> -> -|1>. 
            // If we map Y axis to |1>, it flips Y.
            targetAngle = -targetAngle;
        } else if (op === 'H') {
            // Hadamard: |0> -> |+> (45 deg), |1> -> |-> (-135 deg).
            // It's a rotation/reflection.
            // Simplified: Set to 45 deg (PI/4) if close to 0 or PI/2
            targetAngle = Math.PI / 4;
        }
    }
}

// --- 2.1 Algèbre Linéaire Complexe (Tensor Viz) ---
window.initComplexAlgebra = function () {
    const setup = createQuantumCanvas('tensor-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;

    let time = 0;

    function draw() {
        if (!document.getElementById('tensor-viz')) return;
        ctx.clearRect(0, 0, width, height);

        // We visualize a 2x2 grid (Tensor product of 2 vectors)
        // Vector A (2D) x Vector B (2D) = Matrix 2x2 (or Vector 4D)

        // Let's animate Vector A and B
        const a1 = Math.cos(time * 0.05);
        const a2 = Math.sin(time * 0.05);

        const b1 = Math.cos(time * 0.1);
        const b2 = Math.sin(time * 0.1);

        // Tensor product components
        const c00 = a1 * b1;
        const c01 = a1 * b2;
        const c10 = a2 * b1;
        const c11 = a2 * b2;

        const size = width / 2;

        // Draw 4 quadrants
        drawQuad(0, 0, c00, '|00⟩');
        drawQuad(size, 0, c01, '|01⟩');
        drawQuad(0, size, c10, '|10⟩');
        drawQuad(size, size, c11, '|11⟩');

        function drawQuad(x, y, val, label) {
            const intensity = Math.abs(val);
            const color = val > 0 ? `rgba(99, 102, 241, ${intensity})` : `rgba(239, 68, 68, ${intensity})`; // Indigo / Red

            ctx.fillStyle = color;
            ctx.fillRect(x, y, size, size);
            ctx.strokeStyle = '#333';
            ctx.strokeRect(x, y, size, size);

            ctx.fillStyle = '#fff';
            ctx.font = '14px monospace';
            ctx.fillText(label, x + size / 2 - 15, y + size / 2);
            ctx.font = '10px monospace';
            ctx.fillText(val.toFixed(2), x + size / 2 - 10, y + size / 2 + 15);
        }

        time++;
        requestAnimationFrame(draw);
    }
    draw();
}

// --- 2.2 Théorie des Groupes (SU(2) Sphere) ---
let su2State = { theta: 0, phi: 0 };
window.initGroupTheory = function () {
    const setup = createQuantumCanvas('su2-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;

    // Target state for smooth animation
    let targetTheta = 0;
    let targetPhi = 0;

    function draw() {
        if (!document.getElementById('su2-viz')) return;
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2; const cy = height / 2; const r = 80;

        // Smooth interpolation
        su2State.theta += (targetTheta - su2State.theta) * 0.1;
        su2State.phi += (targetPhi - su2State.phi) * 0.1;

        // Draw Sphere
        const grad = ctx.createRadialGradient(cx - 20, cy - 20, 10, cx, cy, r);
        grad.addColorStop(0, '#4b5563');
        grad.addColorStop(1, '#1f2937');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();

        // Wireframe
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.beginPath(); ctx.ellipse(cx, cy, r, r / 3, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(cx, cy, r / 3, r, 0, 0, Math.PI * 2); ctx.stroke();

        // Vector
        const x = cx + r * Math.sin(su2State.theta) * Math.cos(su2State.phi);
        const y = cy - r * Math.cos(su2State.theta) + (r / 3) * Math.sin(su2State.theta) * Math.sin(su2State.phi); // Pseudo-3D Y

        drawArrow(ctx, cx, cy, x, y, '#f97316');

        requestAnimationFrame(draw);
    }
    draw();

    window.rotateSU2 = function (axis) {
        if (axis === 'x') {
            targetTheta += Math.PI / 2;
        } else if (axis === 'y') {
            // Complex to map exactly to theta/phi without quaternions, but let's fake a rotation
            targetTheta += Math.PI / 4;
            targetPhi += Math.PI / 2;
        } else if (axis === 'z') {
            targetPhi += Math.PI / 2;
        }
    }
}

// --- 2.3 Analyse Fonctionnelle (Guitar String) ---
let harmonics = [1, 0, 0]; // Amplitudes of modes 1, 2, 3
window.initFunctionalAnalysis = function () {
    const setup = createQuantumCanvas('functional-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;

    let t = 0;

    function draw() {
        if (!document.getElementById('functional-viz')) return;
        ctx.clearRect(0, 0, width, height);

        ctx.beginPath();
        ctx.strokeStyle = '#2dd4bf'; // Teal-400
        ctx.lineWidth = 3;

        for (let x = 0; x < width; x++) {
            // Sum of sines
            let y = height / 2;

            // Mode 1
            y += harmonics[0] * 30 * Math.sin((Math.PI * x / width) * 1) * Math.cos(t * 0.1);
            // Mode 2
            y += harmonics[1] * 30 * Math.sin((Math.PI * x / width) * 2) * Math.cos(t * 0.2);
            // Mode 3
            y += harmonics[2] * 30 * Math.sin((Math.PI * x / width) * 3) * Math.cos(t * 0.3);

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw nodes (fixed points)
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(0, height / 2, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(width, height / 2, 4, 0, Math.PI * 2); ctx.fill();

        t++;
        requestAnimationFrame(draw);
    }
    draw();

    window.addHarmonic = function (n) {
        harmonics[n - 1] += 0.5;
    }
    window.resetHarmonics = function () {
        harmonics = [0, 0, 0];
    }
}

// --- 2.4 Probabilités Quantiques (Density Matrix) ---
window.initQuantumProbability = function () {
    const setup = createQuantumCanvas('density-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;

    const slider = document.getElementById('purity-slider');

    function draw() {
        if (!document.getElementById('density-viz')) return;
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2; const cy = height / 2; const r = 80;

        // Bloch Sphere Boundary
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = '#4b5563'; ctx.setLineDash([5, 5]); ctx.stroke(); ctx.setLineDash([]);

        const purity = slider ? parseInt(slider.value) / 100 : 1;

        // The State Point
        // Purity determines radius from center. 1 = Surface, 0 = Center.
        const currentR = r * purity;

        // Let's rotate it a bit to look cool
        const angle = Date.now() * 0.001;
        const px = cx + currentR * Math.cos(angle);
        const py = cy + currentR * Math.sin(angle);

        // Draw State
        ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2);

        // Color based on purity
        // Pure (1) = Green, Mixed (0) = Yellow/Gray
        const rCol = 234 + (34 - 234) * purity; // Yellow -> Green
        const gCol = 179 + (197 - 179) * purity;
        const bCol = 8 + (94 - 8) * purity;
        ctx.fillStyle = purity > 0.9 ? '#22c55e' : '#eab308';

        ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.stroke();

        // Label
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        if (purity > 0.99) ctx.fillText('État Pur |ψ⟩', cx, cy + r + 20);
        else if (purity < 0.01) ctx.fillText('État Maximale Mixte (Bruit)', cx, cy + r + 20);
        else ctx.fillText(`État Mixte ρ (r=${purity.toFixed(2)})`, cx, cy + r + 20);

        requestAnimationFrame(draw);
    }
    draw();
}

// --- 3.1 Qubits (Bloch Sphere) ---
let qubitState = { theta: 0, phi: 0 };
window.initQubits = function () {
    const setup = createQuantumCanvas('bloch-sphere-container');
    if (!setup) return;
    const { ctx, width, height } = setup;

    let targetTheta = 0;
    let targetPhi = 0;

    function animate() {
        if (!document.getElementById('bloch-sphere-container')) return;
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2; const cy = height / 2; const r = 80;

        // Smooth transition
        qubitState.theta += (targetTheta - qubitState.theta) * 0.1;
        qubitState.phi += (targetPhi - qubitState.phi) * 0.1;

        // Sphere
        const grad = ctx.createRadialGradient(cx - 20, cy - 20, 10, cx, cy, r);
        grad.addColorStop(0, '#e0e7ff');
        grad.addColorStop(1, '#c7d2fe');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();

        // Wireframe
        ctx.strokeStyle = '#818cf8'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(cx, cy, r, r / 3, 0, 0, Math.PI * 2); ctx.stroke(); // Equator
        ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.stroke(); // Z Axis

        // Labels
        ctx.fillStyle = '#1e1b4b'; ctx.font = '12px font-bold';
        ctx.fillText('|0⟩', cx - 10, cy - r - 5);
        ctx.fillText('|1⟩', cx - 10, cy + r + 15);

        // Vector
        const px = cx + r * Math.sin(qubitState.theta) * Math.cos(qubitState.phi);
        const py = cy - r * Math.cos(qubitState.theta) + (r / 3) * Math.sin(qubitState.theta) * Math.sin(qubitState.phi);

        drawArrow(ctx, cx, cy, px, py, '#4f46e5');

        requestAnimationFrame(animate);
    }
    animate();

    window.setQubitState = function (state) {
        if (state === '0') { targetTheta = 0; targetPhi = 0; }
        if (state === '1') { targetTheta = Math.PI; targetPhi = 0; }
        if (state === '+') { targetTheta = Math.PI / 2; targetPhi = 0; }
        if (state === '-') { targetTheta = Math.PI / 2; targetPhi = Math.PI; }
    }
}

// --- 3.2 Gates (Circuit Composer Viz) ---
window.initQuantumGates = function () {
    const setup = createQuantumCanvas('gate-viz-container');
    if (!setup) return;
    const { ctx, width, height } = setup;

    let currentTheta = 0; // Start at |0> (Up)
    let targetTheta = 0;

    function draw() {
        if (!document.getElementById('gate-viz-container')) return;
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2; const cy = height / 2; const r = 60;

        currentTheta += (targetTheta - currentTheta) * 0.1;

        // Circle
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.strokeStyle = '#93c5fd'; ctx.lineWidth = 2; ctx.stroke();

        // Vector
        // Map theta: 0 -> Up, PI -> Down.
        const vx = cx + r * Math.sin(currentTheta);
        const vy = cy - r * Math.cos(currentTheta);

        drawArrow(ctx, cx, cy, vx, vy, '#2563eb');

        // Labels
        ctx.fillStyle = '#fff';
        ctx.fillText('|0⟩', cx - 5, cy - r - 10);
        ctx.fillText('|1⟩', cx - 5, cy + r + 15);

        requestAnimationFrame(draw);
    }
    draw();

    window.applyGate = function (gate) {
        if (gate === 'X') targetTheta = Math.PI - targetTheta; // Flip
        if (gate === 'H') targetTheta = Math.PI / 2; // Superposition
        if (gate === 'Z') {
            // Z doesn't change theta (probability), only phi (phase). 
            // In this 2D viz, we can't see phase easily unless we add color or another indicator.
            // Let's just wiggle the arrow to show "something happened"
            const temp = targetTheta;
            targetTheta += 0.2;
            setTimeout(() => { targetTheta = temp; }, 200);
        }
    }
}

// --- 3.3 Measurement (Cat) ---
window.initMeasurement = function () {
    const setup = createQuantumCanvas('measurement-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;

    let state = 'superposition'; // superposition, dead, alive

    function draw() {
        if (!document.getElementById('measurement-viz')) return;
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2; const cy = height / 2;

        ctx.font = '60px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (state === 'superposition') {
            // Blurring / Switching
            const emoji = Date.now() % 200 < 100 ? '🐱' : '💀';
            ctx.fillText(emoji, cx, cy);
            ctx.font = '20px Arial';
            ctx.fillStyle = '#fff';
            ctx.fillText('?', cx + 40, cy - 40);
        } else if (state === 'alive') {
            ctx.fillText('🐱', cx, cy);
            ctx.font = '20px Arial';
            ctx.fillStyle = '#22c55e';
            ctx.fillText('Vivant !', cx, cy + 50);
        } else if (state === 'dead') {
            ctx.fillText('💀', cx, cy);
            ctx.font = '20px Arial';
            ctx.fillStyle = '#ef4444';
            ctx.fillText('Mort...', cx, cy + 50);
        }

        requestAnimationFrame(draw);
    }
    draw();

    window.measureCat = function () {
        if (state !== 'superposition') {
            state = 'superposition'; // Reset
            document.querySelector('#measurement-viz + button').innerText = "Ouvrir la Boîte";
        } else {
            state = Math.random() < 0.5 ? 'alive' : 'dead';
            document.querySelector('#measurement-viz + button').innerText = "Réinitialiser";
        }
    }
}

// --- 3.4 Schrodinger (Wave Packet) ---
window.initSchrodinger = function () {
    const setup = createQuantumCanvas('schrodinger-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;
    let t = 0;
    function animate() {
        if (!document.getElementById('schrodinger-viz')) return;
        ctx.clearRect(0, 0, width, height);

        // Potential Well (Box)
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(10, 10, width - 20, height - 20);

        ctx.beginPath(); ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2;

        for (let x = 0; x < width; x++) {
            // Moving Gaussian Wave Packet
            // Center moves back and forth
            const center = width / 2 + (width / 3) * Math.sin(t * 0.02);

            // Envelope
            const env = Math.exp(-Math.pow((x - center) / 20, 2));

            // Wave
            const wave = Math.cos(x * 0.5 - t * 0.3);

            const y = height / 2 + env * wave * 60;

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

    const slider = document.getElementById('mix-slider');
    const display = document.getElementById('entropy-value');
    let mix = 0;

    if (slider) {
        slider.oninput = function () {
            mix = this.value / 100;
            // Von Neumann Entropy S = -Tr(rho log rho). For binary mix p, S = -p log p - (1-p) log (1-p)
            // Here we simulate mix of pure state |0> with noise I/2.
            // Eigenvalues are (1+mix)/2 and (1-mix)/2 ? No, let's simplify.
            // Let's say mix=0 -> S=0. mix=1 -> S=1 (max entropy for qubit).
            // S = -x log2 x - (1-x) log2 (1-x) where x = 0.5 + 0.5 * (1-mix)
            // Wait, if mix=1 (fully mixed), eigenvalues are 0.5, 0.5. S = 1.
            // If mix=0 (pure), eigenvalues are 1, 0. S = 0.
            const p = 0.5 * (1 - mix) + 0.5; // Eigenvalue 1
            const q = 1 - p; // Eigenvalue 2
            let entropy = 0;
            if (p > 0 && p < 1) entropy = -p * Math.log2(p) - q * Math.log2(q);
            if (mix === 0) entropy = 0;
            if (mix === 1) entropy = 1;

            display.innerText = entropy.toFixed(2);
        };
    }

    function draw() {
        if (!document.getElementById('entropy-viz')) return;
        ctx.clearRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;
        const r = 80;

        // Draw Bloch Sphere Outline
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.strokeStyle = '#333'; ctx.stroke();
        ctx.beginPath(); ctx.ellipse(cx, cy, r, r / 3, 0, 0, Math.PI * 2); ctx.strokeStyle = '#444'; ctx.stroke();

        // Draw State Vector (shrinks with entropy)
        // Length = 1 - mix
        const len = r * (1 - mix);

        // Draw "Cloud" of uncertainty
        const cloudRadius = r * mix;
        const grad = ctx.createRadialGradient(cx, cy - len, 0, cx, cy - len, cloudRadius + 10);
        grad.addColorStop(0, 'rgba(168, 85, 247, 0.8)');
        grad.addColorStop(1, 'rgba(168, 85, 247, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(cx, cy - len, cloudRadius, 0, Math.PI * 2); ctx.fill();

        // Arrow
        drawArrow(ctx, cx, cy, cx, cy - len, '#a855f7');

        ctx.fillStyle = '#fff';
        ctx.fillText(mix < 0.1 ? "État Pur" : (mix > 0.9 ? "État Mixte Max" : "État Mixte"), 10, 20);

        requestAnimationFrame(draw);
    }
    draw();
}

// --- 6.2 Channels ---
let channelState = { theta: 0, phi: 0, r: 1 };
window.initQuantumChannels = function () {
    const setup = createQuantumCanvas('bloch-channel-viz');
    if (!setup) return;
    const { ctx, width, height } = setup;

    function draw() {
        if (!document.getElementById('bloch-channel-viz')) return;
        ctx.clearRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;
        const r = 80;

        // Sphere
        ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(cx, cy, r, r / 3, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.stroke();

        // Vector
        const len = r * channelState.r;
        const vx = cx + len * Math.sin(channelState.theta) * Math.cos(channelState.phi);
        const vy = cy - len * Math.cos(channelState.theta) + (r / 3) * Math.sin(channelState.theta) * Math.sin(channelState.phi);

        drawArrow(ctx, cx, cy, vx, vy, '#f97316');

        requestAnimationFrame(draw);
    }
    draw();
}

window.applyChannelNoise = function (type) {
    if (type === 'bitflip') {
        // Rotate around X axis (simplified visual: flip theta)
        channelState.theta = Math.PI - channelState.theta;
    } else if (type === 'phaseflip') {
        // Rotate around Z axis (change phi)
        channelState.phi += Math.PI;
    } else if (type === 'depolarize') {
        // Shrink vector
        channelState.r *= 0.8;
    }
}

window.resetChannelBloch = function () {
    channelState = { theta: 0, phi: 0, r: 1 };
}

// --- 6.3 Theorems ---
window.initQuantumTheorems = function () {
    // No canvas needed for this module, just DOM logic

    // Cloning simulation
    window.attemptCloning = function () {
        const resultDiv = document.getElementById('cloning-result');
        const copyDiv = document.getElementById('cloning-copy');

        resultDiv.innerText = "Clonage en cours...";

        setTimeout(() => {
            // Random fidelity < 100%
            const fidelity = 0.5 + Math.random() * 0.3; // Max 0.83 (optimal cloning machine limit is 5/6 approx 0.83)
            resultDiv.innerText = `ÉCHEC ! Fidélité max théorique atteinte (${(fidelity * 100).toFixed(1)}%)`;

            // Visual feedback
            copyDiv.style.borderColor = '#ef4444';
            copyDiv.innerText = '≠';
            copyDiv.style.opacity = '1';
        }, 1000);
    }
}

// --- 6.4 QEC ---
let qecState = [0, 0, 0]; // 0 or 1
window.initQEC = function () {
    // Initial render
    updateQECVisuals();
}

window.flipQECQubit = function (index) {
    qecState[index] = 1 - qecState[index];
    updateQECVisuals();
}

window.applyQECCorrection = function () {
    const sum = qecState.reduce((a, b) => a + b, 0);
    const majority = sum >= 2 ? 1 : 0;
    qecState = [majority, majority, majority];

    // Animate correction bar
    const bar = document.getElementById('qec-correction-bar');
    if (bar) {
        bar.style.width = '100%';
        setTimeout(() => { bar.style.width = '0'; }, 500);
    }

    updateQECVisuals();
}

function updateQECVisuals() {
    // Update Qubits
    [0, 1, 2].forEach(i => {
        const el = document.getElementById(`qec-q1`.replace('1', i + 1));
        if (el) {
            el.innerText = qecState[i];
            el.style.backgroundColor = qecState[i] === 1 ? '#ef4444' : '#1f2937';
        }
    });

    // Syndrome Logic
    // Z1Z2 = q1 XOR q2 (0 if same, 1 if diff)
    // Z2Z3 = q2 XOR q3
    const s1 = qecState[0] ^ qecState[1];
    const s2 = qecState[1] ^ qecState[2];

    const syndromeEl = document.getElementById('qec-syndrome');
    const btn = document.getElementById('qec-fix-btn');

    if (syndromeEl) {
        if (s1 === 0 && s2 === 0) {
            syndromeEl.innerText = "OK (00)";
            syndromeEl.className = "font-mono text-emerald-400";
            if (btn) btn.disabled = true;
        } else {
            syndromeEl.innerText = `ERREUR (${s1}${s2})`;
            syndromeEl.className = "font-mono text-red-400 font-bold";
            if (btn) btn.disabled = false;
        }
    }
}

// --- 6.5 Networks ---
let networkLinks = { ar: false, rb: false, swapped: false };
window.initQuantumNetworks = function () {
    const canvas = document.getElementById('network-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Resize canvas to match parent
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    // Initial state
    networkLinks = { ar: true, rb: true, swapped: false };

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const y = canvas.height / 2;
        const xa = 50; // Alice pos approx
        const xr = canvas.width / 2; // Repeater pos
        const xb = canvas.width - 50; // Bob pos

        // Draw Links
        ctx.lineWidth = 3;

        // A-R Link
        if (networkLinks.ar) {
            ctx.beginPath(); ctx.moveTo(xa, y); ctx.lineTo(xr, y);
            ctx.strokeStyle = '#3b82f6'; ctx.setLineDash([5, 5]); ctx.stroke();

            // Entanglement particles
            const t = Date.now() / 1000;
            ctx.beginPath(); ctx.arc(xa + (xr - xa) / 2 + Math.sin(t) * 20, y, 4, 0, Math.PI * 2); ctx.fillStyle = '#60a5fa'; ctx.fill();
        }

        // R-B Link
        if (networkLinks.rb) {
            ctx.beginPath(); ctx.moveTo(xr, y); ctx.lineTo(xb, y);
            ctx.strokeStyle = '#ef4444'; ctx.setLineDash([5, 5]); ctx.stroke();

            const t = Date.now() / 1000;
            ctx.beginPath(); ctx.arc(xr + (xb - xr) / 2 + Math.cos(t) * 20, y, 4, 0, Math.PI * 2); ctx.fillStyle = '#f87171'; ctx.fill();
        }

        // Swapped Link (A-B direct)
        if (networkLinks.swapped) {
            ctx.beginPath();
            ctx.moveTo(xa, y - 40);
            ctx.quadraticCurveTo(xr, y - 100, xb, y - 40);
            ctx.strokeStyle = '#a855f7'; ctx.setLineDash([]); ctx.lineWidth = 4; ctx.stroke();

            ctx.fillStyle = '#fff'; ctx.fillText("INTRICATION LONGUE DISTANCE", xr - 80, y - 80);
        }

        requestAnimationFrame(draw);
    }
    draw();
}

window.performEntanglementSwap = function () {
    networkLinks.swapped = true;
    networkLinks.ar = false; // Consumed
    networkLinks.rb = false; // Consumed

    document.getElementById('network-status').innerText = "État : Intrication A-B établie ! (Swap réussi)";
    document.getElementById('network-status').className = "text-sm text-purple-400 font-bold mt-4 h-6";
    document.getElementById('swap-btn').disabled = true;
    document.getElementById('swap-btn').innerText = "Swap Effectué ✅";
}

// --- 7.1 QKD (BB84) ---
let qkdState = {
    photons: [],
    eveActive: false,
    log: []
};

window.initQKD = function () {
    const canvas = document.getElementById('qkd-viz');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Resize
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    function draw() {
        if (!document.getElementById('qkd-viz')) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Photons
        qkdState.photons.forEach((p, i) => {
            p.x += 3; // Move

            // Interception by Eve
            if (qkdState.eveActive && Math.abs(p.x - canvas.width / 2) < 5 && !p.intercepted) {
                p.intercepted = true;
                p.color = '#ef4444'; // Red flag
                logQKD("Eve a intercepté un photon !");
                document.getElementById('eve-container').classList.add('scale-110');
                setTimeout(() => document.getElementById('eve-container').classList.remove('scale-110'), 200);
            }

            // Arrival at Bob
            if (p.x > canvas.width - 50) {
                qkdState.photons.splice(i, 1);
                if (p.intercepted) {
                    logQKD("Bob a reçu un photon corrompu (Erreur détectée).");
                } else {
                    logQKD("Bob a reçu le photon intact.");
                }
            }

            // Draw
            ctx.beginPath();
            ctx.arc(p.x, canvas.height / 2, 6, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            ctx.shadowBlur = 10; ctx.shadowColor = p.color; ctx.fill(); ctx.shadowBlur = 0;

            // Polarization symbol
            ctx.fillStyle = '#fff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(p.basis === '+' ? '+' : 'x', p.x, canvas.height / 2 + 3);
        });

        requestAnimationFrame(draw);
    }
    draw();
}

window.sendQubit = function () {
    const basis = Math.random() > 0.5 ? '+' : 'x';
    qkdState.photons.push({
        x: 60,
        basis: basis,
        color: '#fbbf24', // Yellow
        intercepted: false
    });
    logQKD(`Alice envoie un photon (Base ${basis})`);
}

window.toggleEve = function () {
    qkdState.eveActive = !qkdState.eveActive;
    const eveDiv = document.getElementById('eve-container');
    const btn = document.getElementById('eve-toggle-btn');

    if (qkdState.eveActive) {
        eveDiv.style.opacity = '1';
        btn.innerText = "Désactiver Eve 🙅‍♀️";
        btn.classList.add('bg-red-700');
        logQKD("ATTENTION : Eve écoute la ligne !");
    } else {
        eveDiv.style.opacity = '0';
        btn.innerText = "Activer Eve 🕵️‍♀️";
        btn.classList.remove('bg-red-700');
        logQKD("Ligne sécurisée.");
    }
}

function logQKD(msg) {
    const log = document.getElementById('qkd-log');
    if (log) {
        const line = document.createElement('div');
        line.innerText = `> ${msg}`;
        log.appendChild(line);
        log.scrollTop = log.scrollHeight;
    }
}

// --- 7.2 Coin Flipping ---
let coinState = { committed: false, choice: null };

window.initCoinFlipping = function () {
    // Reset state on init
    coinState = { committed: false, choice: null };
    updateCoinUI();
}

window.commitCoin = function (val) {
    coinState.committed = true;
    coinState.choice = val;

    const coinContent = document.getElementById('coin-content');
    coinContent.innerText = "🔒";
    coinContent.classList.remove('animate-pulse');

    document.getElementById('coin-status').innerText = "Alice a envoyé le coffre (Commitment). Bob ne peut pas l'ouvrir.";
    document.getElementById('verify-btn').disabled = false;
}

window.verifyCoin = function () {
    if (!coinState.committed) return;

    const coinContent = document.getElementById('coin-content');
    const viz = document.getElementById('coin-viz');

    // Animation
    coinContent.innerText = "🔓";
    setTimeout(() => {
        coinContent.innerText = coinState.choice === '0' ? "🦅" : "👑"; // Pile or Face
        viz.style.borderColor = coinState.choice === '0' ? '#3b82f6' : '#eab308';
        document.getElementById('coin-status').innerText = `Alice révèle : ${coinState.choice === '0' ? 'PILE' : 'FACE'}. Vérifié !`;
    }, 500);

    document.getElementById('verify-btn').disabled = true;
}

function updateCoinUI() {
    // Helper if needed
}

// --- 7.3 QRNG ---
let qrngRunning = false;
window.initQRNG = function () {
    const canvas = document.getElementById('qrng-viz');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Resize
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    let bits = [];

    function draw() {
        if (!document.getElementById('qrng-viz')) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Generate bits if running
        if (qrngRunning && Math.random() < 0.2) {
            bits.push({
                val: Math.random() > 0.5 ? 1 : 0,
                x: canvas.width,
                y: canvas.height / 2 + (Math.random() - 0.5) * 50,
                color: '#2dd4bf'
            });

            // Update display
            const lastBit = bits[bits.length - 1].val;
            document.getElementById('qrng-value').innerText = lastBit;
        }

        // Draw bits stream
        bits.forEach((b, i) => {
            b.x -= 5; // Fast speed
            ctx.fillStyle = b.val ? '#2dd4bf' : '#0f766e';
            ctx.font = '20px monospace';
            ctx.fillText(b.val, b.x, b.y);

            if (b.x < -20) bits.splice(i, 1);
        });

        requestAnimationFrame(draw);
    }
    draw();
}

window.startQRNG = function () {
    qrngRunning = !qrngRunning;
    const btn = document.getElementById('qrng-btn');
    if (qrngRunning) {
        btn.innerText = "Arrêter le Chaos 🛑";
        btn.classList.add('bg-red-600');
    } else {
        btn.innerText = "Générer du Chaos 🎲";
        btn.classList.remove('bg-red-600');
    }
}

// --- 7.4 Security ---
let laserPulse = null;
let leakData = [];

window.initSecurityAttacks = function () {
    const canvas = document.getElementById('security-viz');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Resize
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    // Init leak data
    for (let i = 0; i < canvas.width; i++) leakData.push(canvas.height / 2);

    function draw() {
        if (!document.getElementById('security-viz')) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Trace
        ctx.beginPath();
        ctx.moveTo(0, leakData[0]);
        for (let i = 1; i < leakData.length; i++) {
            ctx.lineTo(i, leakData[i]);
        }
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Scroll data
        leakData.shift();
        let noise = (Math.random() - 0.5) * 5;

        if (laserPulse) {
            // Pulse shape
            const t = laserPulse.t;
            const amp = laserPulse.type === '0' ? 30 : 60; // Different power for 0 and 1!
            const signal = -Math.sin(t * 0.2) * amp * Math.exp(-Math.pow((t - 20) / 10, 2));

            leakData.push(canvas.height / 2 + signal + noise);
            laserPulse.t++;

            if (laserPulse.t > 50) {
                laserPulse = null;
                document.getElementById('leak-value').innerText = "0%";
            } else {
                // Update leak display
                const leakPercent = (laserPulse.type === '0' ? 30 : 60) + Math.floor(Math.random() * 5);
                document.getElementById('leak-value').innerText = `${leakPercent}% (Power)`;
            }
        } else {
            leakData.push(canvas.height / 2 + noise);
        }

        requestAnimationFrame(draw);
    }
    draw();
}

window.triggerLaserPulse = function () {
    // Randomly choose bit 0 or 1 to encode
    const bit = Math.random() > 0.5 ? '1' : '0';
    laserPulse = { t: 0, type: bit };
}

// --- 8.1 Open Systems ---
window.initOpenSystems = function () {
    const canvas = document.getElementById('open-systems-viz');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Resize
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    // System particle
    let sys = { x: canvas.width / 2, y: canvas.height / 2, vx: 0, vy: 0, r: 15, color: '#3b82f6' };

    // Environment particles
    let env = [];
    for (let i = 0; i < 50; i++) {
        env.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            r: 3,
            color: '#ef4444'
        });
    }

    const tempSlider = document.getElementById('temp-slider');
    const couplingSlider = document.getElementById('coupling-slider');

    function draw() {
        if (!document.getElementById('open-systems-viz')) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const temp = tempSlider ? parseInt(tempSlider.value) : 20;
        const coupling = couplingSlider ? parseInt(couplingSlider.value) / 100 : 0.5;

        // Update Environment
        env.forEach(p => {
            p.x += p.vx * (temp / 20);
            p.y += p.vy * (temp / 20);

            // Bounce walls
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            // Interact with System
            const dx = sys.x - p.x;
            const dy = sys.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < sys.r + p.r) {
                // Collision / Interaction
                if (Math.random() < coupling) {
                    sys.vx += p.vx * 0.1;
                    sys.vy += p.vy * 0.1;
                    // Damping
                    sys.vx *= 0.99;
                    sys.vy *= 0.99;
                }
            }

            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.fill();
        });

        // Update System
        sys.x += sys.vx;
        sys.y += sys.vy;

        // Keep system in bounds (soft)
        if (sys.x < 0) sys.x += canvas.width;
        if (sys.x > canvas.width) sys.x -= canvas.width;
        if (sys.y < 0) sys.y += canvas.height;
        if (sys.y > canvas.height) sys.y -= canvas.height;

        // Draw System
        ctx.beginPath(); ctx.arc(sys.x, sys.y, sys.r, 0, Math.PI * 2);
        ctx.fillStyle = sys.color; ctx.shadowBlur = 15; ctx.shadowColor = sys.color; ctx.fill(); ctx.shadowBlur = 0;

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
let transmonPulse = 0;
window.initSuperconducting = function () {
    const canvas = document.getElementById('superconducting-viz');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Resize
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    let time = 0;

    function draw() {
        if (!document.getElementById('superconducting-viz')) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 0.1;

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        // Draw Circuit
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';

        // Capacitor (Parallel plates)
        ctx.beginPath();
        ctx.moveTo(cx - 50, cy - 40); ctx.lineTo(cx - 50, cy + 40); // Left plate
        ctx.moveTo(cx + 50, cy - 40); ctx.lineTo(cx + 50, cy + 40); // Right plate
        ctx.stroke();

        // Loop
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - 50, cy - 40); ctx.lineTo(cx - 50, cy - 80); ctx.lineTo(cx + 50, cy - 80); ctx.lineTo(cx + 50, cy - 40);
        ctx.moveTo(cx - 50, cy + 40); ctx.lineTo(cx - 50, cy + 80); ctx.lineTo(cx + 50, cy + 80); ctx.lineTo(cx + 50, cy + 40);
        ctx.stroke();

        // Josephson Junction (Cross)
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx - 10, cy + 80 - 10); ctx.lineTo(cx + 10, cy + 80 + 10);
        ctx.moveTo(cx + 10, cy + 80 - 10); ctx.lineTo(cx - 10, cy + 80 + 10);
        ctx.stroke();

        // Current Flow Animation
        if (transmonPulse > 0) {
            transmonPulse -= 0.02;
            const intensity = Math.sin(time * 2) * transmonPulse * 50;

            ctx.strokeStyle = `rgba(251, 191, 36, ${transmonPulse})`; // Yellow glow
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(cx, cy, 70, 0, Math.PI * 2);
            ctx.stroke();

            // Electrons
            const eX = cx + Math.cos(time * 3) * 60;
            const eY = cy + Math.sin(time * 3) * 60; // Elliptical path approx
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.arc(eX, eY, 5, 0, Math.PI * 2); ctx.fill();
        }

        requestAnimationFrame(draw);
    }
    draw();
}

window.pulseTransmon = function () {
    transmonPulse = 1.0;
}

// --- 9.2 Trapped Ions ---
let ionMode = 'idle'; // idle, cool, entangle
window.initTrappedIons = function () {
    const canvas = document.getElementById('trapped-ions-viz');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Resize
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    let t = 0;

    function draw() {
        if (!document.getElementById('trapped-ions-viz')) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        t += 0.1;

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        // Draw Electrodes (Paul Trap)
        ctx.fillStyle = '#333';
        ctx.fillRect(0, cy - 60, canvas.width, 10);
        ctx.fillRect(0, cy + 50, canvas.width, 10);

        // Ions
        for (let i = -2; i <= 2; i++) {
            let x = cx + i * 50;
            let y = cy;

            // Vibration logic
            if (ionMode === 'idle') {
                x += Math.sin(t + i) * 2; // Thermal noise
            } else if (ionMode === 'cool') {
                x += Math.sin(t + i) * 0.2; // Very cold
            } else if (ionMode === 'entangle') {
                x += Math.sin(t * 2) * 10; // Collective mode (in sync)
            }

            // Laser beams
            if (ionMode !== 'idle') {
                ctx.strokeStyle = ionMode === 'cool' ? 'rgba(6, 182, 212, 0.5)' : 'rgba(168, 85, 247, 0.5)';
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, y); ctx.stroke();
            }

            // Draw Ion
            ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#a855f7'; ctx.fill();
            ctx.shadowBlur = 10; ctx.shadowColor = '#a855f7'; ctx.fill(); ctx.shadowBlur = 0;
        }

        requestAnimationFrame(draw);
    }
    draw();
}

window.laserPulseIons = function (mode) {
    ionMode = mode;
    setTimeout(() => { ionMode = 'idle'; }, 3000);
}

// --- 9.3 Photonic ---
let photonicPhotons = [];
window.initPhotonic = function () {
    const canvas = document.getElementById('photonic-viz');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Resize
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const phaseSlider = document.getElementById('phase-slider');

    function draw() {
        if (!document.getElementById('photonic-viz')) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const phase = phaseSlider ? parseInt(phaseSlider.value) : 0;
        const phaseRad = phase * Math.PI / 180;

        // Draw Interferometer Paths
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;

        const y1 = canvas.height / 3;
        const y2 = 2 * canvas.height / 3;
        const xStart = 50;
        const xEnd = canvas.width - 50;
        const xBS1 = canvas.width / 3;
        const xBS2 = 2 * canvas.width / 3;

        // Path 0 (Top)
        ctx.beginPath(); ctx.moveTo(xStart, y1); ctx.lineTo(xEnd, y1); ctx.stroke();
        // Path 1 (Bottom)
        ctx.beginPath(); ctx.moveTo(xStart, y2); ctx.lineTo(xEnd, y2); ctx.stroke();

        // Beam Splitters (Vertical lines)
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(xBS1, y1 - 20); ctx.lineTo(xBS1, y2 + 20); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(xBS2, y1 - 20); ctx.lineTo(xBS2, y2 + 20); ctx.stroke();

        // Phase Shifter (Box on bottom path)
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(xBS1 + 40, y2 - 10, 40, 20);
        ctx.fillStyle = '#fff'; ctx.font = '10px Arial'; ctx.fillText(`φ=${phase}°`, xBS1 + 45, y2 + 5);

        // Photons
        photonicPhotons.forEach((p, i) => {
            p.x += 4;

            // Logic at BS1
            if (Math.abs(p.x - xBS1) < 4 && !p.passedBS1) {
                p.passedBS1 = true;
                // 50/50 split (visualize as superposition? No, just random path for particle model)
                // Or split into two "ghost" photons? Let's stick to particle model for simplicity.
                if (Math.random() < 0.5) p.y = y1; else p.y = y2;
            }

            // Logic at BS2 (Interference)
            if (Math.abs(p.x - xBS2) < 4 && !p.passedBS2) {
                p.passedBS2 = true;
                // Interference probability depends on phase
                // P(0) = cos^2(phi/2)
                const p0 = Math.pow(Math.cos(phaseRad / 2), 2);
                if (Math.random() < p0) p.y = y1; else p.y = y2;
            }

            ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#fbbf24'; ctx.fill();
            ctx.shadowBlur = 10; ctx.shadowColor = '#fbbf24'; ctx.fill(); ctx.shadowBlur = 0;

            if (p.x > canvas.width) photonicPhotons.splice(i, 1);
        });

        requestAnimationFrame(draw);
    }
    draw();
}

window.firePhoton = function () {
    photonicPhotons.push({
        x: 0,
        y: document.getElementById('photonic-viz').height / 3, // Start top input
        passedBS1: false,
        passedBS2: false
    });
}
