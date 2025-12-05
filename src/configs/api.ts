/**
 * API Routes Configuration
 * Centralized definition of all backend API endpoints
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Build a full API URL with optional query parameters
 */
function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  const url = `${API_BASE_URL}${endpoint}`;

  if (!params) return url;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
}

/**
 * Authentication API Routes
 */
export const authApi = {
  register: () => `${API_BASE_URL}/api/auth/register`,
  login: () => `${API_BASE_URL}/api/auth/login`,
  firebase: () => `${API_BASE_URL}/api/auth/firebase`,
  me: () => `${API_BASE_URL}/api/auth/me`,
  profile: () => `${API_BASE_URL}/api/auth/profile`,
  changePassword: () => `${API_BASE_URL}/api/auth/change-password`,
} as const;

/**
 * Properties API Routes
 */
export const propertiesApi = {
  list: (params?: { status?: string; city?: string; bhk?: string }) =>
    buildUrl('/api/properties', params),
  create: () => `${API_BASE_URL}/api/properties`,
  get: (id: string) => `${API_BASE_URL}/api/properties/${id}`,
  update: (id: string) => `${API_BASE_URL}/api/properties/${id}`,
  delete: (id: string) => `${API_BASE_URL}/api/properties/${id}`,
  uploadMedia: (id: string) => `${API_BASE_URL}/api/properties/${id}/media`,
} as const;

/**
 * Agreements API Routes
 */
export const agreementsApi = {
  list: (params?: { status?: string; role?: 'landlord' | 'tenant' }) =>
    buildUrl('/api/agreements', params),
  create: () => `${API_BASE_URL}/api/agreements`,
  get: (id: string) => `${API_BASE_URL}/api/agreements/${id}`,
  update: (id: string) => `${API_BASE_URL}/api/agreements/${id}`,
  sign: (id: string) => `${API_BASE_URL}/api/agreements/${id}/sign`,
} as const;

/**
 * Payments API Routes
 */
export const paymentsApi = {
  list: (params?: { agreement?: string; status?: string; type?: string }) =>
    buildUrl('/api/payments', params),
  create: () => `${API_BASE_URL}/api/payments`,
  get: (id: string) => `${API_BASE_URL}/api/payments/${id}`,
  update: (id: string) => `${API_BASE_URL}/api/payments/${id}`,
} as const;

/**
 * Inspections API Routes
 */
export const inspectionsApi = {
  list: (params?: { agreement?: string; type?: string }) => buildUrl('/api/inspections', params),
  create: () => `${API_BASE_URL}/api/inspections`,
  get: (id: string) => `${API_BASE_URL}/api/inspections/${id}`,
  uploadPhoto: (id: string) => `${API_BASE_URL}/api/inspections/${id}/photos`,
} as const;

/**
 * Notifications API Routes
 */
export const notificationsApi = {
  list: (params?: { is_read?: boolean; type?: string }) => buildUrl('/api/notifications', params),
  markAsRead: (id: string) => `${API_BASE_URL}/api/notifications/${id}/read`,
  markAllAsRead: () => `${API_BASE_URL}/api/notifications/read-all`,
} as const;

/**
 * Tickets API Routes
 */
export const ticketsApi = {
  list: (params?: { status?: string; type?: string; agreement?: string }) =>
    buildUrl('/api/tickets', params),
  create: () => `${API_BASE_URL}/api/tickets`,
  get: (id: string) => `${API_BASE_URL}/api/tickets/${id}`,
  addMessage: (id: string) => `${API_BASE_URL}/api/tickets/${id}/messages`,
  updateStatus: (id: string) => `${API_BASE_URL}/api/tickets/${id}/status`,
} as const;

/**
 * System/Health API Routes
 */
export const systemApi = {
  health: () => `${API_BASE_URL}/health`,
} as const;

/**
 * All API routes grouped by resource
 */
export const api = {
  auth: authApi,
  properties: propertiesApi,
  agreements: agreementsApi,
  payments: paymentsApi,
  inspections: inspectionsApi,
  notifications: notificationsApi,
  tickets: ticketsApi,
  system: systemApi,
} as const;

/**
 * Export API base URL for direct use if needed
 */
export { API_BASE_URL };
