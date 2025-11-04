<template>
  <v-container class="pa-4">
    <v-row align="center" class="mb-4">
      <v-col cols="2">
        <v-btn icon="mdi-arrow-left" variant="text" @click="goBack"></v-btn>
      </v-col>
      <v-col cols="8" class="text-center">
        <h1 class="text-h5 font-weight-bold">Profile Details</h1>
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>
    <p class="text-subtitle-1 text-grey-lighten-1 text-center mb-4">
      Fill up the following details
    </p>

    <v-row justify="center" class="mb-4">
      <v-col cols="auto">
        <div class="avatar-wrapper">
          <v-avatar size="120" color="rgba(255, 255, 255, 0.1)">
            <v-img
              v-if="imageUrl"
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
          <p class="form-label">Nome Completo (Não pode ser alterado)</p>
          <v-text-field
            v-model="name"
            label="Seu nome completo"
            variant="solo"
            flat
            rounded="xl"
            density="comfortable"
            class="mb-4 custom-input"
          ></v-text-field>

          <p class="form-label">Email (Não pode ser alterado)</p>
          <v-text-field
            v-model="email"
            label="Seu email"
            variant="solo"
            flat
            rounded="xl"
            density="comfortable"
            class="mb-4 custom-input"
            disabled
          ></v-text-field>

          <p class="form-label">Data de Nascimento (Não pode ser alterado)</p>
          <v-text-field
            v-model="dateOfBirthday"
            type="date"
            variant="solo"
            flat
            rounded="xl"
            density="comfortable"
            class="mb-4 custom-input"
          ></v-text-field>

          <p class="form-label">Eu procuro por</p>
          <v-radio-group v-model="preference" inline class="mb-4 custom-radio">
            <v-radio label="Homem" value="homem"></v-radio>
            <v-radio label="Mulher" value="mulher"></v-radio>
            <v-radio label="Todos" value="todos"></v-radio>
          </v-radio-group>

          <v-btn
            block
            size="large"
            class="mt-6 custom-gradient-btn"
            @click="handleSave"
          >
            Salvar e Continuar
          </v-btn>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.js";

const router = useRouter();
const authStore = useAuthStore();

// "Caixinhas" para os dados do formulário
const name = ref("");
const email = ref("");
const dateOfBirthday = ref("");
const preference = ref(null);
const userPhotos = ref([]);
const fileInput = ref(null);
const profileImage = ref(null);

const imageUrl = computed(() => {
  if (profileImage.value) {
    return URL.createObjectURL(profileImage.value);
  }
  if (userPhotos.value.length > 0) {
    return userPhotos.value[0];
  }
  return null;
});

/**
 * Converte uma data (string ou Date) para o formato YYYY-MM-DD,
 * que é o único que o <input type="date"> aceita.
 */
function formatDateForInput(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    // toISOString() retorna "2025-11-01T20:30:00.000Z"
    // .split('T')[0] pega só o "2025-11-01"
    return date.toISOString().split("T")[0];
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "";
  }
}

// Quando a página é montada, preenchemos o formulário
onMounted(() => {
  if (authStore.user) {
    name.value = authStore.user.name;
    email.value = authStore.user.email;
    preference.value = authStore.user.preference;

    dateOfBirthday.value = formatDateForInput(authStore.user.dateOfBirthday);

    userPhotos.value = authStore.user.photos
      ? authStore.user.photos.map((p) => `/api/${p}`)
      : [];
  } else {
    router.push("/login");
  }
});

function goBack() {
  router.push("/home");
}

function openFileDialog() {
  fileInput.value.click();
}

function onFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    profileImage.value = file;
    handleImageUpload();
  }
}

async function handleImageUpload() {
  const token = authStore.token;
  if (!token || !authStore.user || !authStore.user.id || !profileImage.value) {
    return;
  }

  const userId = authStore.user.id;
  const formData = new FormData();
  formData.append("profileImage", profileImage.value);

  try {
    const response = await fetch(
      `https://destined-app-back.onrender.com/api/users/${userId}/profile-image`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log("Foto de perfil atualizada!", data.message);
      authStore.setAuthData(token, data.user);
      userPhotos.value = data.user.photos
        ? data.user.photos.map((p) => `/api/${p}`)
        : [];
      profileImage.value = null;
    } else {
      console.error("Erro ao atualizar foto de perfil:", data.message);
    }
  } catch (error) {
    console.error("Erro de rede (handleImageUpload):", error);
  }
}

async function handleSave() {
  const token = authStore.token;

  // Checagem de segurança
  if (!token || !authStore.user || !authStore.user.id) {
    console.error("Erro: Usuário não está logado para salvar.");
    return router.push("/login");
  }

  const userId = authStore.user.id;
  const newPreference = preference.value;

  console.log("Salvando nova preferência:", newPreference);

  try {
    const response = await fetch(`/users/${userId}/preference`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ preference: newPreference }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Preferência salva!", data.message);
      authStore.setAuthData(token, data.user);
      router.push("/home");
    } else {
      console.error("Erro ao salvar:", data.message);
    }
  } catch (error) {
    console.error("Erro de rede (handleSave):", error);
  }
}
</script>

<style scoped>
/* Copiamos os estilos que já funcionam do seu register.vue */
.custom-sheet {
  background-color: transparent !important;
}
.form-label {
  font-weight: bold;
  margin-bottom: 8px;
  color: white;
}
.custom-input :deep(.v-field__overlay) {
  background-color: rgba(255, 255, 255, 0.1);
}
.custom-input :deep(.v-field__outline) {
  border-style: none !important;
}
.custom-input :deep(.v-field__input) {
  color: white !important;
}
/* Cor do texto desabilitado (para o email) */
.custom-input :deep(.v-field--disabled .v-field__input) {
  color: rgba(255, 255, 255, 0.5) !important;
}
.custom-input :deep(.v-label.v-field-label) {
  color: rgba(255, 255, 255, 0.7) !important;
}
.custom-input :deep(input[type="date"]::-webkit-calendar-picker-indicator) {
  filter: invert(1);
}
.custom-radio :deep(.v-label) {
  color: white;
}
.custom-radio :deep(.v-radio .v-icon) {
  color: #da327f;
}
.custom-gradient-btn {
  background: linear-gradient(to right, #da327f 0%, #a134d1 100%) !important;
  color: white !important;
  font-weight: bold;
  border-radius: 24px;
}
.avatar-wrapper {
  position: relative;
  display: inline-block;
}
.camera-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  border: 3px solid #1a0a33;
}
</style>
