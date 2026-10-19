export function extractList(data) {
  if (Array.isArray(data)) {
    return data;
  }

  const list =
    data?.results ??
    data?.items ??
    data?.data;

  return Array.isArray(list)
    ? list
    : [];
}