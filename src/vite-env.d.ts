/// <reference types="vite/client" />

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
    readonly VITE_FOOTBALL_API_KEY: string;
    // Add other environment variables here if needed
}