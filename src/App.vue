<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
//
</script>

<style scoped>
.v-application {
  background: radial-gradient(
    circle,
    rgba(45, 20, 80, 1) 0%,
    rgba(15, 5, 30, 1) 70%,
    rgba(5, 0, 10, 1) 100%
  ) !important;
  color: white !important;
}

.v-main {
  min-height: 100vh;
}
</style>
