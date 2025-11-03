import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  // 1. O QUE O COFRE GUARDA (State)
  // Usamos 'ref(null)' para dizer que, por padrão, não temos
  // nem token e nem usuário (estamos deslogados).
  const token = ref(null);
  const user = ref(null);

  // 2. A "PORTA" PARA GUARDAR DADOS (Action)
  // Criamos uma função que pode ser chamada para salvar os dados no cofre.
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

  // 3. O QUE O COFRE MOSTRA PARA FORA
  // Isso permite que nossos componentes acessem os dados e a função.
  return { token, user, setAuthData, clearAuthData };
});
