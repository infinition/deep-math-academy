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
        ctx.font = '12px Arial';
        ctx.fillText(label, toX + 6, toY + 6);
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (!sidebar) return;
    sidebar.classList.toggle('-translate-x-full');

    if (!overlay) return;
    if (sidebar.classList.contains('-translate-x-full')) {
        overlay.classList.add('hidden');
    } else {
        overlay.classList.remove('hidden');
    }
}

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function normalizeText(text) {
    return String(text || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function stripHtmlTags(html) {
    return String(html || '')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// ==========================================
// GLOBAL LOGIC
// ==========================================
let currentCourse = 'analysis';
let coursesData = {};
let visitedModules = {};
let searchQuery = '';
let searchIndex = [];
let searchIndexReady = false;
let searchIndexLoading = false;
let searchDebounce = null;

// ==========================================
// DARK MODE
// ==========================================
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    updateDarkModeIcon();

    if (typeof window.improveInteractiveVisibility === 'function') {
        window.improveInteractiveVisibility(document.getElementById('content-area'));
    }
}

function updateDarkModeIcon() {
    const btn = document.getElementById('darkModeBtn');
    if (!btn) return;

    const isDark = document.body.classList.contains('dark-mode');
    btn.innerHTML = isDark ? '&#9728;&#65039;' : '&#127769;';
}

// ==========================================
// GLOBAL SEARCH
// ==========================================
function getCourseOrder() {
    const preferred = ['bases', 'analysis', 'algebra', 'stats', 'ml_expert', 'ai_dynamics', 'quantum'];
    const existing = Object.keys(coursesData);
    const ordered = preferred.filter(id => existing.includes(id));
    existing.forEach(id => {
        if (!ordered.includes(id)) ordered.push(id);
    });
    return ordered;
}

function updateSearchStatus() {
    const status = document.getElementById('globalSearchStatus');
    if (!status) return;

    if (!searchQuery) {
        status.innerText = searchIndexLoading
            ? 'Indexation globale en cours...'
            : 'Ctrl+K pour focaliser';
        return;
    }

    status.innerText = searchIndexReady
        ? `Resultats globaux pour "${searchQuery}"`
        : `Resultats metadata pour "${searchQuery}" (indexation en cours...)`;
}

function buildSeedSearchIndex() {
    const entries = [];
    for (const [courseId, course] of Object.entries(coursesData)) {
        const modules = Array.isArray(course.modules) ? course.modules : [];
        modules.forEach(module => {
            entries.push({
                courseId,
                courseTitle: course.title || courseId,
                moduleId: module.id,
                moduleTitle: module.title || module.id,
                category: module.category || '',
                icon: module.icon || '&bull;',
                text: '',
                preview: ''
            });
        });
    }
    return entries;
}

async function readResponseUtf8(response) {
    const buffer = await response.arrayBuffer();
    return new TextDecoder('utf-8').decode(buffer);
}

function initGlobalSearchControls() {
    const input = document.getElementById('globalSearchInput');
    const clearBtn = document.getElementById('globalSearchClear');
    if (!input) return;

    input.addEventListener('input', (e) => {
        const value = e.target.value || '';
        if (searchDebounce) clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
            searchQuery = value.trim();
            updateSearchStatus();
            renderNav();
        }, 90);

        if (clearBtn) {
            clearBtn.classList.toggle('hidden', !value.trim());
        }
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            input.value = '';
            searchQuery = '';
            clearBtn.classList.add('hidden');
            updateSearchStatus();
            renderNav();
            input.focus();
        });
    }

    document.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            input.focus();
            input.select();
        }
        if (event.key === 'Escape' && document.activeElement === input) {
            input.blur();
        }
    });

    updateSearchStatus();
}

async function buildGlobalSearchIndex() {
    if (searchIndexLoading || searchIndexReady) return;
    searchIndexLoading = true;
    updateSearchStatus();

    const tasks = searchIndex.map(async (entry) => {
        try {
            const response = await fetch(`data/${entry.courseId}/${entry.moduleId}.html`);
            if (!response.ok) return;
            const html = await readResponseUtf8(response);
            const text = stripHtmlTags(html);
            entry.text = text;
            entry.preview = text.slice(0, 220);
        } catch (error) {
            console.warn(`Search index: failed ${entry.courseId}/${entry.moduleId}`, error);
        }
    });

    await Promise.all(tasks);
    searchIndexReady = true;
    searchIndexLoading = false;
    updateSearchStatus();
    if (searchQuery) renderNav();
}

