export const appConfig = {
  name: 'English Class',
  version: '1.0.0',
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
  },
  features: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  },
  theme: {
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
  },
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
} 