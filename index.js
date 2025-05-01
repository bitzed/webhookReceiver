//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const path = require('path');
const crypto = require('crypto');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const webhookToken = process.env.WEBHOOK_TOKEN;
const publicPath = path.join(__dirname, 'public');

wss.on('connection', (ws) => {
  clients.add(ws);
  broadcastClientCount();
  ws.on('close', () => {
    clients.delete(ws);
    broadcastClientCount();
  });
});

function broadcastClientCount() {
  const message = JSON.stringify({ type: 'client_count', count: clients.size });
  clients.forEach(ws => ws.send(message));
}

app.use(express.json());
app.use(express.static(publicPath));

app.post('/webhook', async (req, res) => {
  console.log(webhookToken);
  const timestamp = req.headers['x-zm-request-timestamp'];
  const signature = req.headers['x-zm-signature'];
  const rawBody = JSON.stringify(req.body);
  const msg = `v0:${timestamp}:${rawBody}`;
  const hash = crypto.createHmac('sha256', webhookToken).update(msg).digest('hex');
  const expectedSig = `v0=${hash}`;

  if (signature !== expectedSig) {
    return res.status(200).json({ message: 'Invalid signature' });
  }

  const event = req.body.event;
  const eventBody = req.body.payload;

  if (event === 'endpoint.url_validation') {
    const token = eventBody.plainToken;
    const encryptedToken = crypto.createHmac('sha256', webhookToken).update(token).digest('hex');
    return res.json({ plainToken: token, encryptedToken });
  }

  console.log('📩 Webhook Event:', event);

  const payload = {
    type: 'webhook',
    timestamp: new Date().toISOString(),
    event,
    body: req.body,
  };
  clients.forEach(ws => ws.send(JSON.stringify(payload)));
  res.status(200).json({ message: 'OK' });
});


const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
