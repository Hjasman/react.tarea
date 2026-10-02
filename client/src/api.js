const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export async function apiRequest(path, { token, ...options } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const validationMessage = result.errors?.map((error) => error.msg).join(', ');
    throw new Error(validationMessage || result.message || 'No se pudo completar la solicitud.');
  }

  return result.data;
}

export const api = {
  register: (data) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  projects: (token) => apiRequest('/projects', { token }),
  createProject: (token, data) =>
    apiRequest('/projects', { token, method: 'POST', body: JSON.stringify(data) }),
  updateProject: (token, id, data) =>
    apiRequest(`/projects/${id}`, { token, method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (token, id) => apiRequest(`/projects/${id}`, { token, method: 'DELETE' }),
  tasks: (token, projectId, page = 1, limit = 10) =>
    apiRequest(`/tasks/${projectId}?page=${page}&limit=${limit}`, { token }),
  createTask: (token, projectId, data) =>
    apiRequest(`/tasks/${projectId}`, { token, method: 'POST', body: JSON.stringify(data) }),
  updateTask: (token, projectId, data) =>
    apiRequest(`/tasks/${projectId}`, { token, method: 'PATCH', body: JSON.stringify(data) }),
  deleteTask: (token, projectId, id) =>
    apiRequest(`/tasks/${projectId}`, {
      token,
      method: 'DELETE',
      body: JSON.stringify({ id }),
    }),
  setTaskStatus: (token, projectId, id, completed) =>
    apiRequest(`/tasks/${projectId}/${completed ? 'complete' : 'pending'}`, {
      token,
      method: 'PATCH',
      body: JSON.stringify({ id }),
    }),
};