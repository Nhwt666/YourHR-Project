const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5298/api";

export const TOKEN_STORAGE_KEY = "aimasio_access_token";

export const getStoredToken = () => localStorage.getItem(TOKEN_STORAGE_KEY);

export const setStoredToken = (token: string) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

export const clearStoredToken = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

type ApiRequestInit = RequestInit & {
  isFormData?: boolean;
};

export const apiFetch = async <T>(path: string, init?: ApiRequestInit): Promise<T> => {
  const token = getStoredToken();

  const headers: Record<string, string> = {
    ...(init?.isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init?.headers as Record<string, string> | undefined),
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const rawBody = await response.text();
  if (!rawBody.trim()) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
  // Some endpoints can return 200 with empty/non-JSON body; parse defensively.
  if (contentType.includes("application/json")) {
    return JSON.parse(rawBody) as T;
  }

  try {
    return JSON.parse(rawBody) as T;
  } catch {
    return rawBody as T;
  }
};
