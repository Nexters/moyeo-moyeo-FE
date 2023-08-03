const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function getAsync<T>(url: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`);
  const data = await response.json();
  return data;
}

export async function postAsync<T, D>(url: string, body: D): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return data;
}

export async function putAsync<T, D>(url: string, body: D): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return data;
}

export async function deleteAsync<T>(url: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'DELETE',
  });

  const data = await response.json();
  return data;
}
