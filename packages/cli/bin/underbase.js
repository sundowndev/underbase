#!/usr/bin/env node

/* tslint:disable */

const exit = (code = 0) => process.exit(code);

// speed up `underbase --version`
if (['v', 'version', '-v', '--version'].includes(process.argv[2])) {
  const fs = require('fs');
  const contents = fs.readFileSync(`${__dirname}/../package.json`);
  const packageJson = JSON.parse(contents);
  console.log(packageJson.version);
  exit();
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
  const underbaseArgs = process.argv
    .slice(2)
    .filter(
      f => ![process.execPath, '-r', '--require', moduleToRequire].includes(f),
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
        exit(code);
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
