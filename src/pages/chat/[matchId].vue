<template>
  <v-container class="d-flex flex-column fill-height pa-0">
    <v-app-bar color="#1A0A33" density="compact" flat>
      <v-btn icon="mdi-arrow-left" @click="router.go(-1)"></v-btn>
      <v-avatar class="ml-2" size="36">
        <v-img v-if="matchUser?.photos?.[0]" :src="matchUser.photos[0]"></v-img>
        <v-icon v-else icon="mdi-account-outline"></v-icon>
      </v-avatar>
      <v-toolbar-title class="ml-2">{{
        matchUser?.name || "..."
      }}</v-toolbar-title>
    </v-app-bar>

    <v-container class="flex-grow-1 overflow-y-auto pa-4">
      <div v-if="isLoading" class="text-center">
        <v-progress-circular
          indeterminate
          color="#DA327F"
        ></v-progress-circular>
      </div>

      <div v-else>
        <div
          v-for="msg in messages"
          :key="msg._id"
          :class="
            isMyMessage(msg.senderId)
              ? 'd-flex justify-end'
              : 'd-flex justify-start'
          "
          class="mb-4"
        >
          <v-sheet
            :class="isMyMessage(msg.senderId) ? 'my-message' : 'their-message'"
            rounded="lg"
            elevation="2"
            class="pa-3"
            style="max-width: 75%"
          >
            {{ msg.content }}
          </v-sheet>
        </div>
      </div>
    </v-container>

    <v-row class="flex-grow-0 pa-2" align="center">
      <v-col>
        <v-text-field
          v-model="newMessage"
          label="Digite sua mensagem..."
          variant="solo"
          rounded="xl"
          flat
          density="compact"
          hide-details
          class="chat-input"
          @keydown.enter="handleSendMessage"
        ></v-text-field>
      </v-col>
      <v-col cols="auto">
        <v-btn
          icon="mdi-send"
          color="#DA327F"
          @click="handleSendMessage"
          :loading="isSending"
        ></v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.js";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const matchId = ref(route.params.matchId);
const messages = ref([]);
const newMessage = ref("");
const isLoading = ref(true);
const isSending = ref(false);
const matchUser = ref(null);

// Checa se o ID do remetente é o *nosso* ID
const isMyMessage = (senderId) => {
  return senderId === authStore.user.id;
};

onMounted(() => {
  console.log("Chat page mounted.");
  console.log("authStore.user:", authStore.user);
  console.log("matchId:", matchId.value);
  fetchMessages();
  fetchMatchUser();
});

async function fetchMatchUser() {
  const token = authStore.token;
  if (!token) return;

  try {
    const response = await fetch(
      `https://destined-app-back.onrender.com/matches/${matchId.value}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const match = await response.json();
      const otherUserId =
        match.userOneId.toString() === authStore.user.id
          ? match.userTwoId
          : match.userOneId;

      const userResponse = await fetch(
        `https://destined-app-back.onrender.com/users/${otherUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (userResponse.ok) {
        const { user } = await userResponse.json();
        matchUser.value = {
          ...user,
          photos: user.photos
            ? user.photos.map(
                (p) => `https://destined-app-back.onrender.com/${p}`
              )
            : [],

    
        };
      }
    }
  } catch (error) {
    console.error("Erro ao buscar dados do match:", error);
  }
}

// Busca o histórico de mensagens
async function fetchMessages() {
  isLoading.value = true;
  const token = authStore.token;
  if (!token) {
    router.push("/login");
    return;
  }

  try {
    const response = await fetch(
      `https://destined-app-back.onrender.com/matches/${matchId.value}/messages`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    console.log("Fetched messages:", data);
    if (response.ok) {
      messages.value = data;
    } else {
      console.error("Erro ao buscar mensagens:", data.message);
    }
  } catch (error) {
    console.error("Erro de rede (fetchMessages):", error);
  } finally {
    isLoading.value = false;
  }
}

async function handleSendMessage() {
  if (newMessage.value.trim() === "") return;

  isSending.value = true;
  const token = authStore.token;
  const content = newMessage.value;

  newMessage.value = "";

  try {
    const response = await fetch(
      `https://destined-app-back.onrender.com/matches/${matchId.value}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: content }),
      }
    );

    const newMsgData = await response.json();

    if (response.ok) {
      messages.value.push(newMsgData);
    } else {
      console.error("Erro ao enviar mensagem:", newMsgData.message);
      newMessage.value = content;
    }
  } catch (error) {
    console.error("Erro de rede (handleSendMessage):", error);
    newMessage.value = content;
  } finally {
    isSending.value = false;
  }
}
</script>

<style>
/* Cor do balão das "nossas" mensagens (direita) */
.my-message {
  background-color: #da327f;
  color: white;
}
/* Cor do balão das "deles" (esquerda) */
.their-message {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
}
/* Cor do campo de digitação */
.chat-input .v-field {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: white;
}
</style>
