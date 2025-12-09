// ==========================================
// HELPERS
// ==========================================
function createFlashcard(front, back) {
    return `<div class="card-flip h-32 w-full select-none">
        <div class="card-inner">
            <div class="card-front bg-gray-50 border border-indigo-200 hover:border-indigo-400 transition-colors">
                <span class="font-bold text-indigo-800 text-lg">${front}</span>
            </div>
            <div class="card-back bg-indigo-600 text-white rounded p-2 flex items-center justify-center shadow-lg">
                <span class="text-sm font-medium leading-tight">${back}</span>
            </div>
        </div>
    </div>`;
}

function drawArrow(ctx, fromX, fromY, toX, toY, color, label) {
    const headlen = 10;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    if (label) {
        ctx.fillStyle = '#111827';
        ctx.font = "12px Arial";
        ctx.fillText(label, toX + 6, toY + 6);
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (sidebar) {
        sidebar.classList.toggle('-translate-x-full');
        if (overlay) {
            if (sidebar.classList.contains('-translate-x-full')) {
                overlay.classList.add('hidden');
            } else {
                overlay.classList.remove('hidden');
            }
        }
    }
}

// ==========================================
// GLOBAL LOGIC
// ==========================================
let currentCourse = 'analysis';
let coursesData = {};
let visitedModules = {};

// ==========================================
// APP INIT / NAV
// ==========================================
// ==========================================
// DARK MODE LOGIC
// ==========================================
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    updateDarkModeIcon();
}

function updateDarkModeIcon() {
    const btn = document.getElementById('darkModeBtn');
    if (btn) {
        const isDark = document.body.classList.contains('dark-mode');
        btn.innerText = isDark ? '☀️' : '🌙';
    }
}

// ==========================================
// APP INIT / NAV
// ==========================================
async function init() {
    // Initialize Dark Mode
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    updateDarkModeIcon();

    // 1. Charger la configuration JSON
    try {
        const response = await fetch('data/courses_config.json');
        if (!response.ok) throw new Error("Erreur de chargement de courses_config.json");
        coursesData = await response.json();

        // 2. Initialiser visitedModules (Basé sur les données JSON)
        visitedModules = {};
        for (const courseId in coursesData) {
            visitedModules[courseId] = new Set();
        }

        // 3. Remplir le sélecteur de cours HTML dynamiquement
        renderCourseSelector();

        // 4. Lancer l'application avec le cours actuel
        if (coursesData[currentCourse]) {
            const initialModules = coursesData[currentCourse].modules;
            if (initialModules.length > 0) {
                loadModule(initialModules[0].id, false); // Don't close sidebar on init
            }
        }

    } catch (error) {
        console.error("Échec de l'initialisation de l'application :", error);
        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.innerHTML = `<div class="p-8 bg-red-100 text-red-800 rounded">Erreur : Impossible de charger la configuration des cours.</div>`;
        }
    }

    document.addEventListener('click', function (e) {
        const card = e.target.closest('.card-flip');
        if (card) card.classList.toggle('card-flipped');
    });
}

function renderCourseSelector() {
    const selector = document.getElementById('courseSelector');
    if (!selector) return;

    selector.innerHTML = '';

    for (const courseId in coursesData) {
        const courseTitle = coursesData[courseId].title;
        const option = document.createElement('option');
        option.value = courseId;
        option.textContent = courseTitle;
        selector.appendChild(option);
    }
    selector.value = currentCourse;
}

function switchCourse(courseId) {
    if (!coursesData[courseId]) return;
    currentCourse = courseId;
    const selector = document.getElementById('courseSelector');
    if (selector) selector.value = courseId;
    renderNav();
    const mods = getModules();
    if (mods.length > 0) loadModule(mods[0].id, false); // Don't close sidebar on course switch
}

function getModules() {
    return coursesData[currentCourse] ? coursesData[currentCourse].modules : [];
}

function renderNav() {
    const container = document.getElementById('nav-container');
    if (!container) return;

    const mods = getModules();
    if (!visitedModules[currentCourse]) visitedModules[currentCourse] = new Set();
    const progressSet = visitedModules[currentCourse];

    let lastCategory = null;
    container.innerHTML = mods.map(m => {
        let html = '';
        if (m.category && m.category !== lastCategory) {
            html += `<div class="text-xs font-bold text-indigo-300 uppercase tracking-wider mt-6 mb-2 px-2 border-b border-indigo-700 pb-1">${m.category}</div>`;
            lastCategory = m.category;
        }
        html += `
        <button onclick="loadModule('${m.id}')" 
            class="w-full text-left px-4 py-3 rounded-lg hover:bg-indigo-800 transition flex items-center gap-3 mb-1 ${progressSet.has(m.id) ? 'bg-indigo-800 border-l-4 border-green-400 font-bold shadow-lg transform scale-[1.02]' : 'text-indigo-100 opacity-80 hover:opacity-100'}">
            <span class="text-xl filter drop-shadow-md w-6 text-center">${m.icon}</span>
            <span class="text-sm tracking-wide truncate flex-1">${m.title}</span>
            ${progressSet.has(m.id) ? '<span class="text-green-400 text-xs">✓</span>' : ''}
        </button>`;
        return html;
    }).join('');

    const pct = mods.length > 0 ? Math.round((progressSet.size / mods.length) * 100) : 0;
    const progEl = document.getElementById('course-progress');
    if (progEl) {
        progEl.innerText = pct + "%";
        progEl.className = pct === 100 ? "text-green-400 font-bold text-xl transition-all duration-500" : "font-bold text-xl transition-all duration-500";
    }
}

