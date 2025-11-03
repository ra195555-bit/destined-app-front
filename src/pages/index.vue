<template>
  <Splash />
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import Splash from "@/components/Splash.vue";

definePage({
  meta: {
    layout: "auth",
  },
});

const router = useRouter();
</script>
