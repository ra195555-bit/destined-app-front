<template>
  <v-container class="register-container pa-4">
    <v-row align="center" class="mb-4">
      <v-col cols="2">
        <v-btn icon="mdi-arrow-left" variant="text" @click="goBack"></v-btn>
      </v-col>
      <v-col cols="8" class="text-center">
        <h1 class="text-h5 font-weight-bold">Create Account</h1>
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>

    <v-row justify="center" class="mb-4">
      <v-col cols="auto">
        <div class="avatar-wrapper">
          <v-avatar size="120" color="rgba(255, 255, 255, 0.1)">
            <v-img
              v-if="profileImage"
              :src="imageUrl"
              alt="User Photo"
              cover
            ></v-img>
            <v-icon v-else size="60" color="rgba(255, 255, 255, 0.5)">
              mdi-account-outline
            </v-icon>
          </v-avatar>

          <v-btn
            class="camera-btn"
            icon="mdi-camera"
            size="small"
            color="#DA327F"
            @click="openFileDialog"
          >
          </v-btn>
          <input
            ref="fileInput"
            type="file"
            style="display: none"
            accept="image/*"
            @change="onFileChange"
          />
        </div>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-sheet class="pa-0 custom-sheet" elevation="0">
          <p class="form-label">Email</p>
          <v-text-field
            v-model="email"
            label="Enter your email"
            variant="solo"
            flat
            rounded="xl"
            density="comfortable"
            class="mb-4 custom-input"
          ></v-text-field>

          <p class="form-label">Password</p>
          <v-text-field
            v-model="password"
            label="Enter your password"
            type="password"
            variant="solo"
            flat
            rounded="xl"
            density="comfortable"
            class="mb-4 custom-input"
          ></v-text-field>

          <p class="form-label">Name</p>
          <v-text-field
            v-model="name"
            label="Enter your name"
            variant="solo"
            flat
            rounded="xl"
            density="comfortable"
            class="mb-4 custom-input"
          ></v-text-field>

          <p class="form-label">Date of Birthday</p>
          <v-text-field
            v-model="dateOfBirthday"
            label="DOB"
            type="date"
            variant="solo"
            flat
            rounded="xl"
            density="comfortable"
            class="mb-4 custom-input"
          ></v-text-field>

          <p class="form-label">I am</p>
          <v-radio-group v-model="gender" inline class="mb-4 custom-radio">
            <v-radio label="Man" value="homem"></v-radio>
            <v-radio label="Woman" value="mulher"></v-radio>
          </v-radio-group>

          <p class="form-label">I'm looking for</p>
          <v-radio-group v-model="preference" inline class="mb-4 custom-radio">
            <v-radio label="Man" value="homem"></v-radio>
            <v-radio label="Woman" value="mulher"></v-radio>
            <v-radio label="Everyone" value="todos"></v-radio>
          </v-radio-group>

          <v-btn
            block
            size="large"
            class="mt-6 custom-gradient-btn"
            @click="handleRegister"
          >
            Continue
          </v-btn>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

definePage({
  meta: {
    layout: "auth",
  },
});

const name = ref("");
const email = ref("");
const password = ref("");
const dateOfBirthday = ref("");
const gender = ref(null);
const preference = ref(null);
const profileImage = ref(null);
const fileInput = ref(null);

const router = useRouter();

function openFileDialog() {
  fileInput.value.click();
}

function onFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    profileImage.value = file;
  }
}

const imageUrl = computed(() => {
  return profileImage.value ? URL.createObjectURL(profileImage.value) : null;
});

// Função para o botão "Voltar"
function goBack() {
  router.go(-1); // Volta para a página anterior (Splash)
}

async function handleRegister() {
  const userData = {
    name: name.value,
    email: email.value,
    password: password.value,
    dateOfBirthday: dateOfBirthday.value,
    gender: gender.value,
    preference: preference.value,
  };

  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Sucesso!", data.message);
      router.push("/login");
    } else {
      console.error("Erro do servidor:", data.message);
    }
  } catch (error) {
    console.error("Erro de rede (servidor está rodando?):", error);
  }
}
</script>

<style scoped>
/* A folha de fundo é transparente, pois o fundo global já é roxo */
.custom-sheet {
  background-color: transparent !important;
}

/* Label (título) para cada campo do formulário */
.form-label {
  font-weight: bold;
  margin-bottom: 8px;
  color: white;
}

/* Estilo dos campos de texto (igual ao login) */
.custom-input :deep(.v-field__overlay) {
  background-color: rgba(255, 255, 255, 0.1);
}
.custom-input :deep(.v-field__outline) {
  border-style: none !important;
}
.custom-input :deep(.v-field__input) {
  color: white !important;
}
.custom-input :deep(.v-label.v-field-label) {
  color: rgba(255, 255, 255, 0.7) !important;
}
/* Cor do ícone de calendário no campo de data */
.custom-input :deep(input[type="date"]::-webkit-calendar-picker-indicator) {
  filter: invert(1);
}

/* Estilo dos botões de rádio */
.custom-radio :deep(.v-label) {
  color: white;
}
/* Cor da bolinha quando selecionada */
.custom-radio :deep(.v-radio .v-icon) {
  color: #da327f;
}

/* Botão com gradiente roxo/rosa e arredondado */
.custom-gradient-btn {
  background: linear-gradient(to right, #da327f 0%, #a134d1 100%) !important;
  color: white !important;
  font-weight: bold;
  border-radius: 24px;
}

.avatar-wrapper {
  position: relative;
  /* Precisa disso para o v-btn absoluto se alinhar
     ao avatar e não ao <v-col> */
  display: inline-block;
}

.camera-btn {
  position: absolute;
  bottom: 0;
  right: 0;

  /* Adiciona uma borda branca ao redor do botão
     para separá-lo do avatar, como na foto */
  border: 3px solid #1a0a33; /* Cor do fundo do app */
}
</style>
