# 📨 Webhook Receiver

A minimal Node.js webhook receiver for testing and developing integrations.  
Built for easy deployment to **Google Cloud Run**, with **Docker** support included.

---

## 📦 Features

- Receives POST requests (e.g., from Zoom Webhooks)
- Parses JSON body and logs to console
- Lightweight and easy to extend
- Ready for local use or Cloud Run deployment

---

## 🚀 Quick Start

### 1. Clone this repo

```bash
git clone https://github.com/bitzed/webhookReceiver.git
cd webhookReceiver
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run locally

```bash
npm start
```

Default port: `8080`  
Send a test request:

```bash
curl -X POST http://localhost:8080 \
  -H "Content-Type: application/json" \
  -d '{"event":"test","payload":{"data":"Hello!"}}'
```

---

## ☁️ Deploy to Google Cloud Run

Make sure you are authenticated with `gcloud`, and your project is set:

```bash
gcloud config set project YOUR_PROJECT_ID
```

Then build and deploy:

```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/webhook-receiver
gcloud run deploy webhook-receiver \
  --image gcr.io/YOUR_PROJECT_ID/webhook-receiver \
  --platform managed \
  --allow-unauthenticated \
  --region asia-northeast1
```

> 🔐 If you want to restrict access, consider setting up authentication and secret validation in `server.js`.

---

## 🛠 Customization

You can add custom logic in `server.js` inside the `app.post('/')` route handler.

---

## 🧪 Webhook Testing Tools

- [RequestBin](https://requestbin.com/)
- [Webhook.site](https://webhook.site/)
- `curl` from CLI

---

## 📁 File structure

```
.
├── Dockerfile
├── package.json
├── server.js
└── README.md
```

---

## 📜 License

MIT License