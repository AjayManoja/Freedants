const { spawn } = require('child_process');

const proc = spawn('cmd.exe', ['/c', 'npx', '-y', 'mcp-render'], {
  env: {
    ...process.env,
    RENDER_API_KEY: 'rnd_d2mY7Z8QHN1BBFC2e0SyjcTyMWKL'
  }
});

let output = '';

proc.stdout.on('data', (data) => {
  output += data.toString();
  if (output.includes('"id":1')) {
    console.log(output);
    proc.kill();
  }
});

const req = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/call',
  params: {
    name: 'get-owners',
    arguments: {}
  }
};

proc.stdin.write(JSON.stringify(req) + '\n');
