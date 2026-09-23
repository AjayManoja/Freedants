const { spawn } = require('child_process');

const proc = spawn('cmd.exe', ['/c', 'npx', '-y', 'mcp-render'], {
  env: {
    ...process.env,
    RENDER_API_KEY: 'rnd_d2mY7Z8QHN1BBFC2e0SyjcTyMWKL'
  }
});

proc.stdout.on('data', (data) => {
  console.log('STDOUT:', data.toString());
});

proc.stderr.on('data', (data) => {
  console.error('STDERR:', data.toString());
});

const req = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/list'
};

proc.stdin.write(JSON.stringify(req) + '\n');

setTimeout(() => proc.kill(), 8000);
