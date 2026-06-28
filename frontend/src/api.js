export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function api(path, options = {}, token) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${BASE_URL}${path}`, {
    headers,
    ...options,
  }).then(async (r) => {
    if (!r.ok) {
      let errBody;
      try {
        errBody = await r.json();
      } catch (e) {
        errBody = {};
      }
      throw new Error(errBody.msg || errBody.message || `API Error: ${r.status}`);
    }
    return r.json();
  }).catch((err) => {
    console.error("API Error:", err);
    throw err;
  });
}
