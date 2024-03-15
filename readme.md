# AI Proxy Server

Simple backend proxy API to handle requests between your macOS SwiftUI app and the AI 3rd-party provider APIs (or another third-party AI API).

Currently, includes the following AI APIs:

* OpenAI
* Mistral AI
* Claude 3 (Anthropic)


## Get Started

1. `npm install` to install the dependencies.
2. `npm run dev` for having nodemon running to the server restarting automatically on file changes.

## Other Commands

- `npm run start` - start as standard mode the server (without nodemon). Server doesn't restart on file changes.
- `npm run prod` - more optimized for a production environment. This command will first run `npm run build` and then use `node` to execute the JavaScript compiled file.
- `npm run build` - only to compile the TS files into ones.

### Utility

- `npm run prettier:check`– check any formatting/indentation errors.
- `npm run prettier:fix` – fix any formatting/indentation errors.

## Author

Hi there! ツ I'm **[Pierre-Henry Soria](https://pierrehenry.be)**. A super passionate & enthusiastic problem-solver / senior software engineer living in Sydney 🦘 Also a true cheese 🧀, ristretto ☕️, and dark chocolate lover! 😋

Feel free to connect and reach me through [my LinkedIn Profile](https://www.linkedin.com/in/ph7enry/) 🚀


## License

Distributed under the [MIT](https://opensource.org/license/mit) license. Happy coding! 🔥
