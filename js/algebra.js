// ==========================================
// ALGEBRA SPECIFIC INTERACTIVE LOGIC
// ==========================================

// --- INTERACTIVE: ALGEBRA (SLIDERS VECTEUR) ---
function initVectorSlidersCanvas() {
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
