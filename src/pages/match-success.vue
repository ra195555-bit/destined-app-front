<template>
  <v-sheet class="match-dialog-sheet d-flex flex-column pa-4">
    <div class="flex-grow-1 d-flex flex-column align-center justify-center">
      <div class="avatars-container">
        <v-avatar color="#6A1B9A" size="120" class="avatar-left"> </v-avatar>
        <v-avatar color="#D81B60" size="120" class="avatar-right"> </v-avatar>
        <v-icon class="heart-icon">mdi-heart</v-icon>
      </div>

      <h1 class="congrats-title mt-8">Congrats!</h1>
      <p class="match-subtitle">It's a Match!</p>
      <p class="match-text">{{ theirName }} & You both liked each other</p>
    </div>

    <div class="flex-grow-0 w-100">
      <v-btn
        block
        size="large"
        variant="text"
        class="start-conversation-btn mb-2"
        @click="goToChat"
      >
        <v-icon left class="mr-2">mdi-message-text</v-icon>
        Start Conversation
      </v-btn>
      <v-btn
        block
        size="large"
        variant="text"
        class="keep-dating-btn"
        @click="keepSwiping"
      >
        Keep Dating
      </v-btn>
    </div>
  </v-sheet>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const matchId = ref(route.query.matchId || "");
const theirName = ref(route.query.theirName || "");

function keepSwiping() {
  router.push("/home");
}

function goToChat() {
  router.push(`/chat/${matchId.value}`);
}
</script>

<style scoped>
.match-dialog-sheet {
  background: radial-gradient(
    circle,
    #2d1450 0%,
    #0f051e 70%,
    #05000a 100%
  ) !important;
  color: white;
  height: 100vh;
}

.avatars-container {
  position: relative;
  width: 200px;
  height: 120px;
}

.avatar-left {
  position: absolute;
  left: 0;
  border: 3px solid white;
}

.avatar-right {
  position: absolute;
  right: 0;
  border: 3px solid white;
}

.heart-icon {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 40px;
  color: #d81b60;
}

.congrats-title {
  font-size: 2.5rem;
  font-weight: bold;
}

.match-subtitle {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
}

.match-text {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
}

.start-conversation-btn {
  color: #ffc107;
  font-weight: bold;
}

.keep-dating-btn {
  background: -webkit-linear-gradient(left, #da327f, #a134d1);
  font-weight: bold;
}
</style>