function scoreSearchEntry(entry, tokens, fullQuery) {
    const title = normalizeText(entry.moduleTitle);
    const category = normalizeText(entry.category);
    const course = normalizeText(entry.courseTitle);
    const text = normalizeText(entry.text);
    const id = normalizeText(entry.moduleId);

    let score = 0;
    if (title.includes(fullQuery)) score += 140;
    if (category.includes(fullQuery)) score += 70;
    if (course.includes(fullQuery)) score += 45;
    if (id.includes(fullQuery)) score += 40;
    if (text.includes(fullQuery)) score += 18;

    tokens.forEach(token => {
        if (title.includes(token)) score += 30;
        if (category.includes(token)) score += 20;
        if (course.includes(token)) score += 14;
        if (id.includes(token)) score += 10;
        if (text.includes(token)) score += 6;
    });

    if (!score) return null;
    return { ...entry, score };
}

function computeSearchResults(query) {
    if (!query) return [];
    const fullQuery = normalizeText(query);
    const tokens = fullQuery.split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];

    const scored = searchIndex
        .map(entry => scoreSearchEntry(entry, tokens, fullQuery))
        .filter(Boolean)
        .sort((a, b) => b.score - a.score)
        .slice(0, 25);

    return scored;
}

function renderSearchResults(container) {
    const results = computeSearchResults(searchQuery);

    if (!results.length) {
        container.innerHTML = `
            <div class="rounded-lg border border-indigo-700 bg-indigo-900/60 p-3 text-xs text-indigo-200">
                Aucun resultat pour <span class="font-bold">${escapeHtml(searchQuery)}</span>.
            </div>
        `;
        return;
    }

    container.innerHTML = results.map(item => {
        const preview = item.preview
            ? `<div class="mt-1 text-[11px] text-indigo-200/80 line-clamp-2">${escapeHtml(item.preview)}</div>`
            : '';

        return `
            <button onclick="openSearchResult('${item.courseId}','${item.moduleId}')"
                class="w-full text-left px-3 py-3 rounded-lg bg-indigo-900/50 hover:bg-indigo-800 border border-indigo-700/60 transition mb-2">
                <div class="flex items-center gap-2">
                    <span class="text-base w-5 text-center">${item.icon}</span>
                    <span class="text-sm font-semibold text-white truncate flex-1">${escapeHtml(item.moduleTitle)}</span>
                </div>
                <div class="mt-1 text-[11px] uppercase tracking-wide text-cyan-300">${escapeHtml(item.courseTitle)}${item.category ? ` | ${escapeHtml(item.category)}` : ''}</div>
                ${preview}
            </button>
        `;
    }).join('');
}

function clearSearchQuery() {
    searchQuery = '';
    const input = document.getElementById('globalSearchInput');
    const clearBtn = document.getElementById('globalSearchClear');
    if (input) input.value = '';
    if (clearBtn) clearBtn.classList.add('hidden');
    updateSearchStatus();
}

window.openSearchResult = function (courseId, moduleId) {
    if (!coursesData[courseId]) return;
    switchCourse(courseId, true);
    loadModule(moduleId, true);
};

window.openCourseFromWelcome = function (courseId, moduleId) {
    if (!coursesData[courseId]) return;
    switchCourse(courseId, true);
    const modules = coursesData[courseId].modules || [];
    const targetId = moduleId && modules.some(m => m.id === moduleId)
        ? moduleId
        : (modules[0] ? modules[0].id : null);
    if (targetId) {
        loadModule(targetId, true);
    }
};

window.enterAppAndOpenCourse = function (courseId, moduleId) {
    enterApp();
    setTimeout(() => {
        window.openCourseFromWelcome(courseId, moduleId);
    }, 140);
};

