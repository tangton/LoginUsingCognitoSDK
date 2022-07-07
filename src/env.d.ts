/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly PUBLIC_USERPOOL: string;
	readonly PUBLIC_CLIENT_ID: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}