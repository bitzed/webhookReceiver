//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const path = require('path');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const clients = new Set();

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

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use(express.static(publicPath));

app.post('/webhook', async (req, res) => {
  console.log('📬 Incoming Webhook Request:', JSON.stringify(req.body, null, 2));
  const timestamp = req.headers['x-zm-request-timestamp'] || Date.now();
  const signature = req.headers['x-zm-signature'];
  console.log('🔑 Signature:', signature);
  const rawBody = req.body;
  const msg = `v0:${timestamp}:${req.rawBody}`;
  const hash = crypto.createHmac('sha256', webhookToken).update(msg).digest('hex');
  const expectedSig = `v0=${hash}`;
  console.log('🔑 Expected Signature:', expectedSig);

  if (signature !== expectedSig) {
    console.error('❌ Invalid signature');
    return res.status(200).json({ message: 'Invalid signature' });
  }
  console.log('✅ Signature verified successfully');
  const event = req.body.event ? req.body.event : undefined;
  const eventBody = req.body.payload ? req.body.payload : req.body;

  if (event === 'endpoint.url_validation') {
    console.log('🔗 URL Validation Event Detected');
    const token = eventBody.plainToken;
    const encryptedToken = crypto.createHmac('sha256', webhookToken).update(token).digest('hex');
    console.log('🔑 URL Validation Token:', token);
    return res.json({ plainToken: token, encryptedToken });
  }

  //console.log(`📩 Webhook Event: ${event}`);

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
