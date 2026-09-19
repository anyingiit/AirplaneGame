'use strict';

// A real smoke test for a repository that ships no test suite of its own.
//
// AirplaneGame has no test framework, no test files and no `test` script
// (package.json's only scripts are `dev`, `build` and `start`). Its build is
// a webpack bundle that pulls in pixi.js and copies `src/assets` alongside
// it, so the thing worth asserting is that the bundle CI just built is the
// real bundle, not an empty or broken one: the entry point still imports
// pixi.js, and the assets copy step still ran.
//
// This runs after `yarn build` and fails with a specific reason whenever the
// build silently produced nothing useful.

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');

assert.ok(
  fs.existsSync(distDir),
  'dist/ does not exist -- `yarn build` must run before this smoke test'
);

const distFiles = fs.readdirSync(distDir);
const bundle = distFiles.find((name) => /^bundle\.[0-9a-f]+\.js$/.test(name));
assert.ok(
  bundle,
  `no bundle.<hash>.js in dist/ (found: ${distFiles.join(', ') || 'nothing'}) -- ` +
    'webpack.config.js names this pattern as its output.filename'
);

const bundlePath = path.join(distDir, bundle);
const bundleSize = fs.statSync(bundlePath).size;
assert.ok(
  bundleSize > 50000,
  `dist/${bundle} is only ${bundleSize} bytes -- that is too small to be pixi.js ` +
    'plus the game code, which means src/js/index.ts failed to import its dependency'
);

const bundleSource = fs.readFileSync(bundlePath, 'utf8');
assert.ok(
  /pixi/i.test(bundleSource),
  `dist/${bundle} never mentions pixi.js -- the game's one runtime dependency is missing from the build`
);

assert.ok(
  fs.existsSync(path.join(distDir, 'index.html')),
  'dist/index.html was not generated -- HtmlWebpackPlugin should emit it from src/index.html'
);

const assetsDir = path.join(distDir, 'assets');
assert.ok(
  fs.existsSync(assetsDir) && fs.statSync(assetsDir).isDirectory(),
  'dist/assets was not copied -- CopyWebpackPlugin should mirror src/assets into it'
);
assert.ok(
  fs.readdirSync(assetsDir).some((name) => name.endsWith('.png')),
  'dist/assets exists but has no .png files -- the sprite images did not get copied'
);

console.log(`smoke test passed: dist/${bundle} is ${bundleSize} bytes, mentions pixi.js, and dist/assets holds sprite images`);
