import { ApiResponse, ErrorCode } from "@/types";

export function debounce<T extends any[], R>(
  callback: (...args: T) => R | Promise<R>,
  wait: number,
): (...args: T) => Promise<R> {
  let timeoutId: NodeJS.Timeout | undefined = undefined;

  return (...args: T): Promise<R> => {
    return new Promise((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(async () => {
        try {
          const result = await callback(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, wait);
    });
  };
}

export async function refreshAccessToken() {
  console.log("refresh access token");
  const resp = await fetch(`/api/v1/auth/token-refresh`, {
    cache: "no-store",
    method: "POST",
  });
  if (resp.status >= 400) {
    const error_msg = await resp.text();
    console.log("refresh token error:", error_msg);
  }
}

// For fetch that needs authorization
// Automatically refreshed access token if needed
export async function authFetch<T extends ApiResponse<{}>>(
  input: string | URL | globalThis.Request,
  init?: RequestInit,
): Promise<T> {
  return fetch(input, init)
    .then((resp) => resp.json())
    .then(async (data: T) => {
      if (data.ok) {
        return data;
      }
      if (data.error.code !== ErrorCode.TOKEN_EXPIRED) {
        return data;
      }
      await refreshAccessToken();
      return await fetch(input, init).then((resp) => resp.json());
    });
}
