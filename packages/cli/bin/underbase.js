#!/usr/bin/env node

/* tslint:disable */

// speed up `underbase --version`
if (
  ['v', 'version', '-v', '--v', '-version', '--version'].includes(
    process.argv[2],
  )
) {
  const contents = require('fs').readFileSync(`${__dirname}/../package.json`);
  const package = JSON.parse(contents);
  console.log(package.version);
  process.exit(0);
}

if (process.argv.includes('-r') || process.argv.includes('--require')) {
  const { spawn } = require('child_process');
  const underbasePath = require.resolve(`${__dirname}/../build/src/index`);

  // Parse require argument
  const requireOptIndex = process.argv.indexOf('-r')
    ? process.argv.indexOf('-r')
    : process.argv.indexOf('--require');
  const moduleToRequire = process.argv[requireOptIndex + 1];

  // Filter unwanted arguments
  const underbaseArgs = process.argv.filter(
    f =>
      [
        process.execPath,
        __filename,
        '-r',
        '--require',
        moduleToRequire,
      ].indexOf(f) < 0,
  );

  const args = [].concat(
    '--require',
    moduleToRequire,
    underbasePath,
    underbaseArgs,
  );

  // Launch app
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
  require(`${__dirname}/../build/src/index`);
}
