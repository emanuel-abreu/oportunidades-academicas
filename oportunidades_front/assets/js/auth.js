import { api } from "./api.js";

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

// Busca dados do usuário logado
export async function me() {
  return api.get("/users/me");
}

export function ensureAuth(redirect = "login.html") {
  if (!isAuthenticated()) window.location.href = redirect;
}

export function redirectIfLogged(to = "index.html") {
  if (isAuthenticated()) window.location.href = to;
}

export async function login({ email, password }) {
  const res = await api.post("/auth/login", { email, password });
  api.setToken(res.token);
  return res;
}

export async function register({ name, email, password, role }) {
  return api.post("/auth/register", { name, email, password, role });
}

export function logout() {
  api.clearToken();
  window.location.href = "login.html";
}

export function mountAuthUI({
  loginLink,
  profileLink,
  favoritesLink,
  logoutBtn,
  createLink,
}) {
  const auth = isAuthenticated();

  // links básicos
  if (loginLink) loginLink.classList.toggle("hidden", auth);
  if (profileLink) profileLink.classList.toggle("hidden", !auth);
  if (favoritesLink) favoritesLink.classList.toggle("hidden", !auth);

  // botão sair
  if (logoutBtn) {
    logoutBtn.classList.toggle("hidden", !auth);
    logoutBtn.addEventListener("click", logout);
  }

  // botão "Cadastrar Oportunidade"
  if (createLink) {
    // começa escondido
    createLink.classList.add("hidden");

    if (auth) {
      // busca perfil e mostra só para professor/coordenador
      me()
        .then((user) => {
          if (["professor", "coordenador"].includes(user.role)) {
            createLink.classList.remove("hidden");
          }
        })
        .catch(() => {
          // em caso de erro ao buscar perfil, deixa escondido
          createLink.classList.add("hidden");
        });
    }
  }
}
