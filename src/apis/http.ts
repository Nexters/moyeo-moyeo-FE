const BASE_URL = import.meta.env.VIResponseE_BASE_URL;

export const httpClient = {
  get: <T>(url: string) => __fetch<T>('get', url),
  post: <T, D>(url: string, body: D) => __fetch<T, D>('post', url, body),
  put: <T, D>(url: string, body: D) => __fetch<T, D>('put', url, body),
  delete: <T>(url: string) => __fetch<T>('delete', url),
};

const __fetch = async <T = unknown, D = unknown>(
  method: string,
  path: string,
  body?: D,
) => {
  const response = await fetch(resolveUrl(BASE_URL, path), {
    method,
    // @note: body가 undefined이면, stringify 된 값도 undefined이므로 body는 전송되지 않는다.
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data as T;
};

const resolveUrl = (baseUrl: string, path: string) => {
  if (
    !baseUrl ||
    path.toLowerCase().startsWith('http://') ||
    path.toLowerCase().startsWith('https://')
  ) {
    return path;
  }

  return [
    baseUrl.at(-1) === '/' ? baseUrl.slice(0, -1) : baseUrl,
    path.at(0) === '/' ? path.slice(1) : path,
  ].join('/');
};
