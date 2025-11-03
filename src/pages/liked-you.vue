<template>
  <v-container class="fill-height d-flex flex-column pa-4">
    <v-row class="flex-grow-0">
      <v-col>
        <h1 class="text-h4 font-weight-bold">Liked You</h1>
        <p class="text-subtitle-1 text-grey-lighten-1">
          Pessoas que curtiram o seu perfil
        </p>
      </v-col>
    </v-row>

    <v-row class="flex-grow-1 mt-4">
      <v-col cols="12">
        <div v-if="isLoading" class="text-center mt-8">
          <v-progress-circular
            indeterminate
            color="#DA327F"
            size="64"
          ></v-progress-circular>
          <p class="mt-4">Carregando...</p>
        </div>

        <div v-else-if="likedUsers.length === 0" class="text-center mt-8">
          <v-icon size="80" color="grey">mdi-heart-broken</v-icon>
          <h2 class="text-h5 mt-4">Ninguém te curtiu ainda</h2>
          <p class="mt-2">Seja paciente!</p>
        </div>

        <v-row v-else>
          <v-col
            v-for="user in likedUsers"
            :key="user.id"
            cols="6"
            sm="4"
            md="3"
            lg="2"
            class="pa-2"
          >
            <v-img
              :src="
                user.photos && user.photos.length > 0
                  ? user.photos[0]
                  : 'https://via.placeholder.com/250x300?text=Sem+Foto'
              "
              class="user-card"
              rounded="xl"
              gradient="to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%"
              aspect-ratio="9/16"
              cover
              style="width: 40vh"
            >
              <v-row class="fill-height ma-0" align="end" justify="start">
                <v-col>
                  <div class="card-title pa-2">
                    {{ user.name }}
                  </div>
                </v-col>
              </v-row>
            </v-img>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const isLoading = ref(true);
const likedUsers = ref([]); // "Caixinha" para guardar quem curtiu

// Roda assim que a página é aberta
onMounted(() => {
  fetchLikedUsers();
});

async function fetchLikedUsers() {
  const token = authStore.token;
  if (!token) {
    console.error("Erro: Ninguém logado para buscar likes.");
    isLoading.value = false;
    return;
  }

  console.log("Buscando perfis do /likes/who-liked-me...");
  try {
    const response = await fetch("/api/likes/who-liked-me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      // O back-end já está enviando a URL completa,
      // então não precisamos formatar!
      console.log("Perfis (Liked You) carregados:", data);
      likedUsers.value = data;
    } else {
      console.error('Erro ao buscar "Liked You":', data.message);
    }
  } catch (error) {
    console.error("Erro de rede (fetchLikedUsers):", error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.user-card {
  /* Fundo escuro para o card */
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}
.card-title {
  font-size: 1rem;
  font-weight: bold;
  /* Garante que o nome fique em uma linha */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
