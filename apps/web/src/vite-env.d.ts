interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_ENABLE_ANALYTICS: string
    readonly VITE_ENABLE_DEBUG: string
    readonly DEV: boolean
    readonly PROD: boolean
    readonly MODE: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  