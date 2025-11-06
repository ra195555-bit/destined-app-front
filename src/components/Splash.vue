<template>
  <v-sheet class="splash-screen">
    <img
      src="@/assets/Group-1937.svg"
      alt="App Background"
      class="background-svg"
    />

    <div class="text-block">
      <div class="title-wrapper">
        <h1 class="text-h3 font-weight-bold">Destined</h1>
        <v-icon class="heart-icon" color="#E73A5C">mdi-heart</v-icon>
      </div>
      <p class="text-subtitle-1 mt-2">Online Dating App</p>
    </div>

    <v-btn
      class="get-started-btn"
      size="large"
      append-icon="mdi-arrow-right"
      @click="goToRegister"
    >
      Get Started
    </v-btn>
  </v-sheet>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
function goToRegister() {
  console.log("Botão Get Started clicado, navegando para /register");
  router.push("/register");
}
</script>

<style scoped>
.splash-screen {
  background: radial-gradient(
    circle,
    rgba(45, 20, 80, 1) 0%,
    rgba(15, 5, 30, 1) 70%,
    rgba(5, 0, 10, 1) 100%
  );
  position: relative;
  overflow: hidden;
  height: 100vh;
}

.background-svg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 500px;
  height: auto;
  z-index: 0;
}

/*  Bloco de Texto (Perfeitamente Centrado) */
.text-block {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  text-align: center;
  width: 90%;
}

/* Estilo do Título e Ícone */
.title-wrapper {
  position: relative;
  display: inline-block;
}
.heart-icon {
  position: absolute;
  top: 1px;
  left: 50%;
  font-size: 1.1rem;
}

/* Estilo do Botão (Absoluto na Base) */
.get-started-btn {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  font-size: 1.2rem;
  font-weight: bold;
  background: linear-gradient(to right, #dd3562 0%, #8354ff 100%);
  color: white;
}
</style>
