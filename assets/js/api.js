const API_BASE_URL = 'https://conexioncodex.onrender.com';

const toQueryString = (params) => {
  const sp = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === '' || v === undefined || v === null) return;
    sp.append(k, String(v));
  });
  const qs = sp.toString();
  return qs ? `?${qs}` : '';
};

const parseError = async (res) => {
  try {
    const data = await res.json();
    return data?.detail || `Error HTTP ${res.status}`;
  } catch {
    return `Error HTTP ${res.status}`;
  }
};

const request = async (path, options = {}) => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  if (res.status === 204) return null;
  return res.json();
};

window.booksApi = {
  getBooks: (filters = {}) => request(`/books${toQueryString(filters)}`),
  getBookById: (id) => request(`/books/${id}`),
  createBook: (payload) => request('/books', { method: 'POST', body: JSON.stringify(payload) }),
  updateBook: (id, payload) => request(`/books/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  patchBook: (id, payload) => request(`/books/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  changeStatus: (id, is_borrowed) => request(`/books/${id}/status`, { method: 'PATCH', body: JSON.stringify({ is_borrowed }) }),
  deleteBook: (id) => request(`/books/${id}`, { method: 'DELETE' })
};
