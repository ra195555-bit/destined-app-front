<template>
  <v-container class="login-layout-container d-flex flex-column pa-4">
    <v-row class="flex-grow-0" align="center">
      <v-col cols="2">
        <v-btn icon="mdi-arrow-left" variant="text" @click="goBack"></v-btn>
      </v-col>
      <v-col cols="8" class="text-center">
        <h1 class="text-h5 font-weight-bold">Login</h1>
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>

    <v-spacer></v-spacer>

    <v-row class="flex-grow-0" justify="center">
      <v-col cols="12" class="text-center">
        <div class="title-wrapper">
          <h1 class="text-h4 font-weight-bold">Destined</h1>
          <v-icon class="heart-icon" color="#E73A5C">mdi-heart</v-icon>
        </div>
        <p class="text-subtitle-1 mt-2">Online Dating App</p>
      </v-col>
    </v-row>

    <v-spacer></v-spacer>

    <v-row class="flex-grow-0" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-sheet class="pa-0 custom-sheet" elevation="0">
          <v-text-field
            v-model="email"
            label="Email"
            variant="solo"
            flat
            rounded="xl"
            density="comfortable"
            class="mb-4 custom-input"
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            variant="solo"
            flat
            rounded="xl"
            density="comfortable"
            class="mb-4 custom-input"
          ></v-text-field>

          <div class="text-center mb-6">
            <p class="text-caption">
              Don't have an account?
              <router-link to="/register" class="signup-link"
                >Sign up</router-link
              >
            </p>
          </div>

          <v-btn
            block
            size="large"
            class="mt-4 custom-gradient-btn"
            @click="handleLogin"
          >
            Continue
          </v-btn>
        </v-sheet>
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

const email = ref("");
const password = ref("");

const router = useRouter();
const authStore = useAuthStore();

// Função para o botão "Voltar"
function goBack() {
  router.go(-1); // Volta para a página anterior (Splash)
}

async function handleLogin() {
  const formData = {
    email: email.value,
    password: password.value,
  };

  try {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Login bem-sucedido!", data);
      authStore.setAuthData(data.token, data.user);
      router.push("/interests");
    } else {
      console.error("Erro do servidor:", data.message);
    }
  } catch (error) {
    console.error("Erro de rede (servidor está rodando?):", error);
  }
}
</script>

<style scoped>
.custom-sheet {
  background-color: transparent !important;
}

.title-wrapper {
  position: relative;
  display: inline-block;
}

.heart-icon {
  position: absolute;
  top: -5px;
  left: 54%;
  font-size: 1.1rem;
}

/* 4. REVERTEMOS O CSS DO INPUT para o estilo simples */
.custom-input :deep(.v-field__overlay) {
  /* Fundo escuro semi-transparente */
  background-color: rgba(255, 255, 255, 0.1);
}
.custom-input :deep(.v-field__outline) {
  border-style: none !important; /* Sem borda */
}
.custom-input :deep(.v-field__input) {
  color: white !important; /* Texto branco */
}
.custom-input :deep(.v-label.v-field-label) {
  color: rgba(255, 255, 255, 0.7) !important; /* Label cinza claro */
}

/* 5. Botão com gradiente roxo/rosa e arredondado */
.custom-gradient-btn {
  /* Gradiente da imagem-alvo */
  background: linear-gradient(to right, #da327f 0%, #a134d1 100%) !important;
  color: white !important;
  font-weight: bold;
  border-radius: 24px; /* Arredondado como os inputs */
}

.signup-link {
  color: #da327f;
  text-decoration: none;
  font-weight: bold;
}

/* 6. A CORREÇÃO DE ALTURA */
.login-layout-container {
  min-height: 100vh;
}
</style>
