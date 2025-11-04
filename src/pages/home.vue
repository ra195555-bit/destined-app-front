<template>
  <v-container class="fill-height d-flex flex-column pa-4" fluid>
    <v-row class="flex-grow-1 w-100" align="center" justify="center">
      <div
        v-if="!isLoading && usersToDiscover.length === 0"
        class="text-center"
      >
        <h2 class="text-h5">Acabaram os perfis!</h2>
        <p class="mt-2">Tente novamente mais tarde.</p>
        <v-btn
          class="mt-6"
          color="#DA327F"
          size="large"
          rounded="lg"
          @click="fetchUsers"
          :loading="isLoading"
        >
          Recarregar
          <template v-slot:loader>
            <v-progress-circular indeterminate></v-progress-circular>
          </template>
        </v-btn>
      </div>

      <div v-if="isLoading" class="text-center">
        <v-progress-circular
          indeterminate
          color="#DA327F"
          size="64"
        ></v-progress-circular>
        <p class="mt-4">Buscando perfis...</p>
      </div>

      <v-img
        v-if="!isLoading && usersToDiscover.length > 0"
        class="user-card"
        elevation="12"
        rounded="xl"
        aspect-ratio="9/16"
        cover
        :src="
          usersToDiscover[0].photos && usersToDiscover[0].photos.length > 0
            ? usersToDiscover[0].photos[0]
            : 'https://via.placeholder.com/350x500?text=Sem+Foto'
        "
        gradient="to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%"
      >
        <v-row class="fill-height ma-0" align="end" justify="start">
          <v-col>
            <div class="card-title pa-4">
              {{ usersToDiscover[0].name }}
            </div>
          </v-col>
        </v-row>
      </v-img>
    </v-row>

    <v-row class="flex-grow-0" justify="center" align="center">
      <v-col cols="auto">
        <v-btn
          icon="mdi-thumb-down"
          size="x-large"
          elevation="4"
          class="swipe-btn"
          color="red"
          @click="handleDislike"
          :disabled="isLoading || usersToDiscover.length === 0"
        ></v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          icon="mdi-thumb-up"
          size="x-large"
          elevation="4"
          class="swipe-btn"
          color="green"
          @click="handleLike"
          :disabled="isLoading || usersToDiscover.length === 0"
        ></v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const isLoading = ref(true);
const usersToDiscover = ref([]);

// 'onMounted' roda automaticamente quando a página é criada
onMounted(() => {
  fetchUsers();
});

async function fetchUsers() {
  const token = authStore.token;

  if (!token) {
    console.error("Erro: Ninguém logado para buscar perfis.");
    // (Idealmente, o 'router' deveria proteger esta página,
    // mas por enquanto, vamos só parar)
    isLoading.value = false;
    return;
  }

  console.log("Buscando perfis do /discovery...");
  try {
    const response = await fetch(
      "https://destined-app-back.onrender.com/api/discovery",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      usersToDiscover.value = data; // Coloca os usuários na "caixinha"
      console.log("Perfis carregados:", data);
    } else {
      console.error("Erro ao buscar perfis:", data.message);
    }
  } catch (error) {
    console.error("Erro de rede (fetchUsers):", error);
  } finally {
    // Independentemente de sucesso ou erro, paramos de carregar
    isLoading.value = false;
  }
}

function removeCurrentUserFromList() {
  usersToDiscover.value.shift(); // 'shift()' remove o primeiro item do array
}

function handleDislike() {
  console.log("DISLIKE no usuário:", usersToDiscover.value[0].name);
  removeCurrentUserFromList();
}

async function handleLike() {
  const userToLike = usersToDiscover.value[0];
  const token = authStore.token;
  if (!token) return;

  try {
    const response = await fetch("/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ likedId: userToLike.id }),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.match === true) {
        console.log("É UM MATCH! Navegando para a tela de sucesso...");
        console.log("userToLike:", userToLike);

        // 1. Pega a nossa foto (do cofre)
        const myPhoto =
          authStore.user.photos && authStore.user.photos.length > 0
            ? `/api/${authStore.user.photos[0]}`
            : "https://via.placeholder.com/100?text=Eu";

        // 2. Pega a foto do match (do card)
        const theirPhoto =
          userToLike.photos && userToLike.photos.length > 0
            ? userToLike.photos[0] // A URL já está completa
            : "https://via.placeholder.com/100?text=Match";

        // 3. NAVEGA PARA A NOVA PÁGINA (enviando os dados pela URL)
        router.push({
          name: "/match-success", // O nome da rota é definido pelo vue-router-auto
          query: {
            // Os dados que a página precisa
            matchId: data.matchId,
            myPhoto: myPhoto,
            theirPhoto: theirPhoto,
            theirName: userToLike.name,
          },
        });

        // Remove o usuário da lista (para não vê-lo novamente)
        removeCurrentUserFromList();
      } else {
        // Não foi match, só um like.
        console.log("Like registrado.", data.message);
        removeCurrentUserFromList();
      }
    } else {
      console.error("Erro ao dar like:", data.message);
      removeCurrentUserFromList();
    }
  } catch (error) {
    console.error("Erro de rede (handleLike):", error);
    removeCurrentUserFromList();
  }
}
</script>

<style scoped>
.user-card {
  color: white;
}
.card-title {
  font-size: 1.8rem;
  font-weight: bold;
}
.swipe-btn {
  margin: 0 20px;
}
</style>