async function loadModule(id, closeSidebar = true) {
    const mods = getModules();
    const module = mods.find(m => m.id === id);
    if (!module) return;

    // Mobile toggle logic
    const sidebar = document.getElementById('sidebar');
    if (closeSidebar && sidebar && !sidebar.classList.contains('-translate-x-full') && window.innerWidth < 768) {
        toggleSidebar();
    }

    if (!visitedModules[currentCourse]) visitedModules[currentCourse] = new Set();
    visitedModules[currentCourse].add(id);
    renderNav();

    const chapterTitle = document.getElementById('chapter-title');
    if (chapterTitle) {
        chapterTitle.innerHTML = `<span class="bg-indigo-100 text-indigo-800 p-2 rounded-lg text-xl mr-3 shadow-sm">${module.icon}</span> ${module.title}`;
    }

    // Load content dynamically
    try {
        const response = await fetch(`data/${currentCourse}/${id}.html`);
        if (!response.ok) throw new Error(`Erreur chargement module ${id}`);
        let html = await response.text();

        // Process template literals manually (specifically for createFlashcard)
        // This regex looks for ${createFlashcard("arg1", "arg2")} pattern
        html = html.replace(/\$\{createFlashcard\((['"`])(.*?)\1,\s*(['"`])(.*?)\3\)\}/g, (match, q1, front, q2, back) => {
            return createFlashcard(front, back);
        });

        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.innerHTML = html;
            contentArea.scrollTop = 0;
        }
    } catch (err) {
        console.error(err);
        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.innerHTML = `<div class="text-red-500">Erreur de chargement du contenu.</div>`;
        }
    }

    // Retrigger MathJax (après injection)
    if (window.MathJax && MathJax.typesetPromise) {
        try {
            MathJax.typesetClear();
            MathJax.typesetPromise([document.getElementById('content-area')]).catch(err => console.warn('MathJax error:', err));
        } catch (e) {
            console.warn('MathJax synchronous error:', e);
        }
    }


    // Initialize Interactives based on ID
    // Note: These functions are defined in course.js or quantum.js
    setTimeout(() => {
        // Generic dynamic initialization from JSON config
        if (module.initFunction && typeof window[module.initFunction] === 'function') {
            console.log(`Calling init function: ${module.initFunction}`);
            window[module.initFunction]();
        }

        // Legacy hardcoded initialization (kept for backward compatibility)
        // Algebra
        if (id === 'sets' && typeof initVennCanvas === 'function') initVennCanvas();
        if (id === 'vectors' && typeof initVectorCanvas === 'function') initVectorCanvas();
        if (id === 'alg_intro' && typeof initIntroAlgCanvas === 'function') initIntroAlgCanvas();
        if (id === 'det_inv' && typeof initDetCanvas === 'function') initDetCanvas();
        if (id === 'eigen' && typeof initEigenCanvas === 'function') initEigenCanvas();
        if (id === 'linear_map' && typeof initLinearMapCanvas === 'function') initLinearMapCanvas();
        if (id === 'matrices' && typeof updateMatrixProd === 'function') updateMatrixProd();
        if (id === 'spaces' && typeof initSpacesCanvas === 'function') initSpacesCanvas();
        if (id === 'svd' && typeof initSVDCanvas === 'function') initSVDCanvas();

        // Analysis
        if (id === 'derivatives' && typeof initDerivativeCanvas === 'function') initDerivativeCanvas();
        if (id === 'gradient') typeof initGradientCanvas === 'function' && initGradientCanvas();
        if (id === 'integrals') typeof initIntegralCanvas === 'function' && initIntegralCanvas();
        if (id === 'sequences') typeof initSequenceCanvas === 'function' && initSequenceCanvas();
        if (id === 'functions') typeof initFunctionCanvas === 'function' && initFunctionCanvas();
        if (id === 'distances') typeof initDistancesCanvas === 'function' && initDistancesCanvas();
        if (id === 'ana_intro') typeof updateNeuroSim === 'function' && updateNeuroSim();

        // Stats
        if (id === 'stat_intro' && typeof initSamplingCanvas === 'function') initSamplingCanvas();
        if (id === 'descrip' && typeof initDescripCanvas === 'function') initDescripCanvas();
        if (id === 'correlation' && typeof initCorrelationCanvas === 'function') initCorrelationCanvas();
        if (id === 'proba_fond' && typeof updateBayes === 'function') updateBayes();
        if (id === 'lois_discretes' && typeof initGaltonCanvas === 'function') initGaltonCanvas();
        if (id === 'lois_continues' && typeof initNormalChart === 'function') initNormalChart();

        // Bases
        if (id === 'math_symbols' && typeof initSymbolExplorer === 'function') initSymbolExplorer();
    }, 50);
}

function resetCurrentProgress() {
    if (visitedModules[currentCourse]) {
        visitedModules[currentCourse].clear();
        renderNav();
        const mods = getModules();
        if (mods.length > 0) loadModule(mods[0].id);
    }
}

// Start
window.addEventListener('load', () => {
    init();
    // Removed redundant initial MathJax call to prevent race conditions

    // Swipe to open sidebar logic
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: false });

    document.addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;

        // Only trigger if swipe starts from the left edge (0-200px)
        if (touchStartX < 200) {
            const diffX = touchEndX - touchStartX;
            const diffY = Math.abs(touchEndY - touchStartY);

            // Check for horizontal swipe (right) with minimal vertical movement
            if (diffX > 50 && diffY < 50) {
                const sidebar = document.getElementById('sidebar');
                if (sidebar && sidebar.classList.contains('-translate-x-full')) {
                    toggleSidebar();
                }
            }
        }
    }, { passive: false });
});
