const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Helper to get authentication token
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper to set authentication token
export const setAuthToken = (token: string | null): void => {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }
};

// Generic request wrapper
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 24) { // No Content
    return {} as T;
  }

  if (response.status === 401) {
    // Unauthorized: Clear token and trigger redirect to login if we are in browser
    setAuthToken(null);
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register') && window.location.pathname !== '/') {
      window.location.href = '/login?expired=true';
    }
  }

  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // Fallback if response is not JSON
      errorMessage = await response.text() || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => 
    request<T>(endpoint, { method: 'GET', ...options }),
    
  post: <T>(endpoint: string, body: unknown, options?: RequestInit) => 
    request<T>(endpoint, { 
      method: 'POST', 
      body: JSON.stringify(body), 
      ...options 
    }),
    
  put: <T>(endpoint: string, body: unknown, options?: RequestInit) => 
    request<T>(endpoint, { 
      method: 'PUT', 
      body: JSON.stringify(body), 
      ...options 
    }),
    
  patch: <T>(endpoint: string, body: unknown, options?: RequestInit) => 
    request<T>(endpoint, { 
      method: 'PATCH', 
      body: JSON.stringify(body), 
      ...options 
    }),
    
  delete: <T>(endpoint: string, options?: RequestInit) => 
    request<T>(endpoint, { method: 'DELETE', ...options })
};
