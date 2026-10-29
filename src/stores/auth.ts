import { defineStore } from "pinia";
import { ref } from "vue";
import type { Role } from "@/config/roles";
import { disconnectSocket } from "@/socket/socket";

interface User {
  userId: string;
  userName: string;
  email: string;
  role: Role;
  isVerified: boolean;
}

export const useAuthStore = defineStore("auth", () => {
  const savedUser = localStorage.getItem("user");

  const user = ref<User | null>(savedUser ? JSON.parse(savedUser) : null);

  const token = ref<string | null>(localStorage.getItem("token"));

  const setAuth = (userData: User, accessToken: string) => {
    user.value = userData;
    token.value = accessToken;

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", accessToken);
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    disconnectSocket();

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return {
    user,
    token,
    setAuth,
    logout,
  };
});
