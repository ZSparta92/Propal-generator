const path = require('path');
const { spawn } = require('child_process');

process.chdir(path.resolve(__dirname));

const next = spawn(
  process.execPath,
  [path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next'), 'dev', '--port', '3000'],
  { stdio: 'inherit', cwd: __dirname }
);

next.on('exit', (code) => process.exit(code || 0));
