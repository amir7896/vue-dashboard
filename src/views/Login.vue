<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import { useForm } from "vee-validate";
import { useToast } from "vue-toastification";
import { Eye, EyeOff } from "lucide-vue-next";
import axios from "axios";
import { getRoleHomeRoute, type Role } from "@/config/roles";
import { post } from "@/api/axios";
import { useAuthStore } from "@/stores/auth";
import { loginSchema } from "@/validations/auth.validation";
import type { LoginData, LoginResponse } from "@/types/auth";

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const showPassword = ref(false);

const { defineField, handleSubmit, errors } = useForm<LoginData>({
  validationSchema: loginSchema,
});

const [email, emailAttrs] = defineField("email", {
  validateOnModelUpdate: false,
});

const [password, passwordAttrs] = defineField("password", {
  validateOnModelUpdate: false,
});

const loginMutation = useMutation({
  mutationFn: (data: LoginData) => {
    return post<LoginResponse, LoginData>("/auth/login", data);
  },

  onSuccess: (data) => {
    authStore.setAuth(data.user, data.accessToken);
    toast.success("Login successful");

    router.push({
      name: getRoleHomeRoute(data.user.role as Role),
    });
  },

  onError: (error) => {
    let message = "Login failed. Please try again.";
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || message;
    }

    toast.error(message);
  },
});

const onSubmit = handleSubmit((values) => {
  loginMutation.mutate(values);
});
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900">Login</h1>
      </div>

      <form @submit="onSubmit" class="space-y-5">
        <div>
          <label
            for="email"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Email
          </label>

          <input
            id="email"
            v-model="email"
            v-bind="emailAttrs"
            type="email"
            placeholder="Enter your email"
            class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          <p v-if="errors.email" class="mt-1 text-sm text-red-500">
            {{ errors.email }}
          </p>
        </div>

        <div>
          <label
            for="password"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Password
          </label>

          <div class="relative">
            <input
              id="password"
              v-model="password"
              v-bind="passwordAttrs"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
              @click="showPassword = !showPassword"
            >
              <EyeOff v-if="showPassword" :size="20" />

              <Eye v-else :size="20" />
            </button>
          </div>

          <p v-if="errors.password" class="mt-1 text-sm text-red-500">
            {{ errors.password }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="loginMutation.isPending.value"
          class="w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ loginMutation.isPending.value ? "Logging in..." : "Login" }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-gray-600">
        Don't have an account?

        <RouterLink
          to="/register"
          class="cursor-pointer font-semibold text-blue-600 hover:underline"
        >
          Register
        </RouterLink>
      </p>
    </div>
  </div>
</template>
