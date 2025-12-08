const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function to make API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    return apiRequest<{ token: string; user: any; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  login: async (email: string, password: string) => {
    return apiRequest<{ token: string; user: any; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
};

// Profile API
export const profileAPI = {
  getProfile: async (userId: string) => {
    return apiRequest<{ user: any }>(`/profile/${userId}`);
  },

  updateProfile: async (userId: string, data: { name?: string; email?: string; profilePictureUrl?: string }) => {
    return apiRequest<{ user: any; message: string }>(`/profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  changePassword: async (userId: string, currentPassword: string, newPassword: string) => {
    return apiRequest<{ message: string }>(`/profile/${userId}/password`, {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

export default apiRequest;

