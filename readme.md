# SucceedAI: An AI Proxy API that Securely Serves Client Applications

SucceedAI Proxy API is the production backend used by the macOS app. It securely handles requests between client applications and AI third-party provider APIs, keeping provider keys off the client. It validates the app bearer token, optionally validates Lemon Squeezy licenses, and returns the same response contract expected by the app:

```json
{
  "content": "Generated text",
  "model": "gpt-5.2",
  "provider": "openai"
}
```

The macOS app calls `POST /v1/ai/query` with:

```json
{
  "query": "Follow the instruction from the text in triple quotes below...",
  "systemInfo": {
    "osName": "macOS",
    "osVersion": "15.x",
    "model": "Mac"
  }
}
```

## Current AI Flow

OpenAI is the default production provider. The backend uses the OpenAI Node SDK with the Responses API, which is the current primary OpenAI text-generation API.

Required Railway variables:

- `JWT_SECRET`: bearer token used by the signed macOS app.
- `OPENAI_API_KEY`: OpenAI API key.
- `OPENAI_MODEL`: defaults to `gpt-5.2`.

Optional variables:

- `OPENAI_MAX_OUTPUT_TOKENS`: defaults to `1200`.
- `OPENAI_TIMEOUT_MS`: defaults to `45000`.
- `LICENSE_CHECK_ENABLED`: defaults to `false`.
- `LEMON_SQUEEZY_API_KEY`: required only when license checks are enabled.
- `BROWSER_EXTENSION_SECRET`: optional secondary bearer token.

Legacy Mistral and Claude adapters remain available but are disabled by default. Enable them only after setting their API keys and model names.

## Local Development

```bash
cp .env.dist .env
npm install
npm run dev
```

Use `npm run start:dev` when you want the old non-watch TypeScript startup command.

Health check:

```bash
curl http://localhost:3004/v1/health
```

Example app-compatible request:

```bash
curl -X POST http://localhost:3004/v1/ai/query \
  -H "Authorization: Bearer $JWT_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"query":"Rewrite this as a concise customer email: hello there","systemInfo":{"osName":"macOS"}}'
```

## Railway Deployment

This repository includes `railway.json` for Railway config-as-code:

- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Health check: `/v1/health`
- Restart policy: `ON_FAILURE`

Recommended setup:

```bash
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=<same-token-used-in-the-macos-app>
railway variables set OPENAI_API_KEY=<openai-api-key>
railway variables set OPENAI_MODEL=gpt-5.2
railway up
```

Use `.env.railway.example` as the deployment checklist. Do not commit `.env`.

## Commands

```bash
npm run build
npm run typecheck
npm run prettier:check
npm run prettier:fix
npm run prod
```

## Security Notes

- `JWT_SECRET` must not be empty in Railway.
- `OPENAI_API_KEY` must exist only in Railway or local `.env`.
- `LICENSE_CHECK_ENABLED=false` keeps the initial app flow working before paid license headers are shipped.
- When `LICENSE_CHECK_ENABLED=true`, the app must send `License: <license-id>:<license-key>`.

## License

Distributed under the [MIT](https://opensource.org/license/mit) license 🎉 Wish you happy, happy coding! 🤠

## Author

[![Pierre-Henry Soria](https://avatars0.githubusercontent.com/u/1325411?s=200)](https://ph7.me "Pierre-Henry Soria, Software Developer")

Made with ❤️ by **[Pierre-Henry Soria](https://pierrehenry.be)**. A super passionate & enthusiastic Problem-Solver / Senior Software Engineer. Also a true cheese 🧀, ristretto ☕️, and dark chocolate lover! 😋

[![@phenrysay](https://img.shields.io/badge/x-000000?style=for-the-badge&logo=x)](https://x.com/phenrysay "Follow Me on X")  [![pH-7](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/pH-7 "My GitHub")  [![YouTube Video](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/cWBuZ4DXGK4 "YouTube SucceedAI Video")

### Presentation Video

[![Watch the SucceedAI presentation video](https://img.youtube.com/vi/cWBuZ4DXGK4/maxresdefault.jpg)](https://www.youtube.com/watch?v=cWBuZ4DXGK4)

## About the Project

**Succeed AI** is part of the challenge `#AI-Free-Projects`, a group of **7 artificial intelligence projects** I have engaged to open source and transparently release on GitHub / YouTube with at least 20-hour/week commitment. Hope you enjoy 🤗

Feel free to connect, and reach me at **[my LinkedIn Profile](https://www.linkedin.com/in/ph7enry/)** 🚀
