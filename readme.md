# AI Proxy Server for Secure Client Applications

**SucceedAI Proxy API** securely connects the **SucceedAI macOS app** to **AI provider APIs** while keeping **private API keys** off the client.

Supported providers 🚀

- **OpenAI** (default)
- **Meta Llama**
- **Mistral AI**
- **Claude** (Anthropic)

Provider and security settings are documented in `.env.dist`.

## Get Started

Requires Node.js 22.18 or newer.

1. Copy `.env.dist` to `.env` and add your credentials.
2. Run `npm install`.
3. Run `npm run dev` to start the server in watch mode.

### Other Commands

- `npm start` — start the server normally.
- `npm run prod` — start in production mode.
- `npm run build` — validate the TypeScript build.
- `npm run typecheck` — check TypeScript without running the server.
- `npm test` — run the tests.
- `npm run prettier:check` / `npm run prettier:fix` — check or fix formatting.

## Railway Deployment

Railway uses the included `railway.json` configuration:

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

## Security

- `JWT_SECRET` must not be empty in Railway.
- `OPENAI_API_KEY` must exist only in Railway or local `.env`.
- License checks are optional and disabled by default.
- When enabled, requests must include `License: <license-id>:<license-key>`.

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
