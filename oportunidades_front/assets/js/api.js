const BASE_URL = "https://oportunidades-academicas.onrender.com/api";

function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  if (token) localStorage.setItem("token", token);
}

function clearToken() {
  localStorage.removeItem("token");
}

function buildQuery(params = {}) {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  if (!entries.length) return "";
  return "?" + new URLSearchParams(entries).toString();
}

async function request(method, path, data, params) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}${buildQuery(params)}`, {
    method,
    headers,
    body: ["GET", "HEAD"].includes(method) ? undefined : JSON.stringify(data),
  });
  const ct = res.headers.get("content-type") || "";
  const payload = ct.includes("application/json")
    ? await res.json()
    : await res.text();
  if (!res.ok) {
    const message =
      payload?.message || (typeof payload === "string" ? payload : "Erro");
    throw new Error(message);
  }
  return payload;
}

export const api = {
  setToken,
  clearToken,
  get: (path, params) => request("GET", path, null, params),
  post: (path, data, params) => request("POST", path, data, params),
  put: (path, data, params) => request("PUT", path, data, params),
  delete: (path, params) => request("DELETE", path, null, params),
};
