<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import Sidebar from "@/components/Sidebar.vue";
import Navbar from "@/components/Navbar.vue";

const route = useRoute();

const requiresAuth = computed(() => {
  return route.meta.requiresAuth === true;
});
</script>

<template>
  <!-- Authenticated pages -->
  <div v-if="requiresAuth" class="flex min-h-screen bg-gray-100">
    <Sidebar />

    <div class="flex-1">
      <Navbar />

      <main class="p-6">
        <RouterView />
      </main>
    </div>
  </div>

  <!-- Login / Register -->
  <RouterView v-else />
</template>
