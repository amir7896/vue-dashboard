<script setup lang="ts">
import { computed } from "vue";

import { appRoutes } from "@/router/routes";
import { useAuthStore } from "@/stores/auth";
import type { Role } from "@/config/roles";

const authStore = useAuthStore();

const allowedMenuItems = computed(() => {
  const role = authStore.user?.role as Role | undefined;

  if (!role) {
    return [];
  }

  return appRoutes
    .filter((route) => {
      // Don't show routes that are not sidebar routes
      if (!route.meta?.sidebar?.show) {
        return false;
      }

      // If route has no roles, allow it
      if (!route.meta.roles) {
        return true;
      }

      // Only show route if current user has allowed role
      return route.meta.roles.includes(role);
    })
    .sort((a, b) => {
      return (a.meta?.sidebar?.order ?? 0) - (b.meta?.sidebar?.order ?? 0);
    });
});
</script>

<template>
  <aside class="min-h-screen w-64 bg-gray-900 p-5 text-white">
    <h1 class="mb-8 text-2xl font-bold">Vue Admin</h1>

    <nav class="space-y-2">
      <RouterLink
        v-for="item in allowedMenuItems"
        :key="String(item.name)"
        :to="item.path"
        class="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-300 transition-colors duration-200 hover:bg-gray-800 hover:text-white"
        exact-active-class="bg-blue-600 text-white"
      >
        <component
          v-if="item.meta?.sidebar?.icon"
          :is="item.meta.sidebar.icon"
          :size="20"
        />

        <span>
          {{ item.meta?.sidebar?.label }}
        </span>
      </RouterLink>
    </nav>
  </aside>
</template>
