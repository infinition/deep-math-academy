/* eslint-disable no-console */
// Genere le bundle utilise quand index.html est ouvert directement en file://.
// Les fichiers data/*.html et courses_config.json restent l'unique source de verite.

const fs = require('fs');
const path = require('path');

const root = __dirname;
const dataDir = path.join(root, 'data');
const outputPath = path.join(dataDir, 'content_bundle.js');

function buildPayload() {
    const config = JSON.parse(
        fs.readFileSync(path.join(dataDir, 'courses_config.json'), 'utf8').replace(/^\uFEFF/, '')
    );
    const pages = {
        welcome: fs.readFileSync(path.join(dataDir, 'welcome.html'), 'utf8')
    };

    for (const [courseId, course] of Object.entries(config)) {
        for (const module of course.modules || []) {
            pages[`${courseId}/${module.id}`] = fs.readFileSync(
                path.join(dataDir, courseId, `${module.id}.html`),
                'utf8'
            );
        }
    }

    return { config, pages };
}

function buildBundleSource() {
    return `// Fichier genere par build_content_bundle.js — ne pas modifier a la main.\nwindow.DEEP_ACADEMY_DATA=${JSON.stringify(buildPayload())};\n`;
}

if (require.main === module) {
    const source = buildBundleSource();
    fs.writeFileSync(outputPath, source, 'utf8');
    console.log(`Bundle genere : data/content_bundle.js (${Math.round(Buffer.byteLength(source) / 1024)} Ko)`);
}

module.exports = { buildBundleSource, buildPayload, outputPath };

