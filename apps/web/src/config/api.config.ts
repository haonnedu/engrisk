export const apiConfig = {
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
    },
    lessons: {
      list: '/lessons',
      byId: (id: string) => `/lessons/${id}`,
      create: '/lessons',
      update: (id: string) => `/lessons/${id}`,
      delete: (id: string) => `/lessons/${id}`,
    },
    classes: {
      list: '/classes',
      byId: (id: string) => `/classes/${id}`,
      create: '/classes',
      update: (id: string) => `/classes/${id}`,
      delete: (id: string) => `/classes/${id}`,
    },
  },
  headers: {
    'Content-Type': 'application/json',
  },
} 