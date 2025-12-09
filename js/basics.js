// ==========================================
// BASICS & UTILS SPECIFIC INTERACTIVE LOGIC
// ==========================================

// ==========================================
// SHARED UTILS
// ==========================================


// ==========================================
// LOGIC: VENN DIAGRAM (SETS)
// ==========================================
let vennCanvas = null;
let vennCtx = null;
let vennState = { A: false, B: false, U: false, I: false }; // Selected regions

function initVennCanvas() {
    vennCanvas = document.getElementById('vennCanvas');
    if (!vennCanvas) return;
    vennCtx = vennCanvas.getContext('2d');

    // Add click listener
    vennCanvas.addEventListener('mousedown', (e) => {
        const rect = vennCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        handleVennClick(x, y);
    });

    drawVenn();
}

function handleVennClick(x, y) {
    const w = vennCanvas.width;
    const h = vennCanvas.height;
    const cxA = w / 2 - 40;
    const cxB = w / 2 + 40;
    const cy = h / 2;
    const r = 80;

    const distA = Math.hypot(x - cxA, y - cy);
    const distB = Math.hypot(x - cxB, y - cy);

    // Logic to toggle regions
    // 1. Intersection
    if (distA < r && distB < r) {
        vennState.I = !vennState.I;
    }
    // 2. Only A
    else if (distA < r) {
        vennState.A = !vennState.A;
    }
    // 3. Only B
    else if (distB < r) {
        vennState.B = !vennState.B;
    }
    // 4. Universe (Outside)
    else {
        vennState.U = !vennState.U;
    }

    drawVenn();
    updateVennNotation();
}

function drawVenn() {
    if (!vennCtx || !vennCanvas) return;
    const ctx = vennCtx;
    const w = vennCanvas.width;
    const h = vennCanvas.height;
    const cxA = w / 2 - 40;
    const cxB = w / 2 + 40;
    const cy = h / 2;
    const r = 80;

    ctx.clearRect(0, 0, w, h);

    // Universe Background
    ctx.fillStyle = vennState.U ? '#d1fae5' : '#f9fafb';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#374151';
    ctx.strokeRect(0, 0, w, h);
    ctx.fillStyle = '#374151';
    ctx.fillText("U (Univers)", 10, 20);

    // Circle A (Left)
    ctx.beginPath();
    ctx.arc(cxA, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = vennState.A ? '#93c5fd' : 'rgba(255, 255, 255, 0.5)';
    ctx.fill();
    ctx.strokeStyle = '#2563eb';
    ctx.stroke();

    // Circle B (Right)
    ctx.beginPath();
    ctx.arc(cxB, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = vennState.B ? '#fca5a5' : 'rgba(255, 255, 255, 0.5)';
    ctx.fill();
    ctx.strokeStyle = '#dc2626';
    ctx.stroke();

    // Intersection (Redraw over)
    ctx.save();
    ctx.beginPath();
    ctx.arc(cxA, cy, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.beginPath();
    ctx.arc(cxB, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = vennState.I ? '#c084fc' : 'rgba(0, 0, 0, 0.05)';
    ctx.fill();
    ctx.restore();

    // Labels
    ctx.fillStyle = '#1e3a8a';
    ctx.fillText("A", cxA - 40, cy);
    ctx.fillStyle = '#991b1b';
    ctx.fillText("B", cxB + 40, cy);
}

function updateVennNotation() {
    let notation = [];
    if (vennState.U && !vennState.A && !vennState.B && !vennState.I) notation.push("∅ (Vide)");
    if (vennState.A) notation.push("A \\ B");
    if (vennState.B) notation.push("B \\ A");
    if (vennState.I) notation.push("A ∩ B");
    if (vennState.U) notation.push("(A ∪ B)'");

    // Combine logic for common sets
    const allInner = vennState.A && vennState.B && vennState.I;
    if (allInner) document.getElementById('vennRes').innerText = "A ∪ B (Union)";
    else if (vennState.I && !vennState.A && !vennState.B) document.getElementById('vennRes').innerText = "A ∩ B (Intersection)";
    else if (vennState.A && !vennState.B && !vennState.I) document.getElementById('vennRes').innerText = "A privé de B";
    else if (notation.length > 0) document.getElementById('vennRes').innerText = notation.join(" + ");
    else document.getElementById('vennRes').innerText = "Sélectionnez une zone";
}

function resetVenn() {
    vennState = { A: false, B: false, U: false, I: false };
    drawVenn();
    updateVennNotation();
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
