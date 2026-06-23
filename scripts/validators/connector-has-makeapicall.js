'use strict';

// What this validator checks
// --------------------------
// Every connector should ship a generic `MakeApiCall` component — the
// "call any endpoint" helper that lets a flow hit endpoints the connector
// does not (yet) wrap in a dedicated component. See issue #1459 for the
// component standard (the shape of that component is enforced separately by
// makeapicall-standards.js).
//
// This validator only checks PRESENCE: for every connector (a directory under
// src/appmixer that contains a service.json) it asserts that at least one
// `MakeApiCall/component.json` exists somewhere under the connector root.
//
// Scope / modes
// -------------
// A connector is only evaluated when it is "in scope" for the run, i.e. one of
// the files handed to the validator (context.bundleFiles / componentFiles)
// lives under that connector. This keeps the validator correct under:
//   • full repo run   — every connector is in scope (all files passed)
//   • --connector     — only the selected connector's files are passed
//   • --changed       — only connectors with a changed bundle/component file
//                       are checked, so unrelated missing connectors do not
//                       fail an unrelated diff. Adding a MakeApiCall bumps the
//                       connector's bundle.json, which brings it into scope and
//                       the check then passes.
//
// Where it does NOT make sense
// ----------------------------
// Some connectors have no generic authorized REST surface to call — database
// drivers (mongodb, postgres, ...), message brokers (kafka, rabbitmq),
// internal/utility connectors (utils, system), keyless/multi-module HTTP
// connectors with no connector-level credential, and OAuth1 request-signing
// connectors. Those are suppressed via scripts/validators/_ignore-list.js
// (each with a recorded reason) rather than carrying a stub component.

const fs = require('fs');
const path = require('path');

// True when `componentPath` is a `MakeApiCall/component.json`.
function isMakeApiCallComponent(componentPath) {

    return path.basename(componentPath) === 'component.json'
        && path.basename(path.dirname(componentPath)) === 'MakeApiCall';
}

// Walk `dir` looking for any MakeApiCall/component.json. Returns true on the
// first hit (no need to collect them all).
function hasMakeApiCall(dir) {

    let entries;

    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (err) {
        return false;
    }

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            if (entry.name === 'node_modules' || entry.name === '.git') continue;
            if (hasMakeApiCall(fullPath)) return true;
            continue;
        }

        if (isMakeApiCallComponent(fullPath)) return true;
    }

    return false;
}

// All connector roots = directories directly under src/appmixer that contain a
// service.json. Returns a list of absolute connector-root paths.
function discoverConnectorRoots(connectorsRoot) {

    let entries;

    try {
        entries = fs.readdirSync(connectorsRoot, { withFileTypes: true });
    } catch (err) {
        return [];
    }

    const roots = [];

    for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const root = path.join(connectorsRoot, entry.name);
        if (fs.existsSync(path.join(root, 'service.json'))) {
            roots.push(root);
        }
    }

    return roots;
}

module.exports = {
    name: 'connector-has-makeapicall',
    description: 'Every connector ships a generic MakeApiCall component (issue #1459)',
    run(context) {

        const { connectorsRoot, bundleFiles, componentFiles, addFailure } = context;

        const roots = discoverConnectorRoots(connectorsRoot);

        // A connector is in scope when any file passed to this run lives under
        // it (full run = all connectors; --changed = only touched connectors).
        const inScopeFiles = [...bundleFiles, ...componentFiles];

        for (const root of roots) {
            const prefix = root + path.sep;
            const inScope = inScopeFiles.some((filePath) => filePath.startsWith(prefix));

            if (!inScope) continue;

            if (!hasMakeApiCall(root)) {
                addFailure(
                    path.join(root, 'service.json'),
                    'connector has no MakeApiCall component — add a generic "call any endpoint" helper (issue #1459), or ignore-list it if the connector exposes no generic authorized REST API'
                );
            }
        }
    }
};
