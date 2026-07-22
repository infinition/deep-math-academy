// ==========================================
// HELPERS
// ==========================================

// Theme-aware color helper for canvas drawing
function isDarkMode() {
    return document.body.classList.contains('dark-mode');
}

function canvasColors() {
    const dark = isDarkMode();
    return {
        bg: dark ? '#0f172a' : '#ffffff',
        grid: dark ? '#334155' : '#e5e7eb',
        axis: dark ? '#94a3b8' : '#9ca3af',
        text: dark ? '#e2e8f0' : '#111827',
        textMuted: dark ? '#94a3b8' : '#6b7280',
        gridFaint: dark ? '#1e293b' : '#f3f4f6',
        labelBg: dark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        white: dark ? '#e2e8f0' : '#ffffff',
    };
}

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
        ctx.fillStyle = isDarkMode() ? '#e2e8f0' : '#111827';
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
let currentCourse = 'deep_cards';
let currentModuleId = null;
let coursesData = {};
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
const COURSE_SECTIONS = [
    {
        id: 'parcours',
        title: 'Parcours guidés',
        description: 'À suivre dans l’ordre, du débutant à l’expert.'
    },
    {
        id: 'fondations',
        title: 'Fondations interactives',
        description: 'Pour comprendre et manipuler chaque brique mathématique.'
    },
    {
        id: 'approfondissements',
        title: 'Labs & références',
        description: 'Pour approfondir un sujet précis sans refaire tout le parcours.'
    }
];

function getCourseOrder() {
    return Object.keys(coursesData).sort((a, b) => {
        const orderA = Number.isFinite(coursesData[a].order) ? coursesData[a].order : Number.MAX_SAFE_INTEGER;
        const orderB = Number.isFinite(coursesData[b].order) ? coursesData[b].order : Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
    });
}

