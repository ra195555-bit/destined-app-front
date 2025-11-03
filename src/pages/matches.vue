<template>
  <v-container class="fill-height d-flex flex-column pa-4">
    <v-row class="flex-grow-0" align="center">
      <v-col cols="2">
        <v-btn icon="mdi-arrow-left" variant="text" @click="goBack"></v-btn>
      </v-col>
      <v-col cols="10">
        <h1 class="text-h4 font-weight-bold">Dating Matches</h1>
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
          <p class="mt-4">Carregando seus matches...</p>
        </div>

        <div v-else-if="matches.length === 0" class="text-center mt-8">
          <v-icon size="80" color="grey">mdi-message-off</v-icon>
          <h2 class="text-h5 mt-4">Nenhum match ainda</h2>
          <p class="mt-2">Continue dando likes para encontrar um match!</p>
        </div>

        <v-list v-else lines="two" bg-color="transparent">
          <v-list-item
            v-for="match in matches"
            :key="match.id"
            :title="match.name"
            :subtitle="`Gênero: ${match.gender}`"
            rounded="xl"
            class="mb-2 match-item"
            @click="openChat(match.matchId)"
          >
            <template v-slot:prepend>
              <v-avatar size="50">
                <v-img
                  :src="
                    match.photos && match.photos.length > 0
                      ? match.photos[0]
                      : 'https://via.placeholder.com/50?text=Sem+Foto'
                  "
                  cover
                ></v-img>
              </v-avatar>
            </template>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const router = useRouter();
const isLoading = ref(true);
const matches = ref([]);

onMounted(() => {
  fetchMatches();
});

function goBack() {
  router.push("/home");
}

function openChat(matchId) {
  console.log("Abrindo chat para o match ID:", matchId);
  router.push(`/chat/${matchId}`);
}

async function fetchMatches() {
  const token = authStore.token;
  if (!token) {
    console.error("Erro: Ninguém logado para buscar matches.");
    isLoading.value = false;
    return;
  }

  console.log("Buscando matches do /matches...");
  try {
    const response = await fetch("/matches", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      const formattedMatches = data.map((match) => ({
        ...match,
        photos: match.photos ? match.photos.map((p) => `/api/${p}`) : [],
      }));

      matches.value = formattedMatches;
      console.log("Matches carregados:", formattedMatches);
    } else {
      console.error("Erro ao buscar matches:", data.message);
    }
  } catch (error) {
    console.error("Erro de rede (fetchMatches):", error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.match-item {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
