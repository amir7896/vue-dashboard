<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const isLoggedIn = computed(() => {
  return !!authStore.token;
});

const handleLogout = () => {
  authStore.logout();

  router.push("/login");
};
</script>

<template>
  <nav class="flex h-16 items-center justify-between bg-white px-6 shadow">
    <h2 class="text-xl font-semibold">Dashboard</h2>

    <div v-if="isLoggedIn" class="flex items-center gap-4">
      <p class="font-medium text-gray-700">
        {{ authStore.user?.userName }}
      </p>

      <button
        @click="handleLogout"
        class="cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-red-600"
      >
        Logout
      </button>
    </div>

    <div v-else class="flex items-center gap-3">
      <RouterLink
        to="/login"
        class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
      >
        Login
      </RouterLink>

      <RouterLink
        to="/register"
        class="rounded-lg border border-blue-600 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
      >
        Register
      </RouterLink>
    </div>
  </nav>
</template>
