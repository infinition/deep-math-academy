/* eslint-disable no-console */
// Mesure la densite de chaque ensemble et les recouvrements de titres.
// Un recouvrement n'est pas une suppression a faire : les cartes, labs et
// references ont des roles pedagogiques differents.

const fs = require('fs');
const path = require('path');

const root = __dirname;
const dataDir = path.join(root, 'data');
const config = JSON.parse(fs.readFileSync(path.join(dataDir, 'courses_config.json'), 'utf8').replace(/^\uFEFF/, ''));

function plainText(html) {
    return html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&[a-z0-9#]+;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function normalize(text) {
    return plainText(text)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/^(le|la|les|un|une|des|du|de|l)\s+/, '')
        .trim();
}

function headings(html, onlyCards = false) {
    const pattern = onlyCards ? /<h3\b[^>]*>([\s\S]*?)<\/h3>/gi : /<h[1-3]\b[^>]*>([\s\S]*?)<\/h[1-3]>/gi;
    return [...html.matchAll(pattern)].map(match => plainText(match[1])).filter(Boolean);
}

const rows = [];
const titlesByCourse = new Map();

for (const [courseId, course] of Object.entries(config)) {
    let bytes = 0;
    let words = 0;
    let concepts = 0;
    const titles = [];

    for (const module of course.modules) {
        const html = fs.readFileSync(path.join(dataDir, courseId, `${module.id}.html`), 'utf8');
        const text = plainText(html);
        bytes += Buffer.byteLength(html);
        words += text ? text.split(/\s+/).length : 0;
        concepts += (html.match(/<article\b[^>]*\bqa-card\b/gi) || []).length;
        titles.push(...headings(html, courseId.endsWith('_cards')));
    }

    titlesByCourse.set(courseId, titles);
    rows.push({
        ordre: course.order,
        ensemble: courseId,
        role: course.section,
        modules: course.modules.length,
        concepts,
        mots: words,
        'ko': Math.round(bytes / 1024)
    });
}

console.log('\nAUDIT DE DENSITE — Deep Academy\n');
console.table(rows.sort((a, b) => a.ordre - b.ordre));

for (const cardCourse of ['deep_cards', 'quantum_cards']) {
    const cardTitles = titlesByCourse.get(cardCourse) || [];
    const cardIndex = new Map(cardTitles.map(title => [normalize(title), title]));
    const matches = [];

    for (const [courseId, titles] of titlesByCourse.entries()) {
        if (courseId === cardCourse || courseId.endsWith('_cards')) continue;
        for (const title of titles) {
            const key = normalize(title);
            if (key && cardIndex.has(key)) matches.push(`${cardIndex.get(key)} ↔ ${courseId}`);
        }
    }

    console.log(`\nRecouvrements de titres exacts pour ${cardCourse} (${matches.length})`);
    [...new Set(matches)].sort().forEach(match => console.log(`- ${match}`));
}

console.log('\nLecture recommandee : les cartes forment le parcours; les fondations ajoutent l’intuition visuelle; les approfondissements assurent la couverture large.');

