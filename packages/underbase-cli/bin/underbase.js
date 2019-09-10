#!/usr/bin/env node
// tslint:disable: no-var-requires
'use strict';

/**
 * If `value` begins with `v8-` and is not explicitly `v8-options`, remove prefix
 * @param {string} [value] - Value to check
 * @returns {string} `value` with prefix (maybe) removed
 * @ignore
 */
const trimV8Option = value =>
  value !== 'v8-options' && /^v8-/.test(value) ? value.slice(3) : value;

if (process.argv.includes('-r') || process.argv.includes('--require')) {
  const { spawn } = require('child_process');
  const underbasePath = require.resolve('../build/src/index');

  // Parse require argument
  const requireOptIndex = process.argv.indexOf('-r')
    ? process.argv.indexOf('-r')
    : process.argv.indexOf('--require');
  const moduleToRequire = trimV8Option(process.argv[requireOptIndex + 1]);

  // Filter unwanted arguments
  const underbaseArgs = process.argv.filter(
    f =>
      ![
        process.execPath,
        __filename,
        '-r',
        '--require',
        moduleToRequire,
      ].includes(f),
  );

  const args = [].concat(
    '--require',
    moduleToRequire,
    underbasePath,
    underbaseArgs,
  );

  const proc = spawn(process.execPath, args, {
    stdio: 'inherit',
  });

  proc.on('exit', (code, signal) => {
    process.on('exit', () => {
      if (signal) {
        process.kill(process.pid, signal);
      } else {
        process.exit(code);
      }
    });
  });

  // Terminate children.
  process.on('SIGINT', () => {
    proc.kill('SIGINT'); // Calls runner.abort()
    proc.kill('SIGTERM'); // If that didn't work, we're probably in an infinite loop, so make it die.
  });
} else {
  require('../build/src/index').main();
}