function getCourseGroups() {
    const ordered = getCourseOrder();
    const knownSections = COURSE_SECTIONS.map(section => ({
        ...section,
        courseIds: ordered.filter(courseId => coursesData[courseId].section === section.id)
    })).filter(section => section.courseIds.length);

    const ungrouped = ordered.filter(courseId =>
        !COURSE_SECTIONS.some(section => section.id === coursesData[courseId].section)
    );

    if (ungrouped.length) {
        knownSections.push({
            id: 'autres',
            title: 'Autres contenus',
            description: 'Modules complémentaires.',
            courseIds: ungrouped
        });
    }

    return knownSections;
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

function getBundledContent(key) {
    const pages = window.DEEP_ACADEMY_DATA && window.DEEP_ACADEMY_DATA.pages;
    return pages && typeof pages[key] === 'string' ? pages[key] : null;
}

async function loadTextAsset(url, bundleKey) {
    const bundled = getBundledContent(bundleKey);
    if (bundled !== null) return bundled;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erreur de chargement : ${url}`);
    return readResponseUtf8(response);
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
            const html = await loadTextAsset(
                `data/${entry.courseId}/${entry.moduleId}.html`,
                `${entry.courseId}/${entry.moduleId}`
            );
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
            <div class="rounded-lg border border-zinc-800 bg-zinc-800/60 p-3 text-xs text-zinc-300">
                Aucun resultat pour <span class="font-bold">${escapeHtml(searchQuery)}</span>.
            </div>
        `;
        return;
    }

    container.innerHTML = results.map(item => {
        const preview = item.preview
            ? `<div class="mt-1 text-[11px] text-zinc-400 line-clamp-2">${escapeHtml(item.preview)}</div>`
            : '';

        return `
            <button onclick="openSearchResult('${item.courseId}','${item.moduleId}')"
                class="w-full text-left px-3 py-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/60 transition mb-2">
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
    // autoLoadFirst=false : sinon switchCourse lance le chargement du 1er module
    // en parallele du notre, et c'est le fetch le plus lent qui gagne le DOM.
    switchCourse(courseId, true, false);
    loadModule(moduleId, true);
};

window.openCourseFromWelcome = function (courseId, moduleId) {
    if (!coursesData[courseId]) return;
    switchCourse(courseId, true, false);
    const modules = coursesData[courseId].modules || [];
    const targetId = moduleId && modules.some(m => m.id === moduleId)
        ? moduleId
        : (modules[0] ? modules[0].id : null);
    if (targetId) {
        loadModule(targetId, true);
    }
};

// Les raccourcis sont derives de courses_config.json et regroupes par usage :
// parcours progressifs, fondations interactives, puis labs et references.
function renderHomeCourses() {
    const container = document.getElementById('home-courses');
    if (!container) return;

    container.innerHTML = getCourseGroups().map(section => {
        const buttons = section.courseIds.map(courseId => {
            const course = coursesData[courseId];
            const modules = course.modules || [];
            if (!modules.length) return '';

            return `
                <button onclick="enterAppAndOpenCourse('${courseId}','${modules[0].id}')"
                    class="w-full px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm text-left transition">
                    ${escapeHtml(course.title)}
                </button>
            `;
        }).join('');

        return `
            <div class="rounded-xl border border-white/10 bg-black/10 p-3">
                <div class="text-[11px] uppercase tracking-wider text-cyan-300 font-bold mb-2">${escapeHtml(section.title)}</div>
                <div class="space-y-2">${buttons}</div>
            </div>
        `;
    }).join('');
}

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
        const bundledConfig = window.DEEP_ACADEMY_DATA && window.DEEP_ACADEMY_DATA.config;
        if (bundledConfig) {
            coursesData = bundledConfig;
        } else {
            const configText = await loadTextAsset('data/courses_config.json', '__config__');
            coursesData = JSON.parse(configText.replace(/^\uFEFF/, ''));
        }

        if (!coursesData[currentCourse]) {
            const first = Object.keys(coursesData)[0];
            if (first) currentCourse = first;
        }

        searchIndex = buildSeedSearchIndex();

        renderCourseSelector();
        renderHomeCourses();
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
            class="w-full mt-2 bg-zinc-700/60 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-white p-3 flex items-center justify-between transition-all duration-300 group">
            <span class="font-bold text-sm truncate mr-2">${currentCourseData.title}</span>
            <svg id="course-chevron" class="w-4 h-4 text-zinc-400 transition-transform duration-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
        </button>

        <div id="course-menu"
            class="hidden absolute top-full left-0 w-full mt-2 bg-zinc-800/95 backdrop-blur-md border border-zinc-700 rounded-xl shadow-2xl overflow-hidden transform origin-top transition-all duration-200 z-50">
            <div class="py-1 max-h-96 overflow-y-auto custom-scrollbar">
    `;

    getCourseGroups().forEach(section => {
        html += `<div class="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-300">${escapeHtml(section.title)}</div>`;

        section.courseIds.forEach(courseId => {
            const course = coursesData[courseId];
            const isSelected = courseId === currentCourse;
            const bgClass = isSelected ? 'bg-zinc-700' : 'hover:bg-zinc-700/60';

            html += `
                <button onclick="switchCourse('${courseId}')"
                    class="w-full text-left px-4 py-2.5 text-sm font-medium text-white transition-colors flex items-center gap-3 ${bgClass}"
                    title="${escapeHtml(course.summary || course.title)}">
                    <span>${course.title}</span>
                    ${isSelected ? '<span class="ml-auto text-cyan-300">&#10003;</span>' : ''}
                </button>
            `;
        });
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

function switchCourse(courseId, preserveSearch = false, autoLoadFirst = true) {
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
    if (autoLoadFirst && modules.length > 0) {
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

    if (searchQuery) {
        renderSearchResults(container);
        return;
    }

    let lastCategory = null;
    container.innerHTML = mods.map(module => {
        let html = '';
        if (module.category && module.category !== lastCategory) {
            html += `<div class="text-xs font-bold text-zinc-400 uppercase tracking-wider mt-6 mb-2 px-2 border-b border-zinc-800 pb-1">${module.category}</div>`;
            lastCategory = module.category;
        }

        // Repere de navigation : le module ouvert, pas une progression.
        const isCurrent = module.id === currentModuleId;

        html += `
            <button onclick="loadModule('${module.id}')"
                class="w-full text-left px-4 py-3 rounded-lg hover:bg-zinc-800 transition flex items-center gap-3 mb-1 ${isCurrent ? 'bg-zinc-800 border-l-4 border-cyan-400 font-bold shadow-lg' : 'text-zinc-100 opacity-80 hover:opacity-100'}">
                <span class="text-xl filter drop-shadow-md w-6 text-center">${module.icon}</span>
                <span class="text-sm tracking-wide truncate flex-1">${module.title}</span>
            </button>
        `;

        return html;
    }).join('');
}

async function loadModule(id, closeSidebar = true) {
    const mods = getModules();
    const module = mods.find(item => item.id === id);
    if (!module) return;

    const sidebar = document.getElementById('sidebar');
    if (closeSidebar && sidebar && !sidebar.classList.contains('-translate-x-full') && window.innerWidth < 768) {
        toggleSidebar();
    }

    currentModuleId = id;
    renderNav();

    const chapterTitle = document.getElementById('chapter-title');
    if (chapterTitle) {
        chapterTitle.innerHTML = `<span class="bg-indigo-100 text-indigo-800 p-2 rounded-lg text-xl mr-3 shadow-sm">${module.icon}</span> ${module.title}`;
    }

    try {
        let html = await loadTextAsset(
            `data/${currentCourse}/${id}.html`,
            `${currentCourse}/${id}`
        );

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
    currentModuleId = null;
    renderNav();

    const chapterTitle = document.getElementById('chapter-title');
    if (chapterTitle) {
        chapterTitle.innerHTML = `<span class="text-2xl mr-2">&#128075;</span> Bienvenue`;
    }

    try {
        const html = await loadTextAsset('data/welcome.html', 'welcome');
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
            // teintes neutres a cyan, accordees au logo cerveau
            const t = Math.random();
            this.color = `rgba(${Math.round(120 + t * 40)}, ${Math.round(180 + t * 40)}, ${Math.round(190 + t * 50)}, ${Math.random() * 0.45})`;
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
        ctx.strokeStyle = 'rgba(140, 190, 200, 0.05)';
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



