/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly ANTHROPIC_API_KEY: string
  readonly ANTHROPIC_API_BASE_URL: string
  readonly HEAD_SCRIPTS: string
  readonly SECRET_KEY: string
  readonly SITE_PASSWORD: string
  readonly ANTHROPIC_API_MODEL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
