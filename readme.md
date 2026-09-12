# AI Proxy Server for Secure Client Applications

**SucceedAI Proxy API** is the historical, optional server for trusted clients that call external AI providers. Provider API keys stay on the server. Current SucceedAI Mac, iPhone and iPad apps use Apple’s on-device model and do not call this proxy.

Included provider adapters 🚀

- **OpenAI** (default)
- **Meta Llama**
- **Mistral AI**
- **Claude** (Anthropic)

Provider and security settings are documented in `.env.dist`.

## Get Started

Requires Node.js 22.18 or newer.

1. Copy `.env.dist` to `.env` and add your credentials.
2. Run `npm ci`.
3. Run `npm run dev` to start the server in watch mode.

### Other Commands

- `npm start`: start the server normally.
- `npm run prod`: alias for `npm start`; set `NODE_ENV=production` in the deployment environment.
- `npm run build`: validate the TypeScript build.
- `npm run typecheck`: check TypeScript without running the server.
- `npm test`: run the tests.
- `npm run prettier:check` / `npm run prettier:fix`: check or fix formatting.

## Railway Deployment

Railway uses the included `railway.json` configuration:

- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Health check: `/v1/health`
- Restart policy: `ON_FAILURE`

Configure credentials through your deployment environment's secret settings, using `.env.railway.example` as the variable checklist. Never put provider keys in clients or Git. Set `NODE_ENV=production` when deploying.

`TRUST_PROXY_HOPS` defaults to `0` for direct access. Behind a reverse proxy, set it only to the verified number of trusted hops on every route to this server. Do not blindly trust client-supplied forwarding headers. Incorrect proxy settings can defeat IP-based rate limiting.

## Request contract

Send `POST /v1/ai/query` with `Authorization: Bearer <configured opaque token>` and a JSON body such as `{"query":"Make this sentence clearer"}`. Queries must be nonempty strings of at most 12,000 characters. The default whole-body limit is 64 KB. A successful response includes `content`, `provider` and `model`.

- Missing or invalid authentication returns 401; unconfigured authentication returns 503.
- Invalid query types or malformed JSON return 400, and oversized input returns 413.
- Provider failures return a generic 500 response. Provider health, credentials and model availability require separate live verification.
- `/v1/health` is a lightweight configuration/liveness check; it does not call providers or prove they can generate a result.
- `/v1/token-generator` returns 410. It formerly issued JWTs that the actual authentication middleware never accepted.

## Security and licensing

`JWT_SECRET` is a historical variable name for an **opaque shared bearer token**, not a JWT signing secret. `BROWSER_EXTENSION_SECRET` may supply a second accepted token. At least one nonempty token is required to use AI routes. A token embedded in a distributed client is extractable; this mechanism is not per-user authentication or a complete public-service access model.

License checks are optional and disabled by default. When enabled, configure `LEMON_SQUEEZY_API_KEY` and send exactly `License: <numeric-license-id>:<license-key>`. The existing policy accepts only an `active` key matching the retrieved resource. It does not activate licenses or establish product-specific entitlements. Response parsing follows [Lemon Squeezy's retrieve-license-key contract](https://docs.lemonsqueezy.com/api/license-keys/retrieve-license-key).

Logs omit prompts, client-supplied system information, credentials and upstream response bodies. Provider error logs contain generic events or HTTP status. Axios-based generation requests are bounded to 45 seconds, and license requests to 5 seconds; OpenAI and Llama retain their configured timeout values.

## Validation

```sh
npm ci
npm run build
npm test
npm run prettier:check
npm audit
```

Tests use synthetic fixtures, in-memory provider mocks and temporary localhost HTTP servers. They do not call AI or licensing services. The `express` → `qs` override selects the patched 6.16 line because Express 4.22.2 pins the vulnerable 6.15 line; revisit it when Express updates its dependency range.

This audit changes source only. It does not deploy Railway, rotate credentials, enable billing or restore a backend dependency in the native apps.

## Author

[![Pierre-Henry Soria](https://avatars0.githubusercontent.com/u/1325411?s=200)](https://ph7.me "Pierre-Henry Soria, Software Developer")

Made with ❤️ by **[Pierre-Henry Soria](https://pierrehenry.be)**, a passionate product engineer and problem-solver who builds and ships software, with a strong interest in open-source ecosystems and data science. Based in Sydney 🦘, he enjoys nature 🌳, non-fiction, journaling, life optimisation, minimalism, and self-sufficiency. He also has a soft spot for Roquefort 🧀, a ristretto or almond flat white ☕️, and dark chocolate.

[![@phenrysay](https://img.shields.io/badge/x-000000?style=for-the-badge&logo=x)](https://x.com/phenrysay "Follow Me on X")  [![BlueSky](https://img.shields.io/badge/BlueSky-00A8E8?style=for-the-badge&logo=bluesky&logoColor=white)](https://bsky.app/profile/ph7.me "Follow Me on BlueSky")  [![pH-7](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/pH-7 "My GitHub")  [![YouTube Video](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/cWBuZ4DXGK4 "YouTube SucceedAI Video")

## Presentation Video

[![Watch the SucceedAI presentation video](https://img.youtube.com/vi/cWBuZ4DXGK4/maxresdefault.jpg)](https://www.youtube.com/watch?v=cWBuZ4DXGK4)

## About the Project

**Succeed AI** is part of the challenge `#AI-Free-Projects`, a group of **7 artificial intelligence projects** I have engaged to open source and transparently release on GitHub / YouTube with at least 20-hour/week commitment. Hope you enjoy 🤗

Feel free to connect, and reach me at **[my LinkedIn Profile](https://www.linkedin.com/in/ph7enry/)** 🚀

## License

Distributed under the [MIT](https://opensource.org/license/mit) license 🎉 Wish you happy, happy coding! 🤠
