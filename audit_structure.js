/* eslint-disable no-console */
// Audit en lecture seule : verifie qu'aucun module n'est perdu entre la
// configuration, les fichiers HTML, les fonctions interactives et les liens du hub.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = __dirname;
const dataDir = path.join(root, 'data');
const jsDir = path.join(root, 'js');
const configPath = path.join(dataDir, 'courses_config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8').replace(/^\uFEFF/, ''));
const { buildBundleSource, outputPath: bundlePath } = require('./build_content_bundle');
const errors = [];
const warnings = [];
const rows = [];
const orders = new Map();

const jsSource = fs.readdirSync(jsDir)
    .filter(file => file.endsWith('.js'))
    .map(file => fs.readFileSync(path.join(jsDir, file), 'utf8'))
    .join('\n');

for (const [courseId, course] of Object.entries(config)) {
    const modules = Array.isArray(course.modules) ? course.modules : [];
    const moduleIds = modules.map(module => module.id);
    const duplicates = moduleIds.filter((id, index) => moduleIds.indexOf(id) !== index);
    const courseDir = path.join(dataDir, courseId);
    const htmlFiles = fs.existsSync(courseDir)
        ? fs.readdirSync(courseDir).filter(file => file.endsWith('.html')).map(file => path.basename(file, '.html'))
        : [];
    const missing = moduleIds.filter(id => !htmlFiles.includes(id));
    const unlisted = htmlFiles.filter(id => !moduleIds.includes(id));
    let bytes = 0;
    let cards = 0;

    if (!course.section) warnings.push(`${courseId}: section absente`);
    if (!Number.isFinite(course.order)) warnings.push(`${courseId}: ordre absent`);
    if (Number.isFinite(course.order)) {
        if (orders.has(course.order)) errors.push(`ordre ${course.order} partage par ${orders.get(course.order)} et ${courseId}`);
        orders.set(course.order, courseId);
    }
    if (duplicates.length) errors.push(`${courseId}: ids dupliques (${[...new Set(duplicates)].join(', ')})`);
    if (!fs.existsSync(courseDir)) errors.push(`${courseId}: dossier data/${courseId} absent`);
    if (missing.length) errors.push(`${courseId}: fichiers manquants (${missing.join(', ')})`);
    if (unlisted.length) errors.push(`${courseId}: fichiers non listes (${unlisted.join(', ')})`);

    for (const module of modules) {
        const filePath = path.join(courseDir, `${module.id}.html`);
        if (fs.existsSync(filePath)) {
            const html = fs.readFileSync(filePath, 'utf8');
            bytes += Buffer.byteLength(html);
            cards += (html.match(/<article\b[^>]*\bqa-card\b/gi) || []).length;
        }
        if (module.initFunction) {
            const name = module.initFunction.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const declaration = new RegExp(`(?:window\\[['\"]${name}['\"]\\]|window\\.${name}|function\\s+${name}\\s*\\()`);
            const numberedName = module.initFunction.match(/^(.*L)\d+$/);
            const dynamicDeclaration = numberedName
                ? new RegExp(`window\\[['\"]${numberedName[1]}['\"]\\s*\\+`)
                : null;
            if (!declaration.test(jsSource) && !(dynamicDeclaration && dynamicDeclaration.test(jsSource))) {
                errors.push(`${courseId}/${module.id}: initFunction ${module.initFunction} introuvable`);
            }
        }
    }

    rows.push({
        ordre: course.order ?? '-',
        section: course.section || '-',
        cours: courseId,
        modules: modules.length,
        fichiers: htmlFiles.length,
        cartes: cards,
        ko: missing.length + unlisted.length
    });
}

const welcomePath = path.join(dataDir, 'welcome.html');
if (fs.existsSync(welcomePath)) {
    const welcome = fs.readFileSync(welcomePath, 'utf8');
    const linkPattern = /openCourseFromWelcome\(\s*['"]([^'"]+)['"]\s*(?:,\s*['"]([^'"]+)['"])?\s*\)/g;
    for (const match of welcome.matchAll(linkPattern)) {
        const [, courseId, moduleId] = match;
        if (!config[courseId]) {
            errors.push(`welcome: cours cible inconnu (${courseId})`);
        } else if (moduleId && !config[courseId].modules.some(module => module.id === moduleId)) {
            errors.push(`welcome: module cible inconnu (${courseId}/${moduleId})`);
        }
    }
}

if (!fs.existsSync(bundlePath)) {
    errors.push('data/content_bundle.js absent (executer : node build_content_bundle.js)');
} else if (fs.readFileSync(bundlePath, 'utf8') !== buildBundleSource()) {
    errors.push('data/content_bundle.js perime (executer : node build_content_bundle.js)');
} else {
    try {
        const sandbox = { window: {} };
        vm.runInNewContext(fs.readFileSync(bundlePath, 'utf8'), sandbox, { filename: bundlePath });
        const bundled = sandbox.window.DEEP_ACADEMY_DATA;
        const expectedPages = 1 + Object.values(config).reduce(
            (total, course) => total + course.modules.length,
            0
        );
        if (!bundled || !bundled.config || !bundled.pages) {
            errors.push('data/content_bundle.js ne publie pas DEEP_ACADEMY_DATA');
        } else if (Object.keys(bundled.pages).length !== expectedPages) {
            errors.push(`bundle incomplet : ${Object.keys(bundled.pages).length}/${expectedPages} pages`);
        }
    } catch (error) {
        errors.push(`bundle JavaScript invalide : ${error.message}`);
    }
}

const indexSource = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const bundleScriptPosition = indexSource.indexOf('data/content_bundle.js');
const globalScriptPosition = indexSource.indexOf('js/global.js');
if (bundleScriptPosition < 0) {
    errors.push('index.html ne charge pas data/content_bundle.js');
} else if (globalScriptPosition < 0 || bundleScriptPosition > globalScriptPosition) {
    errors.push('data/content_bundle.js doit etre charge avant js/global.js');
}

const totals = rows.reduce((sum, row) => ({
    modules: sum.modules + row.modules,
    fichiers: sum.fichiers + row.fichiers,
    cartes: sum.cartes + row.cartes
}), { modules: 0, fichiers: 0, cartes: 0 });

console.log('\nAUDIT DE STRUCTURE — Deep Academy\n');
console.table(rows.sort((a, b) => Number(a.ordre) - Number(b.ordre)));
console.log(`Total : ${Object.keys(config).length} cours, ${totals.modules} modules configures, ${totals.fichiers} fichiers HTML, ${totals.cartes} cartes conceptuelles.`);

if (warnings.length) {
    console.log('\nAVERTISSEMENTS');
    warnings.forEach(message => console.log(`- ${message}`));
}
if (errors.length) {
    console.error('\nERREURS');
    errors.forEach(message => console.error(`- ${message}`));
    process.exitCode = 1;
} else {
    console.log('\nOK — aucun module orphelin, manquant ou non branche.');
}
