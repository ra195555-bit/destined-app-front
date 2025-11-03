<template>
  <v-app>
    <v-main> <router-view /> </v-main>

    <v-bottom-navigation v-model="activeTab" grow color="primary">
      <v-btn value="home" @click="router.push('/home')">
        <v-icon>mdi-cards-playing-heart</v-icon>
        <span>Discovery</span>
      </v-btn>

      <v-btn value="liked-you" @click="router.push('/liked-you')">
        <v-icon>mdi-heart-multiple</v-icon>
        <span>Liked You</span>
      </v-btn>

      <v-btn value="matches" @click="router.push('/matches')">
        <v-icon>mdi-message-text</v-icon>
        <span>Matches</span>
      </v-btn>

      <v-btn value="profile" @click="router.push('/profile')">
        <v-icon>mdi-account-circle</v-icon>
        <span>Profile</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const activeTab = ref("home");
</script>

<style scoped>
.v-bottom-navigation {
  background-color: #1a0a33;
}
</style>
