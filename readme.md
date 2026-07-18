# SucceedAI Proxy API

**SucceedAI Proxy API** is the **secure backend** for the **SucceedAI macOS app**. It keeps **AI provider keys** private while connecting the app to OpenAI, Meta Llama, Mistral, and Claude.

## AI Providers

OpenAI is enabled by default. Meta Llama, Mistral, and Claude can also be enabled when needed.

See `.env.dist` for provider and security options.

## Local Development

```bash
cp .env.dist .env
npm install
npm run dev
```

Requires Node.js 22.18 or newer.

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
npm start
npm run dev
npm run build
npm run typecheck
npm test
npm run prettier:check
npm run prettier:fix
npm run prod
```

## Security Notes

- `JWT_SECRET` must not be empty in Railway.
- `OPENAI_API_KEY` must exist only in Railway or local `.env`.
- `LICENSE_CHECK_ENABLED=false` keeps the initial app flow working before paid license headers are shipped.
- When `LICENSE_CHECK_ENABLED=true`, the app must send `License: <license-id>:<license-key>`.

## Author

[![Pierre-Henry Soria](https://avatars0.githubusercontent.com/u/1325411?s=200)](https://ph7.me "Pierre-Henry Soria, Software Developer")

Made with ❤️ by **[Pierre-Henry Soria](https://pierrehenry.be)**. A super passionate & enthusiastic Problem-Solver / Senior Software Engineer. Also a true cheese 🧀, ristretto ☕️, and dark chocolate lover! 😋

[![@phenrysay](https://img.shields.io/badge/x-000000?style=for-the-badge&logo=x)](https://x.com/phenrysay "Follow Me on X")  [![BlueSky](https://img.shields.io/badge/BlueSky-00A8E8?style=for-the-badge&logo=bluesky&logoColor=white)](https://bsky.app/profile/ph7.me "Follow Me on BlueSky")  [![pH-7](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/pH-7 "My GitHub")  [![YouTube Video](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/cWBuZ4DXGK4 "YouTube SucceedAI Video")

### Presentation Video

[![Watch the SucceedAI presentation video](https://img.youtube.com/vi/cWBuZ4DXGK4/maxresdefault.jpg)](https://www.youtube.com/watch?v=cWBuZ4DXGK4)

## About the Project

**Succeed AI** is part of the challenge `#AI-Free-Projects`, a group of **7 artificial intelligence projects** I have engaged to open source and transparently release on GitHub / YouTube with at least 20-hour/week commitment. Hope you enjoy 🤗

Feel free to connect, and reach me at **[my LinkedIn Profile](https://www.linkedin.com/in/ph7enry/)** 🚀

## License

Distributed under the [MIT](https://opensource.org/license/mit) license 🎉 Wish you happy, happy coding! 🤠
