import { API_URL } from './config';

async function request(path, options = {}) {
  const { body, ...rest } = options;
  const fetchOptions = { ...rest };

  if (body !== undefined) {
    fetchOptions.headers = { 'Content-Type': 'application/json', ...fetchOptions.headers };
    fetchOptions.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${path}`, fetchOptions);
  const data = res.status === 204 ? null : await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error(data?.error || `Request failed with status ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function getJson(path) {
  return request(path);
}

export function postJson(path, body) {
  return request(path, { method: 'POST', body });
}

export function putJson(path, body) {
  return request(path, { method: 'PUT', body });
}

export function deleteJson(path) {
  return request(path, { method: 'DELETE' });
}
