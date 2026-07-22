// ==========================================
// DERIVEE INTERACTIVE — f, f', dx, df
// Portage de derivee_interactive_f_fprime_df.html
// Module : analysis / derivee_interactive
// ==========================================

(function () {
    'use strict';

    // Le module peut etre recharge plusieurs fois (navigation) : on garde une
    // reference aux listeners globaux pour ne pas les empiler sur des canvas morts.
    let resizeHandler = null;

    const FUNCS = {
        x4: {
            label: 'f(x) = x⁴', formula: 'f(x) = x^4', der: 'f′(x) = df/dx = 4x^3',
            f: x => Math.pow(x, 4), fp: x => 4 * Math.pow(x, 3), range: [-3, 3]
        },
        x3: {
            label: 'f(x) = x³', formula: 'f(x) = x^3', der: 'f′(x) = df/dx = 3x^2',
            f: x => Math.pow(x, 3), fp: x => 3 * Math.pow(x, 2), range: [-4, 4]
        },
        x2: {
            label: 'f(x) = x²', formula: 'f(x) = x^2', der: 'f′(x) = df/dx = 2x',
            f: x => x * x, fp: x => 2 * x, range: [-5, 5]
        },
        sin: {
            label: 'f(x) = sin(x)', formula: 'f(x) = sin(x)', der: 'f′(x) = df/dx = cos(x)',
            f: x => Math.sin(x), fp: x => Math.cos(x), range: [-7, 7]
        },
        cos: {
            label: 'f(x) = cos(x)', formula: 'f(x) = cos(x)', der: 'f′(x) = df/dx = -sin(x)',
            f: x => Math.cos(x), fp: x => -Math.sin(x), range: [-7, 7]
        },
        exp: {
            label: 'f(x) = eˣ / 4', formula: 'f(x) = e^x / 4', der: 'f′(x) = df/dx = e^x / 4',
            f: x => Math.exp(x) / 4, fp: x => Math.exp(x) / 4, range: [-4, 4]
        },
        mix: {
            label: 'f(x) = 0.25x³ - x', formula: 'f(x) = 0.25x^3 - x', der: 'f′(x) = df/dx = 0.75x^2 - 1',
            f: x => 0.25 * x * x * x - x, fp: x => 0.75 * x * x - 1, range: [-5, 5]
        }
    };

    window.initDeriveeInteractive = function () {
        const canvas = document.getElementById('dv-graph');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const fnSelect = document.getElementById('dv-fn');
        const xSlider = document.getElementById('dv-x0');
        const dxSlider = document.getElementById('dv-dx');
        if (!ctx || !fnSelect || !xSlider || !dxSlider) return;

        const els = {
            xVal: document.getElementById('dv-xVal'),
            dxVal: document.getElementById('dv-dxVal'),
            formula: document.getElementById('dv-formula'),
            derFormula: document.getElementById('dv-derFormula'),
            fx: document.getElementById('dv-fx'),
            fpx: document.getElementById('dv-fpx'),
            dfLine: document.getElementById('dv-dfLine'),
            dfVal: document.getElementById('dv-dfVal'),
            dyVal: document.getElementById('dv-dyVal'),
            centerBtn: document.getElementById('dv-centerBtn'),
            tinyBtn: document.getElementById('dv-tinyBtn')
        };

        const state = {
            x0: parseFloat(xSlider.value),
            dx: parseFloat(dxSlider.value),
            scale: 70,
            ox: 0,
            oy: 0,
            dragging: false,
            dragMode: null,
            last: null
        };

        const current = () => FUNCS[fnSelect.value];

        function fmt(n) {
            if (!Number.isFinite(n)) return '∞';
            const a = Math.abs(n);
            if (a >= 10000 || (a > 0 && a < 0.001)) return n.toExponential(2);
            return n.toFixed(3).replace(/\.?0+$/, '');
        }

        const W = () => canvas.getBoundingClientRect().width;
        const H = () => canvas.getBoundingClientRect().height;

        const sx = x => W() / 2 + state.ox + x * state.scale;
        const sy = y => H() / 2 + state.oy - y * state.scale;
        const wx = px => (px - W() / 2 - state.ox) / state.scale;
        const wy = py => -(py - H() / 2 - state.oy) / state.scale;

        function resize() {
            const dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));
            const rect = canvas.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            canvas.width = Math.round(rect.width * dpr);
            canvas.height = Math.round(rect.height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            draw();
        }

        function roundGridStep() {
            const raw = 90 / state.scale;
            const pow = Math.pow(10, Math.floor(Math.log10(raw)));
            const n = raw / pow;
            const m = n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10;
            return m * pow;
        }

        function drawGrid() {
            const w = W(), h = H();
            ctx.clearRect(0, 0, w, h);

            const g = ctx.createRadialGradient(w * 0.35, -120, 20, w * 0.5, h * 0.4, Math.max(w, h));
            g.addColorStop(0, 'rgba(70,130,180,.18)');
            g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, w, h);

            const step = roundGridStep();
            const xMax = wx(w), yMin = wy(h), yMax = wy(0);
            const startX = Math.floor(wx(0) / step) * step;
            const startY = Math.floor(yMin / step) * step;

            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(113,130,158,.18)';
            ctx.fillStyle = 'rgba(180,195,220,.55)';
            ctx.font = '12px ui-monospace, monospace';

            for (let x = startX; x <= xMax; x += step) {
                const px = sx(x);
                ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke();
                if (Math.abs(x) > step / 2) ctx.fillText(fmt(x), px + 4, sy(0) + 14);
            }
            for (let y = startY; y <= yMax; y += step) {
                const py = sy(y);
                ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(w, py); ctx.stroke();
                if (Math.abs(y) > step / 2) ctx.fillText(fmt(y), sx(0) + 6, py - 5);
            }

            ctx.strokeStyle = 'rgba(150,170,205,.70)';
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(0, sy(0)); ctx.lineTo(w, sy(0)); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(sx(0), 0); ctx.lineTo(sx(0), h); ctx.stroke();

            ctx.fillStyle = 'rgba(237,243,255,.85)';
            ctx.font = '13px ui-sans-serif, system-ui';
            ctx.fillText('x', w - 22, sy(0) - 8);
            ctx.fillText('y', sx(0) + 8, 18);
        }

        function pathFunction(f, color, width) {
            const w = W();
            ctx.beginPath();
            let moved = false;
            for (let px = -2; px <= w + 2; px += 2) {
                const y = f(wx(px)), py = sy(y);
                if (!Number.isFinite(py) || Math.abs(py) > 1e6) { moved = false; continue; }
                if (!moved) { ctx.moveTo(px, py); moved = true; } else ctx.lineTo(px, py);
            }
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            ctx.stroke();
        }

        function drawArrowLine(x1, y1, x2, y2, color, width) {
            ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width || 2;
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            const a = Math.atan2(y2 - y1, x2 - x1), len = 9;
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - len * Math.cos(a - Math.PI / 6), y2 - len * Math.sin(a - Math.PI / 6));
            ctx.lineTo(x2 - len * Math.cos(a + Math.PI / 6), y2 - len * Math.sin(a + Math.PI / 6));
            ctx.closePath(); ctx.fill();
        }

        function drawPoint(px, py, r, fill, stroke) {
            ctx.beginPath();
            ctx.arc(px, py, r, 0, Math.PI * 2);
            ctx.fillStyle = fill; ctx.fill();
            ctx.lineWidth = 2; ctx.strokeStyle = stroke || 'rgba(0,0,0,.4)'; ctx.stroke();
        }

        function roundRect(c, x, y, w, h, r) {
            c.beginPath();
            c.moveTo(x + r, y);
            c.arcTo(x + w, y, x + w, y + h, r);
            c.arcTo(x + w, y + h, x, y + h, r);
            c.arcTo(x, y + h, x, y, r);
            c.arcTo(x, y, x + w, y, r);
            c.closePath();
        }

        function drawLabel(text, px, py, color, align) {
            const a = align || 'left';
            ctx.font = '13px ui-monospace, SFMono-Regular, Menlo, monospace';
            ctx.textAlign = a;
            ctx.textBaseline = 'middle';
            const metrics = ctx.measureText(text);
            const padX = 7;
            const x = a === 'right' ? px - metrics.width - padX * 2 : px;
            ctx.fillStyle = 'rgba(5,8,13,.72)';
            ctx.strokeStyle = 'rgba(255,255,255,.10)';
            ctx.lineWidth = 1;
            roundRect(ctx, x, py - 11, metrics.width + padX * 2, 22, 8);
            ctx.fill(); ctx.stroke();
            ctx.fillStyle = color || 'rgba(237,243,255,.92)';
            ctx.fillText(text, a === 'right' ? px - padX : px + padX, py);
            ctx.textAlign = 'left';
        }

        function draw() {
            const fn = current();
            const f = fn.f, fp = fn.fp;
            const x0 = state.x0, dx = state.dx;
            const y0 = f(x0), slope = fp(x0);
            const x1 = x0 + dx, y1 = f(x1);
            const df = slope * dx;
            const yTan = y0 + df;

            drawGrid();
            pathFunction(f, 'rgba(121,242,201,.95)', 3);

            // tangente
            const xLeft = wx(0), xRight = wx(W());
            ctx.setLineDash([]);
            ctx.strokeStyle = 'rgba(255,207,112,.95)';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(sx(xLeft), sy(y0 + slope * (xLeft - x0)));
            ctx.lineTo(sx(xRight), sy(y0 + slope * (xRight - x0)));
            ctx.stroke();

            // secante : la vraie variation
            ctx.strokeStyle = 'rgba(255,122,200,.88)';
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 7]);
            ctx.beginPath(); ctx.moveTo(sx(x0), sy(y0)); ctx.lineTo(sx(x1), sy(y1)); ctx.stroke();
            ctx.setLineDash([]);

            drawArrowLine(sx(x0), sy(y0), sx(x1), sy(y0), 'rgba(122,168,255,.95)', 2.5);
            drawArrowLine(sx(x1), sy(y0), sx(x1), sy(yTan), 'rgba(255,143,112,.95)', 2.5);

            ctx.setLineDash([5, 5]);
            drawArrowLine(sx(x1) + 16, sy(y0), sx(x1) + 16, sy(y1), 'rgba(255,122,200,.78)', 2);
            ctx.setLineDash([]);

            drawPoint(sx(x1), sy(yTan), 5.5, 'rgba(255,207,112,.95)');
            drawPoint(sx(x0), sy(y0), 8.5, '#fff', 'rgba(121,242,201,.9)');
            drawPoint(sx(x1), sy(y1), 6.5, 'rgba(255,122,200,.98)');

            ctx.strokeStyle = 'rgba(255,255,255,.12)';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 5]);
            ctx.beginPath(); ctx.moveTo(sx(x0), sy(0)); ctx.lineTo(sx(x0), sy(y0)); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(sx(0), sy(y0)); ctx.lineTo(sx(x0), sy(y0)); ctx.stroke();
            ctx.setLineDash([]);

            drawLabel('x = ' + fmt(x0), sx(x0) + 12, sy(0) - 22);
            drawLabel('f(x) = ' + fmt(y0), sx(x0) + 14, sy(y0) - 26);
            drawLabel('f′(x) = ' + fmt(slope), sx(x0) + 20, sy(y0) + 26, 'rgba(255,207,112,.95)');
            drawLabel('dx = ' + fmt(dx), (sx(x0) + sx(x1)) / 2 - 28, sy(y0) + 22, 'rgba(122,168,255,.95)');
            drawLabel('df ≈ ' + fmt(df), sx(x1) + 12, (sy(y0) + sy(yTan)) / 2, 'rgba(255,143,112,.95)');
            drawLabel('Δf = ' + fmt(y1 - y0), sx(x1) + 30, (sy(y0) + sy(y1)) / 2, 'rgba(255,122,200,.95)');
        }

        function updatePanel() {
            const fn = current(), x0 = state.x0, dx = state.dx;
            const y = fn.f(x0), slope = fn.fp(x0), df = slope * dx, dy = fn.f(x0 + dx) - y;
            xSlider.value = String(x0);
            dxSlider.value = String(dx);
            els.xVal.textContent = fmt(x0);
            els.dxVal.textContent = fmt(dx);
            els.formula.textContent = fn.formula;
            els.derFormula.textContent = fn.der;
            els.fx.textContent = 'f(' + fmt(x0) + ') = ' + fmt(y);
            els.fpx.textContent = 'f′(' + fmt(x0) + ') = ' + fmt(slope);
            els.dfLine.textContent = 'df ≈ f′(x) · dx = ' + fmt(slope) + ' × ' + fmt(dx);
            els.dfVal.textContent = fmt(df);
            els.dyVal.textContent = fmt(dy);
            draw();
        }

        function pointerPos(e) {
            const r = canvas.getBoundingClientRect();
            return { x: e.clientX - r.left, y: e.clientY - r.top };
        }

        function nearestPointHit(px, py) {
            return Math.hypot(px - sx(state.x0), py - sy(current().f(state.x0))) < 28;
        }

        canvas.addEventListener('pointerdown', e => {
            canvas.setPointerCapture(e.pointerId);
            const p = pointerPos(e);
            state.dragging = true;
            state.last = p;
            state.dragMode = nearestPointHit(p.x, p.y) ? 'point' : 'pan';
            canvas.classList.add('dv-dragging');
        });

        canvas.addEventListener('pointermove', e => {
            if (!state.dragging) return;
            const p = pointerPos(e);
            if (state.dragMode === 'point') {
                state.x0 = Math.max(parseFloat(xSlider.min), Math.min(parseFloat(xSlider.max), wx(p.x)));
                updatePanel();
            } else {
                state.ox += p.x - state.last.x;
                state.oy += p.y - state.last.y;
                state.last = p;
                draw();
            }
        });

        const endPointer = () => {
            state.dragging = false;
            state.dragMode = null;
            canvas.classList.remove('dv-dragging');
        };
        canvas.addEventListener('pointerup', endPointer);
        canvas.addEventListener('pointercancel', endPointer);

        canvas.addEventListener('wheel', e => {
            e.preventDefault();
            const p = pointerPos(e);
            const before = { x: wx(p.x), y: wy(p.y) };
            state.scale = Math.max(20, Math.min(260, state.scale * Math.exp(-e.deltaY * 0.001)));
            state.ox = p.x - W() / 2 - before.x * state.scale;
            state.oy = p.y - H() / 2 + before.y * state.scale;
            draw();
        }, { passive: false });

        xSlider.addEventListener('input', () => {
            state.x0 = parseFloat(xSlider.value);
            updatePanel();
        });

        dxSlider.addEventListener('input', () => {
            state.dx = parseFloat(dxSlider.value);
            updatePanel();
        });

        fnSelect.addEventListener('change', () => {
            const r = current().range;
            xSlider.min = r[0];
            xSlider.max = r[1];
            state.x0 = Math.max(r[0], Math.min(r[1], state.x0));
            updatePanel();
        });

        els.centerBtn.addEventListener('click', () => {
            state.ox = 0; state.oy = 0; state.scale = 70;
            updatePanel();
        });

        els.tinyBtn.addEventListener('click', () => {
            state.dx = state.dx < 0 ? -0.08 : 0.08;
            updatePanel();
        });

        // un seul listener resize vivant a la fois
        if (resizeHandler) window.removeEventListener('resize', resizeHandler);
        resizeHandler = () => {
            if (document.getElementById('dv-graph') !== canvas) {
                window.removeEventListener('resize', resizeHandler);
                return;
            }
            resize();
        };
        window.addEventListener('resize', resizeHandler);

        resize();
        updatePanel();
    };
})();
