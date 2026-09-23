const { spawn } = require('child_process');

const proc = spawn('node', ['my-render-mcp.js'], {
  env: {
    ...process.env,
    RENDER_API_KEY: 'rnd_d2mY7Z8QHN1BBFC2e0SyjcTyMWKL'
  }
});

let output = '';

proc.stdout.on('data', (data) => {
  console.log(data.toString());
  proc.kill();
});

const req = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/call',
  params: {
    name: 'deploy_to_render',
    arguments: {}
  }
};

proc.stdin.write(JSON.stringify(req) + '\n');
