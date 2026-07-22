/* eslint-disable no-console */
// Verifie le chemin file:// sans lancer de navigateur ni de serveur.

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = __dirname;
let networkCalls = 0;
const sandbox = {
    console,
    TextDecoder,
    setTimeout: () => 0,
    clearTimeout: () => {},
    fetch: async () => {
        networkCalls += 1;
        throw new Error('Le mode hors ligne ne doit pas appeler fetch');
    },
    localStorage: {
        getItem: () => null,
        setItem: () => {}
    },
    document: {
        addEventListener: () => {},
        getElementById: () => null
    },
    window: {
        addEventListener: () => {},
        innerWidth: 1280
    }
};

vm.createContext(sandbox);
vm.runInContext(
    fs.readFileSync(path.join(root, 'data', 'content_bundle.js'), 'utf8'),
    sandbox,
    { filename: 'content_bundle.js' }
);
vm.runInContext(
    fs.readFileSync(path.join(root, 'js', 'global.js'), 'utf8'),
    sandbox,
    { filename: 'global.js' }
);

(async () => {
    const config = sandbox.window.DEEP_ACADEMY_DATA.config;
    const html = await vm.runInContext(
        "loadTextAsset('data/deep_cards/niveau_00.html', 'deep_cards/niveau_00')",
        sandbox
    );

    assert.strictEqual(Object.keys(config).length, 9, 'Le bundle doit contenir les 9 ensembles');
    assert.match(html, /data-qa-level="deep:0"/, 'Le niveau 0 IA doit provenir du bundle');
    assert.strictEqual(networkCalls, 0, 'Aucun fetch ne doit etre lance');
    console.log('OK — mode file:// : configuration et chapitre charges sans appel reseau.');
})().catch(error => {
    console.error(error);
    process.exitCode = 1;
});

