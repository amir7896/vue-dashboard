import type { RouteRecordRaw, RouteMeta } from "vue-router";

import type { Component } from "vue";

import {
  LayoutDashboard,
  Users,
  Settings,
  Package,
  User,
  MessageCircle,
} from "lucide-vue-next";

import { ROLES, type Role } from "@/config/roles";

declare module "vue-router" {
  interface RouteMeta {
    title?: string;
    requiresAuth?: boolean;
    guestOnly?: boolean;
    roles?: Role[];

    sidebar?: {
      show: boolean;
      label: string;
      icon: Component;
      order: number;
    };
  }
}

export const appRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "dashboard",
    component: () => import("@/views/Dashboard.vue"),

    meta: {
      title: "Dashboard",
      requiresAuth: true,
      roles: [ROLES.USER],

      sidebar: {
        show: true,
        label: "Dashboard",
        icon: LayoutDashboard,
        order: 1,
      },
    },
  },

  {
    path: "/users",
    name: "users",
    component: () => import("@/views/Users.vue"),

    meta: {
      title: "Users",
      requiresAuth: true,
      roles: [ROLES.ADMIN],

      sidebar: {
        show: true,
        label: "Users",
        icon: Users,
        order: 1,
      },
    },
  },

  {
    path: "/settings",
    name: "settings",
    component: () => import("@/views/Settings.vue"),

    meta: {
      title: "Settings",
      requiresAuth: true,
      roles: [ROLES.ADMIN],

      sidebar: {
        show: true,
        label: "Settings",
        icon: Settings,
        order: 3,
      },
    },
  },

  {
    path: "/products",
    name: "products",
    component: () => import("@/views/Products.vue"),

    meta: {
      title: "Products",
      requiresAuth: true,
      roles: [ROLES.ADMIN, ROLES.USER],

      sidebar: {
        show: true,
        label: "Products",
        icon: Package,
        order: 2,
      },
    },
  },

  {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/Profile.vue"),

    meta: {
      title: "Profile",
      requiresAuth: true,
      roles: [ROLES.USER],

      sidebar: {
        show: true,
        label: "Profile",
        icon: User,
        order: 3,
      },
    },
  },

  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),

    meta: {
      title: "Login",
      guestOnly: true,
    },
  },

  {
    path: "/register",
    name: "register",
    component: () => import("@/views/Register.vue"),

    meta: {
      title: "Register",
      guestOnly: true,
    },
  },
  {
    path: "/chat",
    name: "chat",

    component: () => import("@/views/Chat.vue"),

    meta: {
      title: "Chat",
      requiresAuth: true,

      roles: [ROLES.ADMIN, ROLES.USER],

      sidebar: {
        show: true,
        label: "Chat",
        icon: MessageCircle,
        order: 4,
      },
    },
  },
];
