/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DATABASE_URL: string; // your Postgres URL from .env
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
