export const resolveUrl = (baseUrl: string, path: string) => {
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
