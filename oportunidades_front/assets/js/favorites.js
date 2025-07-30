import { api } from "./api.js";

export async function getFavorites() {
  return api.get("/opportunities/favorites");
}

export async function removeFavorite(id) {
  return api.delete(`/opportunities/${id}/favorite`);
}
