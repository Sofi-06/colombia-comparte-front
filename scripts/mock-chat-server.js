const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/chat') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        if (data.action === 'initial') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ messages: ['Hola — respuesta inicial del mock.'] }));
        }

        const message = data.message || '';
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ reply: `Mock respuesta: ${message}` }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'invalid json' }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found' }));
});

const PORT = 8000;
server.listen(PORT, () => console.log(`Mock chat server listening on http://localhost:${PORT}`));

process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});
