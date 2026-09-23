const readline = require('readline');

const API_KEY = process.env.RENDER_API_KEY;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', async (line) => {
  if (!line) return;
  const msg = JSON.parse(line);
  if (msg.method === 'tools/list') {
    process.stdout.write(JSON.stringify({
      jsonrpc: '2.0',
      id: msg.id,
      result: {
        tools: [{
          name: 'deploy_to_render',
          description: 'Deploy to Render',
          inputSchema: { type: 'object', properties: {} }
        }]
      }
    }) + '\n');
  } else if (msg.method === 'tools/call' && msg.params.name === 'deploy_to_render') {
    try {
      const res = await fetch('https://api.render.com/v1/services', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'feedants-demo-app',
          type: 'web_service',
          ownerId: 'tea-dapn04o473hc73cagrq0',
          repo: 'https://github.com/AjayManoja/Freedants',
          branch: 'redesign-pixel-perfect',
          autoDeploy: 'yes',
          serviceDetails: {
            env: 'node',
            envSpecificDetails: {
              buildCommand: 'cd mobile && npm install && npx expo export -p web && cd ../server && npm install && npm run build',
              startCommand: 'cd server && npm run demo'
            }
          },
          envVars: [
            { key: 'DEMO_MODE', value: 'true' },
            { key: 'EXPO_PUBLIC_API_URL', value: '/api' }
          ]
        })
      });
      const data = await res.json();
      process.stdout.write(JSON.stringify({
        jsonrpc: '2.0',
        id: msg.id,
        result: {
          content: [{ type: 'text', text: 'Deployment successful: ' + JSON.stringify(data) }]
        }
      }) + '\n');
    } catch(e) {
      process.stdout.write(JSON.stringify({
        jsonrpc: '2.0',
        id: msg.id,
        result: { content: [{ type: 'text', text: 'Error: ' + e.message }] }
      }) + '\n');
    }
  }
});