// ==========================================
// APP INIT / NAV
// ==========================================
async function init() {
    if (localStorage.getItem('darkMode') === null || localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
    }
    updateDarkModeIcon();

    try {
        const response = await fetch('data/courses_config.json');
        if (!response.ok) throw new Error('Erreur de chargement de courses_config.json');
        const configText = await readResponseUtf8(response);
        const sanitizedConfigText = configText.replace(/^\uFEFF/, '');
        coursesData = JSON.parse(sanitizedConfigText);

        visitedModules = {};
        for (const courseId in coursesData) {
            visitedModules[courseId] = new Set();
        }

        if (!coursesData[currentCourse]) {
            const first = Object.keys(coursesData)[0];
            if (first) currentCourse = first;
        }

        searchIndex = buildSeedSearchIndex();

        renderCourseSelector();
        initGlobalSearchControls();
        renderNav();
        loadWelcome();
        buildGlobalSearchIndex();
    } catch (error) {
        console.error("Echec de l'initialisation de l'application:", error);
        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.innerHTML = `<div class="p-8 bg-red-100 text-red-800 rounded">Erreur : impossible de charger la configuration des cours.</div>`;
        }
    }

    document.addEventListener('click', function (event) {
        const card = event.target.closest('.card-flip');
        if (card) card.classList.toggle('card-flipped');
    });
}

function renderCourseSelector() {
    const wrapper = document.getElementById('courseSelectorWrapper');
    if (!wrapper) return;

    const currentCourseData = coursesData[currentCourse] || { title: 'Selectionner', icon: '&#128218;' };

    let html = `
        <button onclick="toggleCourseMenu()"
            class="w-full mt-2 bg-indigo-700/50 hover:bg-indigo-700 border border-indigo-600 rounded-lg text-white p-3 flex items-center justify-between transition-all duration-300 group">
            <span class="font-bold text-sm truncate mr-2">${currentCourseData.title}</span>
            <svg id="course-chevron" class="w-4 h-4 text-indigo-300 transition-transform duration-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
        </button>

        <div id="course-menu"
            class="hidden absolute top-full left-0 w-full mt-2 bg-indigo-800/95 backdrop-blur-md border border-indigo-600 rounded-xl shadow-2xl overflow-hidden transform origin-top transition-all duration-200 z-50">
            <div class="py-1 max-h-64 overflow-y-auto custom-scrollbar">
    `;

    getCourseOrder().forEach(courseId => {
        if (!coursesData[courseId]) return;

        const course = coursesData[courseId];
        const isSelected = courseId === currentCourse;
        const bgClass = isSelected ? 'bg-indigo-600' : 'hover:bg-indigo-700/50';

        html += `
            <button onclick="switchCourse('${courseId}')"
                class="w-full text-left px-4 py-3 text-sm font-medium text-white transition-colors flex items-center gap-3 ${bgClass}">
                <span>${course.title}</span>
                ${isSelected ? '<span class="ml-auto text-indigo-300">&#10003;</span>' : ''}
            </button>
        `;
    });

    html += `
            </div>
        </div>
    `;

    wrapper.innerHTML = html;
}

function toggleCourseMenu() {
    const menu = document.getElementById('course-menu');
    const chevron = document.getElementById('course-chevron');

    if (menu) {
        menu.classList.toggle('hidden');
        if (!menu.classList.contains('hidden')) {
            menu.classList.add('animate-fade-in-down');
        }
    }

    if (chevron) chevron.classList.toggle('rotate-180');
}

document.addEventListener('click', (event) => {
    const wrapper = document.getElementById('courseSelectorWrapper');
    const menu = document.getElementById('course-menu');
    const chevron = document.getElementById('course-chevron');

    if (wrapper && !wrapper.contains(event.target) && menu && !menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
        if (chevron) chevron.classList.remove('rotate-180');
    }
});

