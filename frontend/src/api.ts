const TOKEN_KEY = "studytrack_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string | null) =>
  token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

// bungkus fetch: tambahin token, baca JSON, dan lempar error kalau gagal
// kalau token ditolak (401), sesi dihapus dan App dikabari biar balik ke halaman login
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers
    }
  });
  if (res.status === 401 && token) {
    setToken(null);
    window.dispatchEvent(new Event("auth:expired"));
  }
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(body.error ?? "Terjadi kesalahan.", res.status);
  return body as T;
}