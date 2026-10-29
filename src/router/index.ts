import { createRouter, createWebHistory } from "vue-router";

import { appRoutes } from "./routes";

import { getRoleHomeRoute, type Role } from "@/config/roles";

interface StoredUser {
  role: Role;
}

const router = createRouter({
  history: createWebHistory(),
  routes: appRoutes,
});

const getStoredUser = (): StoredUser | null => {
  const savedUser = localStorage.getItem("user");

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser) as StoredUser;
  } catch {
    localStorage.removeItem("user");

    return null;
  }
};

router.beforeEach((to) => {
  const token = localStorage.getItem("token");
  const user = getStoredUser();

  // Protected route without authentication
  if (to.meta.requiresAuth && !token) {
    return {
      name: "login",
    };
  }

  // Logged-in user trying to visit login/register
  if (to.meta.guestOnly && token && user) {
    return {
      name: getRoleHomeRoute(user.role),
    };
  }

  // Check role permission
  const allowedRoles = to.meta.roles;

  if (
    to.meta.requiresAuth &&
    allowedRoles &&
    user &&
    !allowedRoles.includes(user.role)
  ) {
    return {
      name: getRoleHomeRoute(user.role),
    };
  }
});

export default router;
