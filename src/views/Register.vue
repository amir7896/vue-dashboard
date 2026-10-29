<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import { useForm } from "vee-validate";
import { useToast } from "vue-toastification";
import { Eye, EyeOff } from "lucide-vue-next";
import axios from "axios";
import { post } from "@/api/axios";
import { registerSchema } from "@/validations/auth.validation";

import type {
  RegisterFormData,
  RegisterData,
  RegisterResponse,
} from "@/types/auth";

const router = useRouter();
const toast = useToast();

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const { defineField, handleSubmit, errors } = useForm<RegisterFormData>({
  validationSchema: registerSchema,
});

const [name, nameAttrs] = defineField("name");
const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");
const [confirmPassword, confirmPasswordAttrs] = defineField("confirmPassword");

const registerMutation = useMutation({
  mutationFn: (data: RegisterData) => {
    return post<RegisterResponse, RegisterData>("/auth/register", data);
  },

  onSuccess: (data) => {
    toast.success(data.message || "Account created successfully");

    router.push("/login");
  },

  onError: (error) => {
    let message = "Registration failed. Please try again.";

    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || message;
    }

    toast.error(message);
  },
});

const onSubmit = handleSubmit((values) => {
  registerMutation.mutate({
    userName: values.name,
    email: values.email,
    password: values.password,
  });
});
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10"
  >
    <div class="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900">Create Account</h1>
      </div>

      <form @submit="onSubmit" class="space-y-5">
        <!-- Name -->
        <div>
          <label
            for="name"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Name
          </label>

          <input
            id="name"
            v-model="name"
            v-bind="nameAttrs"
            type="text"
            placeholder="Enter your name"
            class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          <p v-if="errors.name" class="mt-1 text-sm text-red-500">
            {{ errors.name }}
          </p>
        </div>

        <!-- Email -->
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

        <!-- Password -->
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

        <!-- Confirm Password -->
        <div>
          <label
            for="confirmPassword"
            class="mb-2 block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>

          <div class="relative">
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              v-bind="confirmPasswordAttrs"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirm your password"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <EyeOff v-if="showConfirmPassword" :size="20" />

              <Eye v-else :size="20" />
            </button>
          </div>

          <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-500">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="registerMutation.isPending.value"
          class="w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{
            registerMutation.isPending.value
              ? "Creating account..."
              : "Register"
          }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-gray-600">
        Already have an account?

        <RouterLink
          to="/login"
          class="cursor-pointer font-semibold text-blue-600 hover:underline"
        >
          Login
        </RouterLink>
      </p>
    </div>
  </div>
</template>
