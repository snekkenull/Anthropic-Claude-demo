# Anthropic-API Demo

A demo repo based on [Anthropic API.](https://console.anthropic.com/docs/api)

# Fork
Origin Auther's repo [Chatgpt-demo](https://github.com/ddiu8081/chatgpt-demo)

>Pending optimization: Stream function.

![chat-logo](https://logovtor.com/wp-content/uploads/2021/06/anthropic-ai-logo-vector.png)



## Running Locally

### Pre environment
1. **Node**: Check that both your development environment and deployment environment are using `Node v18` or later. You can use [nvm](https://github.com/nvm-sh/nvm) to manage multiple `node` versions locally。
   ```bash
    node -v
   ```
2. **PNPM**: We recommend using [pnpm](https://pnpm.io/) to manage dependencies. If you have never installed pnpm, you can install it with the following command:
   ```bash
    npm i -g pnpm
   ```
3. **ANTHROPIC_API_KEY**: Before running this application, you need to obtain the API key from Anthropic. 

### Getting Started

1. Install dependencies
   ```bash
    pnpm install
   ```
2. Copy the `.env.example` file, then rename it to `.env`, and add your [Anthropic API key](https://platform.openai.com/account/api-keys) to the `.env` file.
   ```bash
    ANTHROPIC_API_KEY=sk-xxx...
   ```
3. Run the application, the local project runs on `http://localhost:3000/`
   ```bash
    pnpm run dev
   ```

## Deploy

### Deploy With Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsnekkenull%2FAnthropic-Claude-demo&env=ANTHROPIC_API_KEY&envDescription=Anthropic%20API%20Key)



> #### 🔒 Need website password?
> 
> Deploy with the [`SITE_PASSWORD`](#environment-variables)
> 
> <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsnekkenull%2FAnthropic-Claude-demo&env=ANTHROPIC_API_KEY&env=SITE_PASSWORD&envDescription=Anthropic%20API%20Key" alt="Deploy with Vercel" target="_blank"><img src="https://vercel.com/button" alt="Deploy with Vercel" height=24 style="vertical-align: middle; margin-right: 4px;"></a>

![image](https://cdn.staticaly.com/gh/yzh990918/static@master/20230310/image.4wzfb79qt7k0.webp)


### Deploy With Netlify

[![Deploy with Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/snekkenull/Anthropic-Claude-demo#ANTHROPIC_API_KEY=&HTTPS_PROXY=&ANTHROPIC_API_BASE_URL=&HEAD_SCRIPTS=&SECRET_KEY=&ANTHROPIC_API_MODEL=&SITE_PASSWORD=)

**Step-by-step deployment tutorial:**

1. [Fork](https://github.com/snekkenull/Anthropic-Claude-demo/fork) this project，Go to [https://app.netlify.com/start](https://app.netlify.com/start) new Site, select the project you `forked` done, and connect it with your `GitHub` account.

![image](https://cdn.staticaly.com/gh/yzh990918/static@master/20230310/image.3nlt4hgzb16o.webp)

![image](https://cdn.staticaly.com/gh/yzh990918/static@master/20230310/image.5fhfouap270g.webp)


2. Select the branch you want to deploy, then configure environment variables in the project settings.

![image](https://cdn.staticaly.com/gh/yzh990918/static@master/20230311/image.gfs9lx8c854.webp)

3. Select the default build command and output directory, Click the `Deploy Site` button to start deploying the site。

![image](https://cdn.staticaly.com/gh/yzh990918/static@master/20230311/image.4jky9e1wbojk.webp)


### Deploy with Docker

Before deploying the app, please make sure `.env` is configured normally.

Environment variables refer to the documentation below. [Docker Hub address](https://hub.docker.com/r/snekkenull/Anthropic-Claude-demo).

**Direct run**
```bash
docker run --name=Anthropic-Claude-demo --volume=/path/.env:/usr/src/.env:rw -p 3000:3000 -d snekkenull/Anthropic-Claude-demo:latest
```
`/path/.env` represents the path to the local environment variable.


**Docker compose**
```yml
version: '3'

services:
  Anthropic-Claude-demo:
    image: snekkenull/Anthropic-Claude-demo:latest
    container_name: Anthropic-Claude-demo
    restart: always
    ports:
      - '3000:3000'
    volumes:
      - .env:/usr/src/.env
```

```bash
# start
docker compose up -d
# down
docker-compose down
```

### Deploy on more servers

Please refer to the official deployment documentation：https://docs.astro.build/en/guides/deploy

## Environment Variables

You can control the website through environment variables.

| Name | Description | Default |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Your API Key for Anthropic. | `null` |
| `HEAD_SCRIPTS` | Inject analytics or other scripts before `</head>` of the page | `null` |
| `SITE_PASSWORD` | Set password for site, If not set, site will be public | `null` |
| `ANTHROPIC_API_MODEL` | ID of the model to use. [List models](https://console.anthropic.com/docs/api/reference) | `claude-v1` |


## Frequently Asked Questions

Q: TypeError: fetch failed (can't connect to Anthropic Api)

A: Configure environment variables `HTTPS_PROXY`，reference: https://github.com/snekkenull/Anthropic-Claude-demo/issues/34

Q: throw new TypeError(${context} is not a ReadableStream.)

A: The Node version needs to be `v18` or later，reference: https://github.com/snekkenull/Anthropic-Claude-demo/issues/65

Q: Accelerate domestic access without the need for proxy deployment tutorial?

A: You can refer to this tutorial: https://github.com/snekkenull/Anthropic-Claude-demo/discussions/270

Q: `PWA` is not working?

A: Current `PWA` does not support deployment on Netlify, you can choose vercel or node deployment.
## Contributing

Thanks ddiu8081 [Chatgpt-demo](https://github.com/ddiu8081/chatgpt-demo)
## License

MIT © [snekkenull](https://github.com/snekkenull/Anthropic-Claude-demo/blob/main/LICENSE)
