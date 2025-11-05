import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(null);
  const user = ref(null);

  function setAuthData(newToken, newUser) {
    console.log("PINIA: Salvando token e usuário no cofre");
    token.value = newToken;
    user.value = newUser;
  }

  function clearAuthData() {
    console.log("PINIA: Limpando o cofre (logout)");
    token.value = null;
    user.value = null;
  }

  return { token, user, setAuthData, clearAuthData };
});