function switchCourse(courseId, preserveSearch = false) {
    if (!coursesData[courseId]) return;

    const menu = document.getElementById('course-menu');
    const chevron = document.getElementById('course-chevron');
    if (menu && !menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
        if (chevron) chevron.classList.remove('rotate-180');
    }

    currentCourse = courseId;

    if (!preserveSearch) {
        clearSearchQuery();
    }

    renderCourseSelector();
    renderNav();

    const modules = coursesData[courseId].modules || [];
    if (modules.length > 0) {
        loadModule(modules[0].id, false);
    }
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

    if (searchQuery) {
        renderSearchResults(container);
    } else {
        let lastCategory = null;
        container.innerHTML = mods.map(module => {
            let html = '';
            if (module.category && module.category !== lastCategory) {
                html += `<div class="text-xs font-bold text-indigo-300 uppercase tracking-wider mt-6 mb-2 px-2 border-b border-indigo-700 pb-1">${module.category}</div>`;
                lastCategory = module.category;
            }

            html += `
                <button onclick="loadModule('${module.id}')"
                    class="w-full text-left px-4 py-3 rounded-lg hover:bg-indigo-800 transition flex items-center gap-3 mb-1 ${progressSet.has(module.id) ? 'bg-indigo-800 border-l-4 border-green-400 font-bold shadow-lg transform scale-[1.02]' : 'text-indigo-100 opacity-80 hover:opacity-100'}">
                    <span class="text-xl filter drop-shadow-md w-6 text-center">${module.icon}</span>
                    <span class="text-sm tracking-wide truncate flex-1">${module.title}</span>
                    ${progressSet.has(module.id) ? '<span class="text-green-400 text-xs">&#10003;</span>' : ''}
                </button>
            `;

            return html;
        }).join('');
    }

    const pct = mods.length > 0 ? Math.round((progressSet.size / mods.length) * 100) : 0;
    const progEl = document.getElementById('course-progress');
    if (progEl) {
        progEl.innerText = `${pct}%`;
        progEl.className = pct === 100
            ? 'text-green-400 font-bold text-xl transition-all duration-500'
            : 'font-bold text-xl transition-all duration-500';
    }
}

async function loadModule(id, closeSidebar = true) {
    const mods = getModules();
    const module = mods.find(item => item.id === id);
    if (!module) return;

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

    try {
        const response = await fetch(`data/${currentCourse}/${id}.html`);
        if (!response.ok) throw new Error(`Erreur chargement module ${id}`);

        let html = await readResponseUtf8(response);

        html = html.replace(/\$\{createFlashcard\((['"`])(.*?)\1,\s*(['"`])(.*?)\3\)\}/g, (match, q1, front, q2, back) => {
            return createFlashcard(front, back);
        });

        if (typeof window.prepareLatexSourceBlocks === 'function') {
            html = window.prepareLatexSourceBlocks(html);
        }

        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.innerHTML = html;

            if (typeof window.enhanceModulePedagogy === 'function') {
                window.enhanceModulePedagogy({
                    moduleId: id,
                    courseId: currentCourse,
                    title: module.title,
                    interactive: module.interactive
                });
            }

            if (typeof window.improveInteractiveVisibility === 'function') {
                window.improveInteractiveVisibility(contentArea);
            }

            if (typeof window.bindLatexEyeInteractions === 'function') {
                window.bindLatexEyeInteractions(contentArea);
            }

            contentArea.scrollTop = 0;
        }
    } catch (error) {
        console.error(error);
        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.innerHTML = `<div class="text-red-500">Erreur de chargement du contenu.</div>`;
        }
    }

    if (window.MathJax && MathJax.typesetPromise) {
        try {
            MathJax.typesetClear();
            await MathJax.typesetPromise([document.getElementById('content-area')]);
            if (typeof window.bindLatexEyeInteractions === 'function') {
                window.bindLatexEyeInteractions(document.getElementById('content-area'));
            }
        } catch (error) {
            console.warn('MathJax error:', error);
        }
    }

    setTimeout(() => {
        const safeCall = (fnName, shouldRun = true) => {
            if (!shouldRun || !fnName) return;
            const fn = window[fnName];
            if (typeof fn !== 'function') return;
            try {
                fn();
            } catch (error) {
                console.error(`[Init error] ${fnName}`, error);
            }
        };

        safeCall(module.initFunction, Boolean(module.initFunction));

        // Algebra
        safeCall('initVennCanvas', id === 'sets');
        safeCall('initVectorCanvas', id === 'vectors');
        safeCall('initIntroAlgCanvas', id === 'alg_intro');
        safeCall('initDetCanvas', id === 'det_inv');
        safeCall('initEigenCanvas', id === 'eigen');
        safeCall('initLinearMapCanvas', id === 'linear_map');
        safeCall('updateMatrixProd', id === 'matrices');
        safeCall('initSpacesCanvas', id === 'spaces');
        safeCall('initSVDCanvas', id === 'svd');

        // Analysis
        safeCall('initDerivativeCanvas', id === 'derivatives');
        safeCall('initGradientCanvas', id === 'gradient');
        safeCall('initIntegralCanvas', id === 'integrals');
        safeCall('initSequenceCanvas', id === 'sequences');
        safeCall('initFunctionCanvas', id === 'functions');
        safeCall('initDistancesCanvas', id === 'distances');
        safeCall('updateNeuroSim', id === 'ana_intro');

        // Stats
        safeCall('initSamplingCanvas', id === 'stat_intro');
        safeCall('initDescripCanvas', id === 'descrip');
        safeCall('initCorrelationCanvas', id === 'correlation');
        safeCall('updateBayes', id === 'proba_fond');
        safeCall('initGaltonCanvas', id === 'lois_discretes');
        safeCall('initNormalChart', id === 'lois_continues');

        // Bases
        safeCall('initSymbolExplorer', id === 'math_symbols');

        if (typeof window.improveInteractiveVisibility === 'function') {
            window.improveInteractiveVisibility(document.getElementById('content-area'));
        }
    }, 50);
}

async function loadWelcome() {
    renderNav();

    const chapterTitle = document.getElementById('chapter-title');
    if (chapterTitle) {
        chapterTitle.innerHTML = `<span class="text-2xl mr-2">&#128075;</span> Bienvenue`;
    }

    try {
        const response = await fetch('data/welcome.html');
        if (!response.ok) throw new Error('Erreur chargement welcome.html');

        const html = await readResponseUtf8(response);
        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.innerHTML = html;
            contentArea.scrollTop = 0;
            if (typeof window.improveInteractiveVisibility === 'function') {
                window.improveInteractiveVisibility(contentArea);
            }
        }
    } catch (error) {
        console.error(error);
    }
}

