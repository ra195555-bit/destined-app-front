<template>
  <v-container class="interests-container pa-4">
    <v-row align="center" class="mb-4">
      <v-col cols="2">
        <v-btn icon="mdi-arrow-left" variant="text" @click="goBack"></v-btn>
      </v-col>
      <v-col cols="8"></v-col>
      <v-col cols="2" class="text-right">
        <v-btn variant="text" class="skip-btn" @click="skip">Skip</v-btn>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">
        <h1 class="text-h4 font-weight-bold mb-2">Likes, Interests</h1>
        <p class="text-subtitle-1 text-grey-lighten-1">
          Share your likes & passion with others
        </p>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-chip-group v-model="selectedInterests" multiple column class="mt-4">
          <v-chip
            v-for="interest in allInterests"
            :key="interest.value"
            :value="interest.value"
            class="interest-chip"
            size="x-large"
            filter
          >
            <v-icon :icon="interest.icon" start></v-icon>
            {{ interest.text }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>

    <v-spacer></v-spacer>

    <v-row justify="center" class="mt-8">
      <v-col cols="12" sm="8" md="4">
        <v-btn
          block
          size="large"
          class="custom-gradient-btn"
          @click="handleContinue"
        >
          Continue
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

definePage({
  meta: {
    layout: "auth",
  },
});

const router = useRouter();
const authStore = useAuthStore();

// 1. Lista de interesses que o usuário selecionou
const selectedInterests = ref([]);

// 2. Lista de TODOS os interesses disponíveis (com ícones do mdi)
const allInterests = ref([
  { text: "Photography", value: "photography", icon: "mdi-camera" },
  { text: "Cooking", value: "cooking", icon: "mdi-chef-hat" },
  { text: "Video Games", value: "videogames", icon: "mdi-controller-classic" },
  { text: "Music", value: "music", icon: "mdi-music" },
  { text: "Travelling", value: "travelling", icon: "mdi-airplane" },
  { text: "Shopping", value: "shopping", icon: "mdi-shopping" },
  { text: "Speeches", value: "speeches", icon: "mdi-microphone" },
  { text: "Art & Crafts", value: "art", icon: "mdi-palette" },
  { text: "Swimming", value: "swimming", icon: "mdi-swim" },
  { text: "Drinking", value: "drinking", icon: "mdi-glass-wine" },
  { text: "Extreme Sports", value: "sports", icon: "mdi-parachute" },
  { text: "Fitness", value: "fitness", icon: "mdi-dumbbell" },
]);

const isSelected = (value) => selectedInterests.value.includes(value);

function toggleInterest(value) {
  const index = selectedInterests.value.indexOf(value);
  if (index > -1) {
    selectedInterests.value.splice(index, 1);
  } else {
    selectedInterests.value.push(value);
  }
}

function goBack() {
  router.go(-1); // Volta (provavelmente para o Login)
}

function skip() {
  // Se pular, vai direto para a home
  router.push("/home");
}

async function handleContinue() {
  // Pega o token e o ID do usuário do "cofre"
  const token = authStore.token;
  const userId = authStore.user.id;

  if (!token || !userId) {
    console.error("Erro: Usuário não está logado para salvar interesses.");
    // Se algo der muito errado, manda para o login
    return router.push("/login");
  }

  console.log("Enviando interesses:", selectedInterests.value);

  try {
    const response = await fetch(
      `http://localhost:5000/users/${userId}/interests`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // O back-end precisa do token para o authMiddleware!
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ interests: selectedInterests.value }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log("Interesses salvos!", data.message);
      // Sucesso! Agora sim, vamos para a tela principal.
      router.push("/home");
    } else {
      console.error("Erro do servidor:", data.message);
    }
  } catch (error) {
    console.error("Erro de rede:", error);
  }
}
</script>

<style scoped>
.interests-container {
  /* Força o layout a ter 3 blocos (como no login) */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.skip-btn {
  color: #da327f;
  font-weight: bold;
}

.interest-chip {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid transparent !important;
  justify-content: start !important;
  padding-left: 16px !important;
}

/* Estilo do chip QUANDO SELECIONADO (Borda roxa + Fundo escuro) */
.interest-chip.v-chip--selected {
  background-color: #1a0a33 !important;
  color: white !important;
  /* Borda roxa sólida (como na sua foto) */
  border: 2px solid #a134d1 !important;
}

/* Estilo dos chips (etiquetas) */
.interest-chip {
  /* Cor do fundo do chip não selecionado */
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid transparent;
  margin: 8px 4px; /* Espaçamento */
}

/* Estilo do chip QUANDO SELECIONADO (v-chip--selected) */
.interest-chip.v-chip--selected {
  /* Fundo escuro */
  background-color: #1a0a33;
  color: white;

  /* A "borda" gradiente mágica */
  border: 2px solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(to right, #da327f, #a134d1);
}

/* Botão "Continue" (igual ao do login/register) */
.custom-gradient-btn {
  background: linear-gradient(to right, #da327f 0%, #a134d1 100%) !important;
  color: white !important;
  font-weight: bold;
  border-radius: 24px;
}
</style>
