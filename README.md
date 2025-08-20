> ⚠️ The following sample application is a personal, open-source project shared by the app creator and not an officially supported Zoom Communications, Inc. sample application. Zoom Communications, Inc., its employees and affiliates are not responsible for the use and maintenance of this application. Please use this sample application for inspiration, exploration and experimentation at your own risk and enjoyment. You may reach out to the app creator and broader Zoom Developer community on https://devforum.zoom.us/ for technical discussion and assistance, but understand there is no service level agreement support for this application. Thank you and happy coding!

> ⚠️ このサンプルのアプリケーションは、Zoom Communications, Inc.の公式にサポートされているものではなく、アプリ作成者が個人的に公開しているオープンソースプロジェクトです。Zoom Communications, Inc.とその従業員、および関連会社は、本アプリケーションの使用や保守について責任を負いません。このサンプルアプリケーションは、あくまでもインスピレーション、探求、実験のためのものとして、ご自身の責任と楽しみの範囲でご活用ください。技術的な議論やサポートが必要な場合は、アプリ作成者やZoom開発者コミュニティ（ https://devforum.zoom.us/ ）にご連絡いただけますが、このアプリケーションにはサービスレベル契約に基づくサポートがないことをご理解ください。

# 📨 Webhook Receiver

A minimal Node.js webhook receiver for testing and developing integrations.  
Built for easy deployment to **Google Cloud Run**, with **Docker** support included.

---

## 📦 Features

- Receives POST requests (e.g., from Zoom Webhooks)
- Parses JSON body and logs to console
- Zoom Webhook Signature validation supported (via secret token)
- Lightweight and extensible
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

### 3. Configure Environment

Create a `.env` file in the root directory:

```env
WEBHOOK_TOKEN=your_zoom_webhook_secret_token
```

---

## 🔧 Set up Zoom Webhook (Zoom App Marketplace)

1. Go to [Zoom App Marketplace](https://marketplace.zoom.us/)
2. Create a new **Server-to-Server OAuth** app or **Webhook-only** app
3. Navigate to the **Feature** tab
4. Under **Event Subscriptions**, enable and:
   - Set your endpoint URL (e.g., `https://your-cloudrun-url/`)
   - Select events to subscribe (e.g., `meeting.summary_completed`)
   - Copy the **Secret Token**
5. Paste the token into `.env` as `WEBHOOK_TOKEN`

Zoom will use this token to sign all webhook requests. The app will verify the signature using HMAC-SHA256.

---

## ☁️ Deploy to Google Cloud Run

Make sure you're logged in and your project is set:

```bash
gcloud config set project YOUR_PROJECT_ID
```

Build and deploy:

```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/webhook-receiver
gcloud run deploy webhook-receiver \
  --image gcr.io/YOUR_PROJECT_ID/webhook-receiver \
  --platform managed \
  --allow-unauthenticated \
  --region asia-northeast1
```

After deployment, update the Zoom Webhook URL with your Cloud Run URL.

---

## 🛠 Customization

Webhook handling logic is in `server.js`.  
Signature validation is based on Zoom’s [Webhook Verification Guide](https://developers.zoom.us/docs/api/rest/webhook/#validate-webhook-events).

---

## 📁 File structure

```
.
├── Dockerfile
├── .env.example
├── package.json
├── server.js
└── README.md
```

---

## 📜 License

MIT License