function resetCurrentProgress() {
    if (!visitedModules[currentCourse]) return;

    visitedModules[currentCourse].clear();
    renderNav();

    const mods = getModules();
    if (mods.length > 0) {
        loadModule(mods[0].id);
    }
}

// ==========================================
// BOOT
// ==========================================
window.addEventListener('load', () => {
    init();

    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', event => {
        touchStartX = event.changedTouches[0].screenX;
        touchStartY = event.changedTouches[0].screenY;
    }, { passive: false });

    document.addEventListener('touchend', event => {
        const touchEndX = event.changedTouches[0].screenX;
        const touchEndY = event.changedTouches[0].screenY;

        if (touchStartX < 200) {
            const diffX = touchEndX - touchStartX;
            const diffY = Math.abs(touchEndY - touchStartY);
            if (diffX > 50 && diffY < 50) {
                const sidebar = document.getElementById('sidebar');
                if (sidebar && sidebar.classList.contains('-translate-x-full')) {
                    toggleSidebar();
                }
            }
        }
    }, { passive: false });
});

// ==========================================
// QUIZ LOGIC
// ==========================================
function startQuizSession(quizId) {
    console.log(`Starting quiz session for: ${quizId}`);

    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');

    if (toast && toastMsg) {
        toastMsg.innerText = 'Quiz functionality coming soon!';
        toast.classList.remove('translate-y-32');
        setTimeout(() => {
            toast.classList.add('translate-y-32');
        }, 3000);
    } else {
        alert('Quiz functionality coming soon!');
    }
}

// ==========================================
// HOME SCREEN
// ==========================================
function enterApp() {
    const home = document.getElementById('home-screen');
    if (!home) return;

    home.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => {
        home.style.display = 'none';
    }, 1000);
}

window.addEventListener('load', () => {
    const canvas = document.getElementById('home-bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width;
    let height;
    const particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.color = `rgba(${100 + Math.random() * 100}, ${100 + Math.random() * 100}, 255, ${Math.random() * 0.5})`;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                this.reset();
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 100; i += 1) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = 'rgba(100, 100, 255, 0.05)';
        ctx.lineWidth = 1;

        for (let i = 0; i < particles.length; i += 1) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j += 1) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
});



