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
    name: 'create-service',
    arguments: {
      name: 'feedants-demo-live',
      type: 'web_service',
      ownerId: 'tea-dapn04o473hc73cagrq0',
      repo: 'https://github.com/AjayManoja/Freedants',
      branch: 'redesign-pixel-perfect',
      serviceDetails: {
        env: 'node',
        rootDir: 'server',
        buildCommand: 'cd ../mobile && npm install && npx expo export -p web && cd ../server && npm install && npm run build',
        startCommand: 'npm run demo'
      },
      envVars: [
        { key: 'DEMO_MODE', value: 'true' },
        { key: 'EXPO_PUBLIC_API_URL', value: '/api' }
      ]
    }
  }
};

proc.stdin.write(JSON.stringify(req) + '\n');
