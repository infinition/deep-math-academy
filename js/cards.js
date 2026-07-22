// ==========================================
// CARTES CONCEPTS — moteur + labs interactifs
// Portage integral de Quantum.html et Deep.html
// (11 niveaux + 82 cartes + 4 labs / 11 niveaux + 107 cartes + 4 labs)
// ==========================================

(function () {
    'use strict';

    // ------------------------------------------
    // MOTEUR DE CARTES (repli/depli + montage des labs)
    // ------------------------------------------
    function bindLevel(kind, levelId) {
        const root = document.querySelector(`[data-qa-level="${kind}:${levelId}"]`);
        if (!root || root.dataset.qaBound === '1') return root;
        root.dataset.qaBound = '1';

        const cards = [...root.querySelectorAll('.qa-card')];

        cards.forEach(card => {
            const head = card.querySelector('.qa-card-head');
            if (!head) return;

            const toggle = () => {
                const collapsed = card.classList.toggle('qa-collapsed');
                head.setAttribute('aria-expanded', String(!collapsed));
            };

            head.addEventListener('click', toggle);
            head.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    toggle();
                }
            });
        });

        const toggleAll = root.querySelector('.qa-toggle-all');
        if (toggleAll) {
            toggleAll.addEventListener('click', () => {
                const shouldCollapse = !cards.every(card => card.classList.contains('qa-collapsed'));
                cards.forEach(card => {
                    card.classList.toggle('qa-collapsed', shouldCollapse);
                    const head = card.querySelector('.qa-card-head');
                    if (head) head.setAttribute('aria-expanded', String(!shouldCollapse));
                });
                toggleAll.textContent = shouldCollapse ? 'Tout déplier' : 'Tout replier';
            });
        }

        return root;
    }

    function mountLab(kind, levelId, root) {
        const host = root && root.querySelector(`[data-qa-lab="${kind}:${levelId}"]`);
        if (!host || host.dataset.qaLabBuilt === '1') return;

        const factory = LABS[kind] && LABS[kind][levelId];
        if (!factory) return;

        host.dataset.qaLabBuilt = '1';
        host.innerHTML = '';
        try {
            factory(host);
        } catch (error) {
            console.error(`[Lab ${kind}:${levelId}]`, error);
            host.innerHTML = '<div class="qa-lab-loading">Le lab interactif n\'a pas pu démarrer.</div>';
        }
    }

    function initLevel(kind, levelId) {
        const root = bindLevel(kind, levelId);
        mountLab(kind, levelId, root);
    }

    // ==========================================
    // OUTILLAGE DES LABS (porte des sources)
    // ==========================================
    function labShell(host, title, tag, exp, ctrlHTML) {
        host.innerHTML =
            '<h3>' + title + '<span>' + tag + '</span></h3>' +
            '<p class="qa-lab-exp">' + exp + '</p>' +
            '<div class="qa-lab-grid"><canvas width="640" height="360"></canvas>' +
            '<div class="qa-lab-ctrl">' + ctrlHTML + '</div></div>';
        return host;
    }

    function mapper(W, H, xmin, xmax, ymin, ymax) {
        return { X: x => (x - xmin) / (xmax - xmin) * W, Y: y => H - (y - ymin) / (ymax - ymin) * H };
    }

    function drawAxes(ctx, W, H, m, xmin, xmax, ymin, ymax) {
        ctx.clearRect(0, 0, W, H);
        ctx.strokeStyle = '#111B29'; ctx.lineWidth = 1; ctx.beginPath();
        for (let x = Math.ceil(xmin); x <= Math.floor(xmax); x++) { ctx.moveTo(m.X(x), 0); ctx.lineTo(m.X(x), H); }
        for (let y = Math.ceil(ymin); y <= Math.floor(ymax); y++) { ctx.moveTo(0, m.Y(y)); ctx.lineTo(W, m.Y(y)); }
        ctx.stroke();
        ctx.strokeStyle = '#2A3A50'; ctx.beginPath();
        if (xmin < 0 && xmax > 0) { ctx.moveTo(m.X(0), 0); ctx.lineTo(m.X(0), H); }
        if (ymin < 0 && ymax > 0) { ctx.moveTo(0, m.Y(0)); ctx.lineTo(W, m.Y(0)); }
        ctx.stroke();
    }

    function drawCurve(ctx, m, fn, xmin, xmax, color, width) {
        ctx.strokeStyle = color; ctx.lineWidth = width || 2; ctx.beginPath();
        let started = false;
        for (let i = 0; i <= 500; i++) {
            const x = xmin + (xmax - xmin) * i / 500, y = fn(x);
            if (!isFinite(y)) { started = false; continue; }
            const px = m.X(x), py = m.Y(y);
            if (py < -2000 || py > 2000) { started = false; continue; }
            if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
        }
        ctx.stroke();
    }

    function dot(ctx, px, py, r, color) {
        ctx.fillStyle = color; ctx.beginPath(); ctx.arc(px, py, r, 0, 6.2832); ctx.fill();
    }

    function yRange(fn, xmin, xmax) {
        let lo = Infinity, hi = -Infinity;
        for (let i = 0; i <= 200; i++) {
            const y = fn(xmin + (xmax - xmin) * i / 200);
            if (isFinite(y)) { lo = Math.min(lo, y); hi = Math.max(hi, y); }
        }
        lo = Math.max(lo, -8); hi = Math.min(hi, 8);
        if (!isFinite(lo) || !isFinite(hi) || lo === hi) { lo = -1; hi = 1; }
        const pad = (hi - lo) * 0.15 || 1;
        return [lo - pad, hi + pad];
    }

    const FUNCS = {
        'x^2': { fn: x => x * x, latex: 'f(x)=x^2' },
        'x^3': { fn: x => x * x * x, latex: 'f(x)=x^3' },
        'sqrt(x)': { fn: x => (x < 0 ? NaN : Math.sqrt(x)), latex: 'f(x)=sqrt(x)' },
        'e^x': { fn: x => Math.exp(x), latex: 'f(x)=e^x' },
        'ln(x)': { fn: x => (x <= 0 ? NaN : Math.log(x)), latex: 'f(x)=ln(x)' },
        'sin(x)': { fn: x => Math.sin(x), latex: 'f(x)=sin(x)' },
        'sig(x)': { fn: x => 1 / (1 + Math.exp(-x)), latex: 'f(x)=1/(1+e^-x)' }
    };

    function funcSelect(id) {
        return '<label>FONCTION f</label><select id="' + id + '">' +
            Object.keys(FUNCS).map(k => '<option value="' + k + '">' + k + '</option>').join('') +
            '</select>';
    }

    // ==========================================
    // LABS QUANTUM
    // ==========================================

    /* --- Niveau 1 : Interference de deux ondes --- */
    function labWave(box) {
        labShell(box, 'LAB &middot; Interférence de deux ondes', 'NIVEAU 1',
            "Deux chemins, deux amplitudes qui s'ADDITIONNENT avant le module carré. Tourne la phase relative &phi;: à 0 les ondes se renforcent (intensité 4&times; une onde seule), à &pi; elles s'ANNIHILENT. C'est le moteur de tous les algorithmes quantiques.",
            '<label>PHASE RELATIVE &phi; = <output id="lw1o">0.00</output> rad</label><input type="range" id="lw1" min="0" max="6.2832" step="0.01" value="0">' +
            '<label>AMPLITUDE ONDE 2 = <output id="lw2o">1.00</output></label><input type="range" id="lw2" min="0" max="1" step="0.01" value="1">' +
            '<div class="qa-readout" id="lwr"></div>');

        const ctx = box.querySelector('canvas').getContext('2d');
        const upd = () => {
            const phi = parseFloat(box.querySelector('#lw1').value);
            const A2 = parseFloat(box.querySelector('#lw2').value);
            box.querySelector('#lw1o').value = phi.toFixed(2);
            box.querySelector('#lw2o').value = A2.toFixed(2);
            const m = mapper(640, 360, 0, 4 * Math.PI, -2.4, 2.4);
            drawAxes(ctx, 640, 360, m, 0, 4 * Math.PI, -2.4, 2.4);
            const w1 = x => Math.cos(x), w2 = x => A2 * Math.cos(x + phi), s = x => w1(x) + w2(x);
            drawCurve(ctx, m, w1, 0, 4 * Math.PI, 'rgba(61,232,255,.45)', 1.5);
            drawCurve(ctx, m, w2, 0, 4 * Math.PI, 'rgba(178,107,255,.45)', 1.5);
            drawCurve(ctx, m, s, 0, 4 * Math.PI, '#B26BFF', 2.5);
            const I = 1 + A2 * A2 + 2 * A2 * Math.cos(phi);
            const tag = Math.abs(Math.cos(phi) - 1) < 0.02 ? 'CONSTRUCTIVE: les chemins se renforcent'
                : (Math.abs(Math.cos(phi) + 1) < 0.02 && A2 > 0.95) ? "DESTRUCTIVE: les chemins s'annulent"
                    : 'partielle';
            box.querySelector('#lwr').textContent =
                'Intensité |ψ₁+ψ₂|² = 1 + A₂² + 2A₂·cos φ = ' + I.toFixed(3) +
                '\n(classique, sans interférence: 1 + A₂² = ' + (1 + A2 * A2).toFixed(3) + ')' +
                '\nInterférence ' + tag;
        };
        box.addEventListener('input', upd);
        requestAnimationFrame(upd);
    }

    /* --- Niveau 4 : Sphere de Bloch --- */
    function labBloch(box) {
        labShell(box, 'LAB &middot; La sphère de Bloch', 'NIVEAU 4',
            "Tout état d'un qubit = un point sur la sphère: |ψ⟩ = cos(θ/2)|0⟩ + e^{iφ} sin(θ/2)|1⟩. θ règle le mélange |0⟩/|1⟩ (colatitude), φ la phase (longitude). Retrouve les six états cardinaux: |0⟩, |1⟩, |+⟩, |−⟩, |+i⟩, |−i⟩.",
            '<label>θ (colatitude) = <output id="lb1o">1.57</output> rad</label><input type="range" id="lb1" min="0" max="3.1416" step="0.01" value="1.5708">' +
            '<label>φ (phase) = <output id="lb2o">0.00</output> rad</label><input type="range" id="lb2" min="0" max="6.2832" step="0.01" value="0">' +
            '<div class="qa-readout" id="lbr"></div>');

        const ctx = box.querySelector('canvas').getContext('2d');
        const upd = () => {
            const th = parseFloat(box.querySelector('#lb1').value);
            const ph = parseFloat(box.querySelector('#lb2').value);
            box.querySelector('#lb1o').value = th.toFixed(2);
            box.querySelector('#lb2o').value = ph.toFixed(2);
            ctx.clearRect(0, 0, 640, 360);
            const cx = 320, cy = 180, R = 140;
            const P = (x, y, z) => ({ X: cx + R * (x * 0.94 + y * 0.33), Y: cy - R * (z * 0.94 - y * 0.28) });

            ctx.strokeStyle = '#2A3A50'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.stroke();
            ctx.strokeStyle = '#1E2A3C'; ctx.beginPath();
            for (let i = 0; i <= 64; i++) {
                const a = i / 64 * 6.2832, p = P(Math.cos(a), Math.sin(a), 0);
                if (i) ctx.lineTo(p.X, p.Y); else ctx.moveTo(p.X, p.Y);
            }
            ctx.stroke();

            const axes = [[1.25, 0, 0, 'x |+⟩'], [0, 1.25, 0, 'y |+i⟩'], [0, 0, 1.25, 'z |0⟩'], [0, 0, -1.3, '|1⟩']];
            ctx.font = '11px monospace'; ctx.fillStyle = '#5A6678'; ctx.textAlign = 'left';
            axes.forEach(a => {
                const p0 = P(0, 0, 0), p1 = P(a[0], a[1], a[2]);
                ctx.strokeStyle = '#2A3A50'; ctx.beginPath();
                ctx.moveTo(p0.X, p0.Y); ctx.lineTo(p1.X, p1.Y); ctx.stroke();
                ctx.fillText(a[3], p1.X + 4, p1.Y);
            });

            const x = Math.sin(th) * Math.cos(ph), y = Math.sin(th) * Math.sin(ph), z = Math.cos(th);
            const tip = P(x, y, z), o = P(0, 0, 0);
            ctx.strokeStyle = '#B26BFF'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(o.X, o.Y); ctx.lineTo(tip.X, tip.Y); ctx.stroke();
            dot(ctx, tip.X, tip.Y, 6, '#B26BFF');

            const a0 = Math.cos(th / 2), a1 = Math.sin(th / 2);
            const cardinals = [[0, 0, '|0⟩'], [3.1416, 0, '|1⟩'], [1.5708, 0, '|+⟩'], [1.5708, 3.1416, '|−⟩'], [1.5708, 1.5708, '|+i⟩'], [1.5708, 4.7124, '|−i⟩']];
            const near = cardinals.find(c => Math.abs(c[0] - th) < 0.06 && (Math.abs(th) < 0.06 || Math.abs(th - 3.1416) < 0.06 || Math.abs(((ph - c[1]) % 6.2832 + 6.2832) % 6.2832) < 0.06 || Math.abs(((ph - c[1]) % 6.2832 + 6.2832) % 6.2832 - 6.2832) > 6.22));

            box.querySelector('#lbr').textContent =
                '|ψ⟩ = ' + a0.toFixed(3) + '|0⟩ + e^{i·' + ph.toFixed(2) + '} · ' + a1.toFixed(3) + '|1⟩' +
                '\nP(0) = cos²(θ/2) = ' + (a0 * a0).toFixed(3) + '   P(1) = ' + (a1 * a1).toFixed(3) +
                '\nBloch: (x,y,z) = (' + x.toFixed(2) + ', ' + y.toFixed(2) + ', ' + z.toFixed(2) + ')' +
                (near ? '\n→ état cardinal: ' + near[2] : '');
        };
        box.addEventListener('input', upd);
        requestAnimationFrame(upd);
    }

    /* --- Niveau 6 : Un qubit sous les portes --- */
    function labGates(box) {
        labShell(box, 'LAB &middot; Un qubit sous les portes', 'NIVEAU 6',
            "Applique H, X, Z, S, T à un vrai vecteur d'état (calculé en complexes, en direct). Vérifie les identités: H&middot;H = I, S&middot;S = Z, H&middot;Z&middot;H = X. La phase de |1⟩ est dessinée comme une aiguille: Z, S, T ne touchent pas aux barres mais font tourner l'aiguille.",
            '<div class="qa-lab-btns"><button id="lgH">H</button><button id="lgX">X</button><button id="lgZ">Z</button><button id="lgS">S</button><button id="lgT">T</button></div>' +
            '<button id="lgR">RESET |0⟩</button>' +
            '<div class="qa-readout" id="lgr"></div>');

        const ctx = box.querySelector('canvas').getContext('2d');
        const K = {
            mul: (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]],
            add: (a, b) => [a[0] + b[0], a[1] + b[1]],
            abs2: a => a[0] * a[0] + a[1] * a[1],
            str: a => {
                const re = a[0].toFixed(3), im = a[1].toFixed(3);
                return Math.abs(a[1]) < 5e-4 ? re
                    : (Math.abs(a[0]) < 5e-4 ? im + 'i' : re + (a[1] < 0 ? ' − ' : ' + ') + Math.abs(a[1]).toFixed(3) + 'i');
            }
        };
        const isq = 1 / Math.sqrt(2);
        const GATES = {
            H: [[[isq, 0], [isq, 0]], [[isq, 0], [-isq, 0]]],
            X: [[[0, 0], [1, 0]], [[1, 0], [0, 0]]],
            Z: [[[1, 0], [0, 0]], [[0, 0], [-1, 0]]],
            S: [[[1, 0], [0, 0]], [[0, 0], [0, 1]]],
            T: [[[1, 0], [0, 0]], [[0, 0], [Math.cos(Math.PI / 4), Math.sin(Math.PI / 4)]]]
        };

        let st = [[1, 0], [0, 0]], hist = ['|0⟩'];

        const draw = () => {
            ctx.clearRect(0, 0, 640, 360);
            const p0 = K.abs2(st[0]), p1 = K.abs2(st[1]);
            [['|0⟩', p0, 140], ['|1⟩', p1, 360]].forEach(([lab, p, x]) => {
                const h = p * 230, y = 300 - h;
                ctx.fillStyle = '#B26BFF'; ctx.globalAlpha = .85; ctx.fillRect(x, y, 110, h); ctx.globalAlpha = 1;
                ctx.fillStyle = '#E7EEF7'; ctx.font = '600 14px monospace'; ctx.textAlign = 'center';
                ctx.fillText((p * 100).toFixed(1) + '%', x + 55, y - 10 > 20 ? y - 10 : 20);
                ctx.fillStyle = '#8A96A8'; ctx.fillText(lab, x + 55, 324);
            });
            [[st[0], 140 + 55], [st[1], 360 + 55]].forEach(([a, x]) => {
                const r = 22, cy2 = 348;
                if (K.abs2(a) < 1e-6) return;
                const ang = Math.atan2(a[1], a[0]);
                ctx.strokeStyle = '#3DE8FF'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(x + 90, cy2 - 14, r, 0, 6.2832); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(x + 90, cy2 - 14);
                ctx.lineTo(x + 90 + r * Math.cos(-ang), cy2 - 14 + r * Math.sin(-ang)); ctx.stroke();
            });
            box.querySelector('#lgr').textContent =
                '|ψ⟩ = (' + K.str(st[0]) + ')|0⟩ + (' + K.str(st[1]) + ')|1⟩' +
                '\nCircuit: ' + hist.join(' → ') +
                '\nEssaie: H,H (retour) · S,S (= Z) · H,Z,H (= X)';
        };

        const apply = g => {
            const M = GATES[g];
            st = [K.add(K.mul(M[0][0], st[0]), K.mul(M[0][1], st[1])),
            K.add(K.mul(M[1][0], st[0]), K.mul(M[1][1], st[1]))];
            hist.push(g);
            if (hist.length > 14) hist = ['…'].concat(hist.slice(-13));
            draw();
        };

        ['H', 'X', 'Z', 'S', 'T'].forEach(g => box.querySelector('#lg' + g).addEventListener('click', () => apply(g)));
        box.querySelector('#lgR').addEventListener('click', () => { st = [[1, 0], [0, 0]]; hist = ['|0⟩']; draw(); });
        requestAnimationFrame(draw);
    }

    /* --- Niveau 7 : Amplification de Grover --- */
    function labGrover(box) {
        const N = 16, target = 11;
        labShell(box, "LAB &middot; L'amplification de Grover", 'NIVEAU 7',
            "N = 16 états, une cible cachée (|1011⟩). Chaque itération: l'oracle retourne le signe de la cible, la diffusion inverse autour de la moyenne — l'amplitude de la cible grandit. Optimum &asymp; (&pi;/4)&radic;16 &asymp; 3 tours. Continue au-delà: la probabilité REDESCEND (sin²).",
            '<label>ITÉRATIONS k = <output id="lg4o">0</output></label><input type="range" id="lg4" min="0" max="9" step="1" value="0">' +
            '<div class="qa-readout" id="lg4r"></div>');

        const ctx = box.querySelector('canvas').getContext('2d');
        const upd = () => {
            const k = parseInt(box.querySelector('#lg4').value, 10);
            box.querySelector('#lg4o').value = k;
            let a = new Array(N).fill(1 / Math.sqrt(N));
            for (let it = 0; it < k; it++) {
                a[target] *= -1;
                const mean = a.reduce((s, v) => s + v, 0) / N;
                a = a.map(v => 2 * mean - v);
            }
            ctx.clearRect(0, 0, 640, 360);
            const zero = 200, bw = 640 / N - 6;
            ctx.strokeStyle = '#2A3A50'; ctx.beginPath(); ctx.moveTo(0, zero); ctx.lineTo(640, zero); ctx.stroke();
            a.forEach((v, i) => {
                const x = i * (640 / N) + 3, h = v * 150;
                ctx.fillStyle = i === target ? '#B26BFF' : '#3DE8FF'; ctx.globalAlpha = .85;
                ctx.fillRect(x, h >= 0 ? zero - h : zero, bw, Math.abs(h)); ctx.globalAlpha = 1;
            });
            ctx.fillStyle = '#8A96A8'; ctx.font = '11px monospace'; ctx.textAlign = 'center';
            ctx.fillText('amplitudes (violet = cible)', 320, 350);
            const p = a[target] * a[target];
            const opt = Math.round(Math.PI / 4 * Math.sqrt(N));
            box.querySelector('#lg4r').textContent =
                'P(cible) = ' + (p * 100).toFixed(1) + '%   (départ: ' + (100 / N).toFixed(1) + '%)' +
                '\nOptimum théorique: k ≈ (π/4)·√N = ' + opt +
                (k === opt ? "\n→ tu es à l'optimum: mesure MAINTENANT."
                    : k > opt ? "\n→ trop d'itérations: tu as dépassé la cible (rotation sin²)." : '');
        };
        box.addEventListener('input', upd);
        requestAnimationFrame(upd);
    }

    // ==========================================
    // LABS DEEP
    // ==========================================

    /* --- Niveau 1 : Explorateur f(x) --- */
    function labFx(box) {
        labShell(box, 'LAB &middot; Explorateur f(x)', 'NIVEAU 1',
            "Une fonction est une machine: tu donnes x, elle rend f(x). Choisis la machine, déplace le point, et lis la sortie. C'est exactement ce que fait un neurone avec son activation.",
            funcSelect('l1f') +
            '<label>x = <output id="l1xo">1.00</output></label><input type="range" id="l1x" min="-4" max="4" step="0.05" value="1">' +
            '<div class="qa-readout" id="l1r"></div>');

        const ctx = box.querySelector('canvas').getContext('2d');
        const upd = () => {
            const info = FUNCS[box.querySelector('#l1f').value], fn = info.fn;
            const a = parseFloat(box.querySelector('#l1x').value);
            box.querySelector('#l1xo').value = a.toFixed(2);
            const [ymin, ymax] = yRange(fn, -4, 4), m = mapper(640, 360, -4, 4, ymin, ymax);
            drawAxes(ctx, 640, 360, m, -4, 4, ymin, ymax);
            drawCurve(ctx, m, fn, -4, 4, '#3DE8FF');
            const fa = fn(a);
            if (isFinite(fa)) {
                ctx.strokeStyle = 'rgba(200,255,61,.4)'; ctx.setLineDash([4, 4]); ctx.beginPath();
                ctx.moveTo(m.X(a), m.Y(fa)); ctx.lineTo(m.X(a), m.Y(0));
                ctx.moveTo(m.X(a), m.Y(fa)); ctx.lineTo(m.X(0), m.Y(fa));
                ctx.stroke(); ctx.setLineDash([]);
                dot(ctx, m.X(a), m.Y(fa), 6, '#C8FF3D');
            }
            ctx.fillStyle = 'rgba(200,255,61,.7)'; ctx.font = '14px monospace'; ctx.textAlign = 'left';
            ctx.fillText(info.latex, 14, 24);
            box.querySelector('#l1r').textContent = isFinite(fa)
                ? 'ENTREE  x = ' + a.toFixed(2) + '\nSORTIE  f(x) = ' + fa.toFixed(4)
                : 'f(' + a.toFixed(2) + ") n'est pas défini ici\n(hors du domaine de la fonction)";
        };
        box.addEventListener('input', upd);
        requestAnimationFrame(upd);
    }

    /* --- Niveau 3 : La derivee en direct --- */
    function labDeriv(box) {
        labShell(box, 'LAB &middot; La dérivée en direct', 'NIVEAU 3',
            "La dérivée f'(a) = la pente de la tangente = de combien f réagit si tu pousses x d'un chouïa. Déplace le point: quand la tangente est horizontale, f'(a)=0 — c'est là que les optimiseurs s'arrêtent.",
            funcSelect('l2f') +
            '<label>a = <output id="l2xo">1.00</output></label><input type="range" id="l2x" min="-4" max="4" step="0.05" value="1">' +
            '<div class="qa-readout" id="l2r"></div>');

        const ctx = box.querySelector('canvas').getContext('2d');
        const upd = () => {
            const info = FUNCS[box.querySelector('#l2f').value], fn = info.fn;
            const a = parseFloat(box.querySelector('#l2x').value);
            box.querySelector('#l2xo').value = a.toFixed(2);
            const [ymin, ymax] = yRange(fn, -4, 4), m = mapper(640, 360, -4, 4, ymin, ymax);
            drawAxes(ctx, 640, 360, m, -4, 4, ymin, ymax);
            drawCurve(ctx, m, fn, -4, 4, '#3DE8FF');
            ctx.fillStyle = 'rgba(200,255,61,.7)'; ctx.font = '14px monospace'; ctx.textAlign = 'left';
            ctx.fillText(info.latex, 14, 24);
            const h = 1e-4, fa = fn(a), d = (fn(a + h) - fn(a - h)) / (2 * h);
            let txt;
            if (isFinite(fa) && isFinite(d)) {
                drawCurve(ctx, m, x => fa + d * (x - a), Math.max(-4, a - 1.6), Math.min(4, a + 1.6), '#C8FF3D', 2);
                dot(ctx, m.X(a), m.Y(fa), 6, '#C8FF3D');
                const s = Math.abs(d) < 0.02 ? '≈ 0 : point stationnaire (min, max ou plateau)'
                    : d > 0 ? 'positive : f monte ici' : 'négative : f descend ici';
                txt = 'f(a)  = ' + fa.toFixed(4) + "\nf'(a) = " + d.toFixed(4) + '\nPente ' + s;
            } else {
                txt = "La dérivée n'est pas définie ici.";
            }
            box.querySelector('#l2r').textContent = txt;
        };
        box.addEventListener('input', upd);
        requestAnimationFrame(upd);
    }

    /* --- Niveau 5 : Descente de gradient --- */
    function labGD(box) {
        const L = x => x * x * x * x / 16 - x * x + x / 4 + 3;
        const G = x => x * x * x / 4 - 2 * x + 0.25;
        const L_LATEX = 'L(x)=x^4/16 - x^2 + x/4 + 3';

        labShell(box, 'LAB &middot; Descente de gradient', 'NIVEAU 5',
            "La règle unique de tout l'entraînement: x &larr; x &minus; lr&middot;&nabla;L. Joue avec le learning rate: trop petit = lent, bien réglé = converge, trop grand = ça oscille puis EXPLOSE. Change aussi le départ: selon la vallée initiale, tu finis dans un minimum différent (local vs global).",
            '<label>LEARNING RATE = <output id="l3lro">0.10</output></label><input type="range" id="l3lr" min="0.01" max="1.20" step="0.01" value="0.10">' +
            '<label>DÉPART x₀ = <output id="l3so">3.50</output></label><input type="range" id="l3s" min="-4" max="4" step="0.1" value="3.5">' +
            "<button id=\"l3go\">REJOUER L'ANIMATION</button>" +
            '<div class="qa-readout" id="l3r"></div>');

        const ctx = box.querySelector('canvas').getContext('2d');
        let raf = null;

        const run = animate => {
            if (raf) cancelAnimationFrame(raf);
            const lr = parseFloat(box.querySelector('#l3lr').value);
            const x0 = parseFloat(box.querySelector('#l3s').value);
            box.querySelector('#l3lro').value = lr.toFixed(2);
            box.querySelector('#l3so').value = x0.toFixed(2);

            const traj = [x0];
            let x = x0, diverged = false;
            for (let i = 0; i < 60; i++) {
                x = x - lr * G(x);
                traj.push(x);
                if (!isFinite(x) || Math.abs(x) > 60) { diverged = true; break; }
            }

            const [ymin, ymax] = yRange(L, -4, 4), m = mapper(640, 360, -4, 4, ymin, ymax);
            let k = 0;
            const frame = () => {
                drawAxes(ctx, 640, 360, m, -4, 4, ymin, ymax);
                drawCurve(ctx, m, L, -4, 4, '#3DE8FF');
                ctx.fillStyle = 'rgba(200,255,61,.7)'; ctx.font = '14px monospace'; ctx.textAlign = 'left';
                ctx.fillText(L_LATEX, 14, 24);
                for (let i = 0; i <= k && i < traj.length; i++) {
                    const xi = Math.max(-4, Math.min(4, traj[i])), yi = L(traj[i]);
                    if (!isFinite(yi)) break;
                    const last = (i === Math.min(k, traj.length - 1));
                    if (i > 0) {
                        const xp = Math.max(-4, Math.min(4, traj[i - 1]));
                        ctx.strokeStyle = 'rgba(200,255,61,.35)'; ctx.lineWidth = 1.5; ctx.beginPath();
                        ctx.moveTo(m.X(xp), m.Y(Math.max(ymin, Math.min(ymax, L(traj[i - 1])))));
                        ctx.lineTo(m.X(xi), m.Y(Math.max(ymin, Math.min(ymax, yi))));
                        ctx.stroke();
                    }
                    dot(ctx, m.X(xi), m.Y(Math.max(ymin, Math.min(ymax, yi))), last ? 6 : 3, last ? '#C8FF3D' : 'rgba(200,255,61,.55)');
                }
                if (animate && k < traj.length - 1) { k += 1; raf = requestAnimationFrame(frame); }
            };
            k = animate ? 0 : traj.length - 1;
            frame();

            const xf = traj[traj.length - 1];
            box.querySelector('#l3r').textContent = diverged
                ? 'x₀=' + x0.toFixed(2) + '  lr=' + lr.toFixed(2) + '\n💥 DIVERGENCE: le pas est trop grand,\nchaque mise à jour saute par-dessus la vallée.'
                : 'x₀=' + x0.toFixed(2) + '  lr=' + lr.toFixed(2) +
                '\nAprès ' + (traj.length - 1) + ' pas: x=' + xf.toFixed(3) + '  L(x)=' + L(xf).toFixed(3) +
                (Math.abs(G(xf)) < 0.02 ? '\n∇L≈0 : convergé (regarde DANS QUELLE vallée).' : '\n∇L=' + G(xf).toFixed(3) + ' : pas encore stabilisé.');
        };

        box.addEventListener('input', () => run(false));
        box.querySelector('#l3go').addEventListener('click', () => run(true));
        requestAnimationFrame(() => run(true));
    }

    /* --- Niveau 8 : Softmax et temperature --- */
    function labSoftmax(box) {
        const NAMES = ['chat', 'chien', 'vélo', 'pizza', 'lune'];
        const BASE = [2.0, 1.0, 0.5, 0.2, -1.0];

        labShell(box, 'LAB &middot; Softmax et température', 'NIVEAU 8',
            "Le LLM sort des scores bruts (logits), softmax les transforme en probabilités. La température T divise les logits avant softmax: T&rarr;0 = déterministe (argmax), T grand = créatif/chaotique (quasi-uniforme). C'est LE réglage que tu passes à l'API.",
            '<label>TEMPÉRATURE T = <output id="l4to">1.00</output></label><input type="range" id="l4t" min="0.05" max="5" step="0.05" value="1">' +
            '<label>LOGIT &laquo; ' + NAMES[0] + ' &raquo; = <output id="l4ao">2.00</output></label><input type="range" id="l4a" min="-2" max="5" step="0.1" value="2">' +
            '<div class="qa-readout" id="l4r"></div>');

        const ctx = box.querySelector('canvas').getContext('2d');
        const upd = () => {
            const T = parseFloat(box.querySelector('#l4t').value);
            const a = parseFloat(box.querySelector('#l4a').value);
            box.querySelector('#l4to').value = T.toFixed(2);
            box.querySelector('#l4ao').value = a.toFixed(2);
            const z = [a, ...BASE.slice(1)];
            const mx = Math.max(...z.map(v => v / T));
            const e = z.map(v => Math.exp(v / T - mx));
            const S = e.reduce((p, c) => p + c, 0);
            const p = e.map(v => v / S);

            ctx.clearRect(0, 0, 640, 360);
            const bw = 90, gap = (640 - 5 * bw) / 6;
            p.forEach((pi, i) => {
                const x = gap + i * (bw + gap), h = pi * 280, y = 330 - h;
                ctx.fillStyle = i === 0 ? '#C8FF3D' : '#3DE8FF';
                ctx.globalAlpha = .9; ctx.fillRect(x, y, bw, h); ctx.globalAlpha = 1;
                ctx.fillStyle = '#E7EEF7'; ctx.font = '600 13px monospace'; ctx.textAlign = 'center';
                ctx.fillText((pi * 100).toFixed(1) + '%', x + bw / 2, y - 8);
                ctx.fillStyle = '#8A96A8'; ctx.font = '12px monospace';
                ctx.fillText(NAMES[i], x + bw / 2, 350);
                ctx.fillStyle = '#5A6678'; ctx.font = '10px monospace';
                ctx.fillText('z=' + z[i].toFixed(1), x + bw / 2, y - 24 > 0 ? y - 24 : 10);
            });

            const H = -p.reduce((s, pi) => s + (pi > 0 ? pi * Math.log2(pi) : 0), 0);
            box.querySelector('#l4r').textContent =
                'T=' + T.toFixed(2) + '   Entropie H=' + H.toFixed(3) + ' bits (max ' + Math.log2(5).toFixed(3) + ')\n' +
                (T <= 0.2 ? 'Mode quasi-argmax: réponse déterministe.'
                    : T >= 3 ? 'Quasi-uniforme: le modèle « hallucine » au hasard.'
                        : 'Zone habituelle (0.7–1.2): équilibre cohérence/diversité.');
        };
        box.addEventListener('input', upd);
        requestAnimationFrame(upd);
    }

    const LABS = {
        quantum: { 1: labWave, 4: labBloch, 6: labGates, 7: labGrover },
        deep: { 1: labFx, 3: labDeriv, 5: labGD, 8: labSoftmax }
    };

    // ==========================================
    // ENREGISTREMENT DES initFunction
    // ==========================================
    for (let level = 0; level <= 10; level++) {
        window['initQuantumCardsL' + level] = () => initLevel('quantum', level);
        window['initDeepCardsL' + level] = () => initLevel('deep', level);
    }
})();
